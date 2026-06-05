import { db } from '../db';

export interface AuditEvent {
  id: string;
  engagement_id: string;
  actor_id: string;
  actor_name: string;
  actor_roles: string[];
  action: string;
  entity_type: string | null;
  entity_id: string | null;
  summary: string;
  metadata: Record<string, unknown> | null;
  created_at: string;
}

export interface AuditFilters {
  action_type?: string;
  date_from?: string;
  date_to?: string;
  limit?: number;
  offset?: number;
}

export async function getAuditEvents(
  engagementId: string,
  filters: AuditFilters = {}
): Promise<{ events: AuditEvent[]; total: number }> {
  const limit = Math.min(filters.limit ?? 20, 100);
  const offset = filters.offset ?? 0;

  // Build base query
  let query = db('audit_events as ae')
    .join('users as actor', 'ae.actor_id', 'actor.id')
    .where('ae.engagement_id', engagementId)
    .orderBy('ae.created_at', 'desc');

  // Optional filters
  if (filters.action_type) {
    query = query.where('ae.action', filters.action_type);
  }
  if (filters.date_from) {
    query = query.where('ae.created_at', '>=', new Date(filters.date_from));
  }
  if (filters.date_to) {
    // End of day inclusive
    const endOfDay = new Date(filters.date_to);
    endOfDay.setHours(23, 59, 59, 999);
    query = query.where('ae.created_at', '<=', endOfDay);
  }

  // Count total matching events (before pagination)
  const countQuery = query.clone().count('ae.id as count').first();
  const { count } = await countQuery as { count: string | number };
  const total = typeof count === 'string' ? parseInt(count, 10) : count;

  // Paginated results
  const rows = await query
    .select(
      'ae.id',
      'ae.engagement_id',
      'ae.actor_id',
      'actor.display_name as actor_name',
      'ae.actor_roles',
      'ae.action',
      'ae.entity_type',
      'ae.entity_id',
      'ae.summary',
      'ae.metadata',
      'ae.created_at'
    )
    .limit(limit)
    .offset(offset);

  const events: AuditEvent[] = rows.map((r: Record<string, unknown>) => ({
    id: r.id as string,
    engagement_id: r.engagement_id as string,
    actor_id: r.actor_id as string,
    actor_name: r.actor_name as string,
    actor_roles: Array.isArray(r.actor_roles)
      ? (r.actor_roles as string[])
      : typeof r.actor_roles === 'string'
        ? JSON.parse(r.actor_roles as string)
        : [],
    action: r.action as string,
    entity_type: r.entity_type as string | null,
    entity_id: r.entity_id as string | null,
    summary: r.summary as string,
    metadata: r.metadata ? (typeof r.metadata === 'string' ? JSON.parse(r.metadata as string) : r.metadata as Record<string, unknown>) : null,
    created_at: r.created_at instanceof Date ? (r.created_at as Date).toISOString() : r.created_at as string,
  }));

  return { events, total };
}
