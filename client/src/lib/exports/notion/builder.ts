import { DatabaseSchema } from "../../../types";

// --- NOTION EXPORT BUILDER ---
// Goal: Return objects formatted as Notion Page Properties
// https://developers.notion.com/reference/post-page

export function buildNotionExport(data: DatabaseSchema) {
  return {
    "Portfolio Metrics": data.snapshots.map(s => ({
      "Date": { date: { start: s.date } },
      "Total Value": { number: s.totalValue },
      "Risk Status": { select: { name: s.riskStatus } },
      "Drawdown": { number: s.drawdownPct }
    })),

    "Trade Log": data.trades.map(t => ({
      "Date": { date: { start: t.date } },
      "Symbol": { title: [{ text: { content: t.symbol } }] },
      "Side": { select: { name: t.side } },
      "Price": { number: t.price },
      "Amount": { number: t.amount }
    })),

    "Risk Alerts": data.alerts.map(a => ({
      "Date": { date: { start: a.date } },
      "Message": { title: [{ text: { content: a.message } }] },
      "Type": { select: { name: a.type } },
      "Severity": { select: { name: a.severity } }
    })),

    "AI Performance Journal": data.journal.map(j => ({
      "Entry Date": { date: { start: j.date } },
      "Summary": { rich_text: [{ text: { content: j.summary } }] },
      "Risk Commentary": { rich_text: [{ text: { content: j.riskCommentary } }] },
      "Discipline Notes": { rich_text: [{ text: { content: j.disciplineNotes } }] },
      "Tomorrow Focus": { rich_text: [{ text: { content: j.tomorrowFocus } }] }
    }))
  };
}
