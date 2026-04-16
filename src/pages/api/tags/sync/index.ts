import { env } from "cloudflare:workers";
import { sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { tag } from "@/db/schema";

export async function POST({
  locals,
  request,
}: {
  locals: any;
  request: Request;
}) {
  const email = locals?.user?.email;
  const adminEmails = (env.ADMIN_EMAILS ?? "").split(",");

  if (!email || !adminEmails.includes(email || "")) {
    return new Response(JSON.stringify({ error: "Forbidden" }), {
      status: 403,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    // 更新 tag 表的 novelCount，只统计 published = true 的小说
    await db.update(tag).set({
      novelCount: sql`(
        SELECT COUNT(*) 
        FROM novel_tag 
        INNER JOIN novel ON novel_tag.novel_id = novel.id 
        WHERE novel_tag.tag_id = tag.id AND novel.published = true
      )`,
    });

    return new Response(
      JSON.stringify({
        success: true,
        message: "Tag novel counts synced successfully",
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error: any) {
    console.error("Error syncing tags:", error);
    return new Response(JSON.stringify({ error: "Failed to sync tags" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
