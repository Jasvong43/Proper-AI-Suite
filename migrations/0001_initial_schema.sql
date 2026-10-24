-- Proper AI Suite — initial schema
-- Replaces the Express backend's Obsidian filesystem writes with edge-safe D1.

-- Agent registry: was the in-memory `systemState.agents` object in server.js
CREATE TABLE IF NOT EXISTS agents (
  key           TEXT PRIMARY KEY,
  name          TEXT NOT NULL,
  status        TEXT NOT NULL DEFAULT 'Idle',
  kb_version    TEXT NOT NULL DEFAULT 'v1.0',
  last_updated  TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Campaigns / projects: was `systemState.projects[]`
CREATE TABLE IF NOT EXISTS projects (
  id          TEXT PRIMARY KEY,
  name        TEXT NOT NULL DEFAULT 'Untitled Campaign',
  command     TEXT NOT NULL,
  status      TEXT NOT NULL DEFAULT 'In Progress',
  created_at  TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at  TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Knowledge base: replaces writeToObsidian() appending markdown to disk.
-- Every pipeline run writes a row here instead of to C:/Users/.../ProperAI_Vault
CREATE TABLE IF NOT EXISTS kb_entries (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  agent       TEXT NOT NULL,
  content     TEXT NOT NULL,
  mapping     TEXT NOT NULL DEFAULT '{}',
  created_at  TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_kb_agent      ON kb_entries(agent);
CREATE INDEX IF NOT EXISTS idx_kb_created    ON kb_entries(created_at);
CREATE INDEX IF NOT EXISTS idx_projects_stat ON projects(status);
