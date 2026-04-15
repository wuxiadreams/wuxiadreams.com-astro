import { eq, and, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { userLibrary, novel } from "@/db/schema";

export async function POST({
  locals,
  request,
}: {
  locals: any;
  request: Request;
}) {
  const userId = locals?.user?.id;

  if (!userId) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const { novelId } = (await request.json()) as { novelId: string };

    if (!novelId) {
      return new Response(JSON.stringify({ error: "Novel ID is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Check if already in library
    const existingEntry = await db.query.userLibrary.findFirst({
      where: and(
        eq(userLibrary.userId, userId),
        eq(userLibrary.novelId, novelId),
      ),
    });

    if (existingEntry) {
      return new Response(JSON.stringify({ error: "Already in library" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Add to library
    await db.insert(userLibrary).values({
      userId,
      novelId,
      createdAt: new Date(),
    });

    // Increment bookmark_count for the novel
    await db
      .update(novel)
      .set({ bookmarkCount: sql`${novel.bookmarkCount} + 1` })
      .where(eq(novel.id, novelId));

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to add to library" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
