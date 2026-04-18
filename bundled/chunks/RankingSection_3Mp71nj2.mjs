globalThis.process ??= {};
globalThis.process.env ??= {};
import { c as createComponent } from "./astro-component_Czee9Eh7.mjs";
import { m as maybeRenderHead, b as addAttribute, r as renderTemplate } from "./transition_DzUAhAmX.mjs";
import { r as renderComponent } from "./index_Hi_Vvptw.mjs";
import { env } from "cloudflare:workers";
import { $ as $$Image } from "./_astro_assets_D3btVnR0.mjs";
import { d as drizzle, a as schema } from "./schema_98e5FuKX.mjs";
import { f as fetchRankingData, R as RANKING_METADATA } from "./rankings_UP0RH0m9.mjs";
const $$RankingSection = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$RankingSection;
  const { type, limit = 10, showHeader = true } = Astro2.props;
  const db = drizzle(env.DB, { schema });
  const novels = await fetchRankingData(db, type, limit);
  const metadata = RANKING_METADATA[type];
  const r2Domain = env.R2_DOMAIN;
  return renderTemplate`${showHeader && renderTemplate`${maybeRenderHead()}<div class="mb-4 flex items-end justify-between"><div><h2 class="text-2xl font-bold tracking-tight flex items-center gap-2"><span>${metadata.icon}</span>${metadata.title}</h2><p class="text-sm text-muted-foreground mt-1">${metadata.description}</p></div><a${addAttribute(`/ranking/${type}`, "href")} class="text-sm font-medium text-primary hover:underline">
View All
</a></div>`}${novels.length > 0 ? renderTemplate`<div class="flex flex-col gap-3">${novels.map((novel, index) => renderTemplate`<a${addAttribute(`/novel/${novel.slug}`, "href")} class="group flex items-center gap-4 overflow-hidden rounded-xl border border-border/40 bg-card/40 p-3 transition-all hover:bg-muted/60 hover:shadow-md hover:-translate-y-0.5"><div${addAttribute(`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg font-bold text-sm transition-colors ${index === 0 ? "bg-yellow-500/20 text-yellow-600 dark:text-yellow-500" : index === 1 ? "bg-slate-300/30 text-slate-500 dark:text-slate-400" : index === 2 ? "bg-amber-700/20 text-amber-700 dark:text-amber-600" : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"}`, "class")}>${index + 1}</div><div class="h-16 w-12 shrink-0 overflow-hidden rounded bg-muted/50 relative shadow-sm">${novel.cover ? renderTemplate`${renderComponent($$result, "Image", $$Image, { "src": `https://${r2Domain}/${novel.cover}`, "alt": novel.title, "width": 48, "height": 64, "loading": "lazy", "decoding": "async", "class": "h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" })}` : renderTemplate`<div class="h-full w-full bg-muted/80"></div>`}</div><div class="flex flex-1 flex-col min-w-0 py-1"><h3 class="line-clamp-2 text-sm font-medium text-foreground group-hover:text-primary transition-colors leading-tight"${addAttribute(novel.title, "title")}>${novel.title}</h3><div class="mt-1.5 flex items-center gap-2 text-xs text-muted-foreground/80"><span class="font-medium text-muted-foreground">${metadata.formatValue(novel)}</span><span class="opacity-50">•</span><span class="truncate">${novel.status}</span></div></div></a>`)}</div>` : renderTemplate`<div class="flex h-40 items-center justify-center rounded-xl border border-dashed border-border/60 bg-muted/10 text-sm text-muted-foreground">
No rankings available right now.
</div>`}`;
}, "/Users/yangfuzhang/Desktop/wuxiadreams/wuxiadreams.com/src/components/ranking-section.astro", void 0);
const $$file = "/Users/yangfuzhang/Desktop/wuxiadreams/wuxiadreams.com/src/components/ranking-section.astro";
const $$url = void 0;
export {
  $$RankingSection as default,
  $$file as file,
  $$url as url
};
