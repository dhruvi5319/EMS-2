---
phase: 04-engagement-setup-and-gate-p2
plan: GAP-02
type: execute
wave: 1
depends_on: []
files_modified:
  - frontend/src/components/engagements/AddMemberForm.tsx
autonomous: true
gap_closure: true

features:
  implements: ["F5"]
  depends_on: []
  enables: []

must_haves:
  truths:
    - "Typing 2+ characters in the user search box returns a results list"
    - "Clicking a user in the results list selects them (name appears in trigger button)"
    - "After selecting a user and a role, clicking Add to Team successfully adds the member"
    - "The search dropdown width matches the trigger button width (full-width)"
  artifacts:
    - path: "frontend/src/components/engagements/AddMemberForm.tsx"
      provides: "Working user search combobox using cmdk v1 compatible pattern"
  key_links:
    - from: "CommandInput onValueChange"
      to: "setSelectedUser"
      via: "CommandItem onSelect — must fire reliably without cmdk auto-selection interference"

integration_contracts:
  requires: []
  provides:
    - artifact: "frontend/src/components/engagements/AddMemberForm.tsx"
      exports: ["AddMemberForm"]
      shape: "Fixed cmdk v1 combobox: no value prop on CommandInput, single always-mounted CommandEmpty, full-width PopoverContent"
      verify: "grep -n 'onValueChange={handleSearch}' frontend/src/components/engagements/AddMemberForm.tsx && echo CONTRACT_OK"
---

<objective>
Fix AddMemberForm: users can be searched but not selected due to cmdk v1 incompatibility and fixed-width dropdown.

Purpose: The `value={query}` prop on `CommandInput` causes cmdk v1 to call `selectFirstItem()` on every keystroke, intercepting the click event before `onSelect` fires. Removing controlled `value` and simplifying `CommandEmpty` usage resolves the selection bug. Fixing `PopoverContent` width resolves the UI sizing issue.
Output: Functional user search combobox where typing shows results, clicking selects a user, and the dropdown is full-width.
</objective>

<feature_dependencies>
Implements: F5: Team Assignments — Add Member
Depends on: None
Enables: None (fix only)
</feature_dependencies>

<execution_context>
@.planning/phases/04-engagement-setup-and-gate-p2/04-05-SUMMARY.md
</execution_context>

<context>
@.planning/PROJECT.md
@frontend/src/components/engagements/AddMemberForm.tsx
</context>

<tasks>

<task type="auto">
  <name>Task 1: Fix cmdk v1 CommandInput controlled value bug and PopoverContent width</name>
  <files>frontend/src/components/engagements/AddMemberForm.tsx</files>
  <action>
Three fixes required in `AddMemberForm.tsx`:

**Fix 1 — Remove `value={query}` from CommandInput (line ~122)**

In cmdk v1, setting `value` on `CommandInput` makes it a controlled input which triggers `selectFirstItem()` on every keystroke via the `onValueChange` event chain. This intercepts click events on `CommandItem` before `onSelect` fires.

Change:
```tsx
<CommandInput
  placeholder="Search by name or email..."
  value={query}
  onValueChange={handleSearch}
/>
```
To:
```tsx
<CommandInput
  placeholder="Search by name or email..."
  onValueChange={handleSearch}
/>
```

The `query` state is still updated via `handleSearch` (which calls `setQuery(value)`). The input display is uncontrolled from cmdk's perspective, which allows `onSelect` to fire correctly.

**Fix 2 — Replace dual `CommandEmpty` conditionals with a single always-mounted one (lines ~127-132)**

The current code manually conditionally renders two `CommandEmpty` blocks which conflicts with cmdk v1's internal visibility management (cmdk controls `CommandEmpty` display via `data-cmdk-empty`). Replace with a single `CommandEmpty` that always mounts, and move the hint text outside `Command` as a regular element:

Remove the conditional `CommandEmpty` JSX blocks inside `CommandList`:
```tsx
{users.length === 0 && query.length >= 2 && (
  <CommandEmpty>No users found.</CommandEmpty>
)}
{query.length < 2 && (
  <CommandEmpty>Type at least 2 characters to search.</CommandEmpty>
)}
```

Replace with a single `CommandEmpty` that handles both states:
```tsx
<CommandEmpty>
  {query.length < 2 ? 'Type at least 2 characters to search.' : 'No users found.'}
</CommandEmpty>
```

This single `CommandEmpty` is always mounted; cmdk's internal logic shows/hides it via `data-cmdk-empty`. This avoids React key conflicts and cmdk state desync.

**Fix 3 — Fix PopoverContent width (line ~119)**

Change:
```tsx
<PopoverContent className="w-[300px] p-0">
```
To:
```tsx
<PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
```

`--radix-popover-trigger-width` is a CSS custom property that Radix Popover sets on the content element to match the trigger's rendered width. This ensures the dropdown matches the full-width trigger button.

**Full corrected Popover/Command block** (replace lines 101-163):

```tsx
<Popover open={open} onOpenChange={setOpen}>
  <PopoverTrigger asChild>
    <Button
      variant="outline"
      role="combobox"
      aria-expanded={open}
      className="w-full justify-between"
    >
      {selectedUser ? (
        <span className="text-sm">{selectedUser.display_name}</span>
      ) : (
        <span className="text-muted-foreground text-sm">
          Search by name or email...
        </span>
      )}
      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
    </Button>
  </PopoverTrigger>
  <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
    <Command shouldFilter={false}>
      <CommandInput
        placeholder="Search by name or email..."
        onValueChange={handleSearch}
      />
      <CommandList>
        <CommandEmpty>
          {query.length < 2 ? 'Type at least 2 characters to search.' : 'No users found.'}
        </CommandEmpty>
        <CommandGroup>
          {users.map((user) => (
            <CommandItem
              key={user.id}
              value={user.id}
              onSelect={() => {
                setSelectedUser(user);
                setOpen(false);
              }}
            >
              <Check
                className={cn(
                  'mr-2 h-4 w-4',
                  selectedUser?.id === user.id ? 'opacity-100' : 'opacity-0',
                )}
              />
              <div>
                <div className="text-sm">{user.display_name}</div>
                <div className="text-xs text-muted-foreground">
                  {user.email}
                  {user.roles.length > 0 && ` · ${user.roles.join(', ')}`}
                </div>
              </div>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  </PopoverContent>
</Popover>
```
  </action>
  <verify>
grep -n "value={query}" frontend/src/components/engagements/AddMemberForm.tsx | wc -l | xargs -I{} sh -c 'if [ "{}" = "0" ]; then echo "CONTROLLED_VALUE_REMOVED_OK"; else echo "CONTROLLED_VALUE_STILL_PRESENT"; fi'
grep -n "var(--radix-popover-trigger-width)" frontend/src/components/engagements/AddMemberForm.tsx && echo "WIDTH_FIX_OK"
grep -n "CommandEmpty" frontend/src/components/engagements/AddMemberForm.tsx
  </verify>
  <done>
- `value={query}` is absent from CommandInput (only `onValueChange` remains)
- Single `CommandEmpty` block (not two conditionals)
- PopoverContent uses `w-[var(--radix-popover-trigger-width)]` not `w-[300px]`
- Clicking a user in search results selects them (name appears in trigger button)
- "Add to Team" button enables after user + role selected
  </done>
</task>

</tasks>

<verification>
1. Navigate to an engagement → Team tab → click "+ Add Member"
2. Type 2+ characters in the search box — results dropdown appears at full width
3. Click a user in the results — their name appears in the trigger button (selection works)
4. Select a role from the dropdown
5. Click "Add to Team" — member appears in the team table
6. Try adding the same user+role again — error message appears
</verification>

<success_criteria>
- User search dropdown opens at full width (matches button width)
- Typing 2+ chars shows matching users
- Clicking a user selects them (trigger shows their name)
- After user + role, "Add to Team" adds the member and refreshes the team table
- Duplicate user+role shows the 409 error message
</success_criteria>

<output>
After completion, create `.planning/phases/04-engagement-setup-and-gate-p2/04-GAP-02-SUMMARY.md`
</output>
