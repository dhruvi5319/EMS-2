import { AlertTriangle, AlertCircle, CheckCircle, MinusCircle, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';

export type MilestoneStatus = 'not_started' | 'on_track' | 'at_risk' | 'overdue' | 'complete';

interface MilestoneStatusChipProps {
  status: MilestoneStatus;
}

const STATUS_CONFIG: Record<
  MilestoneStatus,
  {
    label: string;
    icon: React.ReactNode;
    classes: string;
  }
> = {
  not_started: {
    label: 'Not Started',
    icon: <MinusCircle className="h-3 w-3 text-gray-400" />,
    classes: 'bg-gray-100 text-gray-600',
  },
  on_track: {
    label: 'On Track',
    icon: <Circle className="h-3 w-3 text-green-600" />,
    classes: 'bg-green-100 text-green-800',
  },
  at_risk: {
    label: 'At Risk',
    icon: <AlertTriangle className="h-3 w-3 text-yellow-500" />,
    classes: 'bg-yellow-100 text-yellow-800',
  },
  overdue: {
    label: 'Overdue',
    icon: <AlertCircle className="h-3 w-3 text-red-600" />,
    classes: 'bg-red-100 text-red-700',
  },
  complete: {
    label: 'Complete',
    icon: <CheckCircle className="h-3 w-3 text-green-600" />,
    classes: 'bg-green-100 text-green-800 font-medium',
  },
};

export function MilestoneStatusChip({ status }: MilestoneStatusChipProps) {
  const config = STATUS_CONFIG[status];
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs',
        config.classes,
      )}
    >
      {config.icon}
      {config.label}
    </span>
  );
}
