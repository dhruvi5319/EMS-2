import { useState, useEffect } from 'react';
import { api } from '@/lib/api';

export interface EvidenceItem {
  id: string;
  engagement_id: string;
  evidence_type: 'document' | 'dataset' | 'interview_note' | 'meeting_note' | 'other';
  source: string;
  date_received: string;
  custodian: string | null;
  description: string | null;
  sensitivity: 'standard' | 'restricted';
  created_by: string;
  created_at: string;
  updated_at: string;
  file_count: number;
  objective_count: number;
}

export interface CoverageObjective {
  id: string;
  objective_text: string;
  evidence_count: number;
  sufficiency_status: 'evidence_needed' | 'in_review' | 'sufficient';
}

export type EvidenceFilters = {
  evidence_type?: string;
  sensitivity?: string;
  search?: string;
};

export function useEvidence(engagementId: string, filters?: EvidenceFilters) {
  const [evidence, setEvidence] = useState<EvidenceItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvidence = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams(
        Object.entries(filters ?? {}).filter(([, v]) => v != null && v !== '') as [string, string][]
      ).toString();
      const result = await api.get<{ evidence: EvidenceItem[]; total: number }>(
        `/engagements/${engagementId}/evidence${params ? `?${params}` : ''}`
      );
      if (result.ok) {
        setEvidence(result.data.evidence);
        setTotal(result.data.total);
      } else {
        setError(result.error ?? 'Failed to load evidence');
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load evidence');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (engagementId) fetchEvidence();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [engagementId, JSON.stringify(filters)]);

  return { evidence, total, loading, error, refresh: fetchEvidence };
}

export function useEvidenceCoverage(engagementId: string) {
  const [coverage, setCoverage] = useState<{
    objectives: CoverageObjective[];
    covered: number;
    total: number;
    uncovered_count: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCoverage = () => {
    if (!engagementId) return;
    setLoading(true);
    api
      .get<{ objectives: CoverageObjective[]; covered: number; total: number; uncovered_count: number }>(
        `/engagements/${engagementId}/objectives/coverage`
      )
      .then((result) => {
        if (result.ok) {
          setCoverage(result.data);
        } else {
          setError(result.error ?? 'Failed to load coverage');
        }
      })
      .catch((e: unknown) => {
        setError(e instanceof Error ? e.message : 'Failed to load coverage');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCoverage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [engagementId]);

  return { coverage, loading, error, refresh: fetchCoverage };
}
