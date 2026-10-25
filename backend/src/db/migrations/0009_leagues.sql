ALTER TABLE `users` ADD COLUMN `league_opt_out` boolean NOT NULL DEFAULT false;
CREATE TABLE `league_membership` (
	`user_id` varchar(36) NOT NULL,
	`rung` int NOT NULL DEFAULT 0,
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `league_membership_user_id` PRIMARY KEY(`user_id`),
	CONSTRAINT `fk_league_membership_user` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
);
CREATE TABLE `league_weeks` (
	`id` varchar(10) NOT NULL,
	`starts_at` timestamp NOT NULL DEFAULT '2000-01-01 00:00:01',
	`ends_at` timestamp NOT NULL DEFAULT '2000-01-01 00:00:01',
	`settled_at` timestamp NULL,
	CONSTRAINT `league_weeks_id` PRIMARY KEY(`id`)
);
CREATE TABLE `league_cohorts` (
	`id` varchar(36) NOT NULL,
	`week_id` varchar(10) NOT NULL,
	`rung` int NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `league_cohorts_id` PRIMARY KEY(`id`),
	INDEX `league_cohorts_week_rung_idx` (`week_id`, `rung`)
);
CREATE TABLE `league_entries` (
	`id` varchar(36) NOT NULL,
	`cohort_id` varchar(36) NOT NULL,
	`week_id` varchar(10) NOT NULL,
	`user_id` varchar(36) NOT NULL,
	`rung_start` int NOT NULL,
	`xp` int NULL,
	`rank` int NULL,
	`outcome` varchar(10) NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `league_entries_id` PRIMARY KEY(`id`),
	UNIQUE INDEX `league_entries_week_user` (`week_id`, `user_id`),
	INDEX `league_entries_cohort_idx` (`cohort_id`),
	INDEX `league_entries_user_idx` (`user_id`, `week_id`),
	CONSTRAINT `fk_league_entries_user` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
);
