import { env } from "cloudflare:workers";

export async function POST(context) {
  const { locals } = context;

  // 1. 管理员鉴权
  const email = locals?.user?.email;
  const adminEmails = (env.ADMIN_EMAILS ?? "").split(",");

  if (!email || !adminEmails.includes(email)) {
    return new Response(
      JSON.stringify({ error: "禁止访问：您没有管理员权限" }),
      {
        status: 403,
        headers: { "Content-Type": "application/json" },
      },
    );
  }

  // 2. 获取环境变量中的 Cloudflare 配置
  const ZONE_ID = env.CF_ZONE_ID;
  const API_TOKEN = env.CF_API_TOKEN;

  if (!ZONE_ID || !API_TOKEN) {
    return new Response(
      JSON.stringify({
        error:
          "服务器未配置 Cloudflare API 的相关凭证（CF_ZONE_ID 或 CF_API_TOKEN）",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }

  // 3. 调用 Cloudflare API 刷新全部缓存
  try {
    const response = await fetch(
      `https://api.cloudflare.com/client/v4/zones/${ZONE_ID}/purge_cache`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${API_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ purge_everything: true }),
      },
    );

    const data = (await response.json()) as any;

    if (!response.ok || !data.success) {
      return new Response(
        JSON.stringify({
          error: "通过 Cloudflare API 清理全站缓存失败",
          details: data.errors,
        }),
        {
          status: response.status || 500,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "全站缓存清理成功",
        data,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } },
    );
  } catch (err: any) {
    console.error("Error purging all cache:", err);
    return new Response(
      JSON.stringify({ error: "服务器内部错误", details: err.message }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
}
