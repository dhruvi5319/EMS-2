import { ChevronLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface StatementNavigationButtonsProps {
  isFirst: boolean;
  isLast: boolean;
  loading: boolean;
  onNavigatePrev: () => void;
  onSaveNext: () => void;
  onSave: () => void;
}

export function StatementNavigationButtons({
  isFirst,
  isLast,
  loading,
  onNavigatePrev,
  onSaveNext,
  onSave,
}: StatementNavigationButtonsProps) {
  return (
    <div className="flex items-center gap-3 flex-wrap">
      {/* Previous button — aria-disabled at first, not HTML disabled */}
      <button
        type="button"
        onClick={isFirst ? undefined : onNavigatePrev}
        aria-disabled={isFirst ? 'true' : undefined}
        className={
          'inline-flex items-center gap-1 rounded-md border border-input bg-background px-3 py-2 text-sm font-medium shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring ' +
          (isFirst
            ? 'opacity-40 cursor-not-allowed'
            : 'hover:bg-accent hover:text-accent-foreground')
        }
        disabled={loading}
      >
        <ChevronLeft className="h-4 w-4" aria-hidden="true" />
        Previous
      </button>

      {/* Save & Next */}
      <Button
        type="button"
        onClick={onSaveNext}
        disabled={loading || isLast}
        aria-label="Save current status and proceed to next statement"
        className="gap-1"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            Saving...
          </>
        ) : (
          'Save & Next →'
        )}
      </Button>

      {/* Save Status */}
      <Button
        type="button"
        variant="outline"
        onClick={onSave}
        disabled={loading}
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin mr-1" aria-hidden="true" />
            Saving...
          </>
        ) : (
          'Save Status'
        )}
      </Button>
    </div>
  );
}
