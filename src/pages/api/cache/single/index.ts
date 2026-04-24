import { env } from "cloudflare:workers";

export async function POST(context) {
  const { locals, request } = context;

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

  // 2. 提取请求参数
  let urls: string[];
  try {
    const body = (await request.json()) as { urls?: string[] };
    urls = body.urls || [];

    if (!urls || !Array.isArray(urls) || urls.length === 0) {
      return new Response(
        JSON.stringify({ error: "无效的请求：请提供包含需要清理 URL 的数组" }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }
  } catch (err) {
    return new Response(JSON.stringify({ error: "解析请求体 JSON 失败" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  // 3. 获取环境变量中的 Cloudflare 配置
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

  // 4. 调用 Cloudflare API 刷新缓存
  try {
    const response = await fetch(
      `https://api.cloudflare.com/client/v4/zones/${ZONE_ID}/purge_cache`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${API_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ files: urls }),
      },
    );

    const data = (await response.json()) as any;

    if (!response.ok || !data.success) {
      return new Response(
        JSON.stringify({
          error: "通过 Cloudflare API 清理缓存失败",
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
        message: "缓存清理成功",
        data,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } },
    );
  } catch (err: any) {
    console.error("Error purging cache:", err);
    return new Response(
      JSON.stringify({ error: "服务器内部错误", details: err.message }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
}
