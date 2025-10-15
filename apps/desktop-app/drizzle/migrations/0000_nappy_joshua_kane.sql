CREATE TABLE `adminAuth` (
	`id` text PRIMARY KEY NOT NULL,
	`fullname` text,
	`email` text NOT NULL,
	`role` text,
	`access_token` text,
	`refresh_token` text,
	`created_at` text DEFAULT '2025-10-15T04:11:35.197Z',
	`updated_at` text,
	`deleted_at` text,
	`synced_at` text
);
--> statement-breakpoint
CREATE TABLE `candidates` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`profile` text,
	`profile_path` text,
	`election_id` text NOT NULL,
	`created_at` text DEFAULT '2025-10-15T04:11:35.199Z',
	`updated_at` text,
	`deleted_at` text,
	`synced_at` integer DEFAULT 0,
	FOREIGN KEY (`election_id`) REFERENCES `elections`(`id`) ON UPDATE no action ON DELETE cascade
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
	`created_at` text DEFAULT '2025-10-15T04:11:35.198Z',
	`updated_at` text,
	`deleted_at` text,
	`synced_at` integer DEFAULT 0
);
