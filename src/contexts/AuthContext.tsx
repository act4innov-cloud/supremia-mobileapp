// ============================================================
// SUPREMIA Platform - Authentication Context
// ============================================================

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User } from 'firebase/auth';
import {
  onAuthChange,
  signInWithEmail,
  signUpWithEmail,
  signInWithGoogle,
  signOut as authSignOut,
  resetPassword,
  getUserProfile,
} from '@/services/auth';
import { UserProfile } from '@/types/user.types';

interface AuthState {
  user: User | null;
  profile: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

interface AuthContextValue extends AuthState {
  loginWithEmail: (email: string, password: string) => Promise<void>;
  registerWithEmail: (email: string, password: string, displayName: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  clearError: () => void;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    profile: null,
    isLoading: true,
    isAuthenticated: false,
    error: null,
  });

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthChange(async (user) => {
      if (user) {
        const profile = await getUserProfile(user.uid);
        setState({
          user,
          profile,
          isLoading: false,
          isAuthenticated: true,
          error: null,
        });
      } else {
        setState({
          user: null,
          profile: null,
          isLoading: false,
          isAuthenticated: false,
          error: null,
        });
      }
    });

    return unsubscribe;
  }, []);

  const loginWithEmail = useCallback(async (email: string, password: string) => {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));
      await signInWithEmail(email, password);
    } catch (error: any) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Erreur de connexion',
      }));
      throw error;
    }
  }, []);

  const registerWithEmail = useCallback(
    async (email: string, password: string, displayName: string) => {
      try {
        setState((prev) => ({ ...prev, isLoading: true, error: null }));
        await signUpWithEmail(email, password, displayName);
      } catch (error: any) {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: error.message || "Erreur d'inscription",
        }));
        throw error;
      }
    },
    [],
  );

  const loginWithGoogle = useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));
      await signInWithGoogle();
    } catch (error: any) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Erreur de connexion Google',
      }));
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authSignOut();
    } catch (error: any) {
      setState((prev) => ({ ...prev, error: error.message }));
    }
  }, []);

  const forgotPassword = useCallback(async (email: string) => {
    try {
      await resetPassword(email);
    } catch (error: any) {
      setState((prev) => ({ ...prev, error: error.message }));
      throw error;
    }
  }, []);

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  const refreshProfile = useCallback(async () => {
    if (state.user) {
      const profile = await getUserProfile(state.user.uid);
      setState((prev) => ({ ...prev, profile }));
    }
  }, [state.user]);

  const value: AuthContextValue = {
    ...state,
    loginWithEmail,
    registerWithEmail,
    loginWithGoogle,
    logout,
    forgotPassword,
    clearError,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;