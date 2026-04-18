globalThis.process ??= {};
globalThis.process.env ??= {};
import { c as createComponent } from "./astro-component_Czee9Eh7.mjs";
import { r as renderTemplate, c as renderSlot, a as renderHead, b as addAttribute, m as maybeRenderHead } from "./transition_DzUAhAmX.mjs";
import { r as renderComponent } from "./index_Hi_Vvptw.mjs";
import { env } from "cloudflare:workers";
/* empty css                 */
import { A as AuthForm } from "./auth-form_CSeDn_EB.mjs";
var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$AuthLayout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$AuthLayout;
  const { title = "Wuxia Dreams" } = Astro2.props;
  return renderTemplate(_a || (_a = __template(['<html lang="en"> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width"><link rel="icon" type="image/svg+xml" href="/favicon.svg"><link rel="icon" href="/favicon.ico"><meta name="generator"', '><meta name="color-scheme" content="dark light"><script>\n      (() => {\n        const stored = (() => {\n          try {\n            return localStorage.getItem("theme");\n          } catch {\n            return null;\n          }\n        })();\n\n        const prefersDark =\n          typeof window !== "undefined" &&\n          "matchMedia" in window &&\n          window.matchMedia("(prefers-color-scheme: dark)").matches;\n\n        const theme =\n          stored === "dark" || stored === "light"\n            ? stored\n            : prefersDark\n              ? "dark"\n              : "light";\n\n        const root = document.documentElement;\n        root.classList.toggle("dark", theme === "dark");\n        root.style.colorScheme = theme;\n      })();\n    <\/script><title>', "</title>", '</head> <body> <div class="min-h-dvh bg-background text-foreground"> ', " </div> </body></html>"])), addAttribute(Astro2.generator, "content"), title, renderHead(), renderSlot($$result, $$slots["default"]));
}, "/Users/yangfuzhang/Desktop/wuxiadreams/wuxiadreams.com/src/layouts/auth-layout.astro", void 0);
const $$Index = createComponent(($$result, $$props, $$slots) => {
  const adminEmails = env.ADMIN_EMAILS || "";
  return renderTemplate`${renderComponent($$result, "LayoutAuth", $$AuthLayout, { "title": "Sign in — Wuxia Dreams" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<main class="min-h-screen grid place-items-center p-4 sm:p-8 bg-background relative overflow-hidden">  <div class="absolute inset-0 z-0 pointer-events-none"> <div class="absolute -top-[25%] -left-[10%] w-[50%] h-[50%] rounded-full bg-primary/5 blur-[120px]"></div> <div class="absolute top-[60%] -right-[10%] w-[40%] h-[60%] rounded-full bg-primary/5 blur-[120px]"></div> </div> <div class="relative z-10 w-full max-w-[420px] rounded-2xl border border-border/40 bg-card/95 p-8 shadow-2xl backdrop-blur-xl"> ${renderComponent($$result2, "AuthForm", AuthForm, { "client:load": true, "adminEmails": adminEmails, "client:component-hydration": "load", "client:component-path": "@/components/auth-form", "client:component-export": "AuthForm" })} <p class="mt-6 text-center text-sm"> <a href="/" class="text-muted-foreground hover:text-foreground transition-colors hover:underline">
Back to home
</a> </p> </div> </main> ` })}`;
}, "/Users/yangfuzhang/Desktop/wuxiadreams/wuxiadreams.com/src/pages/auth/signin/index.astro", void 0);
const $$file = "/Users/yangfuzhang/Desktop/wuxiadreams/wuxiadreams.com/src/pages/auth/signin/index.astro";
const $$url = "/auth/signin";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page
};
