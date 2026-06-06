import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import type { Finding } from '@/components/findings/FindingCard';

interface Blocker {
  type: string;
  message: string;
}

export function useFindings(engagementId: string) {
  const [findings, setFindings] = useState<Finding[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFindings = async () => {
    if (!engagementId) return;
    setLoading(true);
    setError(null);
    try {
      const result = await api.get<{ findings: Finding[]; total: number }>(
        `/engagements/${engagementId}/findings`
      );
      if (result.ok) {
        setFindings(result.data.findings);
        setTotal(result.data.total);
      } else {
        setError(result.error ?? 'Failed to load findings');
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load findings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFindings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [engagementId]);

  return { findings, total, loading, error, refresh: fetchFindings };
}

export function useP3Prerequisites(engagementId: string) {
  const [prerequisites, setPrerequisites] = useState<{
    all_pass: boolean;
    blockers: Blocker[];
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPrerequisites = async () => {
    if (!engagementId) return;
    setLoading(true);
    setError(null);
    try {
      const result = await api.get<{ all_pass: boolean; blockers: Blocker[] }>(
        `/engagements/${engagementId}/gate/p3/prerequisites`
      );
      if (result.ok) {
        setPrerequisites(result.data);
      } else {
        setError(result.error ?? 'Failed to load prerequisites');
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load prerequisites');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrerequisites();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [engagementId]);

  return { prerequisites, loading, error, refresh: fetchPrerequisites };
}
