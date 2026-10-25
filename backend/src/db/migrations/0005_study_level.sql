ALTER TABLE `users` ADD COLUMN `study_level` varchar(10) NOT NULL DEFAULT 'N5';
UPDATE `users` SET `study_level` = `current_level` WHERE `current_level` IN ('N5','N4','N3','N2','N1');
