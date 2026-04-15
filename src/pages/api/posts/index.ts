import { env } from "cloudflare:workers";
import { desc, asc, count, or, like } from "drizzle-orm";
import { db } from "@/lib/db";
import { post } from "@/db/schema";
import type { PaginatedResponse } from "../users/index";

export type PostType = typeof post.$inferSelect;
export type PostListResponse = PaginatedResponse<PostType>;

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
    const body = (await request.json()) as Record<string, any>;
    const { title, slug, cover, abstract, content, published, seoTitle, seoDescription } = body;

    if (!title || !slug || !cover) {
      return new Response(
        JSON.stringify({ error: "标题、Slug和封面是必填项" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    // 1. Create the post
    const newPost = await db
      .insert(post)
      .values({
        title,
        slug,
        cover,
        abstract: abstract || "",
        content: content || "",
        published: published || false,
        seoTitle: seoTitle || "",
        seoDescription: seoDescription || "",
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    return new Response(JSON.stringify(newPost[0]), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: "创建文章失败" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

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
    ? or(
        like(post.title, `%${search}%`),
        like(post.slug, `%${search}%`),
      )
    : undefined;

  let orderByColumn;
  if (sortBy === "title") {
    orderByColumn = sortOrder === "asc" ? asc(post.title) : desc(post.title);
  } else {
    // Default to createdAt
    orderByColumn =
      sortOrder === "asc" ? asc(post.createdAt) : desc(post.createdAt);
  }

  try {
    const [data, totalResult] = await Promise.all([
      db
        .select()
        .from(post)
        .where(queryFilter)
        .orderBy(orderByColumn)
        .limit(pageSize)
        .offset(offset),
      db.select({ value: count() }).from(post).where(queryFilter),
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
      headers: { "Content-Type": "application/json" },
    });
  }
}
