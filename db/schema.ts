// src/db/schema.ts
import { sqliteTable, primaryKey, index, check } from "drizzle-orm/sqlite-core";
import * as t from "drizzle-orm/sqlite-core";
import { sql, relations, desc } from "drizzle-orm";

export const user = sqliteTable("user", {
  id: t
    .text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: t.text("name").notNull(),
  email: t.text("email").notNull().unique(),
  emailVerified: t.integer("email_verified").notNull(),
  image: t.text("image"),
  createdAt: t.integer("created_at", { mode: "timestamp_ms" }).notNull(),
  updatedAt: t.integer("updated_at", { mode: "timestamp_ms" }).notNull(),
});

export const session = sqliteTable(
  "session",
  {
    id: t
      .text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: t
      .text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    token: t.text("token").notNull().unique(),
    expiresAt: t.integer("expires_at", { mode: "timestamp_ms" }).notNull(),
    ipAddress: t.text("ip_address"),
    userAgent: t.text("user_agent"),
    createdAt: t.integer("created_at", { mode: "timestamp_ms" }).notNull(),
    updatedAt: t.integer("updated_at", { mode: "timestamp_ms" }).notNull(),
  },
  (table) => [index("session_user_id_idx").on(table.userId)],
);

export const account = sqliteTable(
  "account",
  {
    id: t
      .text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: t
      .text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accountId: t.text("account_id").notNull(),
    providerId: t.text("provider_id").notNull(),
    accessToken: t.text("access_token"),
    refreshToken: t.text("refresh_token"),
    accessTokenExpiresAt: t.integer("access_token_expires_at", {
      mode: "timestamp_ms",
    }),
    refreshTokenExpiresAt: t.integer("refresh_token_expires_at", {
      mode: "timestamp_ms",
    }),
    scope: t.text("scope"),
    idToken: t.text("id_token"),
    password: t.text("password"),
    createdAt: t.integer("created_at", { mode: "timestamp_ms" }).notNull(),
    updatedAt: t.integer("updated_at", { mode: "timestamp_ms" }).notNull(),
  },
  (table) => [index("account_user_id_idx").on(table.userId)],
);

export const verification = sqliteTable("verification", {
  id: t
    .text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  identifier: t.text("identifier").notNull(),
  value: t.text("value").notNull(),
  expiresAt: t.integer("expires_at", { mode: "timestamp_ms" }).notNull(),
  createdAt: t.integer("created_at", { mode: "timestamp_ms" }).notNull(),
  updatedAt: t.integer("updated_at", { mode: "timestamp_ms" }).notNull(),
});

export const post = sqliteTable(
  "post",
  {
    id: t
      .text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    title: t.text("title").notNull(),
    slug: t.text("slug").notNull().unique(),
    cover: t.text("cover").notNull(),
    abstract: t.text("abstract").notNull().default(""),
    content: t.text("content").default(""),
    published: t
      .integer("published", { mode: "boolean" })
      .notNull()
      .default(false),
    seoTitle: t.text("seo_title").default(""),
    seoDescription: t.text("seo_description").default(""),
    createdAt: t.integer("created_at", { mode: "timestamp_ms" }).notNull(),
    updatedAt: t.integer("updated_at", { mode: "timestamp_ms" }).notNull(),
  },
  (table) => [
    index("post_published_idx").on(table.published),
    index("post_created_at_idx").on(table.createdAt),
  ],
);

export const novel = sqliteTable(
  "novel",
  {
    id: t
      .text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    titleAlt: t.text("title_alt").notNull(),
    title: t.text("title").notNull(),
    slug: t.text("slug").notNull().unique(),
    synopsis: t.text("synopsis"),
    cover: t.text("cover"),
    banner: t.text("banner"),
    chapterCount: t.integer("chapter_count").notNull().default(0),
    status: t.text("status").notNull(),
    viewCount: t.integer("view_count").notNull().default(0),
    bookmarkCount: t.integer("bookmark_count").notNull().default(0),
    reviewCount: t.integer("review_count").notNull().default(0),
    score: t.real("score").notNull().default(0),
    officialLink: t.text("official_link"),
    translatedLink: t.text("translated_link"),
    isPinned: t
      .integer("is_pinned", { mode: "boolean" })
      .notNull()
      .default(false),
    published: t
      .integer("published", { mode: "boolean" })
      .notNull()
      .default(false),
    publishedAt: t
      .text("published_at")
      .notNull()
      .default(sql`(datetime('now'))`),
    seoTitle: t.text("seo_title").notNull().default(""),
    seoDescription: t.text("seo_description").notNull().default(""),
    createdAt: t.integer("created_at", { mode: "timestamp_ms" }).notNull(),
    updatedAt: t.integer("updated_at", { mode: "timestamp_ms" }).notNull(),
  },
  (table) => [
    index("novel_status_idx").on(table.status),
    index("novel_published_idx").on(table.published),
    index("novel_published_at_idx").on(table.publishedAt),
    index("novel_is_pinned_idx").on(table.isPinned),
    index("novel_score_idx").on(table.score),
    index("novel_view_count_idx").on(table.viewCount),
    index("novel_review_count_idx").on(table.reviewCount),
    index("novel_published_view_count_idx").on(
      table.published,
      desc(table.viewCount),
    ),
    check("bookmark_count_check", sql`${table.bookmarkCount} >= 0`),
  ],
);

export const author = sqliteTable(
  "author",
  {
    id: t
      .text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    name: t.text("name").notNull().unique(),
    nameAlt: t.text("name_alt").notNull().unique(),
    slug: t.text("slug").notNull().unique(),
    country: t.text("country").notNull().default(""),
    isPinned: t
      .integer("is_pinned", { mode: "boolean" })
      .notNull()
      .default(false),
    novelCount: t.integer("novel_count").notNull().default(0),
    createdAt: t.integer("created_at", { mode: "timestamp_ms" }).notNull(),
    updatedAt: t.integer("updated_at", { mode: "timestamp_ms" }).notNull(),
  },
  (table) => [index("idx_author_name").on(table.name)],
);

export const novelAuthor = sqliteTable(
  "novel_author",
  {
    novelId: t
      .text("novel_id")
      .notNull()
      .references(() => novel.id, { onDelete: "cascade" }),
    authorId: t
      .text("author_id")
      .notNull()
      .references(() => author.id, { onDelete: "cascade" }),
    createdAt: t.integer("created_at", { mode: "timestamp_ms" }).notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.novelId, table.authorId] }),
    index("novel_author_author_id_idx").on(table.authorId),
    // 联合索引：加速统计作者下的小说数
    index("novel_author_aid_nid_idx").on(table.authorId, table.novelId),
  ],
);

export const category = sqliteTable("category", {
  id: t.integer("id").primaryKey(),
  name: t.text("name").notNull().unique(),
  slug: t.text("slug").notNull().unique(),
  isPinned: t
    .integer("is_pinned", { mode: "boolean" })
    .notNull()
    .default(false),
  novelCount: t.integer("novel_count").notNull().default(0),
  createdAt: t.integer("created_at", { mode: "timestamp_ms" }).notNull(),
  updatedAt: t.integer("updated_at", { mode: "timestamp_ms" }).notNull(),
});

export const novelCategory = sqliteTable(
  "novel_category",
  {
    novelId: t
      .text("novel_id")
      .notNull()
      .references(() => novel.id, { onDelete: "cascade" }),
    categoryId: t
      .integer("category_id")
      .notNull()
      .references(() => category.id, { onDelete: "cascade" }),
    createdAt: t.integer("created_at", { mode: "timestamp_ms" }).notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.novelId, table.categoryId] }),
    index("novel_category_category_id_idx").on(table.categoryId),
    index("novel_category_category_id_novel_id_idx").on(
      table.categoryId,
      table.novelId,
    ),
    index("novel_category_novel_id_category_id_idx").on(
      table.novelId,
      table.categoryId,
    ),
  ],
);

export const tag = sqliteTable("tag", {
  id: t.integer("id").primaryKey(),
  name: t.text("name").notNull().unique(),
  slug: t.text("slug").notNull().unique(),
  novelCount: t.integer("novel_count").notNull().default(0),
  createdAt: t.integer("created_at", { mode: "timestamp_ms" }).notNull(),
  updatedAt: t.integer("updated_at", { mode: "timestamp_ms" }).notNull(),
});

export const novelTag = sqliteTable(
  "novel_tag",
  {
    novelId: t
      .text("novel_id")
      .notNull()
      .references(() => novel.id, { onDelete: "cascade" }),
    tagId: t
      .integer("tag_id")
      .notNull()
      .references(() => tag.id, { onDelete: "cascade" }),
    createdAt: t.integer("created_at", { mode: "timestamp_ms" }).notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.novelId, table.tagId] }),
    index("novel_tag_tag_id_idx").on(table.tagId),
    index("novel_tag_tag_id_novel_id_idx").on(table.tagId, table.novelId),
    index("novel_tag_novel_id_tag_id_idx").on(table.novelId, table.tagId),
  ],
);

export const chapter = sqliteTable(
  "chapter",
  {
    id: t
      .text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    novelId: t
      .text("novel_id")
      .notNull()
      .references(() => novel.id, { onDelete: "cascade" }),
    number: t.real("number").notNull(),
    title: t.text("title").notNull(),
    wordCount: t.integer("word_count").notNull().default(0),
    fileKey: t.text("file_key").notNull(),
    published: t
      .integer("published", { mode: "boolean" })
      .notNull()
      .default(false),
    publishedAt: t.integer("published_at", { mode: "timestamp_ms" }).notNull(),
    createdAt: t.integer("created_at", { mode: "timestamp_ms" }).notNull(),
    updatedAt: t.integer("updated_at", { mode: "timestamp_ms" }).notNull(),
  },
  (table) => [
    index("chapter_novel_id_idx").on(table.novelId),
    index("chapter_published_idx").on(table.published),
    // 符合索引，加速统计已发布章节数
    index("chapter_novel_published_idx").on(table.novelId, table.published),
    // 主索引，用于快速查询章节
    index("idx_chapter_main").on(table.novelId, table.published, table.number),
  ],
);

export const dailyStat = sqliteTable(
  "daily_stat",
  {
    novelId: t
      .text("novel_id")
      .notNull()
      .references(() => novel.id, { onDelete: "cascade" }),
    date: t.text("date").notNull(),
    viewCount: t.integer("view_count").notNull().default(0),
  },
  (table) => [
    primaryKey({ columns: [table.novelId, table.date] }),
    index("idx_daily_stat_date").on(table.date),
  ],
);

export const ranking = sqliteTable(
  "ranking",
  {
    type: t.text("type").notNull(),
    novelId: t.text("novel_id").notNull(),
    rank: t.integer("rank").notNull(),
    score: t.real("score").notNull().default(0),
    updatedAt: t.integer("updated_at", { mode: "timestamp_ms" }).notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.type, table.novelId] }),
    index("type_rank_index").on(table.type, table.rank),
  ],
);

export const userLibrary = sqliteTable(
  "user_library",
  {
    novelId: t
      .text("novel_id")
      .notNull()
      .references(() => novel.id, { onDelete: "cascade" }),
    userId: t
      .text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    createdAt: t.integer("created_at", { mode: "timestamp_ms" }).notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.userId, table.novelId] }),
    index("user_library_novel_id_idx").on(table.novelId),
  ],
);

export const novelRelations = relations(novel, ({ many }) => ({
  chapters: many(chapter),
  novelAuthors: many(novelAuthor),
  novelCategories: many(novelCategory),
  novelTags: many(novelTag),
}));

export const chapterRelations = relations(chapter, ({ one }) => ({
  novel: one(novel, {
    fields: [chapter.novelId],
    references: [novel.id],
  }),
}));

export const authorRelations = relations(author, ({ many }) => ({
  novelAuthors: many(novelAuthor),
}));

export const novelAuthorRelations = relations(novelAuthor, ({ one }) => ({
  novel: one(novel, {
    fields: [novelAuthor.novelId],
    references: [novel.id],
  }),
  author: one(author, {
    fields: [novelAuthor.authorId],
    references: [author.id],
  }),
}));

export const tagRelations = relations(tag, ({ many }) => ({
  novelTags: many(novelTag),
}));

export const novelTagRelations = relations(novelTag, ({ one }) => ({
  novel: one(novel, {
    fields: [novelTag.novelId],
    references: [novel.id],
  }),
  tag: one(tag, {
    fields: [novelTag.tagId],
    references: [tag.id],
  }),
}));

export const categoryRelations = relations(category, ({ many }) => ({
  novelCategories: many(novelCategory),
}));

export const novelCategoryRelations = relations(novelCategory, ({ one }) => ({
  novel: one(novel, {
    fields: [novelCategory.novelId],
    references: [novel.id],
  }),
  category: one(category, {
    fields: [novelCategory.categoryId],
    references: [category.id],
  }),
}));
