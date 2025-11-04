PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_adminAuth` (
	`id` text PRIMARY KEY NOT NULL,
	`fullname` text,
	`email` text NOT NULL,
	`role` text,
	`access_token` text,
	`refresh_token` text,
	`created_at` text DEFAULT '2025-11-04T19:03:54.277Z',
	`updated_at` text,
	`deleted_at` text,
	`synced_at` text
);
--> statement-breakpoint
INSERT INTO `__new_adminAuth`("id", "fullname", "email", "role", "access_token", "refresh_token", "created_at", "updated_at", "deleted_at", "synced_at") SELECT "id", "fullname", "email", "role", "access_token", "refresh_token", "created_at", "updated_at", "deleted_at", "synced_at" FROM `adminAuth`;--> statement-breakpoint
DROP TABLE `adminAuth`;--> statement-breakpoint
ALTER TABLE `__new_adminAuth` RENAME TO `adminAuth`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_students` (
	`id` text PRIMARY KEY NOT NULL,
	`student_id` text NOT NULL,
	`fullname` text NOT NULL,
	`email` text,
	`isRegistered` integer DEFAULT 0,
	`created_at` text DEFAULT '2025-11-04T19:03:54.280Z',
	`updated_at` text,
	`deleted_at` text,
	`synced_at` integer DEFAULT 0
);
--> statement-breakpoint
INSERT INTO `__new_students`("id", "student_id", "fullname", "email", "isRegistered", "created_at", "updated_at", "deleted_at", "synced_at") SELECT "id", "student_id", "fullname", "email", "isRegistered", "created_at", "updated_at", "deleted_at", "synced_at" FROM `students`;--> statement-breakpoint
DROP TABLE `students`;--> statement-breakpoint
ALTER TABLE `__new_students` RENAME TO `students`;--> statement-breakpoint
CREATE UNIQUE INDEX `students_student_id_unique` ON `students` (`student_id`);--> statement-breakpoint
CREATE TABLE `__new_voteTallies` (
	`id` text PRIMARY KEY NOT NULL,
	`election_id` text,
	`election_name` text NOT NULL,
	`candidate_id` text,
	`candidate_name` text NOT NULL,
	`partylist_id` text,
	`partylist_name` text,
	`partylist_acronym` text,
	`partylist_color` text,
	`candidate_profile` text,
	`votes_count` integer NOT NULL,
	`percentage` numeric NOT NULL,
	`total_votes` integer NOT NULL,
	`created_at` text DEFAULT '2025-11-04T19:03:54.281Z',
	`updated_at` text,
	`deleted_at` text,
	`synced_at` integer DEFAULT 0
);
--> statement-breakpoint
INSERT INTO `__new_voteTallies`("id", "election_id", "election_name", "candidate_id", "candidate_name", "partylist_id", "partylist_name", "partylist_acronym", "partylist_color", "candidate_profile", "votes_count", "percentage", "total_votes", "created_at", "updated_at", "deleted_at", "synced_at") SELECT "id", "election_id", "election_name", "candidate_id", "candidate_name", "partylist_id", "partylist_name", "partylist_acronym", "partylist_color", "candidate_profile", "votes_count", "percentage", "total_votes", "created_at", "updated_at", "deleted_at", "synced_at" FROM `voteTallies`;--> statement-breakpoint
DROP TABLE `voteTallies`;--> statement-breakpoint
ALTER TABLE `__new_voteTallies` RENAME TO `voteTallies`;--> statement-breakpoint
CREATE TABLE `__new_votes` (
	`id` text PRIMARY KEY NOT NULL,
	`election_id` text NOT NULL,
	`candidate_id` text NOT NULL,
	`student_id` text,
	`created_at` text DEFAULT '2025-11-04T19:03:54.280Z',
	`updated_at` text,
	`deleted_at` text,
	`synced_at` integer DEFAULT 0,
	FOREIGN KEY (`election_id`) REFERENCES `elections`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`candidate_id`) REFERENCES `candidates`(`candidate_id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`student_id`) REFERENCES `students`(`student_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_votes`("id", "election_id", "candidate_id", "student_id", "created_at", "updated_at", "deleted_at", "synced_at") SELECT "id", "election_id", "candidate_id", "student_id", "created_at", "updated_at", "deleted_at", "synced_at" FROM `votes`;--> statement-breakpoint
DROP TABLE `votes`;--> statement-breakpoint
ALTER TABLE `__new_votes` RENAME TO `votes`;--> statement-breakpoint
ALTER TABLE `elections` ADD `position_order` integer DEFAULT 99;