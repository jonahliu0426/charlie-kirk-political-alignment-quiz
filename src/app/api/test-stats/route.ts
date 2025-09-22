import { NextResponse } from 'next/server';
import { getDistributionData, initializeDatabase, seedDemoData } from '@/lib/database-postgres';

export async function GET() {
  try {
    console.log('Starting test-stats endpoint...');
    
    // Initialize database
    console.log('Initializing database...');
    await initializeDatabase();
    
    // Seed demo data
    console.log('Seeding demo data...');
    await seedDemoData();
    
    // Get distribution data
    console.log('Getting distribution data...');
    const allScores = await getDistributionData();
    
    console.log('Distribution data:', allScores);
    
    return NextResponse.json({
      success: true,
      message: 'Test stats endpoint working',
      scoresCount: allScores.length,
      scores: allScores,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error in test-stats:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}