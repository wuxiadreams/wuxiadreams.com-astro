globalThis.process ??= {};
globalThis.process.env ??= {};
import { c as createComponent } from "./astro-component_Czee9Eh7.mjs";
import { r as renderTemplate, m as maybeRenderHead } from "./transition_DzUAhAmX.mjs";
import { r as renderComponent } from "./index_Hi_Vvptw.mjs";
import { $ as $$AdminLayout } from "./admin-layout_D0L7BX6l.mjs";
import { u as useComposedRefs, j as jsxRuntimeExports, c as cn, s as sanitizeSlug, B as Button } from "./button_COaE4f0C.mjs";
import { r as reactExports } from "./worker-entry_BlhFEBb5.mjs";
import { u as useStore, r as reactQueryClient, l, a as useQuery, R as RefreshCcw, S as Spinner } from "./spinner_DQrxQY7o.mjs";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table_DbmRp6CM.mjs";
import { A as AlertDialog, b as AlertDialogContent, c as AlertDialogHeader, d as AlertDialogTitle, e as AlertDialogDescription, f as AlertDialogFooter, g as AlertDialogCancel, a as AlertDialogTrigger, h as AlertDialogAction, T as Trash2 } from "./alert-dialog_Z17w_ldF.mjs";
import { I as Input } from "./input_DbxlZoJx.mjs";
import { t as toast } from "./index_j_ciBzFi.mjs";
import { a as useControllableState, c as composeEventHandlers } from "./index_ZD02BhBQ.mjs";
import { P as Primitive, c as createContextScope } from "./index_C07zH_lE.mjs";
import { u as usePrevious } from "./index_DIEZv4lA.mjs";
import { u as useSize } from "./index_poe690Ht.mjs";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogFooter } from "./dialog_CPwjDtap.mjs";
import { C as Check } from "./check_DroomRzy.mjs";
import { X } from "./index_D06oi-25.mjs";
import { S as SquarePen, A as ArrowUp, a as ArrowDown } from "./square-pen_DOqbbYC7.mjs";
import { A as ArrowUpDown } from "./arrow-up-down_Bu7y6Yn6.mjs";
var SWITCH_NAME = "Switch";
var [createSwitchContext] = createContextScope(SWITCH_NAME);
var [SwitchProvider, useSwitchContext] = createSwitchContext(SWITCH_NAME);
var Switch$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const {
      __scopeSwitch,
      name,
      checked: checkedProp,
      defaultChecked,
      required,
      disabled,
      value = "on",
      onCheckedChange,
      form,
      ...switchProps
    } = props;
    const [button, setButton] = reactExports.useState(null);
    const composedRefs = useComposedRefs(forwardedRef, (node) => setButton(node));
    const hasConsumerStoppedPropagationRef = reactExports.useRef(false);
    const isFormControl = button ? form || !!button.closest("form") : true;
    const [checked, setChecked] = useControllableState({
      prop: checkedProp,
      defaultProp: defaultChecked ?? false,
      onChange: onCheckedChange,
      caller: SWITCH_NAME
    });
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(SwitchProvider, { scope: __scopeSwitch, checked, disabled, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Primitive.button,
        {
          type: "button",
          role: "switch",
          "aria-checked": checked,
          "aria-required": required,
          "data-state": getState(checked),
          "data-disabled": disabled ? "" : void 0,
          disabled,
          value,
          ...switchProps,
          ref: composedRefs,
          onClick: composeEventHandlers(props.onClick, (event) => {
            setChecked((prevChecked) => !prevChecked);
            if (isFormControl) {
              hasConsumerStoppedPropagationRef.current = event.isPropagationStopped();
              if (!hasConsumerStoppedPropagationRef.current) event.stopPropagation();
            }
          })
        }
      ),
      isFormControl && /* @__PURE__ */ jsxRuntimeExports.jsx(
        SwitchBubbleInput,
        {
          control: button,
          bubbles: !hasConsumerStoppedPropagationRef.current,
          name,
          value,
          checked,
          required,
          disabled,
          form,
          style: { transform: "translateX(-100%)" }
        }
      )
    ] });
  }
);
Switch$1.displayName = SWITCH_NAME;
var THUMB_NAME = "SwitchThumb";
var SwitchThumb = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeSwitch, ...thumbProps } = props;
    const context = useSwitchContext(THUMB_NAME, __scopeSwitch);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Primitive.span,
      {
        "data-state": getState(context.checked),
        "data-disabled": context.disabled ? "" : void 0,
        ...thumbProps,
        ref: forwardedRef
      }
    );
  }
);
SwitchThumb.displayName = THUMB_NAME;
var BUBBLE_INPUT_NAME = "SwitchBubbleInput";
var SwitchBubbleInput = reactExports.forwardRef(
  ({
    __scopeSwitch,
    control,
    checked,
    bubbles = true,
    ...props
  }, forwardedRef) => {
    const ref = reactExports.useRef(null);
    const composedRefs = useComposedRefs(ref, forwardedRef);
    const prevChecked = usePrevious(checked);
    const controlSize = useSize(control);
    reactExports.useEffect(() => {
      const input = ref.current;
      if (!input) return;
      const inputProto = window.HTMLInputElement.prototype;
      const descriptor = Object.getOwnPropertyDescriptor(
        inputProto,
        "checked"
      );
      const setChecked = descriptor.set;
      if (prevChecked !== checked && setChecked) {
        const event = new Event("click", { bubbles });
        setChecked.call(input, checked);
        input.dispatchEvent(event);
      }
    }, [prevChecked, checked, bubbles]);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "input",
      {
        type: "checkbox",
        "aria-hidden": true,
        defaultChecked: checked,
        ...props,
        tabIndex: -1,
        ref: composedRefs,
        style: {
          ...props.style,
          ...controlSize,
          position: "absolute",
          pointerEvents: "none",
          opacity: 0,
          margin: 0
        }
      }
    );
  }
);
SwitchBubbleInput.displayName = BUBBLE_INPUT_NAME;
function getState(checked) {
  return checked ? "checked" : "unchecked";
}
var Root = Switch$1;
var Thumb = SwitchThumb;
function Switch({
  className,
  size = "default",
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Root,
    {
      "data-slot": "switch",
      "data-size": size,
      className: cn(
        "peer group/switch relative inline-flex shrink-0 items-center rounded-full border border-transparent transition-all outline-none after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 data-[size=default]:h-[18.4px] data-[size=default]:w-[32px] data-[size=sm]:h-[14px] data-[size=sm]:w-[24px] dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 data-checked:bg-primary data-unchecked:bg-input dark:data-unchecked:bg-input/80 data-disabled:cursor-not-allowed data-disabled:opacity-50",
        className
      ),
      ...props,
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Thumb,
        {
          "data-slot": "switch-thumb",
          className: "pointer-events-none block rounded-full bg-background ring-0 transition-transform group-data-[size=default]/switch:size-4 group-data-[size=sm]/switch:size-3 group-data-[size=default]/switch:data-checked:translate-x-[calc(100%-2px)] group-data-[size=sm]/switch:data-checked:translate-x-[calc(100%-2px)] dark:data-checked:bg-primary-foreground group-data-[size=default]/switch:data-unchecked:translate-x-0 group-data-[size=sm]/switch:data-unchecked:translate-x-0 dark:data-unchecked:bg-foreground"
        }
      )
    }
  );
}
function CreateAuthorDialog({
  open,
  onOpenChange
}) {
  const [name, setName] = reactExports.useState("");
  const [nameAlt, setNameAlt] = reactExports.useState("");
  const [slug, setSlug] = reactExports.useState("");
  const [country, setCountry] = reactExports.useState("");
  const [isPinned, setIsPinned] = reactExports.useState(false);
  const [isLoading, setIsLoading] = reactExports.useState(false);
  const queryClient = useStore(reactQueryClient);
  reactExports.useEffect(() => {
    if (open) {
      setName("");
      setNameAlt("");
      setSlug("");
      setCountry("");
      setIsPinned(false);
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
      const res = await fetch("/api/authors", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, nameAlt, slug: finalSlug, country, isPinned })
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "创建失败");
      }
      toast.success("作者新建成功");
      setName("");
      setNameAlt("");
      setSlug("");
      setCountry("");
      setIsPinned(false);
      onOpenChange(false);
      queryClient.invalidateQueries({ queryKey: ["authors"] });
    } catch (err) {
      toast.error(err.message || "创建作者失败");
    } finally {
      setIsLoading(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange, children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogContent, { className: "sm:max-w-[425px]", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "新建作者" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 py-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-4 items-center gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "name", className: "text-right text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70", children: "名称" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            id: "name",
            value: name,
            onChange: handleNameChange,
            className: "col-span-3",
            placeholder: "例如: 唐家三少",
            required: true
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-4 items-center gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "nameAlt", className: "text-right text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70", children: "别名" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            id: "nameAlt",
            value: nameAlt,
            onChange: (e) => setNameAlt(e.target.value),
            className: "col-span-3",
            placeholder: "例如: Tang Jia San Shao",
            required: true
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-4 items-center gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "slug", className: "text-right text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70", children: "Slug" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            id: "slug",
            value: slug,
            onChange: (e) => setSlug(e.target.value),
            className: "col-span-3",
            placeholder: autoSlug || "例如: tang-jia-san-shao"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-4 items-center gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "country", className: "text-right text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70", children: "国家" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            id: "country",
            value: country,
            onChange: (e) => setCountry(e.target.value),
            className: "col-span-3",
            placeholder: "例如: 中国"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-4 items-center gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "isPinned", className: "text-right text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70", children: "置顶" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "col-span-3 flex items-center space-x-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Switch,
          {
            id: "isPinned",
            checked: isPinned,
            onCheckedChange: setIsPinned
          }
        ) })
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
function EditAuthorDialog({
  open,
  onOpenChange,
  author
}) {
  const [name, setName] = reactExports.useState("");
  const [nameAlt, setNameAlt] = reactExports.useState("");
  const [slug, setSlug] = reactExports.useState("");
  const [country, setCountry] = reactExports.useState("");
  const [isPinned, setIsPinned] = reactExports.useState(false);
  const [isLoading, setIsLoading] = reactExports.useState(false);
  const queryClient = useStore(reactQueryClient);
  reactExports.useEffect(() => {
    if (author && open) {
      setName(author.name);
      setNameAlt(author.nameAlt);
      setSlug(author.slug);
      setCountry(author.country || "");
      setIsPinned(author.isPinned || false);
    }
  }, [author, open]);
  const handleNameChange = (e) => {
    setName(e.target.value);
  };
  const autoSlug = sanitizeSlug(name);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!author) return;
    setIsLoading(true);
    const finalSlug = slug || autoSlug;
    try {
      const res = await fetch(`/api/authors/${author.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, nameAlt, slug: finalSlug, country, isPinned })
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "更新失败");
      }
      toast.success("作者更新成功");
      onOpenChange(false);
      queryClient.invalidateQueries({ queryKey: ["authors"] });
    } catch (err) {
      toast.error(err.message || "更新作者失败");
    } finally {
      setIsLoading(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange, children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogContent, { className: "sm:max-w-[425px]", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "编辑作者" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 py-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-4 items-center gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "edit-name", className: "text-right text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70", children: "名称" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            id: "edit-name",
            value: name,
            onChange: handleNameChange,
            className: "col-span-3",
            placeholder: "例如: 唐家三少",
            required: true
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-4 items-center gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "edit-nameAlt", className: "text-right text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70", children: "别名" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            id: "edit-nameAlt",
            value: nameAlt,
            onChange: (e) => setNameAlt(e.target.value),
            className: "col-span-3",
            placeholder: "例如: Tang Jia San Shao",
            required: true
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-4 items-center gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "edit-slug", className: "text-right text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70", children: "Slug" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            id: "edit-slug",
            value: slug,
            onChange: (e) => setSlug(e.target.value),
            className: "col-span-3",
            placeholder: autoSlug || "例如: tang-jia-san-shao"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-4 items-center gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "edit-country", className: "text-right text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70", children: "国家" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            id: "edit-country",
            value: country,
            onChange: (e) => setCountry(e.target.value),
            className: "col-span-3",
            placeholder: "例如: 中国"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-4 items-center gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "edit-isPinned", className: "text-right text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70", children: "置顶" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "col-span-3 flex items-center space-x-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Switch,
          {
            id: "edit-isPinned",
            checked: isPinned,
            onCheckedChange: setIsPinned
          }
        ) })
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
function DeleteAuthorDialog({
  author,
  onOpenChange
}) {
  const [isDeleting, setIsDeleting] = reactExports.useState(false);
  const queryClient = useStore(reactQueryClient);
  const handleDeleteConfirm = async () => {
    if (!author) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/authors/${author.id}`, {
        method: "DELETE"
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "删除失败");
      }
      toast.success("作者删除成功");
      queryClient.invalidateQueries({
        queryKey: ["authors"]
      });
      onOpenChange(false);
    } catch (err) {
      toast.error(err.message || "删除作者时出错");
    } finally {
      setIsDeleting(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    AlertDialog,
    {
      open: !!author,
      onOpenChange: (open) => !open && onOpenChange(false),
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogContent, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTitle, { children: "确认删除" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogDescription, { children: [
            '你确定要删除作者 "',
            author?.name,
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
function AuthorTable() {
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
  const [editingAuthor, setEditingAuthor] = reactExports.useState(null);
  const [deletingAuthor, setDeletingAuthor] = reactExports.useState(null);
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
      queryKey: ["authors", params],
      queryFn: async () => {
        const res = await fetch(`/api/authors?${queryString}`);
        return res.json();
      }
    },
    queryClient
  );
  const authors = data?.items || [];
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
    queryClient.invalidateQueries({ queryKey: ["authors"] });
  };
  const handleSyncNovelCount = async () => {
    try {
      setIsSyncing(true);
      const res = await fetch("/api/authors/sync", {
        method: "POST"
      });
      if (res.ok) {
        toast.success("同步作者关联小说数量成功");
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
            placeholder: "按作者名称、别名或 Slug 搜索...",
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
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialog, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "secondary", disabled: isSyncing, children: [
            isSyncing ? /* @__PURE__ */ jsxRuntimeExports.jsx(Spinner, { className: "mr-2 h-4 w-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCcw, { className: "mr-2 h-4 w-4" }),
            "同步关联小说数"
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogContent, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTitle, { children: "确认同步作者关联的小说数？" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogDescription, { children: [
                "此操作会遍历数据库并重新统计所有作者关联的小说数。",
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
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: () => setIsCreateOpen(true), children: "新建作者" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative rounded-md border", children: [
      isFetching && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 z-10 flex items-center justify-center bg-background/50 backdrop-blur-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Spinner, {}) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
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
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "别名" }),
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
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "国家" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "置顶" }),
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
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { children: authors.length > 0 ? authors.map((author) => /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "font-medium", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "a",
            {
              href: `/author/${author.slug}`,
              target: "_blank",
              rel: "noopener noreferrer",
              className: "hover:underline hover:text-primary transition-colors",
              children: author.name
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: author.nameAlt }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-muted-foreground", children: author.slug }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: author.novelCount || 0 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: author.country }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: author.isPinned ? /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-4 w-4 text-green-500" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4 text-muted-foreground" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: formatDate(author.createdAt) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-end space-x-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "ghost",
                size: "icon",
                onClick: () => {
                  setEditingAuthor(author);
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
                onClick: () => setDeletingAuthor(author),
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4" })
              }
            )
          ] }) })
        ] }, author.id)) : /* @__PURE__ */ jsxRuntimeExports.jsx(TableRow, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          TableCell,
          {
            colSpan: 7,
            className: "h-24 text-center text-muted-foreground",
            children: "未找到作者"
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
    /* @__PURE__ */ jsxRuntimeExports.jsx(CreateAuthorDialog, { open: isCreateOpen, onOpenChange: setIsCreateOpen }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      EditAuthorDialog,
      {
        open: isEditOpen,
        onOpenChange: setIsEditOpen,
        author: editingAuthor
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      DeleteAuthorDialog,
      {
        author: deletingAuthor,
        onOpenChange: (open) => !open && setDeletingAuthor(null)
      }
    )
  ] });
}
const $$Index = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "AdminLayout", $$AdminLayout, { "title": "作者管理" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="flex flex-col gap-6"> <div> <h1 class="text-2xl font-bold tracking-tight">作者管理</h1> <p class="text-muted-foreground">管理平台的所有小说作者</p> </div> ${renderComponent($$result2, "AuthorTable", AuthorTable, { "client:load": true, "client:component-hydration": "load", "client:component-path": "/Users/yangfuzhang/Desktop/wuxiadreams/wuxiadreams.com/src/pages/admin/authors/_table", "client:component-export": "default" })} </div> ` })}`;
}, "/Users/yangfuzhang/Desktop/wuxiadreams/wuxiadreams.com/src/pages/admin/authors/index.astro", void 0);
const $$file = "/Users/yangfuzhang/Desktop/wuxiadreams/wuxiadreams.com/src/pages/admin/authors/index.astro";
const $$url = "/admin/authors";
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
