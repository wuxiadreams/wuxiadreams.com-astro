import { defineAction } from "astro:actions";
import { eq, and, desc, sql } from "drizzle-orm";
import { fetchRankingData } from "@/lib/rankings";
import { RANK_TYPE } from "@/lib/constants";
import { db } from "@/lib/db";
import { novel, category, tag, chapter as chapterSchema } from "@/db/schema";
import { chapter } from "./chapter";
import { cover } from "./cover";
import { novelActions } from "./novel";
import { chapterManagement } from "./chapter-management";
import { tagActions } from "./tag";
import { genreActions } from "./genre";
import { authorActions } from "./author";

export const server = {
  chapter,
  cover,
  novel: novelActions,
  chapterManagement,
  tag: tagActions,
  genre: genreActions,
  author: authorActions,
  getHomeData: defineAction({
    accept: "json",
    handler: async () => {
      const [
        weeklyPicks,
        latestUpdatedNovels,
        editorsPicks,
        popularTags,
        trendingCategories,
      ] = await Promise.all([
        fetchRankingData(db, RANK_TYPE.WEEKLY, 3),
        db.query.novel.findMany({
          where: and(eq(novel.published, true), sql`${novel.chapterCount} > 0`),
          orderBy: [desc(novel.updatedAt)],
          limit: 5,
          with: {
            novelAuthors: {
              with: {
                author: true,
              },
            },
            chapters: {
              where: eq(chapterSchema.published, true),
              orderBy: [desc(chapterSchema.number)],
              limit: 1,
            },
          },
        }),
        db.query.novel.findMany({
          where: and(eq(novel.published, true), eq(novel.isPinned, true)),
          orderBy: [desc(novel.createdAt)],
          limit: 10,
          with: {
            novelAuthors: {
              with: { author: true },
            },
            novelTags: {
              with: { tag: true },
            },
          },
        }),
        db
          .select({
            id: tag.id,
            name: tag.name,
            slug: tag.slug,
            count: tag.novelCount,
          })
          .from(tag)
          .orderBy(desc(tag.novelCount))
          .limit(20),
        db.query.category.findMany({
          where: eq(category.isPinned, true),
          limit: 4,
        }),
      ]);

      return {
        weeklyPicks,
        latestUpdatedNovels,
        editorsPicks,
        popularTags,
        trendingCategories,
      };
    },
  }),
};
