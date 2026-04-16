// src/components/sidebar/Sidebar.tsx
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Plus, Search, Settings, ChevronRight, ChevronDown,
  FileText, FolderOpen, Trash2, Edit3, Globe
} from 'lucide-react';
import { useNotebookStore } from '../../store/notebookStore';
import { useCanvasStore } from '../../store/canvasStore';
import { useSettingsStore } from '../../store/settingsStore';
import { useStorage } from '../../hooks/useStorage';

export default function Sidebar() {
  const { t } = useTranslation();
  const {
    notebooks, activeNotebookId, createNotebook, setActiveNotebook,
    deleteNotebook, updateNotebook
  } = useNotebookStore();
  const {
    canvases, currentCanvasId, createCanvas, setCurrentCanvas,
    deleteCanvas
  } = useCanvasStore();
  const { language, setLanguage } = useSettingsStore();
  const { saveAll } = useStorage();

  const [expandedNotebooks, setExpandedNotebooks] = useState<Record<string, boolean>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const { addCanvasToNotebook } = useNotebookStore();

  const toggleNotebook = (id: string) =>
    setExpandedNotebooks((s) => ({ ...s, [id]: !s[id] }));

  const handleCreateNotebook = () => {
    const nb = createNotebook(t('notebook.untitled'));
    setExpandedNotebooks((s) => ({ ...s, [nb.id]: true }));
    setActiveNotebook(nb.id);
    // auto-create first canvas
    handleCreateCanvas(nb.id);
  };

  const handleCreateCanvas = (notebookId: string) => {
    const canvas = createCanvas(notebookId, t('canvas.untitledCanvas'));
    addCanvasToNotebook(notebookId, canvas.id);
    setCurrentCanvas(canvas.id);
    setActiveNotebook(notebookId);
    saveAll();
  };

  const handleSelectCanvas = (notebookId: string, canvasId: string) => {
    setActiveNotebook(notebookId);
    setCurrentCanvas(canvasId);
  };

  const startRename = (id: string, currentName: string) => {
    setRenamingId(id);
    setRenameValue(currentName);
  };

  const commitRename = (isNotebook: boolean, id: string) => {
    if (renameValue.trim()) {
      if (isNotebook) {
        updateNotebook(id, { name: renameValue.trim() });
      } else {
        // find canvas in store and update
        const canvas = canvases[id];
        if (canvas) {
          useCanvasStore.getState().updateCanvas(id, { name: renameValue.trim() });
        }
      }
    }
    setRenamingId(null);
  };

  const rootNotebooks = notebooks.filter((n) => !n.parentId);

  const LANGS = [
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'tr', label: 'Türkçe', flag: '🇹🇷' },
    { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  ] as const;

  return (
    <div
      style={{
        width: 'var(--gn-sidebar-width)',
        height: '100%',
        background: 'var(--gn-bg-sidebar)',
        borderRight: '1px solid var(--gn-border-subtle)',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        overflowY: 'auto',
      }}
    >
      {/* Search */}
      <div style={{ padding: '10px 10px 6px' }}>
        <div style={{ position: 'relative' }}>
          <Search
            size={13}
            style={{
              position: 'absolute',
              left: 9,
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--gn-text-tertiary)',
              pointerEvents: 'none',
            }}
          />
          <input
            className="gn-input"
            placeholder={t('sidebar.search')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: 28, fontSize: 12, padding: '6px 8px 6px 28px' }}
          />
        </div>
      </div>

      {/* Notebooks header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '6px 10px 4px',
          gap: 4,
        }}
      >
        <span
          style={{
            fontSize: 11,
            fontWeight: 600,
            color: 'var(--gn-text-tertiary)',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            flex: 1,
          }}
        >
          {t('sidebar.notebooks')}
        </span>
        <button
          className="gn-btn gn-btn-icon"
          onClick={handleCreateNotebook}
          data-tooltip={t('sidebar.newNotebook')}
        >
          <Plus size={14} />
        </button>
      </div>

      {/* Notebook tree */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '2px 6px' }}>
        {rootNotebooks.map((nb) => {
          const isExpanded = expandedNotebooks[nb.id] ?? true;
          const isActive = nb.id === activeNotebookId;
          const nbCanvases = nb.canvases
            .map((id) => canvases[id])
            .filter(Boolean);

          return (
            <div key={nb.id}>
              {/* Notebook row */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  padding: '4px 6px',
                  borderRadius: 'var(--gn-radius-sm)',
                  cursor: 'pointer',
                  background: isActive ? 'var(--gn-accent-light)' : 'transparent',
                  color: isActive ? 'var(--gn-accent)' : 'var(--gn-text-primary)',
                  transition: 'background 0.1s',
                }}
                onClick={() => {
                  toggleNotebook(nb.id);
                  setActiveNotebook(nb.id);
                }}
              >
                <button
                  onClick={(e) => { e.stopPropagation(); toggleNotebook(nb.id); }}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 0,
                    color: 'inherit',
                    display: 'flex',
                    alignItems: 'center',
                    opacity: 0.6,
                  }}
                >
                  {isExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                </button>

                <span style={{ fontSize: 14 }}>{nb.icon}</span>

                {renamingId === nb.id ? (
                  <input
                    className="gn-input"
                    value={renameValue}
                    autoFocus
                    onChange={(e) => setRenameValue(e.target.value)}
                    onBlur={() => commitRename(true, nb.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') commitRename(true, nb.id);
                      if (e.key === 'Escape') setRenamingId(null);
                      e.stopPropagation();
                    }}
                    onClick={(e) => e.stopPropagation()}
                    style={{ padding: '1px 4px', fontSize: 12, flex: 1, height: 22 }}
                  />
                ) : (
                  <span
                    style={{ fontSize: 12, fontWeight: 500, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                    onDoubleClick={(e) => { e.stopPropagation(); startRename(nb.id, nb.name); }}
                  >
                    {nb.name}
                  </span>
                )}

                {/* Actions (shown on hover via CSS sibling trick — simplified inline) */}
                <div style={{ display: 'flex', gap: 2 }}>
                  <button
                    className="gn-btn gn-btn-icon"
                    style={{ opacity: 0.5, padding: 2 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCreateCanvas(nb.id);
                    }}
                    data-tooltip={t('sidebar.newCanvas')}
                  >
                    <Plus size={11} />
                  </button>
                  <button
                    className="gn-btn gn-btn-icon"
                    style={{ opacity: 0.5, padding: 2 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      startRename(nb.id, nb.name);
                    }}
                  >
                    <Edit3 size={11} />
                  </button>
                  <button
                    className="gn-btn gn-btn-icon gn-btn-danger"
                    style={{ opacity: 0.4, padding: 2 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm(t('notebook.deleteConfirm'))) {
                        deleteNotebook(nb.id);
                      }
                    }}
                  >
                    <Trash2 size={11} />
                  </button>
                </div>
              </div>

              {/* Canvases */}
              {isExpanded && (
                <div style={{ paddingLeft: 20 }}>
                  {nbCanvases.map((canvas) => {
                    const isCurrentCanvas = canvas.id === currentCanvasId;
                    return (
                      <div
                        key={canvas.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 6,
                          padding: '3px 6px',
                          borderRadius: 'var(--gn-radius-sm)',
                          cursor: 'pointer',
                          background: isCurrentCanvas ? 'var(--gn-accent-light)' : 'transparent',
                          color: isCurrentCanvas ? 'var(--gn-accent)' : 'var(--gn-text-secondary)',
                          transition: 'background 0.1s',
                          fontSize: 12,
                        }}
                        onClick={() => handleSelectCanvas(nb.id, canvas.id)}
                      >
                        <FileText size={11} style={{ opacity: 0.7 }} />
                        {renamingId === canvas.id ? (
                          <input
                            className="gn-input"
                            value={renameValue}
                            autoFocus
                            onChange={(e) => setRenameValue(e.target.value)}
                            onBlur={() => commitRename(false, canvas.id)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') commitRename(false, canvas.id);
                              if (e.key === 'Escape') setRenamingId(null);
                              e.stopPropagation();
                            }}
                            onClick={(e) => e.stopPropagation()}
                            style={{ padding: '1px 4px', fontSize: 11, flex: 1, height: 20 }}
                          />
                        ) : (
                          <span style={{ flex: 1 }}
                            onDoubleClick={(e) => { e.stopPropagation(); startRename(canvas.id, canvas.name); }}
                          >
                            {canvas.name}
                          </span>
                        )}
                        <button
                          className="gn-btn gn-btn-icon gn-btn-danger"
                          style={{ opacity: 0.4, padding: 1 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (confirm(`Delete "${canvas.name}"?`)) {
                              deleteCanvas(canvas.id);
                            }
                          }}
                        >
                          <Trash2 size={10} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}

        {notebooks.length === 0 && (
          <div
            style={{
              padding: '20px 10px',
              textAlign: 'center',
              color: 'var(--gn-text-tertiary)',
              fontSize: 12,
            }}
          >
            <FolderOpen size={28} style={{ margin: '0 auto 8px', opacity: 0.4 }} />
            <div>No notebooks yet</div>
            <button
              className="gn-btn gn-btn-primary"
              onClick={handleCreateNotebook}
              style={{ marginTop: 10, fontSize: 12, padding: '5px 14px' }}
            >
              {t('sidebar.newNotebook')}
            </button>
          </div>
        )}
      </div>

      {/* Bottom: Language + Settings */}
      <div
        style={{
          borderTop: '1px solid var(--gn-border-subtle)',
          padding: '8px 10px',
          display: 'flex',
          gap: 6,
          alignItems: 'center',
        }}
      >
        {/* Language switcher */}
        <div style={{ display: 'flex', gap: 2, flex: 1 }}>
          {LANGS.map((l) => (
            <button
              key={l.code}
              className="gn-btn gn-btn-icon"
              onClick={() => setLanguage(l.code)}
              data-tooltip={l.label}
              style={{
                fontSize: 14,
                background: language === l.code ? 'var(--gn-accent-light)' : 'transparent',
                color: language === l.code ? 'var(--gn-accent)' : 'var(--gn-text-tertiary)',
              }}
            >
              {l.flag}
            </button>
          ))}
        </div>

        <button
          className="gn-btn gn-btn-icon"
          data-tooltip={t('sidebar.settings')}
          style={{ color: 'var(--gn-text-tertiary)' }}
        >
          <Settings size={15} />
        </button>
      </div>
    </div>
  );
}
