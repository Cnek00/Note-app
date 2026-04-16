// src/store/notebookStore.ts
import { create } from 'zustand';
import { Notebook } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface NotebookState {
  notebooks: Notebook[];
  activeNotebookId: string | null;

  createNotebook: (name?: string, parentId?: string) => Notebook;
  updateNotebook: (id: string, updates: Partial<Notebook>) => void;
  deleteNotebook: (id: string) => void;
  setActiveNotebook: (id: string | null) => void;
  addCanvasToNotebook: (notebookId: string, canvasId: string) => void;
  removeCanvasFromNotebook: (notebookId: string, canvasId: string) => void;
  getNotebook: (id: string) => Notebook | undefined;
  loadNotebooks: (notebooks: Notebook[]) => void;
}

const NOTEBOOK_ICONS = ['📓', '📔', '📒', '📕', '📗', '📘', '📙', '🗒️', '📋', '📝'];
const NOTEBOOK_COLORS = [
  '#6366f1', '#8b5cf6', '#ec4899', '#ef4444',
  '#f97316', '#eab308', '#22c55e', '#14b8a6', '#3b82f6',
];

export const useNotebookStore = create<NotebookState>()((set, get) => ({
  notebooks: [],
  activeNotebookId: null,

  createNotebook: (name, parentId) => {
    const notebook: Notebook = {
      id: uuidv4(),
      name: name || 'Untitled Notebook',
      icon: NOTEBOOK_ICONS[Math.floor(Math.random() * NOTEBOOK_ICONS.length)],
      color: NOTEBOOK_COLORS[Math.floor(Math.random() * NOTEBOOK_COLORS.length)],
      parentId,
      canvases: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    set((s) => ({ notebooks: [...s.notebooks, notebook] }));
    return notebook;
  },

  updateNotebook: (id, updates) =>
    set((s) => ({
      notebooks: s.notebooks.map((n) =>
        n.id === id ? { ...n, ...updates, updatedAt: new Date().toISOString() } : n
      ),
    })),

  deleteNotebook: (id) =>
    set((s) => ({
      notebooks: s.notebooks.filter((n) => n.id !== id && n.parentId !== id),
      activeNotebookId: s.activeNotebookId === id ? null : s.activeNotebookId,
    })),

  setActiveNotebook: (id) => set({ activeNotebookId: id }),

  addCanvasToNotebook: (notebookId, canvasId) =>
    set((s) => ({
      notebooks: s.notebooks.map((n) =>
        n.id === notebookId && !n.canvases.includes(canvasId)
          ? { ...n, canvases: [...n.canvases, canvasId], updatedAt: new Date().toISOString() }
          : n
      ),
    })),

  removeCanvasFromNotebook: (notebookId, canvasId) =>
    set((s) => ({
      notebooks: s.notebooks.map((n) =>
        n.id === notebookId
          ? { ...n, canvases: n.canvases.filter((id) => id !== canvasId), updatedAt: new Date().toISOString() }
          : n
      ),
    })),

  getNotebook: (id) => get().notebooks.find((n) => n.id === id),

  loadNotebooks: (notebooks) => set({ notebooks }),
}));
