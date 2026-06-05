import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';

export interface RequestRecord {
  id: string;
  request_number: number;
  request_id_display: string; // REQ-YYYY-NNNNN
  request_type: 'congressional' | 'mandate' | 'internal' | null;
  requester_name: string | null;
  requester_org: string | null;
  topic: string | null;
  agency_program: string | null;
  due_date: string | null; // ISO date string YYYY-MM-DD
  notes: string | null;
  status: 'draft' | 'submitted' | 'accepted' | 'declined';
  file_ref: string | null;
  filename: string | null;
  file_size: number | null;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface RequestFilters {
  status?: string;
  requester?: string;
  limit?: number;
  offset?: number;
}

export function useRequests(filters: RequestFilters = {}) {
  const [requests, setRequests] = useState<RequestRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (filters.status) params.set('status', filters.status);
      if (filters.requester) params.set('requester', filters.requester);
      if (filters.limit) params.set('limit', String(filters.limit));
      if (filters.offset) params.set('offset', String(filters.offset));
      const qs = params.toString();
      const res = await api.get<{ requests: RequestRecord[]; total: number }>(
        `/api/requests${qs ? `?${qs}` : ''}`
      );
      if (res.ok) {
        setRequests(res.data.requests);
        setTotal(res.data.total);
      } else {
        setError(res.error ?? 'Failed to load requests');
      }
    } catch {
      setError('Failed to load requests');
    } finally {
      setLoading(false);
    }
  }, [filters.status, filters.requester, filters.limit, filters.offset]);

  useEffect(() => { fetchRequests(); }, [fetchRequests]);

  return { requests, total, loading, error, refetch: fetchRequests };
}

export function useRequest(id: string | undefined) {
  const [request, setRequest] = useState<RequestRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    api.get<{ request: RequestRecord }>(`/api/requests/${id}`)
      .then((res) => {
        if (res.ok) setRequest(res.data.request);
        else setError(res.error ?? 'Request not found');
      })
      .catch(() => setError('Failed to load request'))
      .finally(() => setLoading(false));
  }, [id]);

  return { request, loading, error };
}

export async function createRequest(data: Partial<RequestRecord> & { request_type?: string }): Promise<RequestRecord> {
  const res = await api.post<{ request: RequestRecord }>('/api/requests', data);
  if (!res.ok) throw new Error(res.error ?? 'Failed to create request');
  return res.data.request;
}

export async function updateRequest(id: string, data: Partial<RequestRecord>): Promise<RequestRecord> {
  const res = await api.patch<{ request: RequestRecord }>(`/api/requests/${id}`, data);
  if (!res.ok) throw new Error(res.error ?? 'Failed to update request');
  return res.data.request;
}

export async function submitRequest(id: string): Promise<RequestRecord> {
  const res = await api.post<{ request: RequestRecord }>(`/api/requests/${id}/submit`, {});
  if (!res.ok) {
    const err = Object.assign(new Error(res.error ?? 'Failed to submit request'), {
      fields: (res as unknown as { data?: { fields?: string[] } }).data?.fields,
    });
    throw err;
  }
  return res.data.request;
}
