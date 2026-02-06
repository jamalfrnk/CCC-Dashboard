import { PortfolioSnapshot, DefiPosition, RiskAlert } from "../types";

export const RISK_CONSTANTS = {
  MAX_DRAWDOWN_PCT: 10,
  MAX_SOL_EXPOSURE_PCT: 40,
};

export function evaluateRisk(
  snapshot: PortfolioSnapshot,
  positions: DefiPosition[]
): RiskAlert[] {
  const alerts: RiskAlert[] = [];
  const timestamp = new Date().toISOString();

  // 1. Drawdown Check
  // Logic: If drawdownPct > 10%, flag as CRITICAL
  if (snapshot.drawdownPct > RISK_CONSTANTS.MAX_DRAWDOWN_PCT) {
    alerts.push({
      id: `alert-dd-${Date.now()}`,
      date: snapshot.date,
      type: 'DRAWDOWN',
      severity: 'CRITICAL',
      message: `Drawdown of ${snapshot.drawdownPct}% exceeds limit of ${RISK_CONSTANTS.MAX_DRAWDOWN_PCT}%`,
      acknowledged: false,
    });
  }

  // 2. SOL Exposure Check
  // Logic: Sum USD value of all positions where asset contains "SOL"
  // Calculate percentage against snapshot.totalValue
  const solExposureUsd = positions
    .filter(p => p.asset.toUpperCase().includes("SOL"))
    .reduce((sum, p) => sum + p.usdValue, 0);

  const exposurePct = (solExposureUsd / snapshot.totalValue) * 100;

  if (exposurePct > RISK_CONSTANTS.MAX_SOL_EXPOSURE_PCT) {
    alerts.push({
      id: `alert-exp-${Date.now()}`,
      date: snapshot.date,
      type: 'EXPOSURE',
      severity: 'WARNING', // Exposure is usually a warning first
      message: `SOL Exposure of ${exposurePct.toFixed(2)}% exceeds limit of ${RISK_CONSTANTS.MAX_SOL_EXPOSURE_PCT}%`,
      acknowledged: false,
    });
  }

  return alerts;
}
