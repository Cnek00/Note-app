// src/hooks/useStorage.ts
import { useCallback, useEffect, useRef } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { useCanvasStore } from '../store/canvasStore';
import { useNotebookStore } from '../store/notebookStore';
import { useSettingsStore } from '../store/settingsStore';
import { Canvas, Notebook } from '../types';

// Fallback localStorage for web/dev mode
const isTauri = typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window;

async function tauriSave(key: string, data: string): Promise<void> {
  if (isTauri) {
    await invoke('save_notebooks_index', { data });
  } else {
    localStorage.setItem(key, data);
  }
}

async function tauriLoad(key: string): Promise<string> {
  if (isTauri) {
    return await invoke('load_notebooks_index') as string;
  }
  return localStorage.getItem(key) || '';
}

async function tauriSaveCanvas(notebookId: string, canvasId: string, data: string): Promise<void> {
  if (isTauri) {
    await invoke('save_canvas', { notebookId, canvasId, data });
  } else {
    localStorage.setItem(`canvas-${canvasId}`, data);
  }
}

async function tauriLoadCanvas(notebookId: string, canvasId: string): Promise<string> {
  if (isTauri) {
    return await invoke('load_canvas', { notebookId, canvasId }) as string;
  }
  return localStorage.getItem(`canvas-${canvasId}`) || '';
}

export function useStorage() {
  const { canvases, loadCanvas, loadMultipleCanvases } = useCanvasStore();
  const { notebooks, loadNotebooks } = useNotebookStore();
  const { autoSave, autoSaveInterval } = useSettingsStore();
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isDirtyRef = useRef(false);

  // Save notebooks index
  const saveNotebooks = useCallback(async (notebookList: Notebook[]) => {
    try {
      await tauriSave('gridnote-notebooks', JSON.stringify(notebookList));
    } catch (e) {
      console.error('Failed to save notebooks:', e);
    }
  }, []);

  // Save a single canvas
  const saveCanvas = useCallback(async (canvas: Canvas) => {
    try {
      await tauriSaveCanvas(canvas.notebookId, canvas.id, JSON.stringify(canvas));
    } catch (e) {
      console.error('Failed to save canvas:', e);
    }
  }, []);

  // Save all current canvases
  const saveAll = useCallback(async () => {
    await saveNotebooks(notebooks);
    for (const canvas of Object.values(canvases)) {
      await saveCanvas(canvas);
    }
    isDirtyRef.current = false;
  }, [canvases, notebooks, saveCanvas, saveNotebooks]);

  // Load all data on startup
  const loadAll = useCallback(async () => {
    try {
      const notebooksData = await tauriLoad('gridnote-notebooks');
      if (notebooksData) {
        const notebookList: Notebook[] = JSON.parse(notebooksData);
        loadNotebooks(notebookList);

        // Load all canvases
        const allCanvases: Canvas[] = [];
        for (const notebook of notebookList) {
          for (const canvasId of notebook.canvases) {
            const canvasData = await tauriLoadCanvas(notebook.id, canvasId);
            if (canvasData) {
              allCanvases.push(JSON.parse(canvasData));
            }
          }
        }
        if (allCanvases.length > 0) {
          loadMultipleCanvases(allCanvases);
        }
      }
    } catch (e) {
      console.error('Failed to load data:', e);
    }
  }, [loadNotebooks, loadMultipleCanvases]);

  // Auto-save debounce
  const markDirty = useCallback(() => {
    isDirtyRef.current = true;
    if (!autoSave) return;

    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      if (isDirtyRef.current) saveAll();
    }, autoSaveInterval * 1000);
  }, [autoSave, autoSaveInterval, saveAll]);

  // Keyboard shortcut Ctrl+S
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        saveAll();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [saveAll]);

  return { saveAll, saveCanvas, saveNotebooks, loadAll, markDirty };
}
