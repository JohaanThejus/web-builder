import { useState } from "react";
import Workspace from "./components/Workspace";
import Tree from "./components/Tree";
import Toggle from "./components/Toggle";

function App() {
  const [theme, setTheme] = useState(false); // false = light, true = dark

  return (
    <div style={{ display: "flex", width: "100vw", height: "100vh", position: "relative" }}>
      <Tree theme={theme} />
      <Workspace theme={theme} />
      
      <div style={{ position: "absolute", top: "10px", right: "10px" }}>
        <Toggle theme={theme} onClick={() => setTheme(!theme)} />
      </div>
    </div>
  );
}

export default App;
