import { NextRequest, NextResponse } from 'next/server';
import { getDistributionData } from '@/lib/database-serverless';

// Simple admin key check - in production, use proper authentication
const ADMIN_KEY = process.env.ADMIN_KEY || 'admin123';

export async function GET(request: NextRequest) {
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

    // Get all completed sessions data
    const allScores = await getDistributionData();
    
    if (allScores.length === 0) {
      return NextResponse.json({
        totalParticipants: 0,
        averageAlignment: 0,
        medianAlignment: 0,
        distribution: {},
        alignmentLevels: {},
        scoreRanges: {},
        statistics: {
          highest: 0,
          lowest: 0,
          standardDeviation: 0
        },
        message: 'No participants yet'
      });
    }

    // Calculate comprehensive statistics
    const totalParticipants = allScores.length;
    const averageAlignment = Math.round(allScores.reduce((sum, score) => sum + score, 0) / totalParticipants);
    
    // Calculate median
    const sortedScores = [...allScores].sort((a, b) => a - b);
    const medianAlignment = totalParticipants % 2 === 0
      ? Math.round((sortedScores[totalParticipants / 2 - 1] + sortedScores[totalParticipants / 2]) / 2)
      : sortedScores[Math.floor(totalParticipants / 2)];

    // Distribution by 10-point buckets
    const distribution: Record<string, number> = {
      '0-9%': 0, '10-19%': 0, '20-29%': 0, '30-39%': 0, '40-49%': 0,
      '50-59%': 0, '60-69%': 0, '70-79%': 0, '80-89%': 0, '90-100%': 0
    };

    // Alignment levels
    const alignmentLevels: Record<string, number> = {
      'Minimal Alignment (0-24%)': 0,
      'Very Low Alignment (25-39%)': 0,
      'Low Alignment (40-59%)': 0,
      'Moderate Alignment (60-74%)': 0,
      'High Alignment (75-89%)': 0,
      'Very High Alignment (90-100%)': 0
    };

    // Score ranges for detailed analysis
    const scoreRanges: Record<string, number> = {
      'Under 25%': 0,
      '25-49%': 0,
      '50-74%': 0,
      '75-89%': 0,
      '90%+': 0
    };

    // Process each score
    allScores.forEach(score => {
      // Distribution buckets
      const bucket = Math.floor(score / 10) * 10;
      const bucketKey = `${bucket}-${bucket + 9}%`;
      if (bucketKey in distribution) {
        distribution[bucketKey]++;
      }

      // Alignment levels
      if (score >= 90) alignmentLevels['Very High Alignment (90-100%)']++;
      else if (score >= 75) alignmentLevels['High Alignment (75-89%)']++;
      else if (score >= 60) alignmentLevels['Moderate Alignment (60-74%)']++;
      else if (score >= 40) alignmentLevels['Low Alignment (40-59%)']++;
      else if (score >= 25) alignmentLevels['Very Low Alignment (25-39%)']++;
      else alignmentLevels['Minimal Alignment (0-24%)']++;

      // Score ranges
      if (score < 25) scoreRanges['Under 25%']++;
      else if (score < 50) scoreRanges['25-49%']++;
      else if (score < 75) scoreRanges['50-74%']++;
      else if (score < 90) scoreRanges['75-89%']++;
      else scoreRanges['90%+']++;
    });

    // Additional statistics
    const highest = Math.max(...allScores);
    const lowest = Math.min(...allScores);
    
    // Standard deviation
    const variance = allScores.reduce((sum, score) => sum + Math.pow(score - averageAlignment, 2), 0) / totalParticipants;
    const standardDeviation = Math.round(Math.sqrt(variance) * 100) / 100;

    // Question-level analysis (mock data since we're using in-memory storage)
    const questionAnalysis = Array.from({ length: 10 }, (_, i) => ({
      questionId: i + 1,
      averageResponse: Math.round((Math.random() * 2 + 2.5) * 100) / 100, // 2.5-4.5 range
      mostCommonResponse: Math.floor(Math.random() * 5) + 1,
      responseDistribution: {
        1: Math.floor(Math.random() * totalParticipants * 0.3),
        2: Math.floor(Math.random() * totalParticipants * 0.25),
        3: Math.floor(Math.random() * totalParticipants * 0.2),
        4: Math.floor(Math.random() * totalParticipants * 0.15),
        5: Math.floor(Math.random() * totalParticipants * 0.1)
      }
    }));

    return NextResponse.json({
      totalParticipants,
      averageAlignment,
      medianAlignment,
      distribution,
      alignmentLevels,
      scoreRanges,
      statistics: {
        highest,
        lowest,
        standardDeviation
      },
      questionAnalysis,
      allScores: allScores.sort((a, b) => b - a), // Highest to lowest
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}