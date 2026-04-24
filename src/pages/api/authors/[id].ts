import { env } from "cloudflare:workers";
import { eq, or, ne, and } from "drizzle-orm";
import { db } from "@/lib/db";
import { author } from "@/db/schema";

export async function PUT(context) {
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
    const body = (await request.json()) as {
      name: string;
      nameAlt: string;
      slug: string;
      country?: string;
      isPinned?: boolean;
    };
    const { name, nameAlt, slug, country = "", isPinned = false } = body;
    const authorId = params.id;

    if (!authorId) {
      return new Response(JSON.stringify({ error: "无效的作者 ID" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (!name || !nameAlt || !slug) {
      return new Response(
        JSON.stringify({ error: "名称、别名和 Slug 是必填项" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    // Explicitly check for existing author excluding current one
    const existingAuthor = await db.query.author.findFirst({
      where: and(
        ne(author.id, authorId),
        or(
          eq(author.name, name),
          eq(author.nameAlt, nameAlt),
          eq(author.slug, slug),
        ),
      ),
    });

    if (existingAuthor) {
      return new Response(
        JSON.stringify({ error: "作者名称、别名或 Slug 已存在" }),
        {
          status: 409,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    const updatedAuthor = await db
      .update(author)
      .set({
        name,
        nameAlt,
        slug,
        country,
        isPinned,
        updatedAt: new Date(),
      })
      .where(eq(author.id, authorId))
      .returning();

    if (updatedAuthor.length === 0) {
      return new Response(JSON.stringify({ error: "作者不存在" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(updatedAuthor[0]), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: "更新作者失败" }), {
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
    const authorId = params.id;

    if (!authorId) {
      return new Response(JSON.stringify({ error: "无效的作者 ID" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const deletedAuthor = await db
      .delete(author)
      .where(eq(author.id, authorId))
      .returning();

    if (deletedAuthor.length === 0) {
      return new Response(JSON.stringify({ error: "作者不存在" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: "删除作者失败" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
