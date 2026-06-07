import { Badge } from '@/components/ui/badge';

export type DraftStatus = 'drafting' | 'under_review' | 'ready_for_ref_check' | 'ready_for_final_review';

interface DraftStatusBadgeProps {
  status: DraftStatus;
}

const STATUS_CONFIG: Record<DraftStatus, { label: string; className: string }> = {
  drafting: {
    label: 'Drafting',
    className: 'bg-amber-100 text-amber-800 border-amber-200',
  },
  under_review: {
    label: 'Under Review',
    className: 'bg-blue-100 text-blue-800 border-blue-200',
  },
  ready_for_ref_check: {
    label: 'Ready for Reference Check',
    className: 'bg-teal-100 text-teal-800 border-teal-200',
  },
  ready_for_final_review: {
    label: 'Ready for Final Review',
    className: 'bg-green-100 text-green-800 border-green-200',
  },
};

export function DraftStatusBadge({ status }: DraftStatusBadgeProps) {
  const config = STATUS_CONFIG[status];
  return (
    <Badge variant="outline" className={config.className}>
      {config.label}
    </Badge>
  );
}
