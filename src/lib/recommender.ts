import perfumesData from '@/data/perfumes.json';

// Types
export interface Perfume {
  id: string;
  brand: string;
  name: string;
  family: string;
  notes: {
    top: string[];
    middle: string[];
    base: string[];
  };
  description: string;
  tags: string[];
  link?: string;
  matchScore?: number;
  reasoning?: string;
}

interface QuizAnswers {
  [key: string]: string | string[];
}

// Simple TF-IDF / Cosine Logic in Pure TS
class RecommenderEngine {
  private perfumes: Perfume[];
  private corpus: string[];
  private idf: { [term: string]: number } = {};
  private vocabulary: string[] = [];
  private vectors: { [id: string]: number[] } = {};

  constructor(data: Perfume[]) {
    this.perfumes = data;
    this.corpus = [];
    this.ingestData();
  }

  // Pre-process and build vectors
  private ingestData() {
    // 1. Build Corpus
    this.perfumes.forEach((p) => {
      const allNotes = [
        ...p.notes.top,
        ...p.notes.middle,
        ...p.notes.base,
      ].join(' ');
      const text =
        `${p.family} ${allNotes} ${p.tags.join(' ')} ${p.description}`.toLowerCase();
      this.corpus.push(text);
    });

    // 2. Build Vocabulary & Calculate Doc Frequencies
    const docFreq: { [term: string]: number } = {};
    const totalDocs = this.corpus.length;

    this.corpus.forEach((text) => {
      const terms = new Set(text.split(/\s+/)); // Unique terms per doc
      terms.forEach((term) => {
        if (term.length < 2) return; // Skip short words
        if (!docFreq[term]) docFreq[term] = 0;
        docFreq[term]++;
      });
    });

    this.vocabulary = Object.keys(docFreq);

    // 3. Calculate IDF
    this.vocabulary.forEach((term) => {
      this.idf[term] = Math.log(totalDocs / (1 + docFreq[term]));
    });

    // 4. Build TF-IDF Vectors for Perfumes
    this.perfumes.forEach((p, idx) => {
      this.vectors[p.id] = this.textToVector(this.corpus[idx]);
    });
  }

  private textToVector(text: string): number[] {
    const terms = text.toLowerCase().split(/\s+/);
    const termCounts: { [term: string]: number } = {};
    terms.forEach((t) => {
      termCounts[t] = (termCounts[t] || 0) + 1;
    });

    return this.vocabulary.map((vocabTerm) => {
      const tf = termCounts[vocabTerm] || 0;
      return tf * (this.idf[vocabTerm] || 0);
    });
  }

  private cosineSimilarity(vecA: number[], vecB: number[]): number {
    let dot = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < vecA.length; i++) {
      dot += vecA[i] * vecB[i];
      normA += vecA[i] * vecA[i];
      normB += vecB[i] * vecB[i];
    }

    return dot / (Math.sqrt(normA) * Math.sqrt(normB) || 1);
  }

  public analyzeUser(answers: QuizAnswers): { dna: number[]; keywords: string[] } {
    const keywords: string[] = [];

    // Mappings
    const vibeMap: Record<string, string> = {
      clean: "fresh clean citrus soap",
      dark: "dark incense leather tobacco smoky",
      warm: "warm amber vanilla spicy cozy",
      floral: "rose jasmine floral bouquet romantic",
    };

    const memoryMap: Record<string, string> = {
      woody_rain: "pine cedar vetiver woody rain earth",
      gourmand_cookies: "vanilla sugar chocolate sweet gourmand",
      floral_rose: "rose garden floral fresh petals",
      citrus_beach: "lime lemon salt sea ocean beach"
    };

    // Extract keywords
    Object.values(answers).flat().forEach((val) => {
      const v = val.toString();
      if (vibeMap[v]) keywords.push(vibeMap[v]);
      if (memoryMap[v]) keywords.push(memoryMap[v]);
    });

    const queryText = keywords.join(" ") || "fresh clean";
    const userVector = this.textToVector(queryText);

    return { dna: userVector, keywords };
  }

  public recommend(userVector: number[], userKeywords: string[], topK = 4) {
    const scores: { id: string; score: number }[] = [];

    this.perfumes.forEach((p) => {
      const score = this.cosineSimilarity(userVector, this.vectors[p.id]);
      scores.push({ id: p.id, score });
    });

    // Sort
    const topResults = scores
      .sort((a, b) => b.score - a.score)
      .slice(0, topK);

    // Hydrate & Reasoning
    // Optimized explanation logic (set-based)
    const searchTerms = new Set(
      userKeywords.join(" ").toLowerCase().split(/\s+/)
    );

    return topResults.map((res) => {
      const p = this.perfumes.find((x) => x.id === res.id)!;
      const perfumeClone = { ...p, matchScore: Math.round(res.score * 100) };

      // Reasoning
      const pText = `${p.family} ${p.notes.top} ${p.notes.middle} ${p.notes.base} ${p.tags}`.toLowerCase();
      const pTokens = new Set(pText.split(/,| /)); // Split by comma or space

      // Intersect
      const matched = [];
      for (const term of Array.from(searchTerms)) {
        if (pTokens.has(term) && term.length > 2 && !['notes', 'accord'].includes(term)) {
          matched.push(term);
        }
      }

      const uniqueReasons = Array.from(new Set(matched)).slice(0, 3);
      perfumeClone.reasoning = uniqueReasons.length > 0
        ? `Matches your love for ${uniqueReasons.join(', ')}`
        : "Matches your overall vibe";

      return perfumeClone;
    });
  }
}

// Singleton export
export const recommender = new RecommenderEngine(perfumesData as Perfume[]);
