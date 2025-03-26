import { useRef } from "react";
import { invoke } from "@tauri-apps/api/core";
import * as windowAPI from "@tauri-apps/api/window";
console.log(windowAPI);


function NewProject() {
  const input = useRef<HTMLInputElement>(null);
  const password = useRef<HTMLInputElement>(null);

  const setProject = async () => {
  
    const projectName = input.current?.value || "My new Project";
    const projectPassword = password.current?.value || "password is required";
  
    try {
      await invoke("save_project", { name: projectName, password: projectPassword });
      console.log("Project saved successfully.");

    } catch (error) {
      console.error("Error saving project:", error);
    }
  };

  return (
    <div>
      <input ref={input} type="text" placeholder="Project Name" />
      <input ref={password} type="password" placeholder="Password" />
      <button onClick={setProject}>Create</button>
    </div>
  );
}

export default NewProject;
