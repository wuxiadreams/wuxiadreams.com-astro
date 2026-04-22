import { defineAction } from "astro:actions";
import { z } from "zod";
import { db } from "@/lib/db";
import { tag, novelTag, novel } from "@/db/schema";
import { eq, and, desc } from "drizzle-orm";

export const tagActions = {
  getAllTags: defineAction({
    accept: "json",
    handler: async () => {
      // Fetch all tags and use pre-calculated novelCount
      const allTags = await db
        .select({
          id: tag.id,
          name: tag.name,
          slug: tag.slug,
          novelCount: tag.novelCount,
        })
        .from(tag)
        .orderBy(tag.name);

      // Group tags by first letter
      const tagsByLetter = allTags.reduce(
        (acc, t) => {
          const letter = t.name.charAt(0).toUpperCase();
          const validLetter = /[A-Z]/.test(letter) ? letter : "#";
          if (!acc[validLetter]) acc[validLetter] = [];
          acc[validLetter].push(t);
          return acc;
        },
        {} as Record<string, typeof allTags>,
      );

      const sortedLetters = Object.keys(tagsByLetter).sort((a, b) => {
        if (a === "#") return 1;
        if (b === "#") return -1;
        return a.localeCompare(b);
      });

      return {
        tagsByLetter,
        sortedLetters,
      };
    },
  }),

  getTagNovels: defineAction({
    accept: "json",
    input: z.object({
      slug: z.string(),
      page: z.number().default(1),
      pageSize: z.number().default(20),
    }),
    handler: async ({ slug, page, pageSize }) => {
      // 1. 获取标签基本信息
      const tagData = await db
        .select()
        .from(tag)
        .where(eq(tag.slug, slug))
        .get();

      if (!tagData) {
        return { tagData: null, tagNovels: [], totalPages: 0 };
      }

      // 2. 使用预先计算好的小说数量
      const total = tagData.novelCount;
      const totalPages = Math.ceil(total / pageSize);

      // 3. 获取当前页的已发布小说
      const tagNovels = await db
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
        .from(novelTag)
        .innerJoin(novel, eq(novelTag.novelId, novel.id))
        .where(and(eq(novelTag.tagId, tagData.id), eq(novel.published, true)))
        .orderBy(desc(novel.viewCount))
        .limit(pageSize)
        .offset((page - 1) * pageSize);

      return {
        tagData,
        tagNovels,
        totalPages,
      };
    },
  }),
};
