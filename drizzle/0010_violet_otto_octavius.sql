ALTER TABLE `tag` ADD `novel_count` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
CREATE INDEX `novel_tag_tag_id_novel_id_idx` ON `novel_tag` (`tag_id`,`novel_id`);--> statement-breakpoint
CREATE INDEX `novel_tag_novel_id_tag_id_idx` ON `novel_tag` (`novel_id`,`tag_id`);