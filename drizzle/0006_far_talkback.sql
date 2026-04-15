PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_chapter` (
	`id` text PRIMARY KEY NOT NULL,
	`novel_id` text NOT NULL,
	`number` real NOT NULL,
	`title` text NOT NULL,
	`word_count` integer DEFAULT 0 NOT NULL,
	`file_key` text NOT NULL,
	`published` integer DEFAULT false NOT NULL,
	`published_at` integer NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`novel_id`) REFERENCES `novel`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_chapter`("id", "novel_id", "number", "title", "word_count", "file_key", "published", "published_at", "created_at", "updated_at") SELECT "id", "novel_id", "number", "title", "word_count", "file_key", "published", "published_at", "created_at", "updated_at" FROM `chapter`;--> statement-breakpoint
DROP TABLE `chapter`;--> statement-breakpoint
ALTER TABLE `__new_chapter` RENAME TO `chapter`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE INDEX `chapter_novel_id_idx` ON `chapter` (`novel_id`);--> statement-breakpoint
CREATE INDEX `chapter_published_idx` ON `chapter` (`published`);--> statement-breakpoint
CREATE INDEX `idx_chapter_main` ON `chapter` (`novel_id`,`published`,`number`);--> statement-breakpoint
CREATE TABLE `__new_daily_stat` (
	`novel_id` text NOT NULL,
	`date` text NOT NULL,
	`view_count` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`novel_id`) REFERENCES `novel`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_daily_stat`("novel_id", "date", "view_count") SELECT "novel_id", "date", "view_count" FROM `daily_stat`;--> statement-breakpoint
DROP TABLE `daily_stat`;--> statement-breakpoint
ALTER TABLE `__new_daily_stat` RENAME TO `daily_stat`;--> statement-breakpoint
CREATE TABLE `__new_novel_author` (
	`novel_id` text NOT NULL,
	`author_id` text NOT NULL,
	`created_at` integer NOT NULL,
	PRIMARY KEY(`novel_id`, `author_id`),
	FOREIGN KEY (`novel_id`) REFERENCES `novel`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`author_id`) REFERENCES `author`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_novel_author`("novel_id", "author_id", "created_at") SELECT "novel_id", "author_id", "created_at" FROM `novel_author`;--> statement-breakpoint
DROP TABLE `novel_author`;--> statement-breakpoint
ALTER TABLE `__new_novel_author` RENAME TO `novel_author`;--> statement-breakpoint
CREATE INDEX `novel_author_author_id_idx` ON `novel_author` (`author_id`);--> statement-breakpoint
CREATE TABLE `__new_novel_category` (
	`novel_id` text NOT NULL,
	`category_id` integer NOT NULL,
	`created_at` integer NOT NULL,
	PRIMARY KEY(`novel_id`, `category_id`),
	FOREIGN KEY (`novel_id`) REFERENCES `novel`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`category_id`) REFERENCES `category`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_novel_category`("novel_id", "category_id", "created_at") SELECT "novel_id", "category_id", "created_at" FROM `novel_category`;--> statement-breakpoint
DROP TABLE `novel_category`;--> statement-breakpoint
ALTER TABLE `__new_novel_category` RENAME TO `novel_category`;--> statement-breakpoint
CREATE INDEX `novel_category_category_id_idx` ON `novel_category` (`category_id`);--> statement-breakpoint
CREATE TABLE `__new_novel_tag` (
	`novel_id` text NOT NULL,
	`tag_id` integer NOT NULL,
	`created_at` integer NOT NULL,
	PRIMARY KEY(`novel_id`, `tag_id`),
	FOREIGN KEY (`novel_id`) REFERENCES `novel`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`tag_id`) REFERENCES `tag`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_novel_tag`("novel_id", "tag_id", "created_at") SELECT "novel_id", "tag_id", "created_at" FROM `novel_tag`;--> statement-breakpoint
DROP TABLE `novel_tag`;--> statement-breakpoint
ALTER TABLE `__new_novel_tag` RENAME TO `novel_tag`;--> statement-breakpoint
CREATE INDEX `novel_tag_tag_id_idx` ON `novel_tag` (`tag_id`);--> statement-breakpoint
CREATE TABLE `__new_user_library` (
	`novel_id` text NOT NULL,
	`user_id` text NOT NULL,
	`created_at` integer NOT NULL,
	PRIMARY KEY(`user_id`, `novel_id`),
	FOREIGN KEY (`novel_id`) REFERENCES `novel`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_user_library`("novel_id", "user_id", "created_at") SELECT "novel_id", "user_id", "created_at" FROM `user_library`;--> statement-breakpoint
DROP TABLE `user_library`;--> statement-breakpoint
ALTER TABLE `__new_user_library` RENAME TO `user_library`;--> statement-breakpoint
CREATE INDEX `user_library_novel_id_idx` ON `user_library` (`novel_id`);