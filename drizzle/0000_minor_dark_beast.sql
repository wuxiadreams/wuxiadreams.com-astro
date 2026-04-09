CREATE TABLE `account` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`account_id` text NOT NULL,
	`provider_id` text NOT NULL,
	`access_token` text,
	`refresh_token` text,
	`access_token_expires_at` integer,
	`refresh_token_expires_at` integer,
	`scope` text,
	`id_token` text,
	`password` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `account_user_id_idx` ON `account` (`user_id`);--> statement-breakpoint
CREATE TABLE `author` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`name_alt` text NOT NULL,
	`slug` text NOT NULL,
	`country` text DEFAULT '' NOT NULL,
	`is_pinned` integer DEFAULT false NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `author_name_unique` ON `author` (`name`);--> statement-breakpoint
CREATE UNIQUE INDEX `author_name_alt_unique` ON `author` (`name_alt`);--> statement-breakpoint
CREATE UNIQUE INDEX `author_slug_unique` ON `author` (`slug`);--> statement-breakpoint
CREATE TABLE `category` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `category_name_unique` ON `category` (`name`);--> statement-breakpoint
CREATE UNIQUE INDEX `category_slug_unique` ON `category` (`slug`);--> statement-breakpoint
CREATE TABLE `chapter` (
	`id` text PRIMARY KEY NOT NULL,
	`novel_id` text NOT NULL,
	`title` text NOT NULL,
	`word_count` integer DEFAULT 0 NOT NULL,
	`file_key` text NOT NULL,
	`published` integer DEFAULT false NOT NULL,
	`published_at` integer NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`novel_id`) REFERENCES `novel`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `chapter_novel_id_idx` ON `chapter` (`novel_id`);--> statement-breakpoint
CREATE INDEX `chapter_published_idx` ON `chapter` (`published`);--> statement-breakpoint
CREATE TABLE `novel` (
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
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `novel_slug_unique` ON `novel` (`slug`);--> statement-breakpoint
CREATE INDEX `novel_status_idx` ON `novel` (`status`);--> statement-breakpoint
CREATE INDEX `novel_published_idx` ON `novel` (`published`);--> statement-breakpoint
CREATE INDEX `novel_published_at_idx` ON `novel` (`published_at`);--> statement-breakpoint
CREATE INDEX `novel_is_pinned_idx` ON `novel` (`is_pinned`);--> statement-breakpoint
CREATE INDEX `novel_score_idx` ON `novel` (`score`);--> statement-breakpoint
CREATE INDEX `novel_views_idx` ON `novel` (`views`);--> statement-breakpoint
CREATE INDEX `novel_review_count_idx` ON `novel` (`review_count`);--> statement-breakpoint
CREATE TABLE `novel_author` (
	`novel_id` text NOT NULL,
	`author_id` text NOT NULL,
	`created_at` integer NOT NULL,
	PRIMARY KEY(`novel_id`, `author_id`),
	FOREIGN KEY (`novel_id`) REFERENCES `novel`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`author_id`) REFERENCES `author`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `novel_author_author_id_idx` ON `novel_author` (`author_id`);--> statement-breakpoint
CREATE TABLE `novel_category` (
	`novel_id` text NOT NULL,
	`category_id` integer NOT NULL,
	`created_at` integer NOT NULL,
	PRIMARY KEY(`novel_id`, `category_id`),
	FOREIGN KEY (`novel_id`) REFERENCES `novel`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`category_id`) REFERENCES `category`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `novel_category_category_id_idx` ON `novel_category` (`category_id`);--> statement-breakpoint
CREATE TABLE `novel_rank` (
	`id` text PRIMARY KEY NOT NULL,
	`novel_id` text NOT NULL,
	`rank_type` text NOT NULL,
	`ranking` integer DEFAULT 0 NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`novel_id`) REFERENCES `novel`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `novel_rank_novel_id_idx` ON `novel_rank` (`novel_id`);--> statement-breakpoint
CREATE INDEX `novel_rank_type_ranking_idx` ON `novel_rank` (`rank_type`,`ranking`);--> statement-breakpoint
CREATE TABLE `novel_tag` (
	`novel_id` text NOT NULL,
	`tag_id` integer NOT NULL,
	`created_at` integer NOT NULL,
	PRIMARY KEY(`novel_id`, `tag_id`),
	FOREIGN KEY (`novel_id`) REFERENCES `novel`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`tag_id`) REFERENCES `tag`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `novel_tag_tag_id_idx` ON `novel_tag` (`tag_id`);--> statement-breakpoint
CREATE TABLE `post` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`slug` text NOT NULL,
	`cover` text NOT NULL,
	`abstract` text DEFAULT '' NOT NULL,
	`content` text DEFAULT '',
	`published` integer DEFAULT false NOT NULL,
	`seo_title` text DEFAULT '',
	`seo_description` text DEFAULT '',
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `post_slug_unique` ON `post` (`slug`);--> statement-breakpoint
CREATE INDEX `post_published_idx` ON `post` (`published`);--> statement-breakpoint
CREATE INDEX `post_created_at_idx` ON `post` (`created_at`);--> statement-breakpoint
CREATE TABLE `session` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`token` text NOT NULL,
	`expires_at` integer NOT NULL,
	`ip_address` text,
	`user_agent` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `session_token_unique` ON `session` (`token`);--> statement-breakpoint
CREATE INDEX `session_user_id_idx` ON `session` (`user_id`);--> statement-breakpoint
CREATE TABLE `tag` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `tag_name_unique` ON `tag` (`name`);--> statement-breakpoint
CREATE UNIQUE INDEX `tag_slug_unique` ON `tag` (`slug`);--> statement-breakpoint
CREATE TABLE `user` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`email_verified` integer NOT NULL,
	`image` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `user_email_unique` ON `user` (`email`);--> statement-breakpoint
CREATE TABLE `user_library` (
	`novel_id` text NOT NULL,
	`user_id` text NOT NULL,
	`created_at` integer NOT NULL,
	PRIMARY KEY(`user_id`, `novel_id`),
	FOREIGN KEY (`novel_id`) REFERENCES `novel`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `user_library_novel_id_idx` ON `user_library` (`novel_id`);--> statement-breakpoint
CREATE TABLE `verification` (
	`id` text PRIMARY KEY NOT NULL,
	`identifier` text NOT NULL,
	`value` text NOT NULL,
	`expires_at` integer NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
