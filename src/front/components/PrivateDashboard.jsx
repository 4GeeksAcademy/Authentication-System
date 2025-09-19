import React, { useState, useEffect } from 'react';
import { useAuth, apiRequest } from 'src/front/app.jsx'; 
import { AlertCircle, Lock, User, Mail, LogOut, Shield } from 'lucide-react';

const Private = () => {
  const { user, logout, token } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const data = await apiRequest('/private', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        setDashboardData(data);
      } catch (err) {
        setError(err.message);
        if (err.message.includes('Token') || err.message.includes('expired')) {
          logout();
        }
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchDashboardData();
    }
  }, [token, logout]);

  const handleLogout = async () => {
    try {
      await apiRequest('/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      logout();
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto mt-8 p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto mt-8 p-6">
        <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-4 rounded-md">
          <AlertCircle className="h-5 w-5" />
          <span>{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-8 p-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Private Dashboard</h1>
            <p className="text-gray-600 mt-2">Welcome back, {user?.email}!</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* User Info Card */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">User Information</h2>
          <div className="space-y-3">
            <div>
              <span className="text-gray-600 font-medium">Email:</span>
              <span className="ml-2 text-gray-900">{user?.email}</span>
            </div>
            <div>
              <span className="text-gray-600 font-medium">User ID:</span>
              <span className="ml-2 text-gray-900">{user?.id}</span>
            </div>
            <div>
              <span className="text-gray-600 font-medium">Member Since:</span>
              <span className="ml-2 text-gray-900">
                {new Date(user?.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Dashboard Stats</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Authentication Status:</span>
              <span className="text-green-600 font-medium">✓ Authenticated</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Session Status:</span>
              <span className="text-green-600 font-medium">✓ Active</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Access Level:</span>
              <span className="text-blue-600 font-medium">Private</span>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      {dashboardData && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Private Content</h2>
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
            <p className="text-blue-800">{dashboardData.data.dashboard_info}</p>
          </div>
          
          <div className="mt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-3">Recent Activity</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded-md">
                <span className="text-gray-700">Last Login</span>
                <span className="text-gray-600 text-sm">
                  {new Date(dashboardData.data.user_stats.last_login).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded-md">
                <span className="text-gray-700">Dashboard Access</span>
                <span className="text-green-600 text-sm">✓ Granted</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default Private;