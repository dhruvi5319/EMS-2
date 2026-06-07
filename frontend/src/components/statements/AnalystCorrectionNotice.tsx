import { AlertTriangle } from 'lucide-react';

export interface AnalystCorrectionNoticeProps {
  type: string;
  notes: string;
  failedBy: string;
  failedAt: string;
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return iso;
  }
}

export function AnalystCorrectionNotice({
  type,
  notes,
  failedBy,
  failedAt,
}: AnalystCorrectionNoticeProps) {
  return (
    <div
      role="region"
      aria-label="Discrepancy notice from Independent Referencer"
      className="bg-amber-50 border-l-4 border-amber-500 p-4"
    >
      <div className="flex items-center gap-2 mb-1">
        <AlertTriangle className="h-4 w-4 text-amber-600" aria-hidden="true" />
        <span className="inline-block px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-600">
          {type}
        </span>
      </div>
      <p className="text-sm italic mt-2">{notes}</p>
      <p className="text-xs text-muted-foreground mt-2">
        Failed by: {failedBy} · {formatDate(failedAt)}
      </p>
    </div>
  );
}
