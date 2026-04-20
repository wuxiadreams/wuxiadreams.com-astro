import { env } from "cloudflare:workers";
import { eq, or, ne, and } from "drizzle-orm";
import { db } from "@/lib/db";
import { tag } from "@/db/schema";

export async function PUT(context) {
  const { locals, request, params, cache } = context;
  const email = locals?.user?.email;
  const adminEmails = (env.ADMIN_EMAILS ?? "").split(",");

  if (!email || !adminEmails.includes(email || "")) {
    return new Response(JSON.stringify({ error: "Forbidden" }), {
      status: 403,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const body = (await request.json()) as { name: string; slug: string };
    const { name, slug } = body;
    const tagId = Number(params.id);

    if (isNaN(tagId)) {
      return new Response(JSON.stringify({ error: "无效的标签 ID" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (!name || !slug) {
      return new Response(JSON.stringify({ error: "名称和 Slug 是必填项" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Explicitly check for existing tag excluding current one
    const existingTag = await db.query.tag.findFirst({
      where: and(ne(tag.id, tagId), or(eq(tag.name, name), eq(tag.slug, slug))),
    });

    if (existingTag) {
      return new Response(JSON.stringify({ error: "标签名称或 Slug 已存在" }), {
        status: 409,
        headers: { "Content-Type": "application/json" },
      });
    }

    const updatedTag = await db
      .update(tag)
      .set({
        name,
        slug,
        updatedAt: new Date(),
      })
      .where(eq(tag.id, tagId))
      .returning();

    if (updatedTag.length === 0) {
      return new Response(JSON.stringify({ error: "标签不存在" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // 清除缓存
    await cache.invalidate({ tags: ["tags"] });
    await cache.invalidate({ tags: ["tag", updatedTag[0].id] });

    return new Response(JSON.stringify(updatedTag[0]), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: "更新标签失败" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function DELETE(context) {
  const { locals, params, cache } = context;
  const email = locals?.user?.email;
  const adminEmails = (env.ADMIN_EMAILS ?? "").split(",");

  if (!email || !adminEmails.includes(email || "")) {
    return new Response(JSON.stringify({ error: "Forbidden" }), {
      status: 403,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const tagId = Number(params.id);

    if (isNaN(tagId)) {
      return new Response(JSON.stringify({ error: "无效的标签 ID" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const deletedTag = await db
      .delete(tag)
      .where(eq(tag.id, tagId))
      .returning();

    if (deletedTag.length === 0) {
      return new Response(JSON.stringify({ error: "标签不存在" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // 清除缓存
    await cache.invalidate({ tags: ["tags"] });
    await cache.invalidate({ tags: ["tag", deletedTag[0].id] });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: "删除标签失败" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
