globalThis.process ??= {};
globalThis.process.env ??= {};
import { c as createComponent } from "./astro-component_Czee9Eh7.mjs";
import { r as renderTemplate, a as renderHead, b as addAttribute, c as renderSlot } from "./transition_DzUAhAmX.mjs";
import { r as renderComponent } from "./index_Hi_Vvptw.mjs";
/* empty css                 */
var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$AdminLayout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$AdminLayout;
  const { title = "Admin — Wuxia Dreams" } = Astro2.props;
  const pathname = Astro2.url.pathname;
  const user = Astro2.locals.user;
  return renderTemplate(_a || (_a = __template(['<html lang="en"> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width"><link rel="icon" type="image/svg+xml" href="/favicon.svg"><link rel="icon" href="/favicon.ico"><meta name="generator"', '><meta name="color-scheme" content="dark light"><script>\n      (() => {\n        const stored = (() => {\n          try {\n            return localStorage.getItem("theme");\n          } catch {\n            return null;\n          }\n        })();\n\n        const prefersDark =\n          typeof window !== "undefined" &&\n          "matchMedia" in window &&\n          window.matchMedia("(prefers-color-scheme: dark)").matches;\n\n        const theme =\n          stored === "dark" || stored === "light"\n            ? stored\n            : prefersDark\n              ? "dark"\n              : "light";\n\n        const root = document.documentElement;\n        root.classList.toggle("dark", theme === "dark");\n        root.style.colorScheme = theme;\n      })();\n    <\/script><title>', "</title>", "</head> <body> ", " </body></html>"])), addAttribute(Astro2.generator, "content"), title, renderHead(), renderComponent($$result, "AdminSidebarContainer", null, { "client:only": "react", "currentPath": pathname, "user": user, "client:component-hydration": "only", "client:component-path": "@/components/admin-sidebar-container", "client:component-export": "default" }, { "default": ($$result2) => renderTemplate` ${renderSlot($$result2, $$slots["default"])} ` }));
}, "/Users/yangfuzhang/Desktop/wuxiadreams/wuxiadreams.com/src/layouts/admin-layout.astro", void 0);
export {
  $$AdminLayout as $
};
