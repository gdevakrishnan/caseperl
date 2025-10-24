import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AppRouter from './router/Router';
import AppContext from './context/AppContext';
import { getCurrentUser, refreshToken, isAuthenticated } from './serviceWorkers/authServices';

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  // ✅ Add message & error states
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // ✅ Automatically show Toasts when message/error changes
  useEffect(() => {
    if (message) {
      toast.success(message, {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      });
      setMessage(''); // reset after showing
    }
  }, [message]);

  useEffect(() => {
    if (error) {
      toast.error(error, {
        position: 'top-right',
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      });
      setError(''); // reset after showing
    }
  }, [error]);

  // ✅ Authentication logic (unchanged)
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        if (isAuthenticated()) {
          await fetchCurrentUser();
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        try {
          await refreshToken();
          await fetchCurrentUser();
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError);
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

  const fetchCurrentUser = async () => {
    try {
      const response = await getCurrentUser();
      setUser(response.data);
    } catch (error) {
      throw error;
    }
  };

  // Refresh token interval
  useEffect(() => {
    if (!user) return;

    const refreshInterval = setInterval(async () => {
      try {
        await refreshToken();
        console.log('Token refreshed successfully');
      } catch (error) {
        console.error('Failed to refresh token:', error);
        setUser(null);
        localStorage.removeItem('caseperl_access_token');
        localStorage.removeItem('caseperl_refresh_token');
      }
    }, 14 * 60 * 1000);

    return () => clearInterval(refreshInterval);
  }, [user]);

  // Refresh on activity
  useEffect(() => {
    if (!user) return;

    let lastActivity = Date.now();
    const ACTIVITY_THRESHOLD = 5 * 60 * 1000;
    const CHECK_INTERVAL = 1 * 60 * 1000;

    const handleActivity = () => {
      lastActivity = Date.now();
    };

    window.addEventListener('mousedown', handleActivity);
    window.addEventListener('keydown', handleActivity);
    window.addEventListener('scroll', handleActivity);
    window.addEventListener('touchstart', handleActivity);

    const activityCheckInterval = setInterval(async () => {
      const timeSinceLastActivity = Date.now() - lastActivity;
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

  // ✅ Add new state values to context
  const context = {
    user,
    setUser,
    loading,
    isAuthChecked,
    fetchCurrentUser,
    message,
    setMessage,
    error,
    setError,
  };

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
      <ToastContainer style={{ top: '70px' }}/>
    </AppContext.Provider>
  );
};

export default App;