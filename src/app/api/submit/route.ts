import { NextRequest, NextResponse } from 'next/server';
import { 
  saveUserResponse, 
  saveUserSession, 
  markSessionComplete
} from '@/lib/database-serverless';
import { generateSessionId, calculateOverlapPercentage } from '@/lib/utils';

export async function POST(request: NextRequest) {
  try {
    const { answers } = await request.json();
    
    if (!answers || typeof answers !== 'object') {
      return NextResponse.json(
        { error: 'Invalid answers format' }, 
        { status: 400 }
      );
    }

    // Generate session ID
    const sessionId = generateSessionId();
    
    // Save session
    await saveUserSession(sessionId);
    
    // Save all responses
    for (const questionId in answers) {
      await saveUserResponse({
        sessionId,
        questionId: parseInt(questionId),
        answer: answers[questionId]
      });
    }
    
    // Calculate overlap percentage
    const overlapPercentage = calculateOverlapPercentage(answers);
    
    // Mark session as complete with calculated percentage
    await markSessionComplete(sessionId, overlapPercentage);
    
    return NextResponse.json({
      sessionId,
      overlapPercentage,
      message: 'Responses submitted successfully'
    });

  } catch (error) {
    console.error('Error submitting responses:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}