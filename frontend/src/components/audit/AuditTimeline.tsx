import { Skeleton } from '@/components/ui/skeleton';
import { AuditEventCard } from './AuditEventCard';
import type { AuditEvent } from '@/hooks/useAuditTrail';

interface AuditTimelineProps {
  events: AuditEvent[];
  total: number;
  loading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  isFiltered: boolean;
  onClearFilters: () => void;
}

export function AuditTimeline({
  events,
  total,
  loading,
  hasMore,
  onLoadMore,
  isFiltered,
  onClearFilters,
}: AuditTimelineProps) {
  // Initial loading — show 3 skeleton cards
  if (loading && events.length === 0) {
    return (
      <div aria-busy="true" aria-label="Loading audit events">
        {[0, 1, 2].map((i) => (
          <div key={i} className="bg-background border border-border rounded-md p-4 mb-2">
            <div className="flex justify-between mb-2">
              <Skeleton className="h-3 w-40" />
              <Skeleton className="h-3 w-32" />
            </div>
            <Skeleton className="h-4 w-28 mb-2" />
            <Skeleton className="h-4 w-full mb-1" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ))}
      </div>
    );
  }

  // Empty — no events at all
  if (!loading && events.length === 0 && !isFiltered) {
    return (
      <p className="text-sm text-muted-foreground py-8 text-center">
        No audit events recorded yet.
      </p>
    );
  }

  // Filter-empty
  if (!loading && events.length === 0 && isFiltered) {
    return (
      <div className="text-center py-8">
        <p className="text-sm text-muted-foreground mb-2">No events match your filter.</p>
        <button
          onClick={onClearFilters}
          className="text-sm text-primary hover:underline"
        >
          Clear filters
        </button>
      </div>
    );
  }

  return (
    <div aria-live="polite">
      {/* Filter result count label — shown when filtered */}
      {isFiltered && (
        <p className="text-xs text-muted-foreground mb-3">
          Showing {events.length} of {total} events matching filter
        </p>
      )}

      {/* Event cards */}
      {events.map((event) => (
        <AuditEventCard key={event.id} event={event} />
      ))}

      {/* Load More */}
      {hasMore && (
        <div className="text-center mt-4">
          <button
            onClick={onLoadMore}
            disabled={loading}
            className="px-4 py-2 text-sm border border-border rounded-md text-muted-foreground hover:border-ring hover:text-foreground transition-colors disabled:opacity-50"
          >
            {loading ? 'Loading...' : `Load More (showing ${events.length} of ${total})`}
          </button>
        </div>
      )}
    </div>
  );
}
