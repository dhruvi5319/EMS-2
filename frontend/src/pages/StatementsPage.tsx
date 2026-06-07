import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FileText, SearchX, CheckCircle, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ReferenceCheckProgressBar } from '@/components/statements/ReferenceCheckProgressBar';
import { StatementFilterBar, type FilterState } from '@/components/statements/StatementFilterBar';
import { StatementTable } from '@/components/statements/StatementTable';
import { AddStatementForm } from '@/components/statements/AddStatementForm';
import { useStatements } from '@/hooks/useStatements';
import { useAuthContext } from '@/context/AuthContext';
import { useToast } from '@/components/ui/use-toast';

export default function StatementsPage() {
  const { id: engagementId } = useParams<{ id: string }>();
  const { user } = useAuthContext();
  const { toast } = useToast();

  const {
    statements,
    loading,
    fetchStatements,
    createStatement,
    waiveStatement,
    deleteStatement,
    passed,
    waived,
    failed,
    inReview,
    notStarted,
  } = useStatements(engagementId ?? '');

  const [filters, setFilters] = useState<FilterState>({
    refStatus: null,
    assignedTo: null,
    search: '',
  });
  const [addStatementOpen, setAddStatementOpen] = useState(false);

  // Determine role permissions
  const canAdd = user?.roles.some((r) => ['AN', 'EM', 'AD'].includes(r)) ?? false;
  const canWaive = user?.roles.some((r) => ['EM', 'AD'].includes(r)) ?? false;
  const canDelete = user?.roles.some((r) => ['AN', 'EM', 'AD'].includes(r)) ?? false;

  const hasActiveFilters =
    filters.refStatus !== null || filters.assignedTo !== null || filters.search !== '';

  const allComplete =
    statements.length > 0 && failed === 0 && inReview === 0 && notStarted === 0;

  // Apply client-side search filter
  const filteredStatements = statements.filter((s) => {
    if (filters.search && filters.search.length >= 2) {
      if (!s.statement_text.toLowerCase().includes(filters.search.toLowerCase())) return false;
    }
    return true;
  });

  // Fetch on mount and filter changes
  useEffect(() => {
    if (!engagementId) return;
    fetchStatements({
      ref_status: filters.refStatus,
      assigned_to: filters.assignedTo,
      search: filters.search,
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [engagementId, filters.refStatus, filters.assignedTo]);

  async function handleCreateStatement(text: string, evidenceIds: string[]) {
    if (!engagementId) return;
    await createStatement({ statement_text: text, evidence_ids: evidenceIds });
    toast({ title: 'Statement saved.' });
    setAddStatementOpen(false);
    fetchStatements({ ref_status: filters.refStatus, assigned_to: filters.assignedTo, search: filters.search });
  }

  async function handleWaive(statementId: string, justification: string) {
    await waiveStatement(statementId, justification);
    toast({ title: 'Reference check waived.' });
    fetchStatements({ ref_status: filters.refStatus, assigned_to: filters.assignedTo, search: filters.search });
  }

  async function handleDelete(statementId: string) {
    await deleteStatement(statementId);
    fetchStatements({ ref_status: filters.refStatus, assigned_to: filters.assignedTo, search: filters.search });
  }

  function handleFilterChange(newFilters: FilterState) {
    setFilters(newFilters);
    fetchStatements({
      ref_status: newFilters.refStatus,
      assigned_to: newFilters.assignedTo,
      search: newFilters.search,
    });
  }

  const total = passed + waived + failed + inReview + notStarted;

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <nav className="text-sm text-muted-foreground">
        <Link to="/engagements" className="hover:text-foreground">Engagements</Link>
        {' > '}
        <Link to={`/engagements/${engagementId}`} className="hover:text-foreground">
          {engagementId}
        </Link>
        {' > '}
        <Link to={`/engagements/${engagementId}`} className="hover:text-foreground">
          Draft Product
        </Link>
        {' > '}
        <span className="text-foreground">Statements</span>
      </nav>

      {/* Page header */}
      <div>
        <h1 className="text-xl font-semibold">Statements</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Reference check indexing for this draft product.
        </p>
      </div>

      {/* Reference Check Progress */}
      <div className="rounded-md border p-4 space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Reference Check Progress
        </h2>
        <ReferenceCheckProgressBar
          passed={passed}
          waived={waived}
          failed={failed}
          inReview={inReview}
          notStarted={notStarted}
        />
      </div>

      {/* All complete banner */}
      {allComplete && (
        <div className="rounded-md bg-green-100 border border-green-200 p-3 flex items-center gap-2">
          <CheckCircle size={16} className="text-green-800 shrink-0" />
          <p className="text-sm text-green-800">
            ✅ All reference checks are Passed or Waived. P4 prerequisites met.
          </p>
        </div>
      )}

      {/* Filter bar + Add CTA */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <StatementFilterBar filters={filters} onFilterChange={handleFilterChange} />
        {canAdd && (
          <Button onClick={() => setAddStatementOpen(true)} className="gap-1.5">
            <Plus size={14} />
            Add Statement
          </Button>
        )}
      </div>

      {/* Table or empty states */}
      {loading ? (
        <StatementTable
          statements={[]}
          loading={true}
          canWaive={canWaive}
          canDelete={canDelete}
          onWaive={handleWaive}
          onDelete={handleDelete}
        />
      ) : total === 0 ? (
        /* No statements at all */
        <div className="flex flex-col items-center py-16 text-center gap-3">
          <FileText size={32} className="text-slate-300" />
          <h2 className="text-base font-medium text-foreground">No statements yet.</h2>
          <p className="text-sm text-muted-foreground max-w-sm">
            Add draft statements to begin the reference check process. Each statement must be linked
            to supporting evidence before assignment.
          </p>
          {canAdd && (
            <Button onClick={() => setAddStatementOpen(true)} className="gap-1.5 mt-2">
              <Plus size={14} />
              Add Statement
            </Button>
          )}
        </div>
      ) : filteredStatements.length === 0 && hasActiveFilters ? (
        /* Filter active but no results */
        <div className="flex flex-col items-center py-16 text-center gap-3">
          <SearchX size={32} className="text-slate-300" />
          <h2 className="text-base font-medium text-foreground">No statements match your filters.</h2>
          <p className="text-sm text-muted-foreground">
            Try different filters or clear them to see all statements.
          </p>
          <Button
            variant="ghost"
            onClick={() => handleFilterChange({ refStatus: null, assignedTo: null, search: '' })}
          >
            Clear filters
          </Button>
        </div>
      ) : (
        <StatementTable
          statements={filteredStatements}
          loading={false}
          canWaive={canWaive}
          canDelete={canDelete}
          onWaive={handleWaive}
          onDelete={handleDelete}
        />
      )}

      {/* Add Statement Dialog */}
      {engagementId && (
        <AddStatementForm
          engagementId={engagementId}
          open={addStatementOpen}
          onSave={handleCreateStatement}
          onCancel={() => setAddStatementOpen(false)}
        />
      )}
    </div>
  );
}
