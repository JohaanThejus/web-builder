import { useState } from "react";
import Toggle from "./Toggle";
import Tree from "./Tree";
import Workspace from "./Workspace";

function ControlPanel() {
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

export default ControlPanel;