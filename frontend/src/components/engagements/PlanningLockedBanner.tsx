import * as React from 'react';
import { Lock, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { requestRevision } from '@/lib/planning.api';

interface PlanningLockedBannerProps {
  engagementId: string;
  onRevisionRequested: () => void;
}

export function PlanningLockedBanner({
  engagementId,
  onRevisionRequested,
}: PlanningLockedBannerProps) {
  const { toast } = useToast();
  const [showForm, setShowForm] = React.useState(false);
  const [revisionNote, setRevisionNote] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const isNoteValid = revisionNote.trim().length >= 10;

  async function handleUnlock() {
    if (!isNoteValid) {
      setError('Revision note must be at least 10 characters.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await requestRevision(engagementId, revisionNote.trim());
      toast({ description: 'Planning record unlocked for revision.' });
      setShowForm(false);
      setRevisionNote('');
      onRevisionRequested();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to request revision.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-amber-100 text-amber-800 border-l-4 border-amber-500 px-4 py-2 rounded-r-md">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <Lock className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" aria-hidden="true" />
          <p className="text-sm">
            Planning baseline locked at Gate P2. Click 'Request Revision' to make changes
            (revision note required).
          </p>
        </div>
        {!showForm && (
          <Button
            variant="outline"
            size="sm"
            className="shrink-0 border-amber-400 text-amber-800 hover:bg-amber-200"
            onClick={() => setShowForm(true)}
          >
            Request Revision
          </Button>
        )}
      </div>

      {showForm && (
        <div className="mt-3 space-y-2">
          <div>
            <Label className="text-xs font-medium text-amber-800">
              Revision Note <span className="text-red-600">*</span>
              <span className="ml-1 text-amber-700 font-normal">(required, ≥10 chars)</span>
            </Label>
            <Textarea
              placeholder="Reason for revising the approved planning baseline..."
              value={revisionNote}
              onChange={(e) => {
                setRevisionNote(e.target.value);
                setError(null);
              }}
              className="mt-1 min-h-[80px] text-sm border-amber-300 bg-white"
              disabled={loading}
            />
            {error && (
              <p className="text-xs text-red-600 mt-1">{error}</p>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-amber-800 hover:bg-amber-200"
              onClick={() => {
                setShowForm(false);
                setRevisionNote('');
                setError(null);
              }}
              disabled={loading}
            >
              Keep Locked
            </Button>
            <Button
              size="sm"
              onClick={handleUnlock}
              disabled={loading || !isNoteValid}
            >
              {loading ? (
                <>
                  <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                  Unlocking...
                </>
              ) : (
                'Unlock for Editing'
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
