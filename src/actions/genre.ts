import { defineAction } from "astro:actions";
import { z } from "zod";
import { db } from "@/lib/db";
import { category, novel, novelCategory } from "@/db/schema";
import { eq, and, desc, count } from "drizzle-orm";

export const genreActions = {
  getAllGenres: defineAction({
    accept: "json",
    input: z.object({
      page: z.number().default(1),
      statusFilter: z.string().default("all"),
      pageSize: z.number().default(24),
    }),
    handler: async ({ page, statusFilter, pageSize }) => {
      // Fetch all categories
      const categories = await db
        .select()
        .from(category)
        .orderBy(category.name);

      // Build conditions
      const conditions: any[] = [eq(novel.published, true)];
      if (statusFilter === "ongoing") {
        conditions.push(eq(novel.status, "ongoing"));
      } else if (statusFilter === "completed") {
        conditions.push(eq(novel.status, "completed"));
      }

      // Count total
      const [{ total }] = await db
        .select({ total: count() })
        .from(novel)
        .where(and(...conditions));

      const totalPages = Math.ceil(total / pageSize);

      // Fetch novels
      const novels = await db
        .select()
        .from(novel)
        .where(and(...conditions))
        .orderBy(desc(novel.viewCount))
        .limit(pageSize)
        .offset((page - 1) * pageSize);

      return {
        categories,
        total,
        totalPages,
        novels,
      };
    },
  }),

  getGenreNovels: defineAction({
    accept: "json",
    input: z.object({
      slug: z.string(),
      page: z.number().default(1),
      statusFilter: z.string().default("all"),
      pageSize: z.number().default(24),
    }),
    handler: async ({ slug, page, statusFilter, pageSize }) => {
      // Fetch current category
      const currentCategory = await db
        .select()
        .from(category)
        .where(eq(category.slug, slug))
        .get();

      if (!currentCategory) {
        return {
          currentCategory: null,
          categories: [],
          novels: [],
          totalPages: 0,
        };
      }

      // Fetch all categories for sidebar
      const categories = await db
        .select()
        .from(category)
        .orderBy(category.name);

      // Build conditions
      const conditions: any[] = [
        eq(novel.published, true),
        eq(novelCategory.categoryId, currentCategory.id),
      ];
      if (statusFilter === "ongoing") {
        conditions.push(eq(novel.status, "ongoing"));
      } else if (statusFilter === "completed") {
        conditions.push(eq(novel.status, "completed"));
      }

      // Count total
      const [{ total }] = await db
        .select({ total: count() })
        .from(novelCategory)
        .innerJoin(novel, eq(novelCategory.novelId, novel.id))
        .where(and(...conditions));

      const totalPages = Math.ceil(total / pageSize);

      // Fetch novels
      const novels = await db
        .select({
          id: novel.id,
          title: novel.title,
          slug: novel.slug,
          cover: novel.cover,
          status: novel.status,
          score: novel.score,
          viewCount: novel.viewCount,
          chapterCount: novel.chapterCount,
        })
        .from(novelCategory)
        .innerJoin(novel, eq(novelCategory.novelId, novel.id))
        .where(and(...conditions))
        .orderBy(desc(novel.viewCount))
        .limit(pageSize)
        .offset((page - 1) * pageSize);

      return {
        currentCategory,
        categories,
        total,
        totalPages,
        novels,
      };
    },
  }),
};
