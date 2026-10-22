import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export interface KnowledgeItem {
  contentType: 'lesson' | 'grammar' | 'kanji' | 'vocabulary' | 'reading';
  id: string;
  jlptLevel: string;
  title: string;
  content: string;
  source: string;
  tags?: string[];
}

class SenseiKnowledgeService {
  private knowledge: KnowledgeItem[] = [];

  constructor() {
    this.loadKnowledge();
  }

  private loadKnowledge() {
    try {
      const dataPath = path.resolve(__dirname, '../../data/platformKnowledge.json');
      const fileData = fs.readFileSync(dataPath, 'utf-8');
      this.knowledge = JSON.parse(fileData);
      console.log(`[SenseiKnowledge] Loaded ${this.knowledge.length} items.`);
    } catch (err) {
      console.error('[SenseiKnowledge] Failed to load platformKnowledge.json', err);
    }
  }

  /**
   * Deterministic keyword search. 
   * Tokenizes user query, searches titles and content.
   * Ranks by title exact match > title partial > content partial.
   * Also favors user's jlptLevel if provided.
   */
  public search(query: string, userJlptLevel?: string, maxResults = 5): KnowledgeItem[] {
    if (!query || query.trim().length === 0) return [];
    
    // Naive tokenization: split by spaces and remove punctuation
    const rawTokens = query.toLowerCase().replace(/[^\w\s\u3000-\u303f\u3040-\u309f\u30a0-\u30ff\uff00-\uff9f\u4e00-\u9faf]/g, ' ').split(/\s+/);
    const tokens = rawTokens.filter(t => t.length > 1 || /[\u3040-\u309f\u30a0-\u30ff\u4e00-\u9faf]/.test(t));
    
    if (tokens.length === 0) {
      // If query is just 1 Japanese character (like '水'), it won't pass length > 1, so let's preserve exact queries
      const exact = query.trim().toLowerCase();
      tokens.push(exact);
    }

    const scoredItems = this.knowledge.map(item => {
      let score = 0;
      const titleLower = item.title.toLowerCase();
      const contentLower = item.content.toLowerCase();
      
      for (const token of tokens) {
        const isJapanese = /[\u3040-\u309f\u30a0-\u30ff\u4e00-\u9faf]/.test(token);
        const isStopWord = ['how', 'do', 'you', 'read', 'what', 'is', 'the', 'meaning', 'of', 'explain', 'use', 'can', 'about', 'want', 'learn'].includes(token);
        
        const weight = isJapanese ? 50 : (isStopWord ? 0 : 5);
        
        if (titleLower === token) {
          score += 100 + weight * 2;
        } else if (titleLower.includes(token)) {
          score += 20 + weight;
        } else if (contentLower.includes(token)) {
          score += 5 + weight;
        } else if (item.tags && item.tags.some(t => t.toLowerCase().includes(token))) {
          score += 10 + weight;
        }
      }

      if (score > 0 && userJlptLevel && item.jlptLevel === userJlptLevel) {
        score += 2; // Slight boost for matching level
      }

      return { item, score };
    });

    const results = scoredItems
      .filter(i => i.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, maxResults)
      .map(i => i.item);

    return results;
  }
}

export const senseiKnowledge = new SenseiKnowledgeService();
