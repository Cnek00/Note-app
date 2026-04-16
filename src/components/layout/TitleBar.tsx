// src/components/layout/TitleBar.tsx
import React from 'react';
import { getCurrentWindow } from '@tauri-apps/api/window';
import { useSettingsStore } from '../../store/settingsStore';
import { useNotebookStore } from '../../store/notebookStore';
import { useCanvasStore } from '../../store/canvasStore';
import { Minus, Square, X, StickyNote } from 'lucide-react';

const isTauri = typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window;

export default function TitleBar() {
  const { theme, setTheme } = useSettingsStore();
  const { activeNotebookId, notebooks } = useNotebookStore();
  const { currentCanvasId, canvases } = useCanvasStore();

  const activeNotebook = notebooks.find((n) => n.id === activeNotebookId);
  const activeCanvas = currentCanvasId ? canvases[currentCanvasId] : null;

  const minimize = async () => {
    if (!isTauri) return;
    const win = getCurrentWindow();
    await win.minimize();
  };
  const maximize = async () => {
    if (!isTauri) return;
    const win = getCurrentWindow();
    await win.toggleMaximize();
  };
  const close = async () => {
    if (!isTauri) return;
    const win = getCurrentWindow();
    await win.close();
  };

  return (
    <div
      data-tauri-drag-region
      style={{
        height: 'var(--gn-titlebar-height)',
        background: 'var(--gn-bg-sidebar)',
        borderBottom: '1px solid var(--gn-border-subtle)',
        display: 'flex',
        alignItems: 'center',
        padding: '0 12px',
        gap: 8,
        flexShrink: 0,
        position: 'relative',
        zIndex: 100,
      }}
    >
      {/* App icon + name */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <StickyNote size={16} color="var(--gn-accent)" />
        <span style={{ fontWeight: 600, fontSize: 13, color: 'var(--gn-text-primary)' }}>
          GridNote
        </span>
      </div>

      {/* Breadcrumb */}
      {activeNotebook && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flex: 1 }}>
          <span style={{ color: 'var(--gn-border-strong)', fontSize: 12 }}>/</span>
          <span style={{ color: 'var(--gn-text-secondary)', fontSize: 12 }}>
            {activeNotebook.icon} {activeNotebook.name}
          </span>
          {activeCanvas && (
            <>
              <span style={{ color: 'var(--gn-border-strong)', fontSize: 12 }}>/</span>
              <span style={{ color: 'var(--gn-text-secondary)', fontSize: 12 }}>
                {activeCanvas.name}
              </span>
            </>
          )}
        </div>
      )}

      <div style={{ flex: 1 }} />

      {/* Theme toggle */}
      <button
        className="gn-btn gn-btn-icon"
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        data-tooltip={theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
        style={{ fontSize: 14 }}
      >
        {theme === 'dark' ? '☀️' : '🌙'}
      </button>

      {/* Window controls */}
      {isTauri && (
        <div style={{ display: 'flex', gap: 4, marginLeft: 4 }}>
          <button
            className="gn-btn gn-btn-icon"
            onClick={minimize}
            style={{ color: 'var(--gn-text-tertiary)' }}
          >
            <Minus size={13} />
          </button>
          <button
            className="gn-btn gn-btn-icon"
            onClick={maximize}
            style={{ color: 'var(--gn-text-tertiary)' }}
          >
            <Square size={12} />
          </button>
          <button
            className="gn-btn gn-btn-icon gn-btn-danger"
            onClick={close}
          >
            <X size={13} />
          </button>
        </div>
      )}
    </div>
  );
}
