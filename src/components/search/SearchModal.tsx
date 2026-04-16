// src/components/search/SearchModal.tsx
import React, { useState, useCallback, useMemo } from 'react';
import { useCanvasStore } from '../../store/canvasStore';
import { searchCards, getAllTags, suggestTagsForCard } from '../../utils/search';
import { Search, X, Tag, Calendar } from 'lucide-react';
import './SearchModal.css';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<{ from: string; to: string }>({
    from: '',
    to: '',
  });

  const currentCanvas = useCanvasStore((state) => state.getCurrentCanvas());
  const availableTags = useMemo(
    () => (currentCanvas ? getAllTags(currentCanvas) : []),
    [currentCanvas]
  );

  const results = useMemo(() => {
    if (!currentCanvas) return [];

    const filters: any = {};
    if (selectedTags.length > 0) {
      filters.tags = selectedTags;
    }
    if (dateRange.from && dateRange.to) {
      filters.dateRange = {
        from: new Date(dateRange.from),
        to: new Date(dateRange.to),
      };
    }

    return searchCards(currentCanvas, query, Object.keys(filters).length > 0 ? filters : undefined);
  }, [query, selectedTags, dateRange, currentCanvas]);

  if (!isOpen) return null;

  return (
    <div className="search-modal-overlay" onClick={onClose}>
      <div className="search-modal" onClick={(e) => e.stopPropagation()}>
        <div className="search-modal-header">
          <div className="search-input-wrapper">
            <Search size={20} className="search-icon" />
            <input
              type="text"
              placeholder="Search notes, tags, content..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
              className="search-input"
            />
          </div>
          <button onClick={onClose} className="close-button">
            <X size={20} />
          </button>
        </div>

        <div className="search-filters">
          {/* Tag Filter */}
          <div className="filter-section">
            <label className="filter-label">
              <Tag size={16} /> Filter by Tags
            </label>
            <div className="tag-filter">
              {availableTags.map((tag) => (
                <button
                  key={tag}
                  className={`tag-button ${selectedTags.includes(tag) ? 'active' : ''}`}
                  onClick={() => {
                    setSelectedTags((prev) =>
                      prev.includes(tag)
                        ? prev.filter((t) => t !== tag)
                        : [...prev, tag]
                    );
                  }}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Date Range Filter */}
          <div className="filter-section">
            <label className="filter-label">
              <Calendar size={16} /> Filter by Date
            </label>
            <div className="date-filter">
              <input
                type="date"
                value={dateRange.from}
                onChange={(e) => setDateRange((prev) => ({ ...prev, from: e.target.value }))}
                className="date-input"
                placeholder="From"
              />
              <span className="date-separator">to</span>
              <input
                type="date"
                value={dateRange.to}
                onChange={(e) => setDateRange((prev) => ({ ...prev, to: e.target.value }))}
                className="date-input"
                placeholder="To"
              />
            </div>
          </div>
        </div>

        <div className="search-results">
          {results.length === 0 ? (
            <div className="no-results">
              {query ? 'No results found.' : 'Enter a search term or filter by tags.'}
            </div>
          ) : (
            <div className="results-list">
              <div className="results-count">{results.length} result(s)</div>
              {results.map((result) => (
                <div key={result.card.id} className="result-item">
                  <div className="result-header">
                    {result.matches.title && <span className="match-badge">Title</span>}
                    {result.matches.content && <span className="match-badge">Content</span>}
                    {result.matches.tags && <span className="match-badge">Tag</span>}
                  </div>
                  <h3 className="result-title">{result.card.title}</h3>
                  <p className="result-preview">{stripHtmlPreview(result.card.content, 150)}</p>
                  {result.card.tags.length > 0 && (
                    <div className="result-tags">
                      {result.card.tags.map((tag) => (
                        <span key={tag} className="result-tag">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="result-meta">
                    Updated: {new Date(result.card.updatedAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          )}
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
