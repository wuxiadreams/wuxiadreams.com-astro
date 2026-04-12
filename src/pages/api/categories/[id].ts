import { env } from "cloudflare:workers";
import { eq, or, ne, and } from "drizzle-orm";
import { db } from "@/lib/db";
import { category } from "@/db/schema";

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
    const body = (await request.json()) as { name: string; slug: string };
    const { name, slug } = body;
    const categoryId = Number(params.id);

    if (isNaN(categoryId)) {
      return new Response(JSON.stringify({ error: "无效的分类 ID" }), {
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

    // Explicitly check for existing category excluding current one
    const existingCategory = await db.query.category.findFirst({
      where: and(
        ne(category.id, categoryId),
        or(eq(category.name, name), eq(category.slug, slug)),
      ),
    });

    if (existingCategory) {
      return new Response(JSON.stringify({ error: "分类名称或 Slug 已存在" }), {
        status: 409,
        headers: { "Content-Type": "application/json" },
      });
    }

    const updatedCategory = await db
      .update(category)
      .set({
        name,
        slug,
        updatedAt: new Date(),
      })
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
