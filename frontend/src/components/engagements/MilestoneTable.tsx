import { useState } from 'react';
import { format, parseISO } from 'date-fns';
import { CalendarIcon, Loader2 } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { MilestoneStatusChip } from './MilestoneStatusChip';
import type { Milestone } from '@/lib/team.api';

const MILESTONE_LABELS: Record<string, string> = {
  planning_approval: 'Planning Approval (P2)',
  evidence_readiness: 'Evidence Readiness (P3)',
  draft_readiness: 'Draft Readiness',
  final_readiness: 'Final Readiness (P4)',
};

const MILESTONE_ORDER = [
  'planning_approval',
  'evidence_readiness',
  'draft_readiness',
  'final_readiness',
];

interface MilestoneTableProps {
  engagementId: string;
  milestones: Milestone[];
  canEdit: boolean;
  onSave: (updates: Array<{ milestone_type: string; target_date: string }>) => Promise<void>;
}

export function MilestoneTable({
  milestones,
  canEdit,
  onSave,
}: MilestoneTableProps) {
  // Build editable date state keyed by milestone_type
  const initialDates: Record<string, Date | undefined> = {};
  for (const m of milestones) {
    initialDates[m.milestone_type] = m.target_date
      ? parseISO(m.target_date)
      : undefined;
  }
  const [dates, setDates] = useState<Record<string, Date | undefined>>(initialDates);
  const [saving, setSaving] = useState(false);
  const [dateErrors, setDateErrors] = useState<Record<string, string>>({});

  // Update dates when milestones prop changes (refresh after save)
  const [lastMilestones, setLastMilestones] = useState(milestones);
  if (milestones !== lastMilestones) {
    setLastMilestones(milestones);
    const refreshed: Record<string, Date | undefined> = {};
    for (const m of milestones) {
      refreshed[m.milestone_type] = m.target_date ? parseISO(m.target_date) : undefined;
    }
    setDates(refreshed);
  }

  function validateDateOrder(): boolean {
    const errors: Record<string, string> = {};
    const orderedDates = MILESTONE_ORDER.map((type) => ({
      type,
      date: dates[type],
    }));

    for (let i = 1; i < orderedDates.length; i++) {
      const prev = orderedDates[i - 1];
      const curr = orderedDates[i];
      if (prev.date && curr.date && prev.date >= curr.date) {
        errors[curr.type] = 'Milestone dates must be in chronological order.';
      }
    }
    setDateErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSave() {
    if (!validateDateOrder()) return;

    const updates = MILESTONE_ORDER.filter((type) => dates[type]).map((type) => ({
      milestone_type: type,
      target_date: dates[type]!.toISOString().split('T')[0],
    }));

    setSaving(true);
    try {
      await onSave(updates);
    } finally {
      setSaving(false);
    }
  }

  // Build milestone map from array
  const milestoneByType: Record<string, Milestone> = {};
  for (const m of milestones) {
    milestoneByType[m.milestone_type] = m;
  }

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Milestone</TableHead>
            <TableHead>Target Date</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {MILESTONE_ORDER.map((type) => {
            const m = milestoneByType[type];
            const status = m?.status ?? 'not_started';
            const selectedDate = dates[type];

            return (
              <>
                <TableRow key={type} className="h-12">
                  <TableCell className="text-sm font-medium">
                    {MILESTONE_LABELS[type] ?? type}
                  </TableCell>
                  <TableCell>
                    {canEdit ? (
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="h-9 text-sm justify-start gap-2"
                            aria-label={`Set ${MILESTONE_LABELS[type] ?? type} target date`}
                          >
                            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                            {selectedDate ? (
                              format(selectedDate, 'MM/dd/yyyy')
                            ) : (
                              <span className="text-muted-foreground">Not Set</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={selectedDate}
                            onSelect={(d) => {
                              setDates((prev) => ({ ...prev, [type]: d }));
                              setDateErrors((prev) => {
                                const next = { ...prev };
                                delete next[type];
                                return next;
                              });
                            }}
                          />
                        </PopoverContent>
                      </Popover>
                    ) : (
                      <span className="text-sm">
                        {selectedDate ? format(selectedDate, 'MM/dd/yyyy') : 'Not Set'}
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    <MilestoneStatusChip status={status} />
                  </TableCell>
                </TableRow>
                {dateErrors[type] && (
                  <TableRow key={`${type}-error`}>
                    <TableCell colSpan={3} className="py-0 pb-2">
                      <p className="text-xs text-destructive">{dateErrors[type]}</p>
                    </TableCell>
                  </TableRow>
                )}
              </>
            );
          })}
        </TableBody>
      </Table>

      {canEdit && (
        <div className="flex justify-start">
          <Button
            className="h-10 bg-primary text-primary-foreground"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Milestones'
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
