CREATE TABLE `adminAuth` (
	`id` text PRIMARY KEY NOT NULL,
	`fullname` text,
	`email` text NOT NULL,
	`role` text,
	`access_token` text,
	`refresh_token` text,
	`created_at` text DEFAULT '2025-10-29T00:11:02.400Z',
	`updated_at` text,
	`deleted_at` text,
	`synced_at` text
);
--> statement-breakpoint
CREATE TABLE `candidates` (
	`candidate_id` text PRIMARY KEY NOT NULL,
	`candidate_name` text NOT NULL,
	`election_id` text NOT NULL,
	`votes_count` integer DEFAULT 0 NOT NULL,
	`percentage` real DEFAULT 0 NOT NULL,
	`candidate_profile` text,
	`synced_at` integer DEFAULT 0,
	`partylist_id` text,
	`partylist_name` text,
	`partylist_acronym` text,
	`partylist_color` text
);
--> statement-breakpoint
CREATE TABLE `elections` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`has_voted` integer DEFAULT 0 NOT NULL,
	`status` text DEFAULT 'active' NOT NULL,
	`synced_at` integer DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE `students` (
	`id` text PRIMARY KEY NOT NULL,
	`student_id` text NOT NULL,
	`fullname` text NOT NULL,
	`email` text,
	`isRegistered` integer DEFAULT 0,
	`created_at` text DEFAULT '2025-10-29T00:11:02.405Z',
	`updated_at` text,
	`deleted_at` text,
	`synced_at` integer DEFAULT 0
);
--> statement-breakpoint
CREATE UNIQUE INDEX `students_student_id_unique` ON `students` (`student_id`);--> statement-breakpoint
CREATE TABLE `votes` (
	`id` text PRIMARY KEY NOT NULL,
	`election_id` text NOT NULL,
	`candidate_id` text NOT NULL,
	`student_id` text,
	`created_at` text DEFAULT '2025-10-29T00:11:02.406Z',
	`updated_at` text,
	`deleted_at` text,
	`synced_at` integer DEFAULT 0,
	FOREIGN KEY (`election_id`) REFERENCES `elections`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`candidate_id`) REFERENCES `candidates`(`candidate_id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`student_id`) REFERENCES `students`(`student_id`) ON UPDATE no action ON DELETE no action
);
