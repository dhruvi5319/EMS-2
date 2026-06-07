import type { Knex } from 'knex';

/**
 * Plan 04-03 deliverable that never landed: the independence_affirmations
 * table that Gate P2's `independence_status_complete` prerequisite reads.
 * Without this table, the team service's affirmation query throws and
 * gate/p2 stays blocked forever.
 *
 * Minimal shape that satisfies the query at team.service.ts:467
 * (`where engagement_id = ? countDistinct user_id`) plus enough metadata to
 * round-trip a UI later: per (engagement_id, user_id), one row with the
 * affirmation status, optional rationale, and timestamps.
 */
export async function up(knex: Knex): Promise<void> {
  if (await knex.schema.hasTable('independence_affirmations')) return;
  await knex.schema.createTable('independence_affirmations', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    t.uuid('engagement_id').notNullable()
      .references('id').inTable('engagements').onDelete('CASCADE');
    t.uuid('user_id').notNullable()
      .references('id').inTable('users');
    t.text('status').notNullable().defaultTo('affirmed');
    t.text('rationale').nullable();
    t.timestamp('submitted_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());
    t.timestamp('created_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());
    t.timestamp('updated_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());
    t.unique(['engagement_id', 'user_id']);
    t.check("status IN ('affirmed','conflict','recused')");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('independence_affirmations');
}
