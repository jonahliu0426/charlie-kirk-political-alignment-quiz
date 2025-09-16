'use client';

export interface FlashcardData {
  id: number;
  question: string;
  choices: string[];
}

interface FlashcardProps {
  question: FlashcardData;
  onAnswer: (questionId: number, answer: number) => void;
  selectedAnswer: number | null;
  isAnswered: boolean;
}

const ANSWER_COLORS = [
  'bg-red-600 hover:bg-red-700',
  'bg-red-400 hover:bg-red-500', 
  'bg-gray-400 hover:bg-gray-500',
  'bg-green-400 hover:bg-green-500',
  'bg-green-600 hover:bg-green-700'
];

export default function Flashcard({ question, onAnswer, selectedAnswer, isAnswered }: FlashcardProps) {
  const handleAnswerClick = (value: number) => {
    if (!isAnswered) {
      onAnswer(question.id, value);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Question {question.id}
        </h3>
        <p className="text-lg text-gray-700 leading-relaxed">
          {question.question}
        </p>
      </div>
      
      <div className="grid grid-cols-5 gap-3">
        {question.choices.map((choice, index) => {
          const value = index + 1;
          const color = ANSWER_COLORS[index];
          return (
            <button
              key={value}
              onClick={() => handleAnswerClick(value)}
              disabled={isAnswered}
              className={`
                p-3 rounded-lg text-white font-medium transition-all duration-200 text-center text-sm
                ${selectedAnswer === value 
                  ? `${color} ring-4 ring-white ring-offset-2 ring-offset-gray-100` 
                  : color
                }
                ${isAnswered ? 'opacity-75 cursor-not-allowed' : 'hover:scale-105'}
              `}
            >
              {choice}
            </button>
          );
        })}
      </div>
    </div>
  );
}