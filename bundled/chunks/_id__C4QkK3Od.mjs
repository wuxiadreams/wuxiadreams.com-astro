globalThis.process ??= {};
globalThis.process.env ??= {};
import { env } from "cloudflare:workers";
import { d as db } from "./db_1qztcB8G.mjs";
import { i as category, e as eq, b as and, g as ne, o as or } from "./schema_98e5FuKX.mjs";
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
    const { name, slug, isPinned } = body;
    const categoryId = Number(params.id);
    if (isNaN(categoryId)) {
      return new Response(JSON.stringify({ error: "无效的分类 ID" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    if (name && slug) {
      const existingCategory = await db.query.category.findFirst({
        where: and(
          ne(category.id, categoryId),
          or(eq(category.name, name), eq(category.slug, slug))
        )
      });
      if (existingCategory) {
        return new Response(JSON.stringify({ error: "分类名称或 Slug 已存在" }), {
          status: 409,
          headers: { "Content-Type": "application/json" }
        });
      }
    }
    const updateData = { updatedAt: /* @__PURE__ */ new Date() };
    if (name !== void 0) updateData.name = name;
    if (slug !== void 0) updateData.slug = slug;
    if (isPinned !== void 0) updateData.isPinned = isPinned;
    const updatedCategory = await db.update(category).set(updateData).where(eq(category.id, categoryId)).returning();
    if (updatedCategory.length === 0) {
      return new Response(JSON.stringify({ error: "分类不存在" }), {
        status: 404,
        headers: { "Content-Type": "application/json" }
      });
    }
    return new Response(JSON.stringify(updatedCategory[0]), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "更新分类失败" }), {
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
    const categoryId = Number(params.id);
    if (isNaN(categoryId)) {
      return new Response(JSON.stringify({ error: "无效的分类 ID" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const deletedCategory = await db.delete(category).where(eq(category.id, categoryId)).returning();
    if (deletedCategory.length === 0) {
      return new Response(JSON.stringify({ error: "分类不存在" }), {
        status: 404,
        headers: { "Content-Type": "application/json" }
      });
    }
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "删除分类失败" }), {
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
