import { env } from "cloudflare:workers";
import { desc, asc, count, or, like, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { author } from "@/db/schema";
import type { PaginatedResponse } from "../users/index";

export type AuthorType = typeof author.$inferSelect;
export type AuthorListResponse = PaginatedResponse<AuthorType>;

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
        like(author.name, `%${search}%`),
        like(author.nameAlt, `%${search}%`),
        like(author.slug, `%${search}%`),
      )
    : undefined;

  let orderByColumn;
  if (sortBy === "name") {
    orderByColumn = sortOrder === "asc" ? asc(author.name) : desc(author.name);
  } else if (sortBy === "novelCount") {
    orderByColumn =
      sortOrder === "asc" ? asc(author.novelCount) : desc(author.novelCount);
  } else {
    // Default to createdAt
    orderByColumn =
      sortOrder === "asc" ? asc(author.createdAt) : desc(author.createdAt);
  }

  try {
    const [data, totalResult] = await Promise.all([
      db
        .select()
        .from(author)
        .where(queryFilter)
        .orderBy(orderByColumn)
        .limit(pageSize)
        .offset(offset),
      db.select({ value: count() }).from(author).where(queryFilter),
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

export async function POST(context) {
  const { locals, request } = context;
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

    if (!name || !nameAlt || !slug) {
      return new Response(
        JSON.stringify({ error: "名称、别名和 Slug 是必填项" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    // Explicitly check for existing author
    const existingAuthor = await db.query.author.findFirst({
      where: or(
        eq(author.name, name),
        eq(author.nameAlt, nameAlt),
        eq(author.slug, slug),
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

    const newAuthor = await db
      .insert(author)
      .values({
        name,
        nameAlt,
        slug,
        country,
        isPinned,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    return new Response(JSON.stringify(newAuthor[0]), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: "创建作者失败" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
