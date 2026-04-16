// src/types/index.ts

export interface NoteCard {
  id: string;
  title: string;
  content: string; // TipTap HTML content
  x: number;
  y: number;
  width: number;
  height: number;
  color: CardColor;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  notebookId: string;
  canvasId: string;
}

export type CardColor =
  | 'default'
  | 'yellow'
  | 'blue'
  | 'green'
  | 'pink'
  | 'purple'
  | 'orange'
  | 'red';

export interface CardConnection {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
  label?: string;
  color?: string;
  style?: 'solid' | 'dashed' | 'dotted';
  animated?: boolean;
}

export interface Canvas {
  id: string;
  name: string;
  notebookId: string;
  cards: NoteCard[];
  connections: CardConnection[];
  viewportX: number;
  viewportY: number;
  viewportZoom: number;
  createdAt: string;
  updatedAt: string;
}

export interface Notebook {
  id: string;
  name: string;
  icon: string;
  color: string;
  parentId?: string;
  canvases: string[]; // canvas IDs
  createdAt: string;
  updatedAt: string;
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'system';
  language: 'tr' | 'en' | 'de';
  snapToGrid: boolean;
  gridSize: number;
  autoSave: boolean;
  autoSaveInterval: number; // seconds
  fontSize: number;
  defaultCardColor: CardColor;
  defaultCardWidth: number;
  defaultCardHeight: number;
}

export interface SearchResult {
  cardId: string;
  canvasId: string;
  notebookId: string;
  title: string;
  excerpt: string;
  matchCount: number;
}
