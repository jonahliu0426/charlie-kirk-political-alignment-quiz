// Persistent storage solution for serverless environment
// Uses a combination of global variables and external storage

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

// Global storage that persists across function calls within the same container
// Note: This is still subject to container restarts, but provides better persistence
declare global {
  var __QUIZ_RESPONSES__: UserResponse[] | undefined;
  var __QUIZ_SESSIONS__: UserSession[] | undefined;
  var __STORAGE_INITIALIZED__: boolean | undefined;
}

// Initialize storage
function initializeStorage() {
  if (!global.__STORAGE_INITIALIZED__) {
    global.__QUIZ_RESPONSES__ = global.__QUIZ_RESPONSES__ || [];
    global.__QUIZ_SESSIONS__ = global.__QUIZ_SESSIONS__ || [];
    global.__STORAGE_INITIALIZED__ = true;
  }
  return {
    responses: global.__QUIZ_RESPONSES__!,
    sessions: global.__QUIZ_SESSIONS__!
  };
}

// For production: You would implement this with a real database
// like Vercel Postgres, PlanetScale, or Vercel KV
// This is a demo implementation that works better than in-memory but still resets on cold starts

export async function saveUserResponse(response: {
  sessionId: string;
  questionId: number;
  answer: number;
}) {
  const storage = initializeStorage();
  
  const userResponse: UserResponse = {
    ...response,
    timestamp: Date.now()
  };
  
  storage.responses.push(userResponse);
  
  // Optional: Implement external persistence here
  // await saveToExternalStorage('responses', storage.responses);
}

export async function saveUserSession(sessionId: string) {
  const storage = initializeStorage();
  
  const existing = storage.sessions.find(s => s.id === sessionId);
  if (!existing) {
    const session: UserSession = {
      id: sessionId,
      completed: false,
      timestamp: Date.now()
    };
    storage.sessions.push(session);
    
    // Optional: Implement external persistence here
    // await saveToExternalStorage('sessions', storage.sessions);
  }
}

export async function markSessionComplete(sessionId: string, overlapPercentage: number) {
  const storage = initializeStorage();
  
  const session = storage.sessions.find(s => s.id === sessionId);
  if (session) {
    session.completed = true;
    session.overlapPercentage = overlapPercentage;
    
    // Optional: Implement external persistence here
    // await saveToExternalStorage('sessions', storage.sessions);
  }
}

export async function getUserResponses(sessionId: string) {
  const storage = initializeStorage();
  
  return storage.responses
    .filter(r => r.sessionId === sessionId)
    .map(r => ({
      question_id: r.questionId,
      answer: r.answer
    }))
    .sort((a, b) => a.question_id - b.question_id);
}

export async function getDistributionData() {
  const storage = initializeStorage();
  
  return storage.sessions
    .filter(s => s.completed && s.overlapPercentage !== undefined)
    .map(s => s.overlapPercentage!);
}

export async function getDatabase() {
  const storage = initializeStorage();
  
  // Mock database interface for compatibility
  return {
    get: async (query: string, params: string[]) => {
      if (query.includes('user_sessions')) {
        const sessionId = params[0];
        const session = storage.sessions.find(s => s.id === sessionId);
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

// Enhanced statistics functions with better persistence
export async function getAllResponses() {
  const storage = initializeStorage();
  return storage.responses;
}

export async function getAllSessions() {
  const storage = initializeStorage();
  return storage.sessions;
}

export async function getStorageStats() {
  const storage = initializeStorage();
  return {
    totalResponses: storage.responses.length,
    totalSessions: storage.sessions.length,
    completedSessions: storage.sessions.filter(s => s.completed).length,
    oldestSession: storage.sessions.length > 0 ? Math.min(...storage.sessions.map(s => s.timestamp)) : null,
    newestSession: storage.sessions.length > 0 ? Math.max(...storage.sessions.map(s => s.timestamp)) : null
  };
}

// Helper function to seed some demo data for testing
export async function seedDemoData() {
  const storage = initializeStorage();
  
  // Only seed if no data exists
  if (storage.sessions.length === 0) {
    const demoSessions = [
      { id: 'demo1', completed: true, overlapPercentage: 75, timestamp: Date.now() - 86400000 },
      { id: 'demo2', completed: true, overlapPercentage: 45, timestamp: Date.now() - 82800000 },
      { id: 'demo3', completed: true, overlapPercentage: 88, timestamp: Date.now() - 79200000 },
      { id: 'demo4', completed: true, overlapPercentage: 32, timestamp: Date.now() - 75600000 },
      { id: 'demo5', completed: true, overlapPercentage: 67, timestamp: Date.now() - 72000000 },
    ];
    
    storage.sessions.push(...demoSessions);
  }
}