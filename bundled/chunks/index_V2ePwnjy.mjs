globalThis.process ??= {};
globalThis.process.env ??= {};
import { d as db } from "./db_1qztcB8G.mjs";
import { b as and, e as eq, u as userLibrary, n as novel, s as sql } from "./schema_98e5FuKX.mjs";
async function POST({
  locals,
  request
}) {
  const userId = locals?.user?.id;
  if (!userId) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" }
    });
  }
  try {
    const { novelId } = await request.json();
    if (!novelId) {
      return new Response(JSON.stringify({ error: "Novel ID is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const existingEntry = await db.query.userLibrary.findFirst({
      where: and(
        eq(userLibrary.userId, userId),
        eq(userLibrary.novelId, novelId)
      )
    });
    if (existingEntry) {
      return new Response(JSON.stringify({ error: "Already in library" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    await db.insert(userLibrary).values({
      userId,
      novelId,
      createdAt: /* @__PURE__ */ new Date()
    });
    await db.update(novel).set({ bookmarkCount: sql`${novel.bookmarkCount} + 1` }).where(eq(novel.id, novelId));
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to add to library" }), {
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
