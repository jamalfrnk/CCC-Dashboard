# Iteration 11 — DeBank Portfolio Snapshot + Risk Alerts from Real Positions

## PURPOSE
Use DeBank holdings + positions to derive a daily PortfolioSnapshot (lightweight) and generate RiskAlerts.

Keep it minimal:
- No historical backfill required
- Only “today snapshot” is fine initially
- Still manual sync

## TASKS
1) Derive Total Portfolio Value:
   - From DeBank wallet + DeFi positions valueUsd
   - Save a PortfolioSnapshot for today's date (upsert by userId+date)

2) SOL exposure calculation (light):
   - Sum any holdings/positions tagged SOL (or chain=solana where applicable)
   - If accurate mapping is hard, implement a simple heuristic:
     - detect token symbol “SOL”
     - or notes include “SOL”
   - Store computed exposurePct in notes field for now (no schema change)

3) Generate RiskAlerts using existing risk rules:
   - drawdown rule may remain demo-based until real history exists
   - exposure rule should run based on derived SOL exposure
   - margin rule placeholder can remain

4) Ensure alerts are idempotent:
   - alertKey = `debank:{date}:{type}`

5) Update Dashboard:
   - Latest snapshot uses real mode snapshot when available
   - If none exists, fallback to demo snapshot

## TESTS
- Unit tests:
  - snapshot derivation returns correct total
  - exposurePct logic returns expected bands
- Integration tests:
  - /api/snapshots returns derived snapshot after sync
  - /api/alerts returns exposure alerts

## DONE MEANS
- After running Sync Now, Dashboard reflects real totalValue for today
- Exposure alerts appear when applicable
- No duplicates on repeated sync
- DEMO still works
- Tests pass
