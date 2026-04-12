import { env } from "cloudflare:workers";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { novel } from "@/db/schema";

export async function PUT({
  locals,
  request,
  params,
}: {
  locals: any;
  request: Request;
  params: { id: string };
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
    const novelId = params.id;
    if (!novelId) {
      return new Response(JSON.stringify({ error: "无效的小说 ID" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const body = (await request.json()) as Record<string, any>;

    // Support partial updates
    const updatedNovel = await db
      .update(novel)
      .set({
        ...body,
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
    return new Response(JSON.stringify({ error: "更新小说失败" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function DELETE({
  locals,
  params,
}: {
  locals: any;
  params: { id: string };
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
    const novelId = params.id;

    if (!novelId) {
      return new Response(JSON.stringify({ error: "无效的小说 ID" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const deletedNovel = await db
      .delete(novel)
      .where(eq(novel.id, novelId))
      .returning();

    if (deletedNovel.length === 0) {
      return new Response(JSON.stringify({ error: "小说不存在" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: "删除小说失败" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
