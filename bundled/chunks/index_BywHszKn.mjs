globalThis.process ??= {};
globalThis.process.env ??= {};
import { c as createComponent } from "./astro-component_Czee9Eh7.mjs";
import { r as renderTemplate, m as maybeRenderHead, b as addAttribute } from "./transition_DzUAhAmX.mjs";
import { r as renderComponent } from "./index_Hi_Vvptw.mjs";
import { $ as $$Layout } from "./layout_D8_XCjtG.mjs";
import { env } from "cloudflare:workers";
import { d as drizzle, a as schema, v as tag } from "./schema_98e5FuKX.mjs";
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const db = drizzle(env.DB, { schema });
  const allTags = await db.select({
    id: tag.id,
    name: tag.name,
    slug: tag.slug,
    novelCount: tag.novelCount
  }).from(tag).orderBy(tag.name);
  const tagsByLetter = allTags.reduce(
    (acc, tag2) => {
      const letter = tag2.name.charAt(0).toUpperCase();
      const validLetter = /[A-Z]/.test(letter) ? letter : "#";
      if (!acc[validLetter]) acc[validLetter] = [];
      acc[validLetter].push(tag2);
      return acc;
    },
    {}
  );
  const sortedLetters = Object.keys(tagsByLetter).sort((a, b) => {
    if (a === "#") return 1;
    if (b === "#") return -1;
    return a.localeCompare(b);
  });
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "All Novel Tags — Wuxia Dreams", "description": "Explore free online novels by different tags." }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<main class="mx-auto max-w-6xl px-4 py-12"> <div class="mb-12"> <h1 class="text-3xl font-bold tracking-tight">Tags</h1> <p class="mt-2 text-muted-foreground">
Explore novels by different tags and genres.
</p> </div> <div class="sticky top-16 z-30 mb-10 -mx-4 overflow-x-auto bg-background/95 px-4 py-3 backdrop-blur border-b border-border/60 sm:mx-0 sm:px-0"> <div class="flex items-center gap-1.5 min-w-max"> ${sortedLetters.map((letter) => renderTemplate`<a${addAttribute(`#letter-${letter}`, "href")} class="flex h-8 w-8 items-center justify-center rounded-lg text-sm font-medium transition hover:bg-muted"> ${letter} </a>`)} </div> </div> ${sortedLetters.length > 0 ? renderTemplate`<div class="grid gap-10"> ${sortedLetters.map((letter) => renderTemplate`<section${addAttribute(`letter-${letter}`, "id")} class="scroll-mt-32"> <h2 class="mb-5 flex items-center gap-4 text-xl font-bold text-muted-foreground"> <span class="flex h-10 w-10 items-center justify-center rounded-xl bg-muted text-foreground"> ${letter} </span> <div class="h-px flex-1 bg-border/60"></div> </h2> <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"> ${tagsByLetter[letter].map((tag2) => renderTemplate`<a${addAttribute(`/tag/${tag2.slug}`, "href")} class="group flex items-center justify-between gap-4 rounded-2xl border border-border/60 bg-card p-4 shadow-sm transition hover:border-primary/50 hover:bg-muted/30 hover:shadow-md"> <div class="flex flex-col min-w-0 flex-1"> <span class="font-semibold group-hover:text-primary transition-colors truncate"> ${tag2.name} </span> </div> <div class="flex h-8 min-w-max items-center justify-center rounded-full bg-muted px-2.5 text-xs font-medium text-muted-foreground transition-colors group-hover:bg-primary/10 group-hover:text-primary whitespace-nowrap"> ${tag2.novelCount}${" "} ${tag2.novelCount === 1 ? "novel" : "novels"} </div> </a>`)} </div> </section>`)} </div>` : renderTemplate`<div class="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border/60 py-24 text-center"> <h3 class="text-lg font-semibold">No tags found</h3> <p class="mt-2 text-sm text-muted-foreground">
There are currently no tags in the database.
</p> </div>`} </main> ` })}`;
}, "/Users/yangfuzhang/Desktop/wuxiadreams/wuxiadreams.com/src/pages/tags/index.astro", void 0);
const $$file = "/Users/yangfuzhang/Desktop/wuxiadreams/wuxiadreams.com/src/pages/tags/index.astro";
const $$url = "/tags";
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
