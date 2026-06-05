import { useState, FormEvent } from 'react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose,
} from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Eye, EyeOff } from 'lucide-react';
import { RoleCheckboxGroup } from './RoleCheckboxGroup';
import type { useUsers } from '@/hooks/useUsers';

interface CreateUserDialogProps {
  open: boolean;
  onClose: () => void;
  onCreate: ReturnType<typeof useUsers>['createUser'];
}

export function CreateUserDialog({ open, onClose, onCreate }: CreateUserDialogProps) {
  const { toast } = useToast();
  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [roles, setRoles] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState<string | null>(null);

  const reset = () => {
    setDisplayName('');
    setUsername('');
    setEmail('');
    setPassword('');
    setRoles([]);
    setErrors({});
    setApiError(null);
    setShowPassword(false);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!displayName.trim()) e.displayName = 'Full name is required.';
    if (!username.trim()) e.username = 'Username is required.';
    if (!email.trim()) e.email = 'Email is required.';
    if (!password) e.password = 'Password is required.';
    if (roles.length === 0) e.roles = 'At least one role is required.';
    return e;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setApiError(null);
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setSubmitting(true);
    try {
      await onCreate({ username, email, display_name: displayName, password, roles });
      toast({ title: 'User created successfully.' });
      reset();
      onClose();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to create user. Check required fields and try again.';
      setApiError(message);
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = 'w-full h-10 rounded-md border border-border px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring';
  const inputErrorClass = 'border-destructive focus:ring-destructive';

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) handleClose(); }}>
      <DialogContent className="max-w-[520px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Create New User</DialogTitle>
        </DialogHeader>

        {apiError && (
          <div role="alert" className="rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-destructive">
            {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Full Name *</label>
            <input
              className={`${inputClass} ${errors.displayName ? inputErrorClass : ''}`}
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Display name"
            />
            {errors.displayName && <p className="mt-1 text-xs text-destructive">{errors.displayName}</p>}
          </div>

          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Username *</label>
            <input
              className={`${inputClass} ${errors.username ? inputErrorClass : ''}`}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="username"
              autoComplete="off"
            />
            {errors.username && <p className="mt-1 text-xs text-destructive">{errors.username}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Email Address *</label>
            <input
              type="email"
              className={`${inputClass} ${errors.email ? inputErrorClass : ''}`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@example.com"
            />
            {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Password *</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                className={`${inputClass} pr-10 ${errors.password ? inputErrorClass : ''}`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((p) => !p)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && <p className="mt-1 text-xs text-destructive">{errors.password}</p>}
          </div>

          {/* Roles */}
          <div>
            <RoleCheckboxGroup
              selectedRoles={roles}
              onChange={setRoles}
              error={errors.roles}
            />
          </div>

          <DialogFooter className="pt-2">
            {/* [Discard] — exact copy from UI-SPEC */}
            <DialogClose asChild>
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground rounded-md hover:bg-muted transition-colors"
              >
                Discard
              </button>
            </DialogClose>
            {/* [Create User] — primary */}
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 text-sm font-semibold bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
            >
              {submitting && <Loader2 size={14} className="animate-spin" />}
              {submitting ? 'Creating...' : 'Create User'}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
