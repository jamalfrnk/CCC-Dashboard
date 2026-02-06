### Iteration 01: Environment + Schema + Seed

**Tasks:**

1. **Set Up Development Environment**
   - Confirm Node.js, npm, Prisma CLI, and Vite/Next.js dependencies are installed via package.json; run `npm install`.
   - Create `.env.example` with placeholder variables for DATABASE_URL, OPENAI_API_KEY, etc. (`.env` can be omitted; use `.env.example`).
   - Initialize Git repository and set Git to ignore `.env` files.

2. **Define Prisma Schema and Migrations**
   - Create `prisma/schema.prisma` with models (User, Account, PortfolioSnapshot, Trade, DefiPosition, RiskAlert, AiJournalEntry, ProviderSyncRun, RateLimitState).
   - Use appropriate data types, relations, and indexes.
   - Run `prisma migrate dev` to generate migration and create the SQLite (or Postgres) DB.

3. **Seed Data Generator (14 Days)**
   - In `scripts/seed.ts`, implement a script that:
     - Creates one demo user/account.
     - Generates 14 consecutive `PortfolioSnapshot` rows (date, totalValue, pnlUsd, pnlPct, drawdownPct, riskStatus, notes).
     - Generates sample `Trade`, `DefiPosition`, and `RiskAlert` rows aligned with each date (low complexity: 3-5 trades, 2-4 positions, alerts only on drawdown/exposure days).
     - Creates placeholder `AiJournalEntry` rows with simple text.
   - Execute the seed script via `npm run seed` and verify DB state.

4. **Minimal API Route and UI Setup**
   - Create a Next.js `app/api/health/route.ts` returning `{ status: "ok" }`.
   - Scaffold top-level React components for `/` and `/trades` pages:
     - Home page fetches and displays the latest PortfolioSnapshot (simple card).
     - Trades page lists all Trade rows (basic table).
   - Ensure `npm run dev` starts the app without errors.

**DONE MEANS:**
- All dependencies installed; `npm install` succeeds.
- Prisma schema and migrations applied; `npx prisma studio` shows tables.
- Seed script populates 14 days of coherent data.
- Basic Next.js routes compile without errors.
- Git repository initialized with initial commit (even if remote push deferred).
