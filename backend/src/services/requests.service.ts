import { db } from '../db';
import { storageProvider } from '../storage/local.storage';

export type RequestStatus = 'draft' | 'submitted' | 'accepted' | 'declined';
export type RequestType = 'congressional' | 'mandate' | 'internal';

export interface RequestRecord {
  id: string;
  request_number: number;
  request_id_display: string; // REQ-YYYY-NNNNN
  request_type: RequestType | null;
  requester_name: string | null;
  requester_org: string | null;
  topic: string | null;
  agency_program: string | null;
  due_date: string | null;
  notes: string | null;
  status: RequestStatus;
  file_ref: string | null;
  filename: string | null;
  file_size: number | null;
  created_by: string;
  created_at: string;
  updated_at: string;
}

function formatRequestId(request_number: number, created_at: Date | string): string {
  const year = new Date(created_at).getFullYear();
  return `REQ-${year}-${String(request_number).padStart(5, '0')}`;
}

function toRecord(row: Record<string, unknown>): RequestRecord {
  return {
    id: row.id as string,
    request_number: row.request_number as number,
    request_id_display: formatRequestId(row.request_number as number, row.created_at as string),
    request_type: row.request_type as RequestType | null,
    requester_name: row.requester_name as string | null,
    requester_org: row.requester_org as string | null,
    topic: row.topic as string | null,
    agency_program: row.agency_program as string | null,
    due_date: row.due_date ? (new Date(row.due_date as string | Date)).toISOString().split('T')[0] : null,
    notes: row.notes as string | null,
    status: row.status as RequestStatus,
    file_ref: row.file_ref as string | null,
    filename: row.filename as string | null,
    file_size: row.file_size as number | null,
    created_by: row.created_by as string,
    created_at: row.created_at instanceof Date ? (row.created_at as Date).toISOString() : (row.created_at as string),
    updated_at: row.updated_at instanceof Date ? (row.updated_at as Date).toISOString() : (row.updated_at as string),
  };
}

export async function listRequests(filters: {
  status?: string;
  requester?: string;
  limit?: number;
  offset?: number;
}): Promise<{ requests: RequestRecord[]; total: number }> {
  const limit = Math.min(filters.limit ?? 20, 100);
  const offset = filters.offset ?? 0;

  // Build the WHERE clause first (no orderBy yet) so we can reuse it for
  // both COUNT(*) and the page query. Postgres rejects ORDER BY in an
  // aggregate query without a matching GROUP BY, so counting on a query
  // that already carries orderBy() returns 'column must appear in GROUP BY'.
  let q = db('requests');
  if (filters.status) q = q.where({ status: filters.status });
  if (filters.requester) q = q.where('requester_name', 'ilike', `%${filters.requester}%`);

  const countResult = await q.clone().count('id as count').first() as { count: string | number };
  const total = typeof countResult.count === 'string' ? parseInt(countResult.count, 10) : countResult.count;

  const rows = await q.select('*').orderBy('updated_at', 'desc').limit(limit).offset(offset);
  return { requests: rows.map(toRecord), total };
}

export async function createRequest(data: {
  request_type?: string;
  requester_name?: string;
  requester_org?: string;
  topic?: string;
  agency_program?: string;
  due_date?: string;
  notes?: string;
  created_by: string;
}): Promise<RequestRecord> {
  const [row] = await db('requests')
    .insert({
      request_type: data.request_type ?? null,
      requester_name: data.requester_name ?? null,
      requester_org: data.requester_org ?? null,
      topic: data.topic ?? null,
      agency_program: data.agency_program ?? null,
      due_date: data.due_date ?? null,
      notes: data.notes ?? null,
      status: 'draft',
      created_by: data.created_by,
    })
    .returning('*');
  return toRecord(row);
}

export async function getRequest(id: string): Promise<RequestRecord | null> {
  const row = await db('requests').where({ id }).first();
  return row ? toRecord(row) : null;
}

export async function updateRequest(
  id: string,
  data: Partial<{
    request_type: string;
    requester_name: string;
    requester_org: string;
    topic: string;
    agency_program: string;
    due_date: string;
    notes: string;
  }>
): Promise<RequestRecord> {
  // Only allow updates on draft requests
  const existing = await db('requests').where({ id }).first();
  if (!existing) throw Object.assign(new Error('Request not found'), { status: 404 });
  if (existing.status !== 'draft') {
    throw Object.assign(new Error('Only draft requests can be edited'), { status: 409 });
  }

  const [row] = await db('requests')
    .where({ id })
    .update({ ...data, updated_at: db.fn.now() })
    .returning('*');
  return toRecord(row);
}

export async function submitRequest(id: string): Promise<RequestRecord> {
  const existing = await db('requests').where({ id }).first();
  if (!existing) throw Object.assign(new Error('Request not found'), { status: 404 });
  if (existing.status !== 'draft') {
    throw Object.assign(new Error('Only draft requests can be submitted'), { status: 409 });
  }

  // Validate required fields for submission
  const missing: string[] = [];
  if (!existing.request_type) missing.push('request_type');
  if (!existing.requester_name) missing.push('requester_name');
  if (!existing.topic) missing.push('topic');
  if (!existing.agency_program) missing.push('agency_program');
  if (!existing.due_date) missing.push('due_date');

  if (missing.length > 0) {
    throw Object.assign(
      new Error('Required fields missing for submission'),
      { status: 422, fields: missing }
    );
  }

  const [row] = await db('requests')
    .where({ id })
    .update({ status: 'submitted', updated_at: db.fn.now() })
    .returning('*');
  return toRecord(row);
}

export async function uploadIntakeDocument(
  id: string,
  fileBuffer: Buffer,
  originalFilename: string,
  mimeType: string,
  fileSize: number
): Promise<{ file_ref: string; filename: string; size: number }> {
  const existing = await db('requests').where({ id }).first();
  if (!existing) throw Object.assign(new Error('Request not found'), { status: 404 });

  // Delete previous file if exists
  if (existing.file_ref) {
    await storageProvider.delete(existing.file_ref);
  }

  const { file_ref } = await storageProvider.save(fileBuffer, originalFilename, mimeType);

  await db('requests')
    .where({ id })
    .update({
      file_ref,
      filename: originalFilename,
      file_size: fileSize,
      updated_at: db.fn.now(),
    });

  return { file_ref, filename: originalFilename, size: fileSize };
}

export async function deleteIntakeDocument(id: string): Promise<void> {
  const existing = await db('requests').where({ id }).first();
  if (!existing) throw Object.assign(new Error('Request not found'), { status: 404 });

  if (existing.file_ref) {
    await storageProvider.delete(existing.file_ref);
    await db('requests')
      .where({ id })
      .update({ file_ref: null, filename: null, file_size: null, updated_at: db.fn.now() });
  }
}
