// src/components/canvas/GridCanvas.tsx
import React, { useCallback, useEffect, useRef } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  BackgroundVariant,
  useNodesState,
  useEdgesState,
  addEdge,
  type Node,
  type Edge,
  type Connection,
  type OnNodesChange,
  type OnEdgesChange,
  Panel,
  MarkerType,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useTranslation } from 'react-i18next';
import { Plus, Grid3X3, Maximize2, StickyNote } from 'lucide-react';
import { useCanvasStore } from '../../store/canvasStore';
import { useSettingsStore } from '../../store/settingsStore';
import { useStorage } from '../../hooks/useStorage';
import { clipboardService } from '../../utils/keyboardShortcuts';
import { NoteCard } from '../../types';
import NoteCardNode from './NoteCard';
import CanvasToolbar from './CanvasToolbar';

// Register custom node types
const nodeTypes = { noteCard: NoteCardNode };

// Convert our NoteCard to XYFlow Node
function cardToNode(card: NoteCard): Node {
  return {
    id: card.id,
    type: 'noteCard',
    position: { x: card.x, y: card.y },
    data: { ...card },
    style: { width: card.width, height: card.height },
  };
}

// Convert our connection to XYFlow Edge
function connToEdge(conn: { id: string; source: string; target: string; label?: string; color?: string; style?: string; animated?: boolean }): Edge {
  return {
    id: conn.id,
    source: conn.source,
    target: conn.target,
    label: conn.label,
    animated: conn.animated,
    style: {
      stroke: conn.color || 'var(--gn-accent)',
      strokeWidth: 2,
      strokeDasharray: conn.style === 'dashed' ? '6,3' : conn.style === 'dotted' ? '2,4' : undefined,
    },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: conn.color || 'var(--gn-accent)',
    },
    labelStyle: {
      fontSize: 11,
      fill: 'var(--gn-text-secondary)',
      fontWeight: 500,
    },
    labelBgStyle: {
      fill: 'var(--gn-bg-card)',
      stroke: 'var(--gn-border-default)',
      strokeWidth: 1,
    },
    labelBgPadding: [4, 6] as [number, number],
    labelBgBorderRadius: 4,
  };
}

export default function GridCanvas() {
  const { t } = useTranslation();
  const {
    currentCanvasId, canvases, addCard, updateCard,
    addConnection, deleteConnection, updateViewport,
    openEditor, deleteCard, duplicateCard,
  } = useCanvasStore();
  const { snapToGrid, gridSize } = useSettingsStore();
  const { markDirty } = useStorage();

  const canvas = currentCanvasId ? canvases[currentCanvasId] : null;

  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  // Sync store → XYFlow nodes
  useEffect(() => {
    if (!canvas) return;
    setNodes(canvas.cards.map(cardToNode));
    setEdges(canvas.connections.map(connToEdge));
  }, [canvas?.id]); // eslint-disable-line

  // Sync card content updates without full reset
  useEffect(() => {
    if (!canvas) return;
    setNodes((nds) => {
      const updatedNodes = nds
        .map((n) => {
          const card = canvas.cards.find((c) => c.id === n.id);
          if (!card) return null;
          return {
            ...n,
            data: { ...card },
            style: { width: card.width, height: card.height },
          };
        })
        .filter((n) => n !== null) as typeof nds;
      return updatedNodes;
    });
  }, [canvas?.cards]); // eslint-disable-line

  // Node change handler (drag, resize)
  const handleNodesChange: OnNodesChange = useCallback(
    (changes) => {
      onNodesChange(changes);
      if (!currentCanvasId) return;

      for (const change of changes) {
        if (change.type === 'position' && change.position && !change.dragging) {
          updateCard(currentCanvasId, change.id, {
            x: change.position.x,
            y: change.position.y,
          });
          markDirty();
        }
        if (change.type === 'dimensions' && change.dimensions) {
          updateCard(currentCanvasId, change.id, {
            width: change.dimensions.width,
            height: change.dimensions.height,
          });
          markDirty();
        }
      }
    },
    [currentCanvasId, onNodesChange, updateCard, markDirty]
  );

  // Edge change handler
  const handleEdgesChange: OnEdgesChange = useCallback(
    (changes) => {
      onEdgesChange(changes);
      if (!currentCanvasId) return;
      for (const change of changes) {
        if (change.type === 'remove') {
          deleteConnection(currentCanvasId, change.id);
          markDirty();
        }
      }
    },
    [currentCanvasId, onEdgesChange, deleteConnection, markDirty]
  );

  // New connection
  const handleConnect = useCallback(
    (params: Connection) => {
      if (!currentCanvasId || !params.source || !params.target) return;
      const conn = addConnection(currentCanvasId, params.source, params.target);
      setEdges((eds) => addEdge(connToEdge(conn), eds));
      markDirty();
    },
    [currentCanvasId, addConnection, setEdges, markDirty]
  );

  // Double-click on canvas background → add card
  const handlePaneDoubleClick = useCallback(
    (e: React.MouseEvent) => {
      if (!currentCanvasId) return;
      const target = e.target as HTMLElement;
      if (!target.classList.contains('react-flow__pane')) return;

      // Get position relative to canvas (accounting for viewport transform)
      const bounds = (e.currentTarget as HTMLElement).getBoundingClientRect();
      const x = e.clientX - bounds.left;
      const y = e.clientY - bounds.top;

      // Convert screen coords to flow coords
      const { viewportX = 0, viewportY = 0, viewportZoom = 1 } = canvas || {};
      const flowX = (x - viewportX) / viewportZoom;
      const flowY = (y - viewportY) / viewportZoom;

      const card = addCard(currentCanvasId, flowX - 140, flowY - 100);
      setNodes((nds) => [...nds, cardToNode(card)]);
      markDirty();
      
      // Auto-open editor for new card
      setTimeout(() => openEditor(card.id), 100);
    },
    [currentCanvasId, canvas, addCard, setNodes, markDirty, openEditor]
  );

  const handleMoveEnd = useCallback(
    (_: unknown, viewport: { x: number; y: number; zoom: number }) => {
      if (!currentCanvasId) return;
      updateViewport(currentCanvasId, viewport.x, viewport.y, viewport.zoom);
    },
    [currentCanvasId, updateViewport]
  );

  // Add card from toolbar button
  const handleAddCard = useCallback(() => {
    if (!currentCanvasId) return;
    const card = addCard(currentCanvasId, 200 + Math.random() * 200, 200 + Math.random() * 200);
    setNodes((nds) => [...nds, cardToNode(card)]);
    markDirty();
    setTimeout(() => openEditor(card.id), 100);
  }, [currentCanvasId, addCard, setNodes, markDirty, openEditor]);

  // Clipboard reference
  const clipboardRef = useRef<{ cardId: string; canvasId: string } | null>(null);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyboard = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      
      // Don't trigger if editing in input/textarea
      const isEditingContent = 
        target.tagName === 'INPUT' || 
        target.tagName === 'TEXTAREA' || 
        target.contentEditable === 'true' ||
        target.closest('.tiptap-editor');

      if (isEditingContent) return;

      // Copy: Ctrl/Cmd + C (first selected card)
      if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
        e.preventDefault();
        const firstNode = nodes.find(n => n.selected);
        if (firstNode && currentCanvasId) {
          const card = canvas?.cards.find(c => c.id === firstNode.id);
          if (card) {
            clipboardService.copyCard(card);
            clipboardRef.current = { cardId: firstNode.id, canvasId: currentCanvasId };
          }
        }
      }

      // Cut: Ctrl/Cmd + X
      if ((e.ctrlKey || e.metaKey) && e.key === 'x') {
        e.preventDefault();
        const firstNode = nodes.find(n => n.selected);
        if (firstNode && currentCanvasId) {
          const card = canvas?.cards.find(c => c.id === firstNode.id);
          if (card) {
            clipboardService.cutCard(card);
            deleteCard(currentCanvasId, firstNode.id);
            markDirty();
          }
        }
      }

      // Paste: Ctrl/Cmd + V
      if ((e.ctrlKey || e.metaKey) && e.key === 'v') {
        e.preventDefault();
        if (!currentCanvasId || !clipboardService.hasCardData()) return;
        
        const cardData = clipboardService.getCardFromClipboard();
        if (!cardData) return;

        // Create new card with offset
        const newCard = addCard(
          currentCanvasId,
          cardData.x + 50,
          cardData.y + 50
        );
        
        // Copy content from clipboard
        updateCard(currentCanvasId, newCard.id, {
          title: cardData.title,
          content: cardData.content,
          color: cardData.color,
          tags: [...cardData.tags],
        });

        setNodes((nds) => [...nds, cardToNode(newCard)]);
        markDirty();
      }

      // Delete: Delete key
      if (e.key === 'Delete') {
        e.preventDefault();
        const selectedNodes = nodes.filter(n => n.selected);
        if (selectedNodes.length > 0 && currentCanvasId) {
          selectedNodes.forEach(node => {
            deleteCard(currentCanvasId, node.id);
          });
          markDirty();
        }
      }

      // Duplicate: Ctrl/Cmd + D
      if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
        e.preventDefault();
        const selectedNodes = nodes.filter(n => n.selected);
        if (selectedNodes.length > 0 && currentCanvasId) {
          selectedNodes.forEach(node => {
            duplicateCard(currentCanvasId, node.id);
          });
          markDirty();
        }
      }
    };

    window.addEventListener('keydown', handleKeyboard);
    return () => window.removeEventListener('keydown', handleKeyboard);
  }, [nodes, currentCanvasId, canvas, addCard, updateCard, deleteCard, duplicateCard, setNodes, markDirty]);

  if (!canvas) {
    return (
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--gn-bg-tertiary)',
          gap: 16,
          color: 'var(--gn-text-tertiary)',
        }}
      >
        <StickyNote size={52} strokeWidth={1} style={{ opacity: 0.25 }} />
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 17, fontWeight: 600, marginBottom: 6, color: 'var(--gn-text-secondary)' }}>
            No canvas open
          </div>
          <div style={{ fontSize: 13 }}>Select or create a notebook in the sidebar</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={handleNodesChange}
        onEdgesChange={handleEdgesChange}
        onConnect={handleConnect}
        onPaneClick={() => {}}
        onDoubleClick={handlePaneDoubleClick}
        onMoveEnd={handleMoveEnd}
        nodeTypes={nodeTypes}
        snapToGrid={snapToGrid}
        snapGrid={[gridSize, gridSize]}
        defaultViewport={{
          x: canvas.viewportX,
          y: canvas.viewportY,
          zoom: canvas.viewportZoom,
        }}
        fitView={nodes.length > 0 && canvas.viewportX === 0 && canvas.viewportY === 0}
        fitViewOptions={{ padding: 0.15 }}
        minZoom={0.1}
        maxZoom={3}
        deleteKeyCode="Delete"
        multiSelectionKeyCode="Shift"
        selectionKeyCode="Shift"
        connectionRadius={30}
        proOptions={{ hideAttribution: true }}
        style={{ background: 'var(--gn-bg-tertiary)' }}
      >
        {/* Dotted grid background */}
        <Background
          variant={BackgroundVariant.Dots}
          gap={24}
          size={1.5}
          color="var(--gn-border-default)"
          style={{ opacity: 0.6 }}
        />

        {/* Controls */}
        <Controls showInteractive={false} />

        {/* Mini map */}
        <MiniMap
          nodeColor={(node) => {
            const card = node.data as unknown as NoteCard;
            const colors: Record<string, string> = {
              default: '#6366f1', yellow: '#eab308', blue: '#3b82f6',
              green: '#22c55e', pink: '#ec4899', purple: '#8b5cf6',
              orange: '#f97316', red: '#ef4444',
            };
            return colors[card.color] || '#6366f1';
          }}
          nodeStrokeWidth={2}
          maskColor="rgba(0,0,0,0.12)"
          position="bottom-right"
          style={{ bottom: 70, right: 12 }}
        />

        {/* Top toolbar panel */}
        <Panel position="top-center" style={{ margin: '10px 0 0' }}>
          <CanvasToolbar canvasId={canvas.id} onAddCard={handleAddCard} />
        </Panel>

        {/* Card count */}
        <Panel position="bottom-left" style={{ margin: '0 0 10px 12px' }}>
          <div
            style={{
              fontSize: 11,
              color: 'var(--gn-text-tertiary)',
              background: 'var(--gn-bg-secondary)',
              border: '1px solid var(--gn-border-subtle)',
              borderRadius: 6,
              padding: '3px 8px',
            }}
          >
            {t('canvas.cardCount', { count: nodes.length })}
          </div>
        </Panel>

        {/* Empty state hint */}
        {nodes.length === 0 && (
          <Panel position="top-left" style={{ margin: '50% 0 0 50%', transform: 'translate(-50%,-50%)' }}>
            <div style={{ textAlign: 'center', color: 'var(--gn-text-tertiary)', pointerEvents: 'none' }}>
              <div style={{ fontSize: 13 }}>{t('canvas.noCards')}</div>
            </div>
          </Panel>
        )}
      </ReactFlow>
    </div>
  );
}
