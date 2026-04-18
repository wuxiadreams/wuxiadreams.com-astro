globalThis.process ??= {};
globalThis.process.env ??= {};
import { env } from "cloudflare:workers";
import { d as db } from "./db_1qztcB8G.mjs";
import { f as author, e as eq, b as and, g as ne, o as or } from "./schema_98e5FuKX.mjs";
async function PUT({
  locals,
  request,
  params
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
    const { name, nameAlt, slug, country = "", isPinned = false } = body;
    const authorId = params.id;
    if (!authorId) {
      return new Response(JSON.stringify({ error: "无效的作者 ID" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    if (!name || !nameAlt || !slug) {
      return new Response(
        JSON.stringify({ error: "名称、别名和 Slug 是必填项" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" }
        }
      );
    }
    const existingAuthor = await db.query.author.findFirst({
      where: and(
        ne(author.id, authorId),
        or(
          eq(author.name, name),
          eq(author.nameAlt, nameAlt),
          eq(author.slug, slug)
        )
      )
    });
    if (existingAuthor) {
      return new Response(
        JSON.stringify({ error: "作者名称、别名或 Slug 已存在" }),
        {
          status: 409,
          headers: { "Content-Type": "application/json" }
        }
      );
    }
    const updatedAuthor = await db.update(author).set({
      name,
      nameAlt,
      slug,
      country,
      isPinned,
      updatedAt: /* @__PURE__ */ new Date()
    }).where(eq(author.id, authorId)).returning();
    if (updatedAuthor.length === 0) {
      return new Response(JSON.stringify({ error: "作者不存在" }), {
        status: 404,
        headers: { "Content-Type": "application/json" }
      });
    }
    return new Response(JSON.stringify(updatedAuthor[0]), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "更新作者失败" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
async function DELETE({
  locals,
  params
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
    const authorId = params.id;
    if (!authorId) {
      return new Response(JSON.stringify({ error: "无效的作者 ID" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const deletedAuthor = await db.delete(author).where(eq(author.id, authorId)).returning();
    if (deletedAuthor.length === 0) {
      return new Response(JSON.stringify({ error: "作者不存在" }), {
        status: 404,
        headers: { "Content-Type": "application/json" }
      });
    }
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "删除作者失败" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DELETE,
  PUT
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page
};
