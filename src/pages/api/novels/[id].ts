import { env } from "cloudflare:workers";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { novel, novelAuthor, novelTag, novelCategory } from "@/db/schema";
import { copySingleFile } from "@/lib/r2";
import { actions } from "astro:actions";

export async function PUT(context) {
  const { locals, request, params, cache } = context;
  const email = locals?.user?.email;
  const adminEmails = (env.ADMIN_EMAILS ?? "").split(",");

  if (!email || !adminEmails.includes(email || "")) {
    return new Response(JSON.stringify({ error: "Forbidden" }), {
      status: 403,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const novelId = params.id;
    if (!novelId) {
      return new Response(JSON.stringify({ error: "无效的小说 ID" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const body = (await request.json()) as Record<string, any>;
    const {
      authorId,
      tags,
      categories,
      id,
      createdAt,
      updatedAt,
      publishedAt,
      chapterCount,
      viewCount,
      bookmarkCount,
      reviewCount,
      score,
      ...novelUpdateData
    } = body;

    // Support partial updates
    const updatedNovel = await db
      .update(novel)
      .set({
        ...novelUpdateData,
        reviewCount:
          reviewCount !== undefined ? Number(reviewCount) : undefined,
        score: score !== undefined ? Number(score) : undefined,
        updatedAt: new Date(),
      })
      .where(eq(novel.id, novelId))
      .returning();

    if (updatedNovel.length === 0) {
      return new Response(JSON.stringify({ error: "小说不存在" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // 清除缓存
    await cache.invalidate({ tags: ["novel", updatedNovel[0].id] });

    // Handle authorId update
    if (authorId !== undefined) {
      if (authorId) {
        // Check if mapping exists
        const existingMapping = await db.query.novelAuthor.findFirst({
          where: eq(novelAuthor.novelId, novelId),
        });

        if (existingMapping) {
          await db
            .update(novelAuthor)
            .set({ authorId: authorId })
            .where(eq(novelAuthor.novelId, novelId));
        } else {
          await db.insert(novelAuthor).values({
            novelId: novelId,
            authorId: authorId,
            createdAt: new Date(),
          });
        }
      } else {
        // if authorId is explicitly empty, remove mapping
        await db.delete(novelAuthor).where(eq(novelAuthor.novelId, novelId));
      }
    }

    // Handle tags update
    if (tags !== undefined) {
      await db.delete(novelTag).where(eq(novelTag.novelId, novelId));
      if (Array.isArray(tags) && tags.length > 0) {
        const tagValues = tags.map((tagId) => ({
          novelId,
          tagId: Number(tagId),
          createdAt: new Date(),
        }));
        await db.insert(novelTag).values(tagValues);
      }
    }

    // Handle categories update
    if (categories !== undefined) {
      await db.delete(novelCategory).where(eq(novelCategory.novelId, novelId));
      if (Array.isArray(categories) && categories.length > 0) {
        const categoryValues = categories.map((categoryId) => ({
          novelId,
          categoryId: Number(categoryId),
          createdAt: new Date(),
        }));
        await db.insert(novelCategory).values(categoryValues);
      }
    }

    // Handle cover image relocation if uploaded a new temp image
    let finalCover = updatedNovel[0].cover;
    if (novelUpdateData.cover && novelUpdateData.cover.startsWith("temp/")) {
      const fileExtension = novelUpdateData.cover.split(".").pop();
      const sourceKey = novelUpdateData.cover;
      const destinationKey = `covers/${novelId}/cover.${fileExtension}`;

      const { error } = await copySingleFile({
        bucket: env.R2_ASSETS_BUCKET!,
        source: `${env.R2_ASSETS_BUCKET}/${sourceKey}`,
        destination: destinationKey,
        contentType: `image/${fileExtension}`,
        cacheControl: "public, max-age=31536000, immutable",
      });

      if (!error) {
        finalCover = destinationKey;
        // Update novel record with new cover path
        await db
          .update(novel)
          .set({ cover: finalCover })
          .where(eq(novel.id, novelId));
      } else {
        console.error("Failed to copy cover image:", error);
      }
    }

    return new Response(
      JSON.stringify({ ...updatedNovel[0], cover: finalCover }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error: any) {
    console.error("Failed to update novel:", error);
    return new Response(
      JSON.stringify({ error: "更新小说失败: " + error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}

export async function DELETE(context) {
  const { locals, params, cache } = context;
  const email = locals?.user?.email;
  const adminEmails = (env.ADMIN_EMAILS ?? "").split(",");

  if (!email || !adminEmails.includes(email || "")) {
    return new Response(JSON.stringify({ error: "Forbidden" }), {
      status: 403,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const novelId = params.id;

    if (!novelId) {
      return new Response(JSON.stringify({ error: "无效的小说 ID" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const deletedNovel = await db
      .delete(novel)
      .where(eq(novel.id, novelId))
      .returning();

    if (deletedNovel.length === 0) {
      return new Response(JSON.stringify({ error: "小说不存在" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // 清除缓存
    await cache.invalidate({ tags: ["novel", deletedNovel[0].id] });

    try {
      if (deletedNovel[0].cover) {
        await context.callAction(actions.cover.delete, deletedNovel[0].cover);
      }
      await context.callAction(actions.chapterManagement.deleteChapterFiles, {
        novelId,
      });
    } catch (e) {
      console.error("删除关联文件失败:", e);
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: "删除小说失败: " + error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
