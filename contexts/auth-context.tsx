"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthUser } from '@/types/auth';

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: () => void;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch session from API
  const fetchSession = async () => {
    try {
      const response = await fetch('/api/auth/session');
      const data = await response.json();
      
      if (data.session?.user) {
        setUser(data.session.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Failed to fetch session:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Load session on mount
  useEffect(() => {
    fetchSession();
  }, []);

  // Login: redirect to GitHub OAuth
  const login = () => {
    window.location.href = '/api/auth/github';
  };

  // Logout: clear session
  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
      // Clear token cache
      if (typeof window !== 'undefined') {
        // Clear any cached tokens
        const { clearTokenCache } = await import('@/lib/github-api');
        clearTokenCache();
      }
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  // Refresh session
  const refreshSession = async () => {
    await fetchSession();
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    logout,
    refreshSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

