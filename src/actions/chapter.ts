import { defineAction } from "astro:actions";
import { z } from "zod";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { R2, R2_NOVELS_BUCKET } from "@/lib/r2";
import { db } from "@/lib/db";
import { chapter as chapterSchema } from "@/db/schema";
import { eq, and, asc } from "drizzle-orm";

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
};
