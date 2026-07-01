import { db } from '../../db';

export interface UserRow {
  id: string;
  username: string;
  email: string;
  display_name: string;
  password_hash: string;
  is_active: boolean;
  failed_attempts: number;
  locked_until: Date | null;
}

export interface SessionRow {
  id: string;
  user_id: string;
  session_hash: string;
  expires_at: Date;
}

/** Fetch a user by email for authentication */
export async function getUserByEmail(email: string): Promise<UserRow | null> {
  const user = await db('users')
    .where({ email: email.toLowerCase().trim() })
    .select('id', 'username', 'email', 'display_name', 'password_hash', 'is_active', 'failed_attempts', 'locked_until')
    .first();
  return user || null;
}

/** Create a new session and return the session record */
export async function createSession(userId: string, sessionHash: string, expiresAt: Date): Promise<void> {
  await db('sessions').insert({
    user_id: userId,
    session_hash: sessionHash,
    expires_at: expiresAt,
  });
}

/** Look up a non-expired session by its hash */
export async function getSessionByHash(sessionHash: string): Promise<{ user_id: string } | null> {
  const session = await db('sessions')
    .where({ session_hash: sessionHash })
    .where('expires_at', '>', db.fn.now())
    .select('user_id')
    .first();
  return session || null;
}

/** Mark a session as revoked (delete it) */
export async function revokeSession(sessionHash: string): Promise<void> {
  await db('sessions').where({ session_hash: sessionHash }).delete();
}

/** Record a login attempt in the audit log */
export async function recordLoginAttempt(
  email: string,
  succeeded: boolean,
  ipAddress?: string
): Promise<void> {
  await db('login_attempts').insert({
    email: email.toLowerCase().trim(),
    succeeded,
    ip_address: ipAddress || null,
  });
}

/** Count failed login attempts for an email in the last N milliseconds */
export async function countRecentFailures(email: string, windowMs: number): Promise<number> {
  const since = new Date(Date.now() - windowMs);
  const result = await db('login_attempts')
    .where({ email: email.toLowerCase().trim(), succeeded: false })
    .where('attempted_at', '>', since)
    .count('id as count')
    .first();
  return Number(result?.count ?? 0);
}

/** Get user roles by user ID */
export async function getUserRoles(userId: string): Promise<string[]> {
  const roleRows = await db('user_roles').where({ user_id: userId }).select('role');
  return roleRows.map((r: { role: string }) => r.role);
}

/** Update user lock / failed_attempts state */
export async function updateUserLockState(
  userId: string,
  failedAttempts: number,
  lockedUntil: Date | null
): Promise<void> {
  await db('users').where({ id: userId }).update({
    failed_attempts: failedAttempts,
    locked_until: lockedUntil,
  });
}

/** Reset failed_attempts and locked_until after successful login */
export async function resetUserLockState(userId: string): Promise<void> {
  await db('users').where({ id: userId }).update({
    failed_attempts: 0,
    locked_until: null,
  });
}

/** Update session last_used_at */
export async function touchSession(sessionHash: string): Promise<void> {
  await db('sessions').where({ session_hash: sessionHash }).update({ last_used_at: new Date() });
}

/** Get user by ID (for session validation) */
export async function getUserById(userId: string): Promise<Omit<UserRow, 'password_hash' | 'failed_attempts' | 'locked_until'> | null> {
  const user = await db('users')
    .where({ id: userId, is_active: true })
    .select('id', 'username', 'email', 'display_name')
    .first();
  return user || null;
}
