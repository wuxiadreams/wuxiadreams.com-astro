globalThis.process ??= {};
globalThis.process.env ??= {};
import { c as createComponent } from "./astro-component_Czee9Eh7.mjs";
import { r as renderTemplate, m as maybeRenderHead } from "./transition_DzUAhAmX.mjs";
import { r as renderComponent } from "./index_Hi_Vvptw.mjs";
import { $ as $$Layout } from "./layout_D8_XCjtG.mjs";
import $$RankingSection from "./RankingSection_3Mp71nj2.mjs";
import { R as RANK_TYPE } from "./constants_BOIxQnwR.mjs";
const $$Index = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Novel Rankings — Wuxia Dreams", "description": "Discover the most popular, trending, and highly rated novels across our entire library. Updated regularly." }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<main class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8"> <div class="mb-16 text-center max-w-2xl mx-auto"> <h1 class="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
Rankings
</h1> <p class="mt-4 text-lg text-muted-foreground leading-relaxed">
Discover the most popular, trending, and highly rated novels across our
        entire library. Updated regularly.
</p> </div>  <div class="grid gap-10 md:grid-cols-2 xl:grid-cols-3 mb-16"> <section class="rounded-3xl border border-border/70 bg-linear-to-b from-card/80 to-card/20 p-6 shadow-sm backdrop-blur-xl transition-all hover:shadow-lg"> ${renderComponent($$result2, "RankingSection", $$RankingSection, { "type": RANK_TYPE.WEEKLY, "server:defer": true, "server:component-directive": "defer", "server:component-path": "@/components/ranking-section.astro", "server:component-export": "default" }, { "fallback": ($$result3) => renderTemplate`<div class="flex h-96 items-center justify-center text-muted-foreground">
Loading weekly rankings...
</div>` })} </section> <section class="rounded-3xl border border-border/70 bg-gradient-to-b from-card/80 to-card/20 p-6 shadow-sm backdrop-blur-xl transition-all hover:shadow-lg"> ${renderComponent($$result2, "RankingSection", $$RankingSection, { "type": RANK_TYPE.MONTHLY, "server:defer": true, "server:component-directive": "defer", "server:component-path": "@/components/ranking-section.astro", "server:component-export": "default" }, { "fallback": ($$result3) => renderTemplate`<div class="flex h-96 items-center justify-center text-muted-foreground">
Loading monthly rankings...
</div>` })} </section> <section class="rounded-3xl border border-border/70 bg-gradient-to-b from-card/80 to-card/20 p-6 shadow-sm backdrop-blur-xl transition-all hover:shadow-lg"> ${renderComponent($$result2, "RankingSection", $$RankingSection, { "type": RANK_TYPE.RISING_STAR, "server:defer": true, "server:component-directive": "defer", "server:component-path": "@/components/ranking-section.astro", "server:component-export": "default" }, { "fallback": ($$result3) => renderTemplate`<div class="flex h-96 items-center justify-center text-muted-foreground">
Loading rising stars...
</div>` })} </section> </div>  <div class="my-16 flex items-center justify-center"> <div class="h-px w-full max-w-xs bg-border"></div> <div class="mx-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
More Rankings
</div> <div class="h-px w-full max-w-xs bg-border"></div> </div>  <div class="grid gap-10 md:grid-cols-2 xl:grid-cols-3"> <section class="rounded-2xl border border-border/40 bg-card/10 p-5 backdrop-blur transition-all hover:bg-card/30"> ${renderComponent($$result2, "RankingSection", $$RankingSection, { "type": RANK_TYPE.VIEW, "server:defer": true, "server:component-directive": "defer", "server:component-path": "@/components/ranking-section.astro", "server:component-export": "default" }, { "fallback": ($$result3) => renderTemplate`<div class="flex h-64 items-center justify-center text-muted-foreground text-sm">
Loading...
</div>` })} </section> <section class="rounded-2xl border border-border/40 bg-card/10 p-5 backdrop-blur transition-all hover:bg-card/30"> ${renderComponent($$result2, "RankingSection", $$RankingSection, { "type": RANK_TYPE.BOOKMARK, "server:defer": true, "server:component-directive": "defer", "server:component-path": "@/components/ranking-section.astro", "server:component-export": "default" }, { "fallback": ($$result3) => renderTemplate`<div class="flex h-64 items-center justify-center text-muted-foreground text-sm">
Loading...
</div>` })} </section> <section class="rounded-2xl border border-border/40 bg-card/10 p-5 backdrop-blur transition-all hover:bg-card/30 md:col-span-2 xl:col-span-1"> ${renderComponent($$result2, "RankingSection", $$RankingSection, { "type": RANK_TYPE.HIGH_RATED, "server:defer": true, "server:component-directive": "defer", "server:component-path": "@/components/ranking-section.astro", "server:component-export": "default" }, { "fallback": ($$result3) => renderTemplate`<div class="flex h-64 items-center justify-center text-muted-foreground text-sm">
Loading...
</div>` })} </section> </div> </main> ` })}`;
}, "/Users/yangfuzhang/Desktop/wuxiadreams/wuxiadreams.com/src/pages/rankings/index.astro", void 0);
const $$file = "/Users/yangfuzhang/Desktop/wuxiadreams/wuxiadreams.com/src/pages/rankings/index.astro";
const $$url = "/rankings";
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
