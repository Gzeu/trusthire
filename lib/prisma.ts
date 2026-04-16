import { createClient } from '@libsql/client';

// Turso client for SQLite
const tursoClient = createClient({
  url: process.env.TURSO_DATABASE_URL || process.env.DATABASE_URL || '',
  authToken: process.env.TURSO_AUTH_TOKEN || ''
});

// Mock prisma object for compatibility
export const prisma = {
  assessment: {
    create: async (data: any) => {
      // Convert data to SQLite format
      const result = await tursoClient.execute({
        sql: `INSERT INTO Assessment (sessionId, recruiterName, company, finalScore, verdict, inputData, scoreData, redFlags, vtResults, repoScans, shareToken) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) RETURNING *`,
        args: [
          data.sessionId || `session_${Date.now()}`,
          data.recruiterName,
          data.company,
          data.finalScore,
          data.verdict,
          JSON.stringify(data.inputData),
          JSON.stringify(data.scoreData),
          JSON.stringify(data.redFlags),
          JSON.stringify(data.vtResults),
          JSON.stringify(data.repoScans),
          data.shareToken
        ]
      });
      return result.rows[0];
    },
    findUnique: async (params: any) => {
      const result = await tursoClient.execute({
        sql: 'SELECT * FROM Assessment WHERE id = ?',
        args: [params.where.id]
      });
      return result.rows[0] || null;
    }
  }
} as any;

export { tursoClient as default, tursoClient };
