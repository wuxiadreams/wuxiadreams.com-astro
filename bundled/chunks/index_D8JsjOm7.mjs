globalThis.process ??= {};
globalThis.process.env ??= {};
import { env } from "cloudflare:workers";
import { d as db } from "./db_1qztcB8G.mjs";
import { v as tag, s as sql } from "./schema_98e5FuKX.mjs";
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
    await db.update(tag).set({
      novelCount: sql`(
        SELECT COUNT(*) 
        FROM novel_tag 
        INNER JOIN novel ON novel_tag.novel_id = novel.id 
        WHERE novel_tag.tag_id = tag.id AND novel.published = true
      )`
    });
    return new Response(
      JSON.stringify({
        success: true,
        message: "Tag novel counts synced successfully"
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" }
      }
    );
  } catch (error) {
    console.error("Error syncing tags:", error);
    return new Response(JSON.stringify({ error: "Failed to sync tags" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page
};
