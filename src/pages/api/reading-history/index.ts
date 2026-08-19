import { eq, and, desc, count } from "drizzle-orm";
import { env } from "cloudflare:workers";
import { db } from "@/lib/db";
import { userReadingProgress, novel } from "@/db/schema";
import { formatImageUrl } from "@/lib/file";

type ProgressBody = {
  novelId?: string;
  chapterId?: string | null;
  chapterNumber?: number;
  chapterTitle?: string;
  updatedAt?: number;
};

function unauthorized() {
  return new Response(JSON.stringify({ error: "Unauthorized" }), {
    status: 401,
    headers: { "Content-Type": "application/json" },
  });
}

export async function GET({
  locals,
  request,
}: {
  locals: App.Locals;
  request: Request;
}) {
  const userId = locals?.user?.id;
  if (!userId) {
    return new Response(JSON.stringify({ items: [], total: 0 }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const url = new URL(request.url);
    const page = Math.max(1, parseInt(url.searchParams.get("page") || "1", 10));
    const limit = Math.min(
      50,
      Math.max(1, parseInt(url.searchParams.get("limit") || "20", 10)),
    );
    const offset = (page - 1) * limit;

    const [{ value: total }] = await db
      .select({ value: count() })
      .from(userReadingProgress)
      .where(eq(userReadingProgress.userId, userId));

    const rows = await db
      .select({
        novelId: userReadingProgress.novelId,
        chapterId: userReadingProgress.chapterId,
        chapterNumber: userReadingProgress.chapterNumber,
        chapterTitle: userReadingProgress.chapterTitle,
        updatedAt: userReadingProgress.updatedAt,
        slug: novel.slug,
        title: novel.title,
        cover: novel.cover,
        novelUpdatedAt: novel.updatedAt,
      })
      .from(userReadingProgress)
      .innerJoin(novel, eq(userReadingProgress.novelId, novel.id))
      .where(eq(userReadingProgress.userId, userId))
      .orderBy(desc(userReadingProgress.updatedAt))
      .limit(limit)
      .offset(offset);

    const r2Domain = env.R2_DOMAIN;
    const items = rows.map((row) => ({
      novelId: row.novelId,
      novelSlug: row.slug,
      novelTitle: row.title,
      cover: row.cover
        ? formatImageUrl(r2Domain, row.cover, row.novelUpdatedAt)
        : null,
      chapterId: row.chapterId,
      chapterNumber: row.chapterNumber,
      chapterTitle: row.chapterTitle,
      updatedAt:
        row.updatedAt instanceof Date
          ? row.updatedAt.getTime()
          : Number(row.updatedAt),
    }));

    return new Response(JSON.stringify({ items, total, page, limit }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("reading-history GET", error);
    return new Response(JSON.stringify({ error: "Failed to load history" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
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
    const body = (await request.json()) as ProgressBody;
    const { novelId, chapterId, chapterNumber, chapterTitle } = body;

    if (
      !novelId ||
      typeof chapterNumber !== "number" ||
      Number.isNaN(chapterNumber) ||
      !chapterTitle
    ) {
      return new Response(JSON.stringify({ error: "Invalid payload" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const updatedAt = body.updatedAt
      ? new Date(body.updatedAt)
      : new Date();

    const existing = await db.query.userReadingProgress.findFirst({
      where: and(
        eq(userReadingProgress.userId, userId),
        eq(userReadingProgress.novelId, novelId),
      ),
    });

    if (existing) {
      await db
        .update(userReadingProgress)
        .set({
          chapterId: chapterId ?? null,
          chapterNumber,
          chapterTitle,
          updatedAt,
        })
        .where(
          and(
            eq(userReadingProgress.userId, userId),
            eq(userReadingProgress.novelId, novelId),
          ),
        );
    } else {
      await db.insert(userReadingProgress).values({
        userId,
        novelId,
        chapterId: chapterId ?? null,
        chapterNumber,
        chapterTitle,
        updatedAt,
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("reading-history POST", error);
    return new Response(JSON.stringify({ error: "Failed to save progress" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function DELETE({
  locals,
  request,
}: {
  locals: App.Locals;
  request: Request;
}) {
  const userId = locals?.user?.id;
  if (!userId) return unauthorized();

  try {
    const url = new URL(request.url);
    const novelId = url.searchParams.get("novelId");
    const clearAll = url.searchParams.get("all") === "1";

    if (clearAll) {
      await db
        .delete(userReadingProgress)
        .where(eq(userReadingProgress.userId, userId));
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (!novelId) {
      return new Response(JSON.stringify({ error: "novelId required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    await db
      .delete(userReadingProgress)
      .where(
        and(
          eq(userReadingProgress.userId, userId),
          eq(userReadingProgress.novelId, novelId),
        ),
      );

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("reading-history DELETE", error);
    return new Response(JSON.stringify({ error: "Failed to delete" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
