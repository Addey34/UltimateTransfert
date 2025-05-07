import { IUser } from '@/types/app.types';
import React, { createContext, ReactNode, useEffect, useState } from 'react';
import AuthService from '../components/services/api/auth.service';

interface AuthContextType {
  user: IUser | null;
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = AuthService.getToken();
      if (token) {
        try {
          const user = await AuthService.handleCallback(token);
          setUser(user);
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Failed to authenticate user:', error);
          AuthService.logout();
        }
      }
      setIsLoading(false);
    };
    checkAuth();
  }, []);

  const login = async () => {
    try {
      await AuthService.login();
      const token = AuthService.getToken();
      if (token) {
        const user = await AuthService.handleCallback(token);
        setUser(user);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const logout = () => {
    AuthService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  const value = {
    user,
    isAuthenticated,
    login,
    logout,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
