globalThis.process ??= {};
globalThis.process.env ??= {};
import { c as createComponent } from "./astro-component_Czee9Eh7.mjs";
import { r as renderTemplate, b as addAttribute, u as unescapeHTML, F as Fragment, m as maybeRenderHead } from "./transition_DzUAhAmX.mjs";
import { r as renderComponent } from "./index_Hi_Vvptw.mjs";
import { env } from "cloudflare:workers";
import { $ as $$Layout } from "./layout_D8_XCjtG.mjs";
import { $ as $$Image } from "./_astro_assets_D3btVnR0.mjs";
import { j as jsxRuntimeExports } from "./button_COaE4f0C.mjs";
import { r as reactExports } from "./worker-entry_BlhFEBb5.mjs";
import { t as toast } from "./index_j_ciBzFi.mjs";
import { A as AuthForm, a as authClient } from "./auth-form_CSeDn_EB.mjs";
import { D as Dialog, a as DialogContent } from "./dialog_CPwjDtap.mjs";
import { c as createLucideIcon } from "./createLucideIcon_BJ8PqZ8d.mjs";
import { a as actions } from "./server_B0Fce2x_.mjs";
const __iconNode$1 = [
  [
    "path",
    {
      d: "M17 3a2 2 0 0 1 2 2v15a1 1 0 0 1-1.496.868l-4.512-2.578a2 2 0 0 0-1.984 0l-4.512 2.578A1 1 0 0 1 5 20V5a2 2 0 0 1 2-2z",
      key: "oz39mx"
    }
  ],
  ["path", { d: "m9 10 2 2 4-4", key: "1gnqz4" }]
];
const BookmarkCheck = createLucideIcon("bookmark-check", __iconNode$1);
const __iconNode = [
  ["path", { d: "M12 7v6", key: "lw1j43" }],
  ["path", { d: "M15 10H9", key: "o6yqo3" }],
  [
    "path",
    {
      d: "M17 3a2 2 0 0 1 2 2v15a1 1 0 0 1-1.496.868l-4.512-2.578a2 2 0 0 0-1.984 0l-4.512 2.578A1 1 0 0 1 5 20V5a2 2 0 0 1 2-2z",
      key: "oz39mx"
    }
  ]
];
const BookmarkPlus = createLucideIcon("bookmark-plus", __iconNode);
function AddToLibraryButton({ novelId }) {
  const [isInLibrary, setIsInLibrary] = reactExports.useState(false);
  const [isLoading, setIsLoading] = reactExports.useState(true);
  const [isLoggedIn, setIsLoggedIn] = reactExports.useState(false);
  const [showAuthDialog, setShowAuthDialog] = reactExports.useState(false);
  const checkStatus = async () => {
    setIsLoading(true);
    const { data: session } = await authClient.getSession();
    if (!session) {
      setIsLoggedIn(false);
      setIsLoading(false);
      return;
    }
    setIsLoggedIn(true);
    try {
      const res = await fetch(`/api/library/status?novelId=${novelId}`);
      if (res.ok) {
        const data = await res.json();
        setIsInLibrary(data.isInLibrary);
      }
    } catch (e) {
      console.error("Failed to fetch library status");
    }
    setIsLoading(false);
  };
  reactExports.useEffect(() => {
    checkStatus();
  }, [novelId]);
  const handleToggle = async () => {
    if (!isLoggedIn) {
      toast.info("Please sign in to add to your library");
      setShowAuthDialog(true);
      return;
    }
    if (isLoading) return;
    setIsLoading(true);
    try {
      if (isInLibrary) {
        const res = await fetch(`/api/library/${novelId}`, {
          method: "DELETE"
        });
        if (!res.ok) throw new Error("Failed to remove");
        setIsInLibrary(false);
        toast.success("Removed from your library");
      } else {
        const res = await fetch("/api/library", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ novelId })
        });
        if (!res.ok) throw new Error("Failed to add");
        setIsInLibrary(true);
        toast.success("Added to your library");
      }
    } catch (e) {
      toast.error("An error occurred");
    } finally {
      setIsLoading(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        onClick: handleToggle,
        disabled: isLoading,
        className: `inline-flex h-11 items-center justify-center rounded-xl border border-border/70 px-6 text-sm font-semibold shadow-sm transition ${isInLibrary ? "bg-primary/10 text-primary hover:bg-primary/20 border-primary/20" : "bg-background text-foreground hover:bg-muted"} disabled:opacity-50`,
        children: isInLibrary ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(BookmarkCheck, { className: "mr-2 h-4 w-4" }),
          "In Library"
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(BookmarkPlus, { className: "mr-2 h-4 w-4" }),
          "Add to Library"
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: showAuthDialog, onOpenChange: setShowAuthDialog, children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogContent, { className: "sm:max-w-[400px] border-border/40 bg-card/95 backdrop-blur-xl shadow-2xl p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      AuthForm,
      {
        onSuccess: () => {
          setShowAuthDialog(false);
          checkStatus();
        }
      }
    ) }) })
  ] });
}
var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Index;
  const { slug } = Astro2.params;
  const url = new URL(Astro2.request.url);
  const currentPage = parseInt(url.searchParams.get("page") || "1");
  const sortOrder = url.searchParams.get("sort") === "desc" ? "desc" : "asc";
  const pageSize = 100;
  const r2Domain = env.R2_DOMAIN;
  if (!slug) {
    return Astro2.redirect("/novels");
  }
  let incrementView = false;
  const cookieName = `viewed_${slug}`;
  if (!Astro2.cookies.has(cookieName)) {
    incrementView = true;
    Astro2.cookies.set(cookieName, "1", { maxAge: 3600, path: "/" });
  }
  const { data: novelInfo, error } = await Astro2.callAction(
    actions.novel.getNovelInfo,
    {
      slug,
      currentPage,
      sortOrder,
      pageSize,
      incrementView
    }
  );
  if (error || !novelInfo?.novelData) {
    return Astro2.redirect("/novels");
  }
  const {
    novelData,
    authorsData,
    categoriesData,
    tagsData,
    chaptersData,
    totalChapters,
    firstChapterData,
    authorOtherNovels
  } = novelInfo;
  const totalPages = Math.max(1, Math.ceil(totalChapters / pageSize));
  const getPageUrl = (page2) => {
    const newUrl = new URL(url);
    newUrl.searchParams.set("page", page2.toString());
    return newUrl.pathname + newUrl.search;
  };
  const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    }).format(d);
  };
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Book",
    name: novelData.title,
    description: novelData.synopsis,
    image: `https://${r2Domain}/${novelData.cover}`,
    review: [
      {
        "@type": "Review",
        author: {
          "@type": "Person",
          name: "Wuxiadreams"
        },
        reviewRating: {
          "@type": "Rating",
          bestRating: 5,
          worstRating: 0,
          ratingValue: novelData.score
        }
      }
    ],
    aggregateRating: {
      "@type": "AggregateRating",
      bestRating: 5,
      worstRating: 0,
      ratingValue: novelData.score,
      ratingCount: novelData.reviewCount
    }
  };
  Astro2.cache.set({
    maxAge: 86400,
    swr: 60,
    tags: ["novel", `novel:${novelData.id}`]
  });
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": `${novelData.seoTitle || novelData.title} | Wuxia Dreams`, "description": novelData.seoDescription || novelData.synopsis?.slice(0, 150) || "" }, { "default": async ($$result2) => renderTemplate(_a || (_a = __template([' <script type="application/ld+json">', "<\/script> ", '<main class="container mx-auto max-w-6xl px-4 py-8 sm:py-12">  <nav class="mb-8 flex items-center gap-2 text-sm text-muted-foreground"> <a href="/" class="shrink-0 hover:text-foreground transition-colors">Home</a> <span class="shrink-0">/</span> <a href="/novels" class="shrink-0 hover:text-foreground transition-colors">Novels</a> <span class="shrink-0">/</span> <span class="text-foreground truncate min-w-0">', '</span> </nav> <div class="flex flex-col lg:flex-row gap-12">  <div class="flex flex-1 min-w-0 flex-col gap-10">  <div class="flex flex-col gap-6 sm:flex-row sm:items-start">  <div class="mx-auto w-48 shrink-0 overflow-hidden rounded-xl border border-border/50 bg-muted shadow-md sm:mx-0 sm:w-56 lg:w-64"> <div class="aspect-2/3 w-full"> ', ' </div> </div>  <div class="flex flex-1 flex-col"> <h1 class="text-3xl font-bold tracking-tight text-foreground sm:text-4xl"> ', " </h1> ", '  <div class="mt-4 flex items-start gap-2 text-sm"> <span class="font-medium text-foreground">Author:</span> ', ' </div>  <div class="mt-6 grid grid-cols-2 gap-4 rounded-2xl border border-border/60 bg-muted/30 p-4 sm:grid-cols-4"> <div class="flex flex-col"> <span class="text-xs text-muted-foreground">Chapters</span> <span class="mt-1 font-semibold text-foreground">', '</span> </div> <div class="flex flex-col"> <span class="text-xs text-muted-foreground">Views</span> <span class="mt-1 font-semibold text-foreground">', '</span> </div> <div class="flex flex-col"> <span class="text-xs text-muted-foreground">Score</span> <span class="mt-1 flex items-center gap-1 font-semibold text-foreground"> <svg class="h-4 w-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20"> <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path> </svg> ', ' </span> </div> <div class="flex flex-col"> <span class="text-xs text-muted-foreground">Status</span> <span class="mt-1 font-semibold text-foreground capitalize">', '</span> </div> </div>  <div class="mt-6 flex flex-wrap gap-3"> ', " ", ' </div> </div> </div>  <section class="scroll-mt-24"> <h3 class="mb-4 text-xl font-bold text-foreground">Synopsis</h3> <div class="prose prose-sm sm:prose-base prose-neutral dark:prose-invert max-w-none text-muted-foreground"> ', ' </div> </section>  <section class="scroll-mt-24"> <div class="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4"> <h3 class="text-xl font-bold text-foreground">Chapters</h3> <div class="flex items-center rounded-lg border border-border/60 bg-muted/30 p-1"> <a', "", '> <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"></path></svg>\nAsc\n</a> <a', "", '> <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4"></path></svg>\nDesc\n</a> </div> </div> ', " ", ' </section> </div>  <aside class="flex flex-col gap-8 w-full sm:w-64 lg:w-80 shrink-0">  <div class="rounded-2xl border border-border/60 bg-card p-6 shadow-sm"> <h3 class="mb-4 font-semibold text-foreground">Information</h3> <div class="flex flex-col gap-4"> ', " ", " </div> </div>  ", "  ", " </aside> </div> </main> "])), unescapeHTML(JSON.stringify(jsonLd)), maybeRenderHead(), novelData.title, novelData.cover ? renderTemplate`${renderComponent($$result2, "Image", $$Image, { "src": `https://${r2Domain}/${novelData.cover}`, "alt": novelData.title, "width": 300, "height": 450, "priority": true, "class": "h-full w-full object-cover" })}` : renderTemplate`<div class="flex h-full w-full items-center justify-center text-muted-foreground">
No cover
</div>`, novelData.title, novelData.titleAlt && renderTemplate`<h2 class="mt-2 text-lg text-muted-foreground"> ${novelData.titleAlt} </h2>`, authorsData.length > 0 ? authorsData.map((a, idx) => renderTemplate`${renderComponent($$result2, "Fragment", Fragment, {}, { "default": async ($$result3) => renderTemplate` <a${addAttribute(`/author/${a.slug}`, "href")} class="text-primary hover:underline"> <span>${a.name}</span> ${a.nameAlt && renderTemplate`<span class="text-xs text-muted-foreground">
(${a.nameAlt})
</span>`} </a> ${idx < authorsData.length - 1 && renderTemplate`<span class="text-muted-foreground">,</span>`}` })}`) : renderTemplate`<span class="text-muted-foreground">Unknown</span>`, novelData.chapterCount, novelData.viewCount.toLocaleString(), novelData.score.toFixed(1), novelData.status, firstChapterData ? renderTemplate`<a${addAttribute(`/novel/${novelData.slug}/chapter-${firstChapterData.number}`, "href")} class="inline-flex h-11 items-center justify-center rounded-xl bg-primary px-8 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90">
Start Reading
</a>` : renderTemplate`<button disabled class="inline-flex h-11 items-center justify-center rounded-xl bg-muted px-8 text-sm font-semibold text-muted-foreground cursor-not-allowed">
No Chapters
</button>`, renderComponent($$result2, "AddToLibraryButton", AddToLibraryButton, { "client:load": true, "novelId": novelData.id, "client:component-hydration": "load", "client:component-path": "@/components/add-to-library-button", "client:component-export": "AddToLibraryButton" }), novelData.synopsis ? renderTemplate`<div>${unescapeHTML(novelData.synopsis.replace(/\n/g, "<br/>"))}</div>` : renderTemplate`<p class="italic text-muted-foreground/70">
No synopsis available.
</p>`, addAttribute(`?page=1&sort=asc`, "href"), addAttribute(`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all ${sortOrder === "asc" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`, "class"), addAttribute(`?page=1&sort=desc`, "href"), addAttribute(`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all ${sortOrder === "desc" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`, "class"), chaptersData.length > 0 ? renderTemplate`<div class="grid gap-2 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2"> ${chaptersData.map((chapter) => renderTemplate`<a${addAttribute(`/novel/${novelData.slug}/chapter-${chapter.number}`, "href")} class="group flex flex-col justify-between rounded-xl border border-border/50 bg-card p-4 transition hover:border-primary/50 hover:bg-muted/30"> <span class="line-clamp-1 font-medium text-foreground group-hover:text-primary transition-colors"> ${chapter.title} </span> <div class="mt-2 flex items-center justify-between text-xs text-muted-foreground"> <span>${formatDate(chapter.createdAt)}</span> <span>${chapter.wordCount} words</span> </div> </a>`)} </div>` : renderTemplate`<div class="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/60 py-12 text-center"> <span class="text-muted-foreground">
No chapters available yet.
</span> </div>`, totalPages > 1 && renderTemplate`<div class="mt-8 flex items-center justify-center gap-2"> <a${addAttribute(getPageUrl(Math.max(1, currentPage - 1)), "href")}${addAttribute([
    "inline-flex h-10 items-center justify-center rounded-xl border border-border/70 bg-card px-4 text-sm font-medium transition hover:bg-muted",
    currentPage === 1 && "pointer-events-none opacity-50"
  ], "class:list")}>
Previous
</a> <div class="text-sm text-muted-foreground mx-4">
Page${" "} <span class="font-semibold text-foreground"> ${currentPage} </span>${" "}
of ${totalPages} </div> <a${addAttribute(getPageUrl(Math.min(totalPages, currentPage + 1)), "href")}${addAttribute([
    "inline-flex h-10 items-center justify-center rounded-xl border border-border/70 bg-card px-4 text-sm font-medium transition hover:bg-muted",
    currentPage === totalPages && "pointer-events-none opacity-50"
  ], "class:list")}>
Next
</a> </div>`, categoriesData.length > 0 && renderTemplate`<div> <div class="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
Genres
</div> <div class="flex flex-wrap gap-2"> ${categoriesData.map((cat) => renderTemplate`<a${addAttribute(`/genre/${cat.slug}`, "href")} class="inline-flex items-center rounded-md bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground transition-colors hover:bg-secondary/80"> ${cat.name} </a>`)} </div> </div>`, tagsData.length > 0 && renderTemplate`<div> <div class="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
Tags
</div> <div class="flex flex-wrap gap-2"> ${tagsData.map((tag) => renderTemplate`<a${addAttribute(`/tag/${tag.slug}`, "href")} class="inline-flex items-center rounded-md border border-border/60 bg-background px-2.5 py-0.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"> ${tag.name} </a>`)} </div> </div>`, (novelData.officialLink || novelData.translatedLink) && renderTemplate`<div class="rounded-2xl border border-border/60 bg-card p-6 shadow-sm"> <h3 class="mb-4 font-semibold text-foreground">External Links</h3> <div class="flex flex-col gap-3"> ${novelData.officialLink && renderTemplate`<a${addAttribute(novelData.officialLink, "href")} target="_blank" rel="noopener noreferrer" class="flex items-center text-sm text-primary hover:underline"> <svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path> </svg>
Official Raw
</a>`} ${novelData.translatedLink && renderTemplate`<a${addAttribute(novelData.translatedLink, "href")} target="_blank" rel="noopener noreferrer" class="flex items-center text-sm text-primary hover:underline"> <svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path> </svg>
Translation Source
</a>`} </div> </div>`, authorOtherNovels.length > 0 && renderTemplate`<div class="rounded-2xl border border-border/60 bg-card p-6 shadow-sm"> <div class="mb-4 flex items-center justify-between"> <h3 class="font-semibold text-foreground">
More by ${authorsData[0].name} </h3> </div> <div class="flex flex-col gap-4"> ${authorOtherNovels.map((n) => renderTemplate`<a${addAttribute(`/novel/${n.slug}`, "href")} class="group flex items-start gap-3 transition-colors"> <div class="relative w-12 h-16 shrink-0 overflow-hidden rounded-md border border-border/50 bg-muted"> ${n.cover ? renderTemplate`${renderComponent($$result2, "Image", $$Image, { "src": `https://${r2Domain}/${n.cover}`, "alt": n.title, "width": 48, "height": 64, "loading": "lazy", "decoding": "async", "class": "h-full w-full object-cover transition duration-300 group-hover:scale-105" })}` : renderTemplate`<div class="flex h-full items-center justify-center bg-muted"> <svg class="h-4 w-4 text-muted-foreground/30" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path> </svg> </div>`} </div> <div class="flex flex-col gap-1 py-0.5 min-w-0"> <span class="line-clamp-2 text-sm font-medium leading-tight text-foreground transition-colors group-hover:text-primary"> ${n.title} </span> <span class="flex items-center gap-1 text-xs text-muted-foreground flex-wrap"> <span class="flex items-center gap-0.5"> <svg class="h-3 w-3 text-yellow-500" fill="currentColor" viewBox="0 0 20 20"> <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path> </svg> ${n.score.toFixed(1)} </span> <span class="opacity-50">•</span> <span>${n.chapterCount} Chs</span> <span class="opacity-50">•</span> <span class="capitalize">${n.status}</span> </span> </div> </a>`)} </div> <a${addAttribute(`/author/${authorsData[0].slug}`, "href")} class="mt-4 block text-center text-sm font-medium text-primary hover:underline transition-colors">
View all
</a> </div>`) })}`;
}, "/Users/yangfuzhang/Desktop/wuxiadreams/wuxiadreams.com/src/pages/novel/[slug]/index.astro", void 0);
const $$file = "/Users/yangfuzhang/Desktop/wuxiadreams/wuxiadreams.com/src/pages/novel/[slug]/index.astro";
const $$url = "/novel/[slug]";
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
