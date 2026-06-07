import { Knex } from 'knex';
import { db } from '../db';

// ---- Types ----

export interface GateDecision {
  id: string;
  engagement_id: string;
  gate_type: string;
  status: string;
  decided_by: string;
  decided_at: string;
  rationale: string | null;
  comment: string | null;
}

export interface P4Blocker {
  type: string;
  message: string;
  statement_ids?: string[];
}

export interface EngagementListItem {
  id: string;
  job_code: string;
  title: string | null;
  phase: string;
  status: string;
  owner_name: string | null;
  risk_level: string | null;
  portfolio: string | null;
  next_milestone_label: string | null;
  next_milestone_date: string | null;
  milestone_status: string | null;
  gate_a1_status: string | null;
  gate_p2_status: string | null;
  gate_p3_status: string | null;
  gate_p4_status: string | null;
  has_blockers: boolean;
  updated_at: string;
  created_at: string;
}

export type EngagementFilters = {
  phase?: string;
  status?: string;
  owner_id?: string;
  risk_level?: string;
  due_date_before?: string;
  sort_by?: string;
  sort_dir?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
};

// ---- Helpers ----

function toGateDecision(row: Record<string, unknown>): GateDecision {
  return {
    id: row.id as string,
    engagement_id: row.engagement_id as string,
    gate_type: row.gate_type as string,
    status: row.status as string,
    decided_by: row.decided_by as string,
    decided_at: row.decided_at instanceof Date
      ? (row.decided_at as Date).toISOString()
      : (row.decided_at as string),
    rationale: row.rationale as string | null,
    comment: row.comment as string | null,
  };
}

function isoOrNull(val: unknown): string | null {
  if (!val) return null;
  if (val instanceof Date) return val.toISOString();
  return val as string;
}

function milestoneTypeLabel(mtype: string): string {
  const labels: Record<string, string> = {
    planning_approval: 'Planning Approval',
    evidence_readiness: 'Evidence Readiness',
    draft_readiness: 'Draft Readiness',
    final_readiness: 'Final Readiness',
  };
  return labels[mtype] || mtype;
}

function buildEngagementListItem(row: Record<string, unknown>): EngagementListItem {
  return {
    id: row.id as string,
    job_code: row.job_code as string,
    title: row.title as string | null,
    phase: row.phase as string,
    status: row.status as string,
    owner_name: row.owner_name as string | null,
    risk_level: row.risk_level as string | null,
    portfolio: row.portfolio as string | null,
    next_milestone_label: row.next_milestone_type
      ? milestoneTypeLabel(row.next_milestone_type as string)
      : null,
    next_milestone_date: isoOrNull(row.next_milestone_date),
    milestone_status: row.next_milestone_status as string | null,
    gate_a1_status: row.gate_a1_decided_at ? 'approved' : null,
    gate_p2_status: row.gate_p2_decided_at ? 'approved' : null,
    gate_p3_status: row.gate_p3_decided_at ? 'approved' : null,
    gate_p4_status: row.gate_p4_decided_at ? 'approved' : null,
    has_blockers: Boolean(row.has_blockers),
    updated_at: isoOrNull(row.updated_at) as string,
    created_at: isoOrNull(row.created_at) as string,
  };
}

// ---- P4 Prerequisites ----

/**
 * Check Gate P4 prerequisites for an engagement.
 * Checks (in order):
 * 1. P3 gate approved
 * 2. No failed reference checks
 * 3. No in-review reference checks
 * 4. No not-started reference checks
 */
export async function checkP4Prerequisites(engagementId: string): Promise<{
  met: boolean;
  blockers: P4Blocker[];
}> {
  const blockers: P4Blocker[] = [];

  // 1. Check P3 gate approved
  const p3Decision = await db('gate_decisions')
    .where({
      engagement_id: engagementId,
      gate_type: 'P3',
      status: 'passed',
    })
    .first();

  if (!p3Decision) {
    blockers.push({
      type: 'p3_not_approved',
      message: 'Gate P3 has not been approved.',
    });
  }

  // Get draft product for this engagement (statements link via draft_products)
  const draftProduct = await db('draft_products')
    .where({ engagement_id: engagementId })
    .first();

  if (draftProduct) {
    // 2. Check for failed reference checks
    const failedStatements = await db('draft_statements')
      .where({
        draft_product_id: draftProduct.id,
        ref_status: 'failed',
      })
      .select('id');

    if (failedStatements.length > 0) {
      blockers.push({
        type: 'has_failed_checks',
        message: `${failedStatements.length} failed reference check(s).`,
        statement_ids: failedStatements.map((s: Record<string, string>) => s.id),
      });
    }

    // 3. Check for in-review reference checks
    const inReviewStatements = await db('draft_statements')
      .where({
        draft_product_id: draftProduct.id,
        ref_status: 'in_review',
      })
      .select('id');

    if (inReviewStatements.length > 0) {
      blockers.push({
        type: 'has_in_review_checks',
        message: `${inReviewStatements.length} check(s) still In Review.`,
        statement_ids: inReviewStatements.map((s: Record<string, string>) => s.id),
      });
    }

    // 4. Check for not-started reference checks
    const notStartedStatements = await db('draft_statements')
      .where({
        draft_product_id: draftProduct.id,
        ref_status: 'not_started',
      })
      .select('id');

    if (notStartedStatements.length > 0) {
      blockers.push({
        type: 'has_not_started_checks',
        message: `${notStartedStatements.length} check(s) not yet started.`,
        statement_ids: notStartedStatements.map((s: Record<string, string>) => s.id),
      });
    }
  }

  return {
    met: blockers.length === 0,
    blockers,
  };
}

// ---- P4 Decision ----

/**
 * Record a Gate P4 decision (approved only).
 * On approved: creates GateDecision, AuditEvent (GATE_P4_APPROVED), updates engagement status/phase.
 * Outcome 'ready_for_issuance' → phase='readiness'
 * Outcome 'closed' → phase='closed', status='closed'
 */
export async function recordP4Decision(
  engagementId: string,
  data: { decision: 'approved'; outcome: 'ready_for_issuance' | 'closed'; comment?: string },
  userId: string
): Promise<GateDecision> {
  // Re-run prerequisites check (server-side re-validation)
  const prereqResult = await checkP4Prerequisites(engagementId);
  if (!prereqResult.met) {
    throw Object.assign(
      new Error('P4 prerequisites not met.'),
      { status: 422, blockers: prereqResult.blockers }
    );
  }

  // Execute in a transaction
  return db.transaction(async (trx: Knex.Transaction) => {
    const now = new Date();

    // 1. INSERT gate_decision
    const [gateDecisionRow] = await trx('gate_decisions')
      .insert({
        engagement_id: engagementId,
        gate_type: 'P4',
        status: 'passed',
        decided_by: userId,
        decided_at: now,
        rationale: data.comment?.trim() || null,
        comment: data.comment?.trim() || null,
      })
      .returning('*');

    // 2. INSERT audit_event
    await trx('audit_events').insert({
      engagement_id: engagementId,
      actor_id: userId,
      action: 'GATE_P4_APPROVED',
      object_type: 'gate_decision',
      object_id: gateDecisionRow.id,
      summary: `Gate P4 approved — engagement set to ${data.outcome}.`,
      after_state: JSON.stringify({ outcome: data.outcome, comment: data.comment }),
    });

    // 3. UPDATE engagements
    const engagementUpdate: Record<string, unknown> = {
      updated_at: now,
    };

    if (data.outcome === 'ready_for_issuance') {
      engagementUpdate.phase = 'readiness';
    } else if (data.outcome === 'closed') {
      engagementUpdate.phase = 'closed';
      engagementUpdate.status = 'closed';
    }

    await trx('engagements')
      .where({ id: engagementId })
      .update(engagementUpdate);

    return toGateDecision(gateDecisionRow as Record<string, unknown>);
  });
}

// ---- Engagement List (F14 Portfolio Dashboard) ----

const SORT_COLUMN_MAP: Record<string, string> = {
  id: 'e.id',
  title: 'e.title',
  phase: 'e.phase',
  status: 'e.status',
  owner: 'u.display_name',
  risk_level: 'e.risk_level',
  updated_at: 'e.updated_at',
  next_milestone_date: 'nm.target_date',
};

/**
 * List engagements with full filter/sort/pagination for portfolio dashboard (F14).
 * Returns enriched list items with gate statuses, next milestone, and blocker flag.
 */
export async function listEngagements(
  filters: EngagementFilters
): Promise<{ engagements: EngagementListItem[]; total: number }> {
  const limit = Math.min(filters.limit ?? 25, 200);
  const offset = filters.offset ?? 0;
  const sortBy = SORT_COLUMN_MAP[filters.sort_by || 'updated_at'] || 'e.updated_at';
  const sortDir = filters.sort_dir === 'asc' ? 'asc' : 'desc';

  // Build base query with joins
  let q = db('engagements as e')
    .leftJoin('users as u', 'e.owner_id', 'u.id')
    // Gate approval JOINs using simple string condition (knex supports this)
    .leftJoin(
      'gate_decisions as gd_a1',
      db.raw("e.id = gd_a1.engagement_id AND gd_a1.gate_type = 'A1' AND gd_a1.status = 'passed'")
    )
    .leftJoin(
      'gate_decisions as gd_p2',
      db.raw("e.id = gd_p2.engagement_id AND gd_p2.gate_type = 'P2' AND gd_p2.status = 'passed'")
    )
    .leftJoin(
      'gate_decisions as gd_p3',
      db.raw("e.id = gd_p3.engagement_id AND gd_p3.gate_type = 'P3' AND gd_p3.status = 'passed'")
    )
    .leftJoin(
      'gate_decisions as gd_p4',
      db.raw("e.id = gd_p4.engagement_id AND gd_p4.gate_type = 'P4' AND gd_p4.status = 'passed'")
    )
    // Next milestone: earliest incomplete milestone by target_date
    .leftJoin(
      db('milestones')
        .select('engagement_id')
        .min('target_date as next_target_date')
        .whereNot({ status: 'complete' })
        .whereNotNull('target_date')
        .groupBy('engagement_id')
        .as('nm_sub'),
      'e.id',
      'nm_sub.engagement_id'
    )
    .leftJoin(
      'milestones as nm',
      db.raw("e.id = nm.engagement_id AND nm.target_date = nm_sub.next_target_date AND nm.status != 'complete'")
    );

  // Apply filters
  if (filters.phase) q = q.where('e.phase', filters.phase);
  if (filters.status) q = q.where('e.status', filters.status);
  if (filters.owner_id) q = q.where('e.owner_id', filters.owner_id);
  if (filters.risk_level) q = q.where('e.risk_level', filters.risk_level);
  if (filters.due_date_before) {
    q = q.where('nm.target_date', '<=', filters.due_date_before);
  }

  // Count query
  const countResult = (await q.clone().clearOrder().count('e.id as count').first()) as { count: string | number };
  const total = typeof countResult.count === 'string' ? parseInt(countResult.count, 10) : (countResult.count as number);

  // Data query with selected columns
  const rows = await q
    .select([
      'e.id',
      'e.job_code',
      'e.title',
      'e.phase',
      'e.status',
      'e.risk_level',
      'e.portfolio',
      'e.owner_id',
      'e.created_at',
      'e.updated_at',
      'u.display_name as owner_name',
      'gd_a1.decided_at as gate_a1_decided_at',
      'gd_p2.decided_at as gate_p2_decided_at',
      'gd_p3.decided_at as gate_p3_decided_at',
      'gd_p4.decided_at as gate_p4_decided_at',
      'nm.milestone_type as next_milestone_type',
      'nm.target_date as next_milestone_date',
      'nm.status as next_milestone_status',
      db.raw('CASE WHEN e.owner_id IS NULL THEN true ELSE false END as has_blockers'),
    ])
    .orderBy(sortBy, sortDir)
    .limit(limit)
    .offset(offset);

  return {
    engagements: rows.map((row: Record<string, unknown>) => buildEngagementListItem(row)),
    total,
  };
}

// ---- CSV Export (F14 Portfolio Dashboard) ----

function csvEscape(value: string | null | undefined): string {
  if (value === null || value === undefined) return '';
  const str = String(value);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

/**
 * Export engagements as CSV string with all F14 columns.
 * Same filters as listEngagements but no pagination (exports ALL matching).
 */
export async function exportEngagements(filters: EngagementFilters): Promise<string> {
  let q = db('engagements as e')
    .leftJoin('users as u', 'e.owner_id', 'u.id')
    .leftJoin(
      'gate_decisions as gd_a1',
      db.raw("e.id = gd_a1.engagement_id AND gd_a1.gate_type = 'A1' AND gd_a1.status = 'passed'")
    )
    .leftJoin(
      'gate_decisions as gd_p2',
      db.raw("e.id = gd_p2.engagement_id AND gd_p2.gate_type = 'P2' AND gd_p2.status = 'passed'")
    )
    .leftJoin(
      'gate_decisions as gd_p3',
      db.raw("e.id = gd_p3.engagement_id AND gd_p3.gate_type = 'P3' AND gd_p3.status = 'passed'")
    )
    .leftJoin(
      'gate_decisions as gd_p4',
      db.raw("e.id = gd_p4.engagement_id AND gd_p4.gate_type = 'P4' AND gd_p4.status = 'passed'")
    )
    // Milestone target dates
    .leftJoin(
      'milestones as ms_pa',
      db.raw("e.id = ms_pa.engagement_id AND ms_pa.milestone_type = 'planning_approval'")
    )
    .leftJoin(
      'milestones as ms_er',
      db.raw("e.id = ms_er.engagement_id AND ms_er.milestone_type = 'evidence_readiness'")
    )
    .leftJoin(
      'milestones as ms_fr',
      db.raw("e.id = ms_fr.engagement_id AND ms_fr.milestone_type = 'final_readiness'")
    );

  // Apply filters (no pagination)
  if (filters.phase) q = q.where('e.phase', filters.phase);
  if (filters.status) q = q.where('e.status', filters.status);
  if (filters.owner_id) q = q.where('e.owner_id', filters.owner_id);
  if (filters.risk_level) q = q.where('e.risk_level', filters.risk_level);

  const rows = await q
    .select([
      'e.id',
      'e.title',
      'e.phase',
      'e.status',
      'u.display_name as owner_name',
      'e.risk_level',
      'e.portfolio',
      'e.created_at',
      'gd_a1.decided_at as gate_a1_decided_at',
      'gd_p2.decided_at as gate_p2_decided_at',
      'gd_p3.decided_at as gate_p3_decided_at',
      'gd_p4.decided_at as gate_p4_decided_at',
      'ms_pa.target_date as planning_approval_date',
      'ms_er.target_date as evidence_readiness_date',
      'ms_fr.target_date as final_readiness_date',
    ])
    .orderBy('e.updated_at', 'desc');

  // Build CSV
  const header = [
    'Engagement ID',
    'Title',
    'Phase',
    'Status',
    'Owner',
    'Risk Level',
    'Portfolio',
    'Due Date',
    'A1 Status',
    'P2 Status',
    'P3 Status',
    'P4 Status',
    'Planning Approval Date',
    'Evidence Readiness Date',
    'Final Readiness Date',
    'Created Date',
  ].join(',');

  const csvRows = rows.map((row: Record<string, unknown>) => {
    const a1Status = row.gate_a1_decided_at ? 'approved' : 'not_started';
    const p2Status = row.gate_p2_decided_at ? 'approved' : 'not_started';
    const p3Status = row.gate_p3_decided_at ? 'approved' : 'not_started';
    const p4Status = row.gate_p4_decided_at ? 'approved' : 'not_started';

    const toDateStr = (val: unknown): string => {
      if (!val) return '';
      const s = val instanceof Date ? val.toISOString() : String(val);
      return s.split('T')[0];
    };

    return [
      csvEscape(row.id as string),
      csvEscape(row.title as string),
      csvEscape(row.phase as string),
      csvEscape(row.status as string),
      csvEscape(row.owner_name as string),
      csvEscape(row.risk_level as string),
      csvEscape(row.portfolio as string),
      csvEscape(''), // Due Date — not a direct engagement field
      csvEscape(a1Status),
      csvEscape(p2Status),
      csvEscape(p3Status),
      csvEscape(p4Status),
      csvEscape(toDateStr(row.planning_approval_date)),
      csvEscape(toDateStr(row.evidence_readiness_date)),
      csvEscape(toDateStr(row.final_readiness_date)),
      csvEscape(toDateStr(row.created_at)),
    ].join(',');
  });

  return [header, ...csvRows].join('\n');
}
