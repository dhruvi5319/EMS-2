import React from 'react';
import { CheckCircle } from 'lucide-react';
import { LinkObjectivePopover } from './LinkObjectivePopover';
import type { CoverageObjective } from '@/hooks/useEvidence';

export interface LinkedObjective {
  id: string;
  objective_text: string;
}

interface LinkedObjectivesListProps {
  engagementId: string;
  evidenceId: string;
  linkedObjectives: LinkedObjective[];
  linkedObjectiveIds: string[];
  allObjectives: CoverageObjective[];
  onLinked: (objectiveId: string) => void;
  canLink?: boolean;
}

export const LinkedObjectivesList: React.FC<LinkedObjectivesListProps> = ({
  engagementId,
  evidenceId,
  linkedObjectives,
  linkedObjectiveIds,
  allObjectives,
  onLinked,
  canLink = true,
}) => {
  return (
    <div className="space-y-2">
      {linkedObjectives.length === 0 ? (
        <p className="text-[12px] font-normal" style={{ color: 'hsl(215 16% 47%)' }}>
          No objectives linked yet. Link this evidence to objectives to support coverage.
        </p>
      ) : (
        <ul className="space-y-1.5">
          {linkedObjectives.map((obj) => (
            <li key={obj.id} className="flex items-start gap-2">
              <CheckCircle size={16} className="text-green-600 mt-0.5 shrink-0" />
              <span className="text-[14px] font-normal">
                {obj.objective_text.length > 80
                  ? obj.objective_text.slice(0, 80) + '…'
                  : obj.objective_text}
              </span>
            </li>
          ))}
        </ul>
      )}
      {canLink && (
        <LinkObjectivePopover
          engagementId={engagementId}
          evidenceId={evidenceId}
          linkedObjectiveIds={linkedObjectiveIds}
          onLinked={onLinked}
          allObjectives={allObjectives}
        />
      )}
    </div>
  );
};
