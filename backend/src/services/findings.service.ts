import { db } from '../db';
import { getObjectiveCoverage } from './objectivecoverage.service';

// ---- Types ----

export type FindingStatus = 'draft' | 'under_review' | 'accepted' | 'rejected';

export interface Finding {
  id: string;
  engagement_id: string;
  finding_text: string;
  status: FindingStatus;
  created_by: string;
  created_at: string;
  updated_at: string;
  evidence_ids?: string[];
  evidence_count?: number;
}

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

// ---- Helpers ----

function toFinding(row: Record<string, unknown>): Finding {
  return {
    id: row.id as string,
    engagement_id: row.engagement_id as string,
    finding_text: row.finding_text as string,
    status: row.status as FindingStatus,
    created_by: row.created_by as string,
    created_at: row.created_at instanceof Date
      ? (row.created_at as Date).toISOString()
      : (row.created_at as string),
    updated_at: row.updated_at instanceof Date
      ? (row.updated_at as Date).toISOString()
      : (row.updated_at as string),
  };
}

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

// ---- Service Functions ----

/**
 * List all findings for an engagement with their linked evidence IDs.
 * Applies sensitivity-based filtering: AL/RO viewers cannot see restricted evidence IDs.
 */
export async function listFindings(
  engagementId: string,
  viewerRoles: string[]
): Promise<{ findings: Finding[]; total: number }> {
  const rows = await db('findings')
    .where({ engagement_id: engagementId })
    .orderBy('created_at', 'desc');

  const canViewRestricted = viewerRoles.some((r) => !['AL', 'RO'].includes(r));

  const findings = await Promise.all(
    rows.map(async (row: Record<string, unknown>) => {
      const finding = toFinding(row);

      // Get linked evidence IDs
      let linkQuery = db('finding_evidence_links as fel')
        .join('evidence_items as ei', 'ei.id', 'fel.evidence_id')
        .where({ 'fel.finding_id': finding.id });

      if (!canViewRestricted) {
        linkQuery = linkQuery.where({ 'ei.sensitivity': 'standard' });
      }

      const links = await linkQuery.select('fel.evidence_id');
      const evidenceIds = links.map((l: Record<string, string>) => l.evidence_id);

      finding.evidence_ids = evidenceIds;
      finding.evidence_count = evidenceIds.length;

      return finding;
    })
  );

  return { findings, total: findings.length };
}

/**
 * Create a new finding with optional evidence links.
 */
export async function createFinding(
  engagementId: string,
  data: { finding_text: string; evidence_ids?: string[] },
  actorId: string
): Promise<Finding> {
  if (!data.finding_text || data.finding_text.trim().length === 0) {
    throw Object.assign(new Error('Finding text is required.'), { status: 422 });
  }

  const [inserted] = await db('findings')
    .insert({
      engagement_id: engagementId,
      finding_text: data.finding_text.trim(),
      status: 'draft',
      created_by: actorId,
    })
    .returning('*');

  const finding = toFinding(inserted);
  let evidenceIds: string[] = [];

  if (data.evidence_ids && data.evidence_ids.length > 0) {
    // Validate each evidenceId belongs to this engagement
    const validEvidence = await db('evidence_items')
      .where({ engagement_id: engagementId })
      .whereIn('id', data.evidence_ids)
      .select('id');

    const validIds = validEvidence.map((e: Record<string, string>) => e.id);

    if (validIds.length > 0) {
      await db('finding_evidence_links').insert(
        validIds.map((evidenceId: string) => ({
          finding_id: finding.id,
          evidence_id: evidenceId,
          linked_by: actorId,
        }))
      );
      evidenceIds = validIds;
    }
  }

  finding.evidence_ids = evidenceIds;
  finding.evidence_count = evidenceIds.length;

  return finding;
}

/**
 * Update a finding's text, evidence links, and/or status.
 */
export async function updateFinding(
  engagementId: string,
  findingId: string,
  data: { finding_text?: string; evidence_ids?: string[]; status?: string },
  actorId: string
): Promise<Finding> {
  const existing = await db('findings')
    .where({ id: findingId, engagement_id: engagementId })
    .first();

  if (!existing) {
    throw Object.assign(new Error('Finding not found.'), { status: 404 });
  }

  if (data.finding_text !== undefined && data.finding_text.trim().length === 0) {
    throw Object.assign(new Error('Finding text cannot be empty.'), { status: 422 });
  }

  const validStatuses: FindingStatus[] = ['draft', 'under_review', 'accepted', 'rejected'];
  if (data.status !== undefined && !validStatuses.includes(data.status as FindingStatus)) {
    throw Object.assign(
      new Error(`Invalid status. Must be one of: ${validStatuses.join(', ')}`),
      { status: 422 }
    );
  }

  const updateData: Record<string, unknown> = { updated_at: db.fn.now() };
  if (data.finding_text !== undefined) updateData.finding_text = data.finding_text.trim();
  if (data.status !== undefined) updateData.status = data.status;

  const [updated] = await db('findings')
    .where({ id: findingId, engagement_id: engagementId })
    .update(updateData)
    .returning('*');

  const finding = toFinding(updated);

  // Replace evidence links if evidence_ids provided
  if (data.evidence_ids !== undefined) {
    await db('finding_evidence_links')
      .where({ finding_id: findingId })
      .delete();

    if (data.evidence_ids.length > 0) {
      const validEvidence = await db('evidence_items')
        .where({ engagement_id: engagementId })
        .whereIn('id', data.evidence_ids)
        .select('id');

      const validIds = validEvidence.map((e: Record<string, string>) => e.id);

      if (validIds.length > 0) {
        await db('finding_evidence_links').insert(
          validIds.map((evidenceId: string) => ({
            finding_id: findingId,
            evidence_id: evidenceId,
            linked_by: actorId,
          }))
        );
      }

      finding.evidence_ids = validIds;
      finding.evidence_count = validIds.length;
    } else {
      finding.evidence_ids = [];
      finding.evidence_count = 0;
    }
  } else {
    // Attach current evidence IDs
    const links = await db('finding_evidence_links')
      .where({ finding_id: findingId })
      .select('evidence_id');
    finding.evidence_ids = links.map((l: Record<string, string>) => l.evidence_id);
    finding.evidence_count = (finding.evidence_ids as string[]).length;
  }

  return finding;
}

/**
 * Delete a finding and all its evidence links in a transaction.
 */
export async function deleteFinding(
  engagementId: string,
  findingId: string
): Promise<{ message: string }> {
  const existing = await db('findings')
    .where({ id: findingId, engagement_id: engagementId })
    .first();

  if (!existing) {
    throw Object.assign(new Error('Finding not found.'), { status: 404 });
  }

  await db.transaction(async (trx) => {
    await trx('finding_evidence_links')
      .where({ finding_id: findingId })
      .delete();

    await trx('findings')
      .where({ id: findingId, engagement_id: engagementId })
      .delete();
  });

  return { message: 'Finding deleted.' };
}

/**
 * Check P3 prerequisites for an engagement.
 * Returns { all_pass: boolean, blockers: Array<{ type, message }> }
 *
 * Checks:
 * 1. P2 gate has been approved
 * 2. All objectives have ≥1 linked evidence
 * 3. No objective has sufficiency_status = 'evidence_needed'
 * 4. All findings have ≥1 linked evidence
 */
export async function checkP3Prerequisites(engagementId: string): Promise<{
  all_pass: boolean;
  blockers: Array<{ type: string; message: string }>;
}> {
  const blockers: Array<{ type: string; message: string }> = [];

  // 1. Check P2 gate approved
  const p2Decision = await db('gate_decisions')
    .where({
      engagement_id: engagementId,
      gate_type: 'P2',
      status: 'passed',
    })
    .first();

  if (!p2Decision) {
    blockers.push({
      type: 'p2_not_approved',
      message: 'Gate P2 has not been approved.',
    });
  }

  // 2 & 3. Check objectives via coverage
  const coverage = await getObjectiveCoverage(engagementId);

  for (const objective of coverage.objectives) {
    const truncatedText = objective.objective_text.length > 60
      ? `${objective.objective_text.substring(0, 60)}…`
      : objective.objective_text;

    if (objective.evidence_count === 0) {
      blockers.push({
        type: 'objective_no_evidence',
        message: `Objective "${truncatedText}" has no linked evidence.`,
      });
    }

    if (objective.sufficiency_status === 'evidence_needed') {
      blockers.push({
        type: 'objective_evidence_needed',
        message: `Objective "${truncatedText}" is marked Evidence Needed.`,
      });
    }
  }

  // 4. Check all findings have ≥1 linked evidence
  const findingsWithNoEvidence = await db('findings as f')
    .leftJoin('finding_evidence_links as fel', 'fel.finding_id', 'f.id')
    .where({ 'f.engagement_id': engagementId })
    .groupBy('f.id', 'f.finding_text')
    .having(db.raw('COUNT(fel.id) = 0'))
    .select('f.id', 'f.finding_text');

  findingsWithNoEvidence.forEach((finding: Record<string, unknown>, index: number) => {
    blockers.push({
      type: 'finding_no_evidence',
      message: `Finding FD-${index + 1} has no linked evidence.`,
    });
  });

  return {
    all_pass: blockers.length === 0,
    blockers,
  };
}

/**
 * Record a Gate P3 decision (approved or returned).
 * On approved: creates GateDecision, AuditEvent, sets engagement.phase = 'draft'.
 * On returned: creates GateDecision, AuditEvent.
 */
export async function recordP3Decision(
  engagementId: string,
  data: { decision: 'approved' | 'returned'; comment?: string },
  actorId: string
): Promise<{ gate_decision: GateDecision }> {
  // Validate decision value
  if (!data.decision || !['approved', 'returned'].includes(data.decision)) {
    throw Object.assign(
      new Error('Decision must be "approved" or "returned".'),
      { status: 422 }
    );
  }

  // Validate comment — required and ≥10 chars
  if (!data.comment || data.comment.trim().length < 10) {
    throw Object.assign(
      new Error('Decision comment must be at least 10 characters.'),
      { status: 422 }
    );
  }

  // Prevent duplicate P3 approval — only one approved P3 decision per engagement
  if (data.decision === 'approved') {
    const existingApproval = await db('gate_decisions')
      .where({ engagement_id: engagementId, gate_type: 'P3', status: 'passed' })
      .first();
    if (existingApproval) {
      throw Object.assign(
        new Error('Gate P3 has already been approved for this engagement.'),
        { status: 409 }
      );
    }
  }

  // Re-run prerequisites check (server-side re-validation)
  const prereqResult = await checkP3Prerequisites(engagementId);
  if (!prereqResult.all_pass) {
    throw Object.assign(
      new Error('P3 prerequisites not met.'),
      { status: 422, blockers: prereqResult.blockers }
    );
  }

  // Execute in a DB transaction
  return db.transaction(async (trx) => {
    const now = new Date();

    // 1. INSERT gate_decision
    const [gateDecisionRow] = await trx('gate_decisions')
      .insert({
        engagement_id: engagementId,
        gate_type: 'P3',
        status: data.decision === 'approved' ? 'passed' : 'returned',
        decided_by: actorId,
        decided_at: now,
        rationale: data.comment!.trim(),
        comment: data.comment!.trim(),
      })
      .returning('*');

    // 2. INSERT audit_event
    const actionCode = data.decision === 'approved' ? 'GATE_P3_APPROVED' : 'GATE_P3_RETURNED';
    await trx('audit_events').insert({
      engagement_id: engagementId,
      actor_id: actorId,
      action: actionCode,
      object_type: 'gate_decision',
      object_id: gateDecisionRow.id,
      summary: data.decision === 'approved'
        ? 'Gate P3 approved — engagement advances to draft.'
        : 'Gate P3 returned — engagement sent back for revision.',
      after_state: JSON.stringify({ decision: data.decision, comment: data.comment }),
    });

    // 3. If approved: set engagement.phase = 'draft'
    if (data.decision === 'approved') {
      await trx('engagements')
        .where({ id: engagementId })
        .update({ phase: 'draft', updated_at: now });
    }

    return { gate_decision: toGateDecision(gateDecisionRow) };
  });
}
