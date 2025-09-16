import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import path from 'path';

let db: Database | null = null;

export async function getDatabase() {
  if (!db) {
    db = await open({
      filename: path.join(process.cwd(), 'data', 'responses.db'),
      driver: sqlite3.Database,
    });

    // Create tables if they don't exist
    await initializeTables();
  }
  return db;
}

async function initializeTables() {
  const database = db!;
  
  // User responses table
  await database.exec(`
    CREATE TABLE IF NOT EXISTS user_responses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      session_id TEXT NOT NULL,
      question_id INTEGER NOT NULL,
      answer INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // User sessions table for storing completion status and results
  await database.exec(`
    CREATE TABLE IF NOT EXISTS user_sessions (
      id TEXT PRIMARY KEY,
      completed BOOLEAN DEFAULT FALSE,
      overlap_percentage REAL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      completed_at DATETIME
    )
  `);

  // Create indexes for better performance
  await database.exec(`
    CREATE INDEX IF NOT EXISTS idx_user_responses_session 
    ON user_responses(session_id);
  `);
  
  await database.exec(`
    CREATE INDEX IF NOT EXISTS idx_user_responses_question 
    ON user_responses(question_id);
  `);
}

export interface UserResponse {
  sessionId: string;
  questionId: number;
  answer: number;
}

export async function saveUserResponse(response: UserResponse) {
  const database = await getDatabase();
  
  await database.run(
    'INSERT INTO user_responses (session_id, question_id, answer) VALUES (?, ?, ?)',
    [response.sessionId, response.questionId, response.answer]
  );
}

export async function saveUserSession(sessionId: string) {
  const database = await getDatabase();
  
  await database.run(
    'INSERT OR IGNORE INTO user_sessions (id) VALUES (?)',
    [sessionId]
  );
}

export async function markSessionComplete(sessionId: string, overlapPercentage: number) {
  const database = await getDatabase();
  
  await database.run(
    'UPDATE user_sessions SET completed = TRUE, overlap_percentage = ?, completed_at = CURRENT_TIMESTAMP WHERE id = ?',
    [overlapPercentage, sessionId]
  );
}

export async function getUserResponses(sessionId: string) {
  const database = await getDatabase();
  
  return await database.all(
    'SELECT question_id, answer FROM user_responses WHERE session_id = ? ORDER BY question_id',
    [sessionId]
  );
}

export async function getAllCompletedSessions() {
  const database = await getDatabase();
  
  return await database.all(
    'SELECT overlap_percentage FROM user_sessions WHERE completed = TRUE'
  );
}

export async function getDistributionData() {
  const database = await getDatabase();
  
  const sessions = await database.all(
    'SELECT overlap_percentage FROM user_sessions WHERE completed = TRUE AND overlap_percentage IS NOT NULL'
  );
  
  return sessions.map((s: { overlap_percentage: number }) => s.overlap_percentage);
}