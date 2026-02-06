# Iteration 05 — Export Builders (Sheets + Notion)

## PURPOSE
Generate CSV/JSON exports with exact naming parity.

---

## SHEETS EXPORT

### Tabs
- portfolio_metrics
- trade_log
- defi_positions
- risk_alerts
- ai_journal

### Requirements
- Headers match EXACT names
- Stable ordering
- CSV + JSON support

---

## NOTION EXPORT

- JSON payloads
- Property names EXACT
- One object per row

---

## TASKS

1. Create export builder modules
2. Create `/api/exports/sheets`
3. Create `/api/exports/notion`
4. Implement CSV serialization

---

## TESTS

- Header equality tests
- Non-empty exports
- ai_journal always included

---

## DONE MEANS

- Exports download correctly
- Tests enforce naming parity
