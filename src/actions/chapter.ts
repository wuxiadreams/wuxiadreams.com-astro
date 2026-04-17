import { defineAction } from "astro:actions";
import { z } from "zod";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { R2, R2_NOVELS_BUCKET } from "@/lib/r2";
import { db } from "@/lib/db";
import { chapter as chapterSchema, novel } from "@/db/schema";
import { eq, and, asc, desc, lt, gt, count } from "drizzle-orm";

export const chapter = {
  fetchChapterContent: defineAction({
    accept: "json",
    input: z.object({
      fileKey: z.string(),
    }),
    handler: async (input) => {
      const { fileKey } = input;

      if (!fileKey) {
        return { data: null, error: "File key is missing." };
      }

      try {
        const command = new GetObjectCommand({
          Bucket: R2_NOVELS_BUCKET,
          Key: fileKey,
        });

        const response = await R2.send(command);

        if (response.Body) {
          const chapterText = await response.Body.transformToString("utf-8");
          return { data: chapterText, error: null };
        } else {
          return {
            data: null,
            error: "R2 response was successful but file content body is empty.",
          };
        }
      } catch (e) {
        const errorMsg =
          e instanceof Error
            ? e.message
            : "An unknown error occurred during R2 content fetching.";

        return {
          data: null,
          error: `Failed to fetch chapter content from R2: ${errorMsg}`,
        };
      }
    },
  }),
  getNovelChapters: defineAction({
    accept: "json",
    input: z.object({
      novelId: z.string(),
      page: z.number().min(1).default(1),
      pageSize: z.number().min(1).max(500).default(100),
    }),
    handler: async (input) => {
      const { novelId, page, pageSize } = input;

      try {
        const chaptersData = await db
          .select({
            id: chapterSchema.id,
            title: chapterSchema.title,
            number: chapterSchema.number,
            wordCount: chapterSchema.wordCount,
            createdAt: chapterSchema.createdAt,
          })
          .from(chapterSchema)
          .where(
            and(
              eq(chapterSchema.novelId, novelId),
              eq(chapterSchema.published, true),
            ),
          )
          .orderBy(asc(chapterSchema.number))
          .limit(pageSize)
          .offset((page - 1) * pageSize);

        return { chapters: chaptersData, error: null };
      } catch (e) {
        const errorMsg = e instanceof Error ? e.message : "Unknown error";
        return { chapters: [], error: `Failed to fetch chapters: ${errorMsg}` };
      }
    },
  }),
  getChapterData: defineAction({
    accept: "json",
    input: z.object({
      slug: z.string(),
      chapterNumber: z.number(),
    }),
    handler: async (input) => {
      const { slug, chapterNumber } = input;

      // 1. 获取小说信息
      const novelData = await db
        .select({
          id: novel.id,
          title: novel.title,
          slug: novel.slug,
          totalChapters: novel.chapterCount,
        })
        .from(novel)
        .where(and(eq(novel.slug, slug), eq(novel.published, true)))
        .get();

      if (!novelData) {
        return { data: null, error: "Novel not found" };
      }

      // 2. 获取当前章节
      const currentChapter = await db
        .select()
        .from(chapterSchema)
        .where(
          and(
            eq(chapterSchema.novelId, novelData.id),
            eq(chapterSchema.number, chapterNumber),
            eq(chapterSchema.published, true),
          ),
        )
        .get();

      if (!currentChapter) {
        return { data: null, error: "Chapter not found", novelData };
      }

      // 3. 获取上一章和下一章 (用于导航) 以及总章节数
      const [prevChapter, nextChapter] = await Promise.all([
        db
          .select({ number: chapterSchema.number })
          .from(chapterSchema)
          .where(
            and(
              eq(chapterSchema.novelId, novelData.id),
              lt(chapterSchema.number, chapterNumber),
              eq(chapterSchema.published, true),
            ),
          )
          .orderBy(desc(chapterSchema.number))
          .limit(1)
          .get(),
        db
          .select({ number: chapterSchema.number })
          .from(chapterSchema)
          .where(
            and(
              eq(chapterSchema.novelId, novelData.id),
              gt(chapterSchema.number, chapterNumber),
              eq(chapterSchema.published, true),
            ),
          )
          .orderBy(asc(chapterSchema.number))
          .limit(1)
          .get(),
        db
          .select({ totalChapters: count() })
          .from(chapterSchema)
          .where(
            and(
              eq(chapterSchema.novelId, novelData.id),
              eq(chapterSchema.published, true),
            ),
          ),
      ]);

      return {
        data: {
          novelData,
          currentChapter,
          prevChapter,
          nextChapter,
          totalChapters: novelData.totalChapters,
        },
        error: null,
      };
    },
  }),
};
