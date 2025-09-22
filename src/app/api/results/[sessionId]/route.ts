import { NextRequest, NextResponse } from 'next/server';
import { getUserResponses, getSessionById, initializeDatabase } from '@/lib/database-postgres';
import { calculateOverlapPercentage } from '@/lib/utils';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    // Initialize database tables if they don't exist
    await initializeDatabase();
    
    const { sessionId } = await params;
    
    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' }, 
        { status: 400 }
      );
    }

    // Get session data
    const session = await getSessionById(sessionId);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Session not found' }, 
        { status: 404 }
      );
    }

    // Get user responses
    const responses = await getUserResponses(sessionId);
    
    // Convert responses to the format expected by calculateOverlapPercentage
    const answersObject = responses.reduce((acc: Record<number, number>, response: any) => ({
      ...acc,
      [response.question_id]: response.answer
    }), {} as Record<number, number>);

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