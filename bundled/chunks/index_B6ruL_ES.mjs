globalThis.process ??= {};
globalThis.process.env ??= {};
import { env } from "cloudflare:workers";
import { d as db } from "./db_1qztcB8G.mjs";
import { o as or, l as like, p as post, h as asc, c as desc } from "./schema_98e5FuKX.mjs";
import { c as count } from "./aggregate_Dn_MtSgz.mjs";
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
    const { title, slug, cover, abstract, content, published, seoTitle, seoDescription } = body;
    if (!title || !slug || !cover) {
      return new Response(
        JSON.stringify({ error: "标题、Slug和封面是必填项" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" }
        }
      );
    }
    const newPost = await db.insert(post).values({
      title,
      slug,
      cover,
      abstract: abstract || "",
      content: content || "",
      published: published || false,
      seoTitle: seoTitle || "",
      seoDescription: seoDescription || "",
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    }).returning();
    return new Response(JSON.stringify(newPost[0]), {
      status: 201,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "创建文章失败" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
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
  const queryFilter = search ? or(
    like(post.title, `%${search}%`),
    like(post.slug, `%${search}%`)
  ) : void 0;
  let orderByColumn;
  if (sortBy === "title") {
    orderByColumn = sortOrder === "asc" ? asc(post.title) : desc(post.title);
  } else {
    orderByColumn = sortOrder === "asc" ? asc(post.createdAt) : desc(post.createdAt);
  }
  try {
    const [data, totalResult] = await Promise.all([
      db.select().from(post).where(queryFilter).orderBy(orderByColumn).limit(pageSize).offset(offset),
      db.select({ value: count() }).from(post).where(queryFilter)
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
