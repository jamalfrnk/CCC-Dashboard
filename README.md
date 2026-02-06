# FDS Command Center (Lite MVP)

**Status:** `READY FOR DEMO`  
**Version:** `1.0.0-LITE`

## What is FDS Lite?

FDS Lite is a specialized "Command Center" designed for high-net-worth operators to visualize portfolio risk, track performance, and maintain trading discipline. 

Unlike generic trackers, FDS Lite focuses on **Risk Logic** and **Journaling**—the two pillars of sustainable alpha. It serves as a single source of truth that aggregates data into a standardized format for downstream analysis in Google Sheets or Notion.

**Key Capabilities:**
*   **Risk Engine:** Monitors Drawdown (>5% Critical) and SOL Exposure (>50% Critical).
*   **Journaling:** Enforces a daily discipline of logging "Tomorrow's Focus" and "Risk Commentary."
*   **Data Hub:** Normalizes trade and DeFi data into a consistent schema.
*   **Export Ready:** Generates perfectly formatted JSON/CSV payloads for external systems.

## How to Use (Client Guide)

1.  **Dashboard:** Your daily start page. Check the "Risk Status" badge immediately.
    *   *Green (SAFE):* Execute standard plan.
    *   *Orange (WARNING):* Reduce size, review exposure.
    *   *Red (CRITICAL):* Halt opening new risk, focus on capital preservation.
2.  **Trades:** Log your executions. Use the filters to find specific pairs or dates.
3.  **Journal:** At the end of every session, log your entry. The system tracks streaks.
4.  **Exports:**
    *   Go to `Settings` -> `Export Data`.
    *   **Sheets:** Download the JSON/CSV to paste into your Master Spreadsheet.
    *   **Notion:** Download the JSON payload to sync with your Notion Workspace.
5.  **Simulation:** Use "Reset Seed" in Settings to generate a fresh 14-day market scenario for testing risk rules.

## Lite vs. Pro

| Feature | FDS Lite (Current) | FDS Pro (Future) |
| :--- | :--- | :--- |
| **Data Source** | Manual / Mock / Import | Live Chain & Exchange Feeds |
| **Risk Engine** | Client-side Rules | Server-side Real-time Monitor |
| **Integrations** | File Export (JSON/CSV) | Live API Sync (Notion/Sheets) |
| **Auth** | Single User (Local) | Multi-tenant + SSO |
| **Alerts** | Dashboard Visuals | SMS / Telegram / Email Pushes |

## Upgrade Path

This Lite MVP is built on the same "schema-first" architecture as the Pro system. To upgrade:

1.  **Backend Activation:** We replace the `mock-db` adapter with a real Prisma/Postgres connection.
2.  **Ingestion pipelines:** We turn on the background jobs to fetch live data from DeBank and Exchange APIs.
3.  **Sync Service:** We enable the `sync-worker` to push data automatically to Notion/Sheets, replacing the manual export button.

The UI and Risk Logic you see today will remain the frontend for the Pro system.
