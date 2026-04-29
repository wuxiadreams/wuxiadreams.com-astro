import { defineAction } from "astro:actions";
import { z } from "zod";
import { db } from "@/lib/db";
import { author, novelAuthor, novel } from "@/db/schema";
import { eq, and, desc } from "drizzle-orm";

export const authorActions = {
  getAllAuthors: defineAction({
    accept: "json",
    handler: async () => {
      // Fetch all authors and use pre-calculated novelCount
      const allAuthors = await db
        .select({
          id: author.id,
          name: author.name,
          slug: author.slug,
          country: author.country,
          novelCount: author.novelCount,
        })
        .from(author)
        .orderBy(author.name);

      // Group authors by first letter
      const authorsByLetter = allAuthors.reduce(
        (acc, a) => {
          const letter = a.name.charAt(0).toUpperCase();
          const validLetter = /[A-Z]/.test(letter) ? letter : "#";
          if (!acc[validLetter]) acc[validLetter] = [];
          acc[validLetter].push(a);
          return acc;
        },
        {} as Record<string, typeof allAuthors>,
      );

      const sortedLetters = Object.keys(authorsByLetter).sort((a, b) => {
        if (a === "#") return 1;
        if (b === "#") return -1;
        return a.localeCompare(b);
      });

      return {
        authorsByLetter,
        sortedLetters,
      };
    },
  }),

  getAuthorNovels: defineAction({
    accept: "json",
    input: z.object({
      slug: z.string(),
    }),
    handler: async ({ slug }) => {
      // 1. 获取作者基本信息
      const authorData = await db
        .select()
        .from(author)
        .where(eq(author.slug, slug))
        .get();

      if (!authorData) {
        return { authorData: null, authorNovels: [] };
      }

      // 2. 获取该作者写的所有已发布小说
      const authorNovels = await db
        .select({
          id: novel.id,
          title: novel.title,
          slug: novel.slug,
          cover: novel.cover,
          status: novel.status,
          score: novel.score,
          viewCount: novel.viewCount,
          chapterCount: novel.chapterCount,
          updatedAt: novel.updatedAt,
        })
        .from(novelAuthor)
        .innerJoin(novel, eq(novelAuthor.novelId, novel.id))
        .where(
          and(
            eq(novelAuthor.authorId, authorData.id),
            eq(novel.published, true),
          ),
        )
        .orderBy(desc(novel.viewCount));

      return {
        authorData,
        authorNovels,
      };
    },
  }),
};
