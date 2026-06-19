import { useState, useEffect } from 'react';
import { Check, ChevronDown, ChevronUp, Loader2, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { api } from '@/lib/api';

interface EvidenceOption {
  id: string;
  source: string;
  evidence_type: string;
}

interface AddStatementFormProps {
  engagementId: string;
  open: boolean;
  onSave: (statementText: string, evidenceIds: string[]) => Promise<void>;
  onCancel: () => void;
}

export function AddStatementForm({
  engagementId,
  open,
  onSave,
  onCancel,
}: AddStatementFormProps) {
  const [statementText, setStatementText] = useState('');
  const [selectedEvidenceIds, setSelectedEvidenceIds] = useState<string[]>([]);
  const [evidenceOptions, setEvidenceOptions] = useState<EvidenceOption[]>([]);
  const [loadingEvidence, setLoadingEvidence] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<{ text?: string; evidence?: string }>({});
  const [evidencePickerOpen, setEvidencePickerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch evidence list when dialog opens
  useEffect(() => {
    if (!open) return;
    setLoadingEvidence(true);
    api
      .get<{ evidence: EvidenceOption[] }>(`/api/engagements/${engagementId}/evidence`)
      .then((res) => {
        if (res.ok) setEvidenceOptions(res.data.evidence);
      })
      .finally(() => setLoadingEvidence(false));
  }, [open, engagementId]);

  function handleToggleEvidence(id: string) {
    setSelectedEvidenceIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  }

  function handleRemoveEvidence(id: string) {
    setSelectedEvidenceIds((prev) => prev.filter((i) => i !== id));
  }

  function validate() {
    const errs: { text?: string; evidence?: string } = {};
    if (!statementText.trim()) {
      errs.text = 'Statement text is required.';
    }
    if (selectedEvidenceIds.length === 0) {
      errs.evidence = 'At least one evidence item must be linked to a statement.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSave() {
    if (!validate()) return;
    setSaving(true);
    try {
      await onSave(statementText.trim(), selectedEvidenceIds);
      // Reset on success
      setStatementText('');
      setSelectedEvidenceIds([]);
      setErrors({});
      setEvidencePickerOpen(false);
      setSearchQuery('');
    } catch (e: unknown) {
      setErrors({ text: e instanceof Error ? e.message : 'Failed to save statement.' });
    } finally {
      setSaving(false);
    }
  }

  function handleCancel() {
    setStatementText('');
    setSelectedEvidenceIds([]);
    setErrors({});
    setEvidencePickerOpen(false);
    setSearchQuery('');
    onCancel();
  }

  const selectedEvidence = evidenceOptions.filter((e) => selectedEvidenceIds.includes(e.id));
  const filteredEvidence = evidenceOptions.filter((item) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.source.toLowerCase().includes(q) ||
      item.evidence_type.toLowerCase().includes(q)
    );
  });

  return (
    <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen) handleCancel(); }}>
      <DialogContent className="max-w-[520px]">
        <DialogHeader>
          <DialogTitle>Add Statement</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Statement Text */}
          <div>
            <label className="text-sm font-medium block mb-1.5">
              Statement Text <span className="text-destructive">*</span>
            </label>
            <Textarea
              value={statementText}
              onChange={(e) => setStatementText(e.target.value)}
              placeholder="Enter the statement text..."
              rows={4}
              className={errors.text ? 'border-destructive' : ''}
              disabled={saving}
            />
            {errors.text && (
              <p className="text-xs text-destructive mt-1">{errors.text}</p>
            )}
          </div>

          {/* Evidence Multi-Select — inline collapsible list, no Popover portal */}
          <div>
            <label className="text-sm font-medium block mb-1.5">
              Evidence Items <span className="text-destructive">*</span>
            </label>

            {/* Toggle button */}
            <button
              type="button"
              onClick={() => setEvidencePickerOpen((prev) => !prev)}
              disabled={saving || loadingEvidence}
              className={cn(
                'w-full flex items-center justify-between px-3 py-2 text-sm rounded-md border bg-background hover:bg-accent/50 transition-colors',
                errors.evidence ? 'border-destructive' : 'border-input'
              )}
            >
              <span className={selectedEvidenceIds.length === 0 ? 'text-muted-foreground' : ''}>
                {loadingEvidence
                  ? 'Loading evidence...'
                  : selectedEvidenceIds.length === 0
                  ? 'Select evidence items...'
                  : `${selectedEvidenceIds.length} item${selectedEvidenceIds.length !== 1 ? 's' : ''} selected`}
              </span>
              {evidencePickerOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>

            {/* Inline dropdown list */}
            {evidencePickerOpen && !loadingEvidence && (
              <div className="mt-1 border rounded-md bg-background shadow-sm">
                {/* Search input */}
                <div className="p-2 border-b">
                  <Input
                    placeholder="Search evidence..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-8 text-sm"
                    autoFocus={false}
                  />
                </div>
                {/* Evidence list */}
                <div className="max-h-[200px] overflow-y-auto">
                  {filteredEvidence.length === 0 ? (
                    <p className="px-3 py-4 text-sm text-muted-foreground text-center">
                      No evidence found.
                    </p>
                  ) : (
                    filteredEvidence.map((item) => {
                      const isSelected = selectedEvidenceIds.includes(item.id);
                      return (
                        <label
                          key={item.id}
                          className={cn(
                            'flex items-start gap-3 px-3 py-2 cursor-pointer hover:bg-accent/50 select-none',
                            isSelected && 'bg-blue-50'
                          )}
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleToggleEvidence(item.id)}
                            className="mt-0.5 h-4 w-4 rounded border-gray-300 text-primary"
                          />
                          <div className="flex flex-col min-w-0">
                            <span className="text-sm truncate">{item.source}</span>
                            <span className="text-xs text-muted-foreground capitalize">
                              {item.evidence_type.replace(/_/g, ' ')}
                            </span>
                          </div>
                          {isSelected && (
                            <Check size={14} className="ml-auto shrink-0 text-blue-600 mt-0.5" />
                          )}
                        </label>
                      );
                    })
                  )}
                </div>
              </div>
            )}

            {errors.evidence && (
              <p className="text-xs text-destructive mt-1">{errors.evidence}</p>
            )}

            {/* Selected evidence chips */}
            {selectedEvidence.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {selectedEvidence.map((item) => (
                  <span
                    key={item.id}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs bg-blue-50 text-blue-800 border border-blue-200"
                  >
                    {item.source}
                    <button
                      type="button"
                      onClick={() => handleRemoveEvidence(item.id)}
                      className="text-blue-400 hover:text-blue-700"
                      disabled={saving}
                    >
                      <X size={10} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" onClick={handleCancel} disabled={saving}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? (
                <>
                  <Loader2 size={14} className="mr-1 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Statement'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
