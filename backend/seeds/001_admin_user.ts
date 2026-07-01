import type { Knex } from 'knex';
import bcrypt from 'bcryptjs';

const BCRYPT_ROUNDS = 12;

// All valid roles from TechArch DDL CHECK constraint
const ALL_ROLES = ['AD', 'AL', 'EM', 'AN', 'QA', 'IR', 'PC', 'RO'];

interface SeedUser {
  username: string;
  email: string;
  display_name: string;
  password: string;
  roles: string[];
}

const SEED_USERS: SeedUser[] = [
  {
    username: 'admin',
    email: 'admin@ems.local',
    display_name: 'System Administrator',
    password: 'Admin1234!',
    roles: ALL_ROLES,
  },
  {
    username: 'al_user',
    email: 'al@ems.local',
    display_name: 'Audit Leader (Test)',
    password: 'Test1234!',
    roles: ['AL'],
  },
  {
    username: 'em_user',
    email: 'em@ems.local',
    display_name: 'Engagement Manager (Test)',
    password: 'Test1234!',
    roles: ['EM'],
  },
  {
    username: 'an_user',
    email: 'an@ems.local',
    display_name: 'Analyst (Test)',
    password: 'Test1234!',
    roles: ['AN'],
  },
  {
    username: 'qa_user',
    email: 'qa@ems.local',
    display_name: 'QA Reviewer (Test)',
    password: 'Test1234!',
    roles: ['QA'],
  },
  {
    username: 'ir_user',
    email: 'ir@ems.local',
    display_name: 'Independence Reviewer (Test)',
    password: 'Test1234!',
    roles: ['IR'],
  },
  {
    username: 'pc_user',
    email: 'pc@ems.local',
    display_name: 'Pricing Coordinator (Test)',
    password: 'Test1234!',
    roles: ['PC'],
  },
  {
    username: 'ro_user',
    email: 'ro@ems.local',
    display_name: 'Read-Only (Test)',
    password: 'Test1234!',
    roles: ['RO'],
  },
];

export async function seed(knex: Knex): Promise<void> {
  for (const seedUser of SEED_USERS) {
    // Idempotent: check by email — skip if already exists
    const existing = await knex('users').where({ email: seedUser.email }).first();
    if (existing) {
      console.log(`Seed: user '${seedUser.email}' already exists, skipping`);
      continue;
    }

    const password_hash = await bcrypt.hash(seedUser.password, BCRYPT_ROUNDS);

    const [insertedUser] = await knex('users')
      .insert({
        username: seedUser.username,
        email: seedUser.email,
        password_hash,
        display_name: seedUser.display_name,
        is_active: true,
        failed_attempts: 0,
      })
      .returning('id');

    const userId = insertedUser.id;

    // Assign roles — use INSERT ... ON CONFLICT DO NOTHING pattern
    for (const role of seedUser.roles) {
      await knex.raw(
        `INSERT INTO user_roles (user_id, role)
         VALUES (?, ?)
         ON CONFLICT (user_id, role) DO NOTHING`,
        [userId, role]
      );
    }

    console.log(`Seed: Created user '${seedUser.email}' with roles: ${seedUser.roles.join(', ')}`);
  }

  console.log('Seed complete: all users processed.');
}
