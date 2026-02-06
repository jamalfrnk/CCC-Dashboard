import { z } from "zod";
import { db } from "./db/mock-db";
import { PortfolioSnapshot, Trade, DefiPosition, RiskAlert, AiJournalEntry } from "./types";
import { parseISO, isAfter, isBefore, isEqual } from "date-fns";

// --- VALIDATION SCHEMAS ---
export const DateRangeSchema = z.object({
  from: z.string().date().optional(),
  to: z.string().date().optional(),
});

export const TradeFilterSchema = DateRangeSchema.extend({
  symbol: z.string().optional(),
});

export const AlertFilterSchema = z.object({
  status: z.enum(['active', 'acknowledged', 'all']).default('all'),
});

import { buildSheetsExport, toCSV } from "./exports/sheets/builder";
import { buildNotionExport } from "./exports/notion/builder";

// --- API FUNCTIONS (Simulating Endpoints) ---

const log = (method: string, path: string, params?: any) => {
  console.log(`[API] ${new Date().toISOString()} | ${method} ${path}`, params ? JSON.stringify(params) : "");
};

export const api = {
  // GET /api/health
  health: async () => {
    log("GET", "/health");
    return { status: "ok", timestamp: new Date().toISOString() };
  },

  // GET /api/snapshots?from&to
  getSnapshots: async (params: z.infer<typeof DateRangeSchema> = {}) => {
    log("GET", "/snapshots", params);
    const filters = DateRangeSchema.parse(params);
    const all = await db.getSnapshots();
    
    return all.filter(s => {
      const date = parseISO(s.date);
      if (filters.from && isBefore(date, parseISO(filters.from))) return false;
      if (filters.to && isAfter(date, parseISO(filters.to))) return false;
      return true;
    });
  },

  // GET /api/trades?from&to&symbol
  getTrades: async (params: z.infer<typeof TradeFilterSchema> = {}) => {
    log("GET", "/trades", params);
    const filters = TradeFilterSchema.parse(params);
    const all = await db.getTrades();

    return all.filter(t => {
      const date = parseISO(t.date);
      if (filters.from && isBefore(date, parseISO(filters.from))) return false;
      if (filters.to && isAfter(date, parseISO(filters.to))) return false;
      if (filters.symbol && !t.symbol.includes(filters.symbol)) return false;
      return true;
    });
  },

  // GET /api/defi
  getDefiPositions: async () => {
    log("GET", "/defi");
    return await db.getPositions();
  },

  // GET /api/alerts?status
  getAlerts: async (params: z.infer<typeof AlertFilterSchema> = {}) => {
    log("GET", "/alerts", params);
    const filters = AlertFilterSchema.parse(params);
    const all = await db.getAlerts();

    return all.filter(a => {
      if (filters.status === 'active' && a.acknowledged) return false;
      if (filters.status === 'acknowledged' && !a.acknowledged) return false;
      return true;
    });
  },

  // GET /api/journal?from&to
  getJournal: async (params: z.infer<typeof DateRangeSchema> = {}) => {
    log("GET", "/journal", params);
    const filters = DateRangeSchema.parse(params);
    const all = await db.getJournal();

    return all.filter(j => {
      const date = parseISO(j.date);
      if (filters.from && isBefore(date, parseISO(filters.from))) return false;
      if (filters.to && isAfter(date, parseISO(filters.to))) return false;
      return true;
    });
  },

  // NEW: Export Endpoints
  // GET /api/exports/sheets
  getSheetsExport: async () => {
    log("GET", "/exports/sheets");
    // In a real app, this would stream a zip or CSVs
    // Here we return the full raw object for client-side download generation
    const data = await db.getAllData();
    return buildSheetsExport(data);
  },

  // GET /api/exports/notion
  getNotionExport: async () => {
    log("GET", "/exports/notion");
    const data = await db.getAllData();
    return buildNotionExport(data);
  }
};

