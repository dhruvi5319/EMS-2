import { useState, useEffect, useRef } from 'react';
import { api } from '@/lib/api';

export interface SearchResult {
  id: string;
  job_code: string;
  title: string;
  phase: string;
  owner_name: string;
  requester_name: string;
  status: string;
}

export function useSearch(query: string): {
  results: SearchResult[];
  loading: boolean;
  error: string | null;
} {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Clear previous timer + abort
    if (timerRef.current) clearTimeout(timerRef.current);
    if (abortRef.current) abortRef.current.abort();

    if (query.length < 2) {
      setResults([]);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    // 300ms debounce from UI-SPEC
    timerRef.current = setTimeout(async () => {
      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const res = await api.get<{ results: SearchResult[] }>(
          `/api/search?q=${encodeURIComponent(query)}&limit=10`
        );
        if (controller.signal.aborted) return;
        if (res.ok) {
          setResults(res.data.results);
        } else {
          setError(res.error);
          setResults([]);
        }
      } catch (e) {
        if (!controller.signal.aborted) {
          setError('Search failed');
          setResults([]);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }, 300);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (abortRef.current) abortRef.current.abort();
    };
  }, [query]);

  return { results, loading, error };
}
