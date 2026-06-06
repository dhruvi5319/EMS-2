import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { api } from '@/lib/api';
import { useEvidence } from '@/hooks/useEvidence';
import { EvidenceTypeBadge } from '@/components/evidence/EvidenceTypeBadge';
import { SensitivityBadge } from '@/components/evidence/SensitivityBadge';
import type { EvidenceType } from '@/components/evidence/EvidenceTypeBadge';
import type { Finding } from './FindingCard';

interface FormValues {
  finding_text: string;
  evidence_ids: string[];
}

interface AddFindingDialogProps {
  engagementId: string;
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
  finding?: Finding; // if provided, edit mode
}

function truncate(str: string, maxLen: number): string {
  if (str.length <= maxLen) return str;
  return str.slice(0, maxLen) + '…';
}

export const AddFindingDialog: React.FC<AddFindingDialogProps> = ({
  engagementId,
  open,
  onClose,
  onSaved,
  finding,
}) => {
  const { toast } = useToast();
  const isEditMode = !!finding;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
    setValue,
  } = useForm<FormValues>({
    defaultValues: {
      finding_text: '',
      evidence_ids: [],
    },
  });

  const { evidence: evidenceItems } = useEvidence(engagementId);
  const selectedIds = watch('evidence_ids') ?? [];

  // Populate form when editing
  useEffect(() => {
    if (open) {
      if (finding) {
        reset({
          finding_text: finding.finding_text,
          evidence_ids: finding.evidence_ids ?? [],
        });
      } else {
        reset({ finding_text: '', evidence_ids: [] });
      }
    }
  }, [open, finding, reset]);

  const handleCheckboxChange = (evidenceId: string, checked: boolean) => {
    const current = selectedIds;
    if (checked) {
      setValue('evidence_ids', [...current, evidenceId]);
    } else {
      setValue('evidence_ids', current.filter((id) => id !== evidenceId));
    }
  };

  const onSubmit = async (values: FormValues) => {
    try {
      let result;
      if (isEditMode && finding) {
        result = await api.patch(`/engagements/${engagementId}/findings/${finding.id}`, {
          finding_text: values.finding_text.trim(),
          evidence_ids: values.evidence_ids,
        });
      } else {
        result = await api.post(`/engagements/${engagementId}/findings`, {
          finding_text: values.finding_text.trim(),
          evidence_ids: values.evidence_ids,
        });
      }

      if (result.ok) {
        toast({ title: isEditMode ? 'Finding updated.' : 'Finding saved.' });
        onSaved();
        onClose();
      } else {
        toast({
          title: result.error ?? (isEditMode ? 'Failed to update finding.' : 'Failed to save finding.'),
          variant: 'destructive',
        });
      }
    } catch {
      toast({ title: 'An error occurred. Please try again.', variant: 'destructive' });
    }
  };

  const findingTextValue = watch('finding_text');
  const canSave = findingTextValue?.trim().length > 0;

  return (
    <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen) onClose(); }}>
      <DialogContent style={{ maxWidth: 520 }}>
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Edit Finding' : 'Add Finding'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Finding Text */}
          <div>
            <Label htmlFor="finding_text" style={{ fontSize: 14, fontWeight: 400 }}>
              Finding Text <span style={{ color: 'hsl(0 72% 51%)' }}>*</span>
            </Label>
            <Textarea
              id="finding_text"
              placeholder="e.g., Budget controls show systematic weaknesses in quarterly reconciliation processes for FY2026."
              rows={4}
              {...register('finding_text', { required: 'Finding text is required.' })}
              style={{ marginTop: 4 }}
            />
            {errors.finding_text && (
              <p role="alert" style={{ fontSize: 12, color: 'hsl(0 72% 51%)', marginTop: 4 }}>
                {errors.finding_text.message}
              </p>
            )}
            <p style={{ fontSize: 12, color: 'hsl(215 16% 47%)', marginTop: 4 }}>
              💡 Tip: Describe a clear conclusion or observation supported by your evidence.
            </p>
          </div>

          {/* Link to Evidence */}
          <div>
            <Label style={{ fontSize: 14, fontWeight: 400 }}>
              Link to Evidence (required before P3)
            </Label>
            <div
              style={{
                marginTop: 8,
                border: '1px solid hsl(214 32% 91%)',
                borderRadius: 6,
                maxHeight: 200,
                overflowY: 'auto',
              }}
            >
              {evidenceItems.length === 0 ? (
                <p style={{ fontSize: 12, color: 'hsl(215 16% 47%)', padding: 12 }}>
                  No evidence items found for this engagement.
                </p>
              ) : (
                evidenceItems.map((ev) => (
                  <label
                    key={ev.id}
                    htmlFor={`ev-${ev.id}`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      padding: '8px 12px',
                      cursor: 'pointer',
                      borderBottom: '1px solid hsl(214 32% 91%)',
                      fontSize: 13,
                    }}
                  >
                    <Checkbox
                      id={`ev-${ev.id}`}
                      checked={selectedIds.includes(ev.id)}
                      onCheckedChange={(checked) => handleCheckboxChange(ev.id, !!checked)}
                    />
                    <span
                      style={{
                        fontFamily: "ui-monospace, 'Cascadia Code', monospace",
                        fontSize: 12,
                        flexShrink: 0,
                      }}
                    >
                      {ev.id.slice(0, 8)}
                    </span>
                    <EvidenceTypeBadge type={ev.evidence_type as EvidenceType} />
                    <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {truncate(ev.source, 40)}
                    </span>
                    <SensitivityBadge sensitivity={ev.sensitivity} />
                  </label>
                ))
              )}
            </div>
            {/* Amber P3 warning */}
            <p
              style={{
                fontSize: 12,
                color: 'hsl(45 90% 28%)',
                marginTop: 6,
              }}
            >
              ⚠ At least one evidence item must be linked before Gate P3.
            </p>
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 8 }}>
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Discard Finding
            </Button>
            <Button
              type="submit"
              disabled={!canSave || isSubmitting}
              style={{ minWidth: 120, height: 40 }}
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} style={{ marginRight: 4 }} className="animate-spin" />
                  Saving…
                </>
              ) : isEditMode ? (
                'Update Finding'
              ) : (
                'Save Finding'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
