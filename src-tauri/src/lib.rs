// src-tauri/src/lib.rs
use tauri::Manager;

#[tauri::command]
fn greet(name: &str) -> String {
    format!("GridNote v0.1 - Hello, {}!", name)
}

#[tauri::command]
async fn save_canvas(
    app: tauri::AppHandle,
    notebook_id: String,
    canvas_id: String,
    data: String,
) -> Result<(), String> {
    use tauri_plugin_fs::FsExt;
    
    let app_dir = app
        .path()
        .app_data_dir()
        .map_err(|e| e.to_string())?;
    
    let canvas_dir = app_dir.join("notebooks").join(&notebook_id);
    std::fs::create_dir_all(&canvas_dir).map_err(|e| e.to_string())?;
    
    let file_path = canvas_dir.join(format!("{}.json", canvas_id));
    std::fs::write(&file_path, &data).map_err(|e| e.to_string())?;
    
    Ok(())
}

#[tauri::command]
async fn load_canvas(
    app: tauri::AppHandle,
    notebook_id: String,
    canvas_id: String,
) -> Result<String, String> {
    let app_dir = app
        .path()
        .app_data_dir()
        .map_err(|e| e.to_string())?;
    
    let file_path = app_dir
        .join("notebooks")
        .join(&notebook_id)
        .join(format!("{}.json", canvas_id));
    
    if !file_path.exists() {
        return Ok(String::new());
    }
    
    std::fs::read_to_string(&file_path).map_err(|e| e.to_string())
}

#[tauri::command]
async fn save_notebooks_index(
    app: tauri::AppHandle,
    data: String,
) -> Result<(), String> {
    let app_dir = app
        .path()
        .app_data_dir()
        .map_err(|e| e.to_string())?;
    
    std::fs::create_dir_all(&app_dir).map_err(|e| e.to_string())?;
    let file_path = app_dir.join("notebooks.json");
    std::fs::write(&file_path, &data).map_err(|e| e.to_string())?;
    
    Ok(())
}

#[tauri::command]
async fn load_notebooks_index(
    app: tauri::AppHandle,
) -> Result<String, String> {
    let app_dir = app
        .path()
        .app_data_dir()
        .map_err(|e| e.to_string())?;
    
    let file_path = app_dir.join("notebooks.json");
    
    if !file_path.exists() {
        return Ok(String::new());
    }
    
    std::fs::read_to_string(&file_path).map_err(|e| e.to_string())
}

#[tauri::command]
async fn export_html(
    _app: tauri::AppHandle,
    content: String,
    title: String,
    path: String,
) -> Result<(), String> {
    let html = format!(
        r#"<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{}</title>
<style>
  body {{ font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; 
         max-width: 800px; margin: 40px auto; padding: 0 20px; color: #333; }}
  h1,h2,h3 {{ color: #111; }}
  table {{ border-collapse: collapse; width: 100%; }}
  td, th {{ border: 1px solid #ddd; padding: 8px; }}
  code {{ background: #f4f4f4; padding: 2px 6px; border-radius: 3px; }}
  pre {{ background: #f4f4f4; padding: 16px; border-radius: 6px; overflow-x: auto; }}
  blockquote {{ border-left: 4px solid #ddd; margin: 0; padding-left: 16px; color: #666; }}
</style>
</head>
<body>
<h1>{}</h1>
{}
</body>
</html>"#,
        title, title, content
    );
    
    std::fs::write(&path, &html).map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
async fn export_markdown(
    _app: tauri::AppHandle,
    content: String,
    path: String,
) -> Result<(), String> {
    std::fs::write(&path, &content).map_err(|e| e.to_string())?;
    Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![
            greet,
            save_canvas,
            load_canvas,
            save_notebooks_index,
            load_notebooks_index,
            export_html,
            export_markdown,
        ])
        .run(tauri::generate_context!())
        .expect("error while running GridNote application");
}
