import { db } from '../db';

// ---- Types ----

export type SufficiencyStatus = 'evidence_needed' | 'in_review' | 'sufficient';

export interface CoverageObjective {
  id: string;
  objective_text: string;
  information_need: string | null;
  sort_order: number;
  evidence_count: number;
  sufficiency_status: SufficiencyStatus;
}

// ---- Service Functions ----

/**
 * Get objective coverage summary for an engagement.
 * Returns all active objectives with evidence_count and sufficiency_status.
 * sufficiency_status is stored as a column on objectives (added in migration 003).
 */
export async function getObjectiveCoverage(engagementId: string): Promise<{
  objectives: CoverageObjective[];
  uncovered_count: number;
  total: number;
  covered: number;
}> {
  const rows = await db('objectives as o')
    .leftJoin('objective_evidence_links as oel', 'oel.objective_id', 'o.id')
    .where({ 'o.engagement_id': engagementId, 'o.status': 'active' })
    .groupBy(
      'o.id',
      'o.objective_text',
      'o.information_need',
      'o.display_order',
      'o.sufficiency_status'
    )
    .select(
      'o.id',
      'o.objective_text',
      'o.information_need',
      'o.display_order',
      db.raw("COALESCE(o.sufficiency_status, 'evidence_needed') AS sufficiency_status"),
      db.raw('COUNT(oel.id)::int AS evidence_count')
    )
    .orderBy('o.display_order', 'asc');

  const objectives: CoverageObjective[] = rows.map((row: Record<string, unknown>) => ({
    id: row.id as string,
    objective_text: row.objective_text as string,
    information_need: row.information_need as string | null,
    sort_order: row.display_order as number,
    evidence_count: Number(row.evidence_count) || 0,
    sufficiency_status: ((row.sufficiency_status as SufficiencyStatus) || 'evidence_needed'),
  }));

  const uncovered_count = objectives.filter((o) => o.evidence_count === 0).length;

  return {
    objectives,
    uncovered_count,
    total: objectives.length,
    covered: objectives.length - uncovered_count,
  };
}

/**
 * Get objectives linked to a specific evidence item.
 */
export async function getLinkedObjectivesForEvidence(
  engagementId: string,
  evidenceId: string
): Promise<Array<{ id: string; objective_text: string }>> {
  // Validate evidence belongs to engagement
  const evidence = await db('evidence_items')
    .where({ id: evidenceId, engagement_id: engagementId })
    .first();

  if (!evidence) {
    throw Object.assign(new Error('Evidence item not found.'), { status: 404 });
  }

  const rows = await db('objectives as o')
    .join('objective_evidence_links as oel', 'oel.objective_id', 'o.id')
    .where('oel.evidence_id', evidenceId)
    .where('o.engagement_id', engagementId)
    .select('o.id', 'o.objective_text')
    .orderBy('o.display_order', 'asc');

  return rows.map((r: Record<string, unknown>) => ({
    id: r.id as string,
    objective_text: r.objective_text as string,
  }));
}

/**
 * Link evidence to one or more objectives.
 * Deduplicates: checks existing links first, inserts only new pairs using ON CONFLICT DO NOTHING.
 * linked_by is populated from the authenticated actor via the route handler (passed as actorId).
 */
export async function linkEvidenceToObjectives(
  engagementId: string,
  evidenceId: string,
  objectiveIds: string[],
  actorId: string
): Promise<{ linked: number; skipped: number }> {
  // Validate evidenceId belongs to this engagement
  const evidence = await db('evidence_items')
    .where({ id: evidenceId, engagement_id: engagementId })
    .first();

  if (!evidence) {
    throw Object.assign(new Error('Evidence item not found for this engagement.'), { status: 404 });
  }

  // Validate all objectiveIds belong to this engagement (active objectives only)
  const validObjectives = await db('objectives')
    .where({ engagement_id: engagementId, status: 'active' })
    .whereIn('id', objectiveIds)
    .select('id');

  if (validObjectives.length !== objectiveIds.length) {
    throw Object.assign(
      new Error('One or more objective IDs are invalid for this engagement.'),
      { status: 422 }
    );
  }

  // Get existing links to count skipped
  const existingLinks = await db('objective_evidence_links')
    .where({ evidence_id: evidenceId })
    .whereIn('objective_id', objectiveIds)
    .select('objective_id');

  const existingObjectiveIds = new Set(
    existingLinks.map((l: Record<string, string>) => l.objective_id)
  );

  const toInsert = objectiveIds.filter((id) => !existingObjectiveIds.has(id));

  if (toInsert.length > 0) {
    // Build parameterized INSERT with ON CONFLICT DO NOTHING
    const placeholders = toInsert.map(() => '(?, ?, ?)').join(', ');
    const values = toInsert.flatMap((objectiveId) => [objectiveId, evidenceId, actorId]);

    await db.raw(
      `INSERT INTO objective_evidence_links (objective_id, evidence_id, linked_by)
       VALUES ${placeholders}
       ON CONFLICT (objective_id, evidence_id) DO NOTHING`,
      values
    );
  }

  return {
    linked: toInsert.length,
    skipped: objectiveIds.length - toInsert.length,
  };
}

/**
 * Unlink an evidence item from an objective.
 */
export async function unlinkEvidenceFromObjective(
  engagementId: string,
  evidenceId: string,
  objectiveId: string
): Promise<{ message: string }> {
  // Verify the evidence item belongs to this engagement
  const evidence = await db('evidence_items')
    .where({ id: evidenceId, engagement_id: engagementId })
    .first();

  if (!evidence) {
    throw Object.assign(new Error('Evidence item not found for this engagement.'), { status: 404 });
  }

  const link = await db('objective_evidence_links')
    .where({ evidence_id: evidenceId, objective_id: objectiveId })
    .first();

  if (!link) {
    throw Object.assign(new Error('Link not found.'), { status: 404 });
  }

  await db('objective_evidence_links')
    .where({ evidence_id: evidenceId, objective_id: objectiveId })
    .delete();

  return { message: 'Link removed.' };
}

/**
 * Set sufficiency status for multiple objectives.
 * Blocks in_review/sufficient when evidence_count = 0.
 * Writes an audit event.
 */
export async function setSufficiency(
  engagementId: string,
  updates: Array<{ objective_id: string; sufficiency: string }>,
  actorId: string
): Promise<{ updated: number }> {
  const validStatuses: SufficiencyStatus[] = ['evidence_needed', 'in_review', 'sufficient'];

  for (const update of updates) {
    if (!validStatuses.includes(update.sufficiency as SufficiencyStatus)) {
      throw Object.assign(
        new Error(
          `Invalid sufficiency value: "${update.sufficiency}". Must be one of: ${validStatuses.join(', ')}.`
        ),
        { status: 422 }
      );
    }

    if (update.sufficiency === 'in_review' || update.sufficiency === 'sufficient') {
      const linkCount = await db('objective_evidence_links')
        .where({ objective_id: update.objective_id })
        .count('id as cnt')
        .first();

      const count = parseInt(String(linkCount?.cnt ?? 0), 10);
      if (count === 0) {
        throw Object.assign(
          new Error(
            'Cannot mark objective In Review or Sufficient — it has no linked evidence items.'
          ),
          { status: 422 }
        );
      }
    }
  }

  // Update sufficiency_status on objectives table
  for (const update of updates) {
    await db('objectives')
      .where({ id: update.objective_id, engagement_id: engagementId })
      .update({
        sufficiency_status: update.sufficiency as SufficiencyStatus,
        updated_at: db.fn.now(),
      });
  }

  // Write audit event
  await db('audit_events').insert({
    engagement_id: engagementId,
    actor_id: actorId,
    action: 'OBJECTIVE_SUFFICIENCY_UPDATED',
    object_type: 'objective',
    object_id: null,
    summary: `Updated sufficiency for ${updates.length} objective(s).`,
    after_state: JSON.stringify({ updates }),
  });

  return { updated: updates.length };
}
