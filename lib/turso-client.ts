import { createClient } from '@libsql/client';

// Turso client for SQLite
let tursoClient: any;
let dbInitialized = false;

try {
  tursoClient = createClient({
    url: process.env.TURSO_DATABASE_URL || process.env.DATABASE_URL || 'file:./dev.db',
    authToken: process.env.TURSO_AUTH_TOKEN || ''
  });
  dbInitialized = true;
} catch (error) {
  console.warn('Database not initialized, using fallback mode:', error);
  tursoClient = null;
}

export { tursoClient, dbInitialized };

// Database operations
export const db = {
  // Assessment operations
  assessment: {
    create: async (data: any) => {
      if (!dbInitialized || !tursoClient) {
        // Return a mock assessment object when database is not available
        return {
          id: `local_${Date.now()}`,
          createdAt: new Date().toISOString(),
          sessionId: data.sessionId || `session_${Date.now()}`,
          recruiterName: data.recruiterName,
          company: data.company,
          finalScore: data.finalScore,
          verdict: data.verdict,
          inputData: JSON.stringify(data.inputData),
          scoreData: JSON.stringify(data.scoreData),
          redFlags: JSON.stringify(data.redFlags),
          vtResults: JSON.stringify(data.vtResults),
          repoScans: JSON.stringify(data.repoScans),
          shareToken: data.shareToken || `share_${Math.random().toString(36).slice(2)}`
        };
      }
      
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
      if (!dbInitialized || !tursoClient) {
        return null; // Return null when database is not available
      }
      const result = await tursoClient.execute({
        sql: 'SELECT * FROM Assessment WHERE id = ?',
        args: [params.where.id]
      });
      return result.rows[0] || null;
    },
    
    findMany: async (params?: any) => {
      if (!dbInitialized || !tursoClient) {
        return []; // Return empty array when database is not available
      }
      let sql = 'SELECT * FROM Assessment';
      const args: any[] = [];
      
      if (params?.where?.sessionId) {
        sql += ' WHERE sessionId = ?';
        args.push(params.where.sessionId);
      }
      
      if (params?.orderBy?.createdAt) {
        sql += ' ORDER BY createdAt DESC';
      }
      
      if (params?.limit) {
        sql += ' LIMIT ?';
        args.push(params.limit);
      }
      
      const result = await tursoClient.execute({ sql, args });
      return result.rows;
    }
  },
  
  // Scam report operations
  scamReport: {
    findMany: async (params: any) => {
      if (!dbInitialized || !tursoClient) {
        return []; // Return empty array when database is not available
      }
      let sql = 'SELECT * FROM ScamReport';
      const args: any[] = [];
      
      if (params?.where?.status) {
        sql += ' WHERE status = ?';
        args.push(params.where.status);
      }
      
      if (params?.orderBy?.createdAt) {
        sql += ' ORDER BY createdAt DESC';
      }
      
      if (params?.limit) {
        sql += ' LIMIT ?';
        args.push(params.limit);
      }
      
      const result = await tursoClient.execute({ sql, args });
      return result.rows;
    },
    
    create: async (data: any) => {
      if (!dbInitialized || !tursoClient) {
        return null;
      }
      
      const result = await tursoClient.execute({
        sql: `INSERT INTO ScamReport (reporterName, reporterEmail, scammerName, scammerEmail, scammerCompany, description, status, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?) RETURNING *`,
        args: [
          data.reporterName,
          data.reporterEmail,
          data.scammerName,
          data.scammerEmail,
          data.scammerCompany,
          data.description,
          data.status || 'pending',
          new Date().toISOString()
        ]
      });
      return result.rows[0];
    }
  },
  
  // Blacklist operations
  blacklist: {
    findMany: async () => {
      if (!dbInitialized || !tursoClient) {
        return []; // Return empty array when database is not available
      }
      const result = await tursoClient.execute({
        sql: 'SELECT * FROM Blacklist',
        args: []
      });
      return result.rows;
    },
    
    create: async (data: any) => {
      if (!dbInitialized || !tursoClient) {
        return null;
      }
      
      const result = await tursoClient.execute({
        sql: `INSERT INTO Blacklist (type, value, reason, createdAt) VALUES (?, ?, ?, ?) RETURNING *`,
        args: [
          data.type,
          data.value,
          data.reason,
          new Date().toISOString()
        ]
      });
      return result.rows[0];
    }
  }
};
