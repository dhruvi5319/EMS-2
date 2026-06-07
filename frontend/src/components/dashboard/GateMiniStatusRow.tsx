import { Check, Minus } from 'lucide-react';

type GateStatus = 'approved' | 'pending' | 'not_started';

export interface GateMiniStatusRowProps {
  a1: GateStatus;
  p2: GateStatus;
  p3: GateStatus;
  p4: GateStatus;
}

const GATE_LABELS = ['A1', 'P2', 'P3', 'P4'] as const;

function GateCircle({
  status,
  gateName,
}: {
  status: GateStatus;
  gateName: string;
}) {
  const statusLabel = status === 'not_started' ? 'not started' : status;

  if (status === 'approved') {
    return (
      <div
        aria-label={`Gate ${gateName}: ${statusLabel}`}
        style={{
          width: 20,
          height: 20,
          borderRadius: '50%',
          backgroundColor: 'hsl(161 94% 30%)', // emerald-600
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
        className="bg-emerald-600"
      >
        <Check size={10} style={{ color: 'white' }} />
      </div>
    );
  }

  if (status === 'pending') {
    return (
      <div
        aria-label={`Gate ${gateName}: ${statusLabel}`}
        style={{
          width: 20,
          height: 20,
          borderRadius: '50%',
          backgroundColor: 'hsl(45 90% 52%)', // yellow-500
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
        className="bg-yellow-500"
      >
        <Minus size={10} style={{ color: 'white' }} />
      </div>
    );
  }

  // not_started
  return (
    <div
      aria-label={`Gate ${gateName}: ${statusLabel}`}
      style={{
        width: 20,
        height: 20,
        borderRadius: '50%',
        backgroundColor: 'hsl(0 0% 87%)', // gray-200
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
      className="bg-gray-200"
    >
      <Minus size={10} style={{ color: 'hsl(0 0% 60%)' }} className="text-gray-400" />
    </div>
  );
}

export function GateMiniStatusRow({ a1, p2, p3, p4 }: GateMiniStatusRowProps) {
  const statuses: GateStatus[] = [a1, p2, p3, p4];

  return (
    <div
      role="group"
      aria-label="Gate status"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 4,
      }}
    >
      {statuses.map((status, i) => (
        <GateCircle key={GATE_LABELS[i]} status={status} gateName={GATE_LABELS[i]} />
      ))}
    </div>
  );
}
