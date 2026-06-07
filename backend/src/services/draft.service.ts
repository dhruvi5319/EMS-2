import { db } from '../db';
import { storageProvider } from '../storage/local.storage';

// ─── Types ───────────────────────────────────────────────────────────────────

export type DraftStatus =
  | 'drafting'
  | 'under_review'
  | 'ready_for_ref_check'
  | 'ready_for_final_review';

export interface DraftProduct {
  id: string;
  engagement_id: string;
  title: string;
  version: string;
  owner_id: string | null;
  status: DraftStatus;
  draft_notes: string | null;
  file_ref: string | null;
  filename: string | null;
  file_size: number | null;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface DraftComment {
  id: string;
  draft_id: string;
  author_id: string;
  author_name: string;
  comment_text: string;
  created_at: string;
}

// ─── Constants ───────────────────────────────────────────────────────────────

/** F11.3 draft file allowlist — includes ZIP, excludes PNG/JPG vs evidence allowlist */
const DRAFT_ALLOWED_MIME_TYPES = new Set([
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-excel',
  'text/plain',
  'application/zip',
  'application/x-zip-compressed',
]);

const DRAFT_MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024; // 50MB

/**
 * Server-side status transition table.
 * Key = current status, Value = allowed next statuses.
 * under_review → drafting is allowed here; QA/AD role restriction is enforced at the route layer.
 */
const ALLOWED_TRANSITIONS: Record<string, string[]> = {
  drafting: ['under_review'],
  under_review: ['ready_for_ref_check', 'drafting'],
  ready_for_ref_check: ['ready_for_final_review'],
  ready_for_final_review: ['under_review'],
};

// ─── Row mappers ─────────────────────────────────────────────────────────────

function toDraftProduct(row: Record<string, unknown>): DraftProduct {
  return {
    id: row.id as string,
    engagement_id: row.engagement_id as string,
    title: row.title as string,
    version: row.version as string,
    owner_id: (row.owner_id as string) ?? null,
    status: row.status as DraftStatus,
    draft_notes: (row.draft_notes as string) ?? null,
    // Map DB column names to interface field names
    file_ref: (row.draft_file_ref as string) ?? null,
    filename: (row.draft_filename as string) ?? null,
    // DB has no file_size column; expose as null for interface compat
    file_size: null,
    created_by: row.created_by as string,
    created_at:
      row.created_at instanceof Date
        ? (row.created_at as Date).toISOString()
        : (row.created_at as string),
    updated_at:
      row.updated_at instanceof Date
        ? (row.updated_at as Date).toISOString()
        : (row.updated_at as string),
  };
}

function toDraftComment(row: Record<string, unknown>): DraftComment {
  return {
    id: row.id as string,
    // DB column: draft_product_id → interface: draft_id
    draft_id: (row.draft_product_id ?? row.draft_id) as string,
    // DB column: commented_by → interface: author_id
    author_id: (row.commented_by ?? row.author_id) as string,
    author_name: (row.author_name ?? row.display_name ?? '') as string,
    comment_text: row.comment_text as string,
    // DB column: commented_at → interface: created_at
    created_at:
      (row.commented_at ?? row.created_at) instanceof Date
        ? ((row.commented_at ?? row.created_at) as Date).toISOString()
        : ((row.commented_at ?? row.created_at) as string),
  };
}

// ─── Service functions ────────────────────────────────────────────────────────

/**
 * Get the draft product for an engagement.
 * Returns null if no draft exists.
 */
export async function getDraft(engagementId: string): Promise<DraftProduct | null> {
  const row = await db('draft_products').where({ engagement_id: engagementId }).first();
  if (!row) return null;
  return toDraftProduct(row);
}

/**
 * Create a draft product for an engagement.
 * - Validates engagement.phase === 'draft' (P3 approved)
 * - Validates no existing draft for this engagement (409)
 */
export async function createDraft(
  engagementId: string,
  data: {
    title: string;
    version?: string;
    owner_id?: string;
    status?: string;
    draft_notes?: string;
  },
  userId: string
): Promise<DraftProduct> {
  // Validate engagement phase — P3 must be approved (engagement.phase = 'draft')
  const engagement = await db('engagements').where({ id: engagementId }).first();
  if (!engagement) {
    throw Object.assign(new Error('Engagement not found.'), { status: 404 });
  }
  if (engagement.phase !== 'draft') {
    throw Object.assign(
      new Error('Draft product can only be created after Gate P3 has been approved.'),
      { status: 422 }
    );
  }

  // Check no existing draft
  const existing = await db('draft_products').where({ engagement_id: engagementId }).first();
  if (existing) {
    throw Object.assign(
      new Error('Draft product already exists for this engagement.'),
      { status: 409 }
    );
  }

  if (!data.title || data.title.trim().length === 0) {
    throw Object.assign(new Error('Title is required.'), { status: 422 });
  }

  const [row] = await db('draft_products')
    .insert({
      engagement_id: engagementId,
      title: data.title.trim(),
      version: data.version ?? '0.1',
      owner_id: data.owner_id ?? null,
      status: data.status ?? 'drafting',
      draft_notes: data.draft_notes ?? null,
      created_by: userId,
    })
    .returning('*');

  return toDraftProduct(row);
}

/**
 * Update draft product metadata and/or status.
 * Enforces server-side status transition rules.
 */
export async function updateDraft(
  engagementId: string,
  data: {
    title?: string;
    version?: string;
    owner_id?: string;
    status?: string;
    draft_notes?: string;
  },
  _userId: string
): Promise<DraftProduct> {
  const existing = await db('draft_products').where({ engagement_id: engagementId }).first();
  if (!existing) {
    throw Object.assign(new Error('No draft product found.'), { status: 404 });
  }

  // Validate status transition if status is changing
  if (data.status !== undefined && data.status !== existing.status) {
    const allowed = ALLOWED_TRANSITIONS[existing.status as string] ?? [];
    if (!allowed.includes(data.status)) {
      throw Object.assign(new Error('Invalid status transition.'), { status: 422 });
    }

    // under_review → ready_for_ref_check: requires ≥1 draft statement
    if (existing.status === 'under_review' && data.status === 'ready_for_ref_check') {
      const statementCount = await db('draft_statements')
        .where({ draft_product_id: existing.id })
        .count('id as count')
        .first() as { count: string | number };
      const count =
        typeof statementCount.count === 'string'
          ? parseInt(statementCount.count, 10)
          : (statementCount.count as number);
      if (count === 0) {
        throw Object.assign(
          new Error(
            'At least one draft statement must be indexed before advancing to reference check.'
          ),
          { status: 422 }
        );
      }
    }
  }

  const updates: Record<string, unknown> = { updated_at: db.fn.now() };
  if (data.title !== undefined) updates.title = data.title.trim();
  if (data.version !== undefined) updates.version = data.version;
  if (data.owner_id !== undefined) updates.owner_id = data.owner_id;
  if (data.status !== undefined) updates.status = data.status;
  if (data.draft_notes !== undefined) updates.draft_notes = data.draft_notes;

  const [row] = await db('draft_products')
    .where({ engagement_id: engagementId })
    .update(updates)
    .returning('*');

  return toDraftProduct(row);
}

/**
 * Upload (or replace) a draft product file attachment.
 * Replaces previous file if one exists.
 * Accepts: PDF, DOCX, DOC, XLSX, XLS, TXT, ZIP (not PNG/JPG).
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type FileBuffer = any;

export async function uploadDraftFile(
  engagementId: string,
  file: { originalname: string; mimetype: string; size: number; buffer: FileBuffer },
  _userId: string
): Promise<{ file_ref: string; filename: string; size: number }> {
  const existing = await db('draft_products').where({ engagement_id: engagementId }).first();
  if (!existing) {
    throw Object.assign(new Error('No draft product found.'), { status: 404 });
  }

  // Validate MIME type against draft allowlist
  if (!DRAFT_ALLOWED_MIME_TYPES.has(file.mimetype)) {
    throw Object.assign(
      new Error(
        'File type not permitted. Allowed: PDF, DOCX, DOC, XLSX, XLS, TXT, ZIP.'
      ),
      { status: 400 }
    );
  }

  // Validate file size
  if (file.size > DRAFT_MAX_FILE_SIZE_BYTES) {
    throw Object.assign(new Error('File exceeds maximum size of 50 MB.'), { status: 400 });
  }

  // Delete previous file from storage if present
  if (existing.draft_file_ref) {
    try {
      await storageProvider.delete(existing.draft_file_ref as string);
    } catch (_err) {
      // log but do not fail — orphaned storage files are recoverable
      void _err;
    }
  }

  // Save new file to storage
  const { file_ref } = await storageProvider.save(file.buffer, file.originalname, file.mimetype);

  // Update draft_products row with new file info
  await db('draft_products')
    .where({ engagement_id: engagementId })
    .update({
      draft_file_ref: file_ref,
      draft_filename: file.originalname,
      updated_at: db.fn.now(),
    });

  return { file_ref, filename: file.originalname, size: file.size };
}

/**
 * Remove the draft product file attachment.
 * Clears draft_products.draft_file_ref and draft_filename.
 */
export async function deleteDraftFile(
  engagementId: string
): Promise<{ message: string }> {
  const existing = await db('draft_products').where({ engagement_id: engagementId }).first();
  if (!existing) {
    throw Object.assign(new Error('No draft product found.'), { status: 404 });
  }

  if (!existing.draft_file_ref) {
    throw Object.assign(new Error('No file attached to this draft.'), { status: 404 });
  }

  // Delete from storage — log but do not fail
  try {
    await storageProvider.delete(existing.draft_file_ref as string);
  } catch (_err) {
    void _err;
  }

  await db('draft_products')
    .where({ engagement_id: engagementId })
    .update({
      draft_file_ref: null,
      draft_filename: null,
      updated_at: db.fn.now(),
    });

  return { message: 'Draft file removed.' };
}

/**
 * List review comments for a draft product (newest-first).
 */
export async function listDraftComments(
  engagementId: string
): Promise<{ comments: DraftComment[]; total: number }> {
  const draft = await db('draft_products').where({ engagement_id: engagementId }).first();
  if (!draft) {
    throw Object.assign(new Error('No draft product found.'), { status: 404 });
  }

  const rows = await db('draft_comments as dc')
    .join('users as u', 'u.id', 'dc.commented_by')
    .where('dc.draft_product_id', draft.id)
    .select('dc.*', 'u.display_name as author_name')
    .orderBy('dc.commented_at', 'desc');

  return { comments: rows.map(toDraftComment), total: rows.length };
}

/**
 * Add a review comment to the draft product (append-only).
 */
export async function addDraftComment(
  engagementId: string,
  data: { comment_text: string },
  userId: string
): Promise<DraftComment> {
  const draft = await db('draft_products').where({ engagement_id: engagementId }).first();
  if (!draft) {
    throw Object.assign(new Error('No draft product found.'), { status: 404 });
  }

  if (!data.comment_text || data.comment_text.trim().length === 0) {
    throw Object.assign(new Error('comment_text is required and cannot be empty.'), { status: 422 });
  }

  const [row] = await db('draft_comments')
    .insert({
      draft_product_id: draft.id,
      comment_text: data.comment_text.trim(),
      commented_by: userId,
    })
    .returning('*');

  // Fetch with author name for return
  const withAuthor = await db('draft_comments as dc')
    .join('users as u', 'u.id', 'dc.commented_by')
    .where('dc.id', row.id)
    .select('dc.*', 'u.display_name as author_name')
    .first();

  return toDraftComment(withAuthor);
}
