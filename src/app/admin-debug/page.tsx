'use client';

import { useState } from 'react';

export default function AdminDebugPage() {
  const [debugInfo, setDebugInfo] = useState<Record<string, unknown> | null>(null);
  const [statsInfo, setStatsInfo] = useState<Record<string, unknown> | null>(null);
  const [adminTest, setAdminTest] = useState<{
    status: number;
    statusText: string;
    data: Record<string, unknown>;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  const testConnection = async () => {
    try {
      setLoading(true);
      
      // Test 1: Database connection
      console.log('Testing database connection...');
      const debugResponse = await fetch('/api/debug');
      const debugData = await debugResponse.json();
      setDebugInfo(debugData);
      
      // Test 2: Stats without auth
      console.log('Testing stats without auth...');
      const statsResponse = await fetch('/api/test-stats');
      const statsData = await statsResponse.json();
      setStatsInfo(statsData);
      
      // Test 3: Admin stats with auth
      console.log('Testing admin stats with auth...');
      const adminResponse = await fetch('/api/admin/stats?key=admin123');
      const adminData = await adminResponse.json();
      setAdminTest({
        status: adminResponse.status,
        statusText: adminResponse.statusText,
        data: adminData
      });
      
    } catch (error) {
      console.error('Debug test failed:', error);
      setDebugInfo({ error: error instanceof Error ? error.message : 'Unknown error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">🔧 Admin Debug Page</h1>
        
        <button
          onClick={testConnection}
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 mb-8"
        >
          {loading ? 'Testing...' : '🔍 Run All Tests'}
        </button>

        {/* Database Connection Test */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">1. Database Connection Test</h2>
          {debugInfo ? (
            <div className="bg-gray-100 p-4 rounded overflow-auto">
              <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
            </div>
          ) : (
            <p className="text-gray-500">Click &quot;Run All Tests&quot; to check database connection</p>
          )}
        </div>

        {/* Stats Test */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">2. Stats Function Test (No Auth)</h2>
          {statsInfo ? (
            <div className="bg-gray-100 p-4 rounded overflow-auto">
              <pre>{JSON.stringify(statsInfo, null, 2)}</pre>
            </div>
          ) : (
            <p className="text-gray-500">Click &quot;Run All Tests&quot; to check stats functionality</p>
          )}
        </div>

        {/* Admin API Test */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">3. Admin API Test (With Auth)</h2>
          {adminTest ? (
            <div className="bg-gray-100 p-4 rounded overflow-auto">
              <div className="mb-2">
                <strong>Status:</strong> {adminTest?.status} {adminTest?.statusText}
              </div>
              <pre>{JSON.stringify(adminTest?.data, null, 2)}</pre>
            </div>
          ) : (
            <p className="text-gray-500">Click &quot;Run All Tests&quot; to check admin API</p>
          )}
        </div>

        {/* Manual Tests */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">📋 Manual Test URLs</h2>
          <div className="space-y-2">
            <div>
              <strong>Debug Endpoint:</strong>{' '}
              <a 
                href="/api/debug" 
                target="_blank" 
                className="text-blue-600 hover:underline"
              >
                /api/debug
              </a>
            </div>
            <div>
              <strong>Test Stats:</strong>{' '}
              <a 
                href="/api/test-stats" 
                target="_blank" 
                className="text-blue-600 hover:underline"
              >
                /api/test-stats
              </a>
            </div>
            <div>
              <strong>Admin Stats:</strong>{' '}
              <a 
                href="/api/admin/stats?key=admin123" 
                target="_blank" 
                className="text-blue-600 hover:underline"
              >
                /api/admin/stats?key=admin123
              </a>
            </div>
            <div>
              <strong>Regular Admin Page:</strong>{' '}
              <a 
                href="/admin" 
                target="_blank" 
                className="text-blue-600 hover:underline"
              >
                /admin
              </a>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mt-6">
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">🔍 What to look for:</h3>
          <ul className="text-yellow-700 space-y-1">
            <li>• <strong>Test 1:</strong> Should show &quot;success: true&quot; and database version</li>
            <li>• <strong>Test 2:</strong> Should show demo data seeded and scores</li>
            <li>• <strong>Test 3:</strong> Should show full admin statistics</li>
            <li>• <strong>Status 401:</strong> Authentication issue</li>
            <li>• <strong>Status 500:</strong> Database connection issue</li>
            <li>• <strong>Network Error:</strong> API route not found</li>
          </ul>
        </div>
      </div>
    </div>
  );
}