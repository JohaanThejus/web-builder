import { Window } from "@tauri-apps/api/window";
import "./App.css";

function App() {
  const newProject = () => {
    console.log("New Project");
  };

  return (
    <>
      <button onClick={newProject}>New Project</button>
    </>
  );
}

export default App;
