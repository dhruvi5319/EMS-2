import { AlertCircle, Download } from 'lucide-react';

export interface EvidenceItem {
  id: string;
  sequence: number;
  evidence_type: string;
  source: string;
  sensitivity: 'standard' | 'restricted';
  file_ref?: string;
  filename?: string;
}

export interface StatementEvidenceListProps {
  evidence: EvidenceItem[];
  engagementId?: string;
}

function formatType(type: string): string {
  return type
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export function StatementEvidenceList({ evidence, engagementId }: StatementEvidenceListProps) {
  if (!evidence || evidence.length === 0) {
    return (
      <div className="flex items-center gap-2 py-3 text-sm text-muted-foreground">
        <AlertCircle className="h-4 w-4 text-red-600" aria-hidden="true" />
        No evidence linked.
      </div>
    );
  }

  return (
    <ul className="divide-y divide-border" aria-label="Linked evidence items">
      {evidence.map((item) => (
        <li key={item.id} className="py-3 flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <span className="text-xs text-muted-foreground font-mono min-w-[3rem]">
              E-{String(item.sequence).padStart(3, '0')}
            </span>
            <div>
              <span className="text-sm font-medium">
                {formatType(item.evidence_type)}
              </span>
              <span className="text-sm text-muted-foreground"> — {item.source}</span>
              <span
                className={
                  'ml-2 inline-block px-1.5 py-0.5 rounded text-xs font-medium ' +
                  (item.sensitivity === 'restricted'
                    ? 'bg-red-100 text-red-700 uppercase'
                    : 'bg-gray-100 text-gray-600')
                }
              >
                {item.sensitivity === 'restricted' ? 'RESTRICTED' : 'Standard'}
              </span>
            </div>
          </div>

          {item.file_ref && engagementId && (
            <a
              href={`/api/engagements/${engagementId}/evidence/${item.id}/files/${item.file_ref}`}
              download={item.filename || true}
              className="inline-flex items-center gap-1 text-sm text-primary hover:underline shrink-0"
              aria-label={`Download evidence E-${String(item.sequence).padStart(3, '0')}`}
            >
              <Download className="h-4 w-4" aria-hidden="true" />
              Download
            </a>
          )}
        </li>
      ))}
    </ul>
  );
}
