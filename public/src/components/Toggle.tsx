import  { useState } from "react";
import "../../sass/toggle.scss";

function Toggle() {
  const [isOn, setIsOn] = useState(false);
  return (
    <button 
      className={`toggle-btn ${isOn ? "active" : ""}`} 
      onClick={() => setIsOn(!isOn)}
    >
      <span className="toggle-circle"></span>
    </button>
  );
}

export default Toggle;
