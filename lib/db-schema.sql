-- TrustHire Database Schema for Turso SQLite
-- This schema matches the Prisma schema but is optimized for Turso

-- Assessment table
CREATE TABLE IF NOT EXISTS Assessment (
    id TEXT PRIMARY KEY,
    sessionId TEXT NOT NULL,
    recruiterName TEXT,
    company TEXT,
    finalScore INTEGER,
    verdict TEXT,
    inputData TEXT,
    scoreData TEXT,
    redFlags TEXT,
    vtResults TEXT,
    repoScans TEXT,
    shareToken TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ScamReport table
CREATE TABLE IF NOT EXISTS ScamReport (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    reporterName TEXT NOT NULL,
    reporterEmail TEXT NOT NULL,
    scammerName TEXT NOT NULL,
    scammerEmail TEXT NOT NULL,
    scammerCompany TEXT NOT NULL,
    description TEXT NOT NULL,
    status TEXT DEFAULT 'pending',
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Blacklist table
CREATE TABLE IF NOT EXISTS Blacklist (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type TEXT NOT NULL,
    value TEXT NOT NULL,
    reason TEXT NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_assessment_sessionId ON Assessment(sessionId);
CREATE INDEX IF NOT EXISTS idx_assessment_createdAt ON Assessment(createdAt DESC);
CREATE INDEX IF NOT EXISTS idx_scamreport_status ON ScamReport(status);
CREATE INDEX IF NOT EXISTS idx_scamreport_createdAt ON ScamReport(createdAt DESC);
CREATE INDEX IF NOT EXISTS idx_blacklist_type ON Blacklist(type);
CREATE INDEX IF NOT EXISTS idx_blacklist_createdAt ON Blacklist(createdAt DESC);
