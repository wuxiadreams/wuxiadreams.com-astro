import { env } from "cloudflare:workers";
import { sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { author } from "@/db/schema";

export async function POST(context) {
  const { locals, cache } = context;
  const email = locals?.user?.email;
  const adminEmails = (env.ADMIN_EMAILS ?? "").split(",");

  if (!email || !adminEmails.includes(email || "")) {
    return new Response(JSON.stringify({ error: "Forbidden" }), {
      status: 403,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    // 更新 author 表的 novelCount，只统计 published = true 的小说
    await db.update(author).set({
      novelCount: sql`(
        SELECT COUNT(*) 
        FROM novel_author 
        INNER JOIN novel ON novel_author.novel_id = novel.id 
        WHERE novel_author.author_id = author.id AND novel.published = true
      )`,
    });

    return new Response(
      JSON.stringify({
        success: true,
        message: "Author novel counts synced successfully",
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error: any) {
    console.error("Error syncing authors:", error);
    return new Response(JSON.stringify({ error: "Failed to sync authors" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
