ALTER TABLE `author` ADD `novel_count` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
CREATE INDEX `idx_author_name` ON `author` (`name`);--> statement-breakpoint
CREATE INDEX `novel_author_aid_nid_idx` ON `novel_author` (`author_id`,`novel_id`);