globalThis.process ??= {};
globalThis.process.env ??= {};
import { env } from "cloudflare:workers";
import { d as db } from "./db_1qztcB8G.mjs";
import { p as post, e as eq } from "./schema_98e5FuKX.mjs";
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
    const postId = params.id;
    if (!postId) {
      return new Response(JSON.stringify({ error: "文章ID不能为空" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const body = await request.json();
    const updatedPost = await db.update(post).set({
      ...body,
      updatedAt: /* @__PURE__ */ new Date()
    }).where(eq(post.id, postId)).returning();
    if (updatedPost.length === 0) {
      return new Response(JSON.stringify({ error: "文章未找到或更新失败" }), {
        status: 404,
        headers: { "Content-Type": "application/json" }
      });
    }
    return new Response(JSON.stringify(updatedPost[0]), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "更新文章失败" }), {
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
    const postId = params.id;
    if (!postId) {
      return new Response(JSON.stringify({ error: "文章ID不能为空" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const deletedPost = await db.delete(post).where(eq(post.id, postId)).returning();
    if (deletedPost.length === 0) {
      return new Response(JSON.stringify({ error: "文章未找到" }), {
        status: 404,
        headers: { "Content-Type": "application/json" }
      });
    }
    return new Response(JSON.stringify({ message: "文章删除成功" }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "删除文章失败" }), {
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
