import { env } from "cloudflare:workers";
import { count, eq, ne } from "drizzle-orm";
import { db } from "@/lib/db";
import { novel } from "@/db/schema";

export async function GET({
  locals,
}: {
  locals: any;
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
    const [totalResult, zeroResult, nonZeroResult] = await Promise.all([
      db.select({ value: count() }).from(novel),
      db
        .select({ value: count() })
        .from(novel)
        .where(eq(novel.chapterCount, 0)),
      db
        .select({ value: count() })
        .from(novel)
        .where(ne(novel.chapterCount, 0)),
    ]);

    return new Response(
      JSON.stringify({
        total: totalResult[0]?.value ?? 0,
        chapterCountZero: zeroResult[0]?.value ?? 0,
        chapterCountNonZero: nonZeroResult[0]?.value ?? 0,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: "获取小说统计失败" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
