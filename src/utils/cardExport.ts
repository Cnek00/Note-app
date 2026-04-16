// src/utils/cardExport.ts
import { NoteCard } from '../types';
import {
  exportToJSON,
  exportToMarkdown,
  exportToHTML,
  exportToPDF,
  exportToSVG,
  exportToDOCX,
} from './exporters';

/**
 * Export individual card utilities
 */

export const exportCardAsJSON = (card: NoteCard) => {
  const dataStr = JSON.stringify(card, null, 2);
  downloadFile(dataStr, `${card.title || 'note'}.json`, 'application/json');
};

export const exportCardAsMarkdown = (card: NoteCard) => {
  let markdown = `# ${card.title}\n\n`;
  markdown += stripHtmlTags(card.content) + '\n\n';

  if (card.tags.length > 0) {
    markdown += `**Tags:** ${card.tags.join(', ')}\n\n`;
  }

  markdown += `---\n*Created: ${new Date(card.createdAt).toLocaleString()}*\n`;
  markdown += `*Updated: ${new Date(card.updatedAt).toLocaleString()}*\n`;

  downloadFile(markdown, `${card.title || 'note'}.md`, 'text/markdown');
};

export const exportCardAsHTML = (card: NoteCard) => {
  let html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${card.title}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; background: #f5f5f5; padding: 20px; }
    .container { max-width: 800px; margin: 0 auto; background: white; padding: 40px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
    h1 { color: #1f2937; margin-bottom: 10px; }
    .meta { color: #6b7280; font-size: 0.9em; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 1px solid #e5e7eb; }
    .content { margin-bottom: 20px; }
    .tags { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 20px; }
    .tag { background: #3b82f6; color: white; padding: 4px 8px; border-radius: 4px; font-size: 0.85em; }
  </style>
</head>
<body>
  <div class="container">
    <h1>${escapeHtml(card.title)}</h1>
    <div class="meta">
      <p><strong>Created:</strong> ${new Date(card.createdAt).toLocaleString()}</p>
      <p><strong>Updated:</strong> ${new Date(card.updatedAt).toLocaleString()}</p>
    </div>
    <div class="content">${card.content}</div>`;

  if (card.tags.length > 0) {
    html += `<div class="tags">
      ${card.tags.map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join('')}
    </div>`;
  }

  html += `  </div>
</body>
</html>`;

  downloadFile(html, `${card.title || 'note'}.html`, 'text/html');
};

export const exportCardAsPDF = async (card: NoteCard) => {
  const element = document.createElement('div');
  element.innerHTML = `
    <div style="padding: 20px; font-family: Arial, sans-serif;">
      <h1>${card.title}</h1>
      <p style="color: #666; font-size: 0.9em;">
        Created: ${new Date(card.createdAt).toLocaleString()}<br>
        Updated: ${new Date(card.updatedAt).toLocaleString()}
      </p>
      <div style="margin-top: 20px;">${card.content}</div>
      ${card.tags.length > 0 ? `<p style="margin-top: 20px;"><strong>Tags:</strong> ${card.tags.join(', ')}</p>` : ''}
    </div>
  `;

  try {
    // @ts-ignore
    const html2pdf = await import('html2pdf.js');
    const options = {
      margin: 10,
      filename: `${card.title || 'note'}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' },
    };
    await html2pdf.default().set(options).from(element).save();
  } catch (error) {
    console.error('PDF export failed:', error);
    throw error;
  }
};

export const exportCardAsText = (card: NoteCard) => {
  let text = `${card.title}\n`;
  text += '='.repeat(card.title.length) + '\n\n';
  text += stripHtmlTags(card.content) + '\n\n';

  if (card.tags.length > 0) {
    text += `Tags: ${card.tags.join(', ')}\n\n`;
  }

  text += `---\n`;
  text += `Created: ${new Date(card.createdAt).toLocaleString()}\n`;
  text += `Updated: ${new Date(card.updatedAt).toLocaleString()}\n`;

  downloadFile(text, `${card.title || 'note'}.txt`, 'text/plain');
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

function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
