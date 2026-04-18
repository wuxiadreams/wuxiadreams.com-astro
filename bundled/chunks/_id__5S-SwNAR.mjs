globalThis.process ??= {};
globalThis.process.env ??= {};
import { d as db } from "./db_1qztcB8G.mjs";
import { u as userLibrary, b as and, e as eq, n as novel, s as sql } from "./schema_98e5FuKX.mjs";
async function DELETE({
  locals,
  params
}) {
  const userId = locals?.user?.id;
  if (!userId) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" }
    });
  }
  try {
    const novelId = params.id;
    if (!novelId) {
      return new Response(JSON.stringify({ error: "Novel ID is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const deleted = await db.delete(userLibrary).where(
      and(
        eq(userLibrary.userId, userId),
        eq(userLibrary.novelId, novelId)
      )
    ).returning();
    if (deleted.length === 0) {
      return new Response(JSON.stringify({ error: "Novel not found in library" }), {
        status: 404,
        headers: { "Content-Type": "application/json" }
      });
    }
    await db.update(novel).set({
      bookmarkCount: sql`CASE WHEN ${novel.bookmarkCount} > 0 THEN ${novel.bookmarkCount} - 1 ELSE 0 END`
    }).where(eq(novel.id, novelId));
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to remove from library" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DELETE
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page
};
