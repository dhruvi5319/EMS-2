import type { Knex } from 'knex';

/**
 * The audit_events table was created with columns (object_type, object_id,
 * before_state, after_state) but the audit.service.ts code reads
 * (entity_type, entity_id, actor_roles, metadata). All GET /audit calls
 * returned 500 until this aligned the schema with the code.
 *
 *   - rename object_type → entity_type
 *   - rename object_id   → entity_id
 *   - add actor_roles (jsonb, default '[]') so audit rows can stamp the
 *     roles the actor held at the time of the action
 *   - add metadata (jsonb, nullable) as a single freeform attachment
 *     point; before_state/after_state stay for now since other code may
 *     still write to them
 */
export async function up(knex: Knex): Promise<void> {
  const has = async (c: string) =>
    (await knex.schema.hasColumn('audit_events', c));

  if (await has('object_type') && !(await has('entity_type'))) {
    await knex.schema.alterTable('audit_events', (t) => t.renameColumn('object_type', 'entity_type'));
  }
  if (await has('object_id') && !(await has('entity_id'))) {
    await knex.schema.alterTable('audit_events', (t) => t.renameColumn('object_id', 'entity_id'));
  }
  if (!(await has('actor_roles'))) {
    await knex.schema.alterTable('audit_events', (t) => {
      t.jsonb('actor_roles').notNullable().defaultTo(JSON.stringify([]));
    });
  }
  if (!(await has('metadata'))) {
    await knex.schema.alterTable('audit_events', (t) => {
      t.jsonb('metadata').nullable();
    });
  }
}

export async function down(knex: Knex): Promise<void> {
  const has = async (c: string) =>
    (await knex.schema.hasColumn('audit_events', c));
  if (await has('metadata')) {
    await knex.schema.alterTable('audit_events', (t) => t.dropColumn('metadata'));
  }
  if (await has('actor_roles')) {
    await knex.schema.alterTable('audit_events', (t) => t.dropColumn('actor_roles'));
  }
  if (await has('entity_id')) {
    await knex.schema.alterTable('audit_events', (t) => t.renameColumn('entity_id', 'object_id'));
  }
  if (await has('entity_type')) {
    await knex.schema.alterTable('audit_events', (t) => t.renameColumn('entity_type', 'object_type'));
  }
}
