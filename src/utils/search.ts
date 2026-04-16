// src/utils/search.ts
import { Canvas, NoteCard } from '../types';

export interface SearchResult {
  card: NoteCard;
  matches: {
    title: boolean;
    content: boolean;
    tags: boolean;
  };
  score: number;
}

/**
 * Full-text search across canvas cards
 * Searches in: title, content, and tags
 * Returns ranked results based on relevance
 */
export const searchCards = (
  canvas: Canvas,
  query: string,
  filters?: {
    tags?: string[];
    dateRange?: { from: Date; to: Date };
  }
): SearchResult[] => {
  if (!query.trim()) return [];

  const normalizedQuery = query.toLowerCase().trim();
  const queryTokens = normalizedQuery.split(/\s+/).filter((t) => t.length > 0);

  let results: SearchResult[] = canvas.cards
    .map((card) => {
      const titleMatch = matchesQuery(card.title.toLowerCase(), normalizedQuery, queryTokens);
      const contentMatch = matchesQuery(stripHtmlTags(card.content).toLowerCase(), normalizedQuery, queryTokens);
      const tagsMatch = card.tags.some((tag) => matchesQuery(tag.toLowerCase(), normalizedQuery, queryTokens));

      if (!titleMatch && !contentMatch && !tagsMatch) {
        return null;
      }

      // Calculate relevance score
      let score = 0;
      if (titleMatch) score += 3; // title matches are most relevant
      if (contentMatch) score += 1;
      if (tagsMatch) score += 2;

      // Boost score for exact matches
      if (card.title.toLowerCase().includes(normalizedQuery)) score += 2;

      return {
        card,
        matches: { title: titleMatch, content: contentMatch, tags: tagsMatch },
        score,
      };
    })
    .filter((result): result is SearchResult => result !== null);

  // Apply filters if provided
  if (filters) {
    if (filters.tags && filters.tags.length > 0) {
      results = results.filter((result) =>
        filters.tags!.some((tag) => result.card.tags.includes(tag))
      );
    }

    if (filters.dateRange) {
      results = results.filter((result) => {
        const cardDate = new Date(result.card.updatedAt);
        return (
          cardDate >= filters.dateRange!.from &&
          cardDate <= filters.dateRange!.to
        );
      });
    }
  }

  // Sort by relevance score
  return results.sort((a, b) => b.score - a.score);
};

/**
 * Search across multiple canvases
 */
export const searchAllCanvases = (
  canvases: Canvas[],
  query: string,
  filters?: {
    tags?: string[];
    dateRange?: { from: Date; to: Date };
  }
): Map<string, SearchResult[]> => {
  const resultsMap = new Map<string, SearchResult[]>();

  canvases.forEach((canvas) => {
    const results = searchCards(canvas, query, filters);
    if (results.length > 0) {
      resultsMap.set(canvas.name, results);
    }
  });

  return resultsMap;
};

/**
 * Get all unique tags from a canvas
 */
export const getAllTags = (canvas: Canvas): string[] => {
  const tagsSet = new Set<string>();
  canvas.cards.forEach((card) => {
    card.tags.forEach((tag) => tagsSet.add(tag));
  });
  return Array.from(tagsSet).sort();
};

/**
 * Get all unique tags from multiple canvases
 */
export const getAllTagsFromCanvases = (canvases: Canvas[]): string[] => {
  const tagsSet = new Set<string>();
  canvases.forEach((canvas) => {
    getAllTags(canvas).forEach((tag) => tagsSet.add(tag));
  });
  return Array.from(tagsSet).sort();
};

/**
 * Filter cards by tags
 */
export const filterCardsByTags = (canvas: Canvas, tags: string[]): NoteCard[] => {
  if (tags.length === 0) return canvas.cards;

  return canvas.cards.filter((card) =>
    tags.some((tag) => card.tags.includes(tag))
  );
};

/**
 * Filter cards by date range
 */
export const filterCardsByDateRange = (
  canvas: Canvas,
  from: Date,
  to: Date
): NoteCard[] => {
  return canvas.cards.filter((card) => {
    const cardDate = new Date(card.updatedAt);
    return cardDate >= from && cardDate <= to;
  });
};

/**
 * Get cards modified in the last N days
 */
export const getRecentCards = (canvas: Canvas, days: number): NoteCard[] => {
  const now = new Date();
  const fromDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
  return filterCardsByDateRange(canvas, fromDate, now);
};

/**
 * Get tag frequency for analytics
 */
export const getTagFrequency = (canvas: Canvas): Map<string, number> => {
  const frequency = new Map<string, number>();
  canvas.cards.forEach((card) => {
    card.tags.forEach((tag) => {
      frequency.set(tag, (frequency.get(tag) || 0) + 1);
    });
  });
  return frequency;
};

/**
 * Suggest tags based on card content
 */
export const suggestTagsForCard = (
  card: NoteCard,
  existingTags: string[],
  maxSuggestions: number = 5
): string[] => {
  const cardText = `${card.title} ${stripHtmlTags(card.content)}`.toLowerCase();
  const suggestions: { tag: string; score: number }[] = [];

  existingTags.forEach((tag) => {
    const tagLower = tag.toLowerCase();
    let score = 0;

    // Check how many times the tag appears in the card
    const regex = new RegExp(`\\b${tagLower}\\b`, 'g');
    const matches = cardText.match(regex);
    score += (matches ? matches.length : 0) * 2;

    // Check for partial matches
    if (cardText.includes(tagLower)) {
      score += 1;
    }

    if (score > 0) {
      suggestions.push({ tag, score });
    }
  });

  return suggestions
    .sort((a, b) => b.score - a.score)
    .slice(0, maxSuggestions)
    .map((s) => s.tag);
};

// ===== Helper Functions =====
function matchesQuery(text: string, query: string, tokens: string[]): boolean {
  // Check if full query matches
  if (text.includes(query)) return true;

  // Check if all tokens match (AND logic)
  return tokens.every((token) => text.includes(token));
}

function stripHtmlTags(html: string): string {
  const div = document.createElement('div');
  div.innerHTML = html;
  return div.textContent || div.innerText || '';
}

// ===== Fuzzy Search (Optional Advanced Feature) =====
/**
 * Fuzzy search with typo tolerance
 */
export const fuzzySearch = (
  canvas: Canvas,
  query: string,
  maxDistance: number = 2
): SearchResult[] => {
  const normalizedQuery = query.toLowerCase().trim();

  const results: SearchResult[] = canvas.cards
    .map((card) => {
      const titleDistance = levenshteinDistance(card.title.toLowerCase(), normalizedQuery);
      const contentDistance = levenshteinDistance(
        stripHtmlTags(card.content).toLowerCase(),
        normalizedQuery
      );
      const minDistance = Math.min(titleDistance, contentDistance);

      if (minDistance <= maxDistance) {
        return {
          card,
          matches: {
            title: titleDistance <= maxDistance,
            content: contentDistance <= maxDistance,
            tags: false,
          },
          score: maxDistance - minDistance,
        };
      }

      return null;
    })
    .filter((result): result is SearchResult => result !== null)
    .sort((a, b) => b.score - a.score);

  return results;
};

/**
 * Calculate Levenshtein distance for fuzzy matching
 */
function levenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = Array(a.length + 1)
    .fill(null)
    .map(() => Array(b.length + 1).fill(0));

  for (let i = 0; i <= a.length; i++) matrix[i][0] = i;
  for (let j = 0; j <= b.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      if (a[i - 1] === b[j - 1]) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }

  return matrix[a.length][b.length];
}
