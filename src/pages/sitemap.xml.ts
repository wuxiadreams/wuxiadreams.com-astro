import type { APIRoute } from "astro";
import { db } from "@/lib/db";
import { novel } from "@/db/schema";
import { eq } from "drizzle-orm";

export const GET: APIRoute = async ({ cache }) => {
  cache.set({
    maxAge: 60 * 60 * 24 * 7,
    tags: ["sitemap"],
  });

  const novels = await db
    .select({
      slug: novel.slug,
      updatedAt: novel.updatedAt,
    })
    .from(novel)
    .where(eq(novel.published, true));

  const baseUrl = "https://wuxiadreams.com/";

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      <url>
        <loc>${baseUrl}</loc>
        <changefreq>daily</changefreq>
        <priority>1.0</priority>
      </url>
      
      ${novels
        .map(
          (n) => `
        <url>
          <loc>${baseUrl}novel/${n.slug}</loc>
          <lastmod>${n.updatedAt ? new Date(n.updatedAt).toISOString() : new Date().toISOString()}</lastmod>
          <changefreq>weekly</changefreq>
          <priority>0.8</priority>
        </url>
      `,
        )
        .join("")}
    </urlset>`
    .replace(/\s+/g, " ")
    .trim();

  return new Response(sitemap, {
    status: 200,
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=600",
    },
  });
};
