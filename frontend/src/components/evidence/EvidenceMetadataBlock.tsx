import React from 'react';
import { format } from 'date-fns';

interface EvidenceMetadataBlockProps {
  source: string;
  custodian: string | null;
  date_received: string;
  created_by_name?: string;
  created_at: string;
  description: string | null;
}

export const EvidenceMetadataBlock: React.FC<EvidenceMetadataBlockProps> = ({
  source,
  custodian,
  date_received,
  created_by_name,
  created_at,
  description,
}) => {
  const formattedDateReceived = (() => {
    try {
      return format(new Date(date_received), 'MMMM d, yyyy');
    } catch {
      return date_received;
    }
  })();

  const formattedUploadedAt = (() => {
    try {
      return format(new Date(created_at), 'MMMM d, yyyy \'at\' h:mm a');
    } catch {
      return created_at;
    }
  })();

  const uploadedBy = [created_by_name, formattedUploadedAt].filter(Boolean).join(' · ');

  const fields: { label: string; value: string | null }[] = [
    { label: 'SOURCE', value: source },
    { label: 'CUSTODIAN', value: custodian || '—' },
    { label: 'DATE RECEIVED', value: formattedDateReceived },
    { label: 'UPLOADED BY', value: uploadedBy || '—' },
    { label: 'DESCRIPTION', value: description || '—' },
  ];

  return (
    <div
      className="rounded-[6px] border p-4"
      style={{
        background: 'hsl(210 20% 97%)',
        borderColor: 'hsl(214 32% 91%)',
      }}
    >
      <div className="grid gap-y-3 md:grid-cols-[140px_1fr]">
        {fields.map(({ label, value }) => (
          <React.Fragment key={label}>
            <span
              className="text-[12px] font-normal uppercase tracking-wide"
              style={{ color: 'hsl(215 16% 47%)' }}
            >
              {label}
            </span>
            <span className="text-[14px] font-normal" style={{ color: 'inherit' }}>
              {value}
            </span>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
