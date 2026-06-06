import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  // Add sufficiency_status column to objectives table for F9/F10 coverage tracking
  await knex.schema.alterTable('objectives', (table) => {
    table
      .text('sufficiency_status')
      .notNullable()
      .defaultTo('evidence_needed');
  });

  await knex.raw(
    `ALTER TABLE objectives ADD CONSTRAINT objectives_sufficiency_status_check
     CHECK (sufficiency_status IN ('evidence_needed', 'in_review', 'sufficient'))`
  );
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(
    'ALTER TABLE objectives DROP CONSTRAINT IF EXISTS objectives_sufficiency_status_check'
  );
  await knex.schema.alterTable('objectives', (table) => {
    table.dropColumn('sufficiency_status');
  });
}
