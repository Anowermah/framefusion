CREATE TABLE IF NOT EXISTS "migrations"(
  "id" integer primary key autoincrement not null,
  "migration" varchar not null,
  "batch" integer not null
);
CREATE TABLE IF NOT EXISTS "users"(
  "id" integer primary key autoincrement not null,
  "name" varchar not null,
  "email" varchar not null,
  "email_verified_at" datetime,
  "password" varchar not null,
  "remember_token" varchar,
  "created_at" datetime,
  "updated_at" datetime,
  "username" varchar,
  "avatar_url" varchar,
  "bio" text,
  "role" varchar not null default 'user',
  "status" varchar not null default 'active',
  "social_links" text
);
CREATE UNIQUE INDEX "users_email_unique" on "users"("email");
CREATE TABLE IF NOT EXISTS "password_reset_tokens"(
  "email" varchar not null,
  "token" varchar not null,
  "created_at" datetime,
  primary key("email")
);
CREATE TABLE IF NOT EXISTS "sessions"(
  "id" varchar not null,
  "user_id" integer,
  "ip_address" varchar,
  "user_agent" text,
  "payload" text not null,
  "last_activity" integer not null,
  primary key("id")
);
CREATE INDEX "sessions_user_id_index" on "sessions"("user_id");
CREATE INDEX "sessions_last_activity_index" on "sessions"("last_activity");
CREATE TABLE IF NOT EXISTS "cache"(
  "key" varchar not null,
  "value" text not null,
  "expiration" integer not null,
  primary key("key")
);
CREATE INDEX "cache_expiration_index" on "cache"("expiration");
CREATE TABLE IF NOT EXISTS "cache_locks"(
  "key" varchar not null,
  "owner" varchar not null,
  "expiration" integer not null,
  primary key("key")
);
CREATE INDEX "cache_locks_expiration_index" on "cache_locks"("expiration");
CREATE TABLE IF NOT EXISTS "jobs"(
  "id" integer primary key autoincrement not null,
  "queue" varchar not null,
  "payload" text not null,
  "attempts" integer not null,
  "reserved_at" integer,
  "available_at" integer not null,
  "created_at" integer not null
);
CREATE INDEX "jobs_queue_index" on "jobs"("queue");
CREATE TABLE IF NOT EXISTS "job_batches"(
  "id" varchar not null,
  "name" varchar not null,
  "total_jobs" integer not null,
  "pending_jobs" integer not null,
  "failed_jobs" integer not null,
  "failed_job_ids" text not null,
  "options" text,
  "cancelled_at" integer,
  "created_at" integer not null,
  "finished_at" integer,
  primary key("id")
);
CREATE TABLE IF NOT EXISTS "failed_jobs"(
  "id" integer primary key autoincrement not null,
  "uuid" varchar not null,
  "connection" varchar not null,
  "queue" varchar not null,
  "payload" text not null,
  "exception" text not null,
  "failed_at" datetime not null default CURRENT_TIMESTAMP
);
CREATE INDEX "failed_jobs_connection_queue_failed_at_index" on "failed_jobs"(
  "connection",
  "queue",
  "failed_at"
);
CREATE UNIQUE INDEX "failed_jobs_uuid_unique" on "failed_jobs"("uuid");
CREATE UNIQUE INDEX "users_username_unique" on "users"("username");
CREATE TABLE IF NOT EXISTS "categories"(
  "id" integer primary key autoincrement not null,
  "name" varchar not null,
  "name_bn" varchar,
  "slug" varchar not null,
  "icon" varchar not null default 'Sparkles',
  "description" text,
  "description_bn" text,
  "is_featured" tinyint(1) not null default '0',
  "order" integer not null default '0',
  "created_at" datetime,
  "updated_at" datetime
);
CREATE UNIQUE INDEX "categories_slug_unique" on "categories"("slug");
CREATE TABLE IF NOT EXISTS "campaigns"(
  "id" integer primary key autoincrement not null,
  "creator_id" integer not null,
  "category_id" integer,
  "title" varchar not null,
  "title_bn" varchar,
  "slug" varchar not null,
  "description" text,
  "description_bn" text,
  "campaign_type" varchar not null default 'frame',
  "frame_url" varchar not null,
  "thumbnail_url" varchar,
  "background_url" varchar,
  "status" varchar not null default 'published',
  "visibility" varchar not null default 'public',
  "is_featured" tinyint(1) not null default '0',
  "is_trending" tinyint(1) not null default '0',
  "supporters_count" integer not null default '0',
  "views_count" integer not null default '0',
  "start_date" date,
  "end_date" date,
  "tags" text,
  "created_at" datetime,
  "updated_at" datetime,
  foreign key("creator_id") references "users"("id") on delete cascade,
  foreign key("category_id") references "categories"("id") on delete set null
);
CREATE INDEX "campaigns_status_visibility_index" on "campaigns"(
  "status",
  "visibility"
);
CREATE INDEX "campaigns_is_trending_index" on "campaigns"("is_trending");
CREATE INDEX "campaigns_is_featured_index" on "campaigns"("is_featured");
CREATE INDEX "campaigns_supporters_count_index" on "campaigns"(
  "supporters_count"
);
CREATE UNIQUE INDEX "campaigns_slug_unique" on "campaigns"("slug");
CREATE TABLE IF NOT EXISTS "campaign_frames"(
  "id" integer primary key autoincrement not null,
  "campaign_id" integer not null,
  "frame_url" varchar not null,
  "canvas_width" integer not null default '1080',
  "canvas_height" integer not null default '1080',
  "aspect_ratio" varchar not null default '1:1',
  "photo_area_config" text,
  "created_at" datetime,
  "updated_at" datetime,
  foreign key("campaign_id") references "campaigns"("id") on delete cascade
);
CREATE TABLE IF NOT EXISTS "generated_photos"(
  "id" integer primary key autoincrement not null,
  "user_id" integer,
  "campaign_id" integer not null,
  "image_url" varchar not null,
  "format" varchar not null default 'png',
  "quality" varchar not null default 'standard',
  "created_at" datetime,
  "updated_at" datetime,
  foreign key("user_id") references "users"("id") on delete set null,
  foreign key("campaign_id") references "campaigns"("id") on delete cascade
);
CREATE TABLE IF NOT EXISTS "saved_campaigns"(
  "id" integer primary key autoincrement not null,
  "user_id" integer not null,
  "campaign_id" integer not null,
  "created_at" datetime,
  "updated_at" datetime,
  foreign key("user_id") references "users"("id") on delete cascade,
  foreign key("campaign_id") references "campaigns"("id") on delete cascade
);
CREATE UNIQUE INDEX "saved_campaigns_user_id_campaign_id_unique" on "saved_campaigns"(
  "user_id",
  "campaign_id"
);
CREATE TABLE IF NOT EXISTS "campaign_supporters"(
  "id" integer primary key autoincrement not null,
  "campaign_id" integer not null,
  "user_id" integer,
  "supporter_name" varchar,
  "created_at" datetime,
  "updated_at" datetime,
  foreign key("campaign_id") references "campaigns"("id") on delete cascade,
  foreign key("user_id") references "users"("id") on delete set null
);
CREATE TABLE IF NOT EXISTS "gallery_posts"(
  "id" integer primary key autoincrement not null,
  "campaign_id" integer not null,
  "user_id" integer not null,
  "image_url" varchar not null,
  "caption" text,
  "status" varchar not null default 'published',
  "likes_count" integer not null default '0',
  "comments_count" integer not null default '0',
  "created_at" datetime,
  "updated_at" datetime,
  foreign key("campaign_id") references "campaigns"("id") on delete cascade,
  foreign key("user_id") references "users"("id") on delete cascade
);
CREATE TABLE IF NOT EXISTS "comments"(
  "id" integer primary key autoincrement not null,
  "user_id" integer not null,
  "gallery_post_id" integer not null,
  "content" text not null,
  "created_at" datetime,
  "updated_at" datetime,
  foreign key("user_id") references "users"("id") on delete cascade,
  foreign key("gallery_post_id") references "gallery_posts"("id") on delete cascade
);
CREATE TABLE IF NOT EXISTS "likes"(
  "id" integer primary key autoincrement not null,
  "user_id" integer not null,
  "gallery_post_id" integer not null,
  "created_at" datetime,
  "updated_at" datetime,
  foreign key("user_id") references "users"("id") on delete cascade,
  foreign key("gallery_post_id") references "gallery_posts"("id") on delete cascade
);
CREATE UNIQUE INDEX "likes_user_id_gallery_post_id_unique" on "likes"(
  "user_id",
  "gallery_post_id"
);
CREATE TABLE IF NOT EXISTS "reports"(
  "id" integer primary key autoincrement not null,
  "reporter_id" integer,
  "campaign_id" integer not null,
  "reason" varchar not null,
  "description" text,
  "status" varchar not null default 'pending',
  "created_at" datetime,
  "updated_at" datetime,
  foreign key("reporter_id") references "users"("id") on delete set null,
  foreign key("campaign_id") references "campaigns"("id") on delete cascade
);
CREATE TABLE IF NOT EXISTS "platform_settings"(
  "id" integer primary key autoincrement not null,
  "key" varchar not null,
  "value" text,
  "type" varchar not null default 'string',
  "created_at" datetime,
  "updated_at" datetime
);
CREATE UNIQUE INDEX "platform_settings_key_unique" on "platform_settings"(
  "key"
);

INSERT INTO migrations VALUES(1,'0001_01_01_000000_create_users_table',1);
INSERT INTO migrations VALUES(2,'0001_01_01_000001_create_cache_table',1);
INSERT INTO migrations VALUES(3,'0001_01_01_000002_create_jobs_table',1);
INSERT INTO migrations VALUES(4,'2026_11_14_000001_add_profile_and_role_fields_to_users_table',2);
INSERT INTO migrations VALUES(5,'2026_11_14_000002_create_categories_table',2);
INSERT INTO migrations VALUES(6,'2026_11_14_000003_create_campaigns_table',2);
INSERT INTO migrations VALUES(7,'2026_11_14_000004_create_campaign_frames_and_interactions_tables',2);
INSERT INTO migrations VALUES(8,'2026_11_14_000005_create_gallery_reports_settings_tables',2);
