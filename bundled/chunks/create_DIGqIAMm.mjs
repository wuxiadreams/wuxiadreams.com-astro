globalThis.process ??= {};
globalThis.process.env ??= {};
import { c as createComponent } from "./astro-component_Czee9Eh7.mjs";
import { r as renderTemplate, m as maybeRenderHead } from "./transition_DzUAhAmX.mjs";
import { r as renderComponent } from "./index_Hi_Vvptw.mjs";
import { $ as $$AdminLayout } from "./admin-layout_D0L7BX6l.mjs";
import { A as ArrowLeft } from "./arrow-left_C7nrK-Mj.mjs";
const $$Create = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "AdminLayout", $$AdminLayout, { "title": "新建文章" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="flex flex-col gap-6"> <div class="flex items-center gap-4"> <a href="/admin/posts" class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 w-10"> ${renderComponent($$result2, "ArrowLeft", ArrowLeft, { "className": "h-4 w-4" })} <span class="sr-only">返回列表</span> </a> <div> <h1 class="text-2xl font-bold tracking-tight">新建文章</h1> <p class="text-muted-foreground">在平台上创建一篇新的文章或公告</p> </div> </div> ${renderComponent($$result2, "PostForm", null, { "client:only": "react", "client:component-hydration": "only", "client:component-path": "/Users/yangfuzhang/Desktop/wuxiadreams/wuxiadreams.com/src/pages/admin/posts/_form.tsx", "client:component-export": "default" })} </div> ` })}`;
}, "/Users/yangfuzhang/Desktop/wuxiadreams/wuxiadreams.com/src/pages/admin/posts/create.astro", void 0);
const $$file = "/Users/yangfuzhang/Desktop/wuxiadreams/wuxiadreams.com/src/pages/admin/posts/create.astro";
const $$url = "/admin/posts/create";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$Create,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page
};
