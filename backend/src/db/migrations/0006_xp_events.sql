CREATE TABLE `xp_events` (
	`id` varchar(36) NOT NULL,
	`user_id` varchar(36) NOT NULL,
	`amount` int NOT NULL,
	`source` varchar(32) NOT NULL,
	`ref_id` varchar(100),
	`minutes` int NOT NULL DEFAULT 0,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `xp_events_id` PRIMARY KEY(`id`),
	INDEX `xp_events_user_time_idx` (`user_id`, `created_at`),
	INDEX `xp_events_time_idx` (`created_at`),
	CONSTRAINT `fk_xp_events_user` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
);
