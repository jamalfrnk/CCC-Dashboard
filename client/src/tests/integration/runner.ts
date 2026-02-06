import { api } from "@/lib/api";

// Simple integration test runner
export const runIntegrationTests = async () => {
  const results: { name: string; passed: boolean; message: string }[] = [];

  const assert = (condition: boolean, message: string) => {
    results.push({ name: message, passed: condition, message: condition ? "Passed" : "FAILED" });
  };

  try {
    // Test 1: Health Check
    const health = await api.health();
    assert(health.status === "ok", "API: Health check returns OK");

    // Test 2: Snapshot Filtering
    // Assuming seed data exists (14 days)
    // Filter last 3 days
    const snapshots = await api.getSnapshots();
    const rangeStart = snapshots[snapshots.length - 3]?.date;
    const rangeEnd = snapshots[snapshots.length - 1]?.date;

    if (rangeStart && rangeEnd) {
      const filtered = await api.getSnapshots({ from: rangeStart, to: rangeEnd });
      assert(filtered.length > 0 && filtered.length <= 3, "API: Snapshot date filtering works");
      assert(filtered[0].date === rangeStart, "API: Snapshot start date matches");
    }

    // Test 3: Trade Validation
    // Should fail with invalid date format
    try {
      await api.getTrades({ from: "invalid-date" });
      assert(false, "API: Should reject invalid date");
    } catch (e) {
      assert(true, "API: Zod validation correctly rejected invalid date");
    }

    // Test 4: Alert Status Filtering
    const activeAlerts = await api.getAlerts({ status: 'active' });
    const hasAck = activeAlerts.some((a: any) => a.acknowledged);
    assert(!hasAck, "API: Active alerts filter excludes acknowledged items");

  } catch (e) {
    results.push({ name: "Integration Suite", passed: false, message: `Exception: ${e}` });
  }

  return results;
};
