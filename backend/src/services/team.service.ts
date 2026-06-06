import { db } from '../db';

// ============================================================
// Types
// ============================================================

export type MilestoneType =
  | 'planning_approval'
  | 'evidence_readiness'
  | 'draft_readiness'
  | 'final_readiness';

export type MilestoneStatus = 'not_started' | 'on_track' | 'at_risk' | 'overdue' | 'complete';

export type TeamRole = 'AL' | 'EM' | 'AN' | 'QA' | 'IR' | 'PC' | 'RO';

export interface TeamAssignment {
  id: string;
  engagement_id: string;
  user_id: string;
  role: TeamRole;
  assigned_at: string;
  user: { display_name: string; email: string };
}

export interface MilestoneRecord {
  id: string | null;
  engagement_id: string;
  milestone_type: MilestoneType;
  target_date: string | null;
  completed_at: string | null;
  status: MilestoneStatus;
}

export interface PrerequisiteItem {
  key: string;
  label: string;
  pass: boolean;
  detail?: string;
}

// ============================================================
// Helpers
// ============================================================

const VALID_ROLES: TeamRole[] = ['AL', 'EM', 'AN', 'QA', 'IR', 'PC', 'RO'];

const MILESTONE_TYPES: MilestoneType[] = [
  'planning_approval',
  'evidence_readiness',
  'draft_readiness',
  'final_readiness',
];

function computeMilestoneStatus(
  target_date: string | null,
  completed_at: string | null
): MilestoneStatus {
  if (completed_at) return 'complete';
  if (!target_date) return 'not_started';
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(target_date);
  target.setHours(0, 0, 0, 0);
  const diffDays = Math.floor(
    (target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );
  if (diffDays >= 7) return 'on_track';
  if (diffDays >= 0) return 'at_risk';
  return 'overdue';
}

function isoDate(val: string | Date | null): string | null {
  if (!val) return null;
  return val instanceof Date ? val.toISOString() : val;
}

function mapAssignment(row: Record<string, unknown>): TeamAssignment {
  return {
    id: row.id as string,
    engagement_id: row.engagement_id as string,
    user_id: row.user_id as string,
    role: row.role as TeamRole,
    assigned_at: isoDate(row.assigned_at as string | Date)!,
    user: {
      display_name: row.display_name as string,
      email: row.email as string,
    },
  };
}

function mapMilestone(
  row: Record<string, unknown>,
  engagementId: string
): MilestoneRecord {
  const target_date = row.target_date ? String(row.target_date).slice(0, 10) : null;
  const completed_at = isoDate(row.completed_at as string | Date | null);
  return {
    id: (row.id as string) ?? null,
    engagement_id: engagementId,
    milestone_type: row.milestone_type as MilestoneType,
    target_date,
    completed_at,
    status: computeMilestoneStatus(target_date, completed_at),
  };
}

// ============================================================
// Team Assignment functions
// ============================================================

export async function listTeam(
  engagementId: string
): Promise<{ assignments: TeamAssignment[] }> {
  const rows = await db('team_assignments')
    .join('users', 'team_assignments.user_id', 'users.id')
    .where({ 'team_assignments.engagement_id': engagementId })
    .select(
      'team_assignments.*',
      'users.display_name',
      'users.email'
    );

  return { assignments: rows.map(mapAssignment) };
}

export async function addTeamMember(
  engagementId: string,
  data: { user_id: string; role: string }
): Promise<{ assignment: TeamAssignment }> {
  // Validate role
  if (!VALID_ROLES.includes(data.role as TeamRole)) {
    throw Object.assign(
      new Error(`Invalid role. Must be one of: ${VALID_ROLES.join(', ')}`),
      { status: 422 }
    );
  }

  // Check for duplicate
  const existing = await db('team_assignments')
    .where({
      engagement_id: engagementId,
      user_id: data.user_id,
      role: data.role,
    })
    .first();

  if (existing) {
    throw Object.assign(
      new Error('This user already holds this role on the engagement.'),
      { status: 409, code: 'DUPLICATE_ASSIGNMENT' }
    );
  }

  // Insert
  const [row] = await db('team_assignments')
    .insert({
      engagement_id: engagementId,
      user_id: data.user_id,
      role: data.role,
    })
    .returning('*');

  // Fetch with user join
  const [fullRow] = await db('team_assignments')
    .join('users', 'team_assignments.user_id', 'users.id')
    .where({ 'team_assignments.id': row.id })
    .select('team_assignments.*', 'users.display_name', 'users.email');

  return { assignment: mapAssignment(fullRow) };
}

export async function removeTeamMember(
  engagementId: string,
  assignmentId: string
): Promise<void> {
  // Find the assignment
  const assignment = await db('team_assignments')
    .where({ id: assignmentId, engagement_id: engagementId })
    .first();

  if (!assignment) {
    throw Object.assign(new Error('Team assignment not found'), { status: 404 });
  }

  const role: TeamRole = assignment.role;

  // QA guard: cannot remove sole QA before P2 is approved
  if (role === 'QA') {
    const p2Approved = await db('gate_decisions')
      .where({
        engagement_id: engagementId,
        gate_type: 'P2',
        status: 'passed',
      })
      .first();

    if (!p2Approved) {
      // Count QA members on this engagement
      const qaCount = await db('team_assignments')
        .where({ engagement_id: engagementId, role: 'QA' })
        .count('id as cnt')
        .first();

      const count = parseInt(String(qaCount?.cnt ?? 0), 10);
      if (count <= 1) {
        throw Object.assign(
          new Error('Cannot remove the QA Reviewer before Gate P2 has been approved.'),
          { status: 409, code: 'TEAM_ROLE_REQUIRED' }
        );
      }
    }
  }

  // EM guard: cannot remove the last Engagement Manager
  if (role === 'EM') {
    const emCount = await db('team_assignments')
      .where({ engagement_id: engagementId, role: 'EM' })
      .whereNot({ id: assignmentId })
      .count('id as cnt')
      .first();

    const remaining = parseInt(String(emCount?.cnt ?? 0), 10);
    if (remaining === 0) {
      throw Object.assign(
        new Error('Cannot remove the last Engagement Manager from the team.'),
        { status: 409, code: 'TEAM_ROLE_REQUIRED' }
      );
    }
  }

  await db('team_assignments').where({ id: assignmentId }).delete();
}

// ============================================================
// Milestone functions
// ============================================================

export async function listMilestones(
  engagementId: string
): Promise<MilestoneRecord[]> {
  const rows = await db('milestones')
    .where({ engagement_id: engagementId })
    .select('*');

  // Build a map by milestone_type
  const byType = new Map<string, Record<string, unknown>>();
  for (const row of rows) {
    byType.set(row.milestone_type as string, row);
  }

  // Always return exactly 4 items
  return MILESTONE_TYPES.map((mt) => {
    const row = byType.get(mt);
    if (row) {
      return mapMilestone(row, engagementId);
    }
    // Synthetic row for missing milestones
    return {
      id: null,
      engagement_id: engagementId,
      milestone_type: mt,
      target_date: null,
      completed_at: null,
      status: 'not_started' as MilestoneStatus,
    };
  });
}

export interface MilestoneInput {
  milestone_type: MilestoneType;
  target_date: string;
}

export async function upsertMilestones(
  engagementId: string,
  dates: MilestoneInput[]
): Promise<MilestoneRecord[]> {
  // Validate milestone types
  for (const d of dates) {
    if (!MILESTONE_TYPES.includes(d.milestone_type)) {
      throw Object.assign(
        new Error(
          `Invalid milestone_type: ${d.milestone_type}. Must be one of: ${MILESTONE_TYPES.join(', ')}`
        ),
        { status: 422 }
      );
    }
    // Validate date is parseable
    const parsed = new Date(d.target_date);
    if (isNaN(parsed.getTime())) {
      throw Object.assign(
        new Error(`Invalid target_date for ${d.milestone_type}: ${d.target_date}`),
        { status: 422 }
      );
    }
  }

  // Date order validation: planning_approval ≤ evidence_readiness ≤ draft_readiness ≤ final_readiness
  // Build a map of the provided dates
  const dateMap = new Map<MilestoneType, Date>();
  for (const d of dates) {
    dateMap.set(d.milestone_type, new Date(d.target_date));
  }

  const orderedTypes: MilestoneType[] = [
    'planning_approval',
    'evidence_readiness',
    'draft_readiness',
    'final_readiness',
  ];

  // Check chronological order among provided dates
  let prevDate: Date | null = null;
  let prevType: MilestoneType | null = null;
  for (const mt of orderedTypes) {
    const d = dateMap.get(mt);
    if (d) {
      if (prevDate && d < prevDate) {
        throw Object.assign(
          new Error(
            `Milestone dates must be in chronological order. ${mt} date cannot be before ${prevType} date.`
          ),
          { status: 422 }
        );
      }
      prevDate = d;
      prevType = mt;
    }
  }

  // Upsert each milestone using knex onConflict
  for (const d of dates) {
    await db('milestones')
      .insert({
        engagement_id: engagementId,
        milestone_type: d.milestone_type,
        target_date: d.target_date,
        status: 'not_started', // will be computed on read
      })
      .onConflict(['engagement_id', 'milestone_type'])
      .merge({ target_date: d.target_date });
  }

  return listMilestones(engagementId);
}

// ============================================================
// P2 Prerequisites check
// ============================================================

export async function checkP2Prerequisites(
  engagementId: string
): Promise<{ prerequisites: PrerequisiteItem[]; all_pass: boolean }> {
  const prerequisites: PrerequisiteItem[] = [];

  // 1. has_objectives: ≥1 objective in objectives table for this engagement
  const objResult = await db('objectives')
    .where({ engagement_id: engagementId, status: 'active' })
    .count('id as cnt')
    .first();
  const objCount = parseInt(String(objResult?.cnt ?? 0), 10);
  prerequisites.push({
    key: 'has_objectives',
    label: '≥1 objective added',
    pass: objCount >= 1,
    detail: objCount === 0 ? 'No objectives have been added.' : undefined,
  });

  // 2. owner_assigned: engagements.owner_id IS NOT NULL
  const engagement = await db('engagements')
    .where({ id: engagementId })
    .select('owner_id')
    .first();
  const ownerAssigned = Boolean(engagement?.owner_id);
  prerequisites.push({
    key: 'owner_assigned',
    label: 'Owner assigned',
    pass: ownerAssigned,
    detail: ownerAssigned ? undefined : 'No owner assigned to this engagement.',
  });

  // 3. has_em_on_team: ≥1 EM on team
  const emResult = await db('team_assignments')
    .where({ engagement_id: engagementId, role: 'EM' })
    .count('id as cnt')
    .first();
  const emCount = parseInt(String(emResult?.cnt ?? 0), 10);
  prerequisites.push({
    key: 'has_em_on_team',
    label: '≥1 Engagement Manager on team',
    pass: emCount >= 1,
    detail: emCount === 0 ? 'No Engagement Manager assigned to the team.' : undefined,
  });

  // 4. has_qa_on_team: ≥1 QA on team
  const qaResult = await db('team_assignments')
    .where({ engagement_id: engagementId, role: 'QA' })
    .count('id as cnt')
    .first();
  const qaCount = parseInt(String(qaResult?.cnt ?? 0), 10);
  prerequisites.push({
    key: 'has_qa_on_team',
    label: '≥1 QA Reviewer on team',
    pass: qaCount >= 1,
    detail: qaCount === 0 ? 'No QA Reviewer assigned to the team.' : undefined,
  });

  // 5. all_milestones_set: all 4 milestones have non-null target_date
  const milestoneResult = await db('milestones')
    .where({ engagement_id: engagementId })
    .whereNotNull('target_date')
    .count('id as cnt')
    .first();
  const milestoneCount = parseInt(String(milestoneResult?.cnt ?? 0), 10);
  prerequisites.push({
    key: 'all_milestones_set',
    label: 'All 4 milestone dates set',
    pass: milestoneCount >= 4,
    detail:
      milestoneCount < 4
        ? `Only ${milestoneCount} of 4 milestone dates are set.`
        : undefined,
  });

  // 6. risk_notes_present: planning_records.risk_notes IS NOT NULL AND != ''
  const planningRecord = await db('planning_records')
    .where({ engagement_id: engagementId })
    .select('risk_notes', 'data_reliability_notes')
    .first();

  const riskNotesPresent =
    planningRecord?.risk_notes != null && planningRecord.risk_notes.trim() !== '';
  prerequisites.push({
    key: 'risk_notes_present',
    label: 'Risk notes present',
    pass: riskNotesPresent,
    detail: riskNotesPresent ? undefined : 'Risk notes have not been filled in.',
  });

  // 7. data_reliability_notes_present: planning_records.data_reliability_notes IS NOT NULL AND != ''
  const dataNotesPresent =
    planningRecord?.data_reliability_notes != null &&
    planningRecord.data_reliability_notes.trim() !== '';
  prerequisites.push({
    key: 'data_reliability_notes_present',
    label: 'Data reliability notes present',
    pass: dataNotesPresent,
    detail: dataNotesPresent
      ? undefined
      : 'Data reliability notes have not been filled in.',
  });

  // 8. independence_status_complete: all team members have independence affirmations
  //    Query independence_affirmations table (created in Plan 04-03).
  //    If table doesn't exist yet, default to pass: false.
  let independencePass = false;
  let independenceDetail: string | undefined = 'No independence affirmations recorded.';

  try {
    const teamCountResult = await db('team_assignments')
      .where({ engagement_id: engagementId })
      .countDistinct('user_id as cnt')
      .first();
    const teamMemberCount = parseInt(String(teamCountResult?.cnt ?? 0), 10);

    const affirmResult = await db('independence_affirmations')
      .where({ engagement_id: engagementId })
      .countDistinct('user_id as cnt')
      .first();
    const affirmCount = parseInt(String(affirmResult?.cnt ?? 0), 10);

    if (teamMemberCount > 0 && affirmCount >= teamMemberCount) {
      independencePass = true;
      independenceDetail = undefined;
    } else if (teamMemberCount === 0) {
      independenceDetail = 'No team members assigned.';
    } else {
      independenceDetail = `${affirmCount} of ${teamMemberCount} team members have submitted independence affirmations.`;
    }
  } catch {
    // independence_affirmations table does not exist yet (Plan 04-03 not run)
    independencePass = false;
    independenceDetail = 'No independence affirmations recorded.';
  }

  prerequisites.push({
    key: 'independence_status_complete',
    label: 'Independence status set for all team members',
    pass: independencePass,
    detail: independenceDetail,
  });

  const all_pass = prerequisites.every((p) => p.pass);

  return { prerequisites, all_pass };
}
