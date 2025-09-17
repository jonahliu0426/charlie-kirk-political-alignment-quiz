import { NextRequest, NextResponse } from 'next/server';
import { getUserResponses, getDatabase } from '@/lib/database-serverless';
import { calculateOverlapPercentage } from '@/lib/utils';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { sessionId } = await params;
    
    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' }, 
        { status: 400 }
      );
    }

    // Get session data
    const database = await getDatabase();
    const session = await database.get(
      'SELECT * FROM user_sessions WHERE id = ?',
      [sessionId]
    );
    
    if (!session) {
      return NextResponse.json(
        { error: 'Session not found' }, 
        { status: 404 }
      );
    }

    // Get user responses
    const responses = await getUserResponses(sessionId);
    
    // Convert responses to the format expected by calculateOverlapPercentage
    const answersObject = responses.reduce((acc: Record<number, number>, response: { question_id: number, answer: number }) => ({
      ...acc,
      [response.question_id]: response.answer
    }), {});

    // Calculate or get stored overlap percentage
    const overlapPercentage = session.overlap_percentage || calculateOverlapPercentage(answersObject);

    return NextResponse.json({
      sessionId,
      overlapPercentage,
      completed: session.completed,
      responses: answersObject,
      createdAt: session.created_at,
      completedAt: session.completed_at
    });

  } catch (error) {
    console.error('Error fetching results:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}