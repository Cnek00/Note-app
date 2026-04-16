// src/components/canvas/NoteCard.tsx
import React, { memo, useCallback, useRef, useState } from 'react';
import { NodeProps, Handle, Position, NodeResizer } from '@xyflow/react';
import { useCanvasStore } from '../../store/canvasStore';
import { useStorage } from '../../hooks/useStorage';
import { NoteCard as NoteCardType } from '../../types';
import { Edit3, Trash2, Copy, X } from 'lucide-react';
import RichEditor from '../editor/RichEditor';
import { CardContextMenu } from '../cards/CardContextMenu';

const CARD_BG: Record<string, string> = {
  default: 'var(--card-default-bg)',
  yellow:  'var(--card-yellow-bg)',
  blue:    'var(--card-blue-bg)',
  green:   'var(--card-green-bg)',
  pink:    'var(--card-pink-bg)',
  purple:  'var(--card-purple-bg)',
  orange:  'var(--card-orange-bg)',
  red:     'var(--card-red-bg)',
};

const CARD_BORDER: Record<string, string> = {
  default: 'var(--card-default-border)',
  yellow:  'var(--card-yellow-border)',
  blue:    'var(--card-blue-border)',
  green:   'var(--card-green-border)',
  pink:    'var(--card-pink-border)',
  purple:  'var(--card-purple-border)',
  orange:  'var(--card-orange-border)',
  red:     'var(--card-red-border)',
};

function NoteCardNode({ id, data, selected }: NodeProps) {
  const card = data as unknown as NoteCardType;
  const { updateCard, deleteCard, duplicateCard, openEditor, currentCanvasId } = useCanvasStore();
  const { markDirty } = useStorage();
  const [showActions, setShowActions] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);
  const titleRef = useRef<HTMLInputElement>(null);
  const clickTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const clickCountRef = useRef(0);

  const canvasId = currentCanvasId || card.canvasId;

  const handleTitleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    updateCard(canvasId, id, { title: e.target.value });
    markDirty();
  }, [canvasId, id, updateCard, markDirty]);

  const handleContentChange = useCallback((html: string) => {
    updateCard(canvasId, id, { content: html });
    markDirty();
  }, [canvasId, id, updateCard, markDirty]);

  // Double-click → open fullscreen editor
  const handleCardClick = useCallback((e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.tiptap-editor')) return;
    
    clickCountRef.current += 1;
    if (clickTimerRef.current) clearTimeout(clickTimerRef.current);
    
    clickTimerRef.current = setTimeout(() => {
      if (clickCountRef.current >= 2) {
        openEditor(id);
      }
      clickCountRef.current = 0;
    }, 250);
  }, [id, openEditor]);

  // Right-click → show context menu
  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({ x: e.clientX, y: e.clientY });
  }, []);

  const bg = CARD_BG[card.color] || CARD_BG.default;
  const borderColor = selected
    ? 'var(--gn-accent)'
    : CARD_BORDER[card.color] || CARD_BORDER.default;

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: bg,
        borderRadius: 'var(--gn-radius-md)',
        border: `1.5px solid ${borderColor}`,
        boxShadow: selected ? 'var(--gn-shadow-card-hover)' : 'var(--gn-shadow-card)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        transition: 'box-shadow 0.15s, border-color 0.15s',
        cursor: 'default',
        position: 'relative',
      }}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
      onClick={handleCardClick}
      onContextMenu={handleContextMenu}
    >
      {/* Resize handles (from XYFlow) */}
      <NodeResizer
        minWidth={160}
        minHeight={100}
        isVisible={selected}
        lineStyle={{ borderColor: 'var(--gn-accent)', borderWidth: 1 }}
        handleStyle={{
          width: 8,
          height: 8,
          borderRadius: 2,
          background: 'var(--gn-accent)',
          border: '1.5px solid white',
        }}
      />

      {/* Connection handles */}
      <Handle type="target" position={Position.Top} id="top" />
      <Handle type="source" position={Position.Bottom} id="bottom" />
      <Handle type="source" position={Position.Right} id="right" />
      <Handle type="target" position={Position.Left} id="left" />

      {/* Card header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          padding: '5px 8px 4px',
          borderBottom: '1px solid var(--gn-border-subtle)',
          flexShrink: 0,
          minHeight: 32,
          background: 'rgba(0,0,0,0.015)',
        }}
      >
        {/* Color dot */}
        <div
          style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: CARD_BORDER[card.color] || 'var(--gn-text-tertiary)',
            flexShrink: 0,
          }}
        />

        {/* Title */}
        {isEditingTitle ? (
          <input
            ref={titleRef}
            defaultValue={card.title}
            onChange={handleTitleChange}
            autoFocus
            onBlur={() => setIsEditingTitle(false)}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === 'Escape') setIsEditingTitle(false); }}
            onClick={(e) => e.stopPropagation()}
            style={{
              flex: 1,
              border: 'none',
              background: 'transparent',
              outline: 'none',
              fontSize: 12,
              fontWeight: 600,
              color: 'var(--gn-text-primary)',
              padding: '1px 2px',
            }}
          />
        ) : (
          <span
            style={{
              flex: 1,
              fontSize: 12,
              fontWeight: 600,
              color: card.title ? 'var(--gn-text-primary)' : 'var(--gn-text-tertiary)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              cursor: 'text',
            }}
            onDoubleClick={(e) => {
              e.stopPropagation();
              setIsEditingTitle(true);
            }}
          >
            {card.title || 'Untitled'}
          </span>
        )}

        {/* Action buttons (visible on hover or selected) */}
        <div
          style={{
            display: 'flex',
            gap: 2,
            opacity: showActions || selected ? 1 : 0,
            transition: 'opacity 0.1s',
            flexShrink: 0,
          }}
        >
          <button
            className="gn-btn gn-btn-icon"
            style={{ padding: 3, width: 20, height: 20 }}
            onClick={(e) => { e.stopPropagation(); openEditor(id); }}
            data-tooltip="Open editor"
          >
            <Edit3 size={11} />
          </button>
          <button
            className="gn-btn gn-btn-icon"
            style={{ padding: 3, width: 20, height: 20 }}
            onClick={(e) => { e.stopPropagation(); duplicateCard(canvasId, id); markDirty(); }}
            data-tooltip="Duplicate"
          >
            <Copy size={11} />
          </button>
          <button
            className="gn-btn gn-btn-icon gn-btn-danger"
            style={{ padding: 3, width: 20, height: 20 }}
            onClick={(e) => { e.stopPropagation(); deleteCard(canvasId, id); markDirty(); }}
            data-tooltip="Delete"
          >
            <Trash2 size={11} />
          </button>
        </div>
      </div>

      {/* Content area - compact editor */}
      <div
        style={{
          flex: 1,
          overflow: 'hidden',
          padding: 0,
        }}
        onClick={(e) => e.stopPropagation()} // prevent card click when editing
      >
        <RichEditor
          content={card.content}
          onUpdate={handleContentChange}
          compact
          showToolbar={false}
          style={{ height: '100%' }}
        />
      </div>

      {/* Tags */}
      {card.tags.length > 0 && (
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 3,
            padding: '3px 8px',
            borderTop: '1px solid var(--gn-border-subtle)',
          }}
        >
          {card.tags.map((tag) => (
            <span
              key={tag}
              style={{
                fontSize: 9,
                background: 'var(--gn-accent-light)',
                color: 'var(--gn-accent)',
                padding: '1px 5px',
                borderRadius: 3,
              }}
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Context Menu */}
      {contextMenu && (
        <CardContextMenu
          card={card}
          x={contextMenu.x}
          y={contextMenu.y}
          onClose={() => setContextMenu(null)}
          onEdit={() => openEditor(id)}
          onDuplicate={() => {
            duplicateCard(canvasId, id);
            markDirty();
          }}
          onDelete={() => {
            deleteCard(canvasId, id);
            markDirty();
          }}
        />
      )}
    </div>
  );
}

export default memo(NoteCardNode);
