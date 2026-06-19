import React, { useState, useEffect } from 'react';
import { Check, ChevronsUpDown, Loader2 } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandList } from '@/components/ui/command';
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
  allObjectives: allObjectivesProp,
}) => {
  const [open, setOpen] = useState(false);
  const [linking, setLinking] = useState<string | null>(null);
  const [fetchedObjectives, setFetchedObjectives] = useState<CoverageObjective[] | null>(null);
  const [fetchingObjectives, setFetchingObjectives] = useState(false);
  const { toast } = useToast();

  // When popover opens, fetch objectives if the prop list is empty (fallback self-fetch)
  useEffect(() => {
    if (!open) return;
    if (allObjectivesProp.length > 0) return; // parent already provided them
    if (fetchedObjectives !== null) return; // already fetched

    setFetchingObjectives(true);
    api
      .get<{ objectives: CoverageObjective[]; covered: number; total: number; uncovered_count: number }>(
        `/api/engagements/${engagementId}/objectives/coverage`
      )
      .then((result) => {
        if (result.ok) {
          setFetchedObjectives(result.data.objectives ?? []);
        } else {
          setFetchedObjectives([]);
        }
      })
      .catch(() => setFetchedObjectives([]))
      .finally(() => setFetchingObjectives(false));
  }, [open, engagementId, allObjectivesProp.length, fetchedObjectives]);

  const allObjectives = allObjectivesProp.length > 0 ? allObjectivesProp : (fetchedObjectives ?? []);

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
        `/api/engagements/${engagementId}/evidence/${evidenceId}/objectives`,
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
            {fetchingObjectives ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 size={16} className="animate-spin text-muted-foreground" />
              </div>
            ) : (
              <>
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
                      <button
                        key={obj.id}
                        type="button"
                        className={[
                          'flex w-full items-center gap-2 px-2 py-1.5 text-left text-sm',
                          'hover:bg-accent hover:text-accent-foreground',
                          'focus:bg-accent focus:text-accent-foreground focus:outline-none',
                          isLinked ? 'opacity-50 cursor-not-allowed' : 'cursor-default',
                        ].join(' ')}
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => handleSelect(obj.id)}
                        disabled={isLinking || isLinked}
                      >
                        <Check
                          size={14}
                          className={isLinked ? 'opacity-100 text-green-600' : 'opacity-0'}
                        />
                        <span className="flex-1 truncate">{label}</span>
                        <span className="text-[11px] text-muted-foreground ml-2 shrink-0">
                          {obj.evidence_count} linked
                        </span>
                      </button>
                    );
                  })}
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
