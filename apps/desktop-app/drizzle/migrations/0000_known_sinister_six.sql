CREATE TABLE `adminAuth` (
	`id` text PRIMARY KEY NOT NULL,
	`fullname` text,
	`email` text NOT NULL,
	`role` text,
	`access_token` text,
	`refresh_token` text,
	`created_at` text DEFAULT '2025-10-27T19:55:08.892Z',
	`updated_at` text,
	`deleted_at` text,
	`synced_at` text
);
--> statement-breakpoint
CREATE TABLE `candidate_tallies` (
	`election_id` text NOT NULL,
	`candidate_id` text NOT NULL,
	`votes_count` integer NOT NULL,
	`percentage` numeric NOT NULL,
	`updated_at` text,
	FOREIGN KEY (`election_id`) REFERENCES `elections`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`candidate_id`) REFERENCES `candidates`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `candidates` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`profile` text,
	`profile_path` text,
	`election_id` text NOT NULL,
	`partylist_id` text,
	`created_at` text DEFAULT '2025-10-27T19:55:08.894Z',
	`updated_at` text,
	`deleted_at` text,
	`synced_at` integer DEFAULT 0,
	FOREIGN KEY (`election_id`) REFERENCES `elections`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`partylist_id`) REFERENCES `partylist`(`id`) ON UPDATE no action ON DELETE set null
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
	`created_at` text DEFAULT '2025-10-27T19:55:08.894Z',
	`updated_at` text,
	`deleted_at` text,
	`synced_at` integer DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE `partylist` (
	`id` text PRIMARY KEY NOT NULL,
	`partylist` text NOT NULL,
	`acronym` text NOT NULL,
	`color` text NOT NULL,
	`logo` text,
	`logo_path` text,
	`created_at` text DEFAULT '2025-10-27T19:55:08.895Z',
	`updated_at` text,
	`deleted_at` text,
	`synced_at` integer DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE `students` (
	`id` text PRIMARY KEY NOT NULL,
	`student_id` text NOT NULL,
	`fullname` text NOT NULL,
	`email` text,
	`isRegistered` integer DEFAULT 0,
	`created_at` text DEFAULT '2025-10-27T19:55:08.894Z',
	`updated_at` text,
	`deleted_at` text,
	`synced_at` integer DEFAULT 0
);
--> statement-breakpoint
CREATE UNIQUE INDEX `students_student_id_unique` ON `students` (`student_id`);