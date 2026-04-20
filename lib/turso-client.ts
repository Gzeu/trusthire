// Turso client for TrustHire Autonomous System
export const dbInitialized = Promise.resolve(true);

export interface TursoConfig {
  url: string;
  authToken: string;
  database?: string;
}

export interface QueryResult {
  columns: Array<{
    name: string;
    type: string;
  }>;
  rows: Array<Array<any>>;
  lastInsertRowid?: number;
  rowsAffected: number;
  time: number;
}

export class TursoClient {
  private config: TursoConfig;
  private baseUrl: string;

  constructor(config: TursoConfig) {
    this.config = config;
    this.baseUrl = config.url.replace(/\/$/, '');
  }

  async execute(sql: string, params?: any[]): Promise<QueryResult> {
    const response = await fetch(`${this.baseUrl}/v1/pipeline`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.config.authToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        requests: [
          {
            type: 'execute',
            stmt: {
              sql,
              args: params || []
            }
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`Turso query failed: ${response.statusText}`);
    }

    const data = await response.json();
    const result = data.results[0];

    if (result.error) {
      throw new Error(`Turso query error: ${result.error}`);
    }

    return {
      columns: result.response.result.columns || [],
      rows: result.response.result.rows || [],
      lastInsertRowid: result.response.result.last_insert_rowid,
      rowsAffected: result.response.result.rows_affected || 0,
      time: result.response.result.time || 0
    };
  }

  async executeMany(queries: Array<{ sql: string; params?: any[] }>): Promise<QueryResult[]> {
    const response = await fetch(`${this.baseUrl}/v1/pipeline`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.config.authToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        requests: queries.map(query => ({
          type: 'execute',
          stmt: {
            sql: query.sql,
            args: query.params || []
          }
        }))
      })
    });

    if (!response.ok) {
      throw new Error(`Turso batch query failed: ${response.statusText}`);
    }

    const data = await response.json();

    return data.results.map((result: any) => {
      if (result.error) {
        throw new Error(`Turso query error: ${result.error}`);
      }

      return {
        columns: result.response.result.columns || [],
        rows: result.response.result.rows || [],
        lastInsertRowid: result.response.result.last_insert_rowid,
        rowsAffected: result.response.result.rows_affected || 0,
        time: result.response.result.time || 0
      };
    });
  }

  async transaction(queries: Array<{ sql: string; params?: any[] }>): Promise<QueryResult[]> {
    const response = await fetch(`${this.baseUrl}/v1/pipeline`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.config.authToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        requests: queries.map(query => ({
          type: 'execute',
          stmt: {
            sql: query.sql,
            args: query.params || []
          }
        }))
      })
    });

    if (!response.ok) {
      throw new Error(`Turso transaction failed: ${response.statusText}`);
    }

    const data = await response.json();

    return data.results.map((result: any) => {
      if (result.error) {
        throw new Error(`Turso transaction error: ${result.error}`);
      }

      return {
        columns: result.response.result.columns || [],
        rows: result.response.result.rows || [],
        lastInsertRowid: result.response.result.last_insert_rowid,
        rowsAffected: result.response.result.rows_affected || 0,
        time: result.response.result.time || 0
      };
    });
  }

  async health(): Promise<boolean> {
    try {
      await this.execute('SELECT 1');
      return true;
    } catch (error) {
      return false;
    }
  }

  async getSchema(): Promise<Array<{
    name: string;
    type: 'table' | 'view' | 'index';
    sql: string;
  }>> {
    const result = await this.execute(`
      SELECT name, type, sql 
      FROM sqlite_master 
      WHERE type IN ('table', 'view', 'index')
      ORDER BY type, name
    `);

    return result.rows.map(row => ({
      name: row[0],
      type: row[1],
      sql: row[2]
    }));
  }

  async getTableInfo(tableName: string): Promise<Array<{
    cid: number;
    name: string;
    type: string;
    notNull: boolean;
    dfltValue: any;
    pk: boolean;
  }>> {
    const result = await this.execute(`PRAGMA table_info(${tableName})`);

    return result.rows.map(row => ({
      cid: row[0],
      name: row[1],
      type: row[2],
      notNull: Boolean(row[3]),
      dfltValue: row[4],
      pk: Boolean(row[5])
    }));
  }

  async getStats(): Promise<{
    tables: number;
    indexes: number;
    views: number;
    size: number;
  }> {
    const [tablesResult, indexesResult, viewsResult] = await Promise.all([
      this.execute("SELECT COUNT(*) FROM sqlite_master WHERE type = 'table'"),
      this.execute("SELECT COUNT(*) FROM sqlite_master WHERE type = 'index'"),
      this.execute("SELECT COUNT(*) FROM sqlite_master WHERE type = 'view'")
    ]);

    const tables = tablesResult.rows[0][0];
    const indexes = indexesResult.rows[0][0];
    const views = viewsResult.rows[0][0];

    // Mock size calculation - in production, this would be more accurate
    const size = (tables + indexes + views) * 1024; // Rough estimate

    return {
      tables,
      indexes,
      views,
      size
    };
  }
}

// Mock implementation for development
export class MockTursoClient extends TursoClient {
  private mockData = new Map<string, any[][]>();

  constructor() {
    super({
      url: 'https://mock-turso.com',
      authToken: 'mock-token'
    });
    
    this.initializeMockData();
  }

  private initializeMockData(): void {
    // Add some mock data
    this.mockData.set('SELECT 1', [[1]]);
    this.mockData.set('SELECT COUNT(*) FROM users', [[5]]);
    this.mockData.set('SELECT * FROM users LIMIT 10', [
      [1, 'user1@example.com', 'User One', 'user'],
      [2, 'user2@example.com', 'User Two', 'admin'],
      [3, 'user3@example.com', 'User Three', 'user']
    ]);
  }

  async execute(sql: string, params?: any[]): Promise<QueryResult> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, Math.random() * 100));

    const key = sql.trim();
    const rows = this.mockData.get(key) || [];

    return {
      columns: rows.length > 0 
        ? ['id', 'email', 'name', 'role'].map((name, index) => ({
            name,
            type: 'TEXT'
          }))
        : [],
      rows,
      rowsAffected: sql.toLowerCase().startsWith('insert') ? 1 : 0,
      time: Math.random() * 50
    };
  }
}

// Create instances
export const tursoClient = new TursoClient({
  url: process.env.TURSO_URL || 'https://your-turso-url.turso.io',
  authToken: process.env.TURSO_AUTH_TOKEN || 'your-auth-token'
});

export const mockTursoClient = new MockTursoClient();
