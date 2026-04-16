# Integration Guide - New Components

## How to integrate the new features into your MainLayout

### Step 1: Update MainLayout Component

Replace your `src/components/layout/MainLayout.tsx` with:

```tsx
import React, { useState } from 'react';
import TitleBar from './TitleBar';
import Sidebar from '../sidebar/Sidebar';
import GridCanvas from '../canvas/GridCanvas';
import CanvasToolbar from '../canvas/CanvasToolbar';
import EditorModal from '../editor/EditorModal';
import { SearchModal } from '../search/SearchModal';
import { TagManager } from '../tags/TagManager';
import { ExportModal } from '../export/ExportModal';
import './MainLayout.css';

function MainLayout() {
  // New modal states
  const [searchOpen, setSearchOpen] = useState(false);
  const [tagManagerOpen, setTagManagerOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);

  return (
    <div className="main-layout">
      <TitleBar />
      
      <div className="layout-content">
        <Sidebar />
        
        <div className="canvas-area">
          <CanvasToolbar 
            onSearch={() => setSearchOpen(true)}
            onTags={() => setTagManagerOpen(true)}
            onExport={() => setExportOpen(true)}
          />
          
          <GridCanvas />
        </div>
      </div>

      <EditorModal />

      {/* New Feature Modals */}
      <SearchModal 
        isOpen={searchOpen} 
        onClose={() => setSearchOpen(false)} 
      />
      
      <TagManager 
        isOpen={tagManagerOpen} 
        onClose={() => setTagManagerOpen(false)} 
      />
      
      <ExportModal 
        isOpen={exportOpen} 
        onClose={() => setExportOpen(false)} 
      />
    </div>
  );
}

export default MainLayout;
```

### Step 2: Update CanvasToolbar

Add buttons to your `src/components/canvas/CanvasToolbar.tsx`:

```tsx
import React from 'react';
import { Search, Tag, Download } from 'lucide-react';

interface CanvasToolbarProps {
  onSearch: () => void;
  onTags: () => void;
  onExport: () => void;
}

function CanvasToolbar({ onSearch, onTags, onExport }: CanvasToolbarProps) {
  return (
    <div className="canvas-toolbar">
      {/* Existing toolbar items... */}
      
      {/* New Buttons */}
      <div className="toolbar-group">
        <button 
          className="toolbar-btn" 
          onClick={onSearch}
          title="Search notes (Ctrl+Shift+F)"
        >
          <Search size={18} />
          Search
        </button>
        
        <button 
          className="toolbar-btn" 
          onClick={onTags}
          title="Manage tags"
        >
          <Tag size={18} />
          Tags
        </button>
        
        <button 
          className="toolbar-btn" 
          onClick={onExport}
          title="Export canvas"
        >
          <Download size={18} />
          Export
        </button>
      </div>
    </div>
  );
}

export default CanvasToolbar;
```

### Step 3: Add Keyboard Shortcuts (Optional)

Add to your main `src/App.tsx` or a new `useKeyboardShortcuts.ts` hook:

```tsx
import { useEffect } from 'react';

export const useKeyboardShortcuts = (callbacks: {
  onSearch?: () => void;
  onExport?: () => void;
  onTags?: () => void;
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+Shift+F or Cmd+Shift+F: Search
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'F') {
        e.preventDefault();
        callbacks.onSearch?.();
      }
      
      // Ctrl+Shift+E or Cmd+Shift+E: Export
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'E') {
        e.preventDefault();
        callbacks.onExport?.();
      }
      
      // Ctrl+Shift+T or Cmd+Shift+T: Tags
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'T') {
        e.preventDefault();
        callbacks.onTags?.();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [callbacks]);
};

// Usage in MainLayout:
useKeyboardShortcuts({
  onSearch: () => setSearchOpen(true),
  onExport: () => setExportOpen(true),
  onTags: () => setTagManagerOpen(true),
});
```

### Step 4: Update NoteCard Component

Enhance card component to support inline tag editing:

```tsx
import React, { useState } from 'react';
import { useCanvasStore } from '../../store/canvasStore';
import { suggestTagsForCard, getAllTags } from '../../utils/search';
import { X, Plus } from 'lucide-react';

function NoteCard({ card, canvasId }: { card: NoteCard; canvasId: string }) {
  const [tagsOpen, setTagsOpen] = useState(false);
  const [newTag, setNewTag] = useState('');
  const updateCard = useCanvasStore((state) => state.updateCard);
  
  const allTags = getAllTags(useCanvasStore((state) => state.getCurrentCanvas() || { cards: [], canvases: [] }));
  const suggestions = suggestTagsForCard(card, allTags);

  const addTag = (tag: string) => {
    if (tag.trim() && !card.tags.includes(tag.trim())) {
      updateCard(canvasId, card.id, {
        tags: [...card.tags, tag.trim()],
      });
      setNewTag('');
    }
  };

  const removeTag = (tag: string) => {
    updateCard(canvasId, card.id, {
      tags: card.tags.filter((t) => t !== tag),
    });
  };

  return (
    <div className="note-card">
      {/* Card content... */}
      
      {/* Tags section */}
      <div className="card-tags">
        {card.tags.map((tag) => (
          <div key={tag} className="tag-badge">
            {tag}
            <button onClick={() => removeTag(tag)}>
              <X size={12} />
            </button>
          </div>
        ))}
        
        <button 
          className="add-tag-btn"
          onClick={() => setTagsOpen(!tagsOpen)}
        >
          <Plus size={14} /> Add tag
        </button>

        {tagsOpen && (
          <div className="tag-input-wrapper">
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="New tag..."
              onKeyDown={(e) => {
                if (e.key === 'Enter') addTag(newTag);
              }}
            />
            {suggestions.length > 0 && (
              <div className="tag-suggestions">
                {suggestions.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => addTag(tag)}
                    className="suggestion"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default NoteCard;
```

### Step 5: Add CSS

Add these styles to your `src/styles/globals.css`:

```css
/* Search, Tags, Export toolbar buttons */
.toolbar-group {
  display: flex;
  gap: 8px;
  align-items: center;
}

.toolbar-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  color: #6b7280;
  transition: all 0.2s;
}

.toolbar-btn:hover {
  background: #3b82f6;
  color: white;
  border-color: #3b82f6;
}

/* Card tags */
.card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid #e5e7eb;
}

.tag-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  background: #dbeafe;
  color: #1e40af;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.tag-badge button {
  background: transparent;
  border: none;
  cursor: pointer;
  opacity: 0.7;
  transition: opacity 0.2s;
  padding: 0;
}

.tag-badge button:hover {
  opacity: 1;
}

.add-tag-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  background: transparent;
  border: 1px dashed #d1d5db;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  color: #6b7280;
  transition: all 0.2s;
}

.add-tag-btn:hover {
  border-color: #3b82f6;
  color: #3b82f6;
}

.tag-input-wrapper {
  position: relative;
  margin-top: 4px;
}

.tag-input-wrapper input {
  width: 100%;
  padding: 6px 8px;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  font-size: 12px;
}

.tag-suggestions {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #e5e7eb;
  border-top: none;
  border-radius: 0 0 4px 4px;
  max-height: 150px;
  overflow-y: auto;
  z-index: 10;
}

.suggestion {
  display: block;
  width: 100%;
  text-align: left;
  padding: 6px 8px;
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 12px;
  color: #6b7280;
  transition: background 0.2s;
}

.suggestion:hover {
  background: #f3f4f6;
}
```

### Step 6: Store Changes (Optional Enhancement)

Add helper methods to your stores if needed:

```tsx
// In canvasStore.ts - add method to update card tags
updateCardTags: (canvasId: string, cardId: string, tags: string[]) =>
  set((s) => ({
    canvases: {
      ...s.canvases,
      [canvasId]: {
        ...s.canvases[canvasId],
        cards: s.canvases[canvasId]?.cards.map((c) =>
          c.id === cardId ? { ...c, tags } : c
        ),
      },
    },
  })),
```

---

## Usage Examples

### Search for Notes
Press `Ctrl+Shift+F` (Windows/Linux) or `Cmd+Shift+F` (Mac) to open search

### Export Canvas
Press `Ctrl+Shift+E` (Windows/Linux) or `Cmd+Shift+E` (Mac) to export

### Manage Tags
Press `Ctrl+Shift+T` (Windows/Linux) or `Cmd+Shift+T` (Mac) to manage tags

---

## Testing

### Test Search
1. Create some cards with different content
2. Add tags to cards
3. Open search with Ctrl+Shift+F
4. Search for keywords
5. Filter by tags and dates

### Test Export
1. Create canvas with multiple cards
2. Click Export button
3. Try exporting to different formats
4. Verify files are downloaded correctly

### Test Tags
1. Open Tag Manager
2. Add tags to cards
3. Rename tags
4. Delete tags
5. Filter cards by tags

---

## Dependencies Added

```json
{
  "@capacitor/core": "^6.0.0",
  "@capacitor/filesystem": "^6.0.0",
  "@capacitor/device": "^6.0.0",
  "@capacitor/preferences": "^6.0.0",
  "docx": "^8.5.0",
  "html2canvas": "^1.4.1",
  "html2pdf.js": "^0.10.1",
  "dexie": "^4.0.0"
}
```

Run `npm install` to install all dependencies.

---

## Next Steps

1. ✅ Copy all new files to your project
2. ✅ Install dependencies: `npm install`
3. ✅ Integrate components into MainLayout
4. ✅ Test all features
5. ✅ Deploy!

For detailed documentation, see `MULTI_PLATFORM_GUIDE.md`
