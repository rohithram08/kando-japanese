CREATE TABLE `user_follows` (
	`follower_id` varchar(36) NOT NULL,
	`following_id` varchar(36) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `user_follows_follower_id_following_id` PRIMARY KEY(`follower_id`,`following_id`),
	CONSTRAINT `fk_user_follows_follower` FOREIGN KEY (`follower_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
	CONSTRAINT `fk_user_follows_following` FOREIGN KEY (`following_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
);
CREATE INDEX `user_follows_following_idx` ON `user_follows` (`following_id`,`created_at`);
CREATE INDEX `user_follows_follower_idx` ON `user_follows` (`follower_id`,`created_at`);
