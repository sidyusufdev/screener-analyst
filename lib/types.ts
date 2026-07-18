export interface StockAnalysis {
  rank: number;
  name: string;
  symbol: string;
  score: number; // 0-10
  probability: number; // 0-100
  sector: string;
  newsRating: string; // "positive" | "neutral" | "negative"
  entry: string;
  stopLoss: string;
  target1: string;
  target2: string;
  reasoning: string;
  avoidIf: string;
  confidence: string; // "high" | "medium" | "low"
}

export interface SectorAnalysis {
  name: string;
  rank: number;
  strength: string; // "strong" | "neutral" | "weak"
}

export interface AnalysisResponse {
  marketScore: number; // 0-10
  marketSummary: string;
  marketRegime: string; // "bullish" | "neutral" | "bearish"
  sectors: SectorAnalysis[];
  stocks: StockAnalysis[];
  topPick: string; // symbol
  secondPick: string;
  thirdPick: string;
  avoidPick: string;
  avoidReason: string;
  watchlist: string[];
  disclaimer: string;
}

export interface AnalyzerState {
  file: File | null;
  preview: string | null;
  loading: boolean;
  results: AnalysisResponse | null;
  error: string | null;
  loadingMessage: string;
}
