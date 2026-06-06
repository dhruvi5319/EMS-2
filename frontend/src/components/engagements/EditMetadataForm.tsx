import { useState } from 'react';
import { updateEngagement } from '@/lib/engagements.api';
import type { Engagement } from '@/lib/engagements.api';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from '@/components/ui/use-toast';

interface EditMetadataFormProps {
  engagement: Engagement;
  onSave: (updated: Engagement) => void;
  onDiscard: () => void;
}

interface FormErrors {
  title?: string;
  portfolio?: string;
}

export function EditMetadataForm({ engagement, onSave, onDiscard }: EditMetadataFormProps) {
  const [title, setTitle] = useState(engagement.title ?? '');
  const [status, setStatus] = useState(engagement.status ?? 'active');
  const [riskLevel, setRiskLevel] = useState(engagement.risk_level ?? '');
  const [portfolio, setPortfolio] = useState(engagement.portfolio ?? '');
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  function validate(): boolean {
    const errs: FormErrors = {};
    if (!title.trim()) errs.title = 'Title is required.';
    if (title.length > 500) errs.title = 'Title must be 500 characters or fewer.';
    if (portfolio.length > 255) errs.portfolio = 'Portfolio must be 255 characters or fewer.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSave() {
    if (!validate()) return;
    setSaving(true);
    try {
      const result = await updateEngagement(engagement.id, {
        title: title.trim(),
        status,
        risk_level: riskLevel || undefined,
        portfolio: portfolio.trim() || undefined,
      });
      toast({
        title: 'Engagement updated.',
        description: 'Metadata saved successfully.',
      });
      onSave(result.engagement);
    } catch (err) {
      toast({
        title: 'Failed to save changes.',
        description: err instanceof Error ? err.message : 'An error occurred.',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-4">
      <h3 className="text-base font-semibold text-foreground">Edit Metadata</h3>

      {/* Title */}
      <div className="space-y-1">
        <Label htmlFor="edit-title">
          Title <span className="text-destructive">*</span>
        </Label>
        <Input
          id="edit-title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          onBlur={validate}
          maxLength={500}
          placeholder="Engagement title"
          aria-describedby={errors.title ? 'edit-title-error' : undefined}
          aria-invalid={!!errors.title}
        />
        {errors.title && (
          <p id="edit-title-error" className="text-xs text-destructive">{errors.title}</p>
        )}
      </div>

      {/* Status */}
      <div className="space-y-1">
        <Label htmlFor="edit-status">Status</Label>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger id="edit-status" className="w-full">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="on_hold">On Hold</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Risk Level */}
      <div className="space-y-2">
        <Label>Risk Level</Label>
        <RadioGroup
          value={riskLevel}
          onValueChange={setRiskLevel}
          className="flex gap-4"
        >
          <div className="flex items-center gap-2">
            <RadioGroupItem value="low" id="risk-low" />
            <Label htmlFor="risk-low" className="cursor-pointer font-normal">Low</Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="medium" id="risk-medium" />
            <Label htmlFor="risk-medium" className="cursor-pointer font-normal">Medium</Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="high" id="risk-high" />
            <Label htmlFor="risk-high" className="cursor-pointer font-normal">High</Label>
          </div>
        </RadioGroup>
      </div>

      {/* Portfolio */}
      <div className="space-y-1">
        <Label htmlFor="edit-portfolio">Portfolio</Label>
        <Input
          id="edit-portfolio"
          value={portfolio}
          onChange={e => setPortfolio(e.target.value)}
          onBlur={validate}
          maxLength={255}
          placeholder="Portfolio name (optional)"
          aria-describedby={errors.portfolio ? 'edit-portfolio-error' : undefined}
          aria-invalid={!!errors.portfolio}
        />
        {errors.portfolio && (
          <p id="edit-portfolio-error" className="text-xs text-destructive">{errors.portfolio}</p>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-2">
        <Button
          type="button"
          variant="ghost"
          onClick={onDiscard}
          disabled={saving}
        >
          Discard Changes
        </Button>
        <Button
          type="button"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? (
            <>
              <span className="inline-block w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" aria-hidden="true" />
              Saving...
            </>
          ) : (
            'Save Changes'
          )}
        </Button>
      </div>
    </div>
  );
}
