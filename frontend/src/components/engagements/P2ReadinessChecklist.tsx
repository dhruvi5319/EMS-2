import * as React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import { checkP2Prerequisites, type PrerequisiteItem } from '@/lib/planning.api';

interface P2ReadinessChecklistProps {
  engagementId: string;
  mode: 'em' | 'qa';
  onAllPass?: (allPass: boolean) => void;
  refreshTrigger?: number;
}

export function P2ReadinessChecklist({
  engagementId,
  mode,
  onAllPass,
  refreshTrigger,
}: P2ReadinessChecklistProps) {
  const [prerequisites, setPrerequisites] = React.useState<PrerequisiteItem[]>([]);
  const [allPass, setAllPass] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const result = await checkP2Prerequisites(engagementId);
        if (!cancelled) {
          setPrerequisites(result.prerequisites);
          setAllPass(result.all_pass);
          onAllPass?.(result.all_pass);
        }
      } catch (err) {
        if (!cancelled) {
          const msg = err instanceof Error ? err.message : 'Failed to load checklist.';
          setError(msg);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [engagementId, refreshTrigger]);

  if (loading) {
    return (
      <div className="sticky top-0 z-10 bg-white border-b border-slate-200 py-2 px-4">
        <div className="space-y-1">
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <div key={i} className="h-6 bg-slate-100 rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="sticky top-0 z-10 bg-white border-b border-slate-200 py-2 px-4">
        <p className="text-xs text-red-600">Failed to load P2 checklist: {error}</p>
      </div>
    );
  }

  return (
    <div className="sticky top-0 z-10 bg-white border-b border-slate-200 py-2 px-4">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500 mb-2">
        P2 READINESS CHECKLIST
      </p>
      <ul role="list" className="space-y-0.5">
        {prerequisites.map((item) => (
          <li
            key={item.key}
            role="listitem"
            aria-label={`Checklist item: ${item.label} — ${item.pass ? 'pass' : 'fail'}`}
            className="flex items-center gap-2 h-6"
          >
            {item.pass ? (
              <CheckCircle className="h-4 w-4 text-green-600 shrink-0" aria-hidden="true" />
            ) : (
              <XCircle className="h-4 w-4 text-red-600 shrink-0" aria-hidden="true" />
            )}
            <span className="text-sm text-slate-700">{item.label}</span>
            {item.detail && !item.pass && (
              <span className="text-xs text-muted-foreground ml-1">— {item.detail}</span>
            )}
          </li>
        ))}
      </ul>
      {allPass ? (
        <div className="mt-2 rounded-md bg-green-100 text-green-800 px-3 py-1.5 text-sm">
          {mode === 'em'
            ? '✅ Ready to submit for P2 review.'
            : '✅ All items pass. You may approve this planning baseline.'}
        </div>
      ) : (
        <div className="mt-2 rounded-md bg-red-50 text-red-700 px-3 py-1.5 text-sm">
          {mode === 'em'
            ? 'Resolve all items before submitting.'
            : 'Resolve failing items before approving.'}
        </div>
      )}
    </div>
  );
}
