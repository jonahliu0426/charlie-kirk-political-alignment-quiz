import { sql } from '@vercel/postgres';

// Database schema interfaces
export interface UserResponse {
  id?: number;
  session_id: string;
  question_id: number;
  answer: number;
  created_at?: string;
}

export interface UserSession {
  id: string;
  completed: boolean;
  overlap_percentage?: number;
  created_at?: string;
  completed_at?: string;
}

// Initialize database tables
export async function initializeDatabase() {
  try {
    // Create user_sessions table
    await sql`
      CREATE TABLE IF NOT EXISTS user_sessions (
        id VARCHAR(255) PRIMARY KEY,
        completed BOOLEAN DEFAULT FALSE,
        overlap_percentage INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        completed_at TIMESTAMP
      )
    `;

    // Create user_responses table
    await sql`
      CREATE TABLE IF NOT EXISTS user_responses (
        id SERIAL PRIMARY KEY,
        session_id VARCHAR(255) REFERENCES user_sessions(id) ON DELETE CASCADE,
        question_id INTEGER NOT NULL,
        answer INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Create index for better query performance
    await sql`
      CREATE INDEX IF NOT EXISTS idx_user_responses_session_id 
      ON user_responses(session_id)
    `;

    await sql`
      CREATE INDEX IF NOT EXISTS idx_user_sessions_completed 
      ON user_sessions(completed)
    `;

    console.log('Database tables initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}

// Save user response to database
export async function saveUserResponse(response: {
  sessionId: string;
  questionId: number;
  answer: number;
}) {
  try {
    await sql`
      INSERT INTO user_responses (session_id, question_id, answer)
      VALUES (${response.sessionId}, ${response.questionId}, ${response.answer})
    `;
  } catch (error) {
    console.error('Error saving user response:', error);
    throw error;
  }
}

// Save user session to database
export async function saveUserSession(sessionId: string) {
  try {
    await sql`
      INSERT INTO user_sessions (id, completed)
      VALUES (${sessionId}, FALSE)
      ON CONFLICT (id) DO NOTHING
    `;
  } catch (error) {
    console.error('Error saving user session:', error);
    throw error;
  }
}

// Mark session as complete with overlap percentage
export async function markSessionComplete(sessionId: string, overlapPercentage: number) {
  try {
    await sql`
      UPDATE user_sessions
      SET completed = TRUE, 
          overlap_percentage = ${overlapPercentage},
          completed_at = CURRENT_TIMESTAMP
      WHERE id = ${sessionId}
    `;
  } catch (error) {
    console.error('Error marking session complete:', error);
    throw error;
  }
}

// Get user responses for a session
export async function getUserResponses(sessionId: string) {
  try {
    const result = await sql`
      SELECT question_id, answer
      FROM user_responses
      WHERE session_id = ${sessionId}
      ORDER BY question_id ASC
    `;
    
    return result.rows;
  } catch (error) {
    console.error('Error getting user responses:', error);
    throw error;
  }
}

// Get distribution data (all completed session scores)
export async function getDistributionData() {
  try {
    const result = await sql`
      SELECT overlap_percentage
      FROM user_sessions
      WHERE completed = TRUE 
        AND overlap_percentage IS NOT NULL
      ORDER BY overlap_percentage DESC
    `;
    
    return result.rows.map(row => row.overlap_percentage);
  } catch (error) {
    console.error('Error getting distribution data:', error);
    throw error;
  }
}

// Get session data by ID
export async function getSessionById(sessionId: string) {
  try {
    const result = await sql`
      SELECT *
      FROM user_sessions
      WHERE id = ${sessionId}
    `;
    
    return result.rows[0] || null;
  } catch (error) {
    console.error('Error getting session by ID:', error);
    throw error;
  }
}

// Get all sessions with detailed statistics
export async function getAllSessions() {
  try {
    const result = await sql`
      SELECT *
      FROM user_sessions
      ORDER BY created_at DESC
    `;
    
    return result.rows;
  } catch (error) {
    console.error('Error getting all sessions:', error);
    throw error;
  }
}

// Get all responses with session data
export async function getAllResponses() {
  try {
    const result = await sql`
      SELECT 
        ur.*,
        us.completed,
        us.overlap_percentage
      FROM user_responses ur
      JOIN user_sessions us ON ur.session_id = us.id
      ORDER BY ur.created_at DESC
    `;
    
    return result.rows;
  } catch (error) {
    console.error('Error getting all responses:', error);
    throw error;
  }
}

// Get detailed statistics for admin dashboard
export async function getDetailedStats() {
  try {
    // Get total counts
    const sessionCounts = await sql`
      SELECT 
        COUNT(*) as total_sessions,
        COUNT(CASE WHEN completed = TRUE THEN 1 END) as completed_sessions
      FROM user_sessions
    `;

    // Get response counts by question
    const questionStats = await sql`
      SELECT 
        question_id,
        AVG(answer::DECIMAL) as avg_response,
        COUNT(*) as response_count,
        COUNT(DISTINCT session_id) as unique_sessions
      FROM user_responses ur
      JOIN user_sessions us ON ur.session_id = us.id
      WHERE us.completed = TRUE
      GROUP BY question_id
      ORDER BY question_id
    `;

    // Get completion stats by date
    const dailyCompletions = await sql`
      SELECT 
        DATE(completed_at) as completion_date,
        COUNT(*) as completions
      FROM user_sessions
      WHERE completed = TRUE
        AND completed_at >= CURRENT_DATE - INTERVAL '30 days'
      GROUP BY DATE(completed_at)
      ORDER BY completion_date DESC
    `;

    return {
      sessionCounts: sessionCounts.rows[0],
      questionStats: questionStats.rows,
      dailyCompletions: dailyCompletions.rows
    };
  } catch (error) {
    console.error('Error getting detailed stats:', error);
    throw error;
  }
}

// Clean old incomplete sessions (older than 24 hours)
export async function cleanOldSessions() {
  try {
    const result = await sql`
      DELETE FROM user_sessions
      WHERE completed = FALSE
        AND created_at < CURRENT_TIMESTAMP - INTERVAL '24 hours'
    `;
    
    console.log(`Cleaned ${result.rowCount} old incomplete sessions`);
    return result.rowCount;
  } catch (error) {
    console.error('Error cleaning old sessions:', error);
    throw error;
  }
}

// Mock database interface for compatibility with existing code
export async function getDatabase() {
  // Return a mock database object that provides the same interface
  return {
    get: async (query: string, params: string[]) => {
      if (query.includes('user_sessions')) {
        const sessionId = params[0];
        return await getSessionById(sessionId);
      }
      return null;
    }
  };
}

// Seed function for initial data (optional - for development/testing)
export async function seedDemoData() {
  try {
    // Check if we already have demo data
    const existingSessions = await sql`
      SELECT COUNT(*) as count FROM user_sessions WHERE id LIKE 'demo%'
    `;
    
    if (existingSessions.rows[0].count > 0) {
      console.log('Demo data already exists, skipping seed');
      return;
    }

    // Create demo sessions
    const demoSessions = [
      { id: 'demo1', percentage: 75 },
      { id: 'demo2', percentage: 45 },
      { id: 'demo3', percentage: 88 },
      { id: 'demo4', percentage: 32 },
      { id: 'demo5', percentage: 67 },
      { id: 'demo6', percentage: 91 },
      { id: 'demo7', percentage: 23 },
      { id: 'demo8', percentage: 56 },
    ];

    for (const session of demoSessions) {
      await sql`
        INSERT INTO user_sessions (id, completed, overlap_percentage, completed_at)
        VALUES (${session.id}, TRUE, ${session.percentage}, CURRENT_TIMESTAMP - INTERVAL '${Math.floor(Math.random() * 7)} days')
        ON CONFLICT (id) DO NOTHING
      `;
      
      // Add some demo responses for each session
      for (let questionId = 1; questionId <= 10; questionId++) {
        const answer = Math.floor(Math.random() * 5) + 1;
        await sql`
          INSERT INTO user_responses (session_id, question_id, answer)
          VALUES (${session.id}, ${questionId}, ${answer})
          ON CONFLICT DO NOTHING
        `;
      }
    }

    console.log('Demo data seeded successfully');
  } catch (error) {
    console.error('Error seeding demo data:', error);
    // Don't throw error for demo data seeding failures
  }
}