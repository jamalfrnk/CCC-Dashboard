# Iteration 13 — Manual Trade Upload (CSV) for Hyperliquid / Jupiter

## PURPOSE
Avoid complex perps API integrations by allowing the client (or you) to upload trade exports periodically.

This is the “light” solution for perps:
- Export from Hyperliquid/Jupiter
- Upload CSV
- App normalizes + upserts into Trade table

## TASKS
1) Add Upload UI:
- Page: /settings -> “Upload Trades CSV”
- Accept CSV file upload

2) Add API route:
- POST /api/import/trades
- Validates CSV schema with zod
- Maps rows into Trade:
  - tradeId must be deterministic:
    `manual:{platform}:{tradeDate}:{pair}:{side}:{sizeUsd}:{entryPrice}`
  - platform = Hyperliquid or Jupiter
  - notes include “Imported CSV”

3) CSV format (support both via mapping):
Required columns:
- Trade Date
- Trading Pair
- Side
- Position Size ($)
- Entry Price
- Exit Price
- Realized PnL ($)
- Trade Notes
- Platform

4) Idempotency:
- repeated upload of same file must not duplicate rows

## TESTS
- Unit:
  - CSV parsing + mapping
  - tradeId deterministic
- Integration:
  - uploading same CSV twice does not duplicate
  - trades appear in /api/trades

## DONE MEANS
- Upload works end-to-end
- Trades show in UI
- No duplicates
- Tests pass
