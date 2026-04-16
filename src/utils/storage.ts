// src/utils/storage.ts
import Dexie, { Table } from 'dexie';
import { Canvas, Notebook } from '../types';

/**
 * IndexedDB storage service for better performance on mobile
 * Falls back to localStorage for simple data
 */

// Initialize Dexie database
export class GridNoteDB extends Dexie {
  notebooks!: Table<Notebook>;
  canvases!: Table<Canvas>;
  settings!: Table<any>;

  constructor() {
    super('GridNoteDB');
    this.version(1).stores({
      notebooks: 'id, createdAt',
      canvases: 'id, notebookId, createdAt',
      settings: 'key',
    });
  }
}

export const db = new GridNoteDB();

/**
 * Cross-platform storage service
 * Uses IndexedDB on mobile/modern browsers, localStorage as fallback
 */
export const storageService = {
  /**
   * Save notebooks to database
   */
  async saveNotebooks(notebooks: Notebook[]): Promise<void> {
    try {
      if (db.notebooks) {
        await db.notebooks.bulkPut(notebooks);
      } else {
        localStorage.setItem('gridnote_notebooks', JSON.stringify(notebooks));
      }
    } catch (error) {
      console.warn('Failed to save notebooks to IndexedDB, using localStorage:', error);
      localStorage.setItem('gridnote_notebooks', JSON.stringify(notebooks));
    }
  },

  /**
   * Load notebooks from database
   */
  async loadNotebooks(): Promise<Notebook[]> {
    try {
      if (db.notebooks) {
        return await db.notebooks.toArray();
      }
    } catch (error) {
      console.warn('Failed to load notebooks from IndexedDB:', error);
    }

    const stored = localStorage.getItem('gridnote_notebooks');
    return stored ? JSON.parse(stored) : [];
  },

  /**
   * Save canvases to database
   */
  async saveCanvases(canvases: Canvas[]): Promise<void> {
    try {
      if (db.canvases) {
        await db.canvases.bulkPut(canvases);
      } else {
        localStorage.setItem('gridnote_canvases', JSON.stringify(canvases));
      }
    } catch (error) {
      console.warn('Failed to save canvases to IndexedDB, using localStorage:', error);
      localStorage.setItem('gridnote_canvases', JSON.stringify(canvases));
    }
  },

  /**
   * Load canvases from database
   */
  async loadCanvases(): Promise<Canvas[]> {
    try {
      if (db.canvases) {
        return await db.canvases.toArray();
      }
    } catch (error) {
      console.warn('Failed to load canvases from IndexedDB:', error);
    }

    const stored = localStorage.getItem('gridnote_canvases');
    return stored ? JSON.parse(stored) : [];
  },

  /**
   * Save settings
   */
  async saveSetting(key: string, value: any): Promise<void> {
    try {
      if (db.settings) {
        await db.settings.put({ key, value, updatedAt: new Date().toISOString() });
      } else {
        localStorage.setItem(`gridnote_setting_${key}`, JSON.stringify(value));
      }
    } catch (error) {
      console.warn('Failed to save setting to IndexedDB:', error);
      localStorage.setItem(`gridnote_setting_${key}`, JSON.stringify(value));
    }
  },

  /**
   * Load setting
   */
  async loadSetting(key: string): Promise<any> {
    try {
      if (db.settings) {
        const stored = await db.settings.get(key);
        return stored?.value;
      }
    } catch (error) {
      console.warn('Failed to load setting from IndexedDB:', error);
    }

    const stored = localStorage.getItem(`gridnote_setting_${key}`);
    return stored ? JSON.parse(stored) : null;
  },

  /**
   * Clear all data
   */
  async clearAll(): Promise<void> {
    try {
      if (db) {
        await db.delete();
      }
    } catch (error) {
      console.warn('Failed to clear IndexedDB:', error);
    }

    // Also clear localStorage
    const keys = Object.keys(localStorage);
    keys.forEach((key) => {
      if (key.startsWith('gridnote_')) {
        localStorage.removeItem(key);
      }
    });
  },

  /**
   * Export all data as JSON (for backup)
   */
  async exportAll(): Promise<any> {
    const notebooks = await this.loadNotebooks();
    const canvases = await this.loadCanvases();

    return {
      version: '1.0',
      exportDate: new Date().toISOString(),
      notebooks,
      canvases,
    };
  },

  /**
   * Import data from JSON (restore from backup)
   */
  async importAll(data: any): Promise<boolean> {
    try {
      if (data.notebooks && Array.isArray(data.notebooks)) {
        await this.saveNotebooks(data.notebooks);
      }
      if (data.canvases && Array.isArray(data.canvases)) {
        await this.saveCanvases(data.canvases);
      }
      return true;
    } catch (error) {
      console.error('Import failed:', error);
      return false;
    }
  },
};

/**
 * Get database storage info (for debugging/analytics)
 */
export const getStorageInfo = async (): Promise<{
  notebookCount: number;
  canvasCount: number;
  estimatedSize: number;
}> => {
  try {
    const notebooks = await db.notebooks.toArray();
    const canvases = await db.canvases.toArray();

    const estimatedSize =
      JSON.stringify(notebooks).length + JSON.stringify(canvases).length;

    return {
      notebookCount: notebooks.length,
      canvasCount: canvases.length,
      estimatedSize,
    };
  } catch (error) {
    console.warn('Failed to get storage info:', error);
    return {
      notebookCount: 0,
      canvasCount: 0,
      estimatedSize: 0,
    };
  }
};
