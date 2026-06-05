import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';

export interface AuditEvent {
  id: string;
  engagement_id: string;
  actor_id: string;
  actor_name: string;
  actor_roles: string[];
  action: string;
  entity_type: string | null;
  entity_id: string | null;
  summary: string;
  metadata: Record<string, unknown> | null;
  created_at: string;
}

export interface AuditFilters {
  action_type?: string;
  date_from?: string;
  date_to?: string;
}

const PAGE_SIZE = 20;

export function useAuditTrail(engagementId: string, filters: AuditFilters = {}) {
  const [events, setEvents] = useState<AuditEvent[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(false);

  const fetchEvents = useCallback(async (currentOffset: number, append = false) => {
    setLoading(true);
    const params = new URLSearchParams({
      limit: String(PAGE_SIZE),
      offset: String(currentOffset),
    });
    if (filters.action_type) params.set('action_type', filters.action_type);
    if (filters.date_from) params.set('date_from', filters.date_from);
    if (filters.date_to) params.set('date_to', filters.date_to);

    const res = await api.get<{ events: AuditEvent[]; total: number }>(
      `/api/engagements/${engagementId}/audit?${params.toString()}`
    );

    if (res.ok) {
      setEvents((prev) => append ? [...prev, ...res.data.events] : res.data.events);
      setTotal(res.data.total);
      setHasMore(currentOffset + PAGE_SIZE < res.data.total);
    }
    setLoading(false);
  }, [engagementId, filters.action_type, filters.date_from, filters.date_to]);

  // Reset on filter change
  useEffect(() => {
    setOffset(0);
    setEvents([]);
    fetchEvents(0, false);
  }, [fetchEvents]);

  const loadMore = useCallback(() => {
    const nextOffset = offset + PAGE_SIZE;
    setOffset(nextOffset);
    fetchEvents(nextOffset, true);
  }, [offset, fetchEvents]);

  return { events, total, loading, loadMore, hasMore };
}
