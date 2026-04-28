CREATE INDEX `novel_published_score_idx` ON `novel` (`published`,"score" desc);--> statement-breakpoint
CREATE INDEX `novel_published_updated_at_idx` ON `novel` (`published`,"updated_at" desc);