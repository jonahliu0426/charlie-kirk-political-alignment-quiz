import { NextResponse } from 'next/server';
import { getDistributionData } from '@/lib/database';
import { createDistributionData } from '@/lib/utils';

export async function GET() {
  try {
    // Get all completed session scores
    const allScores = await getDistributionData();
    
    if (allScores.length === 0) {
      // Return empty distribution if no data
      return NextResponse.json({
        distribution: createDistributionData([]),
        totalResponses: 0,
        averageScore: 0,
        message: 'No responses yet'
      });
    }
    
    // Create distribution buckets
    const distribution = createDistributionData(allScores);
    
    // Calculate statistics
    const totalResponses = allScores.length;
    const averageScore = Math.round(
      allScores.reduce((sum: number, score: number) => sum + score, 0) / totalResponses
    );
    
    return NextResponse.json({
      distribution,
      totalResponses,
      averageScore,
      allScores
    });

  } catch (error) {
    console.error('Error fetching distribution data:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}