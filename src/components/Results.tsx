'use client';

import { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface ResultsProps {
  sessionId: string;
}

interface DistributionData {
  bucket: string;
  count: number;
}

interface ResultsData {
  overlapPercentage: number;
  distribution: DistributionData[];
  totalResponses: number;
  averageScore: number;
  userScore: number;
}

export default function Results({ sessionId }: ResultsProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [resultsData, setResultsData] = useState<ResultsData | null>(null);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        // Fetch user's results
        const userResponse = await fetch(`/api/results/${sessionId}`);
        if (!userResponse.ok) {
          throw new Error('Failed to fetch user results');
        }
        const userData = await userResponse.json();

        // Fetch distribution data
        const distributionResponse = await fetch('/api/distribution');
        if (!distributionResponse.ok) {
          throw new Error('Failed to fetch distribution data');
        }
        const distributionData = await distributionResponse.json();

        setResultsData({
          overlapPercentage: userData.overlapPercentage,
          distribution: distributionData.distribution,
          totalResponses: distributionData.totalResponses,
          averageScore: distributionData.averageScore,
          userScore: userData.overlapPercentage
        });

      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [sessionId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Analyzing Results...</h2>
          <p className="text-gray-600">Please wait while we calculate your political alignment.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!resultsData) {
    return <div>No results available</div>;
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-blue-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 90) return 'Very High Alignment';
    if (score >= 75) return 'High Alignment';
    if (score >= 60) return 'Moderate Alignment';
    if (score >= 40) return 'Low Alignment';
    if (score >= 25) return 'Very Low Alignment';
    return 'Minimal Alignment';
  };

  const chartData = {
    labels: resultsData.distribution.map(d => d.bucket),
    datasets: [
      {
        label: 'Number of Users',
        data: resultsData.distribution.map(d => d.count),
        backgroundColor: resultsData.distribution.map((d, index) => {
          const bucketStart = index * 10;
          const bucketEnd = bucketStart + 9;
          const userScore = resultsData.userScore;
          
          // Highlight user's bucket
          if (userScore >= bucketStart && userScore <= bucketEnd) {
            return 'rgba(59, 130, 246, 0.8)'; // Blue for user's bucket
          }
          return 'rgba(156, 163, 175, 0.6)'; // Gray for other buckets
        }),
        borderColor: resultsData.distribution.map((d, index) => {
          const bucketStart = index * 10;
          const bucketEnd = bucketStart + 9;
          const userScore = resultsData.userScore;
          
          if (userScore >= bucketStart && userScore <= bucketEnd) {
            return 'rgba(59, 130, 246, 1)';
          }
          return 'rgba(156, 163, 175, 1)';
        }),
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Distribution of Political Alignment Scores',
        font: {
          size: 16,
          weight: 'bold' as const,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Main Results */}
      <div className="bg-white rounded-lg shadow-lg p-8 mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Your Political Alignment Results
        </h1>
        
        <div className="mb-6">
          <div className={`text-6xl font-bold ${getScoreColor(resultsData.overlapPercentage)} mb-2`}>
            {resultsData.overlapPercentage}%
          </div>
          <p className="text-xl text-gray-600 mb-2">
            Alignment with Charlie Kirk&apos;s positions
          </p>
          <p className={`text-lg font-semibold ${getScoreColor(resultsData.overlapPercentage)}`}>
            {getScoreLabel(resultsData.overlapPercentage)}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-6 mt-8">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-800">{resultsData.totalResponses}</div>
            <div className="text-gray-600">Total Participants</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-800">{resultsData.averageScore}%</div>
            <div className="text-gray-600">Average Score</div>
          </div>
        </div>
      </div>

      {/* Distribution Chart */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
          Where You Stand
        </h2>
        <p className="text-gray-600 text-center mb-6">
          Your position compared to other participants (highlighted in blue)
        </p>
        <div className="w-full h-96">
          <Bar data={chartData} options={chartOptions} />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center space-x-4">
        <button
          onClick={() => window.location.href = '/'}
          className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium"
        >
          Take Quiz Again
        </button>
        <button
          onClick={() => {
            const url = `${window.location.origin}/results/${sessionId}`;
            navigator.clipboard.writeText(url);
            alert('Results link copied to clipboard!');
          }}
          className="px-8 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all duration-200 font-medium"
        >
          Share Results
        </button>
      </div>
    </div>
  );
}