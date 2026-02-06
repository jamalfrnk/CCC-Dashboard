import { DatabaseSchema, AiJournalEntry } from "../../../types";

// --- SHEETS EXPORT BUILDER ---
// Goal: Return objects with EXACT keys matching the requested tab headers

export function buildSheetsExport(data: DatabaseSchema) {
  return {
    portfolio_metrics: data.snapshots.map(s => ({
      Date: s.date,
      "Total Value": s.totalValue,
      "Cash Balance": s.cashBalance,
      "Positions Value": s.positionsValue,
      "PnL ($)": s.pnlUsd,
      "PnL (%)": s.pnlPct,
      "Drawdown (%)": s.drawdownPct,
      "Risk Status": s.riskStatus
    })),
    
    trade_log: data.trades.map(t => ({
      "ID": t.id,
      "Date": t.date,
      "Symbol": t.symbol,
      "Side": t.side,
      "Amount": t.amount,
      "Price": t.price,
      "Total ($)": t.totalUsd,
      "Status": t.status
    })),
    
    defi_positions: data.defiPositions.map(p => ({
      "Protocol": p.protocol,
      "Chain": p.chain,
      "Asset": p.asset,
      "Type": p.type,
      "Amount": p.amount,
      "USD Value": p.usdValue,
      "APY (%)": p.apy
    })),

    risk_alerts: data.alerts.map(a => ({
      "Date": a.date,
      "Type": a.type,
      "Severity": a.severity,
      "Message": a.message,
      "Acknowledged": a.acknowledged
    })),

    ai_journal: data.journal.map(j => ({
      "Entry Date": j.date,
      "Summary": j.summary,
      "Risk Commentary": j.riskCommentary,
      "Discipline Notes": j.disciplineNotes,
      "Tomorrow Focus": j.tomorrowFocus,
      "Snapshot Date": j.date // Usually same as entry date
    }))
  };
}

// Helper to convert object array to CSV string
export function toCSV(data: any[]): string {
  if (data.length === 0) return "";
  const headers = Object.keys(data[0]);
  const rows = data.map(row => 
    headers.map(header => {
      const val = row[header];
      return typeof val === 'string' ? `"${val.replace(/"/g, '""')}"` : val;
    }).join(",")
  );
  return [headers.join(","), ...rows].join("\n");
}
