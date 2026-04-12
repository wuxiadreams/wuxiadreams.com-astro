import { env } from "cloudflare:workers";
import { desc, asc, count, or, like, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { tag } from "@/db/schema";
import type { PaginatedResponse } from "../users/index";

export type TagType = typeof tag.$inferSelect;
export type TagListResponse = PaginatedResponse<TagType>;

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
    ? or(like(tag.name, `%${search}%`), like(tag.slug, `%${search}%`))
    : undefined;

  let orderByColumn;
  if (sortBy === "name") {
    orderByColumn = sortOrder === "asc" ? asc(tag.name) : desc(tag.name);
  } else {
    // Default to createdAt
    orderByColumn =
      sortOrder === "asc" ? asc(tag.createdAt) : desc(tag.createdAt);
  }

  try {
    const [data, totalResult] = await Promise.all([
      db
        .select()
        .from(tag)
        .where(queryFilter)
        .orderBy(orderByColumn)
        .limit(pageSize)
        .offset(offset),
      db.select({ value: count() }).from(tag).where(queryFilter),
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

    // Explicitly check for existing tag
    const existingTag = await db.query.tag.findFirst({
      where: or(eq(tag.name, name), eq(tag.slug, slug)),
    });

    if (existingTag) {
      return new Response(JSON.stringify({ error: "标签名称或 Slug 已存在" }), {
        status: 409,
        headers: { "Content-Type": "application/json" },
      });
    }

    const newTag = await db
      .insert(tag)
      .values({
        name,
        slug,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    return new Response(JSON.stringify(newTag[0]), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: "创建标签失败" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
