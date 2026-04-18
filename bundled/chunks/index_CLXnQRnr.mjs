globalThis.process ??= {};
globalThis.process.env ??= {};
import { c as createComponent } from "./astro-component_Czee9Eh7.mjs";
import { r as renderTemplate, m as maybeRenderHead, b as addAttribute } from "./transition_DzUAhAmX.mjs";
import { r as renderComponent } from "./index_Hi_Vvptw.mjs";
import { $ as $$Layout } from "./layout_D8_XCjtG.mjs";
import { $ as $$Image } from "./_astro_assets_D3btVnR0.mjs";
import { env } from "cloudflare:workers";
import { d as drizzle, a as schema, u as userLibrary, e as eq, n as novel, c as desc } from "./schema_98e5FuKX.mjs";
import { j as jsxRuntimeExports, f as formatDate } from "./button_COaE4f0C.mjs";
import "./worker-entry_BlhFEBb5.mjs";
import { t as toast } from "./index_j_ciBzFi.mjs";
import { A as AlertDialog, a as AlertDialogTrigger, T as Trash2, b as AlertDialogContent, c as AlertDialogHeader, d as AlertDialogTitle, e as AlertDialogDescription, f as AlertDialogFooter, g as AlertDialogCancel, h as AlertDialogAction } from "./alert-dialog_Z17w_ldF.mjs";
import { c as count } from "./aggregate_Dn_MtSgz.mjs";
function RemoveLibraryButton({ novelId, novelTitle }) {
  const handleRemove = async () => {
    try {
      const res = await fetch(`/api/library/${novelId}`, {
        method: "DELETE"
      });
      if (!res.ok) {
        throw new Error("Failed to remove novel from library");
      }
      toast.success(`${novelTitle} removed from library`);
      window.location.reload();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "An error occurred");
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialog, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        onClick: (e) => e.preventDefault(),
        className: "absolute right-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm transition-transform hover:scale-110 hover:bg-destructive/90 opacity-0 group-hover:opacity-100 focus:opacity-100",
        "aria-label": "Remove from library",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4" })
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogContent, { onClick: (e) => e.stopPropagation(), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTitle, { children: "Remove from library?" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogDescription, { children: [
          "This will remove ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-foreground", children: novelTitle }),
          " from your saved novels. You can always add it back later."
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogCancel, { onClick: (e) => e.stopPropagation(), children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          AlertDialogAction,
          {
            onClick: (e) => {
              e.stopPropagation();
              handleRemove();
            },
            className: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
            children: "Remove"
          }
        )
      ] })
    ] })
  ] });
}
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Index;
  const session = Astro2.locals.session;
  const user = Astro2.locals.user;
  if (!session || !user) {
    return Astro2.redirect("/");
  }
  const db = drizzle(env.DB, { schema });
  const url = new URL(Astro2.request.url);
  const currentPage = parseInt(url.searchParams.get("page") || "1");
  const pageSize = 20;
  const [{ value: totalNovels }] = await db.select({ value: count() }).from(userLibrary).where(eq(userLibrary.userId, user.id));
  const totalPages = Math.max(1, Math.ceil(totalNovels / pageSize));
  const getPageUrl = (page2) => {
    const newUrl = new URL(url);
    newUrl.searchParams.set("page", page2.toString());
    return newUrl.pathname + newUrl.search;
  };
  const userLibrary$1 = await db.select({
    novel,
    addedAt: userLibrary.createdAt
  }).from(userLibrary).innerJoin(novel, eq(userLibrary.novelId, novel.id)).where(eq(userLibrary.userId, user.id)).orderBy(desc(userLibrary.createdAt)).limit(pageSize).offset((currentPage - 1) * pageSize);
  const r2Domain = env.R2_DOMAIN;
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "My Library — Wuxia Dreams" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<main class="mx-auto max-w-6xl px-4 py-12"> <div class="mb-10"> <h1 class="text-3xl font-bold tracking-tight">My Library</h1> <p class="mt-2 text-muted-foreground">
Novels you've saved and are currently tracking.
</p> </div> ${userLibrary$1.length > 0 ? renderTemplate`<div class="grid gap-4 sm:gap-6 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5"> ${userLibrary$1.map(({ novel: novel2, addedAt }) => renderTemplate`<div class="group relative flex flex-col overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm transition hover:-translate-y-1 hover:shadow-md"> ${renderComponent($$result2, "RemoveLibraryButton", RemoveLibraryButton, { "client:load": true, "novelId": novel2.id, "novelTitle": novel2.title, "client:component-hydration": "load", "client:component-path": "@/components/remove-library-button", "client:component-export": "RemoveLibraryButton" })} <a${addAttribute(`/novel/${novel2.slug}`, "href")} class="flex h-full flex-col"> <div class="aspect-[2/3] w-full overflow-hidden bg-muted relative"> <div class="absolute left-2 top-2 z-10"> <span${addAttribute(`inline-flex items-center rounded-full border border-transparent px-2.5 py-0.5 text-[10px] font-semibold lowercase tracking-wider shadow backdrop-blur-sm ${novel2.status === "ongoing" ? "bg-chart-4/90 text-zinc-950" : "bg-primary/90 text-primary-foreground"}`, "class")}> ${novel2.status} </span> </div> ${novel2.cover ? renderTemplate`${renderComponent($$result2, "Image", $$Image, { "src": `https://${r2Domain}/${novel2.cover}`, "alt": novel2.title, "width": 200, "height": 300, "loading": "lazy", "decoding": "async", "class": "h-full w-full object-cover transition duration-500 group-hover:scale-105" })}` : renderTemplate`<div class="flex h-full w-full items-center justify-center text-muted-foreground">
No cover
</div>`} </div> <div class="flex flex-1 flex-col p-4"> <h3 class="line-clamp-2 text-base font-semibold leading-tight group-hover:text-primary transition-colors"> ${novel2.title} </h3> <div class="mt-2 text-xs text-muted-foreground flex items-center"> <span>${novel2.chapterCount} Chapters</span> </div> <div class="mt-auto pt-3 flex items-center justify-between text-xs text-muted-foreground"> <span class="flex items-center gap-1"> <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path> </svg> ${novel2.viewCount.toLocaleString()} </span> <span class="flex items-center gap-1"> <svg class="h-3.5 w-3.5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20"> <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path> </svg> ${novel2.score.toFixed(1)} </span> </div> <div class="mt-2 text-[11px] text-muted-foreground/70 border-t border-border/40 pt-2">
Added on ${formatDate(addedAt)} </div> </div> </a> </div>`)} </div>` : renderTemplate`<div class="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border/60 py-24 text-center"> <div class="rounded-full bg-muted/50 p-4"> <svg class="h-8 w-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path> </svg> </div> <h3 class="mt-4 text-lg font-semibold">Your library is empty</h3> <p class="mt-2 text-sm text-muted-foreground max-w-sm">
You haven't saved any novels yet. Browse the library to find
            something to read.
</p> <a href="/novels" class="mt-6 inline-flex h-10 items-center justify-center rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90">
Browse Novels
</a> </div>`} ${totalPages > 1 && renderTemplate`<div class="mt-12 flex items-center justify-center gap-2"> <a${addAttribute(getPageUrl(Math.max(1, currentPage - 1)), "href")}${addAttribute([
    "inline-flex h-10 items-center justify-center rounded-xl border border-border/70 bg-card px-4 text-sm font-medium transition hover:bg-muted",
    currentPage === 1 && "pointer-events-none opacity-50"
  ], "class:list")}>
Previous
</a> <div class="text-sm text-muted-foreground mx-4">
Page${" "} <span class="font-semibold text-foreground">${currentPage}</span> of${" "} ${totalPages} </div> <a${addAttribute(getPageUrl(Math.min(totalPages, currentPage + 1)), "href")}${addAttribute([
    "inline-flex h-10 items-center justify-center rounded-xl border border-border/70 bg-card px-4 text-sm font-medium transition hover:bg-muted",
    currentPage === totalPages && "pointer-events-none opacity-50"
  ], "class:list")}>
Next
</a> </div>`} </main> ` })}`;
}, "/Users/yangfuzhang/Desktop/wuxiadreams/wuxiadreams.com/src/pages/library/index.astro", void 0);
const $$file = "/Users/yangfuzhang/Desktop/wuxiadreams/wuxiadreams.com/src/pages/library/index.astro";
const $$url = "/library";
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
