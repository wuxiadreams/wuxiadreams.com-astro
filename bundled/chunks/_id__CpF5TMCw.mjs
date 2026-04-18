globalThis.process ??= {};
globalThis.process.env ??= {};
import { env } from "cloudflare:workers";
import { d as db } from "./db_1qztcB8G.mjs";
import { v as tag, e as eq, b as and, g as ne, o as or } from "./schema_98e5FuKX.mjs";
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
    const { name, slug } = body;
    const tagId = Number(params.id);
    if (isNaN(tagId)) {
      return new Response(JSON.stringify({ error: "无效的标签 ID" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    if (!name || !slug) {
      return new Response(JSON.stringify({ error: "名称和 Slug 是必填项" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const existingTag = await db.query.tag.findFirst({
      where: and(ne(tag.id, tagId), or(eq(tag.name, name), eq(tag.slug, slug)))
    });
    if (existingTag) {
      return new Response(JSON.stringify({ error: "标签名称或 Slug 已存在" }), {
        status: 409,
        headers: { "Content-Type": "application/json" }
      });
    }
    const updatedTag = await db.update(tag).set({
      name,
      slug,
      updatedAt: /* @__PURE__ */ new Date()
    }).where(eq(tag.id, tagId)).returning();
    if (updatedTag.length === 0) {
      return new Response(JSON.stringify({ error: "标签不存在" }), {
        status: 404,
        headers: { "Content-Type": "application/json" }
      });
    }
    return new Response(JSON.stringify(updatedTag[0]), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "更新标签失败" }), {
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
    const tagId = Number(params.id);
    if (isNaN(tagId)) {
      return new Response(JSON.stringify({ error: "无效的标签 ID" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const deletedTag = await db.delete(tag).where(eq(tag.id, tagId)).returning();
    if (deletedTag.length === 0) {
      return new Response(JSON.stringify({ error: "标签不存在" }), {
        status: 404,
        headers: { "Content-Type": "application/json" }
      });
    }
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "删除标签失败" }), {
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
