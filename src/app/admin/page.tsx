'use client';

import { useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface AdminStats {
  totalParticipants: number;
  averageAlignment: number;
  medianAlignment: number;
  distribution: Record<string, number>;
  alignmentLevels: Record<string, number>;
  scoreRanges: Record<string, number>;
  statistics: {
    highest: number;
    lowest: number;
    standardDeviation: number;
  };
  questionAnalysis: Array<{
    questionId: number;
    averageResponse: number;
    mostCommonResponse: number;
    responseDistribution: Record<number, number>;
  }>;
  allScores: number[];
  timestamp: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [adminKey, setAdminKey] = useState('');
  const [authenticated, setAuthenticated] = useState(false);

  const fetchStats = async () => {
    if (!adminKey.trim()) {
      setError('Please enter admin key');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/admin/stats?key=${encodeURIComponent(adminKey)}`);
      
      if (!response.ok) {
        if (response.status === 401) {
          setError('Invalid admin key. Access denied.');
          setAuthenticated(false);
          return;
        }
        throw new Error('Failed to fetch statistics');
      }

      const data = await response.json();
      setStats(data);
      setAuthenticated(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      fetchStats();
    }
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
          <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            🔐 Admin Dashboard
          </h1>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Admin Key
            </label>
            <input
              type="password"
              value={adminKey}
              onChange={(e) => setAdminKey(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter admin key"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <button
            onClick={fetchStats}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Authenticating...' : 'Access Dashboard'}
          </button>

          <div className="mt-6 text-xs text-gray-500 text-center">
            <p>Admin access required to view participant statistics</p>
            <p className="mt-1">Default key: admin123 (change in production)</p>
          </div>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading statistics...</p>
        </div>
      </div>
    );
  }

  // Chart data for distribution
  const distributionData = {
    labels: stats.distribution ? Object.keys(stats.distribution) : [],
    datasets: [
      {
        label: 'Participants',
        data: stats.distribution ? Object.values(stats.distribution) : [],
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Pie chart for alignment levels
  const alignmentData = {
    labels: stats.alignmentLevels ? Object.keys(stats.alignmentLevels) : [],
    datasets: [
      {
        data: stats.alignmentLevels ? Object.values(stats.alignmentLevels) : [],
        backgroundColor: [
          '#dc2626', '#ef4444', '#f59e0b', '#3b82f6', '#10b981', '#059669'
        ],
        borderWidth: 2,
        borderColor: '#ffffff',
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">📊 Admin Dashboard</h1>
              <p className="text-gray-600 mt-2">Political Alignment Quiz Statistics</p>
            </div>
            <div className="text-right">
              <button
                onClick={fetchStats}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                🔄 Refresh Data
              </button>
              <p className="text-xs text-gray-500 mt-2">
                Last updated: {new Date(stats.timestamp).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-2xl font-bold text-blue-600">{stats.totalParticipants}</div>
            <div className="text-gray-600">Total Participants</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-2xl font-bold text-green-600">{stats.averageAlignment}%</div>
            <div className="text-gray-600">Average Alignment</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-2xl font-bold text-purple-600">{stats.medianAlignment}%</div>
            <div className="text-gray-600">Median Alignment</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-2xl font-bold text-orange-600">{stats.statistics.standardDeviation}</div>
            <div className="text-gray-600">Std Deviation</div>
          </div>
        </div>

        {/* Range Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">📈 Highest Score</h3>
            <div className="text-3xl font-bold text-green-600">{stats.statistics.highest}%</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">📉 Lowest Score</h3>
            <div className="text-3xl font-bold text-red-600">{stats.statistics.lowest}%</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">📊 Score Range</h3>
            <div className="text-xl font-bold text-gray-700">
              {stats.statistics.highest - stats.statistics.lowest} points
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Distribution Chart */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">📊 Score Distribution</h3>
            <div className="h-80">
              <Bar 
                data={distributionData} 
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { display: false },
                    title: { display: false },
                  },
                  scales: {
                    y: { beginAtZero: true },
                  },
                }}
              />
            </div>
          </div>

          {/* Alignment Levels Pie Chart */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">🎯 Alignment Levels</h3>
            <div className="h-80">
              <Pie 
                data={alignmentData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { 
                      position: 'right' as const,
                    },
                  },
                }}
              />
            </div>
          </div>
        </div>

        {/* Score Ranges Table */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">📈 Score Ranges Breakdown</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-4 font-semibold text-gray-700">Range</th>
                  <th className="text-right py-2 px-4 font-semibold text-gray-700">Participants</th>
                  <th className="text-right py-2 px-4 font-semibold text-gray-700">Percentage</th>
                </tr>
              </thead>
              <tbody>
                {stats.scoreRanges ? Object.entries(stats.scoreRanges).map(([range, count]) => (
                  <tr key={range} className="border-b hover:bg-gray-50">
                    <td className="py-2 px-4">{range}</td>
                    <td className="text-right py-2 px-4">{count}</td>
                    <td className="text-right py-2 px-4">
                      {stats.totalParticipants > 0 ? ((count / stats.totalParticipants) * 100).toFixed(1) : '0.0'}%
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={3} className="py-4 text-center text-gray-500">
                      No data available yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Scores */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">🕒 Recent Scores (Highest to Lowest)</h3>
          {stats.allScores && stats.allScores.length > 0 ? (
            <>
              <div className="grid grid-cols-5 md:grid-cols-10 lg:grid-cols-15 gap-2">
                {stats.allScores.slice(0, 50).map((score, index) => (
                  <div
                    key={index}
                    className={`
                      text-center py-2 px-1 rounded text-sm font-medium
                      ${score >= 75 ? 'bg-green-100 text-green-800' :
                        score >= 50 ? 'bg-blue-100 text-blue-800' :
                        score >= 25 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }
                    `}
                  >
                    {score}%
                  </div>
                ))}
              </div>
              {stats.allScores.length > 50 && (
                <p className="text-gray-500 text-sm mt-2">
                  Showing first 50 of {stats.allScores.length} total scores
                </p>
              )}
            </>
          ) : (
            <div className="text-center py-8">
              <div className="text-gray-400 text-4xl mb-2">📊</div>
              <p className="text-gray-600">No participant scores yet</p>
              <p className="text-gray-500 text-sm">Scores will appear here once people complete the quiz</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}