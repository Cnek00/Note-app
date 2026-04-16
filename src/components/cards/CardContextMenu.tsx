// src/components/cards/CardContextMenu.tsx
import React, { useState, useRef, useEffect } from 'react';
import { NoteCard } from '../../types';
import {
  exportCardAsJSON,
  exportCardAsMarkdown,
  exportCardAsHTML,
  exportCardAsPDF,
  exportCardAsText,
} from '../../utils/cardExport';
import {
  Download,
  FileJson,
  FileText,
  Copy,
  Trash2,
  Edit,
} from 'lucide-react';
import './CardContextMenu.css';

interface CardContextMenuProps {
  card: NoteCard;
  x: number;
  y: number;
  onClose: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onDuplicate?: () => void;
}

export const CardContextMenu: React.FC<CardContextMenuProps> = ({
  card,
  x,
  y,
  onClose,
  onEdit,
  onDelete,
  onDuplicate,
}) => {
  const [exporting, setExporting] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const handleExport = async (format: string) => {
    setExporting(format);
    try {
      switch (format) {
        case 'json':
          exportCardAsJSON(card);
          break;
        case 'markdown':
          exportCardAsMarkdown(card);
          break;
        case 'html':
          exportCardAsHTML(card);
          break;
        case 'pdf':
          await exportCardAsPDF(card);
          break;
        case 'text':
          exportCardAsText(card);
          break;
        default:
          break;
      }
      onClose();
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed');
    } finally {
      setExporting(null);
    }
  };

  return (
    <div
      ref={menuRef}
      className="card-context-menu"
      style={{
        position: 'fixed',
        top: `${y}px`,
        left: `${x}px`,
      }}
    >
      {/* Main Actions */}
      {onEdit && (
        <button
          className="context-menu-item"
          onClick={() => {
            onEdit();
            onClose();
          }}
        >
          <Edit size={16} /> Edit Note
        </button>
      )}

      {onDuplicate && (
        <button
          className="context-menu-item"
          onClick={() => {
            onDuplicate();
            onClose();
          }}
        >
          <Copy size={16} /> Duplicate
        </button>
      )}

      <div className="menu-divider" />

      {/* Export Section */}
      <div className="menu-section">
        <div className="menu-section-title">Save As:</div>

        <button
          className="context-menu-item"
          onClick={() => handleExport('json')}
          disabled={exporting === 'json'}
        >
          <FileJson size={16} /> JSON
        </button>

        <button
          className="context-menu-item"
          onClick={() => handleExport('markdown')}
          disabled={exporting === 'markdown'}
        >
          <FileText size={16} /> Markdown
        </button>

        <button
          className="context-menu-item"
          onClick={() => handleExport('html')}
          disabled={exporting === 'html'}
        >
          📄 HTML
        </button>

        <button
          className="context-menu-item"
          onClick={() => handleExport('pdf')}
          disabled={exporting === 'pdf'}
        >
          📑 PDF
        </button>

        <button
          className="context-menu-item"
          onClick={() => handleExport('text')}
          disabled={exporting === 'text'}
        >
          📝 Text
        </button>
      </div>

      <div className="menu-divider" />

      {/* Delete Action */}
      {onDelete && (
        <button
          className="context-menu-item delete-item"
          onClick={() => {
            onDelete();
            onClose();
          }}
        >
          <Trash2 size={16} /> Delete
        </button>
      )}

      {/* Info */}
      <div className="menu-divider" />
      <div className="menu-info">
        <small>{card.title || 'Untitled'}</small>
      </div>
    </div>
  );
};

export default CardContextMenu;
