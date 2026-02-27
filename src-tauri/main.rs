#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

mod cmd;

use tauri::Manager;

fn main() {
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![
      cmd::execute_code,
      cmd::save_file
    ])
    .setup(|app| {
      #[cfg(debug_assertions)] // only include this code on debug builds
      {
        let window = app.get_window("main").unwrap();
        window.open_devtools();
      }
      Ok(())
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
