import { Circle, Clock, CheckCircle, XCircle, MinusCircle } from 'lucide-react';

export type RefStatus = 'not_started' | 'in_review' | 'passed' | 'failed' | 'waived';

interface ReferenceStatusBadgeProps {
  status: RefStatus;
}

const STATUS_CONFIG: Record<
  RefStatus,
  { className: string; label: string; icon: React.ReactNode }
> = {
  not_started: {
    className:
      'inline-flex items-center px-2 py-0.5 rounded text-xs font-normal bg-gray-100 text-gray-600',
    label: 'Not Started',
    icon: <Circle size={14} className="text-gray-300 mr-1" />,
  },
  in_review: {
    className:
      'inline-flex items-center px-2 py-0.5 rounded text-xs font-normal bg-yellow-100 text-yellow-800',
    label: 'In Review',
    icon: <Clock size={14} className="text-yellow-500 mr-1" />,
  },
  passed: {
    className:
      'inline-flex items-center px-2 py-0.5 rounded text-xs font-normal bg-green-100 text-green-800 border border-emerald-600',
    label: 'Passed',
    icon: <CheckCircle size={14} className="text-green-600 mr-1" />,
  },
  failed: {
    className:
      'inline-flex items-center px-2 py-0.5 rounded text-xs font-normal bg-red-100 text-red-700 border border-red-600',
    label: 'Failed',
    icon: <XCircle size={14} className="text-red-600 mr-1" />,
  },
  waived: {
    className:
      'inline-flex items-center px-2 py-0.5 rounded text-xs font-normal bg-gray-100 text-gray-600 border border-dashed border-gray-300',
    label: 'Waived',
    icon: <MinusCircle size={14} className="text-gray-400 mr-1" />,
  },
};

export function ReferenceStatusBadge({ status }: ReferenceStatusBadgeProps) {
  const config = STATUS_CONFIG[status];

  return (
    <span className={config.className}>
      {config.icon}
      {config.label}
    </span>
  );
}
