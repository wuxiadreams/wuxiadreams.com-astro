globalThis.process ??= {};
globalThis.process.env ??= {};
import { env } from "cloudflare:workers";
import { d as db } from "./db_1qztcB8G.mjs";
import { o as or, l as like, w as user, c as desc } from "./schema_98e5FuKX.mjs";
import { c as count } from "./aggregate_Dn_MtSgz.mjs";
async function GET({ locals, request }) {
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
  const queryFilter = search ? or(like(user.name, `%${search}%`), like(user.email, `%${search}%`)) : void 0;
  try {
    const [data, totalResult] = await Promise.all([
      db.select().from(user).where(queryFilter).orderBy(desc(user.createdAt)).limit(pageSize).offset(offset),
      db.select({ value: count() }).from(user).where(queryFilter)
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
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  GET
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page
};
