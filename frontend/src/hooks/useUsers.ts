import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';

export interface UserRecord {
  id: string;
  username: string;
  email: string;
  display_name: string;
  is_active: boolean;
  roles: string[];
}

export function useUsers() {
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    const res = await api.get<{ users: UserRecord[] }>('/api/users');
    if (res.ok) {
      setUsers(res.data.users);
    } else {
      setError(res.error);
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const createUser = useCallback(async (data: {
    username: string;
    email: string;
    display_name: string;
    password: string;
    roles: string[];
  }): Promise<void> => {
    const res = await api.post<{ user: UserRecord }>('/api/users', data);
    if (!res.ok) throw new Error(res.error);
    await fetchUsers();
  }, [fetchUsers]);

  const updateRoles = useCallback(async (id: string, roles: string[]): Promise<void> => {
    const res = await api.put<{ user: UserRecord }>(`/api/users/${id}/roles`, { roles });
    if (!res.ok) throw new Error(res.error);
    await fetchUsers();
  }, [fetchUsers]);

  const deactivate = useCallback(async (id: string): Promise<void> => {
    const res = await api.put<{ user: UserRecord }>(`/api/users/${id}/deactivate`, {});
    if (!res.ok) throw new Error(res.error);
    await fetchUsers();
  }, [fetchUsers]);

  const activate = useCallback(async (id: string): Promise<void> => {
    const res = await api.put<{ user: UserRecord }>(`/api/users/${id}/activate`, {});
    if (!res.ok) throw new Error(res.error);
    await fetchUsers();
  }, [fetchUsers]);

  return { users, loading, error, createUser, updateRoles, deactivate, activate, refresh: fetchUsers };
}
