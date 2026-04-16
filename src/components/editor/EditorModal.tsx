// src/components/editor/EditorModal.tsx
import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Maximize2 } from 'lucide-react';
import { useCanvasStore } from '../../store/canvasStore';
import { useStorage } from '../../hooks/useStorage';
import RichEditor from './RichEditor';

export default function EditorModal() {
  const { t } = useTranslation();
  const { editorOpenCardId, canvases, currentCanvasId, updateCard, openEditor } = useCanvasStore();
  const { markDirty } = useStorage();
  const titleRef = useRef<HTMLInputElement>(null);

  const canvas = currentCanvasId ? canvases[currentCanvasId] : null;
  const card = canvas?.cards.find((c) => c.id === editorOpenCardId);

  useEffect(() => {
    if (card && titleRef.current) {
      titleRef.current.value = card.title || '';
    }
  }, [card?.id]); // eslint-disable-line

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && editorOpenCardId) openEditor(null);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [editorOpenCardId, openEditor]);

  if (!editorOpenCardId || !card || !currentCanvasId) return null;

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateCard(currentCanvasId, card.id, { title: e.target.value });
    markDirty();
  };

  const handleContentChange = (html: string) => {
    updateCard(currentCanvasId, card.id, { content: html });
    markDirty();
  };

  const CARD_COLORS: Record<string, string> = {
    default: 'var(--gn-bg-card)',
    yellow: 'var(--card-yellow-bg)',
    blue:   'var(--card-blue-bg)',
    green:  'var(--card-green-bg)',
    pink:   'var(--card-pink-bg)',
    purple: 'var(--card-purple-bg)',
    orange: 'var(--card-orange-bg)',
    red:    'var(--card-red-bg)',
  };

  return (
    /* Backdrop */
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'var(--gn-bg-overlay)',
        zIndex: 500,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 32,
        animation: 'fadeIn 0.15s ease',
      }}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) openEditor(null);
      }}
    >
      {/* Modal */}
      <div
        style={{
          width: '100%',
          maxWidth: 900,
          height: '100%',
          maxHeight: 700,
          background: CARD_COLORS[card.color] || 'var(--gn-bg-card)',
          borderRadius: 'var(--gn-radius-xl)',
          boxShadow: 'var(--gn-shadow-lg)',
          border: '1px solid var(--gn-border-default)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          animation: 'scaleIn 0.15s ease',
        }}
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '10px 14px',
            borderBottom: '1px solid var(--gn-border-subtle)',
            flexShrink: 0,
            background: 'rgba(0,0,0,0.02)',
          }}
        >
          {/* Color pills */}
          <div style={{ display: 'flex', gap: 4, marginRight: 2 }}>
            {(['default','yellow','blue','green','pink','purple','orange','red'] as const).map((color) => (
              <button
                key={color}
                onClick={() => { updateCard(currentCanvasId, card.id, { color }); markDirty(); }}
                style={{
                  width: 13,
                  height: 13,
                  borderRadius: '50%',
                  border: card.color === color ? '2px solid var(--gn-accent)' : '1px solid var(--gn-border-default)',
                  background: CARD_COLORS[color],
                  cursor: 'pointer',
                  flexShrink: 0,
                  transition: 'transform 0.1s',
                }}
              />
            ))}
          </div>

          {/* Title input */}
          <input
            ref={titleRef}
            defaultValue={card.title}
            onChange={handleTitleChange}
            placeholder={t('editor.title')}
            style={{
              flex: 1,
              border: 'none',
              background: 'transparent',
              outline: 'none',
              fontSize: 17,
              fontWeight: 600,
              color: 'var(--gn-text-primary)',
              padding: '2px 4px',
              borderRadius: 4,
            }}
          />

          {/* Close */}
          <button
            className="gn-btn gn-btn-icon"
            onClick={() => openEditor(null)}
            data-tooltip={t('editor.close')}
          >
            <X size={16} />
          </button>
        </div>

        {/* Editor */}
        <div style={{ flex: 1, overflow: 'hidden' }}>
          <RichEditor
            content={card.content}
            onUpdate={handleContentChange}
            autoFocus
          />
        </div>
      </div>
    </div>
  );
}
