import React from 'react';
import { Badge } from '@/components/ui/badge';

export type EvidenceType = 'document' | 'dataset' | 'interview_note' | 'meeting_note' | 'other';

const LABELS: Record<EvidenceType, string> = {
  document: 'Document',
  dataset: 'Dataset',
  interview_note: 'Interview Note',
  meeting_note: 'Meeting Note',
  other: 'Other',
};

export const EvidenceTypeBadge: React.FC<{ type: EvidenceType }> = ({ type }) => (
  <Badge variant="outline" className="text-[12px] font-normal py-0 px-2 h-5">
    {LABELS[type] ?? type}
  </Badge>
);
