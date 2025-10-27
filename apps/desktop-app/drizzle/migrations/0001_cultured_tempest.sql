PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_adminAuth` (
	`id` text PRIMARY KEY NOT NULL,
	`fullname` text,
	`email` text NOT NULL,
	`role` text,
	`access_token` text,
	`refresh_token` text,
	`created_at` text DEFAULT '2025-10-27T03:26:55.126Z',
	`updated_at` text,
	`deleted_at` text,
	`synced_at` text
);
--> statement-breakpoint
INSERT INTO `__new_adminAuth`("id", "fullname", "email", "role", "access_token", "refresh_token", "created_at", "updated_at", "deleted_at", "synced_at") SELECT "id", "fullname", "email", "role", "access_token", "refresh_token", "created_at", "updated_at", "deleted_at", "synced_at" FROM `adminAuth`;--> statement-breakpoint
DROP TABLE `adminAuth`;--> statement-breakpoint
ALTER TABLE `__new_adminAuth` RENAME TO `adminAuth`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_candidates` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`profile` text,
	`profile_path` text,
	`election_id` text NOT NULL,
	`partylist_id` text,
	`created_at` text DEFAULT '2025-10-27T03:26:55.128Z',
	`updated_at` text,
	`deleted_at` text,
	`synced_at` integer DEFAULT 0,
	FOREIGN KEY (`election_id`) REFERENCES `elections`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`partylist_id`) REFERENCES `partylist`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
INSERT INTO `__new_candidates`("id", "name", "description", "profile", "profile_path", "election_id", "partylist_id", "created_at", "updated_at", "deleted_at", "synced_at") SELECT "id", "name", "description", "profile", "profile_path", "election_id", "partylist_id", "created_at", "updated_at", "deleted_at", "synced_at" FROM `candidates`;--> statement-breakpoint
DROP TABLE `candidates`;--> statement-breakpoint
ALTER TABLE `__new_candidates` RENAME TO `candidates`;--> statement-breakpoint
CREATE TABLE `__new_elections` (
	`id` text PRIMARY KEY NOT NULL,
	`election` text NOT NULL,
	`description` text,
	`max_votes_allowed` integer DEFAULT 1 NOT NULL,
	`status` text DEFAULT 'active' NOT NULL,
	`end_time` text,
	`end_date` text,
	`created_at` text DEFAULT '2025-10-27T03:26:55.127Z',
	`updated_at` text,
	`deleted_at` text,
	`synced_at` integer DEFAULT 0
);
--> statement-breakpoint
INSERT INTO `__new_elections`("id", "election", "description", "max_votes_allowed", "status", "end_time", "end_date", "created_at", "updated_at", "deleted_at", "synced_at") SELECT "id", "election", "description", "max_votes_allowed", "status", "end_time", "end_date", "created_at", "updated_at", "deleted_at", "synced_at" FROM `elections`;--> statement-breakpoint
DROP TABLE `elections`;--> statement-breakpoint
ALTER TABLE `__new_elections` RENAME TO `elections`;--> statement-breakpoint
CREATE TABLE `__new_partylist` (
	`id` text PRIMARY KEY NOT NULL,
	`partylist` text NOT NULL,
	`acronym` text NOT NULL,
	`color` text NOT NULL,
	`logo` text,
	`logo_path` text,
	`created_at` text DEFAULT '2025-10-27T03:26:55.129Z',
	`updated_at` text,
	`deleted_at` text,
	`synced_at` integer DEFAULT 0
);
--> statement-breakpoint
INSERT INTO `__new_partylist`("id", "partylist", "acronym", "color", "logo", "logo_path", "created_at", "updated_at", "deleted_at", "synced_at") SELECT "id", "partylist", "acronym", "color", "logo", "logo_path", "created_at", "updated_at", "deleted_at", "synced_at" FROM `partylist`;--> statement-breakpoint
DROP TABLE `partylist`;--> statement-breakpoint
ALTER TABLE `__new_partylist` RENAME TO `partylist`;--> statement-breakpoint
CREATE TABLE `__new_students` (
	`id` text PRIMARY KEY NOT NULL,
	`student_id` text NOT NULL,
	`fullname` text NOT NULL,
	`email` text,
	`isRegistered` integer DEFAULT 0,
	`created_at` text DEFAULT '2025-10-27T03:26:55.128Z',
	`updated_at` text,
	`deleted_at` text,
	`synced_at` integer DEFAULT 0
);
--> statement-breakpoint
INSERT INTO `__new_students`("id", "student_id", "fullname", "email", "isRegistered", "created_at", "updated_at", "deleted_at", "synced_at") SELECT "id", "student_id", "fullname", "email", "isRegistered", "created_at", "updated_at", "deleted_at", "synced_at" FROM `students`;--> statement-breakpoint
DROP TABLE `students`;--> statement-breakpoint
ALTER TABLE `__new_students` RENAME TO `students`;--> statement-breakpoint
CREATE UNIQUE INDEX `students_student_id_unique` ON `students` (`student_id`);