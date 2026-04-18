// Database connection test for production
import { tursoClient, dbInitialized } from './turso-client';

export async function testDatabaseConnection() {
  console.log('Testing database connection...');
  console.log('Database initialized:', dbInitialized);
  console.log('Turso client available:', !!tursoClient);
  
  if (!dbInitialized || !tursoClient) {
    console.log('Database not available, using fallback mode');
    return { success: false, message: 'Database not available' };
  }
  
  try {
    // Test basic connection
    const result = await tursoClient.execute({
      sql: 'SELECT 1 as test',
      args: []
    });
    
    console.log('Database connection successful:', result.rows[0]);
    
    // Test if tables exist
    const tables = await tursoClient.execute({
      sql: "SELECT name FROM sqlite_master WHERE type='table'",
      args: []
    });
    
    console.log('Available tables:', tables.rows);
    
    return { 
      success: true, 
      message: 'Database connection successful',
      tables: tables.rows.map((row: { name: string }) => row.name)
    };
  } catch (error) {
    console.error('Database connection failed:', error);
    return { 
      success: false, 
      message: 'Database connection failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

// Test environment variables
export function testEnvironmentVariables() {
  const envVars = {
    TURSO_DATABASE_URL: !!process.env.TURSO_DATABASE_URL,
    TURSO_AUTH_TOKEN: !!process.env.TURSO_AUTH_TOKEN,
    GROQ_API_KEY: !!process.env.GROQ_API_KEY,
    VIRUSTOTAL_API_KEY: !!process.env.VIRUSTOTAL_API_KEY,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NODE_ENV: process.env.NODE_ENV
  };
  
  console.log('Environment variables status:', envVars);
  return envVars;
}
