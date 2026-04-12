import { env } from "cloudflare:workers";
import { desc, asc, count, or, like, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { category } from "@/db/schema";
import type { PaginatedResponse } from "../users/index";

export type CategoryType = typeof category.$inferSelect;
export type CategoryListResponse = PaginatedResponse<CategoryType>;

export async function GET({
  locals,
  request,
}: {
  locals: any;
  request: Request;
}) {
  const email = locals?.user?.email;
  const adminEmails = (env.ADMIN_EMAILS ?? "").split(",");

  if (!email || !adminEmails.includes(email || "")) {
    return new Response(null, {
      status: 403,
      statusText: "Forbidden",
    });
  }

  const url = new URL(request.url);
  const page = Math.max(1, Number(url.searchParams.get("page") || 1));
  const pageSize = Math.max(1, Number(url.searchParams.get("pageSize") || 10));
  const offset = (page - 1) * pageSize;
  const search = url.searchParams.get("search");

  const sortBy = url.searchParams.get("sortBy") || "createdAt";
  const sortOrder = url.searchParams.get("sortOrder") || "desc";

  const queryFilter = search
    ? or(like(category.name, `%${search}%`), like(category.slug, `%${search}%`))
    : undefined;

  let orderByColumn;
  if (sortBy === "name") {
    orderByColumn =
      sortOrder === "asc" ? asc(category.name) : desc(category.name);
  } else {
    // Default to createdAt
    orderByColumn =
      sortOrder === "asc" ? asc(category.createdAt) : desc(category.createdAt);
  }

  try {
    const [data, totalResult] = await Promise.all([
      db
        .select()
        .from(category)
        .where(queryFilter)
        .orderBy(orderByColumn)
        .limit(pageSize)
        .offset(offset),
      db.select({ value: count() }).from(category).where(queryFilter),
    ]);

    const total = totalResult[0].value;
    const totalPages = Math.ceil(total / pageSize);

    return new Response(
      JSON.stringify({
        items: data,
        meta: {
          total,
          page,
          pageSize,
          totalPages,
        },
      }),
      { status: 200 },
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: "数据库查询失败" }), {
      status: 500,
    });
  }
}

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
    const body = (await request.json()) as { name: string; slug: string };
    const { name, slug } = body;

    if (!name || !slug) {
      return new Response(JSON.stringify({ error: "名称和 Slug 是必填项" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Explicitly check for existing category
    const existingCategory = await db.query.category.findFirst({
      where: or(eq(category.name, name), eq(category.slug, slug)),
    });

    if (existingCategory) {
      return new Response(JSON.stringify({ error: "分类名称或 Slug 已存在" }), {
        status: 409,
        headers: { "Content-Type": "application/json" },
      });
    }

    const newCategory = await db
      .insert(category)
      .values({
        name,
        slug,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    return new Response(JSON.stringify(newCategory[0]), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: "创建分类失败" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
