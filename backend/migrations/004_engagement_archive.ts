import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('engagements', (table) => {
    table.boolean('is_archived').notNullable().defaultTo(false);
    table.timestamp('archived_at', { useTz: true }).nullable();
  });
  await knex.schema.alterTable('engagements', (table) => {
    table.index(['is_archived'], 'idx_engagements_is_archived');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('engagements', (table) => {
    table.dropIndex(['is_archived'], 'idx_engagements_is_archived');
    table.dropColumn('archived_at');
    table.dropColumn('is_archived');
  });
}
