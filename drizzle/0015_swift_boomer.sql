ALTER TABLE `category` ADD `novel_count` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
CREATE INDEX `novel_category_category_id_novel_id_idx` ON `novel_category` (`category_id`,`novel_id`);--> statement-breakpoint
CREATE INDEX `novel_category_novel_id_category_id_idx` ON `novel_category` (`novel_id`,`category_id`);