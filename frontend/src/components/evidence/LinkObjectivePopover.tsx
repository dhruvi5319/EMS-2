import React, { useState } from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { api } from '@/lib/api';
import { useToast } from '@/components/ui/use-toast';
import type { CoverageObjective } from '@/hooks/useEvidence';

interface LinkObjectivePopoverProps {
  engagementId: string;
  evidenceId: string;
  linkedObjectiveIds: string[];
  onLinked: (objectiveId: string) => void;
  allObjectives: CoverageObjective[];
}

export const LinkObjectivePopover: React.FC<LinkObjectivePopoverProps> = ({
  engagementId,
  evidenceId,
  linkedObjectiveIds,
  onLinked,
  allObjectives,
}) => {
  const [open, setOpen] = useState(false);
  const [linking, setLinking] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSelect = async (objectiveId: string) => {
    if (linkedObjectiveIds.includes(objectiveId)) {
      toast({
        title: 'Already linked',
        description: 'Already linked to this objective.',
        variant: 'default',
        className: 'bg-amber-50 border-amber-200 text-amber-800',
      });
      return;
    }

    setLinking(objectiveId);
    try {
      const result = await api.post(
        `/engagements/${engagementId}/evidence/${evidenceId}/objectives`,
        { objective_ids: [objectiveId] }
      );
      if (result.ok) {
        toast({
          title: 'Linked',
          description: 'Evidence linked to objective.',
        });
        onLinked(objectiveId);
        setOpen(false);
      } else {
        toast({
          title: 'Error',
          description: result.error ?? 'Failed to link objective.',
          variant: 'destructive',
        });
      }
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to link objective.',
        variant: 'destructive',
      });
    } finally {
      setLinking(null);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="flex items-center gap-1 text-[14px] font-normal mt-1"
          style={{ color: 'hsl(221 83% 53%)' }}
          aria-expanded={open}
        >
          + Link to another objective
          <ChevronsUpDown size={12} />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="start">
        <Command>
          <CommandInput placeholder="Search objectives..." />
          <CommandList>
            <CommandEmpty>No objectives found.</CommandEmpty>
            <CommandGroup>
              {allObjectives.map((obj) => {
                const isLinked = linkedObjectiveIds.includes(obj.id);
                const isLinking = linking === obj.id;
                const label =
                  obj.objective_text.length > 60
                    ? obj.objective_text.slice(0, 60) + '…'
                    : obj.objective_text;
                return (
                  <CommandItem
                    key={obj.id}
                    value={obj.id + ' ' + obj.objective_text}
                    onSelect={() => handleSelect(obj.id)}
                    aria-disabled={isLinked}
                    className={isLinked ? 'opacity-50 cursor-not-allowed' : ''}
                    disabled={isLinking}
                  >
                    <Check
                      size={14}
                      className={isLinked ? 'opacity-100 text-green-600 mr-2' : 'opacity-0 mr-2'}
                    />
                    <span className="flex-1 truncate">{label}</span>
                    <span className="text-[11px] text-muted-foreground ml-2 shrink-0">
                      {obj.evidence_count} linked
                    </span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
