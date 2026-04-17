import { defineAction } from "astro:actions";
import { z } from "zod";
import { env } from "cloudflare:workers";
import { nanoid } from "@/lib/nanoid";
import {
  R2,
  getSignedUrl,
  uploadSingleFile,
  copySingleFile,
  deleteSingleFile,
  R2_NOVELS_BUCKET,
} from "@/lib/r2";
import {
  PutObjectCommand,
  ListObjectsV2Command,
  DeleteObjectsCommand,
  type ObjectIdentifier,
  type _Object,
} from "@aws-sdk/client-s3";
import { db } from "@/lib/db";
import { chapter as chapterSchema, novel } from "@/db/schema";
import { eq, and, asc, desc, count } from "drizzle-orm";

// Helper for admin verification
async function getAuthenticatedAdmin(locals: App.Locals) {
  const { user } = locals;
  const email = user?.email;
  const adminEmails = (env.ADMIN_EMAILS ?? "").split(",");

  if (!email || !adminEmails.includes(email || "")) {
    throw new Error("Unauthorized");
  }

  return user;
}

export const chapterManagement = {
  // 上传单独章节文件
  uploadChapterFile: defineAction({
    accept: "form",
    input: z.object({
      file: z.instanceof(File),
    }),
    handler: async ({ file }, { locals }) => {
      await getAuthenticatedAdmin(locals);

      const uuid = nanoid();
      const tempFileKey = `temp/${uuid}.txt`;

      const { error } = await uploadSingleFile({
        file,
        fileKey: tempFileKey,
        fileType: "text/plain",
        bucket: R2_NOVELS_BUCKET,
        cacheControl: "public, max-age=31536000, immutable",
      });

      if (error) {
        console.error(error);
        throw new Error("Failed to upload file to R2");
      }

      return { fileKey: tempFileKey };
    },
  }),

  // 复制临时章节文件到小说目录
  copyChapterFile: defineAction({
    accept: "json",
    input: z.object({
      bucket: z.string(),
      source: z.string(),
      destination: z.string(),
      contentType: z.string(),
      cacheControl: z.string().optional(),
    }),
    handler: async (input, { locals }) => {
      await getAuthenticatedAdmin(locals);

      const { error } = await copySingleFile(input);

      if (error) {
        throw new Error("Failed to copy chapter from temp");
      }

      return { success: true };
    },
  }),

  // 删除章节文件
  deleteChapterFile: defineAction({
    accept: "json",
    input: z.object({
      fileKey: z.string(),
    }),
    handler: async ({ fileKey }, { locals }) => {
      await getAuthenticatedAdmin(locals);

      const { error } = await deleteSingleFile(fileKey, R2_NOVELS_BUCKET);

      if (error) {
        throw new Error("Failed to delete R2 file");
      }

      return { success: true };
    },
  }),

  // 生成章节上传的预签名 URL
  generateChapterUploadUrls: defineAction({
    accept: "json",
    input: z.object({
      novelId: z.string(),
      chapterDetails: z.array(
        z.object({
          filename: z.string(),
          contentType: z.string(),
        }),
      ),
    }),
    handler: async ({ novelId, chapterDetails }, { locals }) => {
      await getAuthenticatedAdmin(locals);

      try {
        const urlPromises = chapterDetails.map((detail) => {
          const uniqueKey = `${novelId}/${detail.filename}`;

          const command = new PutObjectCommand({
            Bucket: R2_NOVELS_BUCKET,
            Key: uniqueKey,
            ContentType: "text/plain",
          });

          return getSignedUrl(R2, command, { expiresIn: 12000 }).then(
            (presignedUrl) => ({
              presignedUrl,
              file_key: uniqueKey,
              filename: detail.filename,
            }),
          );
        });

        const urls = await Promise.all(urlPromises);
        return { urls };
      } catch (error) {
        console.error(error);
        throw new Error("Failed to generate presigned URLs");
      }
    },
  }),

  // 保存章节元数据到数据库 (批量插入)
  saveChapterMetadata: defineAction({
    accept: "json",
    input: z.object({
      novelId: z.string(),
      chaptersData: z.array(
        z.object({
          id: z.string().optional(),
          novelId: z.string(),
          number: z.number(),
          title: z.string(),
          wordCount: z.number().default(0),
          fileKey: z.string(),
          published: z.boolean().default(false),
          publishedAt: z.union([z.date(), z.string(), z.number()]).optional(),
        }),
      ),
    }),
    handler: async ({ novelId, chaptersData }, { locals }) => {
      await getAuthenticatedAdmin(locals);

      const mappedData = chaptersData.map((c) => ({
        ...c,
        publishedAt: c.publishedAt ? new Date(c.publishedAt) : new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      }));

      const BATCH_SIZE = 5;
      const allStatements = [];

      for (let i = 0; i < mappedData.length; i += BATCH_SIZE) {
        const batch = mappedData.slice(i, i + BATCH_SIZE);
        allStatements.push(
          db.insert(chapterSchema).values(batch).onConflictDoNothing(),
        );
      }

      if (allStatements.length > 0) {
        try {
          await db.batch(allStatements as any);
        } catch (e) {
          const errorMsg = e instanceof Error ? e.message : String(e);
          throw new Error(`Database transaction failed: ${errorMsg}`);
        }
      }
    },
  }),

  // 递归删除 R2 存储桶中指定前缀下的所有对象
  deleteChapterFiles: defineAction({
    accept: "json",
    input: z.object({
      novelId: z.string(),
    }),
    handler: async ({ novelId }, { locals }) => {
      await getAuthenticatedAdmin(locals);

      let deletedCount = 0;
      let continuationToken: string | undefined = undefined;
      const finalPrefix = `${novelId}/`;

      try {
        do {
          const listCommand: ListObjectsV2Command = new ListObjectsV2Command({
            Bucket: R2_NOVELS_BUCKET,
            Prefix: finalPrefix,
            ContinuationToken: continuationToken,
          });

          const listResponse = await R2.send(listCommand);
          const objects = listResponse.Contents;

          if (!objects || objects.length === 0) {
            break;
          }

          const deleteKeys: ObjectIdentifier[] = objects
            .map((obj: _Object) => ({ Key: obj.Key }))
            .filter((key): key is ObjectIdentifier => !!key.Key);

          if (deleteKeys.length === 0) {
            break;
          }

          const deleteCommand = new DeleteObjectsCommand({
            Bucket: R2_NOVELS_BUCKET,
            Delete: {
              Objects: deleteKeys,
              Quiet: true,
            },
          });

          const deleteResponse = await R2.send(deleteCommand);

          if (deleteResponse.Errors && deleteResponse.Errors.length > 0) {
            console.error(
              "Batch deletion encountered errors:",
              deleteResponse.Errors,
            );
            throw new Error(
              `Failed to delete some objects. First error: ${deleteResponse.Errors[0].Key} - ${deleteResponse.Errors[0].Code}`,
            );
          }

          deletedCount += deleteKeys.length;
          continuationToken = listResponse.NextContinuationToken;
        } while (continuationToken);

        return { success: true, deletedCount };
      } catch (e) {
        const error =
          e instanceof Error
            ? e.message
            : "An unknown error occurred during R2 deletion.";
        console.error(`R2 Deletion failed for prefix ${finalPrefix}:`, error);
        throw new Error(error);
      }
    },
  }),
  getNovelChapters: defineAction({
    accept: "json",
    input: z.object({
      novelId: z.string(),
      page: z.number().min(1).default(1),
      pageSize: z.number().min(1).max(500).default(10),
    }),
    handler: async (input, { locals }) => {
      await getAuthenticatedAdmin(locals);

      const { novelId, page, pageSize } = input;

      try {
        const [chaptersData, totalCount] = await Promise.all([
          db
            .select()
            .from(chapterSchema)
            .where(eq(chapterSchema.novelId, novelId))
            .orderBy(asc(chapterSchema.number))
            .limit(pageSize)
            .offset((page - 1) * pageSize),
          db
            .select({ count: count() })
            .from(chapterSchema)
            .where(eq(chapterSchema.novelId, novelId))
            .get(),
        ]);

        return {
          chapters: chaptersData,
          totalCount: totalCount?.count || 0,
          error: null,
        };
      } catch (e) {
        const errorMsg = e instanceof Error ? e.message : "Unknown error";
        return {
          chapters: [],
          totalCount: 0,
          error: `Failed to fetch chapters: ${errorMsg}`,
        };
      }
    },
  }),
  updateChapterStatus: defineAction({
    accept: "json",
    input: z.object({
      chapterId: z.string(),
      published: z.boolean(),
    }),
    handler: async ({ chapterId, published }, { locals }) => {
      await getAuthenticatedAdmin(locals);

      await db
        .update(chapterSchema)
        .set({ published, updatedAt: new Date() })
        .where(eq(chapterSchema.id, chapterId));

      return { success: true };
    },
  }),
  deleteChapter: defineAction({
    accept: "json",
    input: z.object({
      chapterId: z.string(),
    }),
    handler: async ({ chapterId }, { locals }) => {
      await getAuthenticatedAdmin(locals);

      const targetChapter = await db
        .select()
        .from(chapterSchema)
        .where(eq(chapterSchema.id, chapterId))
        .get();

      if (!targetChapter) {
        throw new Error("章节不存在");
      }

      if (targetChapter.fileKey) {
        await deleteSingleFile(targetChapter.fileKey, R2_NOVELS_BUCKET);
      }

      await db.delete(chapterSchema).where(eq(chapterSchema.id, chapterId));

      return { success: true };
    },
  }),
  checkChapterExists: defineAction({
    accept: "json",
    input: z.object({
      novelId: z.string(),
      number: z.number(),
    }),
    handler: async ({ novelId, number }, { locals }) => {
      await getAuthenticatedAdmin(locals);

      const existingChapter = await db
        .select({ id: chapterSchema.id })
        .from(chapterSchema)
        .where(
          and(
            eq(chapterSchema.novelId, novelId),
            eq(chapterSchema.number, number),
          ),
        )
        .get();

      return { exists: !!existingChapter };
    },
  }),
};
