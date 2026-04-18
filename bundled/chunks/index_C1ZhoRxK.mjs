globalThis.process ??= {};
globalThis.process.env ??= {};
import { c as createComponent } from "./astro-component_Czee9Eh7.mjs";
import { r as renderTemplate, m as maybeRenderHead } from "./transition_DzUAhAmX.mjs";
import { r as renderComponent } from "./index_Hi_Vvptw.mjs";
import { $ as $$Layout } from "./layout_D8_XCjtG.mjs";
import $$RankingSection from "./RankingSection_3Mp71nj2.mjs";
import { R as RANKING_METADATA } from "./rankings_UP0RH0m9.mjs";
const $$Index = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Index;
  const { type } = Astro2.params;
  if (!type || !RANKING_METADATA[type]) {
    return Astro2.redirect("/rankings");
  }
  const metadata = RANKING_METADATA[type];
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": `${metadata.title} - Rankings — Wuxia Dreams`, "description": metadata.description }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<main class="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8"> <div class="mb-12"> <div class="flex items-center gap-4 mb-4"> <a href="/rankings" class="flex h-10 w-10 items-center justify-center rounded-full bg-muted/50 text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors"> <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"> <path d="m15 18-6-6 6-6"></path> </svg> <span class="sr-only">Back to Rankings</span> </a> <h1 class="text-3xl font-extrabold tracking-tight flex items-center gap-3"> <span class="text-4xl">${metadata.icon}</span> ${metadata.title} </h1> </div> <p class="text-lg text-muted-foreground pl-14"> ${metadata.description}. Showing the complete top 100 ranking list.
</p> </div> <section class="rounded-3xl border border-border/70 bg-gradient-to-b from-card/80 to-card/20 p-6 shadow-sm backdrop-blur-xl"> ${renderComponent($$result2, "RankingSection", $$RankingSection, { "type": type, "limit": 100, "showHeader": false, "server:defer": true, "server:component-directive": "defer", "server:component-path": "@/components/ranking-section.astro", "server:component-export": "default" }, { "fallback": ($$result3) => renderTemplate`<div class="flex h-[50vh] flex-col items-center justify-center text-muted-foreground space-y-4"> <div class="h-8 w-8 animate-spin rounded-full border-4 border-primary border-r-transparent"></div> <p>Loading full ranking data...</p> </div>` })} </section> </main> ` })}`;
}, "/Users/yangfuzhang/Desktop/wuxiadreams/wuxiadreams.com/src/pages/ranking/[type]/index.astro", void 0);
const $$file = "/Users/yangfuzhang/Desktop/wuxiadreams/wuxiadreams.com/src/pages/ranking/[type]/index.astro";
const $$url = "/ranking/[type]";
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
