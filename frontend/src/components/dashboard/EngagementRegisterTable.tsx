import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Briefcase, SearchX, AlertTriangle } from 'lucide-react';
import { GateMiniStatusRow } from './GateMiniStatusRow';
import type { PortfolioEngagement, PortfolioSort, PortfolioFilters } from '@/hooks/usePortfolio';


interface EngagementRegisterTableProps {
  engagements: PortfolioEngagement[];
  total: number;
  loading: boolean;
  sort: PortfolioSort;
  onSortChange: (sort: PortfolioSort) => void;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  filters: PortfolioFilters;
  onClearFilters: () => void;
}

const PHASE_COLORS: Record<string, { bg: string; text: string }> = {
  planning: { bg: 'hsl(221 83% 93%)', text: 'hsl(221 83% 28%)' },
  evidence: { bg: 'hsl(45 96% 88%)', text: 'hsl(45 90% 28%)' },
  draft: { bg: 'hsl(25 95% 90%)', text: 'hsl(25 90% 32%)' },
  readiness: { bg: 'hsl(142 71% 88%)', text: 'hsl(142 70% 28%)' },
  closed: { bg: 'hsl(0 0% 93%)', text: 'hsl(0 0% 35%)' },
};

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  active: { bg: 'hsl(142 71% 88%)', text: 'hsl(142 70% 28%)' },
  on_hold: { bg: 'hsl(45 96% 88%)', text: 'hsl(45 90% 28%)' },
  ready_for_issuance: { bg: 'hsl(142 71% 88%)', text: 'hsl(142 70% 28%)' },
  closed: { bg: 'hsl(0 0% 93%)', text: 'hsl(0 0% 35%)' },
};

const RISK_COLORS: Record<string, { bg: string; text: string }> = {
  Low: { bg: 'hsl(142 71% 88%)', text: 'hsl(142 70% 28%)' },
  Medium: { bg: 'hsl(45 96% 88%)', text: 'hsl(45 90% 28%)' },
  High: { bg: 'hsl(0 72% 93%)', text: 'hsl(0 72% 38%)' },
};

function Badge({ text, bg, textColor }: { text: string; bg: string; textColor: string }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '2px 8px',
        borderRadius: 4,
        backgroundColor: bg,
        color: textColor,
        fontSize: 12,
        fontWeight: 400,
        whiteSpace: 'nowrap',
      }}
    >
      {text}
    </span>
  );
}

type SortableField =
  | 'job_code'
  | 'title'
  | 'phase'
  | 'status'
  | 'owner_id'
  | 'risk_level'
  | 'next_milestone_date'
  | 'updated_at';

function SortableHeader({
  field,
  label,
  sort,
  onSortChange,
}: {
  field: SortableField;
  label: string;
  sort: PortfolioSort;
  onSortChange: (sort: PortfolioSort) => void;
}) {
  const isActive = sort.field === field;
  const nextDirection = isActive && sort.direction === 'asc' ? 'desc' : 'asc';

  return (
    <TableHead
      style={{ cursor: 'pointer', whiteSpace: 'nowrap', userSelect: 'none' }}
      aria-sort={isActive ? (sort.direction === 'asc' ? 'ascending' : 'descending') : 'none'}
      onClick={() => onSortChange({ field, direction: nextDirection })}
    >
      {label} {isActive ? (sort.direction === 'asc' ? '↑' : '↓') : ''}
    </TableHead>
  );
}

export function EngagementRegisterTable({
  engagements,
  total,
  loading,
  sort,
  onSortChange,
  page,
  pageSize,
  onPageChange,
  filters,
  onClearFilters,
}: EngagementRegisterTableProps) {
  const navigate = useNavigate();

  const hasActiveFilters =
    (filters.phase && filters.phase.length > 0) ||
    filters.risk ||
    filters.status ||
    filters.search;

  const totalPages = Math.ceil(total / pageSize);
  const startItem = page * pageSize + 1;
  const endItem = Math.min((page + 1) * pageSize, total);

  const handleRowClick = useCallback(
    (engagementId: string) => {
      navigate(`/engagements/${engagementId}`);
    },
    [navigate]
  );

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {[0, 1, 2, 3, 4].map((i) => (
          <Skeleton key={i} style={{ height: 48, borderRadius: 4 }} />
        ))}
      </div>
    );
  }

  if (engagements.length === 0 && !hasActiveFilters) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '48px 24px',
          gap: 12,
        }}
      >
        <Briefcase size={32} style={{ color: 'hsl(214 32% 78%)' }} />
        <p style={{ fontSize: 16, fontWeight: 600, margin: 0 }}>No engagements yet.</p>
        <p style={{ fontSize: 14, color: 'hsl(215 16% 47%)', margin: 0, textAlign: 'center' }}>
          Create your first engagement request to get started.
        </p>
      </div>
    );
  }

  if (engagements.length === 0 && hasActiveFilters) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '48px 24px',
          gap: 12,
        }}
      >
        <SearchX size={32} style={{ color: 'hsl(214 32% 78%)' }} />
        <p style={{ fontSize: 16, fontWeight: 600, margin: 0 }}>
          No engagements match your filters.
        </p>
        <p style={{ fontSize: 14, color: 'hsl(215 16% 47%)', margin: 0 }}>
          Try different filters or clear them to see all engagements.
        </p>
        <button
          onClick={onClearFilters}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'hsl(221 83% 53%)',
            fontSize: 14,
          }}
        >
          Clear filters
        </button>
      </div>
    );
  }

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <SortableHeader field="job_code" label="ID" sort={sort} onSortChange={onSortChange} />
            <SortableHeader field="title" label="Title" sort={sort} onSortChange={onSortChange} />
            <SortableHeader field="phase" label="Phase" sort={sort} onSortChange={onSortChange} />
            <SortableHeader field="status" label="Status" sort={sort} onSortChange={onSortChange} />
            <SortableHeader field="owner_id" label="Owner" sort={sort} onSortChange={onSortChange} />
            <SortableHeader field="risk_level" label="Risk" sort={sort} onSortChange={onSortChange} />
            <SortableHeader
              field="next_milestone_date"
              label="Next Milestone"
              sort={sort}
              onSortChange={onSortChange}
            />
            <TableHead>Gate Status</TableHead>
            <TableHead>Blocked</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {engagements.map((eng) => {
            const phaseColors = PHASE_COLORS[eng.phase] ?? {
              bg: 'hsl(0 0% 93%)',
              text: 'hsl(0 0% 35%)',
            };
            const statusColors = STATUS_COLORS[eng.status] ?? {
              bg: 'hsl(0 0% 93%)',
              text: 'hsl(0 0% 35%)',
            };
            const riskColors = eng.risk_level
              ? RISK_COLORS[eng.risk_level] ?? { bg: 'hsl(0 0% 93%)', text: 'hsl(0 0% 35%)' }
              : null;

            const truncatedTitle =
              eng.title && eng.title.length > 60
                ? eng.title.slice(0, 60) + '...'
                : eng.title ?? '—';

            return (
              <TableRow
                key={eng.id}
                style={{ cursor: 'pointer', height: 48 }}
                onClick={() => handleRowClick(eng.id)}
              >
                {/* ID */}
                <TableCell>
                  <span
                    style={{
                      fontFamily: 'monospace',
                      fontSize: 14,
                      fontWeight: 400,
                      color: 'hsl(221 83% 53%)',
                    }}
                  >
                    {eng.job_code}
                  </span>
                </TableCell>

                {/* Title */}
                <TableCell title={eng.title ?? undefined} style={{ maxWidth: 200 }}>
                  <span
                    style={{
                      fontSize: 14,
                      display: 'block',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {truncatedTitle}
                  </span>
                </TableCell>

                {/* Phase badge */}
                <TableCell>
                  <Badge
                    text={eng.phase.charAt(0).toUpperCase() + eng.phase.slice(1)}
                    bg={phaseColors.bg}
                    textColor={phaseColors.text}
                  />
                </TableCell>

                {/* Status badge */}
                <TableCell>
                  <Badge
                    text={eng.status.replace(/_/g, ' ')}
                    bg={statusColors.bg}
                    textColor={statusColors.text}
                  />
                </TableCell>

                {/* Owner */}
                <TableCell style={{ fontSize: 14 }}>
                  {eng.owner_display_name ?? eng.owner_id ?? '—'}
                </TableCell>

                {/* Risk badge */}
                <TableCell>
                  {riskColors ? (
                    <Badge
                      text={eng.risk_level!}
                      bg={riskColors.bg}
                      textColor={riskColors.text}
                    />
                  ) : (
                    <span style={{ fontSize: 14, color: 'hsl(215 16% 47%)' }}>—</span>
                  )}
                </TableCell>

                {/* Next Milestone */}
                <TableCell style={{ fontSize: 14 }}>
                  {eng.next_milestone_label ? (
                    <span>
                      {eng.next_milestone_label}
                      {eng.next_milestone_date && (
                        <span
                          style={{ fontSize: 12, color: 'hsl(215 16% 47%)', marginLeft: 4 }}
                        >
                          {new Date(eng.next_milestone_date).toLocaleDateString()}
                        </span>
                      )}
                    </span>
                  ) : (
                    <span style={{ color: 'hsl(215 16% 47%)' }}>—</span>
                  )}
                </TableCell>

                {/* Gate mini-status */}
                <TableCell>
                  <GateMiniStatusRow
                    a1={eng.gate_a1 ?? 'not_started'}
                    p2={eng.gate_p2 ?? 'not_started'}
                    p3={eng.gate_p3 ?? 'not_started'}
                    p4={eng.gate_p4 ?? 'not_started'}
                  />
                </TableCell>

                {/* Blocked indicator */}
                <TableCell>
                  {eng.has_blockers ? (
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 4,
                        padding: '2px 6px',
                        borderRadius: 4,
                        backgroundColor: 'hsl(45 96% 88%)',
                        color: 'hsl(45 90% 28%)',
                        fontSize: 12,
                      }}
                    >
                      <AlertTriangle size={10} />
                      Blocked
                    </span>
                  ) : null}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {/* Pagination */}
      {total > 0 && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: 16,
            fontSize: 14,
            color: 'hsl(215 16% 47%)',
          }}
        >
          <span>
            Showing {startItem}–{endItem} of {total} items
          </span>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <button
              onClick={() => onPageChange(page - 1)}
              disabled={page === 0}
              style={{
                background: 'none',
                border: '1px solid hsl(214 32% 91%)',
                borderRadius: 4,
                padding: '4px 12px',
                cursor: page === 0 ? 'not-allowed' : 'pointer',
                color: page === 0 ? 'hsl(215 16% 47%)' : 'inherit',
              }}
              aria-label="Previous page"
            >
              ← Prev
            </button>

            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              const pageNum = i;
              return (
                <button
                  key={pageNum}
                  onClick={() => onPageChange(pageNum)}
                  style={{
                    background: pageNum === page ? 'hsl(221 83% 53%)' : 'none',
                    color: pageNum === page ? 'white' : 'inherit',
                    border: '1px solid hsl(214 32% 91%)',
                    borderRadius: 4,
                    padding: '4px 10px',
                    cursor: 'pointer',
                    minWidth: 32,
                  }}
                  aria-label={`Page ${pageNum + 1}`}
                  aria-current={pageNum === page ? 'page' : undefined}
                >
                  {pageNum + 1}
                </button>
              );
            })}

            <button
              onClick={() => onPageChange(page + 1)}
              disabled={page >= totalPages - 1}
              style={{
                background: 'none',
                border: '1px solid hsl(214 32% 91%)',
                borderRadius: 4,
                padding: '4px 12px',
                cursor: page >= totalPages - 1 ? 'not-allowed' : 'pointer',
                color: page >= totalPages - 1 ? 'hsl(215 16% 47%)' : 'inherit',
              }}
              aria-label="Next page"
            >
              Next →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
