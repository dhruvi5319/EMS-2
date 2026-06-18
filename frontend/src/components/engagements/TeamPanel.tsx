import { useState, useEffect, useCallback } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { TeamMemberTable } from './TeamMemberTable';
import { AddMemberForm } from './AddMemberForm';
import { MilestoneTable } from './MilestoneTable';
import {
  listTeam,
  addTeamMember,
  removeTeamMember,
  listMilestones,
  upsertMilestones,
} from '@/lib/team.api';
import type { TeamAssignment, Milestone } from '@/lib/team.api';
import type { RemoveGuard } from './TeamMemberTable';

export interface TeamPanelProps {
  engagementId: string;
  canEdit: boolean;
  // Whether Gate P2 has been approved (needed for remove guard)
  p2Approved?: boolean;
}

export function TeamPanel({ engagementId, canEdit, p2Approved = false }: TeamPanelProps) {
  const { toast } = useToast();
  const [assignments, setAssignments] = useState<TeamAssignment[]>([]);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [loadingTeam, setLoadingTeam] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);

  const loadData = useCallback(async () => {
    setLoadingTeam(true);
    try {
      const [teamResult, milestonesResult] = await Promise.all([
        listTeam(engagementId),
        listMilestones(engagementId),
      ]);
      setAssignments(teamResult.assignments);
      setMilestones(milestonesResult.milestones);
    } catch (err) {
      console.error('Failed to load team/milestones:', err);
    } finally {
      setLoadingTeam(false);
    }
  }, [engagementId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Determine remove guard for a given assignment
  function canRemove(assignment: TeamAssignment): RemoveGuard {
    // Cannot remove last EM
    if (assignment.role === 'EM') {
      const emCount = assignments.filter((a) => a.role === 'EM').length;
      if (emCount <= 1) {
        return {
          blocked: true,
          tooltip: 'Cannot remove the last Engagement Manager from the team.',
        };
      }
    }

    // Cannot remove sole QA before P2 approval
    if (assignment.role === 'QA' && !p2Approved) {
      const qaCount = assignments.filter((a) => a.role === 'QA').length;
      if (qaCount <= 1) {
        return {
          blocked: true,
          tooltip: 'Cannot remove the QA Reviewer before Gate P2 has been approved.',
        };
      }
    }

    return { blocked: false, tooltip: '' };
  }

  async function handleAddMember(userId: string, role: string) {
    await addTeamMember(engagementId, { user_id: userId, role });
    await loadData();
    setShowAddForm(false);
    toast({ title: 'Team member added.' });
  }

  async function handleRemoveMember(assignment: TeamAssignment) {
    try {
      await removeTeamMember(engagementId, assignment.id);
      await loadData();
      toast({ title: 'Team member removed.' });
    } catch (err: unknown) {
      const e = err as { status?: number; message?: string };
      if (e.status === 409) {
        toast({
          title: 'Cannot remove team member',
          description: e.message ?? 'Role requirement not met.',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Failed to remove team member',
          description: e.message ?? 'An error occurred.',
          variant: 'destructive',
        });
      }
    }
  }

  async function handleSaveMilestones(
    updates: Array<{ milestone_type: string; target_date: string }>,
  ) {
    try {
      const result = await upsertMilestones(engagementId, updates);
      setMilestones(result.milestones);
      toast({ title: 'Milestones saved.' });
    } catch (err: unknown) {
      const e = err as { message?: string };
      toast({
        title: 'Failed to save milestones',
        description: e.message ?? 'An error occurred. Please try again.',
        variant: 'destructive',
      });
    }
  }

  return (
    <div className="space-y-8">
      {/* TEAM MEMBERS section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Team Members
          </h3>
          {canEdit && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAddForm((prev) => !prev)}
              className="text-xs h-8"
            >
              <Plus className="h-3.5 w-3.5 mr-1" />
              Add Member
            </Button>
          )}
        </div>

        <TeamMemberTable
          assignments={assignments}
          loading={loadingTeam}
          canEdit={canEdit}
          canRemove={canRemove}
          onRemove={handleRemoveMember}
        />

        {canEdit && showAddForm && (
          <div className="mt-4 p-4 border border-slate-200 rounded-lg bg-slate-50">
            <h4 className="text-xs font-medium uppercase tracking-wide text-slate-500 mb-3">
              Add Team Member
            </h4>
            <AddMemberForm
              engagementId={engagementId}
              onAdded={() => {
                setShowAddForm(false);
              }}
              onAddMember={handleAddMember}
            />
          </div>
        )}
      </div>

      {/* Section separator */}
      <div className="border-t border-slate-200" />

      {/* MILESTONES section */}
      <div>
        <h3 className="text-xs font-medium uppercase tracking-wide text-slate-500 mb-4">
          Milestones
        </h3>
        <MilestoneTable
          engagementId={engagementId}
          milestones={milestones}
          canEdit={canEdit}
          onSave={handleSaveMilestones}
        />
      </div>
    </div>
  );
}
