import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { api } from '@/lib/api';

interface EngagementRow {
  id: string;
  job_code: string;
  title: string;
  phase: string;
  owner_name: string;
  evidence_count?: number;
}

export function EvidenceOverviewPage() {
  const [rows, setRows] = useState<EngagementRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const list = await api.get<{ engagements: EngagementRow[]; total: number }>('/api/engagements');
      if (!list.ok) { setError(list.error); setLoading(false); return; }
      const withCounts = await Promise.all(
        list.data.engagements.map(async (e) => {
          const ev = await api.get<{ evidence: unknown[]; total: number }>(`/api/engagements/${e.id}/evidence`);
          return { ...e, evidence_count: ev.ok ? ev.data.total : 0 };
        })
      );
      setRows(withCounts);
      setLoading(false);
    })();
  }, []);

  if (loading) return (
    <div className="flex items-center gap-2 p-6 text-sm text-muted-foreground">
      <Loader2 className="h-4 w-4 animate-spin" /> Loading evidence…
    </div>
  );
  if (error) return <div className="p-6 text-sm text-destructive">{error}</div>;

  return (
    <div className="p-6 space-y-4">
      <div>
        <h1 className="text-xl font-semibold">Evidence</h1>
        <p className="text-sm text-muted-foreground">Evidence collected across all engagements. Click into an engagement to view its evidence table.</p>
      </div>
      <div className="rounded-lg border bg-card">
        <table className="w-full text-sm">
          <thead className="border-b text-xs text-muted-foreground">
            <tr className="text-left">
              <th className="px-4 py-2">Job Code</th>
              <th className="px-4 py-2">Engagement</th>
              <th className="px-4 py-2">Phase</th>
              <th className="px-4 py-2">Owner</th>
              <th className="px-4 py-2 text-right">Evidence Items</th>
              <th className="px-4 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-6 text-center text-muted-foreground">No engagements found.</td></tr>
            ) : rows.map((r) => (
              <tr key={r.id} className="border-b last:border-b-0 hover:bg-muted/30">
                <td className="px-4 py-2 font-mono text-xs">{r.job_code}</td>
                <td className="px-4 py-2">{r.title}</td>
                <td className="px-4 py-2 capitalize text-muted-foreground">{r.phase}</td>
                <td className="px-4 py-2 text-muted-foreground">{r.owner_name}</td>
                <td className="px-4 py-2 text-right font-medium">{r.evidence_count ?? 0}</td>
                <td className="px-4 py-2 text-right">
                  <Link to={`/engagements/${r.id}`} className="text-primary hover:underline text-xs">Open →</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default EvidenceOverviewPage;
