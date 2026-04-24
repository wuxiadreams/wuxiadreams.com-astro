import { env } from "cloudflare:workers";
import { sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { novel } from "@/db/schema";

export async function POST(context) {
  const { locals } = context;
  const email = locals?.user?.email;
  const adminEmails = (env.ADMIN_EMAILS ?? "").split(",");

  if (!email || !adminEmails.includes(email || "")) {
    return new Response(JSON.stringify({ error: "Forbidden" }), {
      status: 403,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    // 更新 novel 表的 chapterCount，只统计 published = true 的章节
    await db.update(novel).set({
      chapterCount: sql`(
        SELECT COUNT(*) 
        FROM chapter 
        WHERE chapter.novel_id = novel.id AND chapter.published = true
      )`,
    });

    return new Response(
      JSON.stringify({
        success: true,
        message: "Novel chapter counts synced successfully",
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error: any) {
    console.error("Error syncing novel chapters:", error);
    return new Response(
      JSON.stringify({ error: "Failed to sync novel chapters" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
