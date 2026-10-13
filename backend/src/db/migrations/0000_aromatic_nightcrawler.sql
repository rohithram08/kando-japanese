CREATE TABLE `srs_cards` (
	`id` varchar(36) NOT NULL,
	`user_id` varchar(36) NOT NULL,
	`card_type` varchar(20) NOT NULL,
	`card_ref_id` varchar(100) NOT NULL,
	`ease_factor` float NOT NULL DEFAULT 2.5,
	`interval_days` int NOT NULL DEFAULT 0,
	`repetitions` int NOT NULL DEFAULT 0,
	`next_review_date` date NOT NULL,
	`last_review_date` date,
	`is_mastered` boolean NOT NULL DEFAULT false,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `srs_cards_id` PRIMARY KEY(`id`),
	CONSTRAINT `user_card_unique` UNIQUE(`user_id`,`card_type`,`card_ref_id`)
);
--> statement-breakpoint
CREATE TABLE `user_badges` (
	`id` varchar(36) NOT NULL,
	`user_id` varchar(36) NOT NULL,
	`badge_type` varchar(100) NOT NULL,
	`badge_name` varchar(200),
	`awarded_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `user_badges_id` PRIMARY KEY(`id`),
	CONSTRAINT `user_badge_unique` UNIQUE(`user_id`,`badge_type`)
);
--> statement-breakpoint
CREATE TABLE `user_kanji_progress` (
	`user_id` varchar(36) NOT NULL,
	`kanji_id` varchar(100) NOT NULL,
	`recognition_level` int NOT NULL DEFAULT 0,
	`mastered` boolean DEFAULT false,
	`review_count` int DEFAULT 0,
	`last_reviewed_at` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `user_kanji_progress_user_id_kanji_id_pk` PRIMARY KEY(`user_id`,`kanji_id`)
);
--> statement-breakpoint
CREATE TABLE `user_lesson_progress` (
	`user_id` varchar(36) NOT NULL,
	`lesson_id` varchar(100) NOT NULL,
	`status` varchar(20) NOT NULL DEFAULT 'in_progress',
	`score` int DEFAULT 0,
	`time_spent_seconds` int DEFAULT 0,
	`last_accessed_at` timestamp DEFAULT (now()),
	`completed_at` timestamp,
	CONSTRAINT `user_lesson_progress_user_id_lesson_id_pk` PRIMARY KEY(`user_id`,`lesson_id`)
);
--> statement-breakpoint
CREATE TABLE `user_streaks` (
	`user_id` varchar(36) NOT NULL,
	`date` date NOT NULL,
	`lessons_completed` int DEFAULT 0,
	`minutes_studied` int DEFAULT 0,
	`xp` int DEFAULT 0,
	CONSTRAINT `user_streaks_user_id_date_pk` PRIMARY KEY(`user_id`,`date`)
);
--> statement-breakpoint
CREATE TABLE `user_vocabulary_progress` (
	`user_id` varchar(36) NOT NULL,
	`vocabulary_id` varchar(100) NOT NULL,
	`mastery_level` int NOT NULL DEFAULT 0,
	`mastered` boolean DEFAULT false,
	`review_count` int DEFAULT 0,
	`last_reviewed_at` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `user_vocabulary_progress_user_id_vocabulary_id_pk` PRIMARY KEY(`user_id`,`vocabulary_id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` varchar(36) NOT NULL,
	`email` varchar(255) NOT NULL,
	`username` varchar(100) NOT NULL,
	`password_hash` varchar(255) NOT NULL,
	`native_language` varchar(50) DEFAULT 'English',
	`current_level` varchar(10) DEFAULT 'N5',
	`avatar_url` text,
	`avatar_id` varchar(100),
	`xp_points` int NOT NULL DEFAULT 0,
	`streak_days` int NOT NULL DEFAULT 0,
	`google_id` varchar(255),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
ALTER TABLE `srs_cards` ADD CONSTRAINT `srs_cards_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `user_badges` ADD CONSTRAINT `user_badges_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `user_kanji_progress` ADD CONSTRAINT `user_kanji_progress_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `user_lesson_progress` ADD CONSTRAINT `user_lesson_progress_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `user_streaks` ADD CONSTRAINT `user_streaks_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `user_vocabulary_progress` ADD CONSTRAINT `user_vocabulary_progress_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `due_cards_idx` ON `srs_cards` (`user_id`,`next_review_date`,`is_mastered`);