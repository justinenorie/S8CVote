CREATE TABLE `adminAuth` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`role` text,
	`access_token` text,
	`refresh_token` text,
	`created_at` text DEFAULT 'CURRENT_TIMESTAMP',
	`updated_at` text,
	`deleted_at` text,
	`synced_at` text
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
	`created_at` text DEFAULT 'CURRENT_TIMESTAMP',
	`updated_at` text,
	`deleted_at` text,
	`synced_at` text
);
