const {onRequest} = require("firebase-functions/v2/https");

const express = require("express");
const helmet = require("helmet"); // Security headers
const cors = require("cors"); // Restrict origins
const rateLimit = require("express-rate-limit"); // Limit requests
const dotenv = require("dotenv");
const morgan = require("morgan"); // Logging
const xss = require("xss-clean"); // Prevent XSS attacks
const hpp = require("hpp"); // Prevent HTTP Parameter Pollution
const compression = require("compression"); // Reduce response size
const mysql = require("mysql2/promise");
const bcrypt = require("bcrypt");

dotenv.config();
const app = express();

// MySQL Connection
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Security Middleware
app.use(helmet());
app.use(xss());
app.use(hpp());
app.use(compression());

// Logging
app.use(morgan("combined"));

// CORS (Restrict to allowed domains)
const corsOptions = {
  origin: ["http://localhost:5173"],
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));

// Rate Limiting (prevent DDoS attacks)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Max 100 requests per window per IP
  message: "Too many requests, please try again later.",
});
app.use(limiter);

// Parse JSON and URL-encoded data
app.use(express.json({limit: "10kb"}));
app.use(express.urlencoded({extended: true}));

// Routes
// Parse JSON and URL-encoded data
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.post("/login", async (req, res) => {
  try {
    const {email, password} = req.body;
    const [rows] = await db.query(
      "SELECT * FROM users WHERE email = ?",
      [email],
    );

    if (rows.length === 0) {
      return res.status(401).json({error: "Invalid email or password"});
    }

    const isMatch = await bcrypt.compare(password, rows[0].password);
    if (!isMatch) {
      return res.status(401).json({error: "Invalid email or password"});
    }

    return res.status(200).json({message: "Login successful"});
  } catch (error) {
    console.error("Error in /login route:", error);
    return res.status(500).json({error: "Internal server error"});
  }
});

app.get("/project/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const [rows] = await db.query(
      "SELECT * FROM projects WHERE id = ?",
      [id],
    );

    if (rows.length === 0) {
      return res.status(404).json({error: "Project id not found"});
    }
    return res.status(200).json(rows);
  } catch (error) {
    console.error("Error in /project route:", error);
    return res.status(500).json({error: "Internal server error"});
  }
});

app.post("/project/create/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const {name, password} = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.execute(
      "INSERT INTO projects (id, name, password) VALUES (?, ?, ?)",
      [id, name, hashedPassword]
    );

    return res.status(201).json({message: "Project created successfully"});
  } catch (error) {
    console.error("Error in /project/create route:", error);
    return res.status(500).json({error: "Internal server error"});
  }
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({message: "Not Found"});
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Error:", err.stack);
  res.status(500).json({message: "Something went wrong!"});
});

// Export for Firebase Cloud Functions
exports.api = onRequest(app);
