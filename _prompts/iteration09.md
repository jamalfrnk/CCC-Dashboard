# Iteration 09 — Real Data Framework (Feature Flags + Provider Interface)

## PURPOSE
Add a minimal “Real Data Mode” architecture WITHOUT changing existing UI behavior.
Demo/seed mode must remain the default and must not break.

## REQUIREMENTS
- No background jobs
- No schedulers
- No webhooks
- No external sync (Notion/Sheets) yet
- Manual “Sync Now” only

## TASKS
1) Add environment flag:
   - `DATA_MODE=demo|real`
   - default: demo

2) Create provider interfaces:
   - `src/lib/providers/types.ts`
     - `fetchPortfolioSnapshots(args)`
     - `fetchDefiPositions(args)`
     - `fetchWalletHoldings(args)`
     - `fetchTrades(args)` (stub for now)

3) Create provider selector:
   - `src/lib/providers/index.ts`
     - `getProvider()` returns DemoProvider or RealProvider based on DATA_MODE

4) Create DemoProvider:
   - `src/lib/providers/demoProvider.ts`
   - Must use the existing DB data only (no changes)

5) Add a light “Sync Run” log (minimal observability):
   - Prisma model: `SyncRun`
     - id, provider, startedAt, endedAt, status, errorMessage
   - Add index on provider+startedAt

6) Add API endpoint:
   - `POST /api/sync/run`
     - validates request with zod
     - creates SyncRun record
     - calls provider “sync” function
     - updates SyncRun status
   - NOTE: still demo-only (no real providers yet)

7) Add Settings UI:
   - shows DATA_MODE
   - shows last SyncRun status
   - “Run Sync Now” button calls /api/sync/run

## TESTS
- Unit: provider selector returns correct provider for env
- Integration: POST /api/sync/run creates a SyncRun record and returns status OK
- Ensure DEMO mode continues to work exactly as before

## DONE MEANS
- Existing app still works in DEMO mode
- /settings shows mode + last SyncRun
- SyncRun table exists and is written to
- Tests pass
