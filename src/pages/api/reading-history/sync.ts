import { eq, and } from "drizzle-orm";
import { db } from "@/lib/db";
import { userReadingProgress, novel } from "@/db/schema";

type SyncItem = {
  novelId: string;
  chapterId?: string | null;
  chapterNumber: number;
  chapterTitle: string;
  updatedAt: number;
};

function unauthorized() {
  return new Response(JSON.stringify({ error: "Unauthorized" }), {
    status: 401,
    headers: { "Content-Type": "application/json" },
  });
}

export async function POST({
  locals,
  request,
}: {
  locals: App.Locals;
  request: Request;
}) {
  const userId = locals?.user?.id;
  if (!userId) return unauthorized();

  try {
    const body = (await request.json()) as { items?: SyncItem[] };
    const items = Array.isArray(body.items) ? body.items : [];

    if (items.length === 0) {
      return new Response(JSON.stringify({ success: true, merged: 0 }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Cap batch size
    const batch = items.slice(0, 100);
    let merged = 0;

    for (const item of batch) {
      if (
        !item.novelId ||
        typeof item.chapterNumber !== "number" ||
        Number.isNaN(item.chapterNumber) ||
        !item.chapterTitle ||
        typeof item.updatedAt !== "number"
      ) {
        continue;
      }

      const novelExists = await db.query.novel.findFirst({
        where: eq(novel.id, item.novelId),
        columns: { id: true },
      });
      if (!novelExists) continue;

      const localUpdatedAt = new Date(item.updatedAt);
      const existing = await db.query.userReadingProgress.findFirst({
        where: and(
          eq(userReadingProgress.userId, userId),
          eq(userReadingProgress.novelId, item.novelId),
        ),
      });

      if (!existing) {
        await db.insert(userReadingProgress).values({
          userId,
          novelId: item.novelId,
          chapterId: item.chapterId ?? null,
          chapterNumber: item.chapterNumber,
          chapterTitle: item.chapterTitle,
          updatedAt: localUpdatedAt,
        });
        merged += 1;
        continue;
      }

      const cloudTime =
        existing.updatedAt instanceof Date
          ? existing.updatedAt.getTime()
          : Number(existing.updatedAt);

      // Keep the newer progress
      if (item.updatedAt >= cloudTime) {
        await db
          .update(userReadingProgress)
          .set({
            chapterId: item.chapterId ?? null,
            chapterNumber: item.chapterNumber,
            chapterTitle: item.chapterTitle,
            updatedAt: localUpdatedAt,
          })
          .where(
            and(
              eq(userReadingProgress.userId, userId),
              eq(userReadingProgress.novelId, item.novelId),
            ),
          );
        merged += 1;
      }
    }

    return new Response(JSON.stringify({ success: true, merged }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("reading-history sync", error);
    return new Response(JSON.stringify({ error: "Failed to sync progress" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
