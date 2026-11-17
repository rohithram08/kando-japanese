CREATE TABLE `user_study_sessions` (
	`id` varchar(36) NOT NULL,
	`user_id` varchar(36) NOT NULL,
	`activity_type` varchar(32) NOT NULL,
	`level` varchar(10) NOT NULL,
	`item_id` varchar(128) NOT NULL,
	`duration_seconds` int NOT NULL DEFAULT 0,
	`completed` boolean NOT NULL DEFAULT false,
	`score` int NULL,
	`metadata` text NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `user_study_sessions_id` PRIMARY KEY(`id`),
	CONSTRAINT `fk_user_study_sessions_user` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
);
CREATE INDEX `study_sessions_user_created_idx` ON `user_study_sessions` (`user_id`, `created_at`);
CREATE INDEX `study_sessions_user_activity_idx` ON `user_study_sessions` (`user_id`, `activity_type`, `created_at`);

CREATE TABLE `user_listening_progress` (
	`id` varchar(36) NOT NULL,
	`user_id` varchar(36) NOT NULL,
	`scenario_id` varchar(64) NOT NULL,
	`level` varchar(10) NOT NULL,
	`listened_count` int NOT NULL DEFAULT 1,
	`best_score` int NULL,
	`total_seconds` int NOT NULL DEFAULT 0,
	`last_listened_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `user_listening_progress_id` PRIMARY KEY(`id`),
	CONSTRAINT `fk_user_listening_progress_user` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
);
CREATE UNIQUE INDEX `listening_progress_user_scenario_unique` ON `user_listening_progress` (`user_id`, `scenario_id`);
CREATE INDEX `listening_progress_user_level_idx` ON `user_listening_progress` (`user_id`, `level`);
