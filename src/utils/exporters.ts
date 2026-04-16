// src/utils/exporters.ts
import { Canvas, NoteCard } from '../types';
// @ts-ignore
import html2pdf from 'html2pdf.js';

/**
 * Export utilities for various formats:
 * - JSON: full structured data export
 * - Markdown: human-readable format
 * - HTML: rich formatted document
 * - PDF: printable document
 * - PNG: canvas snapshot image
 * - SVG: scalable vector graphic
 * - DOCX: Microsoft Word format
 */

// ===== JSON Export =====
export const exportToJSON = (canvas: Canvas, filename: string) => {
  const dataStr = JSON.stringify(canvas, null, 2);
  downloadFile(dataStr, `${filename}.json`, 'application/json');
};

// ===== Markdown Export =====
export const exportToMarkdown = (canvas: Canvas, filename: string) => {
  let markdown = `# ${canvas.name}\n\n`;
  markdown += `*Exported: ${new Date().toLocaleString()}*\n\n`;

  canvas.cards.forEach((card) => {
    markdown += `## ${card.title}\n\n`;
    // Strip HTML tags and convert TipTap HTML to markdown
    const plainText = stripHtmlTags(card.content);
    markdown += plainText + '\n\n';

    if (card.tags && card.tags.length > 0) {
      markdown += `**Tags:** ${card.tags.join(', ')}\n\n`;
    }
  });

  downloadFile(markdown, `${filename}.md`, 'text/markdown');
};

// ===== HTML Export =====
export const exportToHTML = (canvas: Canvas, filename: string) => {
  let html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${canvas.name}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; background: #f5f5f5; padding: 20px; }
    .container { max-width: 900px; margin: 0 auto; background: white; padding: 40px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
    h1 { margin-bottom: 10px; color: #1f2937; }
    .meta { color: #6b7280; font-size: 0.9em; margin-bottom: 30px; }
    .card { margin-bottom: 30px; padding: 20px; border: 1px solid #e5e7eb; border-radius: 6px; background: #fafafa; }
    .card h2 { color: #374151; margin-bottom: 12px; font-size: 1.3em; }
    .card-content { color: #555; margin-bottom: 12px; }
    .tags { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 12px; }
    .tag { background: #3b82f6; color: white; padding: 4px 8px; border-radius: 4px; font-size: 0.85em; }
  </style>
</head>
<body>
  <div class="container">
    <h1>${canvas.name}</h1>
    <div class="meta">Exported: ${new Date().toLocaleString()}</div>`;

  canvas.cards.forEach((card) => {
    html += `
    <div class="card">
      <h2>${escapeHtml(card.title)}</h2>
      <div class="card-content">${card.content}</div>`;

    if (card.tags && card.tags.length > 0) {
      html += `<div class="tags">
        ${card.tags.map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join('')}
      </div>`;
    }

    html += `</div>`;
  });

  html += `
  </div>
</body>
</html>`;

  downloadFile(html, `${filename}.html`, 'text/html');
};

// ===== PDF Export =====
export const exportToPDF = async (canvas: Canvas, filename: string) => {
  const element = document.createElement('div');
  element.innerHTML = `
    <div style="padding: 20px; font-family: Arial, sans-serif;">
      <h1>${canvas.name}</h1>
      <p style="color: #666; font-size: 0.9em;">Exported: ${new Date().toLocaleString()}</p>
  `;

  canvas.cards.forEach((card) => {
    element.innerHTML += `
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
        <h2 style="margin-bottom: 10px;">${card.title}</h2>
        <div style="margin-bottom: 10px;">${card.content}</div>
        ${card.tags && card.tags.length > 0 ? `<p><strong>Tags:</strong> ${card.tags.join(', ')}</p>` : ''}
      </div>
    `;
  });

  element.innerHTML += '</div>';

  const options = {
    margin: 10,
    filename: `${filename}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' },
  };

  try {
    const pdf = await html2pdf().set(options).from(element).save();
    return pdf;
  } catch (error) {
    console.error('PDF export failed:', error);
    throw error;
  }
};

// ===== PNG Export (Canvas Snapshot) =====
export const exportToPNG = async (canvasElement: HTMLElement, filename: string) => {
  const canvas = await html2canvas(canvasElement, {
    scale: 2,
    useCORS: true,
    logging: false,
  });
  downloadCanvasAsImage(canvas, `${filename}.png`);
};

// ===== SVG Export =====
export const exportToSVG = (canvas: Canvas, filename: string) => {
  const width = 1200;
  const height = 800;

  let svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <style>
      .card-rect { fill: #ffffff; stroke: #e5e7eb; stroke-width: 1; }
      .card-title { font-family: Arial, sans-serif; font-size: 16px; font-weight: bold; fill: #1f2937; }
      .card-content { font-family: Arial, sans-serif; font-size: 12px; fill: #555; }
      .tag { font-family: Arial, sans-serif; font-size: 11px; fill: white; }
    </style>
  </defs>
  <rect width="${width}" height="${height}" fill="#f5f5f5"/>`;

  let yOffset = 40;
  canvas.cards.slice(0, 10).forEach((card, index) => {
    const x = 20;
    const y = yOffset;
    const cardWidth = width - 40;
    const cardHeight = 120;

    svg += `
    <rect class="card-rect" x="${x}" y="${y}" width="${cardWidth}" height="${cardHeight}" rx="6"/>
    <text class="card-title" x="${x + 12}" y="${y + 30}">${escapeXml(card.title)}</text>`;

    if (card.tags && card.tags.length > 0) {
      let tagX = x + 12;
      card.tags.forEach((tag) => {
        svg += `
        <rect x="${tagX}" y="${y + 65}" width="80" height="20" fill="#3b82f6" rx="3"/>
        <text class="tag" x="${tagX + 5}" y="${y + 80}">${escapeXml(tag)}</text>`;
        tagX += 90;
      });
    }

    yOffset += cardHeight + 20;
  });

  svg += '\n</svg>';
  downloadFile(svg, `${filename}.svg`, 'image/svg+xml');
};

// ===== DOCX Export =====
export const exportToDOCX = async (canvas: Canvas, filename: string) => {
  // Using a simple approach: generate base64-encoded DOCX structure
  // For full DOCX support, use docx library (npm install docx)
  try {
    const docxLibrary = await import('docx');
    const { Document, Packer, Paragraph, HeadingLevel, TabStopType, BorderStyle } = docxLibrary;

    const paragraphs: any[] = [
      new Paragraph({
        text: canvas.name,
        heading: HeadingLevel.HEADING_1,
      }),
      new Paragraph({
        text: `Exported: ${new Date().toLocaleString()}`,
        spacing: { after: 400 },
      }),
    ];

    canvas.cards.forEach((card) => {
      paragraphs.push(
        new Paragraph({
          text: card.title,
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 100 },
        }),
        new Paragraph({
          text: stripHtmlTags(card.content),
          spacing: { after: 100 },
        })
      );

      if (card.tags && card.tags.length > 0) {
        paragraphs.push(
          new Paragraph({
            text: `Tags: ${card.tags.join(', ')}`,
            spacing: { after: 200 },
          })
        );
      }
    });

    const doc = new Document({ sections: [{ children: paragraphs }] });
    const blob = await Packer.toBlob(doc);
    downloadBlob(blob, `${filename}.docx`);
  } catch (error) {
    console.error('DOCX export requires: npm install docx', error);
    throw new Error('DOCX export not available. Please install the docx library.');
  }
};

// ===== Bulk Export All Canvases =====
export const exportAllCanvasesAsJSON = (canvases: Canvas[], notebookName: string) => {
  const exportData = {
    notebookName,
    exportDate: new Date().toISOString(),
    canvases: canvases,
  };
  downloadFile(JSON.stringify(exportData, null, 2), `${notebookName}-backup.json`, 'application/json');
};

// ===== Helper Functions =====
function stripHtmlTags(html: string): string {
  const div = document.createElement('div');
  div.innerHTML = html;
  return div.textContent || div.innerText || '';
}

function escapeHtml(text: string): string {
  const map: { [key: string]: string } = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

function escapeXml(text: string): string {
  return escapeHtml(text);
}

function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  downloadBlob(blob, filename);
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function downloadCanvasAsImage(canvas: HTMLCanvasElement, filename: string) {
  canvas.toBlob((blob) => {
    if (blob) {
      downloadBlob(blob, filename);
    }
  });
}

// For PNG export, we need html2canvas library
declare function html2canvas(element: HTMLElement, options?: any): Promise<HTMLCanvasElement>;
