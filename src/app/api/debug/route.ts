import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import { initializeDatabase, seedDemoData } from '@/lib/database-postgres';

export async function GET() {
  try {
    console.log('Debug endpoint called...');
    
    // Test basic SQL connection
    console.log('Testing SQL connection...');
    const result = await sql`SELECT NOW() as current_time, version() as db_version`;
    console.log('SQL result:', result.rows[0]);
    
    // Test if tables exist
    const tablesResult = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `;
    
    return NextResponse.json({
      success: true,
      message: 'Database connection successful',
      currentTime: result.rows[0]?.current_time,
      dbVersion: result.rows[0]?.db_version?.substring(0, 50) + '...',
      tables: tablesResult.rows.map(row => row.table_name),
      envVars: {
        POSTGRES_URL: process.env.POSTGRES_URL ? 'Present' : 'Missing',
        POSTGRES_HOST: process.env.POSTGRES_HOST ? 'Present' : 'Missing',
        POSTGRES_DATABASE: process.env.POSTGRES_DATABASE ? 'Present' : 'Missing',
        DATABASE_URL: process.env.DATABASE_URL ? 'Present' : 'Missing',
      },
      nodeEnv: process.env.NODE_ENV,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Database connection error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      postgresUrl: process.env.POSTGRES_URL ? 'Set' : 'Not set',
      envVars: {
        POSTGRES_URL: process.env.POSTGRES_URL ? 'Present' : 'Missing',
        POSTGRES_HOST: process.env.POSTGRES_HOST ? 'Present' : 'Missing',
        POSTGRES_DATABASE: process.env.POSTGRES_DATABASE ? 'Present' : 'Missing',
      }
    }, { status: 500 });
  }
}

export async function POST() {
  try {
    // Test database initialization
    await initializeDatabase();
    await seedDemoData();
    
    // Check tables exist
    const tablesResult = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `;
    
    // Check session count
    const sessionCount = await sql`SELECT COUNT(*) as count FROM user_sessions`;
    
    return NextResponse.json({
      success: true,
      message: 'Database initialized and seeded',
      tables: tablesResult.rows.map(row => row.table_name),
      sessionCount: sessionCount.rows[0]?.count || 0
    });

  } catch (error) {
    console.error('Database initialization error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}