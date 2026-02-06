# Iteration 03 — Risk Rules (TDD)

## PURPOSE
Implement deterministic, test-backed risk rules as pure functions.

---

## RULES TO IMPLEMENT

1. **Drawdown Rule**
   - Triggered if `drawdownPct > 5`
   - Warning if `drawdownPct > 3`

2. **Exposure Rule**
   - SOL exposure > 40% → Warning
   - SOL exposure > 50% → Triggered

3. **Margin Rule (Placeholder)**
   - If `riskStatus === "Red"` → Warning

---

## TASKS

1. Create `src/lib/risk/riskRules.ts`
2. Define zod schemas for inputs
3. Implement pure functions:
   - `evaluateRisk(snapshot, positions)`
4. Generate deterministic `RiskAlert[]`
5. Create stable `alertKey` values

---

## TESTS (WRITE FIRST)

- Happy paths
- Boundary conditions
- Invalid input rejection
- Deterministic outputs

---

## DONE MEANS

- All unit tests pass
- No DB access in risk logic
- Logic is pure and deterministic
