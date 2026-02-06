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

export const api = {
  // ... existing functions ...
  health: async () => {
    return { status: "ok", timestamp: new Date().toISOString() };
  },

  getSnapshots: async (params: z.infer<typeof DateRangeSchema> = {}) => {
      // ... existing implementation
      const filters = DateRangeSchema.parse(params);
      const all = await db.getSnapshots();
      
      return all.filter(s => {
        const date = parseISO(s.date);
        if (filters.from && isBefore(date, parseISO(filters.from))) return false;
        if (filters.to && isAfter(date, parseISO(filters.to))) return false;
        return true;
      });
  },

  getTrades: async (params: z.infer<typeof TradeFilterSchema> = {}) => {
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

  getDefiPositions: async () => {
    return await db.getPositions();
  },

  getAlerts: async (params: z.infer<typeof AlertFilterSchema> = {}) => {
    const filters = AlertFilterSchema.parse(params);
    const all = await db.getAlerts();

    return all.filter(a => {
      if (filters.status === 'active' && a.acknowledged) return false;
      if (filters.status === 'acknowledged' && !a.acknowledged) return false;
      return true;
    });
  },

  getJournal: async (params: z.infer<typeof DateRangeSchema> = {}) => {
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
    // In a real app, this would stream a zip or CSVs
    // Here we return the full raw object for client-side download generation
    const data = await db.getAllData();
    return buildSheetsExport(data);
  },

  // GET /api/exports/notion
  getNotionExport: async () => {
    const data = await db.getAllData();
    return buildNotionExport(data);
  }
};

