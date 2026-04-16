import { createClient } from '@libsql/client';

// Turso client configuration
const client = createClient({
  url: process.env.TURSO_DATABASE_URL || process.env.DATABASE_URL || '',
  authToken: process.env.TURSO_AUTH_TOKEN || ''
});

export { client };

// Database helper functions
export async function initDatabase() {
  try {
    // Create tables if they don't exist
    await client.execute(`
      CREATE TABLE IF NOT EXISTS Assessment (
        id TEXT PRIMARY KEY,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        sessionId TEXT,
        recruiterName TEXT,
        company TEXT,
        finalScore INTEGER,
        verdict TEXT,
        inputData TEXT,
        scoreData TEXT,
        redFlags TEXT,
        vtResults TEXT,
        repoScans TEXT,
        shareToken TEXT UNIQUE
      )
    `);

    await client.execute(`
      CREATE TABLE IF NOT EXISTS ScamPattern (
        id TEXT PRIMARY KEY,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        category TEXT,
        description TEXT,
        indicators TEXT,
        ecosystem TEXT,
        verified BOOLEAN DEFAULT FALSE,
        anonymous BOOLEAN DEFAULT TRUE
      )
    `);

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
}

export async function closeConnection() {
  // Note: libSQL client doesn't have explicit close method
  // Connection is managed automatically
}
