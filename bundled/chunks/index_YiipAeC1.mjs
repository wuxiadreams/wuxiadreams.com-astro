globalThis.process ??= {};
globalThis.process.env ??= {};
import { c as createComponent } from "./astro-component_Czee9Eh7.mjs";
import { r as renderTemplate, m as maybeRenderHead, b as addAttribute } from "./transition_DzUAhAmX.mjs";
import { r as renderComponent } from "./index_Hi_Vvptw.mjs";
import { env } from "cloudflare:workers";
import { $ as $$Layout } from "./layout_D8_XCjtG.mjs";
import { $ as $$Image } from "./_astro_assets_D3btVnR0.mjs";
import { d as db } from "./db_1qztcB8G.mjs";
import { f as author, e as eq, n as novel, j as novelAuthor, b as and, c as desc } from "./schema_98e5FuKX.mjs";
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Index;
  const { slug } = Astro2.params;
  if (!slug) {
    return Astro2.redirect("/authors");
  }
  const authorData = await db.select().from(author).where(eq(author.slug, slug)).get();
  if (!authorData) {
    return Astro2.redirect("/authors");
  }
  const authorNovels = await db.select({
    id: novel.id,
    title: novel.title,
    slug: novel.slug,
    cover: novel.cover,
    status: novel.status,
    score: novel.score,
    viewCount: novel.viewCount,
    chapterCount: novel.chapterCount
  }).from(novelAuthor).innerJoin(novel, eq(novelAuthor.novelId, novel.id)).where(
    and(eq(novelAuthor.authorId, authorData.id), eq(novel.published, true))
  ).orderBy(desc(novel.viewCount));
  const r2Domain = env.R2_DOMAIN;
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": `${authorData.name} Novels | Wuxia Dreams`, "description": `Read all wuxia, xianxia, and fantasy novels written by ${authorData.name} (${authorData.nameAlt}).` }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<main class="mx-auto max-w-6xl px-4 py-12">  <nav class="mb-8 flex items-center gap-2 text-sm text-muted-foreground"> <a href="/" class="shrink-0 hover:text-foreground transition-colors">Home</a> <span class="shrink-0">/</span> <a href="/authors" class="shrink-0 hover:text-foreground transition-colors">Authors</a> <span class="shrink-0">/</span> <span class="text-foreground truncate min-w-0">${authorData.name}</span> </nav>  <div class="mb-12 rounded-3xl border border-border/70 bg-card/40 p-8 shadow-sm backdrop-blur md:p-10"> <div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"> <div> <h1 class="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl"> ${authorData.name} </h1> <h2 class="mt-2 text-lg text-muted-foreground"> ${authorData.nameAlt} </h2> </div> ${authorData.country && renderTemplate`<div class="mt-4 sm:mt-0 inline-flex items-center rounded-full border border-border/60 bg-muted/50 px-4 py-1.5 text-sm font-medium text-muted-foreground"> <svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path> </svg> ${authorData.country} </div>`} </div> <div class="mt-8 flex items-center gap-6 border-t border-border/50 pt-6"> <div class="flex flex-col"> <span class="text-sm font-medium text-muted-foreground">Novels</span> <span class="text-2xl font-bold text-foreground">${authorData.novelCount}</span> </div> </div> </div>  <div class="mb-8"> <h3 class="text-2xl font-bold tracking-tight text-foreground">Works</h3> </div> ${authorNovels.length > 0 ? renderTemplate`<div class="grid gap-4 sm:gap-6 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"> ${authorNovels.map((novel2) => renderTemplate`<a${addAttribute(`/novel/${novel2.slug}`, "href")} class="group relative flex flex-col overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm transition hover:-translate-y-1 hover:shadow-md"> <div class="aspect-[2/3] w-full overflow-hidden bg-muted relative"> <div class="absolute left-2 top-2 z-10"> <span${addAttribute(`inline-flex items-center rounded-full border border-transparent px-2.5 py-0.5 text-[10px] font-semibold lowercase tracking-wider shadow backdrop-blur-sm ${novel2.status === "ongoing" ? "bg-chart-4/90 text-zinc-950" : "bg-primary/90 text-primary-foreground"}`, "class")}> ${novel2.status} </span> </div> ${novel2.cover ? renderTemplate`${renderComponent($$result2, "Image", $$Image, { "src": `https://${r2Domain}/${novel2.cover}`, "alt": novel2.title, "width": 200, "height": 300, "loading": "lazy", "decoding": "async", "class": "h-full w-full object-cover transition duration-500 group-hover:scale-105" })}` : renderTemplate`<div class="flex h-full w-full items-center justify-center text-muted-foreground">
No cover
</div>`} </div> <div class="flex flex-1 flex-col p-4"> <h3 class="line-clamp-2 font-semibold text-foreground group-hover:text-primary transition-colors"> ${novel2.title} </h3> <div class="mt-2 text-xs text-muted-foreground flex items-center"> <span>${novel2.chapterCount} Chapters</span> </div> <div class="mt-auto pt-4 flex items-center justify-between text-xs text-muted-foreground"> <span class="flex items-center gap-1"> <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path> </svg> ${novel2.viewCount.toLocaleString()} </span> <span class="flex items-center gap-1"> <svg class="h-3 w-3 text-yellow-500" fill="currentColor" viewBox="0 0 20 20"> <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path> </svg> ${novel2.score.toFixed(1)} </span> </div> </div> </a>`)} </div>` : renderTemplate`<div class="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border/60 py-24 text-center"> <div class="rounded-full bg-muted p-4"> <svg class="h-8 w-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path> </svg> </div> <h3 class="mt-4 text-lg font-semibold text-foreground">
No Published Works
</h3> <p class="mt-2 text-sm text-muted-foreground max-w-sm">
We couldn't find any published novels by this author yet. Please
            check back later.
</p> </div>`} </main> ` })}`;
}, "/Users/yangfuzhang/Desktop/wuxiadreams/wuxiadreams.com/src/pages/author/[slug]/index.astro", void 0);
const $$file = "/Users/yangfuzhang/Desktop/wuxiadreams/wuxiadreams.com/src/pages/author/[slug]/index.astro";
const $$url = "/author/[slug]";
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
