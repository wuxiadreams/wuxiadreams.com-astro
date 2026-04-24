import { env } from "cloudflare:workers";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { novel } from "@/db/schema";
import type { APIContext } from "astro";

export async function PUT(context: APIContext) {
  const { locals, request, params } = context;
  const email = locals?.user?.email;
  const adminEmails = (env.ADMIN_EMAILS ?? "").split(",");

  if (!email || !adminEmails.includes(email || "")) {
    return new Response(JSON.stringify({ error: "Forbidden" }), {
      status: 403,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const novelId = params.id;
    if (!novelId) {
      return new Response(JSON.stringify({ error: "无效的小说 ID" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const body = (await request.json()) as { published: boolean };

    if (body.published === undefined) {
      return new Response(JSON.stringify({ error: "缺少 published 字段" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const updatedNovel = await db
      .update(novel)
      .set({
        published: body.published,
        updatedAt: new Date(),
      })
      .where(eq(novel.id, novelId))
      .returning();

    if (updatedNovel.length === 0) {
      return new Response(JSON.stringify({ error: "小说不存在" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(updatedNovel[0]), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Failed to update novel publish status:", error);
    return new Response(
      JSON.stringify({ error: "更新发布状态失败: " + error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
