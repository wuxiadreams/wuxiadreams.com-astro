import { eq, and } from "drizzle-orm";
import { db } from "@/lib/db";
import { userReadingProgress } from "@/db/schema";

export async function GET({
  locals,
  request,
}: {
  locals: App.Locals;
  request: Request;
}) {
  const userId = locals?.user?.id;
  const url = new URL(request.url);
  const novelId = url.searchParams.get("novelId");

  if (!novelId) {
    return new Response(JSON.stringify({ error: "Novel ID is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (!userId) {
    return new Response(JSON.stringify({ progress: null }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const entry = await db.query.userReadingProgress.findFirst({
      where: and(
        eq(userReadingProgress.userId, userId),
        eq(userReadingProgress.novelId, novelId),
      ),
    });

    if (!entry) {
      return new Response(JSON.stringify({ progress: null }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({
        progress: {
          novelId: entry.novelId,
          chapterId: entry.chapterId,
          chapterNumber: entry.chapterNumber,
          chapterTitle: entry.chapterTitle,
          updatedAt:
            entry.updatedAt instanceof Date
              ? entry.updatedAt.getTime()
              : Number(entry.updatedAt),
        },
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error("reading-history status", error);
    return new Response(JSON.stringify({ progress: null }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
