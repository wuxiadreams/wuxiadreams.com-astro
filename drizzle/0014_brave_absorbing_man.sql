DROP INDEX `novel_published_view_count_idx`;--> statement-breakpoint
CREATE INDEX `novel_published_view_count_idx` ON `novel` (`published`,"view_count" desc);