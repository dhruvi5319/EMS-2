import { useEffect, useRef, useState } from 'react';
import { X, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export interface FilterState {
  refStatus: string | null;
  assignedTo: string | null;
  search: string;
}

interface TeamMember {
  id: string;
  display_name: string;
}

interface StatementFilterBarProps {
  filters: FilterState;
  teamMembers?: TeamMember[];
  onFilterChange: (filters: FilterState) => void;
}

const STATUS_OPTIONS = [
  { value: 'not_started', label: 'Not Started' },
  { value: 'in_review', label: 'In Review' },
  { value: 'passed', label: 'Passed' },
  { value: 'failed', label: 'Failed' },
  { value: 'waived', label: 'Waived' },
];

export function StatementFilterBar({
  filters,
  teamMembers = [],
  onFilterChange,
}: StatementFilterBarProps) {
  const [searchInput, setSearchInput] = useState(filters.search);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const hasActiveFilters = filters.refStatus !== null || filters.assignedTo !== null || filters.search !== '';

  // Debounced search update
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      if (searchInput.length === 0 || searchInput.length >= 2) {
        onFilterChange({ ...filters, search: searchInput });
      }
    }, 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput]);

  function handleStatusChange(value: string) {
    onFilterChange({ ...filters, refStatus: value === 'all' ? null : value });
  }

  function handleAssignedToChange(value: string) {
    onFilterChange({ ...filters, assignedTo: value === 'all' ? null : value });
  }

  function handleClear() {
    setSearchInput('');
    onFilterChange({ refStatus: null, assignedTo: null, search: '' });
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Status filter */}
      <Select
        value={filters.refStatus ?? 'all'}
        onValueChange={handleStatusChange}
      >
        <SelectTrigger className="w-[160px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Statuses</SelectItem>
          {STATUS_OPTIONS.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Assigned To filter */}
      {teamMembers.length > 0 && (
        <Select
          value={filters.assignedTo ?? 'all'}
          onValueChange={handleAssignedToChange}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Assigned To" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Assignees</SelectItem>
            {teamMembers.map((member) => (
              <SelectItem key={member.id} value={member.id}>
                {member.display_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {/* Search input */}
      <div className="relative">
        <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search statements..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="pl-8 w-[220px]"
        />
      </div>

      {/* Clear button */}
      {hasActiveFilters && (
        <Button variant="ghost" size="sm" onClick={handleClear} className="gap-1">
          <X size={14} />
          Clear
        </Button>
      )}
    </div>
  );
}
