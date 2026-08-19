CREATE TABLE `user_reading_progress` (
	`user_id` text NOT NULL,
	`novel_id` text NOT NULL,
	`chapter_id` text,
	`chapter_number` real NOT NULL,
	`chapter_title` text NOT NULL,
	`updated_at` integer NOT NULL,
	PRIMARY KEY(`user_id`, `novel_id`),
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`novel_id`) REFERENCES `novel`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`chapter_id`) REFERENCES `chapter`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `user_reading_progress_user_updated_idx` ON `user_reading_progress` (`user_id`,`updated_at`);--> statement-breakpoint
CREATE INDEX `user_reading_progress_novel_id_idx` ON `user_reading_progress` (`novel_id`);