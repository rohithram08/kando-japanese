CREATE TABLE `user_alerts` (
	`id` varchar(36) NOT NULL,
	`recipient_id` varchar(36) NOT NULL,
	`sender_id` varchar(36) NOT NULL,
	`alert_type` varchar(20) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`read_at` timestamp NULL,
	CONSTRAINT `user_alerts_id` PRIMARY KEY(`id`),
	CONSTRAINT `fk_user_alerts_recipient` FOREIGN KEY (`recipient_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
	CONSTRAINT `fk_user_alerts_sender` FOREIGN KEY (`sender_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
);
CREATE INDEX `user_alerts_inbox_idx` ON `user_alerts` (`recipient_id`,`read_at`,`created_at`);
CREATE INDEX `user_alerts_sender_idx` ON `user_alerts` (`sender_id`,`created_at`);
