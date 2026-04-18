globalThis.process ??= {};
globalThis.process.env ??= {};
import { c as createComponent } from "./astro-component_Czee9Eh7.mjs";
import { r as renderTemplate, m as maybeRenderHead } from "./transition_DzUAhAmX.mjs";
import { r as renderComponent } from "./index_Hi_Vvptw.mjs";
import { $ as $$AdminLayout } from "./admin-layout_D0L7BX6l.mjs";
import { s as sanitizeSlug, j as jsxRuntimeExports, B as Button } from "./button_COaE4f0C.mjs";
import { r as reactExports } from "./worker-entry_BlhFEBb5.mjs";
import { u as useStore, r as reactQueryClient, l, a as useQuery, R as RefreshCcw, S as Spinner } from "./spinner_DQrxQY7o.mjs";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table_DbmRp6CM.mjs";
import { A as AlertDialog, b as AlertDialogContent, c as AlertDialogHeader, d as AlertDialogTitle, e as AlertDialogDescription, f as AlertDialogFooter, g as AlertDialogCancel, a as AlertDialogTrigger, h as AlertDialogAction, T as Trash2 } from "./alert-dialog_Z17w_ldF.mjs";
import { I as Input } from "./input_DbxlZoJx.mjs";
import { t as toast } from "./index_j_ciBzFi.mjs";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogFooter } from "./dialog_CPwjDtap.mjs";
import { S as SquarePen, A as ArrowUp, a as ArrowDown } from "./square-pen_DOqbbYC7.mjs";
import { A as ArrowUpDown } from "./arrow-up-down_Bu7y6Yn6.mjs";
function CreateTagDialog({
  open,
  onOpenChange
}) {
  const [name, setName] = reactExports.useState("");
  const [slug, setSlug] = reactExports.useState("");
  const [isLoading, setIsLoading] = reactExports.useState(false);
  const queryClient = useStore(reactQueryClient);
  reactExports.useEffect(() => {
    if (open) {
      setName("");
      setSlug("");
    }
  }, [open]);
  const handleNameChange = (e) => {
    setName(e.target.value);
  };
  const autoSlug = sanitizeSlug(name);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const finalSlug = slug || autoSlug;
    try {
      const res = await fetch("/api/tags", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, slug: finalSlug })
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "创建失败");
      }
      toast.success("标签新建成功");
      setName("");
      setSlug("");
      onOpenChange(false);
      queryClient.invalidateQueries({ queryKey: ["tags"] });
    } catch (err) {
      toast.error(err.message || "创建标签失败");
    } finally {
      setIsLoading(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange, children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogContent, { className: "sm:max-w-[425px]", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "新建标签" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 py-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-4 items-center gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "label",
          {
            htmlFor: "name",
            className: "text-right text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
            children: "名称"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            id: "name",
            value: name,
            onChange: handleNameChange,
            className: "col-span-3",
            placeholder: "例如: 玄幻",
            required: true
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-4 items-center gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "label",
          {
            htmlFor: "slug",
            className: "text-right text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
            children: "Slug"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            id: "slug",
            value: slug,
            onChange: (e) => setSlug(e.target.value),
            className: "col-span-3",
            placeholder: autoSlug || "例如: xuanhuan"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          type: "button",
          variant: "outline",
          onClick: () => onOpenChange(false),
          disabled: isLoading,
          children: "取消"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", disabled: isLoading, children: isLoading ? "保存中..." : "保存" })
    ] })
  ] }) }) });
}
function EditTagDialog({
  open,
  onOpenChange,
  tag
}) {
  const [name, setName] = reactExports.useState("");
  const [slug, setSlug] = reactExports.useState("");
  const [isLoading, setIsLoading] = reactExports.useState(false);
  const queryClient = useStore(reactQueryClient);
  reactExports.useEffect(() => {
    if (tag && open) {
      setName(tag.name);
      setSlug(tag.slug);
    }
  }, [tag, open]);
  const handleNameChange = (e) => {
    setName(e.target.value);
  };
  const autoSlug = sanitizeSlug(name);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!tag) return;
    setIsLoading(true);
    const finalSlug = slug || autoSlug;
    try {
      const res = await fetch(`/api/tags/${tag.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, slug: finalSlug })
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "更新失败");
      }
      toast.success("标签更新成功");
      onOpenChange(false);
      queryClient.invalidateQueries({ queryKey: ["tags"] });
    } catch (err) {
      toast.error(err.message || "更新标签失败");
    } finally {
      setIsLoading(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange, children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogContent, { className: "sm:max-w-[425px]", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "编辑标签" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 py-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-4 items-center gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "label",
          {
            htmlFor: "edit-name",
            className: "text-right text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
            children: "名称"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            id: "edit-name",
            value: name,
            onChange: handleNameChange,
            className: "col-span-3",
            placeholder: "例如: 玄幻",
            required: true
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-4 items-center gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "label",
          {
            htmlFor: "edit-slug",
            className: "text-right text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
            children: "Slug"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            id: "edit-slug",
            value: slug,
            onChange: (e) => setSlug(e.target.value),
            className: "col-span-3",
            placeholder: autoSlug || "例如: xuanhuan"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          type: "button",
          variant: "outline",
          onClick: () => onOpenChange(false),
          disabled: isLoading,
          children: "取消"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", disabled: isLoading, children: isLoading ? "保存中..." : "保存" })
    ] })
  ] }) }) });
}
function DeleteTagDialog({
  tag,
  onOpenChange
}) {
  const [isDeleting, setIsDeleting] = reactExports.useState(false);
  const queryClient = useStore(reactQueryClient);
  const handleDeleteConfirm = async () => {
    if (!tag) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/tags/${tag.id}`, {
        method: "DELETE"
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "删除失败");
      }
      toast.success("标签删除成功");
      queryClient.invalidateQueries({
        queryKey: ["tags"]
      });
      onOpenChange(false);
    } catch (err) {
      toast.error(err.message || "删除标签时出错");
    } finally {
      setIsDeleting(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    AlertDialog,
    {
      open: !!tag,
      onOpenChange: (open) => !open && onOpenChange(false),
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogContent, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTitle, { children: "确认删除" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogDescription, { children: [
            '你确定要删除标签 "',
            tag?.name,
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
function TagTable() {
  const [currentPage, setCurrentPage] = reactExports.useState(1);
  const pageSize = 10;
  const [searchQuery, setSearchQuery] = reactExports.useState("");
  const [debouncedSearchQuery] = l(searchQuery, 500);
  const [sortBy, setSortBy] = reactExports.useState(
    "createdAt"
  );
  const [sortOrder, setSortOrder] = reactExports.useState("desc");
  const [isCreateOpen, setIsCreateOpen] = reactExports.useState(false);
  const [isEditOpen, setIsEditOpen] = reactExports.useState(false);
  const [editingTag, setEditingTag] = reactExports.useState(null);
  const [deletingTag, setDeletingTag] = reactExports.useState(null);
  const [isSyncing, setIsSyncing] = reactExports.useState(false);
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
      queryKey: ["tags", params],
      queryFn: async () => {
        const res = await fetch(`/api/tags?${queryString}`);
        return res.json();
      }
    },
    queryClient
  );
  const tags = data?.items || [];
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
    queryClient.invalidateQueries({ queryKey: ["tags"] });
  };
  const handleSyncNovelCount = async () => {
    try {
      setIsSyncing(true);
      const res = await fetch("/api/tags/sync", {
        method: "POST"
      });
      if (res.ok) {
        toast.success("同步标签关联小说数量成功");
        handleRefresh();
      } else {
        const errorData = await res.json();
        toast.error(errorData.error || "同步失败");
      }
    } catch (error) {
      toast.error("网络请求错误");
    } finally {
      setIsSyncing(false);
    }
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
            placeholder: "按标签名称或 Slug 搜索...",
            value: searchQuery,
            onChange: handleSearch,
            className: "w-64"
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
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialog, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "secondary", disabled: isSyncing, children: [
            isSyncing ? /* @__PURE__ */ jsxRuntimeExports.jsx(Spinner, { className: "mr-2 h-4 w-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCcw, { className: "mr-2 h-4 w-4" }),
            "同步关联小说数"
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogContent, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTitle, { children: "确认同步标签关联的小说数？" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogDescription, { children: [
                "此操作会遍历数据库并重新统计所有标签关联的小说数。",
                /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
                /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
                /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "注意：" }),
                "该操作可能会消耗较多的数据库读写额度，请确认是否继续？"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogCancel, { children: "取消" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogAction, { onClick: handleSyncNovelCount, children: "确认同步" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: () => setIsCreateOpen(true), children: "新建标签" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative rounded-md border", children: [
      isFetching && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 z-10 flex items-center justify-center bg-background/50 backdrop-blur-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Spinner, {}) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "ID" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            TableHead,
            {
              className: "cursor-pointer hover:bg-muted/50",
              onClick: () => handleSort("name"),
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center", children: [
                "名称",
                renderSortIcon("name")
              ] })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Slug" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            TableHead,
            {
              className: "cursor-pointer hover:bg-muted/50",
              onClick: () => handleSort("novelCount"),
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center", children: [
                "关联小说数",
                renderSortIcon("novelCount")
              ] })
            }
          ),
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
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { children: tags.length > 0 ? tags.map((tag) => /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: tag.id }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "font-medium", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "a",
            {
              href: `/tag/${tag.slug}`,
              target: "_blank",
              rel: "noopener noreferrer",
              className: "hover:underline hover:text-primary transition-colors",
              children: tag.name
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-muted-foreground", children: tag.slug }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: tag.novelCount || 0 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: formatDate(tag.createdAt) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-end space-x-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "ghost",
                size: "icon",
                onClick: () => {
                  setEditingTag(tag);
                  setIsEditOpen(true);
                },
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(SquarePen, { className: "h-4 w-4" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "ghost",
                size: "icon",
                className: "text-destructive hover:text-destructive hover:bg-destructive/10",
                onClick: () => setDeletingTag(tag),
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4" })
              }
            )
          ] }) })
        ] }, tag.id)) : /* @__PURE__ */ jsxRuntimeExports.jsx(TableRow, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          TableCell,
          {
            colSpan: 5,
            className: "h-24 text-center text-muted-foreground",
            children: isFetching ? "" : "暂无标签数据"
          }
        ) }) })
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
            onClick: () => setCurrentPage((p) => Math.min(totalPages, p + 1)),
            disabled: currentPage >= totalPages || totalPages === 0,
            children: "下一页"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CreateTagDialog, { open: isCreateOpen, onOpenChange: setIsCreateOpen }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      EditTagDialog,
      {
        open: isEditOpen,
        onOpenChange: setIsEditOpen,
        tag: editingTag
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      DeleteTagDialog,
      {
        tag: deletingTag,
        onOpenChange: (open) => !open && setDeletingTag(null)
      }
    )
  ] });
}
const $$Index = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "AdminLayout", $$AdminLayout, { "title": "标签管理" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="flex flex-col gap-6"> <div> <h1 class="text-2xl font-bold tracking-tight">标签管理</h1> <p class="text-muted-foreground">管理平台的所有小说标签</p> </div> ${renderComponent($$result2, "TagTable", TagTable, { "client:load": true, "client:component-hydration": "load", "client:component-path": "/Users/yangfuzhang/Desktop/wuxiadreams/wuxiadreams.com/src/pages/admin/tags/_table", "client:component-export": "default" })} </div> ` })}`;
}, "/Users/yangfuzhang/Desktop/wuxiadreams/wuxiadreams.com/src/pages/admin/tags/index.astro", void 0);
const $$file = "/Users/yangfuzhang/Desktop/wuxiadreams/wuxiadreams.com/src/pages/admin/tags/index.astro";
const $$url = "/admin/tags";
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
