PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_elections` (
	`id` text PRIMARY KEY NOT NULL,
	`election` text NOT NULL,
	`description` text,
	`max_votes_allowed` integer DEFAULT 1 NOT NULL,
	`status` text DEFAULT 'active' NOT NULL,
	`end_time` text,
	`end_date` text,
	`created_at` text DEFAULT '2025-10-12T00:21:59.426Z',
	`updated_at` text,
	`deleted_at` text,
	`synced_at` text
);
--> statement-breakpoint
INSERT INTO `__new_elections`("id", "election", "description", "max_votes_allowed", "status", "end_time", "end_date", "created_at", "updated_at", "deleted_at", "synced_at") SELECT "id", "election", "description", "max_votes_allowed", "status", "end_time", "end_date", "created_at", "updated_at", "deleted_at", "synced_at" FROM `elections`;--> statement-breakpoint
DROP TABLE `elections`;--> statement-breakpoint
ALTER TABLE `__new_elections` RENAME TO `elections`;--> statement-breakpoint
PRAGMA foreign_keys=ON;