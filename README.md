# GridNote 🗒️

**Offline-first infinite canvas note-taking app**  
Tauri 2 + React 18 + TipTap + XYFlow — TR / EN / DE

---

## ⚡ Quick Start (Step by Step)

### Step 1 — Install Rust

```bash
# macOS / Linux
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source ~/.cargo/env
rustup update stable

# Windows: download from https://rustup.rs
```

### Step 2 — Install system dependencies

#### macOS
```bash
xcode-select --install
```

#### Ubuntu / Debian / Mint
```bash
sudo apt update && sudo apt install -y \
  libwebkit2gtk-4.1-dev build-essential curl wget file \
  libxdo-dev libssl-dev libayatana-appindicator3-dev librsvg2-dev
```

#### Fedora / RHEL
```bash
sudo dnf install webkit2gtk4.1-devel openssl-devel \
  curl wget file libappindicator-gtk3-devel librsvg2-devel
```

#### Windows
- Install [Visual Studio Build Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/)
  → Select "Desktop development with C++"
- WebView2 is pre-installed on Windows 10/11

### Step 3 — Create the project

```bash
# Create with Tauri + React + TypeScript
npm create tauri-app@latest gridnote -- --template react-ts
cd gridnote
```

### Step 4 — Replace all source files

Copy every file from this package into the `gridnote/` directory, maintaining the exact folder structure shown below.

**Complete file structure:**
```
gridnote/
├── index.html                          ← replace
├── package.json                        ← replace
├── vite.config.ts                      ← replace
├── tsconfig.json                       ← replace
├── tsconfig.node.json                  ← replace
│
├── src-tauri/
│   ├── build.rs                        ← replace
│   ├── Cargo.toml                      ← replace
│   ├── tauri.conf.json                 ← replace
│   └── src/
│       ├── main.rs                     ← replace
│       └── lib.rs                      ← replace (ALL commands here)
│
└── src/
    ├── main.tsx                        ← replace
    ├── App.tsx                         ← replace
    │
    ├── styles/
    │   └── globals.css                 ← create
    │
    ├── types/
    │   └── index.ts                    ← create
    │
    ├── i18n/
    │   ├── index.ts                    ← create
    │   └── locales/
    │       ├── en.json                 ← create
    │       ├── tr.json                 ← create
    │       └── de.json                 ← create
    │
    ├── store/
    │   ├── settingsStore.ts            ← create
    │   ├── canvasStore.ts              ← create
    │   └── notebookStore.ts            ← create
    │
    ├── hooks/
    │   └── useStorage.ts               ← create
    │
    └── components/
        ├── layout/
        │   ├── MainLayout.tsx          ← create
        │   └── TitleBar.tsx            ← create
        │
        ├── sidebar/
        │   └── Sidebar.tsx             ← create
        │
        ├── editor/
        │   ├── RichEditor.tsx          ← create
        │   ├── EditorToolbar.tsx       ← create
        │   └── EditorModal.tsx         ← create
        │
        └── canvas/
            ├── GridCanvas.tsx          ← create
            ├── NoteCard.tsx            ← create
            └── CanvasToolbar.tsx       ← create
```

### Step 5 — Install npm dependencies

```bash
npm install @xyflow/react zustand \
  @tiptap/react @tiptap/starter-kit \
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
  @tauri-apps/plugin-shell lucide-react uuid @types/uuid

npm install -D tailwindcss @tailwindcss/vite
```

### Step 6 — Update Cargo.toml plugins

Make sure `src-tauri/Cargo.toml` contains:
```toml
[dependencies]
tauri = { version = "2", features = [] }
tauri-plugin-fs = "2"
tauri-plugin-dialog = "2"
tauri-plugin-shell = "2"
serde = { version = "1", features = ["derive"] }
serde_json = "1"
```

### Step 7 — Run in development

```bash
npm run tauri dev
```

First build downloads Rust crates (~2-3 min). Subsequent builds are much faster.

### Step 8 — Build for production

```bash
npm run tauri build
```

Output: `src-tauri/target/release/bundle/`

---

## 🎮 How to Use

| Action | How |
|--------|-----|
| Add a note card | Double-click on empty canvas background |
| Open rich editor | Double-click on a card, or click ✏️ icon |
| Move cards | Drag the card header |
| Resize cards | Select card → drag corner handles |
| Connect cards | Hover card edge → drag from blue dot to another card |
| Delete card/connection | Select → Delete key, or click 🗑️ |
| Duplicate card | Click copy icon on card |
| Change card color | Open editor → click color dot in header |
| Zoom canvas | Mouse wheel or Ctrl+scroll |
| Pan canvas | Middle-click drag, or Space+drag |
| Save | Ctrl+S (auto-save also enabled) |
| Switch language | Sidebar bottom — 🇬🇧 🇹🇷 🇩🇪 |
| Toggle theme | Title bar — ☀️/🌙 button |

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│                    Tauri 2 Shell                     │
│  ┌─────────────────────────────────────────────┐    │
│  │           React 18 Frontend                  │    │
│  │                                              │    │
│  │  ┌──────────┐  ┌─────────────────────────┐  │    │
│  │  │ Sidebar  │  │     GridCanvas           │  │    │
│  │  │          │  │  (XYFlow React Flow)     │  │    │
│  │  │Notebooks │  │                          │  │    │
│  │  │Canvases  │  │  ┌──────┐  ┌──────┐     │  │    │
│  │  │Tags      │  │  │Card  │  │Card  │     │  │    │
│  │  │Language  │  │  │      │  │      │     │  │    │
│  │  │Theme     │  │  └──────┘  └──────┘     │  │    │
│  │  └──────────┘  │        ↕ connections     │  │    │
│  │                └─────────────────────────┘  │    │
│  │                                              │    │
│  │  ┌─────────────────────────────────────┐    │    │
│  │  │      EditorModal (TipTap)            │    │    │
│  │  │  Toolbar + Rich text + Word count    │    │    │
│  │  └─────────────────────────────────────┘    │    │
│  │                                              │    │
│  │  State: Zustand (canvasStore, notebookStore) │    │
│  └─────────────────────────────────────────────┘    │
│                                                      │
│  Rust Backend: FS save/load, export commands         │
│  Storage: AppData/gridnote/ (JSON files)             │
└─────────────────────────────────────────────────────┘
```

---

## 📋 Next Steps (Planned Features)

- [ ] Export to PDF / DOCX / PNG / SVG
- [ ] Full-text search across all notes
- [ ] Tags system
- [ ] Import from Markdown / Obsidian / Joplin
- [ ] Version history
- [ ] Card rotation
- [ ] Grouped cards / frames
- [ ] Custom connection styles & labels editor
- [ ] Command palette (Ctrl+K)
- [ ] Keyboard shortcuts panel
- [ ] Multiple windows
- [ ] Print view

---

## 🐛 Troubleshooting

**`webkit2gtk not found` (Linux)**
```bash
sudo apt install libwebkit2gtk-4.1-dev
```

**`error[E0433]: tauri_plugin_fs` not found**
Make sure Cargo.toml has `tauri-plugin-fs = "2"` and run `cargo update`

**White screen / blank app**
Check browser console (Ctrl+Shift+I in dev mode) for JS errors.

**Fonts look wrong on Windows**
Add `"windows": { "additionalBrowserArguments": "--disable-features=msSmartScreenProtection" }` to `tauri.conf.json`
