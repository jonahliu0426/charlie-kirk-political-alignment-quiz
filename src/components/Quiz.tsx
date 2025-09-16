'use client';

import { useState } from 'react';
import Flashcard, { FlashcardData } from './Flashcard';

interface QuizProps {
  questions: FlashcardData[];
  onComplete: (answers: Record<number, number>) => void;
}

export default function Quiz({ questions, onComplete }: QuizProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [isCompleted, setIsCompleted] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;

  const handleAnswer = (questionId: number, answer: number) => {
    const newAnswers = { ...answers, [questionId]: answer };
    setAnswers(newAnswers);

    // Auto-advance to next question after 1 second
    setTimeout(() => {
      if (currentQuestionIndex < totalQuestions - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
      } else {
        setIsCompleted(true);
        onComplete(newAnswers);
      }
    }, 1000);
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1 && answers[currentQuestion.id]) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  if (isCompleted) {
    return (
      <div className="text-center p-8">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Calculating Results...</h2>
        <p className="text-gray-600">Please wait while we analyze your responses.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">
            Question {currentQuestionIndex + 1} of {totalQuestions}
          </span>
          <span className="text-sm font-medium text-blue-600">
            {Math.round(progress)}% Complete
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Flashcard */}
      <div className="mb-8">
        <Flashcard
          question={currentQuestion}
          onAnswer={handleAnswer}
          selectedAnswer={answers[currentQuestion.id] || null}
          isAnswered={!!answers[currentQuestion.id]}
        />
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <button
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
          className={`
            px-6 py-3 rounded-lg font-medium transition-all duration-200
            ${currentQuestionIndex === 0
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-gray-600 text-white hover:bg-gray-700 hover:scale-105'
            }
          `}
        >
          Previous
        </button>

        <div className="flex space-x-2">
          {questions.map((_, index) => (
            <div
              key={index}
              className={`
                w-3 h-3 rounded-full transition-all duration-200
                ${index === currentQuestionIndex
                  ? 'bg-blue-600 scale-125'
                  : answers[questions[index].id]
                    ? 'bg-green-500'
                    : 'bg-gray-300'
                }
              `}
            />
          ))}
        </div>

        <button
          onClick={handleNext}
          disabled={currentQuestionIndex === totalQuestions - 1 || !answers[currentQuestion.id]}
          className={`
            px-6 py-3 rounded-lg font-medium transition-all duration-200
            ${(currentQuestionIndex === totalQuestions - 1 || !answers[currentQuestion.id])
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700 hover:scale-105'
            }
          `}
        >
          Next
        </button>
      </div>
    </div>
  );
}