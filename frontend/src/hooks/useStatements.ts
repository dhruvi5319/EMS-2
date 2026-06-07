import { useState, useCallback } from 'react';
import { api } from '@/lib/api';

export type RefStatus = 'not_started' | 'in_review' | 'passed' | 'failed' | 'waived';

export interface Statement {
  id: string;
  engagement_id: string;
  draft_product_id: string;
  statement_text: string;
  ref_status: RefStatus;
  display_order: number;
  assigned_to: string | null;
  assigned_ir_name: string | null;
  discrepancy_notes: string | null;
  evidence_ids: string[];
  evidence_count: number;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface StatementFilters {
  ref_status?: string | null;
  assigned_to?: string | null;
  search?: string;
}

export interface CreateStatementInput {
  statement_text: string;
  evidence_ids: string[];
}

export interface UpdateStatementInput {
  statement_text?: string;
  evidence_ids?: string[];
  ref_status?: string;
  discrepancy_notes?: string | null;
  assigned_to?: string | null;
}

export function useStatements(engagementId: string) {
  const [statements, setStatements] = useState<Statement[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filter state
  const [refStatus, setRefStatus] = useState<string | null>(null);
  const [assignedTo, setAssignedTo] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const fetchStatements = useCallback(
    async (filters?: StatementFilters) => {
      setLoading(true);
      setError(null);
      try {
        const activeFilters = filters ?? { ref_status: refStatus, assigned_to: assignedTo, search };
        const params = new URLSearchParams();
        if (activeFilters.ref_status) params.set('ref_status', activeFilters.ref_status);
        if (activeFilters.assigned_to) params.set('assigned_to', activeFilters.assigned_to);
        const qs = params.toString();

        const result = await api.get<{ statements: Statement[]; total: number }>(
          `/api/engagements/${engagementId}/statements${qs ? `?${qs}` : ''}`
        );

        if (result.ok) {
          let data = result.data.statements;
          // Client-side search filter if search term provided
          if (activeFilters.search && activeFilters.search.length >= 2) {
            const term = activeFilters.search.toLowerCase();
            data = data.filter((s) => s.statement_text.toLowerCase().includes(term));
          }
          setStatements(data);
          setTotal(result.data.total);
        } else {
          setError(result.error ?? 'Failed to load statements');
        }
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : 'Failed to load statements');
      } finally {
        setLoading(false);
      }
    },
    [engagementId, refStatus, assignedTo, search]
  );

  const createStatement = useCallback(
    async (data: CreateStatementInput): Promise<Statement | null> => {
      const result = await api.post<{ statement: Statement }>(
        `/api/engagements/${engagementId}/statements`,
        data
      );
      if (result.ok) {
        return result.data.statement;
      }
      throw new Error(result.error ?? 'Failed to create statement');
    },
    [engagementId]
  );

  const updateStatement = useCallback(
    async (statementId: string, data: UpdateStatementInput): Promise<Statement | null> => {
      const result = await api.patch<{ statement: Statement }>(
        `/api/engagements/${engagementId}/statements/${statementId}`,
        data
      );
      if (result.ok) {
        return result.data.statement;
      }
      throw new Error(result.error ?? 'Failed to update statement');
    },
    [engagementId]
  );

  const deleteStatement = useCallback(
    async (statementId: string): Promise<void> => {
      const result = await api.delete<{ ok: boolean }>(
        `/api/engagements/${engagementId}/statements/${statementId}`
      );
      if (!result.ok) {
        const err = new Error(result.error ?? 'Failed to delete statement') as Error & {
          status?: number;
        };
        err.status = result.status;
        throw err;
      }
    },
    [engagementId]
  );

  const waiveStatement = useCallback(
    async (statementId: string, justification: string): Promise<Statement | null> => {
      return updateStatement(statementId, {
        ref_status: 'waived',
        discrepancy_notes: justification,
      });
    },
    [updateStatement]
  );

  // Computed counts from current statements list
  const passed = statements.filter((s) => s.ref_status === 'passed').length;
  const waived = statements.filter((s) => s.ref_status === 'waived').length;
  const failed = statements.filter((s) => s.ref_status === 'failed').length;
  const inReview = statements.filter((s) => s.ref_status === 'in_review').length;
  const notStarted = statements.filter((s) => s.ref_status === 'not_started').length;

  return {
    statements,
    total,
    loading,
    error,
    // Filter state
    refStatus,
    setRefStatus,
    assignedTo,
    setAssignedTo,
    search,
    setSearch,
    // Actions
    fetchStatements,
    createStatement,
    updateStatement,
    deleteStatement,
    waiveStatement,
    // Computed counts
    passed,
    waived,
    failed,
    inReview,
    notStarted,
  };
}
