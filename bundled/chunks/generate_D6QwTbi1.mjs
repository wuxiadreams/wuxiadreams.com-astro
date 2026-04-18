globalThis.process ??= {};
globalThis.process.env ??= {};
import { env } from "cloudflare:workers";
import { d as db } from "./db_1qztcB8G.mjs";
import { s as sql, q as dailyStat, n as novel, e as eq, r as ranking, t as inArray } from "./schema_98e5FuKX.mjs";
import { R as RANK_TYPE } from "./constants_BOIxQnwR.mjs";
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
    const now = /* @__PURE__ */ new Date();
    const todayStr = now.toISOString().split("T")[0];
    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(now.getDate() - 7);
    const sevenDaysAgoStr = sevenDaysAgo.toISOString().split("T")[0];
    const thirtyDaysAgo = new Date(now);
    thirtyDaysAgo.setDate(now.getDate() - 30);
    const thirtyDaysAgoStr = thirtyDaysAgo.toISOString().split("T")[0];
    const weeklyData = await db.select({
      novelId: dailyStat.novelId,
      totalViews: sql`SUM(${dailyStat.viewCount})`
    }).from(dailyStat).where(sql`${dailyStat.date} >= ${sevenDaysAgoStr}`).groupBy(dailyStat.novelId).orderBy(sql`SUM(${dailyStat.viewCount}) DESC`).limit(100);
    const weeklyInserts = weeklyData.map((item, index) => ({
      type: RANK_TYPE.WEEKLY,
      novelId: item.novelId,
      rank: index + 1,
      score: item.totalViews,
      updatedAt: /* @__PURE__ */ new Date()
    }));
    const monthlyData = await db.select({
      novelId: dailyStat.novelId,
      totalViews: sql`SUM(${dailyStat.viewCount})`
    }).from(dailyStat).where(sql`${dailyStat.date} >= ${thirtyDaysAgoStr}`).groupBy(dailyStat.novelId).orderBy(sql`SUM(${dailyStat.viewCount}) DESC`).limit(100);
    const monthlyInserts = monthlyData.map((item, index) => ({
      type: RANK_TYPE.MONTHLY,
      novelId: item.novelId,
      rank: index + 1,
      score: item.totalViews,
      updatedAt: /* @__PURE__ */ new Date()
    }));
    const risingStarData = await db.select({
      novelId: novel.id,
      risingScore: sql`CAST(SUM(${dailyStat.viewCount}) AS REAL) / MAX((unixepoch('now') - (${novel.createdAt} / 1000)), 86400)`
    }).from(novel).innerJoin(dailyStat, eq(novel.id, dailyStat.novelId)).groupBy(novel.id).orderBy(
      sql`CAST(SUM(${dailyStat.viewCount}) AS REAL) / MAX((unixepoch('now') - (${novel.createdAt} / 1000)), 86400) DESC`
    ).limit(100);
    const risingStarInserts = risingStarData.map((item, index) => ({
      type: RANK_TYPE.RISING_STAR,
      novelId: item.novelId,
      rank: index + 1,
      score: item.risingScore || 0,
      updatedAt: /* @__PURE__ */ new Date()
    }));
    const batchStatements = [
      db.delete(ranking).where(
        inArray(ranking.type, [
          RANK_TYPE.WEEKLY,
          RANK_TYPE.MONTHLY,
          RANK_TYPE.RISING_STAR
        ])
      )
    ];
    const chunkArray = (arr, size) => {
      const chunked = [];
      for (let i = 0; i < arr.length; i += size) {
        chunked.push(arr.slice(i, i + size));
      }
      return chunked;
    };
    const CHUNK_SIZE = 15;
    if (weeklyInserts.length > 0) {
      const chunks = chunkArray(weeklyInserts, CHUNK_SIZE);
      chunks.forEach((chunk) => {
        batchStatements.push(db.insert(ranking).values(chunk));
      });
    }
    if (monthlyInserts.length > 0) {
      const chunks = chunkArray(monthlyInserts, CHUNK_SIZE);
      chunks.forEach((chunk) => {
        batchStatements.push(db.insert(ranking).values(chunk));
      });
    }
    if (risingStarInserts.length > 0) {
      const chunks = chunkArray(risingStarInserts, CHUNK_SIZE);
      chunks.forEach((chunk) => {
        batchStatements.push(db.insert(ranking).values(chunk));
      });
    }
    await db.batch(batchStatements);
    return new Response(
      JSON.stringify({ success: true, message: "排行榜数据已更新" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" }
      }
    );
  } catch (error) {
    console.error("Error generating rankings:", error);
    return new Response(JSON.stringify({ error: "生成排行榜失败" }), {
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
