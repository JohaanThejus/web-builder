// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn save_project(name: &str, password: &str) {
    println!("Saving project: {}, with password: {}", name, password);

    // TODO: Implement actual save logic (file, database, etc.)
    // Example: Save to a local JSON file:
    use std::fs::OpenOptions;
    use std::io::Write;

    let project_data = format!("{{\"name\": \"{}\", \"password\": \"{}\"}}\n", name, password);

    let mut file = OpenOptions::new()
        .create(true)
        .append(true)
        .open("projects.json")
        .expect("Failed to open file");

    file.write_all(project_data.as_bytes())
        .expect("Failed to write project");
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![greet, save_project]) // ✅ Register the new command
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}