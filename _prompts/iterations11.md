# Iteration 11 — DeBank Error Transparency + Real Mode Guardrails (Lite)

## PURPOSE
Harden real-data mode behavior when DeBank is reachable but returns non-200 responses (e.g. **403 insufficient units**, 401, 429, 5xx), ensuring the CCC Dashboard remains debuggable and transparent without adding scope.

This iteration ensures:
- Real mode never silently appears “empty”
- DeBank connectivity issues are surfaced clearly
- Demo mode remains unchanged
- Manual sync remains the only trigger

---

## IMPORTANT (Lite Constraints)
Keep it light and within Lite MVP boundaries:

- Manual **“Sync Now”** only  
- No scheduling  
- No background jobs / queues  
- No polling  
- No new tables or features  
- Must fail gracefully and never break DEMO mode  

---

## TOKENS / ENV (Replit Secrets Only)
Environment variables are provided **only via Replit Secrets**.  
No `.env` files are used in Lite.

Required:
- `DATA_MODE=real`
- `DEBANK_ACCESS_KEY`
- `EVM_WALLET_ADDRESS`

Notes:
- Do **not** introduce new provider-mode toggles in Lite
- Do **not** log secrets or headers

---

## TASKS

### 1) Harden DeBank client error handling
**Location:** `src/lib/providers/debank/client.ts`

Implement:
- Structured error handling for non-200 responses:
  - `provider: "debank"`
  - `status`
  - `message` (sanitized)
  - Optional `hint` for known cases

Rules:
- Capture at most the first ~200 characters of response body (sanitized)
- Never log secrets, headers, or raw keys
- Retry logic remains unchanged:
  - Retry only for `429` and `5xx`
  - Do **not** retry `401`, `403`, or `400`

Known DeBank case:
- If response status is `403` and body contains “insufficient units”:
  - Normalize message to:
    ```
    DeBank blocked request: insufficient units (recharge required)
    ```

---

### 2) Surface provider errors in `/api/sync/run`
**Location:** Sync handler for `/api/sync/run`

Behavior when `DATA_MODE=real`:
- If DeBank fails:
  - Mark SyncRun as **failed** (using existing status mechanism)
  - Return a **non-200** response with structured error payload:
    ```json
    {
      "ok": false,
      "provider": "debank",
      "status": 403,
      "message": "DeBank blocked request: insufficient units (recharge required)"
    }
    ```
- Do **not** insert partial or empty data
- Do **not** fallback to demo providers in real mode

Behavior when `DATA_MODE !== "real"`:
- Demo mode behavior remains unchanged

---

### 3) Frontend: clear Real Mode error state
On pages dependent on sync data (e.g. DeFi / Portfolio views):

- If the most recent sync failed due to provider error:
  - Display a simple banner or empty state using existing shadcn components
  - Content should include:
    - “Real data mode is enabled”
    - Provider name (DeBank)
    - Error message (e.g. insufficient units)
    - Action: **Retry Sync Now**

Rules:
- No UI redesign
- No new UX flows
- Reuse existing components (Alert, Card, etc.)

---

### 4) Minimal test coverage (Vitest)
Add tests to cover:
- DeBank client returns structured error on 403 insufficient units
- `/api/sync/run` in real mode returns non-200 with provider error payload
- SyncRun status updates to failed on provider error

Notes:
- Mock DeBank HTTP responses
- No new fixtures or tables required

---

## DONE MEANS
- In `DATA_MODE=real`, clicking **“Run Sync Now”**:
  - If DeBank is blocked, the UI clearly explains why
  - Backend returns structured provider error
  - SyncRun reflects failed status
- In DEMO mode, behavior is unchanged
- No scope creep
- Tests pass

