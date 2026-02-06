# Iteration 12 — CoinTracker Integration (Mock-First, Lite-Safe)

## PURPOSE
Add CoinTracker as a second data source to populate:

- Centralized exchange trade history
- Trades the client has already connected inside CoinTracker

This iteration focuses on normalization, idempotent writes, and safe wiring into the existing CCC sync flow. Real API access is optional and must not block completion.

---

## IMPORTANT (Lite Constraints)
Keep this iteration lightweight and within Lite MVP scope:

- Manual **“Sync Now”** only
- No scheduling
- No background jobs or queues
- No polling
- Mock-first to avoid credential blockers
- No overengineering
- Must never break DEMO mode

---

## TOKENS / ENV (Replit Secrets Only)
Environment variables are provided **only via Replit Secrets**.  
No `.env` or `.env.example` files are used.

Potential secrets (real mode may remain unused initially):
- `COINTRACKER_API_KEY` (or token, if available)
- `COINTRACKER_BASE_URL` (if applicable)

Notes:
- CoinTracker must follow the global `DATA_MODE` logic
- Do **not** introduce a separate `COINTRACKER_MODE`
- If `DATA_MODE !== "real"`, CoinTracker must use mock responses

---

## TASKS

### 1) Create CoinTracker API client
**Location:** `src/lib/providers/cointracker/client.ts`

Requirements:
- Basic request wrapper
- Timeout handling
- Minimal retry logic (429 / 5xx only)
- Never log secrets, tokens, or auth headers

The client must be safe to use even if real API access is unavailable.

---

### 2) Create CoinTracker provider adapter
**Location:** `src/lib/providers/cointracker/cointrackerProvider.ts`

Implement:
- `fetchTrades(args)`
- Optional: `fetchBalances()` only if available without scope creep

Provider behavior:
- If `DATA_MODE !== "real"`:
  - Return mock trade data
- If `DATA_MODE === "real"`:
  - Attempt real CoinTracker API
  - Fail gracefully if access is unavailable or restricted

---

### 3) Normalize CoinTracker trades into the Trade table
Mapping rules:
- Deterministic `tradeId` format:
- Upsert trades by `tradeId`
- Running sync multiple times must never duplicate records

Platform handling:
- Prefer adding enum value: `"CoinTracker"`
- If enum modification is not safe:
- Store `"CoinTracker"` in the `notes` field
- Do NOT map CoinTracker trades to unrelated platforms

---

### 4) Wire CoinTracker into `/api/sync/run`
Behavior:
- When `DATA_MODE === "real"`:
- DeBank sync runs
- CoinTracker sync runs
- Reuse the existing SyncRun tracking pattern
- Provider failures must not crash the entire sync
- Each provider must log outcome deterministically

---

## TESTS

### Unit tests
- Trade normalization mapping
- Deterministic `tradeId` generation

### Integration tests
- Syncing twice yields the same trade count
- `/api/trades` filtering works with CoinTracker platform

Mocks are acceptable for all tests.

---

## DONE MEANS
- Trades page shows CoinTracker-derived trades (mock mode acceptable)
- No duplicate trades on repeated sync
- DEMO mode behavior unchanged
- No new infrastructure or tables introduced
- Tests pass

