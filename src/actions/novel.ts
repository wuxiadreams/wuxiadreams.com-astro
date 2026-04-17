import { defineAction } from "astro:actions";
import { z } from "zod";
import { db } from "@/lib/db";
import {
  novel,
  novelAuthor,
  author,
  novelCategory,
  category,
  novelTag,
  tag,
  chapter,
  dailyStat,
} from "@/db/schema";
import { eq, asc, and, desc, sql } from "drizzle-orm";

export const novelActions = {
  getNovelInfo: defineAction({
    accept: "json",
    input: z.object({
      slug: z.string(),
      currentPage: z.number().default(1),
      sortOrder: z.enum(["asc", "desc"]).default("asc"),
      pageSize: z.number().default(100),
      incrementView: z.boolean().default(false),
    }),
    handler: async (input) => {
      const { slug, currentPage, sortOrder, pageSize, incrementView } = input;

      // 1. 获取小说基本信息
      const novelData = await db
        .select()
        .from(novel)
        .where(and(eq(novel.slug, slug), eq(novel.published, true)))
        .get();

      if (!novelData) {
        return { novelData: null };
      }

      if (incrementView) {
        const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

        // 增加小说总阅读量
        await db
          .update(novel)
          .set({ viewCount: sql`${novel.viewCount} + 1` })
          .where(eq(novel.id, novelData.id));

        // 增加每日阅读统计
        const stat = await db
          .select()
          .from(dailyStat)
          .where(
            and(eq(dailyStat.novelId, novelData.id), eq(dailyStat.date, today)),
          )
          .get();

        if (stat) {
          await db
            .update(dailyStat)
            .set({ viewCount: sql`${dailyStat.viewCount} + 1` })
            .where(
              and(
                eq(dailyStat.novelId, novelData.id),
                eq(dailyStat.date, today),
              ),
            );
        } else {
          await db
            .insert(dailyStat)
            .values({ novelId: novelData.id, date: today, viewCount: 1 });
        }

        // 同步本地数据以在页面上显示更新后的值
        novelData.viewCount += 1;
      }

      // 2. 并行获取关联数据 (作者, 分类, 标签, 章节数据, 第一章数据)
      const [
        authorsData,
        categoriesData,
        tagsData,
        chaptersData,
        [firstChapterData],
      ] = await Promise.all([
        // 获取作者
        db
          .select({
            id: author.id,
            name: author.name,
            nameAlt: author.nameAlt,
            slug: author.slug,
          })
          .from(novelAuthor)
          .innerJoin(author, eq(novelAuthor.authorId, author.id))
          .where(eq(novelAuthor.novelId, novelData.id)),

        // 获取分类
        db
          .select({
            id: category.id,
            name: category.name,
            slug: category.slug,
          })
          .from(novelCategory)
          .innerJoin(category, eq(novelCategory.categoryId, category.id))
          .where(eq(novelCategory.novelId, novelData.id)),

        // 获取标签
        db
          .select({
            id: tag.id,
            name: tag.name,
            slug: tag.slug,
          })
          .from(novelTag)
          .innerJoin(tag, eq(novelTag.tagId, tag.id))
          .where(eq(novelTag.novelId, novelData.id)),

        // 获取章节数据
        db
          .select({
            id: chapter.id,
            title: chapter.title,
            number: chapter.number,
            wordCount: chapter.wordCount,
            createdAt: chapter.createdAt,
          })
          .from(chapter)
          .where(
            and(eq(chapter.novelId, novelData.id), eq(chapter.published, true)),
          )
          .orderBy(
            sortOrder === "desc" ? desc(chapter.number) : asc(chapter.number),
          )
          .limit(pageSize)
          .offset((currentPage - 1) * pageSize),

        // 获取第一章数据 (仅查一个字段，用于“开始阅读”按钮)
        db
          .select({ number: chapter.number })
          .from(chapter)
          .where(
            and(eq(chapter.novelId, novelData.id), eq(chapter.published, true)),
          )
          .orderBy(asc(chapter.number))
          .limit(1),
      ]);

      const totalChapters = novelData.chapterCount;

      // 3. 获取作者相关的其他小说 (最多6本)
      let authorOtherNovels: any[] = [];
      if (authorsData.length > 0) {
        authorOtherNovels = await db
          .select({
            slug: novel.slug,
            title: novel.title,
            cover: novel.cover,
            score: novel.score,
            status: novel.status,
            chapterCount: novel.chapterCount,
          })
          .from(novel)
          .innerJoin(novelAuthor, eq(novel.id, novelAuthor.novelId))
          .where(
            and(
              eq(novel.published, true),
              eq(novelAuthor.authorId, authorsData[0].id),
            ),
          )
          .orderBy(desc(novel.viewCount))
          .limit(7);

        // Filter out the current novel
        authorOtherNovels = authorOtherNovels
          .filter((n) => n.slug !== novelData.slug)
          .slice(0, 6);
      }

      return {
        novelData,
        authorsData,
        categoriesData,
        tagsData,
        chaptersData,
        totalChapters,
        firstChapterData,
        authorOtherNovels,
      };
    },
  }),
};
