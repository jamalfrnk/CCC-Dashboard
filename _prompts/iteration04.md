**# Iteration 04 — Read APIs

## PURPOSE
Expose fast, validated read-only APIs for UI and exports.

---

## ENDPOINTS

- `GET /api/health`
- `GET /api/snapshots?from&to`
- `GET /api/trades?from&to&platform`
- `GET /api/defi`
- `GET /api/alerts?status`
- `GET /api/journal?from&to`

---

## TASKS

1. Create route handlers (App Router)
2. Add zod validation for params
3. Use Prisma for reads only
4. Add basic ordering + filtering

---

## TESTS

- Integration tests
- Validate response shapes
- Validate filters

---

## DONE MEANS

- APIs return correct data
- Invalid params rejected
- Tests pass
**
