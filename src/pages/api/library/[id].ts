import { eq, and } from "drizzle-orm";
import { db } from "@/lib/db";
import { userLibrary } from "@/db/schema";

export async function DELETE({
  locals,
  params,
}: {
  locals: any;
  params: { id: string };
}) {
  const userId = locals?.user?.id;

  if (!userId) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const novelId = params.id;

    if (!novelId) {
      return new Response(JSON.stringify({ error: "Novel ID is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Remove from library
    const deleted = await db
      .delete(userLibrary)
      .where(
        and(
          eq(userLibrary.userId, userId),
          eq(userLibrary.novelId, novelId),
        )
      )
      .returning();

    if (deleted.length === 0) {
      return new Response(JSON.stringify({ error: "Novel not found in library" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to remove from library" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
