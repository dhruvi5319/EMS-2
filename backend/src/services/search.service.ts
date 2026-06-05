import { db } from '../db';

export interface SearchResult {
  id: string;
  job_code: string;
  title: string;
  phase: string;
  owner_name: string;
  requester_name: string;
  status: string;
}

export async function searchEngagements(
  query: string,
  userId: string,
  userRoles: string[],
  limit = 10
): Promise<SearchResult[]> {
  const isAdmin = userRoles.includes('AD');

  // Build base query: join engagements with owner (users) and requester
  let baseQuery = db('engagements as e')
    .join('users as owner', 'e.owner_id', 'owner.id')
    .leftJoin('requests as req', 'e.request_id', 'req.id')
    .leftJoin('users as requester', 'req.created_by', 'requester.id')
    .select(
      'e.id',
      'e.job_code',
      'e.title',
      'e.phase',
      'e.status',
      'owner.display_name as owner_name',
      db.raw("COALESCE(requester.display_name, '') as requester_name")
    )
    .where('e.is_archived', false)
    .limit(limit);

  // Scope to authorized engagements (unless admin)
  if (!isAdmin) {
    baseQuery = baseQuery.whereIn('e.id', function (this: import('knex').Knex.QueryBuilder) {
      this.select('ta.engagement_id')
        .from('team_assignments as ta')
        .where('ta.user_id', userId);
    });
  }

  // Full-text search across job_code, title, owner name, requester name
  // Use ILIKE for case-insensitive partial match (PostgreSQL)
  const searchTerm = `%${query}%`;
  baseQuery = baseQuery.where(function (this: import('knex').Knex.QueryBuilder) {
    this.where('e.job_code', 'ilike', searchTerm)
      .orWhere('e.title', 'ilike', searchTerm)
      .orWhere('owner.display_name', 'ilike', searchTerm)
      .orWhere('requester.display_name', 'ilike', searchTerm);
  });

  const rows = await baseQuery;

  return rows.map((r: Record<string, unknown>) => ({
    id: r.id as string,
    job_code: r.job_code as string,
    title: r.title as string,
    phase: r.phase as string,
    status: r.status as string,
    owner_name: r.owner_name as string,
    requester_name: r.requester_name as string,
  }));
}
