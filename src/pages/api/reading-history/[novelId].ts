import { eq, and } from "drizzle-orm";
import { db } from "@/lib/db";
import { userReadingProgress } from "@/db/schema";

export async function DELETE({
  locals,
  params,
}: {
  locals: App.Locals;
  params: { novelId: string };
}) {
  const userId = locals?.user?.id;

  if (!userId) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const novelId = params.novelId;
    if (!novelId) {
      return new Response(JSON.stringify({ error: "Novel ID is required" }), {
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
    console.error("reading-history DELETE by id", error);
    return new Response(JSON.stringify({ error: "Failed to remove" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
