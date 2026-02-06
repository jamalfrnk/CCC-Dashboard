// FDS Data Models (Mirroring Request Schema)

export type User = {
  id: string;
  username: string;
  email: string;
  createdAt: string;
};

export type PortfolioSnapshot = {
  id: string;
  date: string;
  totalValue: number;
  cashBalance: number;
  positionsValue: number;
  pnlUsd: number;
  pnlPct: number;
  drawdownPct: number;
  riskStatus: 'SAFE' | 'WARNING' | 'CRITICAL';
  notes?: string;
};

export type Trade = {
  id: string;
  date: string;
  symbol: string;
  side: 'BUY' | 'SELL';
  amount: number;
  price: number;
  totalUsd: number;
  feeUsd: number;
  status: 'FILLED' | 'PENDING' | 'FAILED';
};

export type DefiPosition = {
  id: string;
  protocol: string;
  chain: string;
  asset: string;
  type: 'LENDING' | 'LP' | 'STAKING';
  amount: number;
  usdValue: number;
  apy: number;
  healthFactor?: number; // For lending
};

export type RiskAlert = {
  id: string;
  date: string;
  type: 'DRAWDOWN' | 'EXPOSURE' | 'MARGIN';
  severity: 'WARNING' | 'CRITICAL';
  message: string;
  acknowledged: boolean;
};

export type AiJournalEntry = {
  id: string;
  date: string;
  summary: string;
  riskCommentary: string;
  disciplineNotes: string;
  tomorrowFocus: string;
};

export interface DatabaseSchema {
  user: User | null;
  snapshots: PortfolioSnapshot[];
  trades: Trade[];
  defiPositions: DefiPosition[];
  alerts: RiskAlert[];
  journal: AiJournalEntry[];
}
