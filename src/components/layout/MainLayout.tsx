// src/components/layout/MainLayout.tsx
import React from 'react';
import TitleBar from './TitleBar';
import Sidebar from '../sidebar/Sidebar';
import GridCanvas from '../canvas/GridCanvas';
import EditorModal from '../editor/EditorModal';

export default function MainLayout() {
  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        background: 'var(--gn-bg-primary)',
      }}
    >
      {/* Custom title bar */}
      <TitleBar />

      {/* Main content */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Sidebar */}
        <Sidebar />

        {/* Canvas */}
        <GridCanvas />
      </div>

      {/* Full-screen editor modal (rendered over everything) */}
      <EditorModal />
    </div>
  );
}
