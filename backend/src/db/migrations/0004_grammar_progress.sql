CREATE TABLE IF NOT EXISTS `user_grammar_progress` (
	`user_id` varchar(36) NOT NULL,
	`grammar_id` varchar(100) NOT NULL,
	`status` varchar(20) NOT NULL DEFAULT 'studied',
	`mastered` boolean NOT NULL DEFAULT false,
	`study_count` int NOT NULL DEFAULT 1,
	`last_studied_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `user_grammar_progress_pk` PRIMARY KEY(`user_id`,`grammar_id`),
	INDEX `user_grammar_status_idx` (`user_id`, `status`),
	CONSTRAINT `fk_user_grammar_user` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
