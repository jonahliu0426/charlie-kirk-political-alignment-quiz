// Serverless-compatible database implementation
// Uses in-memory storage for demo purposes on Vercel

interface UserResponse {
  sessionId: string;
  questionId: number;
  answer: number;
  timestamp: number;
}

interface UserSession {
  id: string;
  completed: boolean;
  overlapPercentage?: number;
  timestamp: number;
}

// In-memory storage (resets on each serverless function call)
// For production, you'd want to use a database like Vercel Postgres, PlanetScale, etc.
const responses: UserResponse[] = [];
const sessions: UserSession[] = [];

export async function saveUserResponse(response: {
  sessionId: string;
  questionId: number;
  answer: number;
}) {
  responses.push({
    ...response,
    timestamp: Date.now()
  });
}

export async function saveUserSession(sessionId: string) {
  const existing = sessions.find(s => s.id === sessionId);
  if (!existing) {
    sessions.push({
      id: sessionId,
      completed: false,
      timestamp: Date.now()
    });
  }
}

export async function markSessionComplete(sessionId: string, overlapPercentage: number) {
  const session = sessions.find(s => s.id === sessionId);
  if (session) {
    session.completed = true;
    session.overlapPercentage = overlapPercentage;
  }
}

export async function getUserResponses(sessionId: string) {
  return responses
    .filter(r => r.sessionId === sessionId)
    .map(r => ({
      question_id: r.questionId,
      answer: r.answer
    }))
    .sort((a, b) => a.question_id - b.question_id);
}

export async function getDistributionData() {
  return sessions
    .filter(s => s.completed && s.overlapPercentage !== undefined)
    .map(s => s.overlapPercentage!);
}

export async function getDatabase() {
  // Mock database interface for compatibility
  return {
    get: async (query: string, params: string[]) => {
      if (query.includes('user_sessions')) {
        const sessionId = params[0];
        const session = sessions.find(s => s.id === sessionId);
        return session ? {
          id: session.id,
          completed: session.completed,
          overlap_percentage: session.overlapPercentage,
          created_at: new Date(session.timestamp).toISOString(),
          completed_at: session.completed ? new Date(session.timestamp).toISOString() : null
        } : null;
      }
      return null;
    }
  };
}