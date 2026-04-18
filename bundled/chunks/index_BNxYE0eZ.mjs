globalThis.process ??= {};
globalThis.process.env ??= {};
import { env } from "cloudflare:workers";
import { d as db } from "./db_1qztcB8G.mjs";
import { o as or, l as like, i as category, h as asc, c as desc, e as eq } from "./schema_98e5FuKX.mjs";
import { c as count } from "./aggregate_Dn_MtSgz.mjs";
async function GET({
  locals,
  request
}) {
  const email = locals?.user?.email;
  const adminEmails = (env.ADMIN_EMAILS ?? "").split(",");
  if (!email || !adminEmails.includes(email || "")) {
    return new Response(null, {
      status: 403,
      statusText: "Forbidden"
    });
  }
  const url = new URL(request.url);
  const page2 = Math.max(1, Number(url.searchParams.get("page") || 1));
  const pageSize = Math.max(1, Number(url.searchParams.get("pageSize") || 10));
  const offset = (page2 - 1) * pageSize;
  const search = url.searchParams.get("search");
  const sortBy = url.searchParams.get("sortBy") || "createdAt";
  const sortOrder = url.searchParams.get("sortOrder") || "desc";
  const queryFilter = search ? or(like(category.name, `%${search}%`), like(category.slug, `%${search}%`)) : void 0;
  let orderByColumn;
  if (sortBy === "name") {
    orderByColumn = sortOrder === "asc" ? asc(category.name) : desc(category.name);
  } else if (sortBy === "novelCount") {
    orderByColumn = sortOrder === "asc" ? asc(category.novelCount) : desc(category.novelCount);
  } else {
    orderByColumn = sortOrder === "asc" ? asc(category.createdAt) : desc(category.createdAt);
  }
  try {
    const [data, totalResult] = await Promise.all([
      db.select().from(category).where(queryFilter).orderBy(orderByColumn).limit(pageSize).offset(offset),
      db.select({ value: count() }).from(category).where(queryFilter)
    ]);
    const total = totalResult[0].value;
    const totalPages = Math.ceil(total / pageSize);
    return new Response(
      JSON.stringify({
        items: data,
        meta: {
          total,
          page: page2,
          pageSize,
          totalPages
        }
      }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: "数据库查询失败" }), {
      status: 500
    });
  }
}
async function POST({
  locals,
  request
}) {
  const email = locals?.user?.email;
  const adminEmails = (env.ADMIN_EMAILS ?? "").split(",");
  if (!email || !adminEmails.includes(email || "")) {
    return new Response(JSON.stringify({ error: "Forbidden" }), {
      status: 403,
      headers: { "Content-Type": "application/json" }
    });
  }
  try {
    const body = await request.json();
    const { name, slug } = body;
    if (!name || !slug) {
      return new Response(JSON.stringify({ error: "名称和 Slug 是必填项" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const existingCategory = await db.query.category.findFirst({
      where: or(eq(category.name, name), eq(category.slug, slug))
    });
    if (existingCategory) {
      return new Response(JSON.stringify({ error: "分类名称或 Slug 已存在" }), {
        status: 409,
        headers: { "Content-Type": "application/json" }
      });
    }
    const newCategory = await db.insert(category).values({
      name,
      slug,
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    }).returning();
    return new Response(JSON.stringify(newCategory[0]), {
      status: 201,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "创建分类失败" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  GET,
  POST
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page
};
