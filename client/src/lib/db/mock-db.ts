// Mock Database Store
// In a real app, this would be Prisma/Postgres.
// Here, we use an in-memory store with local storage persistence for the mockup.

export type Trade = {
  id: string;
  symbol: string;
  side: 'buy' | 'sell';
  amount: number;
  price: number;
  timestamp: string;
};

export type PortfolioSnapshot = {
  id: string;
  date: string;
  totalValue: number;
  cashBalance: number;
  positionsValue: number;
};

class MockDB {
  private trades: Trade[] = [];
  private snapshots: PortfolioSnapshot[] = [];

  constructor() {
    this.load();
  }

  private load() {
    if (typeof window === 'undefined') return;
    try {
      const storedTrades = localStorage.getItem('fds_trades');
      const storedSnapshots = localStorage.getItem('fds_snapshots');
      if (storedTrades) this.trades = JSON.parse(storedTrades);
      if (storedSnapshots) this.snapshots = JSON.parse(storedSnapshots);
    } catch (e) {
      console.error("Failed to load mock DB", e);
    }
  }

  private save() {
    if (typeof window === 'undefined') return;
    localStorage.setItem('fds_trades', JSON.stringify(this.trades));
    localStorage.setItem('fds_snapshots', JSON.stringify(this.snapshots));
  }

  // Trades
  async getTrades() {
    return this.trades;
  }

  async addTrade(trade: Trade) {
    this.trades.push(trade);
    this.save();
    return trade;
  }

  // Snapshots
  async getSnapshots() {
    return this.snapshots;
  }
  
  async addSnapshot(snapshot: PortfolioSnapshot) {
    this.snapshots.push(snapshot);
    this.save();
    return snapshot;
  }

  async clear() {
    this.trades = [];
    this.snapshots = [];
    this.save();
  }
}

export const db = new MockDB();
