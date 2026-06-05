import React, { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../lib/api';

export type AuthUser = {
  id: string;
  username: string;
  email: string;
  display_name: string;
  roles: string[];
};

type AuthContextValue = {
  user: AuthUser | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Restore session on mount
  useEffect(() => {
    api.get<{ user: AuthUser }>('/api/auth/me').then((res) => {
      if (res.ok) setUser(res.data.user);
    }).finally(() => setLoading(false));
  }, []);

  const login = async (username: string, password: string): Promise<void> => {
    const res = await api.post<{ user: AuthUser }>('/api/auth/login', { username, password });
    if (!res.ok) {
      throw Object.assign(new Error(res.error), { status: res.status });
    }
    setUser(res.data.user);
  };

  const logout = async (): Promise<void> => {
    await api.post('/api/auth/logout', {});
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuthContext must be used within AuthProvider');
  return ctx;
}
