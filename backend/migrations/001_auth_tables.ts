import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  // users table
  await knex.schema.createTable('users', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.text('username').notNullable().unique();
    table.text('email').notNullable().unique();
    table.text('password_hash').notNullable();
    table.text('display_name').notNullable();
    table.boolean('is_active').notNullable().defaultTo(true);
    table.integer('failed_attempts').notNullable().defaultTo(0);
    table.timestamp('locked_until', { useTz: true }).nullable();
    table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());
  });

  // user_roles table
  await knex.schema.createTable('user_roles', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.text('role').notNullable();
    table.uuid('assigned_by').nullable().references('id').inTable('users');
    table.timestamp('assigned_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());
    // role CHECK constraint
    table.check("role IN ('AL','EM','AN','QA','IR','PC','RO','Admin')");
    // UNIQUE(user_id, role)
    table.unique(['user_id', 'role']);
  });

  // sessions table
  await knex.schema.createTable('sessions', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.text('session_hash').notNullable().unique();
    table.timestamp('expires_at', { useTz: true }).notNullable();
    table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('last_used_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());
  });

  // login_attempts table — audit log for all login events
  await knex.schema.createTable('login_attempts', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.text('email').notNullable();
    table.boolean('succeeded').notNullable();
    table.text('ip_address').nullable();
    table.timestamp('attempted_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());
  });

  // Indexes from TechArch
  await knex.raw('CREATE INDEX idx_users_username ON users(username)');
  await knex.raw('CREATE INDEX idx_users_email ON users(email)');
  await knex.raw('CREATE INDEX idx_sessions_user_id ON sessions(user_id)');
  await knex.raw('CREATE INDEX idx_sessions_expires_at ON sessions(expires_at)');
  await knex.raw('CREATE INDEX idx_login_attempts_email ON login_attempts(email)');
  await knex.raw('CREATE INDEX idx_login_attempts_attempted_at ON login_attempts(attempted_at DESC)');
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('login_attempts');
  await knex.schema.dropTableIfExists('sessions');
  await knex.schema.dropTableIfExists('user_roles');
  await knex.schema.dropTableIfExists('users');
}
