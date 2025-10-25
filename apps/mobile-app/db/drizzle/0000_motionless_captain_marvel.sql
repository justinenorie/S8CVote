CREATE TABLE `adminAuth` (
	`id` text PRIMARY KEY NOT NULL,
	`fullname` text,
	`email` text NOT NULL,
	`role` text,
	`access_token` text,
	`refresh_token` text,
	`created_at` text DEFAULT '2025-10-25T02:49:53.902Z',
	`updated_at` text,
	`deleted_at` text,
	`synced_at` text
);
--> statement-breakpoint
CREATE TABLE `candidates` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`election_id` text NOT NULL,
	`profile` text,
	`profile_path` text,
	`created_at` text DEFAULT '2025-10-25T02:49:53.904Z',
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
	`created_at` text DEFAULT '2025-10-25T02:49:53.904Z',
	`updated_at` text,
	`deleted_at` text,
	`synced_at` integer
);
--> statement-breakpoint
CREATE TABLE `students` (
	`id` text PRIMARY KEY NOT NULL,
	`student_id` text NOT NULL,
	`fullname` text NOT NULL,
	`email` text,
	`isRegistered` integer DEFAULT 0,
	`created_at` text DEFAULT '2025-10-25T02:49:53.904Z',
	`updated_at` text,
	`deleted_at` text,
	`synced_at` integer DEFAULT 0
);
--> statement-breakpoint
CREATE UNIQUE INDEX `students_student_id_unique` ON `students` (`student_id`);--> statement-breakpoint
CREATE TABLE `votes` (
	`id` text PRIMARY KEY NOT NULL,
	`timestamp` integer,
	`election_id` text NOT NULL,
	`candidate_id` text NOT NULL,
	`student_id` text,
	`created_at` integer,
	`updated_at` integer,
	`deleted_at` integer,
	`synced_at` integer,
	FOREIGN KEY (`election_id`) REFERENCES `elections`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`candidate_id`) REFERENCES `candidates`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`student_id`) REFERENCES `students`(`student_id`) ON UPDATE no action ON DELETE no action
);
