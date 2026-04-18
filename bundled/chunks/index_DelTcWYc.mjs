globalThis.process ??= {};
globalThis.process.env ??= {};
import { c as createComponent } from "./astro-component_Czee9Eh7.mjs";
import { r as renderTemplate, m as maybeRenderHead } from "./transition_DzUAhAmX.mjs";
import { r as renderComponent } from "./index_Hi_Vvptw.mjs";
import { env } from "cloudflare:workers";
import { $ as $$AdminLayout } from "./admin-layout_D0L7BX6l.mjs";
import { B as Button } from "./button_COaE4f0C.mjs";
import { A as ArrowLeft } from "./arrow-left_C7nrK-Mj.mjs";
const $$Index = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Index;
  const r2Domain = env.R2_DOMAIN;
  const { id } = Astro2.params;
  if (!id) {
    return Astro2.redirect("/admin/novels");
  }
  return renderTemplate`${renderComponent($$result, "AdminLayout", $$AdminLayout, { "title": "编辑小说" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="flex flex-col gap-6"> <div class="flex items-center gap-4"> <a href="/admin/novels"> ${renderComponent($$result2, "Button", Button, { "variant": "outline", "size": "icon", "className": "h-8 w-8" }, { "default": ($$result3) => renderTemplate` ${renderComponent($$result3, "ArrowLeft", ArrowLeft, { "className": "h-4 w-4" })} <span class="sr-only">返回列表</span> ` })} </a> <div> <h1 class="text-2xl font-bold tracking-tight">编辑小说</h1> <p class="text-muted-foreground">修改小说基本信息与章节</p> </div> </div> ${renderComponent($$result2, "NovelForm", null, { "r2Domain": r2Domain, "novelId": id, "client:only": "react", "client:component-hydration": "only", "client:component-path": "/Users/yangfuzhang/Desktop/wuxiadreams/wuxiadreams.com/src/pages/admin/novels/_components/novel-form", "client:component-export": "default" })} </div> ` })}`;
}, "/Users/yangfuzhang/Desktop/wuxiadreams/wuxiadreams.com/src/pages/admin/novels/[id]/index.astro", void 0);
const $$file = "/Users/yangfuzhang/Desktop/wuxiadreams/wuxiadreams.com/src/pages/admin/novels/[id]/index.astro";
const $$url = "/admin/novels/[id]";
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
