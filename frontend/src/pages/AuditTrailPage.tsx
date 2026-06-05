import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuditTrail, type AuditFilters } from '@/hooks/useAuditTrail';
import { AuditTrailFilters, type FilterValues } from '@/components/audit/AuditTrailFilters';
import { AuditTimeline } from '@/components/audit/AuditTimeline';

const EMPTY_FILTERS: FilterValues = { action_type: '', date_from: '', date_to: '' };

export function AuditTrailPage() {
  const { id } = useParams<{ id: string }>();
  const [activeFilters, setActiveFilters] = useState<FilterValues>(EMPTY_FILTERS);

  const apiFilters: AuditFilters = {
    action_type: activeFilters.action_type || undefined,
    date_from: activeFilters.date_from || undefined,
    date_to: activeFilters.date_to || undefined,
  };

  const { events, total, loading, loadMore, hasMore } = useAuditTrail(id ?? '', apiFilters);

  const isFiltered = !!(activeFilters.action_type || activeFilters.date_from || activeFilters.date_to);

  const handleApply = (filters: FilterValues) => setActiveFilters(filters);
  const handleClear = () => setActiveFilters(EMPTY_FILTERS);

  return (
    <div>
      {/* Page header */}
      <div className="mb-6">
        <nav aria-label="Breadcrumb" className="mb-1">
          <ol className="flex items-center gap-1 text-xs text-muted-foreground">
            <li><Link to="/engagements" className="hover:text-primary">Engagements</Link></li>
            <li aria-hidden="true">›</li>
            {/* Engagement ID placeholder — real job_code from Phase 4 */}
            <li><Link to={`/engagements/${id}`} className="hover:text-primary">{id ?? 'Engagement'}</Link></li>
            <li aria-hidden="true">›</li>
            <li className="text-foreground">Audit Trail</li>
          </ol>
        </nav>
        <div className="flex items-center justify-between">
          {/* "Audit Trail — ENG-{id}" per UI-SPEC */}
          <h1 className="text-xl font-semibold text-foreground">
            Audit Trail — {id ?? '...'}
          </h1>
        </div>
      </div>

      {/* Filters row */}
      <AuditTrailFilters
        onApply={handleApply}
        onClear={handleClear}
        activeFilters={activeFilters}
      />

      {/* Timeline */}
      <AuditTimeline
        events={events}
        total={total}
        loading={loading}
        hasMore={hasMore}
        onLoadMore={loadMore}
        isFiltered={isFiltered}
        onClearFilters={handleClear}
      />
    </div>
  );
}
