import { useState } from 'react';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';

// Representative audit action codes (full list added as audit events accumulate)
const ACTION_CODES = [
  { value: '__all__', label: 'All action types' },
  { value: 'USER_CREATED', label: 'USER_CREATED' },
  { value: 'USER_DEACTIVATED', label: 'USER_DEACTIVATED' },
  { value: 'USER_REACTIVATED', label: 'USER_REACTIVATED' },
  { value: 'ROLES_UPDATED', label: 'ROLES_UPDATED' },
  { value: 'ENGAGEMENT_CREATED', label: 'ENGAGEMENT_CREATED' },
  { value: 'ENGAGEMENT_UPDATED', label: 'ENGAGEMENT_UPDATED' },
  { value: 'REQUEST_CREATED', label: 'REQUEST_CREATED' },
  { value: 'REQUEST_SUBMITTED', label: 'REQUEST_SUBMITTED' },
  { value: 'GATE_A1_APPROVED', label: 'GATE_A1_APPROVED' },
  { value: 'GATE_A1_DECLINED', label: 'GATE_A1_DECLINED' },
  { value: 'GATE_P2_APPROVED', label: 'GATE_P2_APPROVED' },
  { value: 'GATE_P2_RETURNED', label: 'GATE_P2_RETURNED' },
  { value: 'GATE_P3_APPROVED', label: 'GATE_P3_APPROVED' },
  { value: 'GATE_P4_APPROVED', label: 'GATE_P4_APPROVED' },
  { value: 'EVIDENCE_ADDED', label: 'EVIDENCE_ADDED' },
  { value: 'PLANNING_SUBMITTED', label: 'PLANNING_SUBMITTED' },
];

export interface FilterValues {
  action_type: string;
  date_from: string;
  date_to: string;
}

interface AuditTrailFiltersProps {
  onApply: (filters: FilterValues) => void;
  onClear: () => void;
  activeFilters: FilterValues;
}

export function AuditTrailFilters({ onApply, onClear, activeFilters }: AuditTrailFiltersProps) {
  const [actionType, setActionType] = useState(activeFilters.action_type || '__all__');
  const [dateFrom, setDateFrom] = useState(activeFilters.date_from || '');
  const [dateTo, setDateTo] = useState(activeFilters.date_to || '');

  const handleApply = () => {
    onApply({
      action_type: actionType === '__all__' ? '' : actionType,
      date_from: dateFrom,
      date_to: dateTo,
    });
  };

  const handleClear = () => {
    setActionType('__all__');
    setDateFrom('');
    setDateTo('');
    onClear();
  };

  return (
    <div className="flex flex-wrap items-end gap-3 mb-4">
      {/* Action Type filter */}
      <div className="flex flex-col gap-1">
        <label className="text-xs text-muted-foreground">Action Type</label>
        <Select value={actionType} onValueChange={setActionType}>
          <SelectTrigger className="h-9 w-52 text-sm">
            <SelectValue placeholder="All action types" />
          </SelectTrigger>
          <SelectContent>
            {ACTION_CODES.map(({ value, label }) => (
              <SelectItem key={value} value={value}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Date From */}
      <div className="flex flex-col gap-1">
        <label className="text-xs text-muted-foreground">Date From</label>
        <input
          type="date"
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
          className="h-9 rounded-md border border-border px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      {/* Date To */}
      <div className="flex flex-col gap-1">
        <label className="text-xs text-muted-foreground">Date To</label>
        <input
          type="date"
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
          className="h-9 rounded-md border border-border px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      {/* [Apply Filters] — exact copy from UI-SPEC */}
      <button
        onClick={handleApply}
        className="h-9 px-4 text-sm font-medium border border-primary text-primary rounded-md hover:bg-primary/10 transition-colors"
      >
        Apply Filters
      </button>

      {/* [Clear] */}
      <button
        onClick={handleClear}
        className="h-9 px-3 text-sm text-muted-foreground hover:text-foreground rounded-md hover:bg-muted transition-colors"
      >
        Clear
      </button>
    </div>
  );
}
