import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { db } from '../db';

const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes

export interface AuthUser {
  id: string;
  username: string;
  email: string;
  display_name: string;
  roles: string[];
}

export async function login(username: string, password: string): Promise<{ sessionHash: string; user: AuthUser; expiresAt: Date }> {
  const user = await db('users')
    .where({ username })
    .select('id', 'username', 'email', 'display_name', 'password_hash', 'is_active', 'failed_attempts', 'locked_until')
    .first();

  if (!user) {
    // Generic error — do not reveal whether username exists
    throw Object.assign(new Error('Invalid credentials'), { code: 'INVALID_CREDENTIALS', status: 401 });
  }

  if (!user.is_active) {
    throw Object.assign(new Error('Account is inactive'), { code: 'ACCOUNT_INACTIVE', status: 401 });
  }

  // Check account lockout
  if (user.locked_until && new Date(user.locked_until) > new Date()) {
    const unlockAt = new Date(user.locked_until);
    throw Object.assign(new Error('Account locked due to repeated failures. Try again in 15 minutes.'), {
      code: 'ACCOUNT_LOCKED',
      status: 423,
      unlockAt,
    });
  }

  const passwordValid = await bcrypt.compare(password, user.password_hash);

  if (!passwordValid) {
    // Increment failed_attempts; lock if threshold reached
    const newAttempts = (user.failed_attempts || 0) + 1;
    const updateData: Record<string, unknown> = { failed_attempts: newAttempts };
    if (newAttempts >= MAX_FAILED_ATTEMPTS) {
      updateData.locked_until = new Date(Date.now() + LOCKOUT_DURATION_MS);
    }
    await db('users').where({ id: user.id }).update(updateData);
    throw Object.assign(new Error('Invalid credentials'), { code: 'INVALID_CREDENTIALS', status: 401 });
  }

  // Reset failed_attempts and locked_until on successful login
  await db('users').where({ id: user.id }).update({ failed_attempts: 0, locked_until: null });

  // Fetch user roles
  const roleRows = await db('user_roles').where({ user_id: user.id }).select('role');
  const roles = roleRows.map((r: { role: string }) => r.role);

  // Generate session hash
  const sessionHash = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);

  await db('sessions').insert({
    user_id: user.id,
    session_hash: sessionHash,
    expires_at: expiresAt,
  });

  return {
    sessionHash,
    user: { id: user.id, username: user.username, email: user.email, display_name: user.display_name, roles },
    expiresAt,
  };
}

export async function logout(sessionHash: string): Promise<void> {
  await db('sessions').where({ session_hash: sessionHash }).delete();
}

export async function validateSession(sessionHash: string): Promise<AuthUser | null> {
  const session = await db('sessions')
    .where({ session_hash: sessionHash })
    .where('expires_at', '>', new Date())
    .select('user_id')
    .first();

  if (!session) return null;

  // Update last_used_at
  await db('sessions').where({ session_hash: sessionHash }).update({ last_used_at: new Date() });

  const user = await db('users')
    .where({ id: session.user_id, is_active: true })
    .select('id', 'username', 'email', 'display_name')
    .first();

  if (!user) return null;

  const roleRows = await db('user_roles').where({ user_id: user.id }).select('role');
  const roles = roleRows.map((r: { role: string }) => r.role);

  return { id: user.id, username: user.username, email: user.email, display_name: user.display_name, roles };
}
