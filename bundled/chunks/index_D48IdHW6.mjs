globalThis.process ??= {};
globalThis.process.env ??= {};
import { c as createComponent } from "./astro-component_Czee9Eh7.mjs";
import { r as renderTemplate, m as maybeRenderHead } from "./transition_DzUAhAmX.mjs";
import { r as renderComponent } from "./index_Hi_Vvptw.mjs";
import { $ as $$AdminLayout } from "./admin-layout_D0L7BX6l.mjs";
import { j as jsxRuntimeExports, B as Button } from "./button_COaE4f0C.mjs";
import { r as reactExports } from "./worker-entry_BlhFEBb5.mjs";
import { l, u as useStore, r as reactQueryClient, a as useQuery, R as RefreshCcw, S as Spinner } from "./spinner_DQrxQY7o.mjs";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table_DbmRp6CM.mjs";
import { I as Input } from "./input_DbxlZoJx.mjs";
import { A as Avatar, a as AvatarImage, b as AvatarFallback } from "./avatar_Bm-trz3z.mjs";
function UserTable() {
  const [currentPage, setCurrentPage] = reactExports.useState(1);
  const pageSize = 10;
  const [searchQuery, setSearchQuery] = reactExports.useState("");
  const [debouncedSearchQuery] = l(searchQuery, 500);
  const params = {
    page: String(currentPage),
    pageSize: String(pageSize),
    search: debouncedSearchQuery
  };
  const queryString = new URLSearchParams(params).toString();
  const queryClient = useStore(reactQueryClient);
  const { data, isFetching } = useQuery(
    {
      queryKey: ["users", params],
      queryFn: async () => {
        const res = await fetch(`/api/users?${queryString}`);
        return res.json();
      }
    },
    queryClient
  );
  const users = data?.items || [];
  const meta = data?.meta || { total: 0, totalPages: 0 };
  const { total, totalPages } = meta;
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };
  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ["users"] });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Input,
        {
          placeholder: "按用户名或邮箱搜索...",
          value: searchQuery,
          onChange: handleSearch,
          className: "max-w-sm"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        RefreshCcw,
        {
          size: "16",
          className: "cursor-pointer hover:text-primary",
          onClick: handleRefresh
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative rounded-md border", children: [
      isFetching && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 z-10 flex items-center justify-center bg-background/50 backdrop-blur-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Spinner, {}) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "头像" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "用户名" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "邮箱" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "已验证" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "加入时间" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { children: users.length > 0 ? users.map((user) => /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: user.image ? /* @__PURE__ */ jsxRuntimeExports.jsxs(Avatar, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarImage, { src: user.image, alt: user.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarFallback, { children: user.name.charAt(0).toUpperCase() })
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-8 w-8 items-center justify-center rounded-full bg-muted text-sm font-medium", children: user.name.charAt(0).toUpperCase() }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "font-medium", children: user.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: user.email }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: user.emailVerified ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-200", children: "是" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200", children: "否" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: formatDate(user.createdAt) })
        ] }, user.id)) : /* @__PURE__ */ jsxRuntimeExports.jsx(TableRow, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { colSpan: 5, className: "h-24 text-center", children: isFetching ? "" : "暂无数据" }) }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm text-muted-foreground", children: [
        "显示第 ",
        (currentPage - 1) * pageSize + 1,
        " 到",
        " ",
        Math.min(currentPage * pageSize, total),
        " 条记录，共 ",
        total,
        " 条记录"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "outline",
            size: "sm",
            onClick: () => setCurrentPage((p) => Math.max(1, p - 1)),
            disabled: currentPage === 1,
            children: "上一页"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm font-medium", children: [
          "第 ",
          currentPage,
          " 页 / 共 ",
          totalPages,
          " 页"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "outline",
            size: "sm",
            onClick: () => setCurrentPage((p) => Math.min(2, p + 1)),
            disabled: currentPage === 2,
            children: "下一页"
          }
        )
      ] })
    ] })
  ] });
}
const $$Index = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "AdminLayout", $$AdminLayout, { "title": "用户管理" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="flex flex-col gap-6"> <div> <h1 class="text-2xl font-bold tracking-tight">用户管理</h1> <p class="text-muted-foreground">管理平台的所有注册用户</p> </div> ${renderComponent($$result2, "UserTable", UserTable, { "client:load": true, "client:component-hydration": "load", "client:component-path": "/Users/yangfuzhang/Desktop/wuxiadreams/wuxiadreams.com/src/pages/admin/users/_table", "client:component-export": "default" })} </div> ` })}`;
}, "/Users/yangfuzhang/Desktop/wuxiadreams/wuxiadreams.com/src/pages/admin/users/index.astro", void 0);
const $$file = "/Users/yangfuzhang/Desktop/wuxiadreams/wuxiadreams.com/src/pages/admin/users/index.astro";
const $$url = "/admin/users";
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
