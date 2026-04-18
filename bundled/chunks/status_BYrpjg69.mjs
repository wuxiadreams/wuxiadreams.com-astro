globalThis.process ??= {};
globalThis.process.env ??= {};
import { d as db } from "./db_1qztcB8G.mjs";
import { b as and, e as eq, u as userLibrary } from "./schema_98e5FuKX.mjs";
async function GET({
  locals,
  request
}) {
  const userId = locals?.user?.id;
  if (!userId) {
    return new Response(JSON.stringify({ isInLibrary: false }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  }
  try {
    const url = new URL(request.url);
    const novelId = url.searchParams.get("novelId");
    if (!novelId) {
      return new Response(JSON.stringify({ error: "Novel ID is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const entry = await db.query.userLibrary.findFirst({
      where: and(
        eq(userLibrary.userId, userId),
        eq(userLibrary.novelId, novelId)
      )
    });
    return new Response(JSON.stringify({ isInLibrary: !!entry }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ isInLibrary: false }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
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
