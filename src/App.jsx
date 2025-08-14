import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { store } from './store/store';
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import Dashboard from './components/dashboard/Dashboard';
import UpdateProfile from './components/profile/UpdateProfile';
import ProtectedRoute from './components/common/ProtectedRoute';
import { initializeAuth } from './store/slices/authSlice';
import { authService } from './services/authService';

const theme = createTheme({
  palette: {
    primary: {
      main: '#f4af3d',
    },
    secondary: {
      main: '#102aa8',
    },
    error: {
      main: '#ff5d3f',
    },
  },
  typography: {
    fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
  },
});

// Component to handle authentication initialization
const AuthInitializer = ({ children }) => {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  useEffect(() => {
    const initializeAuthState = async () => {
      const authToken = localStorage.getItem('authToken');

      if (authToken && !user) {
        try {
          // Fetch user details using the stored token
          const userRes = await authService.getUserDetails();
          const userData = userRes?.data?.user;

          if (userData) {
            dispatch(initializeAuth(userData));
          }
        } catch (error) {
          console.error('Failed to initialize auth state:', error);
          // If token is invalid, remove it
          localStorage.removeItem('authToken');
          dispatch(initializeAuth(null));
        }
      }
    };

    initializeAuthState();
  }, [dispatch, user]);

  return children;
};

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthInitializer>
          <Router>
            <div className="App">
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <UpdateProfile />
                    </ProtectedRoute>
                  }
                />
                <Route path="/" element={<Navigate to="/login" replace />} />
              </Routes>
            </div>
          </Router>
        </AuthInitializer>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
