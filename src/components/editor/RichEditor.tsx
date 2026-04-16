// src/components/editor/RichEditor.tsx
import React, { useEffect, useCallback } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextStyle from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import FontFamily from '@tiptap/extension-font-family';
import Highlight from '@tiptap/extension-highlight';
import TextAlign from '@tiptap/extension-text-align';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import CharacterCount from '@tiptap/extension-character-count';
import Placeholder from '@tiptap/extension-placeholder';
import Typography from '@tiptap/extension-typography';
import { common, createLowlight } from 'lowlight';
import { useTranslation } from 'react-i18next';
import EditorToolbar from './EditorToolbar';

const lowlight = createLowlight(common);

interface Props {
  content: string;
  onUpdate: (html: string) => void;
  compact?: boolean;
  autoFocus?: boolean;
  showToolbar?: boolean;
  placeholder?: string;
  style?: React.CSSProperties;
}

export default function RichEditor({
  content,
  onUpdate,
  compact = false,
  autoFocus = false,
  showToolbar = true,
  placeholder,
  style,
}: Props) {
  const { t } = useTranslation();

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,
        heading: { levels: [1, 2, 3] },
      }),
      Underline,
      TextStyle,
      Color,
      FontFamily.configure({
        types: ['textStyle'],
      }),
      Highlight.configure({ multicolor: true }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      TaskList,
      TaskItem.configure({ nested: true }),
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
      Image.configure({ allowBase64: true }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { rel: 'noopener noreferrer' },
      }),
      Subscript,
      Superscript,
      CodeBlockLowlight.configure({ lowlight }),
      CharacterCount,
      Placeholder.configure({
        placeholder: placeholder || t('editor.placeholder'),
      }),
      Typography,
    ],
    content: content || '',
    autofocus: autoFocus,
    onUpdate: ({ editor }) => {
      onUpdate(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'tiptap-editor',
        spellcheck: 'true',
      },
    },
  });

  // Sync external content changes (e.g. card loaded from storage)
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content || '', false);
    }
  }, [content]); // eslint-disable-line

  const wordCount = editor?.storage.characterCount?.words() ?? 0;
  const charCount = editor?.storage.characterCount?.characters() ?? 0;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflow: 'hidden',
        ...style,
      }}
    >
      {showToolbar && <EditorToolbar editor={editor} compact={compact} />}

      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: compact ? '8px 10px' : '12px 16px',
          cursor: 'text',
          userSelect: 'text',
        }}
        onClick={() => editor?.commands.focus()}
      >
        <EditorContent editor={editor} style={{ minHeight: '100%' }} />
      </div>

      {/* Word count */}
      {!compact && (
        <div
          style={{
            padding: '3px 12px',
            borderTop: '1px solid var(--gn-border-subtle)',
            display: 'flex',
            gap: 12,
            fontSize: 10,
            color: 'var(--gn-text-tertiary)',
            background: 'var(--gn-bg-secondary)',
            flexShrink: 0,
          }}
        >
          <span>{t('editor.wordCount', { count: wordCount })}</span>
          <span>{t('editor.charCount', { count: charCount })}</span>
        </div>
      )}
    </div>
  );
}
