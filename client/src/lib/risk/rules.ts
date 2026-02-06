import { z } from "zod";
import { PortfolioSnapshot, DefiPosition, RiskAlert } from "../types";

// 1. Zod Schemas for Input Validation
export const SnapshotSchema = z.object({
  id: z.string(),
  date: z.string(),
  totalValue: z.number().positive(),
  cashBalance: z.number(),
  positionsValue: z.number(),
  drawdownPct: z.number().min(0).max(100),
  riskStatus: z.enum(['SAFE', 'WARNING', 'CRITICAL']),
});

export const PositionSchema = z.object({
  asset: z.string(),
  usdValue: z.number().nonnegative(),
});

// 2. Constants matching requirements
export const RISK_THRESHOLDS = {
  DRAWDOWN: {
    WARNING: 3,
    CRITICAL: 5,
  },
  EXPOSURE_SOL: {
    WARNING: 40,
    CRITICAL: 50,
  }
};

// 3. Pure Function: Evaluate Risk
export function evaluateRisk(
  snapshot: PortfolioSnapshot,
  positions: DefiPosition[]
): RiskAlert[] {
  // Validate inputs (runtime check)
  // In a real app we might throw, here we log and proceed safely
  try {
    SnapshotSchema.partial().parse(snapshot);
    z.array(PositionSchema.partial()).parse(positions);
  } catch (e) {
    console.error("Risk Input Validation Failed", e);
    return [];
  }

  const alerts: RiskAlert[] = [];
  const now = new Date().toISOString();

  // --- RULE 1: DRAWDOWN ---
  if (snapshot.drawdownPct > RISK_THRESHOLDS.DRAWDOWN.CRITICAL) {
    alerts.push({
      id: `alert-dd-crit-${snapshot.date}`,
      date: snapshot.date,
      type: 'DRAWDOWN',
      severity: 'CRITICAL',
      message: `CRITICAL: Drawdown ${snapshot.drawdownPct}% > ${RISK_THRESHOLDS.DRAWDOWN.CRITICAL}%`,
      acknowledged: false,
    });
  } else if (snapshot.drawdownPct > RISK_THRESHOLDS.DRAWDOWN.WARNING) {
    alerts.push({
      id: `alert-dd-warn-${snapshot.date}`,
      date: snapshot.date,
      type: 'DRAWDOWN',
      severity: 'WARNING',
      message: `WARNING: Drawdown ${snapshot.drawdownPct}% > ${RISK_THRESHOLDS.DRAWDOWN.WARNING}%`,
      acknowledged: false,
    });
  }

  // --- RULE 2: SOL EXPOSURE ---
  const solExposureUsd = positions
    .filter(p => p.asset.toUpperCase().includes("SOL"))
    .reduce((sum, p) => sum + p.usdValue, 0);

  const exposurePct = snapshot.totalValue > 0 
    ? (solExposureUsd / snapshot.totalValue) * 100 
    : 0;

  if (exposurePct > RISK_THRESHOLDS.EXPOSURE_SOL.CRITICAL) {
    alerts.push({
      id: `alert-exp-crit-${snapshot.date}`,
      date: snapshot.date,
      type: 'EXPOSURE',
      severity: 'CRITICAL',
      message: `CRITICAL: SOL Exposure ${exposurePct.toFixed(1)}% > ${RISK_THRESHOLDS.EXPOSURE_SOL.CRITICAL}%`,
      acknowledged: false,
    });
  } else if (exposurePct > RISK_THRESHOLDS.EXPOSURE_SOL.WARNING) {
    alerts.push({
      id: `alert-exp-warn-${snapshot.date}`,
      date: snapshot.date,
      type: 'EXPOSURE',
      severity: 'WARNING',
      message: `WARNING: SOL Exposure ${exposurePct.toFixed(1)}% > ${RISK_THRESHOLDS.EXPOSURE_SOL.WARNING}%`,
      acknowledged: false,
    });
  }

  // --- RULE 3: MARGIN (Placeholder) ---
  if (snapshot.riskStatus === 'CRITICAL') { // Mapping "Red" to CRITICAL
     alerts.push({
      id: `alert-margin-${snapshot.date}`,
      date: snapshot.date,
      type: 'MARGIN',
      severity: 'WARNING',
      message: `MARGIN: Account status flagged as CRITICAL`,
      acknowledged: false,
    });
  }

  return alerts;
}
