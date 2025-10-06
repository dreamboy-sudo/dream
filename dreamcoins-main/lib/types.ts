import { DreamStatus, Environment, Dream as PrismaDream } from "@prisma/client";

export type DreamMode = "dream" | "baldo" | "thanksgiving" | "dreamgirl";

export interface PaginatedDreamsResponse {
  data: Dream[];
  nextCursor: number | null;
  hasMore: boolean;
}

export interface GetDreamsResponse {
  dreams: Dream[];
  isLoading: boolean;
  error: Error | null;
  hasMore: boolean;
  loadMore: () => Promise<void>;
  refresh: () => Promise<void>;
}

export type Dream = PrismaDream;

export type SubmitDreamPreviewResult = {
  name: string;
  symbol: string;
  imageUrl: string;
}


export type SubmitDreamResult = {
  address: string | null;
  chainId: null;
  createdAt: string;
  environment: Environment;
  id: number;
  imageUrl: string;
  metadata: null;
  name: string;
  prompt: string;
  status: DreamStatus;
  ticker: string;
  updatedAt: string;
  userId: number;
}


export interface NewsArticle {
  title: string;
  description: string;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  source: {
    name: string;
    url: string;
  };
  category: 'crypto' | 'meme' | 'nft' | 'web3';
  sentiment?: {
    score: number;
    label: 'positive' | 'negative' | 'neutral';
  };
}

export interface NewsResponse {
  status: 'success' | 'error';
  totalResults: number;
  articles: NewsArticle[];
  error?: {
    code: string;
    message: string;
  };
}
