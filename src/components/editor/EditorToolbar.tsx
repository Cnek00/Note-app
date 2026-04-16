// src/components/editor/EditorToolbar.tsx
import React, { useState } from 'react';
import { Editor } from '@tiptap/react';
import { useTranslation } from 'react-i18next';
import {
  Bold, Italic, Underline, Strikethrough, Code, Link,
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  List, ListOrdered, CheckSquare, Quote, Minus,
  Table, Image, Subscript, Superscript, RotateCcw, RotateCw,
  Highlighter, Palette, ChevronDown, Type
} from 'lucide-react';

interface Props { editor: Editor | null; compact?: boolean; }

const COLORS = [
  '#000000','#374151','#6b7280','#9ca3af','#ef4444','#f97316',
  '#eab308','#22c55e','#14b8a6','#3b82f6','#6366f1','#8b5cf6',
  '#ec4899','#ffffff','#fef2f2','#fff7ed','#fefce8','#f0fdf4',
  '#eff6ff','#faf5ff','#fdf2f8',
];

const FONT_SIZES = ['10','11','12','13','14','15','16','18','20','22','24','28','32','36','48','64','72'];
const FONTS = [
  'Inter', 'Arial', 'Times New Roman', 'Georgia', 'Courier New',
  'Verdana', 'Trebuchet MS', 'Comic Sans MS', 'Impact',
];

type DropdownType = 'textColor' | 'bgColor' | 'heading' | 'font' | 'fontSize' | null;

export default function EditorToolbar({ editor, compact = false }: Props) {
  const { t } = useTranslation();
  const [activeDropdown, setActiveDropdown] = useState<DropdownType>(null);

  if (!editor) return null;

  const toggle = (type: DropdownType) =>
    setActiveDropdown((p) => (p === type ? null : type));

  const closeAll = () => setActiveDropdown(null);

  const Btn = ({
    onClick, active, disabled, tooltip, children,
  }: {
    onClick: () => void;
    active?: boolean;
    disabled?: boolean;
    tooltip?: string;
    children: React.ReactNode;
  }) => (
    <button
      onMouseDown={(e) => { e.preventDefault(); onClick(); }}
      disabled={disabled}
      data-tooltip={tooltip}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: compact ? 26 : 28,
        height: compact ? 26 : 28,
        borderRadius: 5,
        border: 'none',
        cursor: disabled ? 'default' : 'pointer',
        background: active ? 'var(--gn-accent-light)' : 'transparent',
        color: active ? 'var(--gn-accent)' : disabled ? 'var(--gn-text-tertiary)' : 'var(--gn-text-primary)',
        fontSize: 13,
        transition: 'background 0.1s, color 0.1s',
      }}
      onMouseEnter={(e) => { if (!active && !disabled) (e.currentTarget as HTMLElement).style.background = 'var(--gn-bg-tertiary)'; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = active ? 'var(--gn-accent-light)' : 'transparent'; }}
    >
      {children}
    </button>
  );

  const Divider = () => (
    <div style={{ width: 1, height: 18, background: 'var(--gn-border-default)', margin: '0 2px', flexShrink: 0 }} />
  );

  const insertTable = () => {
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
    closeAll();
  };

  const ColorPicker = ({ type }: { type: 'text' | 'bg' }) => (
    <div
      style={{
        position: 'absolute',
        top: 'calc(100% + 4px)',
        left: 0,
        background: 'var(--gn-bg-secondary)',
        border: '1px solid var(--gn-border-default)',
        borderRadius: 'var(--gn-radius-md)',
        boxShadow: 'var(--gn-shadow-lg)',
        padding: 8,
        zIndex: 1000,
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 22px)',
        gap: 3,
        width: 188,
        animation: 'fadeIn 0.1s ease',
      }}
    >
      {COLORS.map((color) => (
        <button
          key={color}
          onMouseDown={(e) => {
            e.preventDefault();
            if (type === 'text') {
              editor.chain().focus().setColor(color).run();
            } else {
              editor.chain().focus().toggleHighlight({ color }).run();
            }
            closeAll();
          }}
          style={{
            width: 22,
            height: 22,
            borderRadius: 4,
            border: color === '#ffffff' ? '1px solid var(--gn-border-default)' : '1px solid transparent',
            background: color,
            cursor: 'pointer',
            transition: 'transform 0.1s',
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = 'scale(1.2)'; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = 'scale(1)'; }}
        />
      ))}
      {type === 'text' && (
        <button
          onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().unsetColor().run(); closeAll(); }}
          style={{
            gridColumn: '1 / -1',
            padding: '3px 6px',
            marginTop: 4,
            fontSize: 11,
            border: '1px solid var(--gn-border-default)',
            borderRadius: 4,
            cursor: 'pointer',
            background: 'transparent',
            color: 'var(--gn-text-secondary)',
          }}
        >
          Clear color
        </button>
      )}
    </div>
  );

  const HeadingDropdown = () => (
    <div
      style={{
        position: 'absolute',
        top: 'calc(100% + 4px)',
        left: 0,
        background: 'var(--gn-bg-secondary)',
        border: '1px solid var(--gn-border-default)',
        borderRadius: 'var(--gn-radius-md)',
        boxShadow: 'var(--gn-shadow-lg)',
        overflow: 'hidden',
        zIndex: 1000,
        minWidth: 160,
        animation: 'fadeIn 0.1s ease',
      }}
    >
      {[
        { label: 'Paragraph', action: () => editor.chain().focus().setParagraph().run() },
        { label: 'Heading 1', action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(), style: { fontSize: 18, fontWeight: 700 } },
        { label: 'Heading 2', action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(), style: { fontSize: 16, fontWeight: 600 } },
        { label: 'Heading 3', action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(), style: { fontSize: 14, fontWeight: 600 } },
      ].map(({ label, action, style: s }) => (
        <button
          key={label}
          onMouseDown={(e) => { e.preventDefault(); action(); closeAll(); }}
          style={{
            display: 'block',
            width: '100%',
            textAlign: 'left',
            padding: '7px 12px',
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            color: 'var(--gn-text-primary)',
            ...s,
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'var(--gn-bg-tertiary)'; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
        >
          {label}
        </button>
      ))}
    </div>
  );

  const FontDropdown = () => (
    <div
      style={{
        position: 'absolute',
        top: 'calc(100% + 4px)',
        left: 0,
        background: 'var(--gn-bg-secondary)',
        border: '1px solid var(--gn-border-default)',
        borderRadius: 'var(--gn-radius-md)',
        boxShadow: 'var(--gn-shadow-lg)',
        overflow: 'hidden',
        zIndex: 1000,
        minWidth: 180,
        animation: 'fadeIn 0.1s ease',
      }}
    >
      {FONTS.map((font) => (
        <button
          key={font}
          onMouseDown={(e) => {
            e.preventDefault();
            editor.chain().focus().setFontFamily(font).run();
            closeAll();
          }}
          style={{
            display: 'block',
            width: '100%',
            textAlign: 'left',
            padding: '7px 12px',
            border: 'none',
            background: editor.isActive('textStyle', { fontFamily: font }) ? 'var(--gn-accent-light)' : 'transparent',
            cursor: 'pointer',
            color: editor.isActive('textStyle', { fontFamily: font }) ? 'var(--gn-accent)' : 'var(--gn-text-primary)',
            fontFamily: font,
            fontSize: 13,
          }}
          onMouseEnter={(e) => {
            if (!editor.isActive('textStyle', { fontFamily: font })) {
              (e.currentTarget as HTMLElement).style.background = 'var(--gn-bg-tertiary)';
            }
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.background = editor.isActive('textStyle', { fontFamily: font }) ? 'var(--gn-accent-light)' : 'transparent';
          }}
        >
          {font}
        </button>
      ))}
    </div>
  );

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        padding: compact ? '4px 8px' : '5px 10px',
        background: 'var(--gn-bg-secondary)',
        borderBottom: '1px solid var(--gn-border-subtle)',
        flexWrap: 'wrap',
        rowGap: 2,
        position: 'relative',
        zIndex: 10,
        flexShrink: 0,
        userSelect: 'none',
      }}
      onMouseDown={(e) => e.stopPropagation()}
    >
      {/* Undo / Redo */}
      <Btn onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} tooltip={t('editor.undo')}>
        <RotateCcw size={13} />
      </Btn>
      <Btn onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} tooltip={t('editor.redo')}>
        <RotateCw size={13} />
      </Btn>

      <Divider />

      {/* Heading picker */}
      <div style={{ position: 'relative' }}>
        <button
          onMouseDown={(e) => { e.preventDefault(); toggle('heading'); }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 3,
            padding: '2px 7px',
            borderRadius: 5,
            border: 'none',
            cursor: 'pointer',
            background: 'transparent',
            color: 'var(--gn-text-primary)',
            fontSize: 12,
            fontWeight: 500,
            whiteSpace: 'nowrap',
            height: compact ? 26 : 28,
          }}
        >
          <Type size={13} />
          <span style={{ minWidth: 20 }}>
            {editor.isActive('heading', { level: 1 }) ? 'H1' :
             editor.isActive('heading', { level: 2 }) ? 'H2' :
             editor.isActive('heading', { level: 3 }) ? 'H3' : 'P'}
          </span>
          <ChevronDown size={10} />
        </button>
        {activeDropdown === 'heading' && <HeadingDropdown />}
      </div>

      {/* Font picker */}
      <div style={{ position: 'relative' }}>
        <button
          onMouseDown={(e) => { e.preventDefault(); toggle('font'); }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 3,
            padding: '2px 7px',
            borderRadius: 5,
            border: 'none',
            cursor: 'pointer',
            background: 'transparent',
            color: 'var(--gn-text-primary)',
            fontSize: 12,
            fontWeight: 500,
            whiteSpace: 'nowrap',
            height: compact ? 26 : 28,
            maxWidth: 120,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
          title="Select font"
        >
          <Type size={13} />
          <span style={{ minWidth: 50, maxWidth: 60, overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {(editor.getAttributes('textStyle').fontFamily as string)?.split(',')[0]?.trim() || 'Inter'}
          </span>
          <ChevronDown size={10} />
        </button>
        {activeDropdown === 'font' && <FontDropdown />}
      </div>

      <Divider />

      {/* Basic formatting */}
      <Btn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} tooltip={t('editor.bold')}>
        <Bold size={13} />
      </Btn>
      <Btn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} tooltip={t('editor.italic')}>
        <Italic size={13} />
      </Btn>
      <Btn onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive('underline')} tooltip={t('editor.underline')}>
        <Underline size={13} />
      </Btn>
      <Btn onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive('strike')} tooltip={t('editor.strikethrough')}>
        <Strikethrough size={13} />
      </Btn>
      <Btn onClick={() => editor.chain().focus().toggleCode().run()} active={editor.isActive('code')} tooltip={t('editor.code')}>
        <Code size={13} />
      </Btn>
      <Btn onClick={() => editor.chain().focus().toggleSubscript().run()} active={editor.isActive('subscript')} tooltip={t('editor.subscript')}>
        <Subscript size={13} />
      </Btn>
      <Btn onClick={() => editor.chain().focus().toggleSuperscript().run()} active={editor.isActive('superscript')} tooltip={t('editor.superscript')}>
        <Superscript size={13} />
      </Btn>

      <Divider />

      {/* Text color */}
      <div style={{ position: 'relative' }}>
        <button
          onMouseDown={(e) => { e.preventDefault(); toggle('textColor'); }}
          data-tooltip={t('editor.textColor')}
          style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', gap: 2,
            width: compact ? 26 : 28, height: compact ? 26 : 28,
            border: 'none', borderRadius: 5, cursor: 'pointer',
            background: 'transparent', color: 'var(--gn-text-primary)',
          }}
        >
          <span style={{ fontSize: 12, fontWeight: 700, lineHeight: 1 }}>A</span>
          <div style={{
            width: 16, height: 3, borderRadius: 2,
            background: (editor.getAttributes('textStyle').color as string) || 'var(--gn-text-primary)',
          }} />
        </button>
        {activeDropdown === 'textColor' && <ColorPicker type="text" />}
      </div>

      {/* Highlight */}
      <div style={{ position: 'relative' }}>
        <button
          onMouseDown={(e) => { e.preventDefault(); toggle('bgColor'); }}
          data-tooltip={t('editor.highlight')}
          style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: compact ? 26 : 28, height: compact ? 26 : 28,
            border: 'none', borderRadius: 5, cursor: 'pointer',
            background: editor.isActive('highlight') ? 'var(--gn-accent-light)' : 'transparent',
            color: editor.isActive('highlight') ? 'var(--gn-accent)' : 'var(--gn-text-primary)',
          }}
        >
          <Highlighter size={13} />
        </button>
        {activeDropdown === 'bgColor' && <ColorPicker type="bg" />}
      </div>

      <Divider />

      {/* Alignment */}
      <Btn onClick={() => editor.chain().focus().setTextAlign('left').run()} active={editor.isActive({ textAlign: 'left' })} tooltip={t('editor.alignLeft')}>
        <AlignLeft size={13} />
      </Btn>
      <Btn onClick={() => editor.chain().focus().setTextAlign('center').run()} active={editor.isActive({ textAlign: 'center' })} tooltip={t('editor.alignCenter')}>
        <AlignCenter size={13} />
      </Btn>
      <Btn onClick={() => editor.chain().focus().setTextAlign('right').run()} active={editor.isActive({ textAlign: 'right' })} tooltip={t('editor.alignRight')}>
        <AlignRight size={13} />
      </Btn>
      <Btn onClick={() => editor.chain().focus().setTextAlign('justify').run()} active={editor.isActive({ textAlign: 'justify' })} tooltip={t('editor.alignJustify')}>
        <AlignJustify size={13} />
      </Btn>

      <Divider />

      {/* Lists */}
      <Btn onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} tooltip={t('editor.bulletList')}>
        <List size={13} />
      </Btn>
      <Btn onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} tooltip={t('editor.numberedList')}>
        <ListOrdered size={13} />
      </Btn>
      <Btn onClick={() => editor.chain().focus().toggleTaskList().run()} active={editor.isActive('taskList')} tooltip={t('editor.taskList')}>
        <CheckSquare size={13} />
      </Btn>

      <Divider />

      {/* Block elements */}
      <Btn onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive('blockquote')} tooltip={t('editor.quote')}>
        <Quote size={13} />
      </Btn>
      <Btn onClick={() => editor.chain().focus().toggleCodeBlock().run()} active={editor.isActive('codeBlock')} tooltip={t('editor.codeBlock')}>
        <Code size={13} />
      </Btn>
      <Btn onClick={() => editor.chain().focus().setHorizontalRule().run()} tooltip="Horizontal Rule">
        <Minus size={13} />
      </Btn>

      <Divider />

      {/* Table */}
      <Btn onClick={insertTable} active={editor.isActive('table')} tooltip={t('editor.insertTable')}>
        <Table size={13} />
      </Btn>

      {/* Table operations (shown when inside table) */}
      {editor.isActive('table') && (
        <>
          <button
            onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().addColumnAfter().run(); }}
            style={{ fontSize: 10, padding: '2px 5px', borderRadius: 4, border: '1px solid var(--gn-border-default)', cursor: 'pointer', background: 'transparent', color: 'var(--gn-text-secondary)' }}
          >+Col</button>
          <button
            onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().addRowAfter().run(); }}
            style={{ fontSize: 10, padding: '2px 5px', borderRadius: 4, border: '1px solid var(--gn-border-default)', cursor: 'pointer', background: 'transparent', color: 'var(--gn-text-secondary)' }}
          >+Row</button>
          <button
            onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().deleteColumn().run(); }}
            style={{ fontSize: 10, padding: '2px 5px', borderRadius: 4, border: '1px solid rgba(239,68,68,0.3)', cursor: 'pointer', background: 'transparent', color: 'var(--gn-danger)' }}
          >-Col</button>
          <button
            onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().deleteRow().run(); }}
            style={{ fontSize: 10, padding: '2px 5px', borderRadius: 4, border: '1px solid rgba(239,68,68,0.3)', cursor: 'pointer', background: 'transparent', color: 'var(--gn-danger)' }}
          >-Row</button>
          <button
            onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().deleteTable().run(); }}
            style={{ fontSize: 10, padding: '2px 5px', borderRadius: 4, border: '1px solid rgba(239,68,68,0.3)', cursor: 'pointer', background: 'transparent', color: 'var(--gn-danger)' }}
          >Del Table</button>
        </>
      )}

      {/* Click anywhere to close dropdowns */}
      {activeDropdown && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 999 }}
          onMouseDown={closeAll}
        />
      )}
    </div>
  );
}
