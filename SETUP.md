# GridNote — Kurulum Rehberi

## Gereksinimler
- Node.js 18+ (v22 önerilir)
- Rust (stable) + Cargo
- Tauri CLI v2
- Git

## 1. Rust Kurulumu
```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source ~/.cargo/env
```

## 2. Tauri Sistem Bağımlılıkları

### macOS
```bash
xcode-select --install
```

### Ubuntu/Debian
```bash
sudo apt update
sudo apt install -y libwebkit2gtk-4.1-dev build-essential curl wget file \
  libxdo-dev libssl-dev libayatana-appindicator3-dev librsvg2-dev
```

### Windows
- Visual Studio C++ Build Tools kurulumu gerekli
- WebView2 (Windows 10/11'de genellikle kurulu)

## 3. Projeyi Oluştur
```bash
npm create tauri-app@latest gridnote -- --template react-ts
cd gridnote
```

## 4. Bağımlılıkları Kur
```bash
npm install
npm install @xyflow/react zustand @tiptap/react @tiptap/starter-kit \
  @tiptap/extension-text-style @tiptap/extension-color \
  @tiptap/extension-highlight @tiptap/extension-underline \
  @tiptap/extension-text-align @tiptap/extension-font-family \
  @tiptap/extension-table @tiptap/extension-table-row \
  @tiptap/extension-table-cell @tiptap/extension-table-header \
  @tiptap/extension-task-list @tiptap/extension-task-item \
  @tiptap/extension-code-block-lowlight @tiptap/extension-image \
  @tiptap/extension-link @tiptap/extension-subscript \
  @tiptap/extension-superscript @tiptap/extension-character-count \
  @tiptap/extension-placeholder @tiptap/extension-typography \
  lowlight i18next react-i18next \
  @tauri-apps/plugin-fs @tauri-apps/plugin-dialog \
  @tauri-apps/plugin-shell lucide-react clsx tailwind-merge \
  uuid @types/uuid

npm install -D tailwindcss @tailwindcss/vite postcss autoprefixer
```

## 5. Tauri Eklentilerini Ekle (src-tauri/Cargo.toml)
Cargo.toml dosyasına ekle:
```toml
[dependencies]
tauri = { version = "2", features = [] }
tauri-plugin-fs = "2"
tauri-plugin-dialog = "2"
tauri-plugin-shell = "2"
serde = { version = "1", features = ["derive"] }
serde_json = "1"
```

## 6. Geliştirme Sunucusunu Başlat
```bash
npm run tauri dev
```
