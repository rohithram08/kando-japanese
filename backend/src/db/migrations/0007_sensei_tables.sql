-- sensei_conversations / sensei_tour_progress are defined in schema.ts but were never migrated,
-- so databases built from the migration chain lacked them (and DELETE /progress/reset returned 500).
-- IF NOT EXISTS makes this a no-op on databases that already have them (e.g. created via drizzle-kit push).
CREATE TABLE IF NOT EXISTS `sensei_conversations` (
	`id` varchar(36) NOT NULL,
	`user_id` varchar(36) NOT NULL,
	`role` varchar(20) NOT NULL,
	`content` text NOT NULL,
	`intent` varchar(50),
	`emotion` varchar(30),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `sensei_conversations_id` PRIMARY KEY(`id`),
	INDEX `user_created_idx` (`user_id`, `created_at`),
	CONSTRAINT `fk_sensei_conversations_user` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS `sensei_tour_progress` (
	`user_id` varchar(36) NOT NULL,
	`current_step` int NOT NULL DEFAULT 0,
	`completed` boolean NOT NULL DEFAULT false,
	`skipped` boolean NOT NULL DEFAULT false,
	`started_at` timestamp DEFAULT (now()),
	`completed_at` timestamp NULL,
	CONSTRAINT `sensei_tour_progress_user_id` PRIMARY KEY(`user_id`),
	CONSTRAINT `fk_sensei_tour_progress_user` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
);
