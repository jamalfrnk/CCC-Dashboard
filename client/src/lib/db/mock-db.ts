// Mock Database Store
// In a real app, this would be Prisma/Postgres.
// Here, we use an in-memory store with local storage persistence for the mockup.

import { DatabaseSchema, Trade, PortfolioSnapshot, DefiPosition, RiskAlert, AiJournalEntry } from "../types";
import { generateSeedData } from "../seed";

class MockDB {
  private data: DatabaseSchema;

  constructor() {
    this.data = {
      user: null,
      snapshots: [],
      trades: [],
      defiPositions: [],
      alerts: [],
      journal: []
    };
    this.load();
  }

  private load() {
    if (typeof window === 'undefined') return;
    try {
      const storedData = localStorage.getItem('fds_db');
      if (storedData) {
        this.data = JSON.parse(storedData);
      } else {
        // Auto-seed on first load if empty
        this.seed();
      }
    } catch (e) {
      console.error("Failed to load mock DB", e);
    }
  }

  private save() {
    if (typeof window === 'undefined') return;
    localStorage.setItem('fds_db', JSON.stringify(this.data));
  }

  public seed() {
    console.log("Seeding Database...");
    this.data = generateSeedData();
    this.save();
    return this.data;
  }

  // Getters
  async getSnapshots() { return this.data.snapshots; }
  async getLatestSnapshot() { return this.data.snapshots[this.data.snapshots.length - 1]; }
  async getTrades() { return this.data.trades; }
  async getPositions() { return this.data.defiPositions; }
  async getAlerts() { return this.data.alerts; }
  async getJournal() { return this.data.journal; }
  async getAllData() { return this.data; }
}

export const db = new MockDB();

