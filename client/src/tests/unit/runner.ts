import { evaluateRisk } from "../../lib/risk/rules";
import { normalizeTrade, normalizeDefiPosition } from "../../lib/normalization";
import { PortfolioSnapshot, DefiPosition } from "../../lib/types";

// Simple test runner since we are in browser
export const runTests = () => {
  const results: { name: string; passed: boolean; message: string }[] = [];

  const assert = (condition: boolean, message: string) => {
    results.push({ name: message, passed: condition, message: condition ? "Passed" : "FAILED" });
  };

  // --- RISK RULES TEST SUITE ---
  try {
    const baseSnap: PortfolioSnapshot = {
      id: '1', date: '2023-01-01', totalValue: 100000, cashBalance: 50000, positionsValue: 50000,
      pnlUsd: 0, pnlPct: 0, drawdownPct: 0, riskStatus: 'SAFE'
    };
    
    // Test 1: Happy Path (No Alerts)
    // Drawdown: 0%, Exposure: 0%
    const alerts1 = evaluateRisk(baseSnap, []);
    assert(alerts1.length === 0, "Risk: Clean state returns 0 alerts");

    // Test 2: Drawdown Warning (>3%)
    const ddWarnSnap = { ...baseSnap, drawdownPct: 3.5 };
    const alerts2 = evaluateRisk(ddWarnSnap, []);
    assert(alerts2.some(a => a.type === 'DRAWDOWN' && a.severity === 'WARNING'), "Risk: Drawdown > 3% triggers WARNING");

    // Test 3: Drawdown Critical (>5%)
    const ddCritSnap = { ...baseSnap, drawdownPct: 5.1 };
    const alerts3 = evaluateRisk(ddCritSnap, []);
    assert(alerts3.some(a => a.type === 'DRAWDOWN' && a.severity === 'CRITICAL'), "Risk: Drawdown > 5% triggers CRITICAL");

    // Test 4: SOL Exposure Warning (>40%)
    // 41k SOL out of 100k Total = 41%
    const solPosWarn: DefiPosition = { 
        id: '2', protocol: 'Native', chain: 'Solana', asset: 'SOL', type: 'STAKING', 
        amount: 1000, usdValue: 41000, apy: 0
    };
    const alerts4 = evaluateRisk(baseSnap, [solPosWarn]);
    assert(alerts4.some(a => a.type === 'EXPOSURE' && a.severity === 'WARNING'), "Risk: SOL Exposure > 40% triggers WARNING");

    // Test 5: SOL Exposure Critical (>50%)
    // 51k SOL out of 100k Total = 51%
    const solPosCrit: DefiPosition = { 
        id: '3', protocol: 'Native', chain: 'Solana', asset: 'SOL', type: 'STAKING', 
        amount: 1000, usdValue: 51000, apy: 0
    };
    const alerts5 = evaluateRisk(baseSnap, [solPosCrit]);
    assert(alerts5.some(a => a.type === 'EXPOSURE' && a.severity === 'CRITICAL'), "Risk: SOL Exposure > 50% triggers CRITICAL");

    // Test 6: Deterministic Outputs (Stable Keys)
    const alerts6A = evaluateRisk(ddCritSnap, []);
    const alerts6B = evaluateRisk(ddCritSnap, []);
    assert(alerts6A[0].id === alerts6B[0].id, "Risk: Alert IDs are deterministic");

  } catch (e) {
    results.push({ name: "Risk Test Suite", passed: false, message: `Exception: ${e}` });
  }

  return results;
};
