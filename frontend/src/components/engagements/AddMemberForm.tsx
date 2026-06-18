import { useState, useRef } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { api } from '@/lib/api';

interface UserResult {
  id: string;
  display_name: string;
  email: string;
  roles: string[];
}

const ROLES = [
  { value: 'AL', label: 'AL — Audit Lead' },
  { value: 'EM', label: 'EM — Engagement Manager' },
  { value: 'AN', label: 'AN — Analyst' },
  { value: 'QA', label: 'QA — QA Reviewer' },
  { value: 'IR', label: 'IR — Independent Reviewer' },
  { value: 'PC', label: 'PC — Project Coordinator' },
  { value: 'RO', label: 'RO — Read Only' },
];

interface AddMemberFormProps {
  engagementId: string;
  onAdded: () => void;
  onAddMember: (userId: string, role: string) => Promise<void>;
}

export function AddMemberForm({ onAdded, onAddMember }: AddMemberFormProps) {
  const [query, setQuery] = useState('');
  const [users, setUsers] = useState<UserResult[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserResult | null>(null);
  const [selectedRole, setSelectedRole] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleSearch(value: string) {
    setQuery(value);
    setSelectedUser(null);
    if (value.length < 2) {
      setUsers([]);
      setShowDropdown(false);
      return;
    }
    const res = await api.get<{ users: UserResult[] }>(
      `/api/users/search?q=${encodeURIComponent(value)}`,
    );
    if (res.ok) {
      setUsers(res.data.users);
      setShowDropdown(true);
    }
  }

  function handleSelectUser(user: UserResult) {
    setSelectedUser(user);
    setQuery(user.display_name);
    setShowDropdown(false);
  }

  async function handleAdd() {
    if (!selectedUser || !selectedRole) return;
    setSubmitting(true);
    setError('');
    try {
      await onAddMember(selectedUser.id, selectedRole);
      setSelectedUser(null);
      setSelectedRole('');
      setQuery('');
      setUsers([]);
      setShowDropdown(false);
      onAdded();
    } catch (err: unknown) {
      const e = err as { status?: number; message?: string };
      if (e.status === 409) {
        setError('This user already holds this role on the engagement.');
      } else {
        setError(e.message ?? 'Failed to add team member. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-3 pt-2">
      {/* User Search */}
      <div className="space-y-1">
        <label className="text-xs font-medium uppercase tracking-wide text-slate-500">
          Search users
        </label>
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            onFocus={() => { if (users.length > 0) setShowDropdown(true); }}
            onBlur={() => { setTimeout(() => setShowDropdown(false), 150); }}
            placeholder="Search by name or email..."
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          />
          {showDropdown && users.length > 0 && (
            <div className="absolute z-50 mt-1 w-full rounded-md border bg-popover shadow-md">
              {users.map((user) => (
                <button
                  key={user.id}
                  type="button"
                  className="flex w-full items-start gap-2 px-3 py-2 text-left text-sm hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => handleSelectUser(user)}
                >
                  <div className="flex-1">
                    <div className="font-medium">{user.display_name}</div>
                    <div className="text-xs text-muted-foreground">
                      {user.email}
                      {user.roles.length > 0 && ` · ${user.roles.join(', ')}`}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
          {showDropdown && query.length >= 2 && users.length === 0 && (
            <div className="absolute z-50 mt-1 w-full rounded-md border bg-popover px-3 py-4 text-center text-sm text-muted-foreground shadow-md">
              No users found.
            </div>
          )}
        </div>
        {selectedUser && (
          <p className="text-xs text-emerald-600">
            Selected: {selectedUser.display_name}
          </p>
        )}
      </div>

      {/* RoleSelector */}
      <div className="space-y-1">
        <label className="text-xs font-medium uppercase tracking-wide text-slate-500">
          Role
        </label>
        <Select value={selectedRole} onValueChange={setSelectedRole}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select role" />
          </SelectTrigger>
          <SelectContent>
            {ROLES.map((r) => (
              <SelectItem key={r.value} value={r.value}>
                {r.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Error message */}
      {error && (
        <p className="text-xs text-destructive">{error}</p>
      )}

      {/* Add button */}
      <Button
        className="w-full bg-primary text-primary-foreground"
        disabled={!selectedUser || !selectedRole || submitting}
        onClick={handleAdd}
      >
        {submitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Adding...
          </>
        ) : (
          'Add to Team'
        )}
      </Button>
    </div>
  );
}
