CREATE TABLE `ranking` (
	`type` text NOT NULL,
	`novel_id` text NOT NULL,
	`rank` integer NOT NULL,
	`updated_at` integer NOT NULL,
	PRIMARY KEY(`type`, `novel_id`)
);
--> statement-breakpoint
CREATE INDEX `type_rank_index` ON `ranking` (`type`,`rank`);--> statement-breakpoint
DROP INDEX `novel_views_idx`;--> statement-breakpoint
CREATE INDEX `novel_view_count_idx` ON `novel` (`views`);