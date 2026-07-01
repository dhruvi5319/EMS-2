import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { config } from '../../config/env';
import {
  getUserByEmail,
  createSession,
  getSessionByHash,
  revokeSession,
  recordLoginAttempt,
  countRecentFailures,
  getUserRoles,
  updateUserLockState,
  resetUserLockState,
  touchSession,
  getUserById,
} from './auth.repository';

const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes

export interface AuthUser {
  id: string;
  username: string;
  email: string;
  display_name: string;
  roles: string[];
}

/**
 * Authenticate user by email and password.
 * Returns a signed JWT (containing session hash) and the user object.
 * Throws with status 401 on invalid credentials, 423 on account locked.
 */
export async function login(
  email: string,
  password: string,
  ipAddress?: string
): Promise<{ token: string; user: AuthUser; expiresAt: Date }> {
  const normalizedEmail = email.toLowerCase().trim();

  const user = await getUserByEmail(normalizedEmail);

  if (!user) {
    // Still record the attempt against the email provided
    await recordLoginAttempt(normalizedEmail, false, ipAddress).catch(() => {});
    throw Object.assign(new Error('Invalid credentials'), { code: 'INVALID_CREDENTIALS', status: 401 });
  }

  if (!user.is_active) {
    await recordLoginAttempt(normalizedEmail, false, ipAddress).catch(() => {});
    throw Object.assign(new Error('Account is inactive'), { code: 'ACCOUNT_INACTIVE', status: 401 });
  }

  // Check explicit lockout flag set during a previous failure burst
  if (user.locked_until && new Date(user.locked_until) > new Date()) {
    await recordLoginAttempt(normalizedEmail, false, ipAddress).catch(() => {});
    throw Object.assign(
      new Error('Account locked due to repeated failures. Try again in 15 minutes.'),
      { code: 'ACCOUNT_LOCKED', status: 423, unlockAt: new Date(user.locked_until) }
    );
  }

  // Also check rolling window of recent failures in login_attempts table
  const recentFailures = await countRecentFailures(normalizedEmail, LOCKOUT_WINDOW_MS);
  if (recentFailures >= MAX_FAILED_ATTEMPTS) {
    await recordLoginAttempt(normalizedEmail, false, ipAddress).catch(() => {});
    throw Object.assign(
      new Error('Account locked due to repeated failures. Try again in 15 minutes.'),
      { code: 'ACCOUNT_LOCKED', status: 423 }
    );
  }

  const passwordValid = await bcrypt.compare(password, user.password_hash);

  if (!passwordValid) {
    await recordLoginAttempt(normalizedEmail, false, ipAddress).catch(() => {});
    // Increment failed_attempts; lock if threshold reached
    const newAttempts = (user.failed_attempts || 0) + 1;
    const lockedUntil = newAttempts >= MAX_FAILED_ATTEMPTS
      ? new Date(Date.now() + LOCKOUT_WINDOW_MS)
      : null;
    await updateUserLockState(user.id, newAttempts, lockedUntil);
    throw Object.assign(new Error('Invalid credentials'), { code: 'INVALID_CREDENTIALS', status: 401 });
  }

  // Success — reset lock state
  await resetUserLockState(user.id);
  await recordLoginAttempt(normalizedEmail, true, ipAddress).catch(() => {});

  // Fetch user roles
  const roles = await getUserRoles(user.id);

  // Create session
  const sessionHash = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);
  await createSession(user.id, sessionHash, expiresAt);

  // Sign JWT containing session hash (so middleware can look up the DB session)
  const token = jwt.sign(
    { sessionHash, sub: user.id },
    config.jwtSecret,
    { expiresIn: Math.floor(SESSION_DURATION_MS / 1000) }
  );

  return {
    token,
    user: { id: user.id, username: user.username, email: user.email, display_name: user.display_name, roles },
    expiresAt,
  };
}

/**
 * Revoke a session by its hash.
 */
export async function logout(sessionHash: string): Promise<void> {
  await revokeSession(sessionHash);
}

/**
 * Validate a session hash from DB and return the associated user (with roles).
 * Returns null if the session is expired, revoked, or the user is inactive.
 */
export async function me(sessionHash: string): Promise<AuthUser | null> {
  const session = await getSessionByHash(sessionHash);
  if (!session) return null;

  // Touch last_used_at
  await touchSession(sessionHash).catch(() => {});

  const user = await getUserById(session.user_id);
  if (!user) return null;

  const roles = await getUserRoles(user.id);

  return { id: user.id, username: user.username, email: user.email, display_name: user.display_name, roles };
}
