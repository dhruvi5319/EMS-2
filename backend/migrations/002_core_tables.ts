import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {

  // ---- REQUESTS ----
  // From TechArch DDL — verbatim column names, types, constraints
  await knex.schema.createTable('requests', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.text('request_number').notNullable().unique();
    table.text('request_type').notNullable();
    table.text('requester_name').notNullable();
    table.text('requester_org').nullable();
    table.text('topic').notNullable();
    table.text('agency_program').nullable();
    table.date('due_date').nullable();
    table.text('notes').nullable();
    table.text('status').notNullable().defaultTo('draft');
    table.text('intake_file_ref').nullable();
    table.text('intake_filename').nullable();
    table.uuid('submitted_by').nullable().references('id').inTable('users');
    table.timestamp('submitted_at', { useTz: true }).nullable();
    table.uuid('created_by').notNullable().references('id').inTable('users');
    table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());
    table.check("request_type IN ('congressional','mandate','internal')");
    table.check("status IN ('draft','submitted','accepted','declined')");
  });

  // ---- ENGAGEMENTS ----
  await knex.schema.createTable('engagements', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.text('job_code').notNullable().unique();
    table.text('title').notNullable();
    table.text('phase').notNullable().defaultTo('intake');
    table.text('status').notNullable().defaultTo('active');
    table.text('risk_level').nullable();
    table.uuid('owner_id').nullable().references('id').inTable('users');
    table.text('portfolio').nullable();
    table.uuid('request_id').nullable().references('id').inTable('requests');
    table.uuid('created_by').notNullable().references('id').inTable('users');
    table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());
    table.check("phase IN ('intake','planning','evidence','draft','readiness','issuance','closed')");
    table.check("status IN ('active','on_hold','cancelled','closed')");
    table.check("risk_level IN ('low','medium','high') OR risk_level IS NULL");
  });

  // ---- TEAM ASSIGNMENTS ----
  await knex.schema.createTable('team_assignments', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('engagement_id').notNullable().references('id').inTable('engagements').onDelete('CASCADE');
    table.uuid('user_id').notNullable().references('id').inTable('users');
    table.text('role').notNullable();
    table.uuid('assigned_by').nullable().references('id').inTable('users');
    table.timestamp('assigned_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());
    table.check("role IN ('AL','EM','AN','QA','IR','PC','RO')");
    table.unique(['engagement_id', 'user_id', 'role']);
  });

  // ---- MILESTONES ----
  await knex.schema.createTable('milestones', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('engagement_id').notNullable().references('id').inTable('engagements').onDelete('CASCADE');
    table.text('milestone_type').notNullable();
    table.date('target_date').nullable();
    table.timestamp('completed_at', { useTz: true }).nullable();
    table.text('status').notNullable().defaultTo('not_started');
    table.check("milestone_type IN ('planning_approval','evidence_readiness','draft_readiness','final_readiness')");
    table.check("status IN ('not_started','on_track','at_risk','complete')");
    table.unique(['engagement_id', 'milestone_type']);
  });

  // ---- PLANNING RECORDS ----
  await knex.schema.createTable('planning_records', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('engagement_id').notNullable().unique().references('id').inTable('engagements').onDelete('CASCADE');
    table.text('design_approach').nullable();
    table.text('schedule_notes').nullable();
    table.text('risk_notes').nullable();
    table.text('data_reliability_notes').nullable();
    table.text('status').notNullable().defaultTo('draft');
    table.uuid('approved_by').nullable().references('id').inTable('users');
    table.timestamp('approved_at', { useTz: true }).nullable();
    table.text('revision_note').nullable();
    table.uuid('created_by').notNullable().references('id').inTable('users');
    table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());
    table.check("status IN ('draft','ready_for_review','approved')");
  });

  // ---- OBJECTIVES ----
  await knex.schema.createTable('objectives', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('engagement_id').notNullable().references('id').inTable('engagements').onDelete('CASCADE');
    table.text('objective_text').notNullable();
    table.text('information_need').nullable();
    table.text('status').notNullable().defaultTo('active');
    table.boolean('independence_confirmed').nullable();
    table.integer('display_order').notNullable().defaultTo(0);
    table.uuid('created_by').notNullable().references('id').inTable('users');
    table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());
    table.check("status IN ('active','closed')");
  });

  // ---- PLANNING REVISIONS ----
  await knex.schema.createTable('planning_revisions', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('planning_record_id').notNullable().references('id').inTable('planning_records').onDelete('CASCADE');
    table.text('revision_note').notNullable();
    table.uuid('revised_by').notNullable().references('id').inTable('users');
    table.timestamp('revised_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());
  });

  // ---- EVIDENCE ITEMS ----
  await knex.schema.createTable('evidence_items', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('engagement_id').notNullable().references('id').inTable('engagements').onDelete('CASCADE');
    table.text('evidence_type').notNullable();
    table.text('source').notNullable();
    table.date('date_received').notNullable();
    table.text('custodian').nullable();
    table.text('description').nullable();
    table.text('sensitivity').notNullable().defaultTo('standard');
    table.uuid('created_by').notNullable().references('id').inTable('users');
    table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());
    table.check("evidence_type IN ('document','dataset','interview_note','meeting_note','other')");
    table.check("sensitivity IN ('standard','restricted')");
  });

  // ---- EVIDENCE FILES ----
  await knex.schema.createTable('evidence_files', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('evidence_id').notNullable().references('id').inTable('evidence_items').onDelete('CASCADE');
    table.text('filename').notNullable();
    table.text('file_ref').notNullable().unique();
    table.bigInteger('file_size').nullable();
    table.text('mime_type').nullable();
    table.uuid('uploaded_by').notNullable().references('id').inTable('users');
    table.timestamp('uploaded_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());
  });

  // ---- OBJECTIVE EVIDENCE LINKS ----
  await knex.schema.createTable('objective_evidence_links', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('objective_id').notNullable().references('id').inTable('objectives').onDelete('CASCADE');
    table.uuid('evidence_id').notNullable().references('id').inTable('evidence_items').onDelete('CASCADE');
    table.uuid('linked_by').notNullable().references('id').inTable('users');
    table.timestamp('linked_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());
    table.unique(['objective_id', 'evidence_id']);
  });

  // ---- FINDINGS ----
  await knex.schema.createTable('findings', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('engagement_id').notNullable().references('id').inTable('engagements').onDelete('CASCADE');
    table.text('finding_text').notNullable();
    table.text('status').notNullable().defaultTo('draft');
    table.uuid('created_by').notNullable().references('id').inTable('users');
    table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());
    table.check("status IN ('draft','final')");
  });

  // ---- FINDING EVIDENCE LINKS ----
  await knex.schema.createTable('finding_evidence_links', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('finding_id').notNullable().references('id').inTable('findings').onDelete('CASCADE');
    table.uuid('evidence_id').notNullable().references('id').inTable('evidence_items').onDelete('CASCADE');
    table.uuid('linked_by').notNullable().references('id').inTable('users');
    table.timestamp('linked_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());
    table.unique(['finding_id', 'evidence_id']);
  });

  // ---- DRAFT PRODUCTS ----
  await knex.schema.createTable('draft_products', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('engagement_id').notNullable().unique().references('id').inTable('engagements').onDelete('CASCADE');
    table.text('title').notNullable();
    table.text('version').notNullable().defaultTo('0.1');
    table.uuid('owner_id').nullable().references('id').inTable('users');
    table.text('status').notNullable().defaultTo('drafting');
    table.text('draft_notes').nullable();
    table.text('draft_file_ref').nullable();
    table.text('draft_filename').nullable();
    table.uuid('created_by').notNullable().references('id').inTable('users');
    table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());
    table.check("status IN ('drafting','under_review','ready_for_ref_check','ready_for_final_review')");
  });

  // ---- DRAFT STATEMENTS ----
  await knex.schema.createTable('draft_statements', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('draft_product_id').notNullable().references('id').inTable('draft_products').onDelete('CASCADE');
    table.text('statement_text').notNullable();
    table.text('ref_status').notNullable().defaultTo('not_started');
    table.text('discrepancy_notes').nullable();
    table.uuid('assigned_to').nullable().references('id').inTable('users');
    table.integer('display_order').notNullable().defaultTo(0);
    table.uuid('created_by').notNullable().references('id').inTable('users');
    table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());
    table.check("ref_status IN ('not_started','in_review','passed','failed')");
  });

  // ---- STATEMENT EVIDENCE LINKS ----
  await knex.schema.createTable('statement_evidence_links', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('statement_id').notNullable().references('id').inTable('draft_statements').onDelete('CASCADE');
    table.uuid('evidence_id').notNullable().references('id').inTable('evidence_items').onDelete('CASCADE');
    table.uuid('linked_by').notNullable().references('id').inTable('users');
    table.timestamp('linked_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());
    table.unique(['statement_id', 'evidence_id']);
  });

  // ---- GATE DECISIONS ----
  await knex.schema.createTable('gate_decisions', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('engagement_id').notNullable().references('id').inTable('engagements').onDelete('CASCADE');
    table.text('gate_type').notNullable();
    table.text('status').notNullable();
    table.uuid('decided_by').notNullable().references('id').inTable('users');
    table.timestamp('decided_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());
    table.text('rationale').nullable();
    table.text('comment').nullable();
    table.check("gate_type IN ('A1','P2','P3','P4')");
    table.check("status IN ('pending','passed','failed','returned')");
  });

  // ---- AUDIT EVENTS ----
  await knex.schema.createTable('audit_events', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('engagement_id').nullable().references('id').inTable('engagements');
    table.uuid('request_id').nullable().references('id').inTable('requests');
    table.uuid('actor_id').notNullable().references('id').inTable('users');
    table.text('action').notNullable();
    table.text('object_type').notNullable();
    table.uuid('object_id').nullable();
    table.text('summary').nullable();
    table.jsonb('before_state').nullable();
    table.jsonb('after_state').nullable();
    table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());
  });

  // ---- DRAFT COMMENTS ----
  await knex.schema.createTable('draft_comments', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('draft_product_id').notNullable().references('id').inTable('draft_products').onDelete('CASCADE');
    table.text('comment_text').notNullable();
    table.uuid('commented_by').notNullable().references('id').inTable('users');
    table.timestamp('commented_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());
  });

  // ---- INDEXES from TechArch ----
  await knex.raw('CREATE INDEX idx_requests_status ON requests(status)');
  await knex.raw('CREATE INDEX idx_engagements_phase ON engagements(phase)');
  await knex.raw('CREATE INDEX idx_engagements_owner_id ON engagements(owner_id)');
  await knex.raw('CREATE INDEX idx_team_assignments_engagement ON team_assignments(engagement_id)');
  await knex.raw('CREATE INDEX idx_evidence_items_engagement ON evidence_items(engagement_id)');
  await knex.raw('CREATE INDEX idx_audit_events_engagement ON audit_events(engagement_id)');
  await knex.raw('CREATE INDEX idx_audit_events_actor ON audit_events(actor_id)');
}

export async function down(knex: Knex): Promise<void> {
  // Drop in reverse dependency order
  await knex.schema.dropTableIfExists('draft_comments');
  await knex.schema.dropTableIfExists('audit_events');
  await knex.schema.dropTableIfExists('gate_decisions');
  await knex.schema.dropTableIfExists('statement_evidence_links');
  await knex.schema.dropTableIfExists('draft_statements');
  await knex.schema.dropTableIfExists('draft_products');
  await knex.schema.dropTableIfExists('finding_evidence_links');
  await knex.schema.dropTableIfExists('findings');
  await knex.schema.dropTableIfExists('objective_evidence_links');
  await knex.schema.dropTableIfExists('evidence_files');
  await knex.schema.dropTableIfExists('evidence_items');
  await knex.schema.dropTableIfExists('planning_revisions');
  await knex.schema.dropTableIfExists('objectives');
  await knex.schema.dropTableIfExists('planning_records');
  await knex.schema.dropTableIfExists('milestones');
  await knex.schema.dropTableIfExists('team_assignments');
  await knex.schema.dropTableIfExists('engagements');
  await knex.schema.dropTableIfExists('requests');
}
