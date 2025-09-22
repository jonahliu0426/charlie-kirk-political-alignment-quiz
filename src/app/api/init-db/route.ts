import { NextRequest, NextResponse } from 'next/server';
import { initializeDatabase, seedDemoData } from '@/lib/database-postgres';

// Simple admin key check - in production, use proper authentication
const ADMIN_KEY = process.env.ADMIN_KEY || 'admin123';

export async function POST(request: NextRequest) {
  try {
    // Check admin authentication
    const authHeader = request.headers.get('authorization');
    const adminKey = request.nextUrl.searchParams.get('key');
    
    if (authHeader !== `Bearer ${ADMIN_KEY}` && adminKey !== ADMIN_KEY) {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' }, 
        { status: 401 }
      );
    }

    // Initialize database tables
    await initializeDatabase();
    
    // Optionally seed demo data
    const shouldSeed = request.nextUrl.searchParams.get('seed') === 'true';
    if (shouldSeed) {
      await seedDemoData();
    }

    return NextResponse.json({
      success: true,
      message: 'Database initialized successfully',
      seeded: shouldSeed
    });

  } catch (error) {
    console.error('Error initializing database:', error);
    return NextResponse.json(
      { error: 'Failed to initialize database', details: error instanceof Error ? error.message : 'Unknown error' }, 
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Check admin authentication
    const adminKey = request.nextUrl.searchParams.get('key');
    
    if (adminKey !== ADMIN_KEY) {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' }, 
        { status: 401 }
      );
    }

    return NextResponse.json({
      message: 'Database initialization endpoint',
      usage: {
        POST: 'Initialize database tables',
        'POST?seed=true': 'Initialize database tables and seed demo data',
        'POST?key=admin123': 'Admin key required for authentication'
      }
    });

  } catch (error) {
    console.error('Error in init-db endpoint:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}