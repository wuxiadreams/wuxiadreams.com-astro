import { defineAction } from "astro:actions";
import { z } from "zod";
import { db } from "@/lib/db";
import { post } from "@/db/schema";
import { eq, and, desc, count } from "drizzle-orm";

export const postActions = {
  getPostList: defineAction({
    accept: "json",
    input: z.object({
      page: z.number().default(1),
      limit: z.number().default(12),
    }),
    handler: async ({ page, limit }) => {
      const whereClause = eq(post.published, true);

      const [totalResult, postsList] = await Promise.all([
        db.select({ value: count() }).from(post).where(whereClause),
        db
          .select({
            id: post.id,
            title: post.title,
            slug: post.slug,
            cover: post.cover,
            abstract: post.abstract,
            createdAt: post.createdAt,
            updatedAt: post.updatedAt,
          })
          .from(post)
          .where(whereClause)
          .orderBy(desc(post.updatedAt))
          .limit(limit)
          .offset((page - 1) * limit),
      ]);

      return {
        totalPosts: totalResult[0].value,
        posts: postsList,
      };
    },
  }),

  getPostBySlug: defineAction({
    accept: "json",
    input: z.object({
      slug: z.string(),
    }),
    handler: async ({ slug }) => {
      const row = await db
        .select()
        .from(post)
        .where(and(eq(post.slug, slug), eq(post.published, true)))
        .get();

      return { post: row ?? null };
    },
  }),
};
