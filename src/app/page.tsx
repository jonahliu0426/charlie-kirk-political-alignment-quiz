'use client';

import { useState } from 'react';
import Quiz from '@/components/Quiz';
import { getQuestions } from '@/data/questions';

export default function Home() {
  const [quizStarted, setQuizStarted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleStartQuiz = () => {
    setQuizStarted(true);
  };

  const handleQuizComplete = async (answers: Record<number, number>) => {
    setLoading(true);
    
    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ answers }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit responses');
      }

      const result = await response.json();
      
      // Redirect to results page
      window.location.href = `/results/${result.sessionId}`;
      
    } catch (error) {
      console.error('Error submitting quiz:', error);
      alert('There was an error submitting your responses. Please try again.');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Submitting Results...</h2>
          <p className="text-gray-600">Please wait while we process your responses.</p>
        </div>
      </div>
    );
  }

  if (quizStarted) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <Quiz 
          questions={getQuestions()} 
          onComplete={handleQuizComplete}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-2xl mx-auto text-center bg-white rounded-lg shadow-xl p-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Political Alignment Quiz
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Discover how closely your political views align with Charlie Kirk&apos;s positions
          </p>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <h2 className="text-lg font-semibold text-blue-800 mb-3">How it works:</h2>
            <div className="text-left text-blue-700 space-y-2">
              <p>• Answer 10 political questions on a 5-point scale</p>
              <p>• Each question covers key political issues and policies</p>
              <p>• Your responses will be compared to reference positions</p>
              <p>• See your alignment percentage and where you stand</p>
              <p>• Share your results on social media with auto-generated images</p>
              <p>• View how your results compare to other participants</p>
            </div>
          </div>

          <div className="mb-6">
            <p className="text-gray-600 mb-4">
              This quiz is designed for educational purposes to help you understand political alignment.
              Your responses are anonymous and stored securely.
            </p>
            <p className="text-sm text-gray-500">
              Estimated time: 2-3 minutes
            </p>
          </div>
        </div>

        <button
          onClick={handleStartQuiz}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg text-xl transition-all duration-200 hover:scale-105 shadow-lg"
        >
          Start Political Alignment Quiz
        </button>

        <div className="mt-8 text-sm text-gray-500">
          <p>
            By taking this quiz, you agree to anonymous data collection for statistical purposes.
          </p>
        </div>
      </div>
    </div>
  );
}
