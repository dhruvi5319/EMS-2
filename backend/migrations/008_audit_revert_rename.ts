import type { Knex } from 'knex';

/**
 * 006 renamed object_type/object_id → entity_type/entity_id assuming audit
 * was the only consumer. Other services (findings, gate, gatep4,
 * objectivecoverage, planning) write to object_type/object_id directly,
 * so the rename broke every gate-decision INSERT. Revert the rename;
 * audit.service.ts is updated separately to read the original column
 * names. actor_roles and metadata (added in 006) stay — they're additive.
 */
export async function up(knex: Knex): Promise<void> {
  if (await knex.schema.hasColumn('audit_events', 'entity_type')) {
    await knex.schema.alterTable('audit_events', (t) => t.renameColumn('entity_type', 'object_type'));
  }
  if (await knex.schema.hasColumn('audit_events', 'entity_id')) {
    await knex.schema.alterTable('audit_events', (t) => t.renameColumn('entity_id', 'object_id'));
  }
}

export async function down(knex: Knex): Promise<void> {
  if (await knex.schema.hasColumn('audit_events', 'object_type')) {
    await knex.schema.alterTable('audit_events', (t) => t.renameColumn('object_type', 'entity_type'));
  }
  if (await knex.schema.hasColumn('audit_events', 'object_id')) {
    await knex.schema.alterTable('audit_events', (t) => t.renameColumn('object_id', 'entity_id'));
  }
}
