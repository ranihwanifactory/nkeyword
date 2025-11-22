export interface KeywordRank {
  rank: number;
  keyword: string;
  category: string;
  change: 'up' | 'down' | 'new' | 'same';
  volumeEstimate: string;
}

export interface TrendDataPoint {
  date: string;
  value: number;
}

export interface RelatedKeyword {
  keyword: string;
  relevance: number; // 0-100
}

export interface KeywordAnalysis {
  keyword: string;
  searchVolume: string;
  competition: 'Low' | 'Medium' | 'High' | 'Very High';
  competitionScore: number; // 0-100
  cpcEstimate: string;
  summary: string;
  trendData: TrendDataPoint[];
  relatedKeywords: RelatedKeyword[];
  sources: string[];
}

export enum AppTab {
  TOP_CHART = 'TOP_CHART',
  ANALYZER = 'ANALYZER',
}