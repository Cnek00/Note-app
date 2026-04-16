// src/components/export/ExportModal.tsx
import React, { useState } from 'react';
import { useCanvasStore } from '../../store/canvasStore';
import { useNotebookStore } from '../../store/notebookStore';
import {
  exportToJSON,
  exportToMarkdown,
  exportToHTML,
  exportToPDF,
  exportToSVG,
  exportToDOCX,
  exportAllCanvasesAsJSON,
} from '../../utils/exporters';
import { Download, X, FileJson, FileText, File } from 'lucide-react';
import './ExportModal.css';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose }) => {
  const [exporting, setExporting] = useState<string | null>(null);
  const [exportFormat, setExportFormat] = useState<'single' | 'all'>('single');

  const currentCanvas = useCanvasStore((state) => state.getCurrentCanvas());
  const notebooks = useNotebookStore((state) => state.notebooks);
  const activeNotebookId = useNotebookStore((state) => state.activeNotebookId);
  const getNotebook = useNotebookStore((state) => state.getNotebook);

  const activeNotebook = activeNotebookId ? getNotebook(activeNotebookId) : null;

  const handleExport = async (format: string) => {
    if (!currentCanvas) return;

    try {
      setExporting(format);

      const timestamp = new Date().toISOString().split('T')[0];
      const filename = `${currentCanvas.name || 'gridnote'}-${timestamp}`;

      switch (format) {
        case 'json':
          exportToJSON(currentCanvas, filename);
          break;
        case 'markdown':
          exportToMarkdown(currentCanvas, filename);
          break;
        case 'html':
          exportToHTML(currentCanvas, filename);
          break;
        case 'pdf':
          await exportToPDF(currentCanvas, filename);
          break;
        case 'svg':
          exportToSVG(currentCanvas, filename);
          break;
        case 'docx':
          await exportToDOCX(currentCanvas, filename);
          break;
        default:
          console.warn(`Export format not supported: ${format}`);
      }
    } catch (error) {
      console.error(`Export failed for format: ${format}`, error);
      alert(`Export failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setExporting(null);
    }
  };

  const handleExportAll = () => {
    if (!activeNotebook) return;

    try {
      setExporting('all');

      // Collect all canvases for this notebook
      const notebookCanvases: any[] = [];
      // Implementation depends on store structure
      // For now, collect what we can

      exportAllCanvasesAsJSON(notebookCanvases, activeNotebook.name);
    } catch (error) {
      console.error('Export all failed:', error);
      alert('Export failed');
    } finally {
      setExporting(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="export-modal-overlay" onClick={onClose}>
      <div className="export-modal" onClick={(e) => e.stopPropagation()}>
        <div className="export-modal-header">
          <h2>
            <Download size={20} /> Export Canvas
          </h2>
          <button onClick={onClose} className="close-button">
            <X size={20} />
          </button>
        </div>

        <div className="export-content">
          {currentCanvas ? (
            <>
              <div className="canvas-info">
                <p>
                  <strong>Canvas:</strong> {currentCanvas.name}
                </p>
                <p>
                  <strong>Cards:</strong> {currentCanvas.cards.length}
                </p>
              </div>

              {/* Export Format Selection */}
              <div className="format-section">
                <h3>Export Format</h3>
                <div className="format-toggle">
                  <button
                    className={`toggle-btn ${exportFormat === 'single' ? 'active' : ''}`}
                    onClick={() => setExportFormat('single')}
                  >
                    Current Canvas
                  </button>
                  <button
                    className={`toggle-btn ${exportFormat === 'all' ? 'active' : ''}`}
                    onClick={() => setExportFormat('all')}
                  >
                    All Canvases
                  </button>
                </div>
              </div>

              {exportFormat === 'single' ? (
                <div className="formats-grid">
                  {/* JSON */}
                  <div className="format-card">
                    <div className="format-icon">
                      <FileJson size={28} />
                    </div>
                    <div className="format-info">
                      <h4>JSON</h4>
                      <p>Structured data format. Perfect for backups and integrations.</p>
                    </div>
                    <button
                      className="export-btn"
                      onClick={() => handleExport('json')}
                      disabled={exporting === 'json'}
                    >
                      {exporting === 'json' ? 'Exporting...' : 'Export'}
                    </button>
                  </div>

                  {/* Markdown */}
                  <div className="format-card">
                    <div className="format-icon">
                      <FileText size={28} />
                    </div>
                    <div className="format-info">
                      <h4>Markdown</h4>
                      <p>Human-readable format. Works with any text editor.</p>
                    </div>
                    <button
                      className="export-btn"
                      onClick={() => handleExport('markdown')}
                      disabled={exporting === 'markdown'}
                    >
                      {exporting === 'markdown' ? 'Exporting...' : 'Export'}
                    </button>
                  </div>

                  {/* HTML */}
                  <div className="format-card">
                    <div className="format-icon">
                      <File size={28} />
                    </div>
                    <div className="format-info">
                      <h4>HTML</h4>
                      <p>Formatted web page. Open in any browser.</p>
                    </div>
                    <button
                      className="export-btn"
                      onClick={() => handleExport('html')}
                      disabled={exporting === 'html'}
                    >
                      {exporting === 'html' ? 'Exporting...' : 'Export'}
                    </button>
                  </div>

                  {/* PDF */}
                  <div className="format-card">
                    <div className="format-icon">📄</div>
                    <div className="format-info">
                      <h4>PDF</h4>
                      <p>Print-friendly format. Professional document.</p>
                    </div>
                    <button
                      className="export-btn"
                      onClick={() => handleExport('pdf')}
                      disabled={exporting === 'pdf'}
                    >
                      {exporting === 'pdf' ? 'Exporting...' : 'Export'}
                    </button>
                  </div>

                  {/* SVG */}
                  <div className="format-card">
                    <div className="format-icon">🎨</div>
                    <div className="format-info">
                      <h4>SVG</h4>
                      <p>Vector format. Scalable and editable.</p>
                    </div>
                    <button
                      className="export-btn"
                      onClick={() => handleExport('svg')}
                      disabled={exporting === 'svg'}
                    >
                      {exporting === 'svg' ? 'Exporting...' : 'Export'}
                    </button>
                  </div>

                  {/* DOCX */}
                  <div className="format-card">
                    <div className="format-icon">📝</div>
                    <div className="format-info">
                      <h4>DOCX</h4>
                      <p>Microsoft Word format. Edit in Word or compatible apps.</p>
                    </div>
                    <button
                      className="export-btn"
                      onClick={() => handleExport('docx')}
                      disabled={exporting === 'docx'}
                    >
                      {exporting === 'docx' ? 'Exporting...' : 'Export'}
                    </button>
                  </div>

                  {/* PNG */}
                  <div className="format-card">
                    <div className="format-icon">🖼️</div>
                    <div className="format-info">
                      <h4>PNG</h4>
                      <p>Canvas snapshot image. Share visually.</p>
                    </div>
                    <button
                      className="export-btn"
                      disabled={true}
                      title="Use view menu to export canvas as image"
                    >
                      Soon
                    </button>
                  </div>
                </div>
              ) : (
                <div className="all-canvases-export">
                  <div className="notebook-info">
                    <strong>Notebook:</strong> {activeNotebook?.name || 'Unknown'}
                  </div>
                  <p className="export-description">
                    Export all canvases in this notebook as a single JSON file with backup metadata.
                  </p>
                  <button className="export-all-btn" onClick={handleExportAll}>
                    {exporting === 'all' ? 'Exporting...' : 'Export All as JSON'}
                  </button>
                </div>
              )}

              <div className="export-info">
                <h4>Tips:</h4>
                <ul>
                  <li>JSON exports include all metadata and formatting.</li>
                  <li>Markdown works great for sharing on other platforms.</li>
                  <li>PDF is best for printing or sharing read-only documents.</li>
                  <li>Regular backups recommended.</li>
                </ul>
              </div>
            </>
          ) : (
            <div className="no-canvas">
              <p>No canvas selected. Please select or create a canvas first.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
