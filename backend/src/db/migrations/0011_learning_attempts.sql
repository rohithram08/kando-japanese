CREATE TABLE `learning_attempts` (
	`id` varchar(36) NOT NULL,
	`user_id` varchar(36) NOT NULL,
	`item_type` varchar(20) NOT NULL,
	`item_id` varchar(100) NOT NULL,
	`correct` boolean NOT NULL,
	`quality` int,
	`response_ms` int,
	`modality` varchar(20) NOT NULL DEFAULT 'recall',
	`local_hour` int,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `learning_attempts_id` PRIMARY KEY(`id`),
	CONSTRAINT `fk_learning_attempts_user` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
);
CREATE INDEX `learning_attempts_user_time_idx` ON `learning_attempts` (`user_id`,`created_at`);
CREATE INDEX `learning_attempts_user_item_idx` ON `learning_attempts` (`user_id`,`item_type`,`item_id`);
