# Iteration 12 — CoinTracker Integration (Mock-First, then Real)

## PURPOSE
Add CoinTracker as a second real data source for:
- centralized exchange trade history (based on what client added to CoinTracker)

Keep it light:
- Manual “Sync Now”
- Mock-first to avoid credential blockers
- No overengineering

## TOKENS / ENV
Add `.env.example` entries:
- COINTRACKER_API_KEY (or token)
- COINTRACKER_BASE_URL
- COINTRACKER_MODE=mock|real (default mock)

## TASKS
1) Create CoinTracker client:
- `src/lib/providers/cointracker/client.ts`
- timeout + minimal retry + no secret logs

2) Create CoinTracker provider:
- `src/lib/providers/cointracker/cointrackerProvider.ts`
- Implement:
  - fetchTrades(args)
  - optional: fetchBalances (if available)

3) Normalize CoinTracker trades into Trade table:
- tradeId format: `cointracker:{externalId}`
- platform should map to:
  - Platform = "MANUAL" (or add enum option "CoinTracker" if allowed)
  - If you cannot change enum, store "CoinTracker" in notes and map platform to "Jupiter" is NOT allowed.
  - Prefer adding enum value "CoinTracker" cleanly.

4) Upsert trades by tradeId
- running sync twice should not duplicate

5) Wire into /api/sync/run:
- When DATA_MODE=real:
  - DeBank sync runs
  - CoinTracker sync runs
  - Both log to SyncRun or separate SyncRun per provider

## TESTS
- Unit:
  - trade normalization mapping
  - deterministic tradeId
- Integration:
  - syncing twice yields same trade count
  - /api/trades filters work with CoinTracker platform

## DONE MEANS
- Trades page shows CoinTracker trades (mock mode acceptable if real auth not ready)
- No duplicates
- Tests pass
