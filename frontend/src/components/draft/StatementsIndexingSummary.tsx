import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '@/lib/api';

interface StatementSummary {
  total: number;
  linked: number;
  unlinked: number;
}

interface StatementsIndexingSummaryProps {
  engagementId: string;
  draftProductId: string;
}

export function StatementsIndexingSummary({
  engagementId,
  draftProductId: _draftProductId,
}: StatementsIndexingSummaryProps) {
  const navigate = useNavigate();
  const [summary, setSummary] = useState<StatementSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!engagementId) return;
    setLoading(true);
    api
      .get<{ statements: { id: string; evidence_count: number }[] }>(
        `/api/engagements/${engagementId}/statements`
      )
      .then((res) => {
        if (res.ok) {
          const statements = res.data.statements;
          const total = statements.length;
          const linked = statements.filter((s) => s.evidence_count > 0).length;
          const unlinked = total - linked;
          setSummary({ total, linked, unlinked });
        }
      })
      .catch(() => {/* non-blocking */})
      .finally(() => setLoading(false));
  }, [engagementId]);

  if (loading) {
    return (
      <div className="text-sm text-muted-foreground">Loading statements...</div>
    );
  }

  const total = summary?.total ?? 0;
  const linked = summary?.linked ?? 0;
  const unlinked = summary?.unlinked ?? 0;

  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="text-sm text-muted-foreground">
        {total} statement{total !== 1 ? 's' : ''}
        {total > 0 && (
          <>
            {' · '}
            {linked} linked to evidence
            {unlinked > 0 && (
              <span className="text-destructive font-medium">
                {' · '}
                {unlinked} unlinked 🔴
              </span>
            )}
          </>
        )}
      </span>
      <button
        type="button"
        onClick={() => navigate(`/engagements/${engagementId}/draft/statements`)}
        className="text-sm text-blue-600 hover:underline"
      >
        View Statements / Reference Check →
      </button>
    </div>
  );
}
