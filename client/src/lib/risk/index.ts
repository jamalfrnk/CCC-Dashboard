// Risk Engine Logic
import { z } from "zod";

// Validation Schemas
export const RiskParamsSchema = z.object({
  maxDrawdownPct: z.number().min(0).max(100),
  maxExposurePct: z.number().min(0).max(100),
  minCashBalance: z.number().min(0),
});

export type RiskParams = z.infer<typeof RiskParamsSchema>;

export type RiskAlert = {
  type: 'DRAWDOWN' | 'EXPOSURE' | 'MARGIN';
  severity: 'warning' | 'critical';
  message: string;
  timestamp: string;
};

export function checkRisk(
  currentNav: number,
  peakNav: number,
  totalExposure: number,
  params: RiskParams
): RiskAlert[] {
  const alerts: RiskAlert[] = [];
  const timestamp = new Date().toISOString();

  // Drawdown Check
  const drawdown = (peakNav - currentNav) / peakNav;
  if (drawdown > (params.maxDrawdownPct / 100)) {
    alerts.push({
      type: 'DRAWDOWN',
      severity: 'critical',
      message: `Drawdown of ${(drawdown * 100).toFixed(2)}% exceeds limit of ${params.maxDrawdownPct}%`,
      timestamp
    });
  }

  // Exposure Check
  const exposurePct = totalExposure / currentNav;
  if (exposurePct > (params.maxExposurePct / 100)) {
    alerts.push({
      type: 'EXPOSURE',
      severity: 'warning',
      message: `Exposure of ${(exposurePct * 100).toFixed(2)}% exceeds limit of ${params.maxExposurePct}%`,
      timestamp
    });
  }

  return alerts;
}
