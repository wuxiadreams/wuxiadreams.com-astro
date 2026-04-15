import { env } from "cloudflare:workers";
import { sql, inArray, exists, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { ranking, dailyStat, novel } from "@/db/schema";
import { RANK_TYPE } from "@/lib/constants";

export async function POST({
  locals,
  request,
}: {
  locals: any;
  request: Request;
}) {
  const email = locals?.user?.email;
  const adminEmails = (env.ADMIN_EMAILS ?? "").split(",");

  if (!email || !adminEmails.includes(email || "")) {
    return new Response(JSON.stringify({ error: "Forbidden" }), {
      status: 403,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const now = new Date();
    const todayStr = now.toISOString().split("T")[0];

    // Calculate dates for 7 and 30 days ago
    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(now.getDate() - 7);
    const sevenDaysAgoStr = sevenDaysAgo.toISOString().split("T")[0];

    const thirtyDaysAgo = new Date(now);
    thirtyDaysAgo.setDate(now.getDate() - 30);
    const thirtyDaysAgoStr = thirtyDaysAgo.toISOString().split("T")[0];

    // 1. Calculate weekly rankings (top 100 view_count in last 7 days)
    const weeklyData = await db
      .select({
        novelId: dailyStat.novelId,
        totalViews: sql<number>`SUM(${dailyStat.viewCount})`,
      })
      .from(dailyStat)
      .where(sql`${dailyStat.date} >= ${sevenDaysAgoStr}`)
      .groupBy(dailyStat.novelId)
      .orderBy(sql`SUM(${dailyStat.viewCount}) DESC`)
      .limit(100);

    const weeklyInserts = weeklyData.map((item, index) => ({
      type: RANK_TYPE.WEEKLY,
      novelId: item.novelId,
      rank: index + 1,
      score: item.totalViews,
      updatedAt: new Date(),
    }));

    // 2. Calculate monthly rankings (top 100 view_count in last 30 days)
    const monthlyData = await db
      .select({
        novelId: dailyStat.novelId,
        totalViews: sql<number>`SUM(${dailyStat.viewCount})`,
      })
      .from(dailyStat)
      .where(sql`${dailyStat.date} >= ${thirtyDaysAgoStr}`)
      .groupBy(dailyStat.novelId)
      .orderBy(sql`SUM(${dailyStat.viewCount}) DESC`)
      .limit(100);

    const monthlyInserts = monthlyData.map((item, index) => ({
      type: RANK_TYPE.MONTHLY,
      novelId: item.novelId,
      rank: index + 1,
      score: item.totalViews,
      updatedAt: new Date(),
    }));

    // 3. Calculate rising star rankings (view_count / max(now - created_at, 86400) in seconds)
    // 优化：使用 INNER JOIN 和 GROUP BY 替代 EXISTS 子查询，这在大部分情况下会有更好的查询性能
    const risingStarData = await db
      .select({
        novelId: novel.id,
        risingScore: sql<number>`CAST(SUM(${dailyStat.viewCount}) AS REAL) / MAX((unixepoch('now') - (${novel.createdAt} / 1000)), 86400)`,
      })
      .from(novel)
      .innerJoin(dailyStat, eq(novel.id, dailyStat.novelId))
      .groupBy(novel.id)
      .orderBy(
        sql`CAST(SUM(${dailyStat.viewCount}) AS REAL) / MAX((unixepoch('now') - (${novel.createdAt} / 1000)), 86400) DESC`,
      )
      .limit(100);

    const risingStarInserts = risingStarData.map((item, index) => ({
      type: RANK_TYPE.RISING_STAR,
      novelId: item.novelId,
      rank: index + 1,
      score: item.risingScore || 0,
      updatedAt: new Date(),
    }));

    // Use db.batch to perform all database mutations atomically since Cloudflare D1 doesn't support SQL BEGIN TRANSACTION
    const batchStatements: any[] = [
      db
        .delete(ranking)
        .where(
          inArray(ranking.type, [
            RANK_TYPE.WEEKLY,
            RANK_TYPE.MONTHLY,
            RANK_TYPE.RISING_STAR,
          ]),
        ),
    ];

    // Helper function to split array into chunks to avoid "too many SQL variables" error in D1
    // D1 has a hard limit on the number of variables per query (usually 100 or less depending on column count)
    const chunkArray = <T>(arr: T[], size: number): T[][] => {
      const chunked = [];
      for (let i = 0; i < arr.length; i += size) {
        chunked.push(arr.slice(i, i + size));
      }
      return chunked;
    };

    // A ranking row has 5 columns (type, novelId, rank, score, updatedAt)
    // We insert in chunks of 15 to stay well below SQLite's variable limit per query
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

    await db.batch(batchStatements as any);

    return new Response(
      JSON.stringify({ success: true, message: "排行榜数据已更新" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error: any) {
    console.error("Error generating rankings:", error);
    return new Response(JSON.stringify({ error: "生成排行榜失败" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
