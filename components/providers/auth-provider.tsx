'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import type { User } from '@/lib/types';
import { authService } from '@/services/auth.service';

interface AuthContextValue {
  currentUser: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = React.createContext<AuthContextValue | undefined>(undefined);

const STORAGE_KEY = 'estatehub_mock_session';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = React.useState<User | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const router = useRouter();

  React.useEffect(() => {
    const stored = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
    if (stored === 'true') {
      authService
        .getCurrentUser()
        .then((user) => setCurrentUser(user))
        .catch(() => localStorage.removeItem(STORAGE_KEY))
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = React.useCallback(async (email: string, password: string) => {
    const user = await authService.login(email, password);
    setCurrentUser(user);
    localStorage.setItem(STORAGE_KEY, 'true');
  }, []);

  const logout = React.useCallback(async () => {
    await authService.logout();
    setCurrentUser(null);
    localStorage.removeItem(STORAGE_KEY);
    router.push('/login');
  }, [router]);

  const refreshUser = React.useCallback(async () => {
    const user = await authService.getCurrentUser();
    setCurrentUser(user);
  }, []);

  const value = React.useMemo(
    () => ({
      currentUser,
      isAuthenticated: !!currentUser,
      isLoading,
      login,
      logout,
      refreshUser,
    }),
    [currentUser, isLoading, login, logout, refreshUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = React.useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
