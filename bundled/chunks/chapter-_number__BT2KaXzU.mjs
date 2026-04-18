globalThis.process ??= {};
globalThis.process.env ??= {};
import { c as createComponent } from "./astro-component_Czee9Eh7.mjs";
import { r as renderTemplate, Q as defineScriptVars, b as addAttribute, m as maybeRenderHead, u as unescapeHTML } from "./transition_DzUAhAmX.mjs";
import { r as renderComponent } from "./index_Hi_Vvptw.mjs";
import { env } from "cloudflare:workers";
import { D as Drawer, a as DrawerTrigger, b as DrawerContent, c as DrawerHeader, d as DrawerTitle, e as DrawerDescription, f as DrawerFooter, g as DrawerClose, $ as $$Layout } from "./layout_D8_XCjtG.mjs";
import { a as actions } from "./server_B0Fce2x_.mjs";
import { j as jsxRuntimeExports, f as formatDate } from "./button_COaE4f0C.mjs";
import { r as reactExports } from "./worker-entry_BlhFEBb5.mjs";
import { D as DropdownMenu, a as DropdownMenuTrigger, b as DropdownMenuContent, c as DropdownMenuLabel, e as DropdownMenuSeparator, h as DropdownMenuGroup } from "./dropdown-menu_DdOLljpj.mjs";
import { c as createLucideIcon } from "./createLucideIcon_BJ8PqZ8d.mjs";
import { A as ArrowUpDown } from "./arrow-up-down_Bu7y6Yn6.mjs";
const __iconNode$7 = [["path", { d: "m15 18-6-6 6-6", key: "1wnfg3" }]];
const ChevronLeft = createLucideIcon("chevron-left", __iconNode$7);
const __iconNode$6 = [["path", { d: "m9 18 6-6-6-6", key: "mthhwq" }]];
const ChevronRight = createLucideIcon("chevron-right", __iconNode$6);
const __iconNode$5 = [
  ["path", { d: "M10 5h11", key: "1hkqpe" }],
  ["path", { d: "M10 12h11", key: "6m4ad9" }],
  ["path", { d: "M10 19h11", key: "14g2nv" }],
  ["path", { d: "m3 10 3-3-3-3", key: "i7pm08" }],
  ["path", { d: "m3 20 3-3-3-3", key: "20gx1n" }]
];
const ListCollapse = createLucideIcon("list-collapse", __iconNode$5);
const __iconNode$4 = [["path", { d: "M5 12h14", key: "1ays0h" }]];
const Minus = createLucideIcon("minus", __iconNode$4);
const __iconNode$3 = [
  ["path", { d: "M5 12h14", key: "1ays0h" }],
  ["path", { d: "M12 5v14", key: "s699le" }]
];
const Plus = createLucideIcon("plus", __iconNode$3);
const __iconNode$2 = [
  [
    "path",
    {
      d: "M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915",
      key: "1i5ecw"
    }
  ],
  ["circle", { cx: "12", cy: "12", r: "3", key: "1v7zrd" }]
];
const Settings = createLucideIcon("settings", __iconNode$2);
const __iconNode$1 = [
  ["path", { d: "M21 5H3", key: "1fi0y6" }],
  ["path", { d: "M15 12H3", key: "6jk70r" }],
  ["path", { d: "M17 19H3", key: "z6ezky" }]
];
const TextAlignStart = createLucideIcon("text-align-start", __iconNode$1);
const __iconNode = [
  ["path", { d: "M12 4v16", key: "1654pz" }],
  ["path", { d: "M4 7V5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v2", key: "e0r10z" }],
  ["path", { d: "M9 20h6", key: "s66wpe" }]
];
const Type = createLucideIcon("type", __iconNode);
function ChapterSettings({
  triggerClassName,
  showText = true
}) {
  const [fontSize, setFontSize] = reactExports.useState(18);
  const [lineHeight, setLineHeight] = reactExports.useState(1.8);
  const [paragraphSpacing, setParagraphSpacing] = reactExports.useState(1.5);
  reactExports.useEffect(() => {
    const savedFontSize = localStorage.getItem("wd-chapter-font-size");
    const savedLineHeight = localStorage.getItem("wd-chapter-line-height");
    const savedParagraphSpacing = localStorage.getItem(
      "wd-chapter-paragraph-spacing"
    );
    if (savedFontSize) setFontSize(Number(savedFontSize));
    if (savedLineHeight) setLineHeight(Number(savedLineHeight));
    if (savedParagraphSpacing)
      setParagraphSpacing(Number(savedParagraphSpacing));
  }, []);
  reactExports.useEffect(() => {
    document.documentElement.style.setProperty(
      "--chapter-font-size",
      `${fontSize}px`
    );
    document.documentElement.style.setProperty(
      "--chapter-line-height",
      `${lineHeight}`
    );
    document.documentElement.style.setProperty(
      "--chapter-paragraph-spacing",
      `${paragraphSpacing}em`
    );
    localStorage.setItem("wd-chapter-font-size", fontSize.toString());
    localStorage.setItem("wd-chapter-line-height", lineHeight.toString());
    localStorage.setItem(
      "wd-chapter-paragraph-spacing",
      paragraphSpacing.toString()
    );
  }, [fontSize, lineHeight, paragraphSpacing]);
  const increaseFontSize = (e) => {
    e.preventDefault();
    setFontSize((prev) => Math.min(prev + 2, 32));
  };
  const decreaseFontSize = (e) => {
    e.preventDefault();
    setFontSize((prev) => Math.max(prev - 2, 12));
  };
  const increaseLineHeight = (e) => {
    e.preventDefault();
    setLineHeight((prev) => Math.min(prev + 0.2, 3));
  };
  const decreaseLineHeight = (e) => {
    e.preventDefault();
    setLineHeight((prev) => Math.max(prev - 0.2, 1.2));
  };
  const increaseParagraphSpacing = (e) => {
    e.preventDefault();
    setParagraphSpacing((prev) => Math.min(prev + 0.5, 4));
  };
  const decreaseParagraphSpacing = (e) => {
    e.preventDefault();
    setParagraphSpacing((prev) => Math.max(prev - 0.5, 0.5));
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenu, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        className: `inline-flex items-center justify-center rounded-xl bg-secondary text-sm font-medium text-secondary-foreground transition hover:bg-secondary/80 ${triggerClassName || "h-10 px-4"}`,
        "aria-label": "Chapter Settings",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Settings,
            {
              className: `${showText ? "mr-2 h-4 w-4" : "h-5 w-5 text-foreground dark:text-foreground/90"}`
            }
          ),
          showText && "Settings"
        ]
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuContent, { align: "end", className: "w-64 p-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuLabel, { children: "Display Settings" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuSeparator, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuGroup, { className: "p-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center text-sm font-medium text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Type, { className: "mr-2 h-4 w-4" }),
            "Font Size"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
            fontSize,
            "px"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: decreaseFontSize,
              disabled: fontSize <= 12,
              className: "flex h-8 w-full items-center justify-center rounded-md border border-border bg-background hover:bg-muted disabled:opacity-50",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Minus, { className: "h-4 w-4" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: increaseFontSize,
              disabled: fontSize >= 32,
              className: "flex h-8 w-full items-center justify-center rounded-md border border-border bg-background hover:bg-muted disabled:opacity-50",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" })
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuSeparator, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuGroup, { className: "p-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center text-sm font-medium text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUpDown, { className: "mr-2 h-4 w-4" }),
            "Line Height"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: lineHeight.toFixed(1) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: decreaseLineHeight,
              disabled: lineHeight <= 1.2,
              className: "flex h-8 w-full items-center justify-center rounded-md border border-border bg-background hover:bg-muted disabled:opacity-50",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Minus, { className: "h-4 w-4" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: increaseLineHeight,
              disabled: lineHeight >= 3,
              className: "flex h-8 w-full items-center justify-center rounded-md border border-border bg-background hover:bg-muted disabled:opacity-50",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" })
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuSeparator, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuGroup, { className: "p-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center text-sm font-medium text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TextAlignStart, { className: "mr-2 h-4 w-4" }),
            "Spacing"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
            paragraphSpacing.toFixed(1),
            "em"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: decreaseParagraphSpacing,
              disabled: paragraphSpacing <= 0.5,
              className: "flex h-8 w-full items-center justify-center rounded-md border border-border bg-background hover:bg-muted disabled:opacity-50",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Minus, { className: "h-4 w-4" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: increaseParagraphSpacing,
              disabled: paragraphSpacing >= 4,
              className: "flex h-8 w-full items-center justify-center rounded-md border border-border bg-background hover:bg-muted disabled:opacity-50",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" })
            }
          )
        ] })
      ] })
    ] })
  ] });
}
function ChapterIndexDrawer({
  novelId,
  novelSlug,
  novelTitle,
  totalChapters,
  triggerClassName,
  showText = true
}) {
  const [open, setOpen] = reactExports.useState(false);
  const [chapters, setChapters] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(false);
  const [page2, setPage] = reactExports.useState(1);
  const pageSize = 100;
  const totalPages = Math.max(1, Math.ceil(totalChapters / pageSize));
  const formatDate2 = (date) => {
    if (!date) return "";
    const d = new Date(date);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    }).format(d);
  };
  const loadChapters = async (targetPage) => {
    setLoading(true);
    try {
      const { data, error } = await actions.chapter.getNovelChapters({
        novelId,
        page: targetPage,
        pageSize
      });
      if (!error && data?.chapters) {
        setChapters(data.chapters);
        setPage(targetPage);
      }
    } catch (err) {
      console.error("Failed to load chapters:", err);
    } finally {
      setLoading(false);
    }
  };
  reactExports.useEffect(() => {
    if (open && chapters.length === 0) {
      loadChapters(1);
    }
  }, [open]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Drawer, { open, onOpenChange: setOpen, direction: "right", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DrawerTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        className: `inline-flex items-center justify-center rounded-xl bg-secondary text-sm font-medium text-secondary-foreground transition hover:bg-secondary/80 ${triggerClassName || "h-10 px-4"}`,
        "aria-label": "Table of Contents",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            ListCollapse,
            {
              className: `${showText ? "mr-2 h-4 w-4" : "h-5 w-5 text-foreground dark:text-foreground/90"}`
            }
          ),
          showText && "Index"
        ]
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(DrawerContent, { className: "h-screen top-0 right-0 left-auto mt-0 w-[75vw] sm:w-[400px] rounded-none", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto w-full flex flex-col h-full overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DrawerHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DrawerTitle, { className: "text-xl font-bold", children: [
          novelTitle,
          " - Index"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DrawerDescription, { children: [
          totalChapters,
          " published chapters"
        ] })
      ] }),
      totalPages > 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 py-2 flex items-center justify-between border-b border-border/50", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: () => loadChapters(page2 - 1),
            disabled: page2 <= 1 || loading,
            className: "inline-flex items-center justify-center rounded-md px-3 py-1.5 text-sm font-medium transition hover:bg-muted disabled:opacity-50",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "mr-1 h-4 w-4" }),
              " Prev"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm text-muted-foreground", children: [
          "Page",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-foreground", children: page2 }),
          " of",
          " ",
          totalPages
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: () => loadChapters(page2 + 1),
            disabled: page2 >= totalPages || loading,
            className: "inline-flex items-center justify-center rounded-md px-3 py-1.5 text-sm font-medium transition hover:bg-muted disabled:opacity-50",
            children: [
              "Next ",
              /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "ml-1 h-4 w-4" })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-y-auto p-4", children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center py-12", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Loading chapters..." }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-2 grid-cols-1", children: chapters.map((chapter) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "a",
        {
          href: `/novel/${novelSlug}/chapter-${chapter.number}`,
          className: "group flex flex-col justify-between rounded-xl border border-border/50 bg-card p-3 transition hover:border-primary/50 hover:bg-muted/30",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "line-clamp-1 font-medium text-foreground group-hover:text-primary transition-colors text-sm", children: chapter.title }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1 flex items-center justify-between text-[10px] text-muted-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: formatDate2(chapter.createdAt) }),
              chapter.wordCount !== void 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                chapter.wordCount,
                " words"
              ] })
            ] })
          ]
        },
        chapter.id
      )) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(DrawerFooter, { className: "pt-2 pb-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(DrawerClose, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "inline-flex h-10 w-full items-center justify-center rounded-xl border border-border bg-background px-4 text-sm font-medium transition hover:bg-muted", children: "Close" }) }) })
    ] }) })
  ] });
}
var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Chapternumber = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Chapternumber;
  const { slug, number } = Astro2.params;
  const chapterNumber = Number(number);
  const r2Domain = env.R2_DOMAIN;
  if (!slug || isNaN(chapterNumber)) {
    return Astro2.redirect("/novels");
  }
  const { data: chapterDataResult, error: actionError } = await Astro2.callAction(
    actions.chapter.getChapterData,
    {
      slug,
      chapterNumber
    }
  );
  if (actionError || !chapterDataResult?.data) {
    if (chapterDataResult?.error === "Chapter not found" && chapterDataResult.data?.novelData) {
      return Astro2.redirect(`/novel/${chapterDataResult.data.novelData.slug}`);
    }
    return Astro2.redirect("/novels");
  }
  const { novelData, currentChapter, prevChapter, nextChapter, totalChapters } = chapterDataResult.data;
  let chapterContent = "";
  try {
    const result = await Astro2.callAction(actions.chapter.fetchChapterContent, {
      fileKey: currentChapter.fileKey
    });
    if (result.data?.data) {
      chapterContent = result.data.data;
    } else {
      chapterContent = "Error loading chapter content. Please try again later.";
      console.error(
        `Failed to fetch chapter content from R2: ${result.data?.error || result.error?.message}`
      );
    }
  } catch (error) {
    chapterContent = "Error loading chapter content. Please try again later.";
    console.error("Error fetching chapter content:", error);
  }
  let contentParagraphs = chapterContent.split("\n").filter((p) => p.trim() !== "");
  contentParagraphs = contentParagraphs.length > 0 ? contentParagraphs.slice(1) : ["No content available."];
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
    tags: [
      "chapters",
      `chapters:${novelData.id}`,
      `chapter:${novelData.id}-${number}`
    ]
  });
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": `${currentChapter.title} - ${novelData.title} | Wuxia Dreams`, "description": `Read Chapter ${currentChapter.number} of ${novelData.title} online. ${currentChapter.title}` }, { "default": async ($$result2) => renderTemplate(_a || (_a = __template(['  <script type="application/ld+json">', "<\/script> ", '<main class="container mx-auto max-w-4xl px-4 py-8 sm:py-12">  <nav class="mb-8 flex items-center gap-2 text-sm text-muted-foreground"> <a href="/" class="shrink-0 hover:text-foreground transition-colors">Home</a> <span class="shrink-0">/</span> <a href="/novels" class="shrink-0 hover:text-foreground transition-colors">Novels</a> <span class="shrink-0">/</span> <a', ' class="shrink-0 hover:text-foreground transition-colors truncate max-w-[120px] sm:max-w-[200px]">', '</a> <span class="shrink-0">/</span> <span class="text-foreground truncate min-w-0">Chapter ', '</span> </nav>  <div class="mb-0 sm:mb-8 border-b border-border/60 pb-8 text-center relative"> <h1 class="text-2xl font-bold tracking-tight text-foreground sm:text-3xl md:text-4xl"> ', ' </h1> <div class="mt-4 flex items-center justify-center gap-4 text-sm text-muted-foreground"> <span class="flex items-center gap-1.5"> <svg class="h-4 w-4 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path> </svg> ', ' </span> <span>•</span> <span class="flex items-center gap-1.5"> ', ' words\n</span> </div> <div class="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-background px-4 text-xs text-muted-foreground/70 flex items-center gap-1 hidden sm:flex"> <span class="mr-1">Press</span> <kbd class="rounded border border-border bg-muted px-1.5 font-mono text-[10px]">←</kbd> <span class="mx-1">or</span> <kbd class="rounded border border-border bg-muted px-1.5 font-mono text-[10px]">→</kbd> <span class="ml-1">to navigate</span> </div> </div>  <div class="sticky top-16 z-30 mb-10 -mx-4 flex items-center justify-between gap-4 bg-background/90 px-4 py-3 backdrop-blur border-b border-border/60 sm:static sm:mx-0 sm:px-0 sm:border-none sm:bg-transparent sm:backdrop-blur-none sm:py-0"> ', ' <div class="flex items-center gap-2"> ', ' </div> </div>  <article class="chapter-content-container prose prose-neutral dark:prose-invert max-w-none text-foreground break-words"> ', ' </article>  <div class="mt-16 flex items-center justify-between gap-4 border-t border-border/60 pt-8 relative"> <div class="absolute -top-3 left-1/2 -translate-x-1/2 bg-background px-4 text-xs text-muted-foreground/70 flex items-center gap-1 hidden sm:flex"> <span class="mr-1">Press</span> <kbd class="rounded border border-border bg-muted px-1.5 font-mono text-[10px]">←</kbd> <span class="mx-1">or</span> <kbd class="rounded border border-border bg-muted px-1.5 font-mono text-[10px]">→</kbd> <span class="ml-1">to navigate</span> </div> ', " ", ' </div>  <div class="fixed bottom-6 right-4 sm:bottom-10 sm:right-10 z-50 flex flex-col gap-3"> <div class="flex flex-col gap-1 rounded-full bg-background/95 p-1.5 backdrop-blur-xl border border-border/50 shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.5)]"> ', ' <div class="w-6 h-px bg-border/60 mx-auto rounded-full my-0.5"></div> ', " </div> </div> </main> <script>(function(){", `
    document.addEventListener("keydown", (e) => {
      // Don't trigger if user is typing in an input or textarea
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA")
        return;

      if (e.key === "ArrowLeft" && prevUrl) {
        window.location.href = prevUrl;
      } else if (e.key === "ArrowRight" && nextUrl) {
        window.location.href = nextUrl;
      }
    });
  })();<\/script> `])), unescapeHTML(JSON.stringify(jsonLd)), maybeRenderHead(), addAttribute(`/novel/${novelData.slug}`, "href"), novelData.title, currentChapter.number, currentChapter.title, formatDate(currentChapter.createdAt), currentChapter.wordCount, prevChapter ? renderTemplate`<a${addAttribute(`/novel/${novelData.slug}/chapter-${prevChapter.number}`, "href")} class="inline-flex h-10 items-center justify-center rounded-xl border border-border/70 bg-card px-4 text-sm font-medium transition hover:bg-muted" data-astro-prefetch="viewport"> <svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path> </svg>
Previous
</a>` : renderTemplate`<button disabled class="inline-flex h-10 items-center justify-center rounded-xl border border-border/70 bg-muted/50 px-4 text-sm font-medium text-muted-foreground cursor-not-allowed opacity-50"> <svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path> </svg>
Previous
</button>`, nextChapter ? renderTemplate`<a${addAttribute(`/novel/${novelData.slug}/chapter-${nextChapter.number}`, "href")} class="inline-flex h-10 items-center justify-center rounded-xl border border-border/70 bg-card px-4 text-sm font-medium transition hover:bg-muted" data-astro-prefetch="viewport">
Next
<svg class="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path> </svg> </a>` : renderTemplate`<button disabled class="inline-flex h-10 items-center justify-center rounded-xl border border-border/70 bg-muted/50 px-4 text-sm font-medium text-muted-foreground cursor-not-allowed opacity-50">
Next
<svg class="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path> </svg> </button>`, contentParagraphs.map((p) => renderTemplate`<p class="whitespace-pre-wrap">${p}</p>`), prevChapter ? renderTemplate`<a${addAttribute(`/novel/${novelData.slug}/chapter-${prevChapter.number}`, "href")} class="inline-flex h-10 items-center justify-center rounded-xl border border-border/70 bg-card px-4 text-sm font-medium transition hover:bg-muted"> <svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path> </svg>
Previous
</a>` : renderTemplate`<button disabled class="inline-flex h-10 items-center justify-center rounded-xl border border-border/70 bg-muted/50 px-4 text-sm font-medium text-muted-foreground cursor-not-allowed opacity-50"> <svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path> </svg>
Previous
</button>`, nextChapter ? renderTemplate`<a${addAttribute(`/novel/${novelData.slug}/chapter-${nextChapter.number}`, "href")} class="inline-flex h-10 items-center justify-center rounded-xl border border-border/70 bg-card px-4 text-sm font-medium transition hover:bg-muted">
Next
<svg class="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path> </svg> </a>` : renderTemplate`<button disabled class="inline-flex h-10 items-center justify-center rounded-xl border border-border/70 bg-muted/50 px-4 text-sm font-medium text-muted-foreground cursor-not-allowed opacity-50">
Next
<svg class="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path> </svg> </button>`, renderComponent($$result2, "ChapterIndexDrawer", ChapterIndexDrawer, { "client:load": true, "novelId": novelData.id, "novelSlug": novelData.slug, "novelTitle": novelData.title, "totalChapters": totalChapters, "triggerClassName": "!rounded-full !w-10 !h-10 p-0 !bg-transparent hover:!bg-muted/80 text-foreground transition-all duration-200", "showText": false, "client:component-hydration": "load", "client:component-path": "@/components/chapter-index-drawer", "client:component-export": "ChapterIndexDrawer" }), renderComponent($$result2, "ChapterSettings", ChapterSettings, { "client:load": true, "triggerClassName": "!rounded-full !w-10 !h-10 p-0 !bg-transparent hover:!bg-muted/80 text-foreground transition-all duration-200", "showText": false, "client:component-hydration": "load", "client:component-path": "@/components/chapter-settings", "client:component-export": "ChapterSettings" }), defineScriptVars({
    prevUrl: prevChapter ? `/novel/${novelData.slug}/chapter-${prevChapter.number}` : null,
    nextUrl: nextChapter ? `/novel/${novelData.slug}/chapter-${nextChapter.number}` : null
  })) })}`;
}, "/Users/yangfuzhang/Desktop/wuxiadreams/wuxiadreams.com/src/pages/novel/[slug]/chapter-[number].astro", void 0);
const $$file = "/Users/yangfuzhang/Desktop/wuxiadreams/wuxiadreams.com/src/pages/novel/[slug]/chapter-[number].astro";
const $$url = "/novel/[slug]/chapter-[number]";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$Chapternumber,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page
};
