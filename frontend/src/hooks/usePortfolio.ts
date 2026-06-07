import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';

export interface PortfolioEngagement {
  id: string;
  job_code: string;
  title: string | null;
  phase: string;
  status: string;
  risk_level: string | null;
  owner_id: string | null;
  owner_display_name?: string | null;
  has_blockers?: boolean;
  // Gate statuses
  gate_a1?: 'approved' | 'pending' | 'not_started';
  gate_p2?: 'approved' | 'pending' | 'not_started';
  gate_p3?: 'approved' | 'pending' | 'not_started';
  gate_p4?: 'approved' | 'pending' | 'not_started';
  // Next milestone
  next_milestone_label?: string | null;
  next_milestone_date?: string | null;
  next_milestone_status?: string | null;
  // Timestamps
  created_at: string;
  updated_at: string;
}

export interface PortfolioFilters {
  phase?: string[];
  risk?: string;
  owner_id?: string;
  status?: string;
  search?: string;
  due_before?: string;
}

export interface PortfolioSort {
  field: string;
  direction: 'asc' | 'desc';
}

export interface PhaseCounts {
  planning: number;
  evidence: number;
  draft: number;
  readiness: number;
}

export function usePortfolio() {
  const [engagements, setEngagements] = useState<PortfolioEngagement[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [phaseCounts, setPhaseCounts] = useState<PhaseCounts>({
    planning: 0,
    evidence: 0,
    draft: 0,
    readiness: 0,
  });
  const [filters, setFilters] = useState<PortfolioFilters>({});
  const [sort, setSort] = useState<PortfolioSort>({
    field: 'updated_at',
    direction: 'desc',
  });
  const [page, setPage] = useState(0);
  const PAGE_SIZE = 25;

  const buildQueryString = useCallback(
    (
      f: PortfolioFilters,
      s: PortfolioSort,
      p: number,
      extraPhase?: string
    ): string => {
      const query = new URLSearchParams();

      if (extraPhase) {
        query.set('phase', extraPhase);
      } else if (f.phase && f.phase.length > 0) {
        query.set('phase', f.phase.join(','));
      }

      if (f.risk) query.set('risk_level', f.risk);
      if (f.owner_id) query.set('owner_id', f.owner_id);
      if (f.status) query.set('status', f.status);
      if (f.search) query.set('search', f.search);
      if (f.due_before) query.set('due_before', f.due_before);

      query.set('sort_by', s.field);
      query.set('sort_dir', s.direction);
      query.set('limit', String(PAGE_SIZE));
      query.set('offset', String(p * PAGE_SIZE));

      return query.toString();
    },
    [PAGE_SIZE]
  );

  const fetchEngagements = useCallback(
    async (f: PortfolioFilters, s: PortfolioSort, p: number) => {
      setLoading(true);
      setError(null);
      try {
        const qs = buildQueryString(f, s, p);
        const result = await api.get<{
          engagements: PortfolioEngagement[];
          total: number;
        }>(`/api/engagements?${qs}`);

        if (result.ok) {
          setEngagements(result.data.engagements);
          setTotal(result.data.total);
        } else {
          setError(result.error ?? 'Failed to load engagements');
        }
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : 'Failed to load engagements');
      } finally {
        setLoading(false);
      }
    },
    [buildQueryString]
  );

  const fetchPhaseCounts = useCallback(async () => {
    const phases: Array<keyof PhaseCounts> = ['planning', 'evidence', 'draft', 'readiness'];
    const counts: PhaseCounts = { planning: 0, evidence: 0, draft: 0, readiness: 0 };

    try {
      // Fetch counts per phase using separate queries
      await Promise.all(
        phases.map(async (phase) => {
          const result = await api.get<{ engagements: PortfolioEngagement[]; total: number }>(
            `/api/engagements?phase=${phase}&limit=1&offset=0`
          );
          if (result.ok) {
            counts[phase] = result.data.total;
          }
        })
      );
      setPhaseCounts(counts);
    } catch {
      // non-critical — phase counts are best-effort
    }
  }, []);

  const exportCSV = useCallback(
    async (f: PortfolioFilters) => {
      const query = new URLSearchParams();
      if (f.phase && f.phase.length > 0) query.set('phase', f.phase.join(','));
      if (f.risk) query.set('risk_level', f.risk);
      if (f.owner_id) query.set('owner_id', f.owner_id);
      if (f.status) query.set('status', f.status);
      if (f.search) query.set('search', f.search);

      const qs = query.toString();
      const url = `/api/engagements/export${qs ? `?${qs}` : ''}`;

      // Fetch as blob for download
      const response = await fetch(url, { credentials: 'include' });
      if (!response.ok) {
        throw new Error('Export failed');
      }

      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = objectUrl;
      anchor.download = 'engagement-register.csv';
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      URL.revokeObjectURL(objectUrl);
    },
    []
  );

  const updateFilters = useCallback(
    (newFilters: PortfolioFilters) => {
      setFilters(newFilters);
      setPage(0);
      fetchEngagements(newFilters, sort, 0);
    },
    [sort, fetchEngagements]
  );

  const updateSort = useCallback(
    (newSort: PortfolioSort) => {
      setSort(newSort);
      fetchEngagements(filters, newSort, page);
    },
    [filters, page, fetchEngagements]
  );

  const updatePage = useCallback(
    (newPage: number) => {
      setPage(newPage);
      fetchEngagements(filters, sort, newPage);
    },
    [filters, sort, fetchEngagements]
  );

  // Initial load
  useEffect(() => {
    fetchEngagements({}, { field: 'updated_at', direction: 'desc' }, 0);
    fetchPhaseCounts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    engagements,
    total,
    loading,
    error,
    phaseCounts,
    filters,
    sort,
    page,
    pageSize: PAGE_SIZE,
    updateFilters,
    updateSort,
    updatePage,
    exportCSV,
    refresh: () => fetchEngagements(filters, sort, page),
  };
}
