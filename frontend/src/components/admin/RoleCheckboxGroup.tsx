import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';

const ALL_ROLES = [
  { value: 'AL', label: 'Acceptance Lead (AL)' },
  { value: 'EM', label: 'Engagement Manager (EM)' },
  { value: 'AN', label: 'Analyst (AN)' },
  { value: 'QA', label: 'QA Reviewer (QA)' },
  { value: 'IR', label: 'Independent Referencer (IR)' },
  { value: 'PC', label: 'Publishing Coordinator (PC)' },
  { value: 'RO', label: 'Read-Only Stakeholder (RO)' },
  { value: 'AD', label: 'Admin (AD)' },
];

interface RoleCheckboxGroupProps {
  selectedRoles: string[];
  onChange: (roles: string[]) => void;
  error?: string;
}

export function RoleCheckboxGroup({ selectedRoles, onChange, error }: RoleCheckboxGroupProps) {
  const toggle = (role: string) => {
    if (selectedRoles.includes(role)) {
      onChange(selectedRoles.filter((r) => r !== role));
    } else {
      onChange([...selectedRoles, role]);
    }
  };

  return (
    <fieldset
      className={cn(
        'border rounded-md p-3',
        error ? 'border-destructive' : 'border-border'
      )}
    >
      <legend className="text-xs font-medium px-1 text-muted-foreground">Assign Roles</legend>
      <div className="grid grid-cols-2 gap-2 mt-1">
        {ALL_ROLES.map(({ value, label }) => (
          <label
            key={value}
            className="flex items-center gap-2 cursor-pointer text-sm text-foreground"
          >
            <Checkbox
              checked={selectedRoles.includes(value)}
              onCheckedChange={() => toggle(value)}
              id={`role-${value}`}
            />
            <span>{label}</span>
          </label>
        ))}
      </div>
      {/* Inline error — "At least one role is required." */}
      {error && (
        <p className="mt-2 text-xs text-destructive" role="alert">
          {error}
        </p>
      )}
    </fieldset>
  );
}
