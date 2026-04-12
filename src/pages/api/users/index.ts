import { env } from "cloudflare:workers";
import { desc, count, or, like } from "drizzle-orm";
import { db } from "@/lib/db";
import { user } from "@/db/schema";
import type { User } from "@/types/user";

export interface PaginatedResponse<T> {
  items: T[];
  meta: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}

export type UserListResponse = PaginatedResponse<User>;

export async function GET({ locals, request }) {
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
  const queryFilter = search
    ? or(like(user.name, `%${search}%`), like(user.email, `%${search}%`))
    : undefined;

  try {
    const [data, totalResult] = await Promise.all([
      db
        .select()
        .from(user)
        .where(queryFilter)
        .orderBy(desc(user.createdAt))
        .limit(pageSize)
        .offset(offset),
      db.select({ value: count() }).from(user).where(queryFilter),
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
