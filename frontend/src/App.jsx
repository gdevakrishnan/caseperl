import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppRouter from './router/Router';
import AppContext from './context/AppContext';
import { getCurrentUser, refreshToken, isAuthenticated } from './serviceWorkers/authServices';

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  // Check if user is already logged in on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        if (isAuthenticated()) {
          // Try to get current user with existing token
          await fetchCurrentUser();
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        // If fetching user fails, try to refresh token
        try {
          await refreshToken();
          await fetchCurrentUser();
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError);
          // Clear invalid tokens
          localStorage.removeItem('caseperl_access_token');
          localStorage.removeItem('caseperl_refresh_token');
          setUser(null);
        }
      } finally {
        setLoading(false);
        setIsAuthChecked(true);
      }
    };

    initializeAuth();
  }, []);

  // Fetch current user data
  const fetchCurrentUser = async () => {
    try {
      const response = await getCurrentUser();
      setUser(response.data);
    } catch (error) {
      throw error;
    }
  };

  // Setup token refresh interval
  useEffect(() => {
    if (!user) return;

    // Refresh token every 14 minutes (access tokens typically expire in 15 minutes)
    const refreshInterval = setInterval(async () => {
      try {
        await refreshToken();
        console.log('Token refreshed successfully');
      } catch (error) {
        console.error('Failed to refresh token:', error);
        // If refresh fails, log out user
        setUser(null);
        localStorage.removeItem('caseperl_access_token');
        localStorage.removeItem('caseperl_refresh_token');
      }
    }, 14 * 60 * 1000); // 14 minutes

    return () => clearInterval(refreshInterval);
  }, [user]);

  // Setup activity listener to refresh token on user activity
  useEffect(() => {
    if (!user) return;

    let lastActivity = Date.now();
    const ACTIVITY_THRESHOLD = 5 * 60 * 1000; // 5 minutes
    const CHECK_INTERVAL = 1 * 60 * 1000; // Check every 1 minute

    const handleActivity = () => {
      lastActivity = Date.now();
    };

    // Listen for user activity
    window.addEventListener('mousedown', handleActivity);
    window.addEventListener('keydown', handleActivity);
    window.addEventListener('scroll', handleActivity);
    window.addEventListener('touchstart', handleActivity);

    // Check if token needs refresh based on activity
    const activityCheckInterval = setInterval(async () => {
      const timeSinceLastActivity = Date.now() - lastActivity;
      
      // If user has been active in the last 5 minutes, refresh token
      if (timeSinceLastActivity < ACTIVITY_THRESHOLD) {
        try {
          await refreshToken();
          console.log('Token refreshed due to user activity');
        } catch (error) {
          console.error('Activity-based token refresh failed:', error);
        }
      }
    }, CHECK_INTERVAL);

    return () => {
      window.removeEventListener('mousedown', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      window.removeEventListener('scroll', handleActivity);
      window.removeEventListener('touchstart', handleActivity);
      clearInterval(activityCheckInterval);
    };
  }, [user]);

  const context = {
    user,
    setUser,
    loading,
    isAuthChecked,
    fetchCurrentUser,
  };

  // Show loading screen while checking authentication
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
          <p className="mt-4 text-lg text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <AppContext.Provider value={context}>
      <AppRouter />
    </AppContext.Provider>
  );
};

export default App;