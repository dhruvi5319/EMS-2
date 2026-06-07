import React, { useState, useCallback, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Download, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useAuthContext } from '@/context/AuthContext';
import { usePortfolio, type PortfolioFilters, type PortfolioSort } from '@/hooks/usePortfolio';
import { PhaseStatCardRow } from '@/components/dashboard/PhaseStatCardRow';
import { DashboardFilterBar } from '@/components/dashboard/DashboardFilterBar';
import { EngagementRegisterTable } from '@/components/dashboard/EngagementRegisterTable';

export function PortfolioDashboardPage() {
  const { user } = useAuthContext();
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const [csvExporting, setCsvExporting] = useState(false);

  const {
    engagements,
    total,
    loading,
    phaseCounts,
    filters,
    sort,
    page,
    pageSize,
    updateFilters,
    updateSort,
    updatePage,
    exportCSV,
  } = usePortfolio();

  // IR role cannot see Export button
  const canExport = !user?.roles?.includes('IR');

  // Derive active phases from filter state (for stat card active state)
  const activePhases = filters.phase ?? [];

  // Sync filters from URL params on mount (read-only — actual data fetch handled by usePortfolio)
  useEffect(() => {
    const phaseParam = searchParams.get('phase');
    const riskParam = searchParams.get('risk');
    const statusParam = searchParams.get('status');
    const searchParam = searchParams.get('search');

    const hasUrlFilters = phaseParam || riskParam || statusParam || searchParam;
    if (hasUrlFilters) {
      const initialFilters: PortfolioFilters = {};
      if (phaseParam) initialFilters.phase = phaseParam.split(',');
      if (riskParam) initialFilters.risk = riskParam;
      if (statusParam) initialFilters.status = statusParam;
      if (searchParam) initialFilters.search = searchParam;
      updateFilters(initialFilters);
    }
    // Only run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync filters to URL params
  const syncToUrl = useCallback(
    (newFilters: PortfolioFilters, newPage: number) => {
      const params = new URLSearchParams();
      if (newFilters.phase && newFilters.phase.length > 0) {
        params.set('phase', newFilters.phase.join(','));
      }
      if (newFilters.risk) params.set('risk', newFilters.risk);
      if (newFilters.status) params.set('status', newFilters.status);
      if (newFilters.search) params.set('search', newFilters.search);
      if (newPage > 0) params.set('offset', String(newPage * pageSize));
      setSearchParams(params, { replace: true });
    },
    [setSearchParams, pageSize]
  );

  const handleFiltersChange = useCallback(
    (newFilters: PortfolioFilters) => {
      updateFilters(newFilters);
      syncToUrl(newFilters, 0);
    },
    [updateFilters, syncToUrl]
  );

  const handlePhaseClick = useCallback(
    (phase: string) => {
      const currentPhases = filters.phase ?? [];
      let newPhases: string[];

      if (currentPhases.includes(phase)) {
        // Toggle off
        newPhases = currentPhases.filter((p) => p !== phase);
      } else {
        // Toggle on (single selection via stat card)
        newPhases = [phase];
      }

      const newFilters: PortfolioFilters = { ...filters };
      if (newPhases.length > 0) {
        newFilters.phase = newPhases;
      } else {
        delete newFilters.phase;
      }
      handleFiltersChange(newFilters);
    },
    [filters, handleFiltersChange]
  );

  const handleSortChange = useCallback(
    (newSort: PortfolioSort) => {
      updateSort(newSort);
    },
    [updateSort]
  );

  const handlePageChange = useCallback(
    (newPage: number) => {
      updatePage(newPage);
      syncToUrl(filters, newPage);
    },
    [updatePage, filters, syncToUrl]
  );

  const handleClearFilters = useCallback(() => {
    handleFiltersChange({});
  }, [handleFiltersChange]);

  const handleExportCSV = useCallback(async () => {
    setCsvExporting(true);
    try {
      await exportCSV(filters);
      toast({ title: 'Engagement register exported.' });
    } catch {
      toast({ title: 'Export failed. Please try again.', variant: 'destructive' });
    } finally {
      setCsvExporting(false);
    }
  }, [exportCSV, filters, toast]);

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '24px 24px' }}>
      {/* Page header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 24,
        }}
      >
        <h1 style={{ fontSize: 20, fontWeight: 600, margin: 0 }}>Portfolio Dashboard</h1>

        {/* Export CSV button — hidden for IR role */}
        {canExport && (
          <Button
            variant="outline"
            onClick={handleExportCSV}
            disabled={csvExporting}
            style={{ height: 36 }}
            aria-label="Export engagement register to CSV (applies current filters)"
          >
            {csvExporting ? (
              <>
                <Loader2 size={14} className="animate-spin" style={{ marginRight: 6 }} />
                Exporting...
              </>
            ) : (
              <>
                <Download size={14} style={{ marginRight: 6 }} />
                Export to CSV ↓
              </>
            )}
          </Button>
        )}
      </div>

      {/* Section 1 — Phase Stat Cards */}
      <div style={{ marginBottom: 24 }}>
        <PhaseStatCardRow
          counts={phaseCounts}
          loading={loading && engagements.length === 0}
          activePhases={activePhases}
          onPhaseClick={handlePhaseClick}
        />
      </div>

      {/* Section 2 — Filter Bar */}
      <div style={{ marginBottom: 16 }}>
        <DashboardFilterBar filters={filters} onFiltersChange={handleFiltersChange} />
      </div>

      {/* Section 3 — Engagement Register Table */}
      <EngagementRegisterTable
        engagements={engagements}
        total={total}
        loading={loading}
        sort={sort}
        onSortChange={handleSortChange}
        page={page}
        pageSize={pageSize}
        onPageChange={handlePageChange}
        filters={filters}
        onClearFilters={handleClearFilters}
      />
    </div>
  );
}
