'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// Create the AuthContext
const AuthContext = createContext<any>(null);
const serverUrl = process.env.NEXT_PUBLIC_API_URL;

// Provide the AuthContext to the rest of the app
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        await axios.get(`${serverUrl}/auth/profile`, {
          withCredentials: true,
        });
        setLoggedIn(true);
      } catch (err) {
        setLoggedIn(false);
      }
    };
    checkLoginStatus();
  }, []);

  const handleLogout = async () => {
    await axios.post(`${serverUrl}/auth/logout`, {}, { withCredentials: true });
    setLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ loggedIn, setLoggedIn, handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};
