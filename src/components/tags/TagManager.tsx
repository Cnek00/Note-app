// src/components/tags/TagManager.tsx
import React, { useState, useMemo } from 'react';
import { useCanvasStore } from '../../store/canvasStore';
import { getAllTags, filterCardsByTags, getTagFrequency } from '../../utils/search';
import { Tag, X, Plus } from 'lucide-react';
import './TagManager.css';

interface TagManagerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TagManager: React.FC<TagManagerProps> = ({ isOpen, onClose }) => {
  const [newTag, setNewTag] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [renameTag, setRenameTag] = useState<{ old: string; new: string } | null>(null);

  const currentCanvas = useCanvasStore((state) => state.getCurrentCanvas());
  const updateCard = useCanvasStore((state) => state.updateCard);

  const allTags = useMemo(
    () => (currentCanvas ? getAllTags(currentCanvas) : []),
    [currentCanvas]
  );

  const tagFrequency = useMemo(
    () => (currentCanvas ? getTagFrequency(currentCanvas) : new Map()),
    [currentCanvas]
  );

  const filteredCards = useMemo(
    () => (currentCanvas && selectedTags.length > 0 ? filterCardsByTags(currentCanvas, selectedTags) : []),
    [currentCanvas, selectedTags]
  );

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && newTag.trim()) {
      setNewTag('');
      // Tag gets added when cards are edited
    }
  };

  const handleRenameTag = (oldTag: string, newTag: string) => {
    if (!currentCanvas || !newTag.trim() || oldTag === newTag.trim()) return;

    currentCanvas.cards.forEach((card) => {
      if (card.tags.includes(oldTag)) {
        const updatedTags = card.tags.map((t) => (t === oldTag ? newTag.trim() : t));
        updateCard(currentCanvas.id, card.id, { tags: updatedTags });
      }
    });

    setRenameTag(null);
  };

  const handleDeleteTag = (tagToDelete: string) => {
    if (!currentCanvas) return;

    currentCanvas.cards.forEach((card) => {
      if (card.tags.includes(tagToDelete)) {
        const updatedTags = card.tags.filter((t) => t !== tagToDelete);
        updateCard(currentCanvas.id, card.id, { tags: updatedTags });
      }
    });
  };

  if (!isOpen) return null;

  return (
    <div className="tag-manager-overlay" onClick={onClose}>
      <div className="tag-manager" onClick={(e) => e.stopPropagation()}>
        <div className="tag-manager-header">
          <h2>
            <Tag size={20} /> Tag Manager
          </h2>
          <button onClick={onClose} className="close-button">
            <X size={20} />
          </button>
        </div>

        <div className="tag-manager-content">
          {/* Add New Tag */}
          <div className="add-tag-section">
            <h3>Add New Tag</h3>
            <div className="add-tag-input">
              <Plus size={16} />
              <input
                type="text"
                placeholder="Enter tag name..."
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={handleAddTag}
              />
            </div>
          </div>

          {/* All Tags */}
          <div className="tags-section">
            <h3>All Tags ({allTags.length})</h3>
            <div className="tags-grid">
              {allTags.length === 0 ? (
                <p className="no-tags">No tags yet. Create tags by editing cards.</p>
              ) : (
                allTags.map((tag) => (
                  <div
                    key={tag}
                    className={`tag-card ${selectedTags.includes(tag) ? 'selected' : ''}`}
                    onClick={() => {
                      setSelectedTags((prev) =>
                        prev.includes(tag)
                          ? prev.filter((t) => t !== tag)
                          : [...prev, tag]
                      );
                    }}
                  >
                    <div className="tag-card-header">
                      <span className="tag-name">{tag}</span>
                      <span className="tag-count">{tagFrequency.get(tag) || 0}</span>
                    </div>
                    <div className="tag-card-actions">
                      <button
                        className="tag-action-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          setRenameTag({ old: tag, new: tag });
                        }}
                        title="Rename tag"
                      >
                        ✏️
                      </button>
                      <button
                        className="tag-action-btn delete-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm(`Delete tag "${tag}" and remove from all cards?`)) {
                            handleDeleteTag(tag);
                          }
                        }}
                        title="Delete tag"
                      >
                        🗑️
                      </button>
                    </div>

                    {/* Rename Input */}
                    {renameTag?.old === tag && (
                      <div className="tag-rename-input" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="text"
                          value={renameTag.new}
                          onChange={(e) =>
                            setRenameTag({ ...renameTag, new: e.target.value })
                          }
                          autoFocus
                        />
                        <button
                          onClick={() => handleRenameTag(renameTag.old, renameTag.new)}
                        >
                          Save
                        </button>
                        <button onClick={() => setRenameTag(null)}>Cancel</button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Filter by Selected Tags */}
          {selectedTags.length > 0 && (
            <div className="filter-results-section">
              <h3>
                Cards with selected tags: <span className="count">{filteredCards.length}</span>
              </h3>
              <div className="filtered-cards-list">
                {filteredCards.map((card) => (
                  <div key={card.id} className="filtered-card">
                    <h4>{card.title}</h4>
                    <p>{stripHtmlPreview(card.content, 100)}</p>
                  </div>
                ))}
              </div>
              <button
                className="clear-filter-btn"
                onClick={() => setSelectedTags([])}
              >
                Clear Filter
              </button>
            </div>
          )}

          {/* Statistics */}
          <div className="stats-section">
            <h3>Statistics</h3>
            <div className="stats-grid">
              <div className="stat">
                <div className="stat-value">{allTags.length}</div>
                <div className="stat-label">Total Tags</div>
              </div>
              <div className="stat">
                <div className="stat-value">{currentCanvas?.cards.length || 0}</div>
                <div className="stat-label">Total Cards</div>
              </div>
              <div className="stat">
                <div className="stat-value">
                  {currentCanvas ? (currentCanvas.cards.filter((c) => c.tags.length > 0).length) : 0}
                </div>
                <div className="stat-label">Tagged Cards</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function stripHtmlPreview(html: string, maxLength: number): string {
  const div = document.createElement('div');
  div.innerHTML = html;
  const text = div.textContent || div.innerText || '';
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
}
