import { Trade, DefiPosition } from "./types";

// Types for "Raw" data from imaginary providers
type RawTrade = {
  tx_hash: string;
  timestamp: number; // Unix
  pair: string; // e.g., "SOL_USDC"
  type: string; // "buy" or "sell"
  amount_in: string;
  amount_out: string;
  price_usd: string;
};

type RawDefiPos = {
  protocol_id: string;
  chain_id: number;
  token_symbol: string;
  balance_raw: string;
  usd_price: number;
  decimals: number;
};

export function normalizeTrade(raw: RawTrade): Partial<Trade> {
  return {
    id: raw.tx_hash, // Use hash as ID
    date: new Date(raw.timestamp * 1000).toISOString().split('T')[0], // YYYY-MM-DD
    symbol: raw.pair.replace('_', '-'), // Standardize to DASH
    side: raw.type.toUpperCase() as 'BUY' | 'SELL',
    price: parseFloat(raw.price_usd),
    amount: parseFloat(raw.amount_in), // Simplified
    status: 'FILLED' // Provider trades are usually settled
  };
}

export function normalizeDefiPosition(raw: RawDefiPos): Partial<DefiPosition> {
  const amount = parseFloat(raw.balance_raw) / Math.pow(10, raw.decimals);
  return {
    id: `${raw.protocol_id}-${raw.token_symbol}`,
    protocol: raw.protocol_id, // Map ID to name if needed
    chain: raw.chain_id === 1 ? "Mainnet" : "L2", // Simple mapping
    asset: raw.token_symbol,
    amount: amount,
    usdValue: amount * raw.usd_price,
    type: 'LP' // Default, logic would refine this
  };
}
