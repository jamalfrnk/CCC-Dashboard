import { evaluateRisk } from "../../lib/risk/rules";
import { normalizeTrade, normalizeDefiPosition } from "../../lib/normalization";
import { PortfolioSnapshot, DefiPosition } from "../../lib/types";

// Simple test runner since we are in browser
export const runTests = () => {
  const results: { name: string; passed: boolean; message: string }[] = [];

  const assert = (condition: boolean, message: string) => {
    results.push({ name: message, passed: condition, message: condition ? "Passed" : "FAILED" });
  };

  // RISK TESTS
  try {
    const safeSnap: PortfolioSnapshot = {
      id: '1', date: '2023-01-01', totalValue: 100000, cashBalance: 50000, positionsValue: 50000,
      pnlUsd: 0, pnlPct: 0, drawdownPct: 2, riskStatus: 'SAFE'
    };
    
    const positions: DefiPosition[] = [
      { id: '1', protocol: 'Aave', chain: 'Mainnet', asset: 'ETH', type: 'LENDING', amount: 10, usdValue: 20000, apy: 5 }
    ];

    // Test 1: No Alerts
    const noAlerts = evaluateRisk(safeSnap, positions);
    assert(noAlerts.length === 0, "Risk: Safe snapshot returns no alerts");

    // Test 2: Drawdown Alert
    const badSnap = { ...safeSnap, drawdownPct: 15 }; // > 10%
    const ddAlerts = evaluateRisk(badSnap, positions);
    assert(ddAlerts.some(a => a.type === 'DRAWDOWN'), "Risk: High drawdown triggers DRAWDOWN alert");

    // Test 3: SOL Exposure Alert
    const solPos: DefiPosition = { 
        id: '2', protocol: 'Native', chain: 'Solana', asset: 'SOL', type: 'STAKING', 
        amount: 1000, usdValue: 50000, apy: 7 // 50% of 100k
    };
    const expAlerts = evaluateRisk(safeSnap, [solPos]);
    assert(expAlerts.some(a => a.type === 'EXPOSURE'), "Risk: High SOL exposure triggers EXPOSURE alert");

  } catch (e) {
    results.push({ name: "Risk Test Suite", passed: false, message: `Exception: ${e}` });
  }

  // NORMALIZATION TESTS
  try {
    // Test 4: Trade Normalization
    const rawTrade = {
      tx_hash: "0x123", timestamp: 1672531200, pair: "SOL_USDC", type: "buy",
      amount_in: "10.5", amount_out: "200", price_usd: "20"
    };
    const normTrade = normalizeTrade(rawTrade);
    assert(normTrade.symbol === "SOL-USDC", "Norm: Trade symbol normalized");
    assert(normTrade.side === "BUY", "Norm: Trade side normalized");
    assert(normTrade.date === "2023-01-01", "Norm: Timestamp converted to date");

    // Test 5: DeFi Normalization
    const rawPos = {
      protocol_id: "Curve", chain_id: 1, token_symbol: "USDC",
      balance_raw: "1000000", usd_price: 1, decimals: 6
    };
    const normPos = normalizeDefiPosition(rawPos);
    assert(normPos.amount === 1, "Norm: Decimals handled correctly");
    assert(normPos.chain === "Mainnet", "Norm: Chain ID mapped");

  } catch (e) {
    results.push({ name: "Normalization Test Suite", passed: false, message: `Exception: ${e}` });
  }

  return results;
};
