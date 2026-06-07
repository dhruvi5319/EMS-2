import { CheckCircle, XCircle } from 'lucide-react';

interface ReferenceCheckProgressBarProps {
  passed: number;
  waived: number;
  failed: number;
  inReview: number;
  notStarted: number;
}

export function ReferenceCheckProgressBar({
  passed,
  waived,
  failed,
  inReview,
  notStarted,
}: ReferenceCheckProgressBarProps) {
  const total = passed + waived + failed + inReview + notStarted;
  const complete = passed + waived;
  const percent = total > 0 ? Math.round((complete / total) * 100) : 0;

  const isReady = failed === 0 && inReview === 0 && notStarted === 0 && total > 0;

  function pct(count: number): string {
    if (total === 0) return '0%';
    return `${(count / total) * 100}%`;
  }

  return (
    <div className="space-y-1.5">
      {/* Header row: count + percentage */}
      <div className="flex justify-between items-center">
        <span className="text-sm font-normal text-foreground">
          {total} statement{total !== 1 ? 's' : ''}
        </span>
        <span className="text-xs font-normal text-muted-foreground">
          {complete} complete ({percent}%)
        </span>
      </div>

      {/* 5-segment progress bar */}
      {total === 0 ? (
        <div
          role="progressbar"
          aria-valuenow={0}
          aria-valuemin={0}
          aria-valuemax={0}
          aria-label="Reference check progress: 0 of 0 complete"
          className="h-2 w-full rounded-full bg-gray-100 overflow-hidden"
        />
      ) : (
        <div
          role="progressbar"
          aria-valuenow={complete}
          aria-valuemin={0}
          aria-valuemax={total}
          aria-label={`Reference check progress: ${complete} of ${total} complete`}
          className="h-2 w-full rounded-full overflow-hidden flex"
        >
          {passed > 0 && (
            <div
              role="img"
              aria-label={`Passed: ${passed} statements`}
              style={{ width: pct(passed) }}
              className="h-full bg-blue-600"
            />
          )}
          {waived > 0 && (
            <div
              role="img"
              aria-label={`Waived: ${waived} statements`}
              style={{ width: pct(waived) }}
              className="h-full bg-gray-300"
            />
          )}
          {failed > 0 && (
            <div
              role="img"
              aria-label={`Failed: ${failed} statements`}
              style={{ width: pct(failed) }}
              className="h-full bg-red-600"
            />
          )}
          {inReview > 0 && (
            <div
              role="img"
              aria-label={`In Review: ${inReview} statements`}
              style={{ width: pct(inReview) }}
              className="h-full bg-yellow-500"
            />
          )}
          {notStarted > 0 && (
            <div
              role="img"
              aria-label={`Not Started: ${notStarted} statements`}
              style={{ width: pct(notStarted) }}
              className="h-full bg-gray-100"
            />
          )}
        </div>
      )}

      {/* Count row */}
      <p className="text-xs font-normal text-muted-foreground">
        Passed: {passed} · Waived: {waived} · Failed: {failed} · In Review: {inReview} · Not
        Started: {notStarted}
      </p>

      {/* P4 Gate Status Line */}
      {total > 0 && (
        <div className="flex items-center">
          {isReady ? (
            <>
              <CheckCircle size={16} className="text-green-800 mr-1" />
              <span className="text-sm text-green-800">P4 Status: READY — All checks complete</span>
            </>
          ) : (
            <>
              <XCircle size={16} className="text-red-700 mr-1" />
              <span className="text-sm text-red-700">
                P4 Status: BLOCKED
                {(failed > 0 || inReview > 0) && (
                  <>
                    {' '}—{' '}
                    {[
                      failed > 0 ? `${failed} Failed` : '',
                      inReview > 0 ? `${inReview} In Review` : '',
                    ]
                      .filter(Boolean)
                      .join(', ')}
                  </>
                )}
              </span>
            </>
          )}
        </div>
      )}
    </div>
  );
}
