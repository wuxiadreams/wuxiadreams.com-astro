import { env } from "cloudflare:workers";
import { desc, asc, count, or, like } from "drizzle-orm";
import { db } from "@/lib/db";
import { novel } from "@/db/schema";
import type { PaginatedResponse } from "../users/index";

export type NovelType = typeof novel.$inferSelect;
export type NovelListResponse = PaginatedResponse<NovelType>;

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
