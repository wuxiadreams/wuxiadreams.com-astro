PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_daily_stat` (
	`novel_id` text NOT NULL,
	`date` text NOT NULL,
	`view_count` integer DEFAULT 0 NOT NULL,
	PRIMARY KEY(`novel_id`, `date`),
	FOREIGN KEY (`novel_id`) REFERENCES `novel`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_daily_stat`("novel_id", "date", "view_count") SELECT "novel_id", "date", "view_count" FROM `daily_stat`;--> statement-breakpoint
DROP TABLE `daily_stat`;--> statement-breakpoint
ALTER TABLE `__new_daily_stat` RENAME TO `daily_stat`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE INDEX `idx_daily_stat_date` ON `daily_stat` (`date`);