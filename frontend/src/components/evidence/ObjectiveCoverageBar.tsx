import React from 'react';

type Props = {
  covered: number;
  total: number;
  showingGaps: boolean;
  onToggleGaps: () => void;
};

export const ObjectiveCoverageBar: React.FC<Props> = ({ covered, total, showingGaps, onToggleGaps }) => {
  const gap = total - covered;
  const coveredPct = total === 0 ? 100 : Math.round((covered / total) * 100);
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 flex items-center gap-4">
      <div className="flex-1">
        <div
          role="progressbar"
          aria-valuenow={covered}
          aria-valuemin={0}
          aria-valuemax={total}
          aria-label={`Objective coverage: ${covered} of ${total} covered`}
          className="w-full h-2 rounded-full overflow-hidden flex"
          style={{ background: 'hsl(0 72% 93%)' }}
        >
          <div
            style={{
              width: `${coveredPct}%`,
              background: 'hsl(221 83% 93%)',
              borderRight: covered > 0 && gap > 0 ? '1px solid hsl(221 83% 53%)' : undefined,
            }}
          />
        </div>
        <p className="text-[12px] text-slate-500 mt-1">{covered} covered · {gap} gap</p>
      </div>
      {gap > 0 && (
        <button
          onClick={onToggleGaps}
          className="text-[14px] text-blue-600 hover:underline whitespace-nowrap"
        >
          {showingGaps ? 'Hide Gaps ▲' : 'Show Gaps ▼'}
        </button>
      )}
    </div>
  );
};
