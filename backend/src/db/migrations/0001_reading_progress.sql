CREATE TABLE IF NOT EXISTS `user_reading_progress` (
	`id` varchar(36) NOT NULL,
	`user_id` varchar(36) NOT NULL,
	`story_id` varchar(100) NOT NULL,
	`status` varchar(20) NOT NULL DEFAULT 'in_progress',
	`last_sentence_index` int NOT NULL DEFAULT 0,
	`quiz_score` int DEFAULT 0,
	`completed_at` timestamp NULL DEFAULT NULL,
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `user_reading_progress_id` PRIMARY KEY(`id`),
	CONSTRAINT `user_story_unique` UNIQUE(`user_id`,`story_id`),
	INDEX `user_reading_idx` (`user_id`, `status`),
	CONSTRAINT `fk_user_reading_user` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
