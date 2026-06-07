import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Loader2, CheckCircle2, Clock } from 'lucide-react';
import { api } from '@/lib/api';

interface EngagementRow {
  id: string;
  job_code: string;
  title: string;
  phase: string;
  owner_name: string;
  gate_a1_status?: string | null;
  gate_p2_status?: string | null;
  gate_p3_status?: string | null;
  gate_p4_status?: string | null;
  updated_at: string;
}

function GateBadge({ status }: { status: string | null | undefined }) {
  if (status === 'approved') return <CheckCircle2 className="h-3.5 w-3.5 inline text-emerald-600" />;
  if (status === 'declined') return <span className="text-destructive text-xs">✗</span>;
  return <Clock className="h-3.5 w-3.5 inline text-muted-foreground" />;
}

export function ReportsOverviewPage() {
  const [rows, setRows] = useState<EngagementRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const list = await api.get<{ engagements: EngagementRow[] }>('/api/engagements');
      if (!list.ok) { setError(list.error); setLoading(false); return; }
      setRows(list.data.engagements);
      setLoading(false);
    })();
  }, []);

  if (loading) return (
    <div className="flex items-center gap-2 p-6 text-sm text-muted-foreground">
      <Loader2 className="h-4 w-4 animate-spin" /> Loading reports…
    </div>
  );
  if (error) return <div className="p-6 text-sm text-destructive">{error}</div>;

  const issued = rows.filter((r) => r.gate_p4_status === 'approved');
  const inDraft = rows.filter((r) => r.gate_p3_status === 'approved' && r.gate_p4_status !== 'approved');
  const earlier = rows.filter((r) => r.gate_p3_status !== 'approved' && r.gate_p4_status !== 'approved');

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Reports</h1>
        <p className="text-sm text-muted-foreground">Engagements grouped by reporting stage. Issued reports have passed all four gates.</p>
      </div>

      {([
        ['Issued (Gate P4 ✓)', issued],
        ['In Draft (Gate P3 ✓, P4 pending)', inDraft],
        ['Earlier stages', earlier],
      ] as const).map(([label, group]) => (
        <section key={label}>
          <h2 className="mb-2 text-sm font-medium text-muted-foreground">{label} <span className="text-xs">({group.length})</span></h2>
          <div className="rounded-lg border bg-card">
            <table className="w-full text-sm">
              <thead className="border-b text-xs text-muted-foreground">
                <tr className="text-left">
                  <th className="px-4 py-2">Job Code</th>
                  <th className="px-4 py-2">Engagement</th>
                  <th className="px-4 py-2">Phase</th>
                  <th className="px-4 py-2">A1</th>
                  <th className="px-4 py-2">P2</th>
                  <th className="px-4 py-2">P3</th>
                  <th className="px-4 py-2">P4</th>
                  <th className="px-4 py-2">Updated</th>
                  <th className="px-4 py-2"></th>
                </tr>
              </thead>
              <tbody>
                {group.length === 0 ? (
                  <tr><td colSpan={9} className="px-4 py-3 text-center text-xs text-muted-foreground">None</td></tr>
                ) : group.map((r) => (
                  <tr key={r.id} className="border-b last:border-b-0 hover:bg-muted/30">
                    <td className="px-4 py-2 font-mono text-xs">{r.job_code}</td>
                    <td className="px-4 py-2">{r.title}</td>
                    <td className="px-4 py-2 capitalize text-muted-foreground">{r.phase}</td>
                    <td className="px-4 py-2"><GateBadge status={r.gate_a1_status} /></td>
                    <td className="px-4 py-2"><GateBadge status={r.gate_p2_status} /></td>
                    <td className="px-4 py-2"><GateBadge status={r.gate_p3_status} /></td>
                    <td className="px-4 py-2"><GateBadge status={r.gate_p4_status} /></td>
                    <td className="px-4 py-2 text-xs text-muted-foreground">{new Date(r.updated_at).toLocaleDateString()}</td>
                    <td className="px-4 py-2 text-right">
                      <Link to={`/engagements/${r.id}`} className="text-primary hover:underline text-xs">Open →</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ))}
    </div>
  );
}

export default ReportsOverviewPage;
