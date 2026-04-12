import { eq, and } from "drizzle-orm";
import { db } from "@/lib/db";
import { userLibrary } from "@/db/schema";

export async function GET({
  locals,
  request,
}: {
  locals: any;
  request: Request;
}) {
  const userId = locals?.user?.id;

  if (!userId) {
    return new Response(JSON.stringify({ isInLibrary: false }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const url = new URL(request.url);
    const novelId = url.searchParams.get("novelId");

    if (!novelId) {
      return new Response(JSON.stringify({ error: "Novel ID is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const entry = await db.query.userLibrary.findFirst({
      where: and(
        eq(userLibrary.userId, userId),
        eq(userLibrary.novelId, novelId),
      ),
    });

    return new Response(JSON.stringify({ isInLibrary: !!entry }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ isInLibrary: false }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
