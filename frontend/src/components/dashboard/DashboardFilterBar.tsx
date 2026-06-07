import { useState, useCallback, useEffect, useRef } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { PortfolioFilters } from '@/hooks/usePortfolio';
import { X } from 'lucide-react';

interface DashboardFilterBarProps {
  filters: PortfolioFilters;
  onFiltersChange: (filters: PortfolioFilters) => void;
}

const PHASE_OPTIONS = [
  { value: 'planning', label: 'Planning' },
  { value: 'evidence', label: 'Evidence' },
  { value: 'draft', label: 'Draft' },
  { value: 'readiness', label: 'Readiness' },
  { value: 'closed', label: 'Closed' },
];

const RISK_OPTIONS = [
  { value: 'Low', label: 'Low' },
  { value: 'Medium', label: 'Medium' },
  { value: 'High', label: 'High' },
];

const STATUS_OPTIONS = [
  { value: 'active', label: 'Active' },
  { value: 'on_hold', label: 'On Hold' },
  { value: 'ready_for_issuance', label: 'Ready for Issuance' },
  { value: 'closed', label: 'Closed' },
];

export function DashboardFilterBar({ filters, onFiltersChange }: DashboardFilterBarProps) {
  const [searchValue, setSearchValue] = useState(filters.search ?? '');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync search value when filters change externally (e.g., cleared)
  useEffect(() => {
    setSearchValue(filters.search ?? '');
  }, [filters.search]);

  const handleSearchChange = useCallback(
    (value: string) => {
      setSearchValue(value);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      if (value.length === 0 || value.length >= 2) {
        debounceRef.current = setTimeout(() => {
          onFiltersChange({ ...filters, search: value || undefined });
        }, 300);
      }
    },
    [filters, onFiltersChange]
  );

  const handlePhaseSelect = useCallback(
    (value: string) => {
      if (value === '__all__') {
        const { phase: _, ...rest } = filters;
        onFiltersChange(rest);
      } else {
        onFiltersChange({ ...filters, phase: [value] });
      }
    },
    [filters, onFiltersChange]
  );

  const handleRiskSelect = useCallback(
    (value: string) => {
      if (value === '__all__') {
        const { risk: _, ...rest } = filters;
        onFiltersChange(rest);
      } else {
        onFiltersChange({ ...filters, risk: value });
      }
    },
    [filters, onFiltersChange]
  );

  const handleStatusSelect = useCallback(
    (value: string) => {
      if (value === '__all__') {
        const { status: _, ...rest } = filters;
        onFiltersChange(rest);
      } else {
        onFiltersChange({ ...filters, status: value });
      }
    },
    [filters, onFiltersChange]
  );

  const handleClear = useCallback(() => {
    setSearchValue('');
    onFiltersChange({});
  }, [onFiltersChange]);

  const hasActiveFilters =
    (filters.phase && filters.phase.length > 0) ||
    filters.risk ||
    filters.status ||
    filters.search;

  // Compute active filter chips
  const chips: Array<{ key: string; label: string; onRemove: () => void }> = [];

  if (filters.phase && filters.phase.length > 0) {
    filters.phase.forEach((p) => {
      chips.push({
        key: `phase-${p}`,
        label: `Phase: ${p.charAt(0).toUpperCase() + p.slice(1)}`,
        onRemove: () => {
          const remaining = filters.phase!.filter((x) => x !== p);
          if (remaining.length === 0) {
            const { phase: _, ...rest } = filters;
            onFiltersChange(rest);
          } else {
            onFiltersChange({ ...filters, phase: remaining });
          }
        },
      });
    });
  }

  if (filters.risk) {
    chips.push({
      key: 'risk',
      label: `Risk: ${filters.risk}`,
      onRemove: () => {
        const { risk: _, ...rest } = filters;
        onFiltersChange(rest);
      },
    });
  }

  if (filters.status) {
    chips.push({
      key: 'status',
      label: `Status: ${filters.status}`,
      onRemove: () => {
        const { status: _, ...rest } = filters;
        onFiltersChange(rest);
      },
    });
  }

  if (filters.search) {
    chips.push({
      key: 'search',
      label: `Search: ${filters.search}`,
      onRemove: () => {
        setSearchValue('');
        const { search: _, ...rest } = filters;
        onFiltersChange(rest);
      },
    });
  }

  const currentPhase = filters.phase?.[0] ?? '__all__';
  const currentRisk = filters.risk ?? '__all__';
  const currentStatus = filters.status ?? '__all__';

  return (
    <div>
      {/* Filter controls row */}
      <div
        style={{
          display: 'flex',
          gap: 8,
          flexWrap: 'wrap',
          alignItems: 'center',
          marginBottom: 8,
        }}
      >
        {/* Phase filter */}
        <Select value={currentPhase} onValueChange={handlePhaseSelect}>
          <SelectTrigger style={{ width: 140, height: 36 }} aria-label="Filter by phase">
            <SelectValue placeholder="Phase" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__all__">All Phases</SelectItem>
            {PHASE_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Risk filter */}
        <Select value={currentRisk} onValueChange={handleRiskSelect}>
          <SelectTrigger style={{ width: 120, height: 36 }} aria-label="Filter by risk">
            <SelectValue placeholder="Risk" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__all__">All Risk</SelectItem>
            {RISK_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Status filter */}
        <Select value={currentStatus} onValueChange={handleStatusSelect}>
          <SelectTrigger style={{ width: 160, height: 36 }} aria-label="Filter by status">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__all__">All Statuses</SelectItem>
            {STATUS_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Search */}
        <Input
          value={searchValue}
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder="Search by ID, title, owner..."
          style={{ width: 240, height: 36 }}
          aria-label="Search engagements"
        />

        {/* Clear button */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            onClick={handleClear}
            style={{ height: 36 }}
            aria-label="Clear all filters"
          >
            Clear
          </Button>
        )}
      </div>

      {/* Active filter chips */}
      {chips.length > 0 && (
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {chips.map((chip) => (
            <span
              key={chip.key}
              role="button"
              aria-label={`Filter: ${chip.label} — click to remove`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                padding: '2px 8px',
                borderRadius: 4,
                backgroundColor: 'hsl(0 0% 93%)',
                color: 'hsl(0 0% 35%)',
                fontSize: 12,
                cursor: 'pointer',
              }}
            >
              {chip.label}
              <button
                onClick={chip.onRemove}
                aria-label="Remove filter"
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  padding: 0,
                  color: 'hsl(0 0% 35%)',
                }}
              >
                <X size={10} />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
