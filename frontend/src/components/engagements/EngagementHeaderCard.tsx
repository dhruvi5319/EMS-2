import { useState } from 'react';
import { useAuthContext } from '@/context/AuthContext';
import { EditMetadataForm } from './EditMetadataForm';
import type { Engagement } from '@/lib/engagements.api';

interface EngagementHeaderCardProps {
  engagement: Engagement;
  onUpdate: (e: Engagement) => void;
}

function PhaseBadge({ phase }: { phase: string }) {
  const phaseColors: Record<string, string> = {
    planning: 'bg-blue-100 text-blue-800',
    evidence: 'bg-purple-100 text-purple-800',
    draft: 'bg-yellow-100 text-yellow-800',
    readiness: 'bg-orange-100 text-orange-800',
    closed: 'bg-gray-100 text-gray-600',
  };
  const cls = phaseColors[phase?.toLowerCase()] ?? 'bg-gray-100 text-gray-600';
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${cls}`}>
      {phase ? phase.charAt(0).toUpperCase() + phase.slice(1) : '—'}
    </span>
  );
}

function StatusBadge({ status }: { status: string }) {
  const statusColors: Record<string, string> = {
    active: 'bg-green-100 text-green-800',
    on_hold: 'bg-yellow-100 text-yellow-800',
    closed: 'bg-gray-100 text-gray-600',
  };
  const cls = statusColors[status?.toLowerCase()] ?? 'bg-gray-100 text-gray-600';
  const label = status ? status.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase()) : '—';
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${cls}`}>{label}</span>
  );
}

function RiskBadge({ risk }: { risk: string | null }) {
  if (!risk) return null;
  const riskColors: Record<string, string> = {
    low: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-red-100 text-red-700',
  };
  const cls = riskColors[risk.toLowerCase()] ?? 'bg-gray-100 text-gray-600';
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${cls}`}>
      {risk.charAt(0).toUpperCase() + risk.slice(1)}
    </span>
  );
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function EngagementHeaderCard({ engagement, onUpdate }: EngagementHeaderCardProps) {
  const { user } = useAuthContext();
  const [editing, setEditing] = useState(false);

  const canEdit = user?.roles?.some(r => ['EM', 'AD'].includes(r)) ?? false;

  if (editing) {
    return (
      <div className="border border-slate-200 rounded-lg p-6 bg-white">
        <EditMetadataForm
          engagement={engagement}
          onSave={(updated) => {
            onUpdate(updated);
            setEditing(false);
          }}
          onDiscard={() => setEditing(false)}
        />
      </div>
    );
  }

  return (
    <div className="border border-slate-200 rounded-lg p-6 bg-white">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-sm font-semibold text-foreground">
              {engagement.job_code}
            </span>
          </div>
          <h2 className="text-xl font-semibold text-foreground mb-3">
            {engagement.title ?? 'Untitled Engagement'}
          </h2>
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <PhaseBadge phase={engagement.phase} />
            <StatusBadge status={engagement.status} />
            {engagement.risk_level && <RiskBadge risk={engagement.risk_level} />}
          </div>
          <div className="grid grid-cols-2 gap-x-8 gap-y-1 text-sm">
            {engagement.owner_id && (
              <div>
                <span className="text-muted-foreground">Owner: </span>
                <span>{engagement.owner_id}</span>
              </div>
            )}
            {engagement.portfolio && (
              <div>
                <span className="text-muted-foreground">Portfolio: </span>
                <span>{engagement.portfolio}</span>
              </div>
            )}
            <div>
              <span className="text-muted-foreground">Created: </span>
              <span>{formatDate(engagement.created_at)}</span>
            </div>
          </div>
        </div>
        {canEdit && (
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 text-sm border border-input bg-background rounded-md shadow-sm hover:bg-accent hover:text-accent-foreground transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            Edit Metadata
          </button>
        )}
      </div>
    </div>
  );
}
