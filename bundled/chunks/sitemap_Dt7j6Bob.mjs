globalThis.process ??= {};
globalThis.process.env ??= {};
import { d as db } from "./db_1qztcB8G.mjs";
import { n as novel, e as eq } from "./schema_98e5FuKX.mjs";
const GET = async ({ site, cache }) => {
  cache.set({
    maxAge: 60 * 60 * 24 * 7,
    tags: ["sitemap"]
  });
  const novels = await db.select({
    slug: novel.slug,
    updatedAt: novel.updatedAt
  }).from(novel).where(eq(novel.published, true));
  const baseUrl = site ? site.href : "https://wuxiadreams.com/";
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      <url>
        <loc>${baseUrl}</loc>
        <changefreq>daily</changefreq>
        <priority>1.0</priority>
      </url>
      
      ${novels.map(
    (n) => `
        <url>
          <loc>${baseUrl}novel/${n.slug}</loc>
          <lastmod>${n.updatedAt ? new Date(n.updatedAt).toISOString() : (/* @__PURE__ */ new Date()).toISOString()}</lastmod>
          <changefreq>weekly</changefreq>
          <priority>0.8</priority>
        </url>
      `
  ).join("")}
    </urlset>`.replace(/\s+/g, " ").trim();
  return new Response(sitemap, {
    status: 200,
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=600"
    }
  });
};
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  GET
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page
};
