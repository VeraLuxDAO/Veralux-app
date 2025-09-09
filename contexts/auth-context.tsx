"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { AuthState, AuthUser, authService } from "@/lib/auth-service";

interface AuthContextType extends AuthState {
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  initializeAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>(authService.getState());

  useEffect(() => {
    // Subscribe to auth state changes
    const unsubscribe = authService.subscribe(setAuthState);

    // Load stored user on mount
    authService.loadStoredUser();

    // Initialize Google Auth
    authService.initializeGoogleAuth();

    return unsubscribe;
  }, []);

  const signInWithGoogle = async () => {
    await authService.signInWithGoogle();
  };

  const signOut = async () => {
    await authService.signOut();
  };

  const initializeAuth = async () => {
    await authService.initializeGoogleAuth();
  };

  const value: AuthContextType = {
    ...authState,
    signInWithGoogle,
    signOut,
    initializeAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
