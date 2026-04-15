CREATE TABLE `daily_stat` (
	`novel_id` text NOT NULL,
	`date` text NOT NULL,
	`view_count` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`novel_id`) REFERENCES `novel`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
DROP TABLE `novel_rank`;--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_novel` (
	`id` text PRIMARY KEY NOT NULL,
	`title_alt` text NOT NULL,
	`title` text NOT NULL,
	`slug` text NOT NULL,
	`synopsis` text,
	`cover` text,
	`banner` text,
	`chapter_count` integer DEFAULT 0 NOT NULL,
	`status` text NOT NULL,
	`views` integer DEFAULT 0 NOT NULL,
	`bookmark_count` integer DEFAULT 0 NOT NULL,
	`review_count` integer DEFAULT 0 NOT NULL,
	`score` real DEFAULT 0 NOT NULL,
	`official_link` text,
	`translated_link` text,
	`is_pinned` integer DEFAULT false NOT NULL,
	`published` integer DEFAULT false NOT NULL,
	`published_at` text DEFAULT (datetime('now')) NOT NULL,
	`seo_title` text DEFAULT '' NOT NULL,
	`seo_description` text DEFAULT '' NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	CONSTRAINT "bookmark_count_check" CHECK("__new_novel"."bookmark_count" >= 0)
);
--> statement-breakpoint
INSERT INTO `__new_novel`("id", "title_alt", "title", "slug", "synopsis", "cover", "banner", "chapter_count", "status", "views", "bookmark_count", "review_count", "score", "official_link", "translated_link", "is_pinned", "published", "published_at", "seo_title", "seo_description", "created_at", "updated_at") SELECT "id", "title_alt", "title", "slug", "synopsis", "cover", "banner", "chapter_count", "status", "views", "bookmark_count", "review_count", "score", "official_link", "translated_link", "is_pinned", "published", "published_at", "seo_title", "seo_description", "created_at", "updated_at" FROM `novel`;--> statement-breakpoint
DROP TABLE `novel`;--> statement-breakpoint
ALTER TABLE `__new_novel` RENAME TO `novel`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `novel_slug_unique` ON `novel` (`slug`);--> statement-breakpoint
CREATE INDEX `novel_status_idx` ON `novel` (`status`);--> statement-breakpoint
CREATE INDEX `novel_published_idx` ON `novel` (`published`);--> statement-breakpoint
CREATE INDEX `novel_published_at_idx` ON `novel` (`published_at`);--> statement-breakpoint
CREATE INDEX `novel_is_pinned_idx` ON `novel` (`is_pinned`);--> statement-breakpoint
CREATE INDEX `novel_score_idx` ON `novel` (`score`);--> statement-breakpoint
CREATE INDEX `novel_view_count_idx` ON `novel` (`views`);--> statement-breakpoint
CREATE INDEX `novel_review_count_idx` ON `novel` (`review_count`);--> statement-breakpoint
ALTER TABLE `ranking` ADD `score` real DEFAULT 0 NOT NULL;