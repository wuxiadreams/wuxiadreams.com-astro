globalThis.process ??= {};
globalThis.process.env ??= {};
import { f as auth } from "./chunks/auth_gvp7x7tU.mjs";
import { env } from "cloudflare:workers";
import { d as defineMiddleware, s as sequence } from "./chunks/sequence_BN2_VHP0.mjs";
import "./chunks/transition_DzUAhAmX.mjs";
const onRequest$1 = defineMiddleware(async (context, next) => {
  const isAuthed = await auth.api.getSession({
    headers: context.request.headers
  });
  if (isAuthed) {
    context.locals.user = isAuthed.user;
    context.locals.session = isAuthed.session;
  } else {
    context.locals.user = null;
    context.locals.session = null;
  }
  if (context.url.pathname.startsWith("/admin")) {
    if (!isAuthed) {
      return context.redirect("/");
    }
    const { user } = isAuthed;
    const email = user?.email;
    const adminEmails = (env.ADMIN_EMAILS ?? "").split(",");
    if (!adminEmails.includes(email || "")) {
      return context.redirect("/");
    }
  }
  return next();
});
const onRequest = sequence(
  onRequest$1
);
export {
  onRequest
};
