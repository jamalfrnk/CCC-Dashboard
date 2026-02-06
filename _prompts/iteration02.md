## Iteration 02 – Risk Rules & Normalization

Your goals for this iteration:

- **Add basic risk rules**: Implement drawdown and exposure checks. For now, mark an account as "High" if its drawdown exceeds 10% since the last snapshot or if SOL exposure exceeds 40% of total portfolio value. Create a `riskRules.ts` module that takes a `PortfolioSnapshot` and list of `DefiPosition` and returns an array of `RiskAlert` objects.

- **Add unit tests**: Use Vitest to cover the risk rules. Tests should cover at least three cases: normal condition (no alerts), drawdown alert, and exposure alert. Keep tests fast and isolated; do not hit the database.

- **Normalize data**: Create a normalization helper (`normalizeTrade`, `normalizeDefiPosition`, etc.) that cleans and shapes provider data into your Prisma models. These helpers will be used later by jobs. Write a few simple tests to ensure normalization preserves required fields and converts types correctly.

- **Sync nothing yet**: No Notion/Sheets output in this iteration. Focus on core business logic.

**Done when**: risk rules module exists with unit tests passing; normalization helpers exist with basic tests; `npm test` and `npm run build` pass without errors.
