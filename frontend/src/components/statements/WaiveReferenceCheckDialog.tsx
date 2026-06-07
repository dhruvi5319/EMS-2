import { useState } from 'react';
import { AlertCircle, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import type { Statement } from '@/hooks/useStatements';

interface WaiveReferenceCheckDialogProps {
  statement: Statement;
  open: boolean;
  onConfirm: (justification: string) => Promise<void>;
  onCancel: () => void;
}

const MIN_JUSTIFICATION_LENGTH = 10;

export function WaiveReferenceCheckDialog({
  statement,
  open,
  onConfirm,
  onCancel,
}: WaiveReferenceCheckDialogProps) {
  const [justification, setJustification] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const charCount = justification.length;
  const isValid = charCount >= MIN_JUSTIFICATION_LENGTH;
  const textTooShort = charCount > 0 && charCount < MIN_JUSTIFICATION_LENGTH;

  async function handleConfirm() {
    if (!isValid) return;
    setSaving(true);
    setError(null);
    try {
      await onConfirm(justification);
      setJustification('');
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to waive reference check');
    } finally {
      setSaving(false);
    }
  }

  function handleCancel() {
    setJustification('');
    setError(null);
    onCancel();
  }

  return (
    <Dialog open={open} onOpenChange={(open) => { if (!open) handleCancel(); }}>
      <DialogContent className="max-w-[520px]">
        <DialogHeader>
          <DialogTitle>Waive Reference Check</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Warning alert */}
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Waiving removes this statement from P4 blocking checks.
            </AlertDescription>
          </Alert>

          {/* Statement preview */}
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
              Statement
            </p>
            <div className="rounded-md border bg-muted/30 p-3">
              <p className="text-sm text-foreground line-clamp-4">
                {statement.statement_text}
              </p>
            </div>
          </div>

          {/* Justification textarea */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-sm font-medium">
                Waiver Justification <span className="text-destructive">*</span>
              </label>
              <span
                className={`text-xs ${
                  textTooShort
                    ? 'text-destructive'
                    : isValid
                    ? 'text-blue-600'
                    : 'text-muted-foreground'
                }`}
              >
                {isValid ? '●' : `${charCount} / ${MIN_JUSTIFICATION_LENGTH}`}
              </span>
            </div>
            <Textarea
              value={justification}
              onChange={(e) => setJustification(e.target.value)}
              placeholder="Provide justification for waiving this reference check..."
              rows={4}
              className={textTooShort ? 'border-destructive' : ''}
              disabled={saving}
            />
            {textTooShort && (
              <p className="text-xs text-destructive mt-1">
                Justification must be at least {MIN_JUSTIFICATION_LENGTH} characters.
              </p>
            )}
          </div>

          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}

          {/* Action buttons */}
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" onClick={handleCancel} disabled={saving}>
              Keep Reference Check
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={!isValid || saving}
            >
              {saving ? (
                <>
                  <Loader2 size={14} className="mr-1 animate-spin" />
                  Saving waiver...
                </>
              ) : (
                'Waive Reference Check'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
