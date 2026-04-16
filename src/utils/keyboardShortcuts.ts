/**
 * Keyboard shortcuts utility for GridNote
 * Handles copy, paste, cut, delete operations on note cards
 */

export interface KeyboardShortcut {
  key: string;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  metaKey?: boolean;
}

export interface KeyboardAction {
  copy?: () => void;
  paste?: () => void;
  cut?: () => void;
  delete?: () => void;
  undo?: () => void;
  redo?: () => void;
  selectAll?: () => void;
  save?: () => void;
  duplicate?: () => void;
  escape?: () => void;
}

// Clipboard
const clipboard = {
  data: null as any,
  timestamp: 0,
  type: 'card' as 'card' | 'text',
};

export const clipboardService = {
  /**
   * Copy card data to clipboard
   */
  copyCard(card: any): void {
    clipboard.data = JSON.parse(JSON.stringify(card));
    clipboard.type = 'card';
    clipboard.timestamp = Date.now();
    console.log('Card copied to clipboard:', card.title);
  },

  /**
   * Cut card data to clipboard
   */
  cutCard(card: any): void {
    this.copyCard(card);
    clipboard.type = 'card';
  },

  /**
   * Paste card from clipboard
   */
  getCardFromClipboard(): any | null {
    if (clipboard.type === 'card' && clipboard.data) {
      return clipboard.data;
    }
    return null;
  },

  /**
   * Check if clipboard has card data
   */
  hasCardData(): boolean {
    return clipboard.type === 'card' && clipboard.data !== null;
  },

  /**
   * Clear clipboard
   */
  clear(): void {
    clipboard.data = null;
    clipboard.type = 'card';
  },
};

/**
 * Keyboard shortcuts handler
 */
export const keyboardShortcuts = {
  /**
   * Check if shortcut matches event
   */
  matches(event: KeyboardEvent, shortcut: KeyboardShortcut): boolean {
    if (event.key.toLowerCase() !== shortcut.key.toLowerCase()) return false;
    if ((shortcut.ctrlKey || shortcut.metaKey) && !((event.ctrlKey || event.metaKey) && !event.metaKey)) return false;
    if (shortcut.shiftKey && !event.shiftKey) return false;
    if (shortcut.altKey && !event.altKey) return false;
    return true;
  },

  /**
   * Create keyboard handler for components
   */
  createHandler(actions: KeyboardAction) {
    return (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      
      // Don't trigger shortcuts if editing in input/textarea
      const isEditingContent = 
        target.tagName === 'INPUT' || 
        target.tagName === 'TEXTAREA' || 
        target.contentEditable === 'true' ||
        target.closest('.tiptap-editor');

      // Copy: Ctrl/Cmd + C
      if ((event.ctrlKey || event.metaKey) && event.key === 'c' && !isEditingContent) {
        event.preventDefault();
        actions.copy?.();
      }

      // Cut: Ctrl/Cmd + X
      if ((event.ctrlKey || event.metaKey) && event.key === 'x' && !isEditingContent) {
        event.preventDefault();
        actions.cut?.();
      }

      // Paste: Ctrl/Cmd + V
      if ((event.ctrlKey || event.metaKey) && event.key === 'v' && !isEditingContent) {
        event.preventDefault();
        actions.paste?.();
      }

      // Delete: Delete key
      if (event.key === 'Delete' && !isEditingContent) {
        event.preventDefault();
        actions.delete?.();
      }

      // Duplicate: Ctrl/Cmd + D
      if ((event.ctrlKey || event.metaKey) && event.key === 'd' && !isEditingContent) {
        event.preventDefault();
        actions.duplicate?.();
      }

      // Escape
      if (event.key === 'Escape') {
        actions.escape?.();
      }

      // Undo: Ctrl/Cmd + Z
      if ((event.ctrlKey || event.metaKey) && event.key === 'z' && !event.shiftKey) {
        event.preventDefault();
        actions.undo?.();
      }

      // Redo: Ctrl/Cmd + Shift + Z
      if ((event.ctrlKey || event.metaKey) && event.key === 'z' && event.shiftKey) {
        event.preventDefault();
        actions.redo?.();
      }

      // Select All: Ctrl/Cmd + A
      if ((event.ctrlKey || event.metaKey) && event.key === 'a' && !isEditingContent) {
        event.preventDefault();
        actions.selectAll?.();
      }

      // Save: Ctrl/Cmd + S
      if ((event.ctrlKey || event.metaKey) && event.key === 's') {
        event.preventDefault();
        actions.save?.();
      }
    };
  },
};

/**
 * Turkish translations for shortcuts
 */
export const shortcutLabels = {
  copy: 'Kopyala (Ctrl+C)',
  cut: 'Kes (Ctrl+X)',
  paste: 'Yapıştır (Ctrl+V)',
  delete: 'Sil (Delete)',
  undo: 'Geri Al (Ctrl+Z)',
  redo: 'İleri Al (Ctrl+Shift+Z)',
  duplicate: 'Çoğalt (Ctrl+D)',
  selectAll: 'Tümünü Seç (Ctrl+A)',
  save: 'Kaydet (Ctrl+S)',
};

export const shortcutLabelsEn = {
  copy: 'Copy (Ctrl+C)',
  cut: 'Cut (Ctrl+X)',
  paste: 'Paste (Ctrl+V)',
  delete: 'Delete',
  undo: 'Undo (Ctrl+Z)',
  redo: 'Redo (Ctrl+Shift+Z)',
  duplicate: 'Duplicate (Ctrl+D)',
  selectAll: 'Select All (Ctrl+A)',
  save: 'Save (Ctrl+S)',
};
