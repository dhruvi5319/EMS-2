import { Skeleton } from '@/components/ui/skeleton';
import type { PhaseCounts } from '@/hooks/usePortfolio';

interface PhaseStatCardRowProps {
  counts: PhaseCounts;
  loading: boolean;
  activePhases: string[];
  onPhaseClick: (phase: string) => void;
}

const PHASES = [
  { key: 'planning', label: 'Planning' },
  { key: 'evidence', label: 'Evidence' },
  { key: 'draft', label: 'Draft' },
  { key: 'readiness', label: 'Readiness' },
] as const;

function PhaseStatCard({
  label,
  count,
  isActive,
  onClick,
}: {
  label: string;
  count: number;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`${label} engagements: ${count}`}
      aria-pressed={isActive}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      style={{
        background: 'white',
        border: isActive ? '2px solid hsl(221 83% 53%)' : '1px solid hsl(214 32% 91%)',
        borderRadius: 8,
        padding: 16,
        height: 80,
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        flex: 1,
        minWidth: 0,
        transition: 'border-color 0.15s',
      }}
      className={`hover:border-blue-600 hover:border-2 ${isActive ? 'border-blue-600 border-2' : ''}`}
    >
      <div
        style={{
          fontSize: 28,
          fontWeight: 600,
          lineHeight: 1.15,
          color: 'hsl(222 47% 11%)',
        }}
      >
        {count}
      </div>
      <div
        style={{
          fontSize: 14,
          fontWeight: 400,
          color: 'hsl(215 16% 47%)',
          marginTop: 2,
        }}
      >
        {label}
      </div>
    </div>
  );
}

export function PhaseStatCardRow({
  counts,
  loading,
  activePhases,
  onPhaseClick,
}: PhaseStatCardRowProps) {
  if (loading) {
    return (
      <div style={{ display: 'flex', gap: 16 }}>
        {PHASES.map((p) => (
          <Skeleton key={p.key} style={{ height: 80, flex: 1 }} />
        ))}
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', gap: 16 }}>
      {PHASES.map((p) => (
        <PhaseStatCard
          key={p.key}
          label={p.label}
          count={counts[p.key]}
          isActive={activePhases.includes(p.key)}
          onClick={() => onPhaseClick(p.key)}
        />
      ))}
    </div>
  );
}
