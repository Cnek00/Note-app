# GridNote - Multi-Platform Setup & Features Guide

## 📱 Platform Support

GridNote now supports:
- **Desktop**: macOS, Windows, Linux (via Tauri)
- **Mobile**: iOS, Android (via Capacitor)
- **Web**: Any modern browser

---

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd gridnote
npm install
```

### 2. Development

#### Desktop (Tauri)
```bash
npm run dev          # Hot reload
npm run tauri dev    # Start Tauri dev server
```

#### Web/Mobile
```bash
npm run dev          # Vite dev server
npm run capacitor:build  # Build for mobile
```

---

## 📦 New Features

### 1. Export System

GridNote now supports exporting canvases in multiple formats:

#### Supported Formats
- **JSON**: Structured data with full metadata
- **Markdown**: Clean, readable format
- **HTML**: Formatted web page
- **PDF**: Print-friendly document
- **SVG**: Scalable vector graphic
- **DOCX**: Microsoft Word format
- **PNG**: Canvas snapshot image

#### Usage
```tsx
import { 
  exportToJSON, 
  exportToMarkdown, 
  exportToHTML, 
  exportToPDF,
  exportToSVG,
  exportToDOCX 
} from '@/utils/exporters';

// Export canvas
const canvas = getCurrentCanvas();
exportToJSON(canvas, 'my-notes');
exportMarkdown(canvas, 'my-notes');
// ... etc
```

### 2. Full-Text Search

Instant search across all notes with multiple features:

#### Features
- Search in title, content, and tags
- Tag-based filtering
- Date range filtering
- Fuzzy search with typo tolerance
- Relevance scoring
- Multi-canvas search

#### Usage
```tsx
import { 
  searchCards, 
  getAllTags, 
  filterCardsByTags,
  filterCardsByDateRange,
  fuzzySearch 
} from '@/utils/search';

// Basic search
const results = searchCards(canvas, 'query');

// With filters
const results = searchCards(canvas, 'query', {
  tags: ['important'],
  dateRange: {
    from: new Date('2024-01-01'),
    to: new Date('2024-12-31')
  }
});

// Fuzzy search
const fuzzyResults = fuzzySearch(canvas, 'query', maxDistance = 2);
```

#### Component
Use the `<SearchModal />` component for UI:

```tsx
<SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
```

### 3. Enhanced Tag System

Manage and filter cards by tags:

#### Features
- Tag creation and management
- Rename tags across all cards
- Delete tags with safety confirmation
- Tag frequency statistics
- Auto-suggest tags based on content
- Multi-tag filtering

#### Usage
```tsx
import { 
  getAllTags, 
  filterCardsByTags, 
  getTagFrequency,
  suggestTagsForCard 
} from '@/utils/search';

// Get all tags
const tags = getAllTags(canvas);

// Filter by tags
const cards = filterCardsByTags(canvas, ['work', 'urgent']);

// Get tag frequency
const frequency = getTagFrequency(canvas);
console.log(frequency.get('work')); // 15

// Suggest tags
const suggestions = suggestTagsForCard(card, allTags);
```

#### Component
Use the `<TagManager />` component for UI:

```tsx
<TagManager isOpen={tagOpen} onClose={() => setTagOpen(false)} />
```

---

## 🍎 iOS Setup

### Prerequisites
- macOS
- Xcode 14+
- Node.js 16+
- Cocoapods

### Steps

```bash
# 1. Add iOS platform
npm run capacitor:add:ios

# 2. Build web assets
npm run build

# 3. Sync assets to Xcode project
npm run capacitor:sync

# 4. Open in Xcode
npm run capacitor:open:ios

# 5. Configure signing in Xcode
# - Select project > Signing & Capabilities
# - Set Team ID
# - Bundle ID should be: com.gridnote.app

# 6. Build & Run
# - Product > Build & Run (Cmd+R)
# - Or select device/simulator and click Play
```

### iOS Permissions

Add to `ios/App/App/Info.plist`:

```xml
<key>NSPhotoLibraryUsageDescription</key>
<string>GridNote needs access to your photos to import images</string>
<key>NSCalendarsUsageDescription</key>
<string>GridNote needs calendar access</string>
<key>NSDocumentsFolderUsageDescription</key>
<string>GridNote needs access to documents folder</string>
```

---

## 🤖 Android Setup

### Prerequisites
- Android Studio 2022.1+
- Android SDK 33+
- JDK 11+
- ANDROID_SDK_ROOT environment variable set

### Steps

```bash
# 1. Add Android platform
npm run capacitor:add:android

# 2. Build web assets
npm run build

# 3. Sync assets
npm run capacitor:sync

# 4. Open in Android Studio
npm run capacitor:open:android

# 5. Configure build.gradle
# - Update targetSdk to 34
# - Set appropriate minSdk (21+)

# 6. Build & Run
# - Build > Make Project
# - Run > Run 'app'
# - Select device/emulator
```

### Android Permissions

Add to `android/app/src/main/AndroidManifest.xml`:

```xml
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
```

---

## 💾 Data Storage

### Storage Architecture

- **Desktop**: Tauri file system API
- **Mobile**: 
  - IndexedDB (primary)
  - localStorage (fallback)
  - File system (via Capacitor Filesystem)
- **Web**: localStorage + IndexedDB

### Using Storage Service

```tsx
import { storageService } from '@/utils/storage';

// Save data
await storageService.saveNotebooks(notebooks);
await storageService.saveCanvases(canvases);

// Load data
const notebooks = await storageService.loadNotebooks();
const canvases = await storageService.loadCanvases();

// Settings
await storageService.saveSetting('theme', 'dark');
const theme = await storageService.loadSetting('theme');

// Backup/Restore
const backup = await storageService.exportAll();
const success = await storageService.importAll(backup);

// Clear all
await storageService.clearAll();
```

### Storage Limits

- IndexedDB: ~50MB (browser dependent)
- localStorage: ~5-10MB
- IndexedDB generally has no limit on native apps

---

## 🔄 Syncing Between Platforms

For syncing data between desktop and mobile:

```tsx
// 1. Export from one platform
const backup = await storageService.exportAll();

// 2. Download/transfer file
const json = JSON.stringify(backup);
// Save to file...

// 3. Import on another platform
const data = JSON.parse(fileContent);
await storageService.importAll(data);
```

### Cloud Sync (Optional)

Add Firebase, Supabase, or another backend:

```tsx
// Example with Firebase
import { collection, addDoc } from 'firebase/firestore';

async function syncToCloud(data: any) {
  await addDoc(collection(db, 'backups'), {
    data,
    timestamp: new Date(),
    userId: currentUserId,
  });
}
```

---

## 🛠️ Development Guide

### Adding New Export Format

1. Add exporter function to `src/utils/exporters.ts`:

```tsx
export const exportToXML = (canvas: Canvas, filename: string) => {
  let xml = '<?xml version="1.0"?>\n<canvas>\n';
  // Generate XML...
  xml += '</canvas>';
  downloadFile(xml, `${filename}.xml`, 'application/xml');
};
```

2. Add to ExportModal component:

```tsx
case 'xml':
  await exportToXML(currentCanvas, filename);
  break;
```

### Adding Search Features

1. Add search function to `src/utils/search.ts`:

```tsx
export const searchByCategory = (canvas: Canvas, category: string) => {
  return canvas.cards.filter(card => 
    card.category === category
  );
};
```

2. Add to SearchModal component filters

### Components Reference

#### SearchModal
```tsx
<SearchModal isOpen={isOpen} onClose={onClose} />
```
Location: `src/components/search/SearchModal.tsx`
Features: Full-text search, tag filter, date filter

#### TagManager  
```tsx
<TagManager isOpen={isOpen} onClose={onClose} />
```
Location: `src/components/tags/TagManager.tsx`
Features: Tag CRUD, tag statistics, filtering

#### ExportModal
```tsx
<ExportModal isOpen={isOpen} onClose={onClose} />
```
Location: `src/components/export/ExportModal.tsx`
Features: Multi-format export, batch export

---

## 📊 Architecture

```
gridnote/
├── src/
│   ├── utils/
│   │   ├── exporters.ts      ← Export functionality
│   │   ├── search.ts         ← Search & tagging
│   │   └── storage.ts        ← IndexedDB + localStorage
│   ├── components/
│   │   ├── search/
│   │   │   ├── SearchModal.tsx
│   │   │   └── SearchModal.css
│   │   ├── tags/
│   │   │   ├── TagManager.tsx
│   │   │   └── TagManager.css
│   │   └── export/
│   │       ├── ExportModal.tsx
│   │       └── ExportModal.css
│   └── store/
│       ├── canvasStore.ts
│       ├── notebookStore.ts
│       └── settingsStore.ts
├── src-tauri/        ← Desktop (Tauri)
├── ios/              ← iOS (Xcode)
├── android/          ← Android (Android Studio)
└── capacitor.config.ts
```

---

## 🐛 Troubleshooting

### Mobile Issues

**IndexedDB not working?**
- Check browser support
- Verify quota isn't exceeded
- Use `storageService.exportAll()` to backup

**Large file exports failing?**
- Split into smaller chunks
- Use JSON format (smaller)
- Consider streaming for large exports

**Syncing issues?**
- Check network connection
- Verify data format
- Test locally first

### Desktop Issues

**Tauri build fails?**
- Update Rust: `rustup update`
- Clear cache: `cargo clean`
- Check Tauri docs

---

## 📝 Next Steps

1. ✅ Features implemented:
   - Export system (all formats)
   - Full-text search
   - Tag system

2. 🔄 Optional enhancements:
   - Cloud sync (Firebase/Supabase)
   - Real-time collaboration
   - OCR for images
   - Voice notes
   - Calendar integration

3. 🚀 Deploy:
   - Build for production: `npm run build`
   - Tauri bundle: `npm run tauri build`
   - Submit to App Store/Google Play

---

## 📞 Support

For issues or questions:
- Check Tauri docs: https://tauri.app
- Check Capacitor docs: https://capacitorjs.com
- File GitHub issues

---

Happy note-taking! 📝🎉
