globalThis.process ??= {};
globalThis.process.env ??= {};
import { env } from "cloudflare:workers";
import { d as db } from "./db_1qztcB8G.mjs";
import { o as or, l as like, n as novel, e as eq, b as and, h as asc, c as desc, j as novelAuthor, k as novelTag, m as novelCategory } from "./schema_98e5FuKX.mjs";
import { i as copySingleFile } from "./r2_fNuLAT3E.mjs";
import { c as count } from "./aggregate_Dn_MtSgz.mjs";
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
    const body = await request.json();
    const {
      title,
      titleAlt,
      slug,
      authorId,
      status,
      tags,
      categories,
      score,
      reviewCount,
      chapterCount,
      ...otherData
    } = body;
    if (!title || !titleAlt || !slug || !status) {
      return new Response(
        JSON.stringify({ error: "标题、别名、Slug和状态是必填项" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" }
        }
      );
    }
    const newNovel = await db.insert(novel).values({
      title,
      titleAlt,
      slug,
      status,
      score: score !== void 0 ? Number(score) : 0,
      reviewCount: reviewCount !== void 0 ? Number(reviewCount) : 0,
      chapterCount: chapterCount !== void 0 ? Number(chapterCount) : 0,
      ...otherData,
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    }).returning();
    const novelId = newNovel[0]?.id;
    if (novelId) {
      if (authorId) {
        await db.insert(novelAuthor).values({
          novelId,
          authorId,
          createdAt: /* @__PURE__ */ new Date()
        });
      }
      if (Array.isArray(tags) && tags.length > 0) {
        const tagValues = tags.map((tagId) => ({
          novelId,
          tagId: Number(tagId),
          createdAt: /* @__PURE__ */ new Date()
        }));
        await db.insert(novelTag).values(tagValues);
      }
      if (Array.isArray(categories) && categories.length > 0) {
        const categoryValues = categories.map((categoryId) => ({
          novelId,
          categoryId: Number(categoryId),
          createdAt: /* @__PURE__ */ new Date()
        }));
        await db.insert(novelCategory).values(categoryValues);
      }
      let finalCover = otherData.cover;
      if (otherData.cover && otherData.cover.startsWith("temp/")) {
        const fileExtension = otherData.cover.split(".").pop();
        const sourceKey = otherData.cover;
        const destinationKey = `covers/${novelId}/cover.${fileExtension}`;
        const { error } = await copySingleFile({
          bucket: env.R2_ASSETS_BUCKET,
          source: `${env.R2_ASSETS_BUCKET}/${sourceKey}`,
          destination: destinationKey,
          contentType: `image/${fileExtension}`,
          cacheControl: "public, max-age=31536000, immutable"
        });
        if (!error) {
          finalCover = destinationKey;
          await db.update(novel).set({ cover: finalCover }).where(eq(novel.id, novelId));
        } else {
          console.error("Failed to copy cover image:", error);
        }
      }
      return new Response(
        JSON.stringify({ ...newNovel[0], cover: finalCover }),
        {
          status: 201,
          headers: { "Content-Type": "application/json" }
        }
      );
    }
    return new Response(JSON.stringify(newNovel[0]), {
      status: 201,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "创建小说失败" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
async function GET({
  locals,
  request
}) {
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
  const publishedFilter = url.searchParams.get("published");
  const sortBy = url.searchParams.get("sortBy") || "createdAt";
  const sortOrder = url.searchParams.get("sortOrder") || "desc";
  const searchFilter = search ? or(
    like(novel.title, `%${search}%`),
    like(novel.titleAlt, `%${search}%`),
    like(novel.slug, `%${search}%`)
  ) : void 0;
  let publishCondition = void 0;
  if (publishedFilter === "true") {
    publishCondition = eq(novel.published, true);
  } else if (publishedFilter === "false") {
    publishCondition = eq(novel.published, false);
  }
  const queryFilter = and(searchFilter, publishCondition);
  let orderByColumn;
  if (sortBy === "title") {
    orderByColumn = sortOrder === "asc" ? asc(novel.title) : desc(novel.title);
  } else if (sortBy === "chapterCount") {
    orderByColumn = sortOrder === "asc" ? asc(novel.chapterCount) : desc(novel.chapterCount);
  } else {
    orderByColumn = sortOrder === "asc" ? asc(novel.createdAt) : desc(novel.createdAt);
  }
  try {
    const [data, totalResult] = await Promise.all([
      db.select().from(novel).where(queryFilter).orderBy(desc(novel.isPinned), orderByColumn).limit(pageSize).offset(offset),
      db.select({ value: count() }).from(novel).where(queryFilter)
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
  GET,
  POST
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page
};
