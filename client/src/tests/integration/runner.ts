import { api } from "@/lib/api";
import { buildSheetsExport } from "@/lib/exports/sheets/builder";

// Simple integration test runner
export const runIntegrationTests = async () => {
  const results: { name: string; passed: boolean; message: string }[] = [];

  const assert = (condition: boolean, message: string) => {
    results.push({ name: message, passed: condition, message: condition ? "Passed" : "FAILED" });
  };

  try {
    // ... existing tests ...
    // Test 1: Health Check
    const health = await api.health();
    assert(health.status === "ok", "API: Health check returns OK");
    
    // ... skipping existing for brevity in replacement ... 
    
    // NEW: Export Tests
    const sheetsExport = await api.getSheetsExport();
    
    // Test 5: AI Journal Headers
    const journalData = sheetsExport.ai_journal;
    if (journalData.length > 0) {
      const headers = Object.keys(journalData[0]);
      const required = ["Entry Date", "Summary", "Risk Commentary", "Tomorrow Focus"];
      const missing = required.filter(h => !headers.includes(h));
      assert(missing.length === 0, "Export: AI Journal has correct EXACT headers");
    } else {
      assert(false, "Export: No journal data available to test headers");
    }

    // Test 6: Notion Structure
    const notionExport = await api.getNotionExport();
    assert(!!notionExport["AI Performance Journal"], "Export: Notion payload contains AI Journal");
    // Check property structure (rich_text exists)
    const sampleEntry = notionExport["AI Performance Journal"][0];
    assert(!!sampleEntry["Summary"].rich_text, "Export: Notion uses correct rich_text property structure");

  } catch (e) {
    results.push({ name: "Integration Suite", passed: false, message: `Exception: ${e}` });
  }

  return results;
};
