ALTER TABLE `novel` RENAME COLUMN "views" TO "view_count";--> statement-breakpoint
DROP INDEX `novel_view_count_idx`;--> statement-breakpoint
CREATE INDEX `novel_view_count_idx` ON `novel` (`view_count`);