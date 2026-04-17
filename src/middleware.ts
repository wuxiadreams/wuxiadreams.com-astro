import { auth } from "@/lib/auth";
import { env } from "cloudflare:workers";
import { defineMiddleware } from "astro:middleware";

const staticPaths = ["/dmca", "/privacy-policy", "/terms-of-service"];

export const onRequest = defineMiddleware(async (context, next) => {
  const isAuthed = await auth.api.getSession({
    headers: context.request.headers,
  });

  if (isAuthed) {
    context.locals.user = isAuthed.user;
    context.locals.session = isAuthed.session;
  } else {
    context.locals.user = null;
    context.locals.session = null;
  }

  if (context.url.pathname.startsWith("/admin")) {
    // 未登录统一跳转到首页
    if (!isAuthed) {
      return context.redirect("/");
    }

    // 登录用户校验是否为管理员
    const { user } = isAuthed;
    const email = user?.email;
    const adminEmails = (env.ADMIN_EMAILS ?? "").split(",");

    // 非管理员不能访问管理员后台
    if (!adminEmails.includes(email || "")) {
      return context.redirect("/");
    }
  }

  return next();
});
