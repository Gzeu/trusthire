import { db, tursoClient, dbInitialized } from './turso-client';

// Mock prisma object for compatibility
export const prisma = {
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
    count: async () => {
      if (!dbInitialized || !tursoClient) {
        return 0; // Return 0 when database is not available
      }
      const result = await tursoClient.execute({
        sql: 'SELECT COUNT(*) as count FROM Assessment'
      });
      return result.rows[0]?.count || 0;
    },
    findMany: async (params: any) => {
      if (!dbInitialized || !tursoClient) {
        // Return mock data when database is not available
        return [
          {
            id: 'mock_1',
            createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
            recruiterName: 'John Smith',
            company: 'Tech Corp',
            finalScore: 75,
            verdict: 'low_risk',
            shareToken: 'share_abc123'
          },
          {
            id: 'mock_2',
            createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
            recruiterName: 'Sarah Johnson',
            company: 'StartupXYZ',
            finalScore: 45,
            verdict: 'caution',
            shareToken: 'share_def456'
          },
          {
            id: 'mock_3',
            createdAt: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
            recruiterName: 'Mike Wilson',
            company: 'RecruitPro',
            finalScore: 25,
            verdict: 'high_risk',
            shareToken: 'share_ghi789'
          },
          {
            id: 'mock_4',
            createdAt: new Date(Date.now() - 345600000).toISOString(), // 4 days ago
            recruiterName: 'Emily Davis',
            company: 'HireFast',
            finalScore: 15,
            verdict: 'critical',
            shareToken: 'share_jkl012'
          }
        ];
      }
      
      let sql = 'SELECT * FROM Assessment';
      const args: any[] = [];
      
      if (params?.select) {
        const fields = Object.keys(params.select);
        sql = `SELECT ${fields.join(', ')} FROM Assessment`;
      }
      
      if (params?.orderBy) {
        const { field, direction } = params.orderBy;
        sql += ` ORDER BY ${field} ${direction || 'ASC'}`;
      }
      
      if (params?.take) {
        sql += ` LIMIT ${params.take}`;
      }
      
      const result = await tursoClient.execute({ sql, args });
      return result.rows;
    },
    groupBy: async (params: any) => {
      if (!dbInitialized || !tursoClient) {
        // Return mock data when database is not available
        return [
          { verdict: 'critical', _count: { verdict: 2 } },
          { verdict: 'high_risk', _count: { verdict: 3 } },
          { verdict: 'caution', _count: { verdict: 5 } },
          { verdict: 'low_risk', _count: { verdict: 8 } }
        ];
      }
      
      const { by } = params;
      const result = await tursoClient.execute({
        sql: `SELECT ${by[0]}, COUNT(*) as _count FROM Assessment GROUP BY ${by[0]}`
      });
      return result.rows;
    }
  },
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
      
      sql += ' ORDER BY createdAt DESC';
      
      if (params?.skip) {
        sql += ' LIMIT ? OFFSET ?';
        args.push(params.take || 20, params.skip);
      } else if (params?.take) {
        sql += ' LIMIT ?';
        args.push(params.take);
      }
      
      const result = await tursoClient.execute({ sql, args });
      return result.rows;
    },
    count: async (params: any) => {
      if (!dbInitialized || !tursoClient) {
        return 0; // Return 0 when database is not available
      }
      let sql = 'SELECT COUNT(*) as count FROM ScamReport';
      const args: any[] = [];
      
      if (params?.where?.status) {
        sql += ' WHERE status = ?';
        args.push(params.where.status);
      }
      
      const result = await tursoClient.execute({ sql, args });
      return result.rows[0]?.count || 0;
    },
    findUnique: async (params: any) => {
      if (!dbInitialized || !tursoClient) {
        return null; // Return null when database is not available
      }
      const result = await tursoClient.execute({
        sql: 'SELECT * FROM ScamReport WHERE id = ?',
        args: [params.where.id]
      });
      return result.rows[0] || null;
    },
    update: async (params: any) => {
      if (!dbInitialized || !tursoClient) {
        return null; // Return null when database is not available
      }
      const { where, data } = params;
      const setParts: string[] = [];
      const args: any[] = [];
      
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined) {
          setParts.push(`${key} = ?`);
          args.push(value);
        }
      });
      
      args.push(where.id);
      
      const result = await tursoClient.execute({
        sql: `UPDATE ScamReport SET ${setParts.join(', ')} WHERE id = ? RETURNING *`,
        args
      });
      return result.rows[0];
    }
  },
  blacklist: {
    findFirst: async (params: any) => {
      if (!dbInitialized || !tursoClient) {
        return null; // Return null when database is not available
      }
      const { where } = params;
      const result = await tursoClient.execute({
        sql: 'SELECT * FROM Blacklist WHERE type = ? AND value = ?',
        args: [where.type, where.value]
      });
      return result.rows[0] || null;
    },
    update: async (params: any) => {
      if (!dbInitialized || !tursoClient) {
        return null; // Return null when database is not available
      }
      const { where, data } = params;
      const setParts: string[] = [];
      const args: any[] = [];
      
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined) {
          setParts.push(`${key} = ?`);
          args.push(value);
        }
      });
      
      args.push(where.id);
      
      const result = await tursoClient.execute({
        sql: `UPDATE Blacklist SET ${setParts.join(', ')} WHERE id = ? RETURNING *`,
        args
      });
      return result.rows[0];
    },
    create: async (data: any) => {
      if (!dbInitialized || !tursoClient) {
        return null; // Return null when database is not available
      }
      const keys = Object.keys(data);
      const values: any[] = Object.values(data);
      const placeholders = keys.map(() => '?').join(', ');
      
      const result = await tursoClient.execute(
        `INSERT INTO Blacklist (${keys.join(', ')}) VALUES (${placeholders}) RETURNING *`,
        values
      );
      return result.rows[0];
    }
  }
} as any;

export { tursoClient as default, tursoClient };
