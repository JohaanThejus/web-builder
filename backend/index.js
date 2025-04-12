const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const dotenv = require("dotenv");
const morgan = require("morgan");
const xss = require("xss-clean");
const hpp = require("hpp");
const compression = require("compression");
const mysql = require("mysql2/promise");
const bcrypt = require("bcrypt");

dotenv.config();
const app = express();

// ✅ MySQL Database Connection
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME, // ✅ TiDB Cloud default port
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// ✅ Test Database Connection at Startup
async function testDBConnection() {
  try {
    const [rows] = await db.query("SELECT 1");
    console.log("✅ Database Connected Successfully:", rows);
  } catch (error) {
    console.error("❌ Database Connection Error:", error.message);
  }
}
testDBConnection();

// ✅ Security Middleware
app.use(helmet());
app.use(xss());
app.use(hpp());
app.use(compression());

// ✅ Logging
app.use(morgan("combined"));

// ✅ CORS (Allow Frontend Access)
const corsOptions = {
  origin: ["http://localhost:5173"],
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));

// ✅ Rate Limiting (Prevent DDoS)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: "Too many requests, please try again later.",
});
app.use(limiter);

// ✅ Parse JSON Requests
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));

// ✅ User Login Route
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);

    if (rows.length === 0) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, rows[0].password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    return res.status(200).json({ message: "Login successful" });
  } catch (error) {
    console.error("❌ Error in /login:", error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// ✅ Get Project by ID
app.get("/project/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const [rows] = await db.query("SELECT * FROM projects WHERE id = ?", [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "Project ID not found" });
    }
    return res.status(200).json(rows);
  } catch (error) {
    console.error("❌ Error in /project:", error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// ✅ Create a New Project
app.post("/project/create", async (req, res) => {
  try {
    const { id, name, password } = req.body;
    if (!id || !name || !password) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await db.execute("INSERT INTO projects (id, name, password) VALUES (?, ?, ?)", [id, name, hashedPassword]);

    return res.status(201).json({ message: "Project created successfully" });
  } catch (error) {
    console.error("❌ Error in /project/create:", error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// ✅ Test Database Connection Route
app.get("/test-db", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT 1");
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error("❌ Database Connection Failed:", err.message);
    res.status(500).json({ success: false, message: "Database connection failed" });
  }
});

// ✅ 404 Handler
app.use((req, res) => {
  res.status(404).json({ message: "Not Found" });
});

// ✅ Global Error Handler
app.use((err, req, res, next) => {
  console.error("❌ Global Error:", err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

// ✅ Start Server
const PORT = process.env.PORT || 8080; // ✅ Railway uses dynamic port
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
