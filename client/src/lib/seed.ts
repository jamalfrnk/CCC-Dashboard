import { 
  DatabaseSchema, 
  PortfolioSnapshot, 
  Trade, 
  DefiPosition, 
  RiskAlert, 
  AiJournalEntry,
  User 
} from "./types";
import { subDays, format } from "date-fns";

// Deterministic Seed Generator
export function generateSeedData(): DatabaseSchema {
  const snapshots: PortfolioSnapshot[] = [];
  const trades: Trade[] = [];
  const defiPositions: DefiPosition[] = [];
  const alerts: RiskAlert[] = [];
  const journal: AiJournalEntry[] = [];

  const startDate = new Date();
  let currentNav = 100000; // Start with $100k
  const peakNav = 105000; // Artificial peak for drawdown calcs

  // Generate 14 days of history
  for (let i = 13; i >= 0; i--) {
    const date = subDays(startDate, i);
    const dateStr = format(date, 'yyyy-MM-dd');
    
    // Simulate market movement (deterministic random-ish)
    const dailyChangePct = (Math.sin(i) * 2 + (i % 3 === 0 ? -1.5 : 0.5)) / 100;
    const pnlUsd = currentNav * dailyChangePct;
    currentNav += pnlUsd;
    
    const cashRatio = 0.2 + (Math.cos(i) * 0.1); // Fluctuates between 10-30%
    const cashBalance = currentNav * cashRatio;
    const positionsValue = currentNav - cashBalance;
    
    const drawdownPct = Math.max(0, (peakNav - currentNav) / peakNav * 100);
    
    let riskStatus: 'SAFE' | 'WARNING' | 'CRITICAL' = 'SAFE';
    if (drawdownPct > 10) riskStatus = 'CRITICAL';
    else if (drawdownPct > 5) riskStatus = 'WARNING';

    // 1. Snapshot
    snapshots.push({
      id: `snap-${i}`,
      date: dateStr,
      totalValue: Number(currentNav.toFixed(2)),
      cashBalance: Number(cashBalance.toFixed(2)),
      positionsValue: Number(positionsValue.toFixed(2)),
      pnlUsd: Number(pnlUsd.toFixed(2)),
      pnlPct: Number((dailyChangePct * 100).toFixed(2)),
      drawdownPct: Number(drawdownPct.toFixed(2)),
      riskStatus,
    });

    // 2. Trades (Only on some days)
    if (i % 2 === 0) {
      trades.push({
        id: `trade-${i}-1`,
        date: dateStr,
        symbol: i % 4 === 0 ? "ETH-USD" : "SOL-USD",
        side: dailyChangePct > 0 ? "BUY" : "SELL",
        amount: Number((Math.random() * 10).toFixed(4)),
        price: i % 4 === 0 ? 2500 + (Math.random() * 100) : 140 + (Math.random() * 10),
        totalUsd: 1000, // Simplified
        feeUsd: 5,
        status: 'FILLED'
      });
    }

    // 3. Alerts (If risk status is bad)
    if (riskStatus !== 'SAFE') {
      alerts.push({
        id: `alert-${i}`,
        date: dateStr,
        type: 'DRAWDOWN',
        severity: riskStatus,
        message: `Drawdown limit breached: ${drawdownPct.toFixed(2)}%`,
        acknowledged: false
      });
    }

    // 4. Journal (Daily)
    journal.push({
      id: `journal-${i}`,
      date: dateStr,
      summary: dailyChangePct > 0 ? "Market trended up, captured volatility." : "Choppy market, stayed defensive.",
      riskCommentary: riskStatus === 'SAFE' ? "Exposure managed well." : "Drawdown nearing limits, need to hedge.",
      disciplineNotes: "Followed plan.",
      tomorrowFocus: "Watch ETH resistance levels."
    });
  }

  // 5. DeFi Positions (Current State)
  defiPositions.push(
    {
      id: "pos-1",
      protocol: "Aave V3",
      chain: "Arbitrum",
      asset: "USDC",
      type: "LENDING",
      amount: 50000,
      usdValue: 50000,
      apy: 4.5,
      healthFactor: 1.8
    },
    {
      id: "pos-2",
      protocol: "Uniswap V3",
      chain: "Mainnet",
      asset: "ETH/USDC",
      type: "LP",
      amount: 1.5,
      usdValue: 3500, // Approx
      apy: 12.4
    }
  );

  return {
    user: {
      id: "user-1",
      username: "AlphaOperator",
      email: "op@fds.com",
      createdAt: new Date().toISOString()
    },
    snapshots,
    trades,
    defiPositions,
    alerts,
    journal
  };
}
