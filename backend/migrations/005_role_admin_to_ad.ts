import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`ALTER TABLE user_roles DROP CONSTRAINT IF EXISTS user_roles_role_check`);
  await knex.raw(`UPDATE user_roles SET role = 'AD' WHERE role = 'Admin'`);
  await knex.raw(`
    ALTER TABLE user_roles
    ADD CONSTRAINT user_roles_role_check
    CHECK (role = ANY (ARRAY['AL','EM','AN','QA','IR','PC','RO','AD']))
  `);
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(`ALTER TABLE user_roles DROP CONSTRAINT IF EXISTS user_roles_role_check`);
  await knex.raw(`UPDATE user_roles SET role = 'Admin' WHERE role = 'AD'`);
  await knex.raw(`
    ALTER TABLE user_roles
    ADD CONSTRAINT user_roles_role_check
    CHECK (role = ANY (ARRAY['AL','EM','AN','QA','IR','PC','RO','Admin']))
  `);
}
