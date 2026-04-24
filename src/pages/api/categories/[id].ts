import { env } from "cloudflare:workers";
import { eq, or, ne, and } from "drizzle-orm";
import { db } from "@/lib/db";
import { category } from "@/db/schema";

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
    const body = (await request.json()) as {
      name?: string;
      slug?: string;
      isPinned?: boolean;
    };
    const { name, slug, isPinned } = body;
    const categoryId = Number(params.id);

    if (isNaN(categoryId)) {
      return new Response(JSON.stringify({ error: "无效的分类 ID" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // If name or slug are provided, we must check for duplicates
    if (name && slug) {
      const existingCategory = await db.query.category.findFirst({
        where: and(
          ne(category.id, categoryId),
          or(eq(category.name, name), eq(category.slug, slug)),
        ),
      });

      if (existingCategory) {
        return new Response(
          JSON.stringify({ error: "分类名称或 Slug 已存在" }),
          {
            status: 409,
            headers: { "Content-Type": "application/json" },
          },
        );
      }
    }

    const updateData: any = { updatedAt: new Date() };
    if (name !== undefined) updateData.name = name;
    if (slug !== undefined) updateData.slug = slug;
    if (isPinned !== undefined) updateData.isPinned = isPinned;

    const updatedCategory = await db
      .update(category)
      .set(updateData)
      .where(eq(category.id, categoryId))
      .returning();

    if (updatedCategory.length === 0) {
      return new Response(JSON.stringify({ error: "分类不存在" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(updatedCategory[0]), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: "更新分类失败" }), {
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
    const categoryId = Number(params.id);

    if (isNaN(categoryId)) {
      return new Response(JSON.stringify({ error: "无效的分类 ID" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const deletedCategory = await db
      .delete(category)
      .where(eq(category.id, categoryId))
      .returning();

    if (deletedCategory.length === 0) {
      return new Response(JSON.stringify({ error: "分类不存在" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: "删除分类失败" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
