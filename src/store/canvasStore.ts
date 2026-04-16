// src/store/canvasStore.ts
import { create } from 'zustand';
import { NoteCard, CardConnection, Canvas } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface CanvasState {
  // Current canvas
  currentCanvasId: string | null;
  canvases: Record<string, Canvas>;

  // Active editing
  activeCardId: string | null;
  editorOpenCardId: string | null;
  selectedCardIds: string[];

  // Actions
  setCurrentCanvas: (canvasId: string) => void;
  createCanvas: (notebookId: string, name?: string) => Canvas;
  updateCanvas: (canvasId: string, updates: Partial<Canvas>) => void;
  deleteCanvas: (canvasId: string) => void;

  // Card actions
  addCard: (canvasId: string, x: number, y: number) => NoteCard;
  updateCard: (canvasId: string, cardId: string, updates: Partial<NoteCard>) => void;
  deleteCard: (canvasId: string, cardId: string) => void;
  duplicateCard: (canvasId: string, cardId: string) => NoteCard;
  setActiveCard: (cardId: string | null) => void;
  openEditor: (cardId: string | null) => void;
  setSelectedCards: (cardIds: string[]) => void;

  // Connection actions
  addConnection: (canvasId: string, source: string, target: string) => CardConnection;
  updateConnection: (canvasId: string, connId: string, updates: Partial<CardConnection>) => void;
  deleteConnection: (canvasId: string, connId: string) => void;

  // Viewport
  updateViewport: (canvasId: string, x: number, y: number, zoom: number) => void;

  // Load from storage
  loadCanvas: (canvas: Canvas) => void;
  loadMultipleCanvases: (canvases: Canvas[]) => void;

  // Get helpers
  getCurrentCanvas: () => Canvas | null;
  getCards: (canvasId: string) => NoteCard[];
  getConnections: (canvasId: string) => CardConnection[];
}

export const useCanvasStore = create<CanvasState>()((set, get) => ({
  currentCanvasId: null,
  canvases: {},
  activeCardId: null,
  editorOpenCardId: null,
  selectedCardIds: [],

  setCurrentCanvas: (canvasId) => set({ currentCanvasId: canvasId }),

  createCanvas: (notebookId, name) => {
    const canvas: Canvas = {
      id: uuidv4(),
      name: name || 'Untitled Canvas',
      notebookId,
      cards: [],
      connections: [],
      viewportX: 0,
      viewportY: 0,
      viewportZoom: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    set((s) => ({
      canvases: { ...s.canvases, [canvas.id]: canvas },
      currentCanvasId: canvas.id,
    }));
    return canvas;
  },

  updateCanvas: (canvasId, updates) =>
    set((s) => ({
      canvases: {
        ...s.canvases,
        [canvasId]: {
          ...s.canvases[canvasId],
          ...updates,
          updatedAt: new Date().toISOString(),
        },
      },
    })),

  deleteCanvas: (canvasId) =>
    set((s) => {
      const { [canvasId]: _, ...rest } = s.canvases;
      return {
        canvases: rest,
        currentCanvasId: s.currentCanvasId === canvasId ? null : s.currentCanvasId,
      };
    }),

  addCard: (canvasId, x, y) => {
    const card: NoteCard = {
      id: uuidv4(),
      title: '',
      content: '',
      x,
      y,
      width: 280,
      height: 200,
      color: 'default',
      tags: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      notebookId: get().canvases[canvasId]?.notebookId || '',
      canvasId,
    };
    set((s) => ({
      canvases: {
        ...s.canvases,
        [canvasId]: {
          ...s.canvases[canvasId],
          cards: [...(s.canvases[canvasId]?.cards || []), card],
          updatedAt: new Date().toISOString(),
        },
      },
    }));
    return card;
  },

  updateCard: (canvasId, cardId, updates) =>
    set((s) => ({
      canvases: {
        ...s.canvases,
        [canvasId]: {
          ...s.canvases[canvasId],
          cards: s.canvases[canvasId]?.cards.map((c) =>
            c.id === cardId
              ? { ...c, ...updates, updatedAt: new Date().toISOString() }
              : c
          ) || [],
          updatedAt: new Date().toISOString(),
        },
      },
    })),

  deleteCard: (canvasId, cardId) =>
    set((s) => ({
      canvases: {
        ...s.canvases,
        [canvasId]: {
          ...s.canvases[canvasId],
          cards: s.canvases[canvasId]?.cards.filter((c) => c.id !== cardId) || [],
          connections: s.canvases[canvasId]?.connections.filter(
            (conn) => conn.source !== cardId && conn.target !== cardId
          ) || [],
          updatedAt: new Date().toISOString(),
        },
      },
      activeCardId: s.activeCardId === cardId ? null : s.activeCardId,
      editorOpenCardId: s.editorOpenCardId === cardId ? null : s.editorOpenCardId,
    })),

  duplicateCard: (canvasId, cardId) => {
    const card = get().canvases[canvasId]?.cards.find((c) => c.id === cardId);
    if (!card) throw new Error('Card not found');
    const newCard: NoteCard = {
      ...card,
      id: uuidv4(),
      x: card.x + 30,
      y: card.y + 30,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    set((s) => ({
      canvases: {
        ...s.canvases,
        [canvasId]: {
          ...s.canvases[canvasId],
          cards: [...(s.canvases[canvasId]?.cards || []), newCard],
          updatedAt: new Date().toISOString(),
        },
      },
    }));
    return newCard;
  },

  setActiveCard: (cardId) => set({ activeCardId: cardId }),
  openEditor: (cardId) => set({ editorOpenCardId: cardId }),
  setSelectedCards: (cardIds) => set({ selectedCardIds: cardIds }),

  addConnection: (canvasId, source, target) => {
    const conn: CardConnection = {
      id: uuidv4(),
      source,
      target,
      style: 'solid',
      color: '#6366f1',
    };
    set((s) => ({
      canvases: {
        ...s.canvases,
        [canvasId]: {
          ...s.canvases[canvasId],
          connections: [...(s.canvases[canvasId]?.connections || []), conn],
          updatedAt: new Date().toISOString(),
        },
      },
    }));
    return conn;
  },

  updateConnection: (canvasId, connId, updates) =>
    set((s) => ({
      canvases: {
        ...s.canvases,
        [canvasId]: {
          ...s.canvases[canvasId],
          connections: s.canvases[canvasId]?.connections.map((c) =>
            c.id === connId ? { ...c, ...updates } : c
          ) || [],
          updatedAt: new Date().toISOString(),
        },
      },
    })),

  deleteConnection: (canvasId, connId) =>
    set((s) => ({
      canvases: {
        ...s.canvases,
        [canvasId]: {
          ...s.canvases[canvasId],
          connections: s.canvases[canvasId]?.connections.filter((c) => c.id !== connId) || [],
          updatedAt: new Date().toISOString(),
        },
      },
    })),

  updateViewport: (canvasId, x, y, zoom) =>
    set((s) => ({
      canvases: {
        ...s.canvases,
        [canvasId]: {
          ...s.canvases[canvasId],
          viewportX: x,
          viewportY: y,
          viewportZoom: zoom,
        },
      },
    })),

  loadCanvas: (canvas) =>
    set((s) => ({ canvases: { ...s.canvases, [canvas.id]: canvas } })),

  loadMultipleCanvases: (canvases) =>
    set((s) => ({
      canvases: {
        ...s.canvases,
        ...Object.fromEntries(canvases.map((c) => [c.id, c])),
      },
    })),

  getCurrentCanvas: () => {
    const { currentCanvasId, canvases } = get();
    return currentCanvasId ? canvases[currentCanvasId] || null : null;
  },

  getCards: (canvasId) => get().canvases[canvasId]?.cards || [],
  getConnections: (canvasId) => get().canvases[canvasId]?.connections || [],
}));
