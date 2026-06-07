import { AlertTriangle } from 'lucide-react';

export interface DiscrepancyPanelProps {
  type: string;
  notes: string;
}

export function DiscrepancyPanel({ type, notes }: DiscrepancyPanelProps) {
  return (
    <div
      role="region"
      aria-label="Discrepancy notice"
      className="bg-red-50 border-l-4 border-red-600 p-4"
    >
      <div className="flex items-center gap-2 mb-1">
        <AlertTriangle className="h-4 w-4 text-amber-600" aria-hidden="true" />
        <span className="inline-block px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-600">
          {type}
        </span>
      </div>
      <p className="text-sm italic text-gray-700 mt-2">{notes}</p>
    </div>
  );
}
