CREATE TABLE `adminAuth` (
	`id` text PRIMARY KEY NOT NULL,
	`fullname` text,
	`email` text NOT NULL,
	`role` text,
	`access_token` text,
	`refresh_token` text,
	`created_at` text DEFAULT '2025-10-14T23:08:02.795Z',
	`updated_at` text,
	`deleted_at` text,
	`synced_at` text
);
--> statement-breakpoint
CREATE TABLE `candidates` (
	`id` text PRIMARY KEY NOT NULL,
	`election` text NOT NULL,
	`description` text,
	`profile` text,
	`profile_path` text,
	`election_id` text,
	`created_at` text DEFAULT '2025-10-14T23:08:02.797Z',
	`updated_at` text,
	`deleted_at` text,
	`synced_at` integer DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE `elections` (
	`id` text PRIMARY KEY NOT NULL,
	`election` text NOT NULL,
	`description` text,
	`max_votes_allowed` integer DEFAULT 1 NOT NULL,
	`status` text DEFAULT 'active' NOT NULL,
	`end_time` text,
	`end_date` text,
	`created_at` text DEFAULT '2025-10-14T23:08:02.797Z',
	`updated_at` text,
	`deleted_at` text,
	`synced_at` integer DEFAULT 0
);
