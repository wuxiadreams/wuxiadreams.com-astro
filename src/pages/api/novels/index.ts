import { env } from "cloudflare:workers";
import { desc, asc, count, or, like } from "drizzle-orm";
import { db } from "@/lib/db";
import { novel, novelAuthor, author } from "@/db/schema";
import type { PaginatedResponse } from "../users/index";

export type NovelType = typeof novel.$inferSelect;
export type NovelListResponse = PaginatedResponse<NovelType>;

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
    const { title, titleAlt, slug, authorId, status, ...otherData } = body;

    if (!title || !titleAlt || !slug || !status) {
      return new Response(
        JSON.stringify({ error: "标题、别名、Slug和状态是必填项" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    // 1. Create the novel
    const newNovel = await db
      .insert(novel)
      .values({
        title,
        titleAlt,
        slug,
        status,
        ...otherData,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    // 2. Map author to novel if authorId is provided
    if (authorId && newNovel[0]) {
      await db.insert(novelAuthor).values({
        novelId: newNovel[0].id,
        authorId,
        createdAt: new Date(),
      });
    }

    return new Response(JSON.stringify(newNovel[0]), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: "创建小说失败" }), {
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
        like(novel.title, `%${search}%`),
        like(novel.titleAlt, `%${search}%`),
        like(novel.slug, `%${search}%`),
      )
    : undefined;

  let orderByColumn;
  if (sortBy === "title") {
    orderByColumn = sortOrder === "asc" ? asc(novel.title) : desc(novel.title);
  } else if (sortBy === "chapterCount") {
    orderByColumn = sortOrder === "asc" ? asc(novel.chapterCount) : desc(novel.chapterCount);
  } else {
    // Default to createdAt
    orderByColumn =
      sortOrder === "asc" ? asc(novel.createdAt) : desc(novel.createdAt);
  }

  try {
    const [data, totalResult] = await Promise.all([
      db
        .select()
        .from(novel)
        .where(queryFilter)
        // Ensure pinned novels are always at the top
        .orderBy(desc(novel.isPinned), orderByColumn)
        .limit(pageSize)
        .offset(offset),
      db.select({ value: count() }).from(novel).where(queryFilter),
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
