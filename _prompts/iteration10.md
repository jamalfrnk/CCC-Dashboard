# Iteration 10 — DeBank Integration (Read-Only Adapter + Normalization)

## PURPOSE
Integrate DeBank as the first real data source to populate:
- Wallet holdings (assets)
- DeFi positions
into the existing CCC DB schema.

IMPORTANT: Keep it light:
- Manual “Sync Now”
- No scheduling
- No queue
- Must fail gracefully and never break DEMO mode

## TOKENS / ENV
- Add `.env.example` entries:
  - DEBANK_API_KEY (optional depending on endpoint requirements)
  - DEBANK_BASE_URL (default to official base)
  - CCC_WALLET_ADDRESS (client wallet address for demo testing)

## TASKS
1) Create DeBank API client:
   - `src/lib/providers/debank/client.ts`
   - MUST include:
     - basic request wrapper
     - timeout
     - minimal retry (2 retries) for 429/5xx with backoff + jitter
   - Must never log secrets

2) Create DeBank provider adapter:
   - `src/lib/providers/debank/debankProvider.ts`
   - Implement:
     - fetchWalletHoldings(address)
     - fetchDefiPositions(address)
   - If DeBank endpoints are not accessible without key:
     - implement a MOCK response file under `src/lib/providers/debank/mock/`
     - allow `DEBANK_MODE=mock|real` (default mock) to unblock build

3) Normalization:
   - Map DeBank output into existing tables:
     - DefiPosition:
       - protocol, positionType, chain, valueUsd, healthStatus, notes, lastUpdated
     - PortfolioSnapshot:
       - totalValue, pnl fields can remain demo-generated for now OR compute totalValue only
   - Keep Trade table unchanged for this iteration

4) Upserts (Idempotency):
   - DefiPosition must upsert by deterministic `positionKey`
   - positionKey format: `debank:{address}:{chain}:{protocol}:{positionType}:{optional-id}`
   - Running sync twice MUST NOT duplicate records

5) Wire DeBank into /api/sync/run when DATA_MODE=real:
   - Pull wallet address from `CCC_WALLET_ADDRESS` (single-user Lite)
   - Call DeBank adapter
   - Upsert positions
   - Update SyncRun

## TESTS
- Unit tests:
  - normalization produces expected DefiPosition shape
  - positionKey deterministic
- Integration tests:
  - syncing twice yields same row count (no duplicates)
  - SyncRun status updates

## DONE MEANS
- Clicking “Run Sync Now” in REAL mode populates /defi with DeBank-derived positions (or mock mode if required)
- DEMO mode unchanged
- Sync is idempotent
- Tests pass
