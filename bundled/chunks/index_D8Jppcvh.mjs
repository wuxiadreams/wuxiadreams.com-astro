globalThis.process ??= {};
globalThis.process.env ??= {};
import { c as createComponent } from "./astro-component_Czee9Eh7.mjs";
import { r as renderTemplate, m as maybeRenderHead } from "./transition_DzUAhAmX.mjs";
import { r as renderComponent } from "./index_Hi_Vvptw.mjs";
import { $ as $$AdminLayout } from "./admin-layout_D0L7BX6l.mjs";
import { j as jsxRuntimeExports, B as Button } from "./button_COaE4f0C.mjs";
import { r as reactExports } from "./worker-entry_BlhFEBb5.mjs";
import { u as useStore, r as reactQueryClient, l, a as useQuery, R as RefreshCcw, S as Spinner } from "./spinner_DQrxQY7o.mjs";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table_DbmRp6CM.mjs";
import { I as Input } from "./input_DbxlZoJx.mjs";
import { t as toast } from "./index_j_ciBzFi.mjs";
import { A as AlertDialog, b as AlertDialogContent, c as AlertDialogHeader, d as AlertDialogTitle, e as AlertDialogDescription, f as AlertDialogFooter, g as AlertDialogCancel, T as Trash2, h as AlertDialogAction } from "./alert-dialog_Z17w_ldF.mjs";
import { D as DropdownMenu, a as DropdownMenuTrigger, b as DropdownMenuContent, c as DropdownMenuLabel, d as DropdownMenuItem, e as DropdownMenuSeparator } from "./dropdown-menu_DdOLljpj.mjs";
import { E as Ellipsis, a as EyeOff, b as Eye } from "./eye_D8KY4OTz.mjs";
import { S as SquarePen, A as ArrowUp, a as ArrowDown } from "./square-pen_DOqbbYC7.mjs";
import { C as Check } from "./check_DroomRzy.mjs";
import { X } from "./index_D06oi-25.mjs";
import { A as ArrowUpDown } from "./arrow-up-down_Bu7y6Yn6.mjs";
function DeletePostDialog({
  post,
  onOpenChange
}) {
  const [isDeleting, setIsDeleting] = reactExports.useState(false);
  const queryClient = useStore(reactQueryClient);
  const handleDeleteConfirm = async () => {
    if (!post) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/posts/${post.id}`, {
        method: "DELETE"
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "删除失败");
      }
      toast.success("文章删除成功");
      queryClient.invalidateQueries({
        queryKey: ["posts"]
      });
      onOpenChange(false);
    } catch (err) {
      toast.error(err.message || "删除文章时出错");
    } finally {
      setIsDeleting(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    AlertDialog,
    {
      open: !!post,
      onOpenChange: (open) => !open && onOpenChange(false),
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogContent, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTitle, { children: "确认删除" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogDescription, { children: [
            '你确定要删除文章 "',
            post?.title,
            '" 吗？此操作无法撤销。'
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogCancel, { disabled: isDeleting, children: "取消" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "destructive",
              onClick: handleDeleteConfirm,
              disabled: isDeleting,
              children: isDeleting ? "删除中..." : "删除"
            }
          )
        ] })
      ] })
    }
  );
}
function PostActions({
  post,
  onDeleteClick
}) {
  const queryClient = useStore(reactQueryClient);
  const [isUpdating, setIsUpdating] = reactExports.useState(false);
  const [confirmDialog, setConfirmDialog] = reactExports.useState({
    open: false,
    field: null,
    currentValue: false,
    title: "",
    description: ""
  });
  const openConfirmDialog = (field, currentValue) => {
    const actionName = currentValue ? "取消发布" : "发布";
    setConfirmDialog({
      open: true,
      field,
      currentValue,
      title: `确认${actionName}`,
      description: `你确定要${actionName}文章 "${post.title}" 吗？`
    });
  };
  const handleConfirm = async () => {
    const { field, currentValue } = confirmDialog;
    if (!field || isUpdating) return;
    setIsUpdating(true);
    try {
      const res = await fetch(`/api/posts/${post.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ [field]: !currentValue })
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "更新失败");
      }
      toast.success("文章状态已更新");
      queryClient.invalidateQueries({
        queryKey: ["posts"]
      });
    } catch (err) {
      toast.error(err.message || "更新文章状态时出错");
    } finally {
      setIsUpdating(false);
      setConfirmDialog({ ...confirmDialog, open: false });
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenu, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "ghost", className: "h-8 w-8 p-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sr-only", children: "打开菜单" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Ellipsis, { className: "h-4 w-4" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuContent, { align: "end", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuLabel, { children: "操作" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuItem, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "a",
          {
            href: `/admin/posts/${post.id}`,
            target: "_blank",
            rel: "noopener noreferrer",
            className: "cursor-pointer flex items-center w-full",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SquarePen, { className: "mr-2 h-4 w-4" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "编辑文章" })
            ]
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          DropdownMenuItem,
          {
            className: "cursor-pointer",
            onClick: () => openConfirmDialog("published", post.published),
            disabled: isUpdating,
            children: post.published ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(EyeOff, { className: "mr-2 h-4 w-4" }),
              "取消发布"
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "mr-2 h-4 w-4" }),
              "发布文章"
            ] })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuSeparator, {}),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          DropdownMenuItem,
          {
            className: "cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10",
            onClick: () => onDeleteClick(post),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "mr-2 h-4 w-4" }),
              "删除文章"
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      AlertDialog,
      {
        open: confirmDialog.open,
        onOpenChange: (open) => setConfirmDialog({ ...confirmDialog, open }),
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogContent, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTitle, { children: confirmDialog.title }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogDescription, { children: confirmDialog.description })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogCancel, { disabled: isUpdating, children: "取消" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              AlertDialogAction,
              {
                onClick: handleConfirm,
                disabled: isUpdating,
                children: isUpdating ? "更新中..." : "确认"
              }
            )
          ] })
        ] })
      }
    )
  ] });
}
function PostTable() {
  const [currentPage, setCurrentPage] = reactExports.useState(1);
  const pageSize = 10;
  const [searchQuery, setSearchQuery] = reactExports.useState("");
  const [debouncedSearchQuery] = l(searchQuery, 500);
  const [sortBy, setSortBy] = reactExports.useState("createdAt");
  const [sortOrder, setSortOrder] = reactExports.useState("desc");
  const [deletingPost, setDeletingPost] = reactExports.useState(null);
  const params = {
    page: String(currentPage),
    pageSize: String(pageSize),
    search: debouncedSearchQuery,
    sortBy,
    sortOrder
  };
  const queryString = new URLSearchParams(params).toString();
  const queryClient = useStore(reactQueryClient);
  const { data, isFetching } = useQuery(
    {
      queryKey: ["posts", params],
      queryFn: async () => {
        const res = await fetch(`/api/posts?${queryString}`);
        return res.json();
      }
    },
    queryClient
  );
  const posts = data?.items || [];
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
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };
  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ["posts"] });
  };
  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };
  const renderSortIcon = (column) => {
    if (sortBy !== column)
      return /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUpDown, { className: "ml-2 h-4 w-4 text-muted-foreground" });
    return sortOrder === "asc" ? /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUp, { className: "ml-2 h-4 w-4 text-foreground" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowDown, { className: "ml-2 h-4 w-4 text-foreground" });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            placeholder: "按文章标题或 Slug 搜索...",
            value: searchQuery,
            onChange: handleSearch,
            className: "w-72"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          RefreshCcw,
          {
            size: "16",
            className: "cursor-pointer text-muted-foreground hover:text-primary transition-colors",
            onClick: handleRefresh
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "/admin/posts/create", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { children: "新建文章" }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative rounded-md border", children: [
      isFetching && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 z-10 flex items-center justify-center bg-background/50 backdrop-blur-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Spinner, {}) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { style: { minWidth: "800px" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            TableHead,
            {
              className: "cursor-pointer hover:bg-muted/50 w-[240px]",
              onClick: () => handleSort("title"),
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center", children: [
                "标题",
                renderSortIcon("title")
              ] })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "w-[240px]", children: "Slug" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "发布" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            TableHead,
            {
              className: "cursor-pointer hover:bg-muted/50",
              onClick: () => handleSort("createdAt"),
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center", children: [
                "创建时间",
                renderSortIcon("createdAt")
              ] })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-right", children: "操作" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { children: posts.length > 0 ? posts.map((post) => /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            TableCell,
            {
              className: "font-medium max-w-[240px] whitespace-normal break-words",
              title: post.title,
              children: post.title
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            TableCell,
            {
              className: "text-muted-foreground max-w-[240px] whitespace-normal break-words",
              title: post.slug,
              children: post.slug
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: post.published ? /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-4 w-4 text-green-500" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4 text-muted-foreground" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-muted-foreground", children: formatDate(post.createdAt) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsx(PostActions, { post, onDeleteClick: setDeletingPost }) })
        ] }, post.id)) : /* @__PURE__ */ jsxRuntimeExports.jsx(TableRow, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          TableCell,
          {
            colSpan: 5,
            className: "h-24 text-center text-muted-foreground",
            children: isFetching ? "加载中..." : "未找到文章"
          }
        ) }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm text-muted-foreground", children: [
        "共 ",
        total,
        " 条数据，共 ",
        totalPages,
        " 页"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "outline",
            size: "sm",
            onClick: () => setCurrentPage((p) => Math.max(1, p - 1)),
            disabled: currentPage === 1 || isFetching,
            children: "上一页"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm", children: [
          "第 ",
          currentPage,
          " 页"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "outline",
            size: "sm",
            onClick: () => setCurrentPage((p) => Math.min(totalPages, p + 1)),
            disabled: currentPage === totalPages || totalPages === 0 || isFetching,
            children: "下一页"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      DeletePostDialog,
      {
        post: deletingPost,
        onOpenChange: (open) => !open && setDeletingPost(null)
      }
    )
  ] });
}
const $$Index = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "AdminLayout", $$AdminLayout, { "title": "文章管理" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="flex flex-col gap-6"> <div> <h1 class="text-2xl font-bold tracking-tight">文章管理</h1> <p class="text-muted-foreground">管理平台的所有文章/公告</p> </div> ${renderComponent($$result2, "PostTable", PostTable, { "client:load": true, "client:component-hydration": "load", "client:component-path": "/Users/yangfuzhang/Desktop/wuxiadreams/wuxiadreams.com/src/pages/admin/posts/_table.tsx", "client:component-export": "default" })} </div> ` })}`;
}, "/Users/yangfuzhang/Desktop/wuxiadreams/wuxiadreams.com/src/pages/admin/posts/index.astro", void 0);
const $$file = "/Users/yangfuzhang/Desktop/wuxiadreams/wuxiadreams.com/src/pages/admin/posts/index.astro";
const $$url = "/admin/posts";
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
