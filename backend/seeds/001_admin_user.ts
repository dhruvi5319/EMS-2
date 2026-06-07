import type { Knex } from 'knex';
import bcrypt from 'bcryptjs';

const ADMIN_USERNAME = 'admin';
const ADMIN_EMAIL = 'admin@ems.local';
const ADMIN_PASSWORD = 'Admin1234!'; // Change in production
const ADMIN_DISPLAY_NAME = 'System Administrator';
const BCRYPT_ROUNDS = 12;

// All valid roles from TechArch DDL CHECK constraint
const ALL_ROLES = ['AL', 'EM', 'AN', 'QA', 'IR', 'PC', 'RO', 'AD'];

export async function seed(knex: Knex): Promise<void> {
  // Idempotent: skip if admin already exists
  const existing = await knex('users').where({ username: ADMIN_USERNAME }).first();
  if (existing) {
    console.log(`Seed: admin user '${ADMIN_USERNAME}' already exists, skipping`);
    return;
  }

  const password_hash = await bcrypt.hash(ADMIN_PASSWORD, BCRYPT_ROUNDS);

  const [adminUser] = await knex('users')
    .insert({
      username: ADMIN_USERNAME,
      email: ADMIN_EMAIL,
      password_hash,
      display_name: ADMIN_DISPLAY_NAME,
      is_active: true,
      failed_attempts: 0,
    })
    .returning('id');

  const adminId = adminUser.id;

  // Assign all roles to admin
  await knex('user_roles').insert(
    ALL_ROLES.map((role) => ({
      user_id: adminId,
      role,
    }))
  );

  console.log(`Seed: Created admin user '${ADMIN_USERNAME}' with roles: ${ALL_ROLES.join(', ')}`);
  console.log(`Seed: Default password is '${ADMIN_PASSWORD}' — CHANGE IN PRODUCTION`);
}
