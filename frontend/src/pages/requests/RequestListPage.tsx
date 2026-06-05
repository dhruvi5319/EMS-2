import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, SearchX, Plus } from 'lucide-react';
import { useRequests } from '@/hooks/useRequests';
import { RequestStatusBadge } from '@/components/requests/RequestStatusBadge';
import { useAuthContext } from '@/context/AuthContext';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';

const STATUS_TABS = [
  { value: '', label: 'All' },
  { value: 'draft', label: 'Draft' },
  { value: 'submitted', label: 'Submitted' },
  { value: 'accepted', label: 'Accepted' },
  { value: 'declined', label: 'Declined' },
];

type SortKey = 'request_id_display' | 'request_type' | 'topic' | 'requester_name' | 'due_date' | 'status';
type SortDir = 'asc' | 'desc';

export function RequestListPage() {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const [activeTab, setActiveTab] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('request_id_display');
  const [sortDir, setSortDir] = useState<SortDir>('desc');

  const { requests, loading } = useRequests({ status: activeTab || undefined });

  const canCreate = user?.roles?.some((r: string) => ['AL', 'AD'].includes(r)) ?? false;

  function handleSort(key: SortKey) {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  }

  const sorted = [...requests].sort((a, b) => {
    const av = a[sortKey] ?? '';
    const bv = b[sortKey] ?? '';
    const cmp = String(av).localeCompare(String(bv));
    return sortDir === 'asc' ? cmp : -cmp;
  });

  const isPastDue = (dueDate: string | null, status: string) => {
    if (!dueDate || !['draft', 'submitted'].includes(status)) return false;
    return new Date(dueDate) < new Date();
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
  };

  const REQUEST_TYPE_LABELS: Record<string, string> = {
    congressional: 'Congressional Request',
    mandate: 'Mandate',
    internal: 'Internal Proposal',
  };

  function SortIcon({ col }: { col: SortKey }) {
    if (sortKey !== col) return <span className="ml-1 text-muted-foreground opacity-40">↕</span>;
    return <span className="ml-1 text-foreground">{sortDir === 'asc' ? '↑' : '↓'}</span>;
  }

  const th = (label: string, col: SortKey) => (
    <th
      key={col}
      className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wide cursor-pointer hover:text-foreground select-none"
      onClick={() => handleSort(col)}
      aria-sort={sortKey === col ? (sortDir === 'asc' ? 'ascending' : 'descending') : 'none'}
    >
      {label}<SortIcon col={col} />
    </th>
  );

  return (
    <div className="px-6 py-6 max-w-screen-xl mx-auto">
      {/* Page header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-xs text-muted-foreground mb-1">Requests</p>
          <h1 className="text-xl font-semibold text-foreground">Requests</h1>
        </div>
        {canCreate && (
          <Button
            onClick={() => navigate('/requests/new')}
            className="flex items-center gap-1.5"
          >
            <Plus size={16} />
            + New Request
          </Button>
        )}
      </div>

      {/* Status filter tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-4">
        <TabsList>
          {STATUS_TABS.map(t => (
            <TabsTrigger key={t.value} value={t.value}>{t.label}</TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* Table */}
      <div className="border border-border rounded-lg overflow-hidden bg-white">
        <table className="w-full text-sm" aria-label="Requests table">
          <thead className="bg-secondary border-b border-border">
            <tr>
              {th('ID', 'request_id_display')}
              {th('Request Type', 'request_type')}
              {th('Topic', 'topic')}
              {th('Requester', 'requester_name')}
              {th('Due Date', 'due_date')}
              {th('Status', 'status')}
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wide">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && [0,1,2,3,4].map(i => (
              <tr key={i} className="border-b border-border last:border-0" style={{ height: 48 }}>
                {[0,1,2,3,4,5,6].map(j => (
                  <td key={j} className="px-4 py-3"><Skeleton className="h-4 w-full" /></td>
                ))}
              </tr>
            ))}

            {!loading && sorted.length === 0 && (
              <tr>
                <td colSpan={7} className="py-16 text-center">
                  {activeTab ? (
                    <div className="flex flex-col items-center gap-2">
                      <SearchX size={32} className="text-muted-foreground" aria-hidden="true" />
                      <p className="text-xl font-semibold">No {activeTab} requests.</p>
                      <p className="text-sm text-muted-foreground">Try a different status filter.</p>
                      <Button variant="ghost" size="sm" onClick={() => setActiveTab('')}>Clear filter</Button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <FileText size={32} className="text-muted-foreground" aria-hidden="true" />
                      <p className="text-xl font-semibold">No requests yet.</p>
                      <p className="text-sm text-muted-foreground">Create the first request to begin the engagement workflow.</p>
                      {canCreate && (
                        <Button size="sm" onClick={() => navigate('/requests/new')}>+ New Request</Button>
                      )}
                    </div>
                  )}
                </td>
              </tr>
            )}

            {!loading && sorted.map(r => (
              <tr
                key={r.id}
                className="border-b border-border last:border-0 hover:bg-secondary cursor-pointer"
                style={{ height: 48 }}
                onClick={() => navigate(`/requests/${r.id}`)}
              >
                <td className="px-4 py-3 font-mono text-xs">{r.request_id_display}</td>
                <td className="px-4 py-3 text-muted-foreground">{r.request_type ? REQUEST_TYPE_LABELS[r.request_type] : '—'}</td>
                <td className="px-4 py-3 max-w-xs truncate" title={r.topic ?? undefined}>
                  {r.topic ? (r.topic.length > 60 ? r.topic.slice(0, 60) + '…' : r.topic) : <span className="text-muted-foreground">—</span>}
                </td>
                <td className="px-4 py-3">{r.requester_name ?? <span className="text-muted-foreground">—</span>}</td>
                <td className={`px-4 py-3 ${isPastDue(r.due_date, r.status) ? 'text-red-600 font-medium' : ''}`}>
                  {formatDate(r.due_date)}
                </td>
                <td className="px-4 py-3"><RequestStatusBadge status={r.status} /></td>
                <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                  {r.status === 'draft' && canCreate && (
                    <Button variant="ghost" size="sm" onClick={() => navigate(`/requests/${r.id}/edit`)}>Edit</Button>
                  )}
                  {r.status === 'submitted' && canCreate && (
                    <Button variant="ghost" size="sm" onClick={() => navigate(`/requests/${r.id}`)}>Review</Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
