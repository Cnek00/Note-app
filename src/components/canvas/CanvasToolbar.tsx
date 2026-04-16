// src/components/canvas/CanvasToolbar.tsx
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Grid3X3, Save, Download, MoreHorizontal } from 'lucide-react';
import { useCanvasStore } from '../../store/canvasStore';
import { useStorage } from '../../hooks/useStorage';
import { useSettingsStore } from '../../store/settingsStore';

interface Props { canvasId: string; onAddCard: () => void; }

const CARD_COLORS = [
  { id: 'default', bg: 'var(--card-default-bg)', border: 'var(--card-default-border)' },
  { id: 'yellow',  bg: 'var(--card-yellow-bg)',  border: 'var(--card-yellow-border)' },
  { id: 'blue',    bg: 'var(--card-blue-bg)',    border: 'var(--card-blue-border)' },
  { id: 'green',   bg: 'var(--card-green-bg)',   border: 'var(--card-green-border)' },
  { id: 'pink',    bg: 'var(--card-pink-bg)',    border: 'var(--card-pink-border)' },
  { id: 'purple',  bg: 'var(--card-purple-bg)',  border: 'var(--card-purple-border)' },
  { id: 'orange',  bg: 'var(--card-orange-bg)',  border: 'var(--card-orange-border)' },
  { id: 'red',     bg: 'var(--card-red-bg)',     border: 'var(--card-red-border)' },
] as const;

export default function CanvasToolbar({ canvasId, onAddCard }: Props) {
  const { t } = useTranslation();
  const { canvases, updateCanvas } = useCanvasStore();
  const { saveAll } = useStorage();
  const { snapToGrid, toggleSnapToGrid } = useSettingsStore();
  const [saving, setSaving] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);

  const canvas = canvases[canvasId];

  const handleSave = async () => {
    setSaving(true);
    await saveAll();
    setTimeout(() => setSaving(false), 800);
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 4,
        background: 'var(--gn-bg-secondary)',
        border: '1px solid var(--gn-border-default)',
        borderRadius: 10,
        padding: '4px 6px',
        boxShadow: 'var(--gn-shadow-md)',
        animation: 'fadeIn 0.2s ease',
      }}
    >
      {/* Canvas name */}
      <input
        value={canvas?.name || ''}
        onChange={(e) => updateCanvas(canvasId, { name: e.target.value })}
        style={{
          border: 'none',
          background: 'transparent',
          outline: 'none',
          fontSize: 13,
          fontWeight: 500,
          color: 'var(--gn-text-primary)',
          padding: '2px 6px',
          minWidth: 80,
          maxWidth: 200,
          borderRadius: 4,
        }}
      />

      <div style={{ width: 1, height: 18, background: 'var(--gn-border-default)' }} />

      {/* Add card */}
      <div style={{ position: 'relative' }}>
        <button
          className="gn-btn"
          onClick={() => setShowColorPicker((p) => !p)}
          style={{ gap: 5, padding: '4px 10px', fontSize: 12 }}
        >
          <Plus size={13} />
          {t('canvas.addCard')}
        </button>

        {/* Color picker dropdown */}
        {showColorPicker && (
          <>
            <div
              style={{ position: 'fixed', inset: 0, zIndex: 98 }}
              onClick={() => setShowColorPicker(false)}
            />
            <div
              style={{
                position: 'absolute',
                top: 'calc(100% + 6px)',
                left: 0,
                background: 'var(--gn-bg-secondary)',
                border: '1px solid var(--gn-border-default)',
                borderRadius: 10,
                boxShadow: 'var(--gn-shadow-lg)',
                padding: 8,
                zIndex: 99,
                display: 'flex',
                gap: 4,
                animation: 'fadeIn 0.1s ease',
              }}
            >
              {CARD_COLORS.map((c) => (
                <button
                  key={c.id}
                  onClick={() => {
                    setShowColorPicker(false);
                    onAddCard();
                  }}
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 6,
                    border: `1.5px solid ${c.border}`,
                    background: c.bg,
                    cursor: 'pointer',
                    transition: 'transform 0.1s',
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = 'scale(1.2)'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = 'scale(1)'; }}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Snap to grid toggle */}
      <button
        className="gn-btn gn-btn-icon"
        onClick={toggleSnapToGrid}
        data-tooltip={t('canvas.snapToGrid')}
        style={{
          background: snapToGrid ? 'var(--gn-accent-light)' : 'transparent',
          color: snapToGrid ? 'var(--gn-accent)' : 'var(--gn-text-secondary)',
        }}
      >
        <Grid3X3 size={14} />
      </button>

      {/* Save */}
      <button
        className="gn-btn gn-btn-icon"
        onClick={handleSave}
        data-tooltip={saving ? 'Saved!' : t('actions.save') + ' (Ctrl+S)'}
        style={{
          color: saving ? 'var(--gn-success)' : 'var(--gn-text-secondary)',
        }}
      >
        {saving ? (
          <span style={{ fontSize: 12 }}>✓</span>
        ) : (
          <Save size={14} />
        )}
      </button>
    </div>
  );
}
