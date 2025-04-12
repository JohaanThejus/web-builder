use tauri::{AppHandle, Manager, window::WindowBuilder, Emitter}; // ✅ Added Emitter
use std::fs::{File, OpenOptions};
use std::io::{Read, Write};

#[tauri::command]
fn read_from_file(path: String) -> Result<String, String> {
    let mut file = File::open(path).map_err(|e| e.to_string())?;
    let mut contents = String::new();
    file.read_to_string(&mut contents)
        .map_err(|e| e.to_string())?;
    Ok(contents)
}

#[tauri::command]
fn write_to_file(path: String, content: String) -> Result<(), String> {
    let mut file = OpenOptions::new()
        .write(true)
        .create(true)
        .truncate(true)
        .open(path)
        .map_err(|e| e.to_string())?;

    file.write_all(content.as_bytes())
        .map_err(|e| e.to_string())?;

    Ok(())
}


#[tauri::command]
fn create_new_window(
    app: AppHandle,
    label: &str,
    route: &str,
    title: &str,
) -> Result<(), String> {
    let window = WindowBuilder::new(&app, label)
        .title(title)
        .build()
        .map_err(|e| e.to_string())?;

    window.emit("navigate", route).map_err(|e| e.to_string())?;

    Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![create_new_window, write_to_file, read_from_file])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
