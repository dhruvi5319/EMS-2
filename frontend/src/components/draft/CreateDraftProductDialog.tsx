import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { listTeam } from '@/lib/team.api';

interface TeamMember {
  user_id: string;
  display_name: string;
  role: string;
}

interface CreateDraftProductDialogProps {
  open: boolean;
  engagementId: string;
  p3Approved: boolean;
  onClose: () => void;
  onCreated: (data: { title: string; version: string; owner_id: string }) => Promise<void>;
}

export function CreateDraftProductDialog({
  open,
  engagementId,
  p3Approved,
  onClose,
  onCreated,
}: CreateDraftProductDialogProps) {
  const [title, setTitle] = useState('');
  const [version, setVersion] = useState('v1.0');
  const [ownerId, setOwnerId] = useState('');
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<{ title?: string; version?: string; owner?: string }>({});

  useEffect(() => {
    if (!open || !engagementId) return;
    listTeam(engagementId).then(({ assignments }) => {
      setTeamMembers(
        assignments.map((a) => ({
          user_id: a.user_id,
          display_name: a.user.display_name,
          role: a.role,
        }))
      );
    }).catch(() => {/* non-blocking */});
  }, [open, engagementId]);

  function validate() {
    const errs: typeof errors = {};
    if (!title.trim()) errs.title = 'Title is required.';
    if (!version.trim()) errs.version = 'Version is required.';
    if (!ownerId) errs.owner = 'Owner is required.';
    return errs;
  }

  async function handleSubmit() {
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setSaving(true);
    try {
      await onCreated({ title: title.trim(), version: version.trim(), owner_id: ownerId });
      handleClose();
    } finally {
      setSaving(false);
    }
  }

  function handleClose() {
    setTitle('');
    setVersion('v1.0');
    setOwnerId('');
    setErrors({});
    onClose();
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent className="max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Create Draft Product Record</DialogTitle>
        </DialogHeader>

        {!p3Approved && (
          <Alert>
            <AlertDescription>
              Gate P3 must be approved before creating a draft product.
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-4 mt-2">
          <div className="space-y-1.5">
            <Label htmlFor="draft-title">
              Title <span className="text-destructive">*</span>
            </Label>
            <Input
              id="draft-title"
              placeholder="e.g., Review of Budget Control Systems FY2026"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              aria-invalid={!!errors.title}
            />
            {errors.title && (
              <p className="text-xs text-destructive">{errors.title}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="draft-version">
              Version <span className="text-destructive">*</span>
            </Label>
            <Input
              id="draft-version"
              placeholder="v1.0"
              value={version}
              onChange={(e) => setVersion(e.target.value)}
              aria-invalid={!!errors.version}
            />
            {errors.version && (
              <p className="text-xs text-destructive">{errors.version}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="draft-owner">
              Owner <span className="text-destructive">*</span>
            </Label>
            <Select value={ownerId} onValueChange={setOwnerId}>
              <SelectTrigger id="draft-owner" aria-invalid={!!errors.owner}>
                <SelectValue placeholder="Select owner..." />
              </SelectTrigger>
              <SelectContent>
                {teamMembers.map((m) => (
                  <SelectItem key={m.user_id} value={m.user_id}>
                    {m.display_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Must be an active user assigned to this engagement.
            </p>
            {errors.owner && (
              <p className="text-xs text-destructive">{errors.owner}</p>
            )}
          </div>
        </div>

        <div className="flex justify-between mt-4">
          <Button variant="ghost" onClick={handleClose} disabled={saving}>
            Discard Draft
          </Button>
          <Button onClick={handleSubmit} disabled={saving}>
            {saving ? (
              <>
                <Loader2 size={14} className="mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              'Create Draft Product'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
