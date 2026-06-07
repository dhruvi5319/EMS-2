import { useState } from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { StatementNavigationButtons } from './StatementNavigationButtons';

export type RefStatus = 'not_started' | 'in_review' | 'passed' | 'failed' | 'waived';

export interface UpdateStatementInput {
  ref_status: RefStatus;
  discrepancy_type?: string;
  discrepancy_notes?: string;
  assigned_back_to?: string | null;
}

export interface TeamMember {
  id: string;
  display_name: string;
  roles: string[];
}

export interface Statement {
  id: string;
  ref_status: RefStatus;
  discrepancy_type?: string | null;
  discrepancy_notes?: string | null;
  assigned_back_to?: string | null;
}

export interface ReferenceCheckDecisionPanelProps {
  statement: Statement;
  engagementId: string;
  teamMembers?: TeamMember[];
  onSave: (data: UpdateStatementInput) => Promise<void>;
  onNavigateNext: () => void;
  onNavigatePrev: () => void;
  isFirst: boolean;
  isLast: boolean;
}

const DISCREPANCY_TYPES = [
  { value: 'wrong_evidence_linked', label: 'Wrong evidence linked' },
  { value: 'missing_evidence', label: 'Missing evidence' },
  { value: 'statement_mismatch', label: 'Statement mismatch' },
  { value: 'insufficient_detail', label: 'Insufficient detail' },
];

export function ReferenceCheckDecisionPanel({
  statement,
  teamMembers = [],
  onSave,
  onNavigateNext,
  onNavigatePrev,
  isFirst,
  isLast,
}: ReferenceCheckDecisionPanelProps) {
  const [status, setStatus] = useState<RefStatus>(
    statement.ref_status === 'not_started' ? 'in_review' : statement.ref_status
  );
  const [discrepancyType, setDiscrepancyType] = useState(statement.discrepancy_type ?? '');
  const [discrepancyNotes, setDiscrepancyNotes] = useState(statement.discrepancy_notes ?? '');
  const [assignedBackTo, setAssignedBackTo] = useState(statement.assigned_back_to ?? '');
  const [loading, setLoading] = useState(false);
  const [notesError, setNotesError] = useState<string | null>(null);

  const isFailed = status === 'failed';

  const anMembers = teamMembers.filter((m) => m.roles.includes('AN'));

  const handleStatusChange = (val: string) => {
    setStatus(val as RefStatus);
    if (val !== 'failed') {
      setDiscrepancyType('');
      setDiscrepancyNotes('');
      setNotesError(null);
    }
  };

  const validate = (): boolean => {
    if (isFailed && !discrepancyNotes.trim()) {
      setNotesError('Discrepancy notes are required when reference status is Failed.');
      return false;
    }
    setNotesError(null);
    return true;
  };

  const buildPayload = (): UpdateStatementInput => ({
    ref_status: status,
    discrepancy_type: isFailed ? discrepancyType || undefined : undefined,
    discrepancy_notes: isFailed ? discrepancyNotes || undefined : undefined,
    assigned_back_to: isFailed && assignedBackTo ? assignedBackTo : null,
  });

  const handleSave = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await onSave(buildPayload());
    } finally {
      setLoading(false);
    }
  };

  const handleSaveNext = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await onSave(buildPayload());
      onNavigateNext();
    } finally {
      setLoading(false);
    }
  };

  const notesErrorId = 'discrepancy-notes-error';

  return (
    <section
      aria-label="Reference Check Decision"
      className="border border-border rounded-md p-4 bg-card space-y-4"
    >
      <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        Reference Check Decision
      </h3>

      {/* Status Radio Group */}
      <div className="space-y-2">
        <Label htmlFor="ref-status-group" className="text-sm font-medium">
          Status <span className="text-destructive">*</span>
        </Label>
        <RadioGroup
          id="ref-status-group"
          value={status}
          onValueChange={handleStatusChange}
          aria-label="Set reference status for this statement"
          className="flex flex-row gap-6"
        >
          <div className="flex items-center gap-2">
            <RadioGroupItem value="in_review" id="status-in-review" />
            <Label htmlFor="status-in-review" className="cursor-pointer font-normal">
              In Review
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="passed" id="status-passed" />
            <Label htmlFor="status-passed" className="cursor-pointer font-normal">
              Passed
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="failed" id="status-failed" />
            <Label htmlFor="status-failed" className="cursor-pointer font-normal">
              Failed
            </Label>
          </div>
        </RadioGroup>
      </div>

      {/* Discrepancy fields — shown only when Failed */}
      {isFailed && (
        <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Discrepancy Type */}
          <div className="space-y-1.5">
            <Label htmlFor="discrepancy-type" className="text-sm font-medium">
              Discrepancy Type <span className="text-destructive">*</span>
            </Label>
            <Select
              value={discrepancyType}
              onValueChange={setDiscrepancyType}
            >
              <SelectTrigger
                id="discrepancy-type"
                aria-label="Discrepancy type"
                aria-required="true"
                className={!discrepancyType && notesError ? 'border-destructive' : ''}
              >
                <SelectValue placeholder="Select discrepancy type..." />
              </SelectTrigger>
              <SelectContent>
                {DISCREPANCY_TYPES.map((dt) => (
                  <SelectItem key={dt.value} value={dt.value}>
                    {dt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Discrepancy Notes */}
          <div className="space-y-1.5">
            <Label htmlFor="discrepancy-notes" className="text-sm font-medium">
              Discrepancy Notes <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="discrepancy-notes"
              value={discrepancyNotes}
              onChange={(e) => {
                setDiscrepancyNotes(e.target.value);
                if (e.target.value.trim()) setNotesError(null);
              }}
              placeholder="Describe the discrepancy..."
              aria-required="true"
              aria-describedby={notesError ? notesErrorId : undefined}
              className={
                'min-h-[80px] ' + (notesError ? 'border-destructive focus-visible:ring-destructive' : '')
              }
            />
            {notesError && (
              <p id={notesErrorId} className="text-xs text-destructive">
                {notesError}
              </p>
            )}
          </div>

          {/* Assign Back To */}
          <div className="space-y-1.5">
            <Label htmlFor="assign-back-to" className="text-sm font-medium">
              Assign Back To{' '}
              <span className="text-muted-foreground font-normal">(optional)</span>
            </Label>
            <Select
              value={assignedBackTo || '__none__'}
              onValueChange={(val) => setAssignedBackTo(val === '__none__' ? '' : val)}
            >
              <SelectTrigger id="assign-back-to" aria-label="Assign back to analyst">
                <SelectValue placeholder="(Not assigned)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__none__">(Not assigned)</SelectItem>
                {anMembers.map((m) => (
                  <SelectItem key={m.id} value={m.id}>
                    {m.display_name} (Analyst)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <StatementNavigationButtons
        isFirst={isFirst}
        isLast={isLast}
        loading={loading}
        onNavigatePrev={onNavigatePrev}
        onSaveNext={handleSaveNext}
        onSave={handleSave}
      />
    </section>
  );
}
