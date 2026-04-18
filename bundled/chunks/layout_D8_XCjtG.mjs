globalThis.process ??= {};
globalThis.process.env ??= {};
import { c as createComponent } from "./astro-component_Czee9Eh7.mjs";
import { K as createRenderInstruction, r as renderTemplate, b as addAttribute, m as maybeRenderHead, c as renderSlot, a as renderHead } from "./transition_DzUAhAmX.mjs";
import { r as renderComponent } from "./index_Hi_Vvptw.mjs";
import { env } from "cloudflare:workers";
import { $ as $$Image } from "./_astro_assets_D3btVnR0.mjs";
import { j as jsxRuntimeExports, c as cn } from "./button_COaE4f0C.mjs";
import { r as reactExports, R as React__default } from "./worker-entry_BlhFEBb5.mjs";
import { D as Dialog, e as DialogTrigger, a as DialogContent } from "./dialog_CPwjDtap.mjs";
import { A as AuthForm, a as authClient } from "./auth-form_CSeDn_EB.mjs";
import { D as DropdownMenu, a as DropdownMenuTrigger, b as DropdownMenuContent, c as DropdownMenuLabel, e as DropdownMenuSeparator, d as DropdownMenuItem } from "./dropdown-menu_DdOLljpj.mjs";
import { A as Avatar, a as AvatarImage, b as AvatarFallback } from "./avatar_Bm-trz3z.mjs";
import { c as createLucideIcon } from "./createLucideIcon_BJ8PqZ8d.mjs";
import { O as Overlay$1, C as Content$1, T as Trigger, b as Title, a as Close, R as Root$1, P as Portal$1, D as Description } from "./index_D06oi-25.mjs";
/* empty css                 */
async function renderScript(result, id) {
  const inlined = result.inlinedScripts.get(id);
  let content = "";
  if (inlined != null) {
    if (inlined) {
      content = `<script type="module">${inlined}<\/script>`;
    }
  } else {
    const resolved = await result.resolve(id);
    content = `<script type="module" src="${result.userAssetsBase ? (result.base === "/" ? "" : result.base) + result.userAssetsBase : ""}${resolved}"><\/script>`;
  }
  return createRenderInstruction({ type: "script", id, content });
}
const __iconNode$1 = [
  ["rect", { width: "7", height: "9", x: "3", y: "3", rx: "1", key: "10lvy0" }],
  ["rect", { width: "7", height: "5", x: "14", y: "3", rx: "1", key: "16une8" }],
  ["rect", { width: "7", height: "9", x: "14", y: "12", rx: "1", key: "1hutg5" }],
  ["rect", { width: "7", height: "5", x: "3", y: "16", rx: "1", key: "ldoo1y" }]
];
const LayoutDashboard = createLucideIcon("layout-dashboard", __iconNode$1);
const __iconNode = [
  ["path", { d: "m16 17 5-5-5-5", key: "1bji2h" }],
  ["path", { d: "M21 12H9", key: "dn1m92" }],
  ["path", { d: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4", key: "1uf3rs" }]
];
const LogOut = createLucideIcon("log-out", __iconNode);
function AuthDialog({
  triggerText = "Sign in",
  triggerClassName = "hidden min-w-20 h-10 items-center justify-center rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 md:inline-flex cursor-pointer",
  isAdmin = false
}) {
  const [isOpen, setIsOpen] = reactExports.useState(false);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Dialog, { open: isOpen, onOpenChange: setIsOpen, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: triggerClassName, children: triggerText }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogContent, { className: "sm:max-w-[400px] border-border/40 bg-card/95 backdrop-blur-xl shadow-2xl p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AuthForm, { isAdmin, onSuccess: () => setIsOpen(false) }) })
  ] });
}
function UserMenu({
  user,
  isAdmin = false,
  className = "hidden md:inline-flex"
}) {
  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          window.location.reload();
        }
      }
    });
  };
  const getInitials = (name) => {
    if (!name) return "U";
    return name.slice(0, 2).toUpperCase();
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenu, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      DropdownMenuTrigger,
      {
        className: `focus-visible:outline-none cursor-pointer rounded-full ring-offset-background transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${className}`,
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Avatar, { className: "h-10 w-10 border border-border/60", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarImage, { src: user.image || void 0, alt: user.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarFallback, { className: "bg-primary/10 text-primary font-semibold text-sm", children: getInitials(user.name) })
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      DropdownMenuContent,
      {
        align: "end",
        className: "w-56 rounded-xl border-border/40 bg-card/95 backdrop-blur-xl shadow-xl",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuLabel, { className: "font-normal", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium leading-none", children: user.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs leading-none text-muted-foreground truncate", children: user.email })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuSeparator, {}),
          isAdmin && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuItem, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "a",
              {
                href: "/admin/users",
                className: "cursor-pointer flex items-center w-full",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(LayoutDashboard, { className: "mr-2 h-4 w-4" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Dashboard" })
                ]
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuSeparator, {})
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            DropdownMenuItem,
            {
              onClick: handleSignOut,
              className: "text-destructive cursor-pointer focus:text-destructive focus:bg-destructive/10",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { className: "mr-2 h-4 w-4" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Log out" })
              ]
            }
          )
        ]
      }
    )
  ] });
}
function __insertCSS(code) {
  if (typeof document == "undefined") return;
  let head = document.head || document.getElementsByTagName("head")[0];
  let style = document.createElement("style");
  style.type = "text/css";
  head.appendChild(style);
  style.styleSheet ? style.styleSheet.cssText = code : style.appendChild(document.createTextNode(code));
}
const DrawerContext = React__default.createContext({
  drawerRef: {
    current: null
  },
  overlayRef: {
    current: null
  },
  onPress: () => {
  },
  onRelease: () => {
  },
  onDrag: () => {
  },
  onNestedDrag: () => {
  },
  onNestedOpenChange: () => {
  },
  onNestedRelease: () => {
  },
  openProp: void 0,
  dismissible: false,
  isOpen: false,
  isDragging: false,
  keyboardIsOpen: {
    current: false
  },
  snapPointsOffset: null,
  snapPoints: null,
  handleOnly: false,
  modal: false,
  shouldFade: false,
  activeSnapPoint: null,
  onOpenChange: () => {
  },
  setActiveSnapPoint: () => {
  },
  closeDrawer: () => {
  },
  direction: "bottom",
  shouldAnimate: {
    current: true
  },
  shouldScaleBackground: false,
  setBackgroundColorOnScale: true,
  noBodyStyles: false,
  container: null,
  autoFocus: false
});
const useDrawerContext = () => {
  const context = React__default.useContext(DrawerContext);
  if (!context) {
    throw new Error("useDrawerContext must be used within a Drawer.Root");
  }
  return context;
};
__insertCSS("[data-vaul-drawer]{touch-action:none;will-change:transform;transition:transform .5s cubic-bezier(.32, .72, 0, 1);animation-duration:.5s;animation-timing-function:cubic-bezier(0.32,0.72,0,1)}[data-vaul-drawer][data-vaul-snap-points=false][data-vaul-drawer-direction=bottom][data-state=open]{animation-name:slideFromBottom}[data-vaul-drawer][data-vaul-snap-points=false][data-vaul-drawer-direction=bottom][data-state=closed]{animation-name:slideToBottom}[data-vaul-drawer][data-vaul-snap-points=false][data-vaul-drawer-direction=top][data-state=open]{animation-name:slideFromTop}[data-vaul-drawer][data-vaul-snap-points=false][data-vaul-drawer-direction=top][data-state=closed]{animation-name:slideToTop}[data-vaul-drawer][data-vaul-snap-points=false][data-vaul-drawer-direction=left][data-state=open]{animation-name:slideFromLeft}[data-vaul-drawer][data-vaul-snap-points=false][data-vaul-drawer-direction=left][data-state=closed]{animation-name:slideToLeft}[data-vaul-drawer][data-vaul-snap-points=false][data-vaul-drawer-direction=right][data-state=open]{animation-name:slideFromRight}[data-vaul-drawer][data-vaul-snap-points=false][data-vaul-drawer-direction=right][data-state=closed]{animation-name:slideToRight}[data-vaul-drawer][data-vaul-snap-points=true][data-vaul-drawer-direction=bottom]{transform:translate3d(0,var(--initial-transform,100%),0)}[data-vaul-drawer][data-vaul-snap-points=true][data-vaul-drawer-direction=top]{transform:translate3d(0,calc(var(--initial-transform,100%) * -1),0)}[data-vaul-drawer][data-vaul-snap-points=true][data-vaul-drawer-direction=left]{transform:translate3d(calc(var(--initial-transform,100%) * -1),0,0)}[data-vaul-drawer][data-vaul-snap-points=true][data-vaul-drawer-direction=right]{transform:translate3d(var(--initial-transform,100%),0,0)}[data-vaul-drawer][data-vaul-delayed-snap-points=true][data-vaul-drawer-direction=top]{transform:translate3d(0,var(--snap-point-height,0),0)}[data-vaul-drawer][data-vaul-delayed-snap-points=true][data-vaul-drawer-direction=bottom]{transform:translate3d(0,var(--snap-point-height,0),0)}[data-vaul-drawer][data-vaul-delayed-snap-points=true][data-vaul-drawer-direction=left]{transform:translate3d(var(--snap-point-height,0),0,0)}[data-vaul-drawer][data-vaul-delayed-snap-points=true][data-vaul-drawer-direction=right]{transform:translate3d(var(--snap-point-height,0),0,0)}[data-vaul-overlay][data-vaul-snap-points=false]{animation-duration:.5s;animation-timing-function:cubic-bezier(0.32,0.72,0,1)}[data-vaul-overlay][data-vaul-snap-points=false][data-state=open]{animation-name:fadeIn}[data-vaul-overlay][data-state=closed]{animation-name:fadeOut}[data-vaul-animate=false]{animation:none!important}[data-vaul-overlay][data-vaul-snap-points=true]{opacity:0;transition:opacity .5s cubic-bezier(.32, .72, 0, 1)}[data-vaul-overlay][data-vaul-snap-points=true]{opacity:1}[data-vaul-drawer]:not([data-vaul-custom-container=true])::after{content:'';position:absolute;background:inherit;background-color:inherit}[data-vaul-drawer][data-vaul-drawer-direction=top]::after{top:initial;bottom:100%;left:0;right:0;height:200%}[data-vaul-drawer][data-vaul-drawer-direction=bottom]::after{top:100%;bottom:initial;left:0;right:0;height:200%}[data-vaul-drawer][data-vaul-drawer-direction=left]::after{left:initial;right:100%;top:0;bottom:0;width:200%}[data-vaul-drawer][data-vaul-drawer-direction=right]::after{left:100%;right:initial;top:0;bottom:0;width:200%}[data-vaul-overlay][data-vaul-snap-points=true]:not([data-vaul-snap-points-overlay=true]):not(\n[data-state=closed]\n){opacity:0}[data-vaul-overlay][data-vaul-snap-points-overlay=true]{opacity:1}[data-vaul-handle]{display:block;position:relative;opacity:.7;background:#e2e2e4;margin-left:auto;margin-right:auto;height:5px;width:32px;border-radius:1rem;touch-action:pan-y}[data-vaul-handle]:active,[data-vaul-handle]:hover{opacity:1}[data-vaul-handle-hitarea]{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:max(100%,2.75rem);height:max(100%,2.75rem);touch-action:inherit}@media (hover:hover) and (pointer:fine){[data-vaul-drawer]{user-select:none}}@media (pointer:fine){[data-vaul-handle-hitarea]:{width:100%;height:100%}}@keyframes fadeIn{from{opacity:0}to{opacity:1}}@keyframes fadeOut{to{opacity:0}}@keyframes slideFromBottom{from{transform:translate3d(0,var(--initial-transform,100%),0)}to{transform:translate3d(0,0,0)}}@keyframes slideToBottom{to{transform:translate3d(0,var(--initial-transform,100%),0)}}@keyframes slideFromTop{from{transform:translate3d(0,calc(var(--initial-transform,100%) * -1),0)}to{transform:translate3d(0,0,0)}}@keyframes slideToTop{to{transform:translate3d(0,calc(var(--initial-transform,100%) * -1),0)}}@keyframes slideFromLeft{from{transform:translate3d(calc(var(--initial-transform,100%) * -1),0,0)}to{transform:translate3d(0,0,0)}}@keyframes slideToLeft{to{transform:translate3d(calc(var(--initial-transform,100%) * -1),0,0)}}@keyframes slideFromRight{from{transform:translate3d(var(--initial-transform,100%),0,0)}to{transform:translate3d(0,0,0)}}@keyframes slideToRight{to{transform:translate3d(var(--initial-transform,100%),0,0)}}");
function isMobileFirefox() {
  const userAgent = navigator.userAgent;
  return typeof window !== "undefined" && (/Firefox/.test(userAgent) && /Mobile/.test(userAgent) || // Android Firefox
  /FxiOS/.test(userAgent));
}
function isMac() {
  return testPlatform(/^Mac/);
}
function isIPhone() {
  return testPlatform(/^iPhone/);
}
function isSafari() {
  return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
}
function isIPad() {
  return testPlatform(/^iPad/) || // iPadOS 13 lies and says it's a Mac, but we can distinguish by detecting touch support.
  isMac() && navigator.maxTouchPoints > 1;
}
function isIOS() {
  return isIPhone() || isIPad();
}
function testPlatform(re) {
  return typeof window !== "undefined" && window.navigator != null ? re.test(window.navigator.platform) : void 0;
}
const KEYBOARD_BUFFER = 24;
const useIsomorphicLayoutEffect = typeof window !== "undefined" ? reactExports.useLayoutEffect : reactExports.useEffect;
function chain$1(...callbacks) {
  return (...args) => {
    for (let callback of callbacks) {
      if (typeof callback === "function") {
        callback(...args);
      }
    }
  };
}
const visualViewport = typeof document !== "undefined" && window.visualViewport;
function isScrollable(node) {
  let style = window.getComputedStyle(node);
  return /(auto|scroll)/.test(style.overflow + style.overflowX + style.overflowY);
}
function getScrollParent(node) {
  if (isScrollable(node)) {
    node = node.parentElement;
  }
  while (node && !isScrollable(node)) {
    node = node.parentElement;
  }
  return node || document.scrollingElement || document.documentElement;
}
const nonTextInputTypes = /* @__PURE__ */ new Set([
  "checkbox",
  "radio",
  "range",
  "color",
  "file",
  "image",
  "button",
  "submit",
  "reset"
]);
let preventScrollCount = 0;
let restore;
function usePreventScroll(options = {}) {
  let { isDisabled } = options;
  useIsomorphicLayoutEffect(() => {
    if (isDisabled) {
      return;
    }
    preventScrollCount++;
    if (preventScrollCount === 1) {
      if (isIOS()) {
        restore = preventScrollMobileSafari();
      }
    }
    return () => {
      preventScrollCount--;
      if (preventScrollCount === 0) {
        restore == null ? void 0 : restore();
      }
    };
  }, [
    isDisabled
  ]);
}
function preventScrollMobileSafari() {
  let scrollable;
  let lastY = 0;
  let onTouchStart = (e) => {
    scrollable = getScrollParent(e.target);
    if (scrollable === document.documentElement && scrollable === document.body) {
      return;
    }
    lastY = e.changedTouches[0].pageY;
  };
  let onTouchMove = (e) => {
    if (!scrollable || scrollable === document.documentElement || scrollable === document.body) {
      e.preventDefault();
      return;
    }
    let y = e.changedTouches[0].pageY;
    let scrollTop = scrollable.scrollTop;
    let bottom = scrollable.scrollHeight - scrollable.clientHeight;
    if (bottom === 0) {
      return;
    }
    if (scrollTop <= 0 && y > lastY || scrollTop >= bottom && y < lastY) {
      e.preventDefault();
    }
    lastY = y;
  };
  let onTouchEnd = (e) => {
    let target = e.target;
    if (isInput(target) && target !== document.activeElement) {
      e.preventDefault();
      target.style.transform = "translateY(-2000px)";
      target.focus();
      requestAnimationFrame(() => {
        target.style.transform = "";
      });
    }
  };
  let onFocus = (e) => {
    let target = e.target;
    if (isInput(target)) {
      target.style.transform = "translateY(-2000px)";
      requestAnimationFrame(() => {
        target.style.transform = "";
        if (visualViewport) {
          if (visualViewport.height < window.innerHeight) {
            requestAnimationFrame(() => {
              scrollIntoView(target);
            });
          } else {
            visualViewport.addEventListener("resize", () => scrollIntoView(target), {
              once: true
            });
          }
        }
      });
    }
  };
  let onWindowScroll = () => {
    window.scrollTo(0, 0);
  };
  let scrollX = window.pageXOffset;
  let scrollY = window.pageYOffset;
  let restoreStyles = chain$1(setStyle(document.documentElement, "paddingRight", `${window.innerWidth - document.documentElement.clientWidth}px`));
  window.scrollTo(0, 0);
  let removeEvents = chain$1(addEvent(document, "touchstart", onTouchStart, {
    passive: false,
    capture: true
  }), addEvent(document, "touchmove", onTouchMove, {
    passive: false,
    capture: true
  }), addEvent(document, "touchend", onTouchEnd, {
    passive: false,
    capture: true
  }), addEvent(document, "focus", onFocus, true), addEvent(window, "scroll", onWindowScroll));
  return () => {
    restoreStyles();
    removeEvents();
    window.scrollTo(scrollX, scrollY);
  };
}
function setStyle(element, style, value) {
  let cur = element.style[style];
  element.style[style] = value;
  return () => {
    element.style[style] = cur;
  };
}
function addEvent(target, event, handler, options) {
  target.addEventListener(event, handler, options);
  return () => {
    target.removeEventListener(event, handler, options);
  };
}
function scrollIntoView(target) {
  let root = document.scrollingElement || document.documentElement;
  while (target && target !== root) {
    let scrollable = getScrollParent(target);
    if (scrollable !== document.documentElement && scrollable !== document.body && scrollable !== target) {
      let scrollableTop = scrollable.getBoundingClientRect().top;
      let targetTop = target.getBoundingClientRect().top;
      let targetBottom = target.getBoundingClientRect().bottom;
      const keyboardHeight = scrollable.getBoundingClientRect().bottom + KEYBOARD_BUFFER;
      if (targetBottom > keyboardHeight) {
        scrollable.scrollTop += targetTop - scrollableTop;
      }
    }
    target = scrollable.parentElement;
  }
}
function isInput(target) {
  return target instanceof HTMLInputElement && !nonTextInputTypes.has(target.type) || target instanceof HTMLTextAreaElement || target instanceof HTMLElement && target.isContentEditable;
}
function setRef(ref, value) {
  if (typeof ref === "function") {
    ref(value);
  } else if (ref !== null && ref !== void 0) {
    ref.current = value;
  }
}
function composeRefs(...refs) {
  return (node) => refs.forEach((ref) => setRef(ref, node));
}
function useComposedRefs(...refs) {
  return reactExports.useCallback(composeRefs(...refs), refs);
}
const cache = /* @__PURE__ */ new WeakMap();
function set(el, styles, ignoreCache = false) {
  if (!el || !(el instanceof HTMLElement)) return;
  let originalStyles = {};
  Object.entries(styles).forEach(([key, value]) => {
    if (key.startsWith("--")) {
      el.style.setProperty(key, value);
      return;
    }
    originalStyles[key] = el.style[key];
    el.style[key] = value;
  });
  if (ignoreCache) return;
  cache.set(el, originalStyles);
}
function reset(el, prop) {
  if (!el || !(el instanceof HTMLElement)) return;
  let originalStyles = cache.get(el);
  if (!originalStyles) {
    return;
  }
  {
    el.style[prop] = originalStyles[prop];
  }
}
const isVertical = (direction) => {
  switch (direction) {
    case "top":
    case "bottom":
      return true;
    case "left":
    case "right":
      return false;
    default:
      return direction;
  }
};
function getTranslate(element, direction) {
  if (!element) {
    return null;
  }
  const style = window.getComputedStyle(element);
  const transform = (
    // @ts-ignore
    style.transform || style.webkitTransform || style.mozTransform
  );
  let mat = transform.match(/^matrix3d\((.+)\)$/);
  if (mat) {
    return parseFloat(mat[1].split(", ")[isVertical(direction) ? 13 : 12]);
  }
  mat = transform.match(/^matrix\((.+)\)$/);
  return mat ? parseFloat(mat[1].split(", ")[isVertical(direction) ? 5 : 4]) : null;
}
function dampenValue(v) {
  return 8 * (Math.log(v + 1) - 2);
}
function assignStyle(element, style) {
  if (!element) return () => {
  };
  const prevStyle = element.style.cssText;
  Object.assign(element.style, style);
  return () => {
    element.style.cssText = prevStyle;
  };
}
function chain(...fns) {
  return (...args) => {
    for (const fn of fns) {
      if (typeof fn === "function") {
        fn(...args);
      }
    }
  };
}
const TRANSITIONS = {
  DURATION: 0.5,
  EASE: [
    0.32,
    0.72,
    0,
    1
  ]
};
const VELOCITY_THRESHOLD = 0.4;
const CLOSE_THRESHOLD = 0.25;
const SCROLL_LOCK_TIMEOUT = 100;
const BORDER_RADIUS = 8;
const NESTED_DISPLACEMENT = 16;
const WINDOW_TOP_OFFSET = 26;
const DRAG_CLASS = "vaul-dragging";
function useCallbackRef(callback) {
  const callbackRef = React__default.useRef(callback);
  React__default.useEffect(() => {
    callbackRef.current = callback;
  });
  return React__default.useMemo(() => (...args) => callbackRef.current == null ? void 0 : callbackRef.current.call(callbackRef, ...args), []);
}
function useUncontrolledState({ defaultProp, onChange }) {
  const uncontrolledState = React__default.useState(defaultProp);
  const [value] = uncontrolledState;
  const prevValueRef = React__default.useRef(value);
  const handleChange = useCallbackRef(onChange);
  React__default.useEffect(() => {
    if (prevValueRef.current !== value) {
      handleChange(value);
      prevValueRef.current = value;
    }
  }, [
    value,
    prevValueRef,
    handleChange
  ]);
  return uncontrolledState;
}
function useControllableState({ prop, defaultProp, onChange = () => {
} }) {
  const [uncontrolledProp, setUncontrolledProp] = useUncontrolledState({
    defaultProp,
    onChange
  });
  const isControlled = prop !== void 0;
  const value = isControlled ? prop : uncontrolledProp;
  const handleChange = useCallbackRef(onChange);
  const setValue = React__default.useCallback((nextValue) => {
    if (isControlled) {
      const setter = nextValue;
      const value2 = typeof nextValue === "function" ? setter(prop) : nextValue;
      if (value2 !== prop) handleChange(value2);
    } else {
      setUncontrolledProp(nextValue);
    }
  }, [
    isControlled,
    prop,
    setUncontrolledProp,
    handleChange
  ]);
  return [
    value,
    setValue
  ];
}
function useSnapPoints({ activeSnapPointProp, setActiveSnapPointProp, snapPoints, drawerRef, overlayRef, fadeFromIndex, onSnapPointChange, direction = "bottom", container, snapToSequentialPoint }) {
  const [activeSnapPoint, setActiveSnapPoint] = useControllableState({
    prop: activeSnapPointProp,
    defaultProp: snapPoints == null ? void 0 : snapPoints[0],
    onChange: setActiveSnapPointProp
  });
  const [windowDimensions, setWindowDimensions] = React__default.useState(typeof window !== "undefined" ? {
    innerWidth: window.innerWidth,
    innerHeight: window.innerHeight
  } : void 0);
  React__default.useEffect(() => {
    function onResize() {
      setWindowDimensions({
        innerWidth: window.innerWidth,
        innerHeight: window.innerHeight
      });
    }
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  const isLastSnapPoint = React__default.useMemo(() => activeSnapPoint === (snapPoints == null ? void 0 : snapPoints[snapPoints.length - 1]) || null, [
    snapPoints,
    activeSnapPoint
  ]);
  const activeSnapPointIndex = React__default.useMemo(() => {
    var _snapPoints_findIndex;
    return (_snapPoints_findIndex = snapPoints == null ? void 0 : snapPoints.findIndex((snapPoint) => snapPoint === activeSnapPoint)) != null ? _snapPoints_findIndex : null;
  }, [
    snapPoints,
    activeSnapPoint
  ]);
  const shouldFade = snapPoints && snapPoints.length > 0 && (fadeFromIndex || fadeFromIndex === 0) && !Number.isNaN(fadeFromIndex) && snapPoints[fadeFromIndex] === activeSnapPoint || !snapPoints;
  const snapPointsOffset = React__default.useMemo(() => {
    const containerSize = container ? {
      width: container.getBoundingClientRect().width,
      height: container.getBoundingClientRect().height
    } : typeof window !== "undefined" ? {
      width: window.innerWidth,
      height: window.innerHeight
    } : {
      width: 0,
      height: 0
    };
    var _snapPoints_map;
    return (_snapPoints_map = snapPoints == null ? void 0 : snapPoints.map((snapPoint) => {
      const isPx = typeof snapPoint === "string";
      let snapPointAsNumber = 0;
      if (isPx) {
        snapPointAsNumber = parseInt(snapPoint, 10);
      }
      if (isVertical(direction)) {
        const height = isPx ? snapPointAsNumber : windowDimensions ? snapPoint * containerSize.height : 0;
        if (windowDimensions) {
          return direction === "bottom" ? containerSize.height - height : -containerSize.height + height;
        }
        return height;
      }
      const width = isPx ? snapPointAsNumber : windowDimensions ? snapPoint * containerSize.width : 0;
      if (windowDimensions) {
        return direction === "right" ? containerSize.width - width : -containerSize.width + width;
      }
      return width;
    })) != null ? _snapPoints_map : [];
  }, [
    snapPoints,
    windowDimensions,
    container
  ]);
  const activeSnapPointOffset = React__default.useMemo(() => activeSnapPointIndex !== null ? snapPointsOffset == null ? void 0 : snapPointsOffset[activeSnapPointIndex] : null, [
    snapPointsOffset,
    activeSnapPointIndex
  ]);
  const snapToPoint = React__default.useCallback((dimension) => {
    var _snapPointsOffset_findIndex;
    const newSnapPointIndex = (_snapPointsOffset_findIndex = snapPointsOffset == null ? void 0 : snapPointsOffset.findIndex((snapPointDim) => snapPointDim === dimension)) != null ? _snapPointsOffset_findIndex : null;
    onSnapPointChange(newSnapPointIndex);
    set(drawerRef.current, {
      transition: `transform ${TRANSITIONS.DURATION}s cubic-bezier(${TRANSITIONS.EASE.join(",")})`,
      transform: isVertical(direction) ? `translate3d(0, ${dimension}px, 0)` : `translate3d(${dimension}px, 0, 0)`
    });
    if (snapPointsOffset && newSnapPointIndex !== snapPointsOffset.length - 1 && fadeFromIndex !== void 0 && newSnapPointIndex !== fadeFromIndex && newSnapPointIndex < fadeFromIndex) {
      set(overlayRef.current, {
        transition: `opacity ${TRANSITIONS.DURATION}s cubic-bezier(${TRANSITIONS.EASE.join(",")})`,
        opacity: "0"
      });
    } else {
      set(overlayRef.current, {
        transition: `opacity ${TRANSITIONS.DURATION}s cubic-bezier(${TRANSITIONS.EASE.join(",")})`,
        opacity: "1"
      });
    }
    setActiveSnapPoint(snapPoints == null ? void 0 : snapPoints[Math.max(newSnapPointIndex, 0)]);
  }, [
    drawerRef.current,
    snapPoints,
    snapPointsOffset,
    fadeFromIndex,
    overlayRef,
    setActiveSnapPoint
  ]);
  React__default.useEffect(() => {
    if (activeSnapPoint || activeSnapPointProp) {
      var _snapPoints_findIndex;
      const newIndex = (_snapPoints_findIndex = snapPoints == null ? void 0 : snapPoints.findIndex((snapPoint) => snapPoint === activeSnapPointProp || snapPoint === activeSnapPoint)) != null ? _snapPoints_findIndex : -1;
      if (snapPointsOffset && newIndex !== -1 && typeof snapPointsOffset[newIndex] === "number") {
        snapToPoint(snapPointsOffset[newIndex]);
      }
    }
  }, [
    activeSnapPoint,
    activeSnapPointProp,
    snapPoints,
    snapPointsOffset,
    snapToPoint
  ]);
  function onRelease({ draggedDistance, closeDrawer, velocity, dismissible }) {
    if (fadeFromIndex === void 0) return;
    const currentPosition = direction === "bottom" || direction === "right" ? (activeSnapPointOffset != null ? activeSnapPointOffset : 0) - draggedDistance : (activeSnapPointOffset != null ? activeSnapPointOffset : 0) + draggedDistance;
    const isOverlaySnapPoint = activeSnapPointIndex === fadeFromIndex - 1;
    const isFirst = activeSnapPointIndex === 0;
    const hasDraggedUp = draggedDistance > 0;
    if (isOverlaySnapPoint) {
      set(overlayRef.current, {
        transition: `opacity ${TRANSITIONS.DURATION}s cubic-bezier(${TRANSITIONS.EASE.join(",")})`
      });
    }
    if (!snapToSequentialPoint && velocity > 2 && !hasDraggedUp) {
      if (dismissible) closeDrawer();
      else snapToPoint(snapPointsOffset[0]);
      return;
    }
    if (!snapToSequentialPoint && velocity > 2 && hasDraggedUp && snapPointsOffset && snapPoints) {
      snapToPoint(snapPointsOffset[snapPoints.length - 1]);
      return;
    }
    const closestSnapPoint = snapPointsOffset == null ? void 0 : snapPointsOffset.reduce((prev, curr) => {
      if (typeof prev !== "number" || typeof curr !== "number") return prev;
      return Math.abs(curr - currentPosition) < Math.abs(prev - currentPosition) ? curr : prev;
    });
    const dim = isVertical(direction) ? window.innerHeight : window.innerWidth;
    if (velocity > VELOCITY_THRESHOLD && Math.abs(draggedDistance) < dim * 0.4) {
      const dragDirection = hasDraggedUp ? 1 : -1;
      if (dragDirection > 0 && isLastSnapPoint && snapPoints) {
        snapToPoint(snapPointsOffset[snapPoints.length - 1]);
        return;
      }
      if (isFirst && dragDirection < 0 && dismissible) {
        closeDrawer();
      }
      if (activeSnapPointIndex === null) return;
      snapToPoint(snapPointsOffset[activeSnapPointIndex + dragDirection]);
      return;
    }
    snapToPoint(closestSnapPoint);
  }
  function onDrag({ draggedDistance }) {
    if (activeSnapPointOffset === null) return;
    const newValue = direction === "bottom" || direction === "right" ? activeSnapPointOffset - draggedDistance : activeSnapPointOffset + draggedDistance;
    if ((direction === "bottom" || direction === "right") && newValue < snapPointsOffset[snapPointsOffset.length - 1]) {
      return;
    }
    if ((direction === "top" || direction === "left") && newValue > snapPointsOffset[snapPointsOffset.length - 1]) {
      return;
    }
    set(drawerRef.current, {
      transform: isVertical(direction) ? `translate3d(0, ${newValue}px, 0)` : `translate3d(${newValue}px, 0, 0)`
    });
  }
  function getPercentageDragged(absDraggedDistance, isDraggingDown) {
    if (!snapPoints || typeof activeSnapPointIndex !== "number" || !snapPointsOffset || fadeFromIndex === void 0) return null;
    const isOverlaySnapPoint = activeSnapPointIndex === fadeFromIndex - 1;
    const isOverlaySnapPointOrHigher = activeSnapPointIndex >= fadeFromIndex;
    if (isOverlaySnapPointOrHigher && isDraggingDown) {
      return 0;
    }
    if (isOverlaySnapPoint && !isDraggingDown) return 1;
    if (!shouldFade && !isOverlaySnapPoint) return null;
    const targetSnapPointIndex = isOverlaySnapPoint ? activeSnapPointIndex + 1 : activeSnapPointIndex - 1;
    const snapPointDistance = isOverlaySnapPoint ? snapPointsOffset[targetSnapPointIndex] - snapPointsOffset[targetSnapPointIndex - 1] : snapPointsOffset[targetSnapPointIndex + 1] - snapPointsOffset[targetSnapPointIndex];
    const percentageDragged = absDraggedDistance / Math.abs(snapPointDistance);
    if (isOverlaySnapPoint) {
      return 1 - percentageDragged;
    } else {
      return percentageDragged;
    }
  }
  return {
    isLastSnapPoint,
    activeSnapPoint,
    shouldFade,
    getPercentageDragged,
    setActiveSnapPoint,
    activeSnapPointIndex,
    onRelease,
    onDrag,
    snapPointsOffset
  };
}
const noop = () => () => {
};
function useScaleBackground() {
  const { direction, isOpen, shouldScaleBackground, setBackgroundColorOnScale, noBodyStyles } = useDrawerContext();
  const timeoutIdRef = React__default.useRef(null);
  const initialBackgroundColor = reactExports.useMemo(() => document.body.style.backgroundColor, []);
  function getScale() {
    return (window.innerWidth - WINDOW_TOP_OFFSET) / window.innerWidth;
  }
  React__default.useEffect(() => {
    if (isOpen && shouldScaleBackground) {
      if (timeoutIdRef.current) clearTimeout(timeoutIdRef.current);
      const wrapper = document.querySelector("[data-vaul-drawer-wrapper]") || document.querySelector("[vaul-drawer-wrapper]");
      if (!wrapper) return;
      chain(setBackgroundColorOnScale && !noBodyStyles ? assignStyle(document.body, {
        background: "black"
      }) : noop, assignStyle(wrapper, {
        transformOrigin: isVertical(direction) ? "top" : "left",
        transitionProperty: "transform, border-radius",
        transitionDuration: `${TRANSITIONS.DURATION}s`,
        transitionTimingFunction: `cubic-bezier(${TRANSITIONS.EASE.join(",")})`
      }));
      const wrapperStylesCleanup = assignStyle(wrapper, {
        borderRadius: `${BORDER_RADIUS}px`,
        overflow: "hidden",
        ...isVertical(direction) ? {
          transform: `scale(${getScale()}) translate3d(0, calc(env(safe-area-inset-top) + 14px), 0)`
        } : {
          transform: `scale(${getScale()}) translate3d(calc(env(safe-area-inset-top) + 14px), 0, 0)`
        }
      });
      return () => {
        wrapperStylesCleanup();
        timeoutIdRef.current = window.setTimeout(() => {
          if (initialBackgroundColor) {
            document.body.style.background = initialBackgroundColor;
          } else {
            document.body.style.removeProperty("background");
          }
        }, TRANSITIONS.DURATION * 1e3);
      };
    }
  }, [
    isOpen,
    shouldScaleBackground,
    initialBackgroundColor
  ]);
}
let previousBodyPosition = null;
function usePositionFixed({ isOpen, modal, nested, hasBeenOpened, preventScrollRestoration, noBodyStyles }) {
  const [activeUrl, setActiveUrl] = React__default.useState(() => typeof window !== "undefined" ? window.location.href : "");
  const scrollPos = React__default.useRef(0);
  const setPositionFixed = React__default.useCallback(() => {
    if (!isSafari()) return;
    if (previousBodyPosition === null && isOpen && !noBodyStyles) {
      previousBodyPosition = {
        position: document.body.style.position,
        top: document.body.style.top,
        left: document.body.style.left,
        height: document.body.style.height,
        right: "unset"
      };
      const { scrollX, innerHeight } = window;
      document.body.style.setProperty("position", "fixed", "important");
      Object.assign(document.body.style, {
        top: `${-scrollPos.current}px`,
        left: `${-scrollX}px`,
        right: "0px",
        height: "auto"
      });
      window.setTimeout(() => window.requestAnimationFrame(() => {
        const bottomBarHeight = innerHeight - window.innerHeight;
        if (bottomBarHeight && scrollPos.current >= innerHeight) {
          document.body.style.top = `${-(scrollPos.current + bottomBarHeight)}px`;
        }
      }), 300);
    }
  }, [
    isOpen
  ]);
  const restorePositionSetting = React__default.useCallback(() => {
    if (!isSafari()) return;
    if (previousBodyPosition !== null && !noBodyStyles) {
      const y = -parseInt(document.body.style.top, 10);
      const x = -parseInt(document.body.style.left, 10);
      Object.assign(document.body.style, previousBodyPosition);
      window.requestAnimationFrame(() => {
        if (preventScrollRestoration && activeUrl !== window.location.href) {
          setActiveUrl(window.location.href);
          return;
        }
        window.scrollTo(x, y);
      });
      previousBodyPosition = null;
    }
  }, [
    activeUrl
  ]);
  React__default.useEffect(() => {
    function onScroll() {
      scrollPos.current = window.scrollY;
    }
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);
  React__default.useEffect(() => {
    if (!modal) return;
    return () => {
      if (typeof document === "undefined") return;
      const hasDrawerOpened = !!document.querySelector("[data-vaul-drawer]");
      if (hasDrawerOpened) return;
      restorePositionSetting();
    };
  }, [
    modal,
    restorePositionSetting
  ]);
  React__default.useEffect(() => {
    if (nested || !hasBeenOpened) return;
    if (isOpen) {
      const isStandalone = window.matchMedia("(display-mode: standalone)").matches;
      !isStandalone && setPositionFixed();
      if (!modal) {
        window.setTimeout(() => {
          restorePositionSetting();
        }, 500);
      }
    } else {
      restorePositionSetting();
    }
  }, [
    isOpen,
    hasBeenOpened,
    activeUrl,
    modal,
    nested,
    setPositionFixed,
    restorePositionSetting
  ]);
  return {
    restorePositionSetting
  };
}
function Root({ open: openProp, onOpenChange, children, onDrag: onDragProp, onRelease: onReleaseProp, snapPoints, shouldScaleBackground = false, setBackgroundColorOnScale = true, closeThreshold = CLOSE_THRESHOLD, scrollLockTimeout = SCROLL_LOCK_TIMEOUT, dismissible = true, handleOnly = false, fadeFromIndex = snapPoints && snapPoints.length - 1, activeSnapPoint: activeSnapPointProp, setActiveSnapPoint: setActiveSnapPointProp, fixed, modal = true, onClose, nested, noBodyStyles = false, direction = "bottom", defaultOpen = false, disablePreventScroll = true, snapToSequentialPoint = false, preventScrollRestoration = false, repositionInputs = true, onAnimationEnd, container, autoFocus = false }) {
  var _drawerRef_current, _drawerRef_current1;
  const [isOpen = false, setIsOpen] = useControllableState({
    defaultProp: defaultOpen,
    prop: openProp,
    onChange: (o) => {
      onOpenChange == null ? void 0 : onOpenChange(o);
      if (!o && !nested) {
        restorePositionSetting();
      }
      setTimeout(() => {
        onAnimationEnd == null ? void 0 : onAnimationEnd(o);
      }, TRANSITIONS.DURATION * 1e3);
      if (o && !modal) {
        if (typeof window !== "undefined") {
          window.requestAnimationFrame(() => {
            document.body.style.pointerEvents = "auto";
          });
        }
      }
      if (!o) {
        document.body.style.pointerEvents = "auto";
      }
    }
  });
  const [hasBeenOpened, setHasBeenOpened] = React__default.useState(false);
  const [isDragging, setIsDragging] = React__default.useState(false);
  const [justReleased, setJustReleased] = React__default.useState(false);
  const overlayRef = React__default.useRef(null);
  const openTime = React__default.useRef(null);
  const dragStartTime = React__default.useRef(null);
  const dragEndTime = React__default.useRef(null);
  const lastTimeDragPrevented = React__default.useRef(null);
  const isAllowedToDrag = React__default.useRef(false);
  const nestedOpenChangeTimer = React__default.useRef(null);
  const pointerStart = React__default.useRef(0);
  const keyboardIsOpen = React__default.useRef(false);
  const shouldAnimate = React__default.useRef(!defaultOpen);
  const previousDiffFromInitial = React__default.useRef(0);
  const drawerRef = React__default.useRef(null);
  const drawerHeightRef = React__default.useRef(((_drawerRef_current = drawerRef.current) == null ? void 0 : _drawerRef_current.getBoundingClientRect().height) || 0);
  const drawerWidthRef = React__default.useRef(((_drawerRef_current1 = drawerRef.current) == null ? void 0 : _drawerRef_current1.getBoundingClientRect().width) || 0);
  const initialDrawerHeight = React__default.useRef(0);
  const onSnapPointChange = React__default.useCallback((activeSnapPointIndex2) => {
    if (snapPoints && activeSnapPointIndex2 === snapPointsOffset.length - 1) openTime.current = /* @__PURE__ */ new Date();
  }, []);
  const { activeSnapPoint, activeSnapPointIndex, setActiveSnapPoint, onRelease: onReleaseSnapPoints, snapPointsOffset, onDrag: onDragSnapPoints, shouldFade, getPercentageDragged: getSnapPointsPercentageDragged } = useSnapPoints({
    snapPoints,
    activeSnapPointProp,
    setActiveSnapPointProp,
    drawerRef,
    fadeFromIndex,
    overlayRef,
    onSnapPointChange,
    direction,
    container,
    snapToSequentialPoint
  });
  usePreventScroll({
    isDisabled: !isOpen || isDragging || !modal || justReleased || !hasBeenOpened || !repositionInputs || !disablePreventScroll
  });
  const { restorePositionSetting } = usePositionFixed({
    isOpen,
    modal,
    nested: nested != null ? nested : false,
    hasBeenOpened,
    preventScrollRestoration,
    noBodyStyles
  });
  function getScale() {
    return (window.innerWidth - WINDOW_TOP_OFFSET) / window.innerWidth;
  }
  function onPress(event) {
    var _drawerRef_current2, _drawerRef_current12;
    if (!dismissible && !snapPoints) return;
    if (drawerRef.current && !drawerRef.current.contains(event.target)) return;
    drawerHeightRef.current = ((_drawerRef_current2 = drawerRef.current) == null ? void 0 : _drawerRef_current2.getBoundingClientRect().height) || 0;
    drawerWidthRef.current = ((_drawerRef_current12 = drawerRef.current) == null ? void 0 : _drawerRef_current12.getBoundingClientRect().width) || 0;
    setIsDragging(true);
    dragStartTime.current = /* @__PURE__ */ new Date();
    if (isIOS()) {
      window.addEventListener("touchend", () => isAllowedToDrag.current = false, {
        once: true
      });
    }
    event.target.setPointerCapture(event.pointerId);
    pointerStart.current = isVertical(direction) ? event.pageY : event.pageX;
  }
  function shouldDrag(el, isDraggingInDirection) {
    var _window_getSelection;
    let element = el;
    const highlightedText = (_window_getSelection = window.getSelection()) == null ? void 0 : _window_getSelection.toString();
    const swipeAmount = drawerRef.current ? getTranslate(drawerRef.current, direction) : null;
    const date = /* @__PURE__ */ new Date();
    if (element.tagName === "SELECT") {
      return false;
    }
    if (element.hasAttribute("data-vaul-no-drag") || element.closest("[data-vaul-no-drag]")) {
      return false;
    }
    if (direction === "right" || direction === "left") {
      return true;
    }
    if (openTime.current && date.getTime() - openTime.current.getTime() < 500) {
      return false;
    }
    if (swipeAmount !== null) {
      if (direction === "bottom" ? swipeAmount > 0 : swipeAmount < 0) {
        return true;
      }
    }
    if (highlightedText && highlightedText.length > 0) {
      return false;
    }
    if (lastTimeDragPrevented.current && date.getTime() - lastTimeDragPrevented.current.getTime() < scrollLockTimeout && swipeAmount === 0) {
      lastTimeDragPrevented.current = date;
      return false;
    }
    if (isDraggingInDirection) {
      lastTimeDragPrevented.current = date;
      return false;
    }
    while (element) {
      if (element.scrollHeight > element.clientHeight) {
        if (element.scrollTop !== 0) {
          lastTimeDragPrevented.current = /* @__PURE__ */ new Date();
          return false;
        }
        if (element.getAttribute("role") === "dialog") {
          return true;
        }
      }
      element = element.parentNode;
    }
    return true;
  }
  function onDrag(event) {
    if (!drawerRef.current) {
      return;
    }
    if (isDragging) {
      const directionMultiplier = direction === "bottom" || direction === "right" ? 1 : -1;
      const draggedDistance = (pointerStart.current - (isVertical(direction) ? event.pageY : event.pageX)) * directionMultiplier;
      const isDraggingInDirection = draggedDistance > 0;
      const noCloseSnapPointsPreCondition = snapPoints && !dismissible && !isDraggingInDirection;
      if (noCloseSnapPointsPreCondition && activeSnapPointIndex === 0) return;
      const absDraggedDistance = Math.abs(draggedDistance);
      const wrapper = document.querySelector("[data-vaul-drawer-wrapper]");
      const drawerDimension = direction === "bottom" || direction === "top" ? drawerHeightRef.current : drawerWidthRef.current;
      let percentageDragged = absDraggedDistance / drawerDimension;
      const snapPointPercentageDragged = getSnapPointsPercentageDragged(absDraggedDistance, isDraggingInDirection);
      if (snapPointPercentageDragged !== null) {
        percentageDragged = snapPointPercentageDragged;
      }
      if (noCloseSnapPointsPreCondition && percentageDragged >= 1) {
        return;
      }
      if (!isAllowedToDrag.current && !shouldDrag(event.target, isDraggingInDirection)) return;
      drawerRef.current.classList.add(DRAG_CLASS);
      isAllowedToDrag.current = true;
      set(drawerRef.current, {
        transition: "none"
      });
      set(overlayRef.current, {
        transition: "none"
      });
      if (snapPoints) {
        onDragSnapPoints({
          draggedDistance
        });
      }
      if (isDraggingInDirection && !snapPoints) {
        const dampenedDraggedDistance = dampenValue(draggedDistance);
        const translateValue = Math.min(dampenedDraggedDistance * -1, 0) * directionMultiplier;
        set(drawerRef.current, {
          transform: isVertical(direction) ? `translate3d(0, ${translateValue}px, 0)` : `translate3d(${translateValue}px, 0, 0)`
        });
        return;
      }
      const opacityValue = 1 - percentageDragged;
      if (shouldFade || fadeFromIndex && activeSnapPointIndex === fadeFromIndex - 1) {
        onDragProp == null ? void 0 : onDragProp(event, percentageDragged);
        set(overlayRef.current, {
          opacity: `${opacityValue}`,
          transition: "none"
        }, true);
      }
      if (wrapper && overlayRef.current && shouldScaleBackground) {
        const scaleValue = Math.min(getScale() + percentageDragged * (1 - getScale()), 1);
        const borderRadiusValue = 8 - percentageDragged * 8;
        const translateValue = Math.max(0, 14 - percentageDragged * 14);
        set(wrapper, {
          borderRadius: `${borderRadiusValue}px`,
          transform: isVertical(direction) ? `scale(${scaleValue}) translate3d(0, ${translateValue}px, 0)` : `scale(${scaleValue}) translate3d(${translateValue}px, 0, 0)`,
          transition: "none"
        }, true);
      }
      if (!snapPoints) {
        const translateValue = absDraggedDistance * directionMultiplier;
        set(drawerRef.current, {
          transform: isVertical(direction) ? `translate3d(0, ${translateValue}px, 0)` : `translate3d(${translateValue}px, 0, 0)`
        });
      }
    }
  }
  React__default.useEffect(() => {
    window.requestAnimationFrame(() => {
      shouldAnimate.current = true;
    });
  }, []);
  React__default.useEffect(() => {
    var _window_visualViewport;
    function onVisualViewportChange() {
      if (!drawerRef.current || !repositionInputs) return;
      const focusedElement = document.activeElement;
      if (isInput(focusedElement) || keyboardIsOpen.current) {
        var _window_visualViewport2;
        const visualViewportHeight = ((_window_visualViewport2 = window.visualViewport) == null ? void 0 : _window_visualViewport2.height) || 0;
        const totalHeight = window.innerHeight;
        let diffFromInitial = totalHeight - visualViewportHeight;
        const drawerHeight = drawerRef.current.getBoundingClientRect().height || 0;
        const isTallEnough = drawerHeight > totalHeight * 0.8;
        if (!initialDrawerHeight.current) {
          initialDrawerHeight.current = drawerHeight;
        }
        const offsetFromTop = drawerRef.current.getBoundingClientRect().top;
        if (Math.abs(previousDiffFromInitial.current - diffFromInitial) > 60) {
          keyboardIsOpen.current = !keyboardIsOpen.current;
        }
        if (snapPoints && snapPoints.length > 0 && snapPointsOffset && activeSnapPointIndex) {
          const activeSnapPointHeight = snapPointsOffset[activeSnapPointIndex] || 0;
          diffFromInitial += activeSnapPointHeight;
        }
        previousDiffFromInitial.current = diffFromInitial;
        if (drawerHeight > visualViewportHeight || keyboardIsOpen.current) {
          const height = drawerRef.current.getBoundingClientRect().height;
          let newDrawerHeight = height;
          if (height > visualViewportHeight) {
            newDrawerHeight = visualViewportHeight - (isTallEnough ? offsetFromTop : WINDOW_TOP_OFFSET);
          }
          if (fixed) {
            drawerRef.current.style.height = `${height - Math.max(diffFromInitial, 0)}px`;
          } else {
            drawerRef.current.style.height = `${Math.max(newDrawerHeight, visualViewportHeight - offsetFromTop)}px`;
          }
        } else if (!isMobileFirefox()) {
          drawerRef.current.style.height = `${initialDrawerHeight.current}px`;
        }
        if (snapPoints && snapPoints.length > 0 && !keyboardIsOpen.current) {
          drawerRef.current.style.bottom = `0px`;
        } else {
          drawerRef.current.style.bottom = `${Math.max(diffFromInitial, 0)}px`;
        }
      }
    }
    (_window_visualViewport = window.visualViewport) == null ? void 0 : _window_visualViewport.addEventListener("resize", onVisualViewportChange);
    return () => {
      var _window_visualViewport2;
      return (_window_visualViewport2 = window.visualViewport) == null ? void 0 : _window_visualViewport2.removeEventListener("resize", onVisualViewportChange);
    };
  }, [
    activeSnapPointIndex,
    snapPoints,
    snapPointsOffset
  ]);
  function closeDrawer(fromWithin) {
    cancelDrag();
    onClose == null ? void 0 : onClose();
    if (!fromWithin) {
      setIsOpen(false);
    }
    setTimeout(() => {
      if (snapPoints) {
        setActiveSnapPoint(snapPoints[0]);
      }
    }, TRANSITIONS.DURATION * 1e3);
  }
  function resetDrawer() {
    if (!drawerRef.current) return;
    const wrapper = document.querySelector("[data-vaul-drawer-wrapper]");
    const currentSwipeAmount = getTranslate(drawerRef.current, direction);
    set(drawerRef.current, {
      transform: "translate3d(0, 0, 0)",
      transition: `transform ${TRANSITIONS.DURATION}s cubic-bezier(${TRANSITIONS.EASE.join(",")})`
    });
    set(overlayRef.current, {
      transition: `opacity ${TRANSITIONS.DURATION}s cubic-bezier(${TRANSITIONS.EASE.join(",")})`,
      opacity: "1"
    });
    if (shouldScaleBackground && currentSwipeAmount && currentSwipeAmount > 0 && isOpen) {
      set(wrapper, {
        borderRadius: `${BORDER_RADIUS}px`,
        overflow: "hidden",
        ...isVertical(direction) ? {
          transform: `scale(${getScale()}) translate3d(0, calc(env(safe-area-inset-top) + 14px), 0)`,
          transformOrigin: "top"
        } : {
          transform: `scale(${getScale()}) translate3d(calc(env(safe-area-inset-top) + 14px), 0, 0)`,
          transformOrigin: "left"
        },
        transitionProperty: "transform, border-radius",
        transitionDuration: `${TRANSITIONS.DURATION}s`,
        transitionTimingFunction: `cubic-bezier(${TRANSITIONS.EASE.join(",")})`
      }, true);
    }
  }
  function cancelDrag() {
    if (!isDragging || !drawerRef.current) return;
    drawerRef.current.classList.remove(DRAG_CLASS);
    isAllowedToDrag.current = false;
    setIsDragging(false);
    dragEndTime.current = /* @__PURE__ */ new Date();
  }
  function onRelease(event) {
    if (!isDragging || !drawerRef.current) return;
    drawerRef.current.classList.remove(DRAG_CLASS);
    isAllowedToDrag.current = false;
    setIsDragging(false);
    dragEndTime.current = /* @__PURE__ */ new Date();
    const swipeAmount = getTranslate(drawerRef.current, direction);
    if (!event || !shouldDrag(event.target, false) || !swipeAmount || Number.isNaN(swipeAmount)) return;
    if (dragStartTime.current === null) return;
    const timeTaken = dragEndTime.current.getTime() - dragStartTime.current.getTime();
    const distMoved = pointerStart.current - (isVertical(direction) ? event.pageY : event.pageX);
    const velocity = Math.abs(distMoved) / timeTaken;
    if (velocity > 0.05) {
      setJustReleased(true);
      setTimeout(() => {
        setJustReleased(false);
      }, 200);
    }
    if (snapPoints) {
      const directionMultiplier = direction === "bottom" || direction === "right" ? 1 : -1;
      onReleaseSnapPoints({
        draggedDistance: distMoved * directionMultiplier,
        closeDrawer,
        velocity,
        dismissible
      });
      onReleaseProp == null ? void 0 : onReleaseProp(event, true);
      return;
    }
    if (direction === "bottom" || direction === "right" ? distMoved > 0 : distMoved < 0) {
      resetDrawer();
      onReleaseProp == null ? void 0 : onReleaseProp(event, true);
      return;
    }
    if (velocity > VELOCITY_THRESHOLD) {
      closeDrawer();
      onReleaseProp == null ? void 0 : onReleaseProp(event, false);
      return;
    }
    var _drawerRef_current_getBoundingClientRect_height;
    const visibleDrawerHeight = Math.min((_drawerRef_current_getBoundingClientRect_height = drawerRef.current.getBoundingClientRect().height) != null ? _drawerRef_current_getBoundingClientRect_height : 0, window.innerHeight);
    var _drawerRef_current_getBoundingClientRect_width;
    const visibleDrawerWidth = Math.min((_drawerRef_current_getBoundingClientRect_width = drawerRef.current.getBoundingClientRect().width) != null ? _drawerRef_current_getBoundingClientRect_width : 0, window.innerWidth);
    const isHorizontalSwipe = direction === "left" || direction === "right";
    if (Math.abs(swipeAmount) >= (isHorizontalSwipe ? visibleDrawerWidth : visibleDrawerHeight) * closeThreshold) {
      closeDrawer();
      onReleaseProp == null ? void 0 : onReleaseProp(event, false);
      return;
    }
    onReleaseProp == null ? void 0 : onReleaseProp(event, true);
    resetDrawer();
  }
  React__default.useEffect(() => {
    if (isOpen) {
      set(document.documentElement, {
        scrollBehavior: "auto"
      });
      openTime.current = /* @__PURE__ */ new Date();
    }
    return () => {
      reset(document.documentElement, "scrollBehavior");
    };
  }, [
    isOpen
  ]);
  function onNestedOpenChange(o) {
    const scale = o ? (window.innerWidth - NESTED_DISPLACEMENT) / window.innerWidth : 1;
    const initialTranslate = o ? -NESTED_DISPLACEMENT : 0;
    if (nestedOpenChangeTimer.current) {
      window.clearTimeout(nestedOpenChangeTimer.current);
    }
    set(drawerRef.current, {
      transition: `transform ${TRANSITIONS.DURATION}s cubic-bezier(${TRANSITIONS.EASE.join(",")})`,
      transform: isVertical(direction) ? `scale(${scale}) translate3d(0, ${initialTranslate}px, 0)` : `scale(${scale}) translate3d(${initialTranslate}px, 0, 0)`
    });
    if (!o && drawerRef.current) {
      nestedOpenChangeTimer.current = setTimeout(() => {
        const translateValue = getTranslate(drawerRef.current, direction);
        set(drawerRef.current, {
          transition: "none",
          transform: isVertical(direction) ? `translate3d(0, ${translateValue}px, 0)` : `translate3d(${translateValue}px, 0, 0)`
        });
      }, 500);
    }
  }
  function onNestedDrag(_event, percentageDragged) {
    if (percentageDragged < 0) return;
    const initialScale = (window.innerWidth - NESTED_DISPLACEMENT) / window.innerWidth;
    const newScale = initialScale + percentageDragged * (1 - initialScale);
    const newTranslate = -NESTED_DISPLACEMENT + percentageDragged * NESTED_DISPLACEMENT;
    set(drawerRef.current, {
      transform: isVertical(direction) ? `scale(${newScale}) translate3d(0, ${newTranslate}px, 0)` : `scale(${newScale}) translate3d(${newTranslate}px, 0, 0)`,
      transition: "none"
    });
  }
  function onNestedRelease(_event, o) {
    const dim = isVertical(direction) ? window.innerHeight : window.innerWidth;
    const scale = o ? (dim - NESTED_DISPLACEMENT) / dim : 1;
    const translate = o ? -NESTED_DISPLACEMENT : 0;
    if (o) {
      set(drawerRef.current, {
        transition: `transform ${TRANSITIONS.DURATION}s cubic-bezier(${TRANSITIONS.EASE.join(",")})`,
        transform: isVertical(direction) ? `scale(${scale}) translate3d(0, ${translate}px, 0)` : `scale(${scale}) translate3d(${translate}px, 0, 0)`
      });
    }
  }
  React__default.useEffect(() => {
    if (!modal) {
      window.requestAnimationFrame(() => {
        document.body.style.pointerEvents = "auto";
      });
    }
  }, [
    modal
  ]);
  return /* @__PURE__ */ React__default.createElement(Root$1, {
    defaultOpen,
    onOpenChange: (open) => {
      if (!dismissible && !open) return;
      if (open) {
        setHasBeenOpened(true);
      } else {
        closeDrawer(true);
      }
      setIsOpen(open);
    },
    open: isOpen
  }, /* @__PURE__ */ React__default.createElement(DrawerContext.Provider, {
    value: {
      activeSnapPoint,
      snapPoints,
      setActiveSnapPoint,
      drawerRef,
      overlayRef,
      onOpenChange,
      onPress,
      onRelease,
      onDrag,
      dismissible,
      shouldAnimate,
      handleOnly,
      isOpen,
      isDragging,
      shouldFade,
      closeDrawer,
      onNestedDrag,
      onNestedOpenChange,
      onNestedRelease,
      keyboardIsOpen,
      modal,
      snapPointsOffset,
      activeSnapPointIndex,
      direction,
      shouldScaleBackground,
      setBackgroundColorOnScale,
      noBodyStyles,
      container,
      autoFocus
    }
  }, children));
}
const Overlay = /* @__PURE__ */ React__default.forwardRef(function({ ...rest }, ref) {
  const { overlayRef, snapPoints, onRelease, shouldFade, isOpen, modal, shouldAnimate } = useDrawerContext();
  const composedRef = useComposedRefs(ref, overlayRef);
  const hasSnapPoints = snapPoints && snapPoints.length > 0;
  if (!modal) {
    return null;
  }
  const onMouseUp = React__default.useCallback((event) => onRelease(event), [
    onRelease
  ]);
  return /* @__PURE__ */ React__default.createElement(Overlay$1, {
    onMouseUp,
    ref: composedRef,
    "data-vaul-overlay": "",
    "data-vaul-snap-points": isOpen && hasSnapPoints ? "true" : "false",
    "data-vaul-snap-points-overlay": isOpen && shouldFade ? "true" : "false",
    "data-vaul-animate": (shouldAnimate == null ? void 0 : shouldAnimate.current) ? "true" : "false",
    ...rest
  });
});
Overlay.displayName = "Drawer.Overlay";
const Content = /* @__PURE__ */ React__default.forwardRef(function({ onPointerDownOutside, style, onOpenAutoFocus, ...rest }, ref) {
  const { drawerRef, onPress, onRelease, onDrag, keyboardIsOpen, snapPointsOffset, activeSnapPointIndex, modal, isOpen, direction, snapPoints, container, handleOnly, shouldAnimate, autoFocus } = useDrawerContext();
  const [delayedSnapPoints, setDelayedSnapPoints] = React__default.useState(false);
  const composedRef = useComposedRefs(ref, drawerRef);
  const pointerStartRef = React__default.useRef(null);
  const lastKnownPointerEventRef = React__default.useRef(null);
  const wasBeyondThePointRef = React__default.useRef(false);
  const hasSnapPoints = snapPoints && snapPoints.length > 0;
  useScaleBackground();
  const isDeltaInDirection = (delta, direction2, threshold = 0) => {
    if (wasBeyondThePointRef.current) return true;
    const deltaY = Math.abs(delta.y);
    const deltaX = Math.abs(delta.x);
    const isDeltaX = deltaX > deltaY;
    const dFactor = [
      "bottom",
      "right"
    ].includes(direction2) ? 1 : -1;
    if (direction2 === "left" || direction2 === "right") {
      const isReverseDirection = delta.x * dFactor < 0;
      if (!isReverseDirection && deltaX >= 0 && deltaX <= threshold) {
        return isDeltaX;
      }
    } else {
      const isReverseDirection = delta.y * dFactor < 0;
      if (!isReverseDirection && deltaY >= 0 && deltaY <= threshold) {
        return !isDeltaX;
      }
    }
    wasBeyondThePointRef.current = true;
    return true;
  };
  React__default.useEffect(() => {
    if (hasSnapPoints) {
      window.requestAnimationFrame(() => {
        setDelayedSnapPoints(true);
      });
    }
  }, []);
  function handleOnPointerUp(event) {
    pointerStartRef.current = null;
    wasBeyondThePointRef.current = false;
    onRelease(event);
  }
  return /* @__PURE__ */ React__default.createElement(Content$1, {
    "data-vaul-drawer-direction": direction,
    "data-vaul-drawer": "",
    "data-vaul-delayed-snap-points": delayedSnapPoints ? "true" : "false",
    "data-vaul-snap-points": isOpen && hasSnapPoints ? "true" : "false",
    "data-vaul-custom-container": container ? "true" : "false",
    "data-vaul-animate": (shouldAnimate == null ? void 0 : shouldAnimate.current) ? "true" : "false",
    ...rest,
    ref: composedRef,
    style: snapPointsOffset && snapPointsOffset.length > 0 ? {
      "--snap-point-height": `${snapPointsOffset[activeSnapPointIndex != null ? activeSnapPointIndex : 0]}px`,
      ...style
    } : style,
    onPointerDown: (event) => {
      if (handleOnly) return;
      rest.onPointerDown == null ? void 0 : rest.onPointerDown.call(rest, event);
      pointerStartRef.current = {
        x: event.pageX,
        y: event.pageY
      };
      onPress(event);
    },
    onOpenAutoFocus: (e) => {
      onOpenAutoFocus == null ? void 0 : onOpenAutoFocus(e);
      if (!autoFocus) {
        e.preventDefault();
      }
    },
    onPointerDownOutside: (e) => {
      onPointerDownOutside == null ? void 0 : onPointerDownOutside(e);
      if (!modal || e.defaultPrevented) {
        e.preventDefault();
        return;
      }
      if (keyboardIsOpen.current) {
        keyboardIsOpen.current = false;
      }
    },
    onFocusOutside: (e) => {
      if (!modal) {
        e.preventDefault();
        return;
      }
    },
    onPointerMove: (event) => {
      lastKnownPointerEventRef.current = event;
      if (handleOnly) return;
      rest.onPointerMove == null ? void 0 : rest.onPointerMove.call(rest, event);
      if (!pointerStartRef.current) return;
      const yPosition = event.pageY - pointerStartRef.current.y;
      const xPosition = event.pageX - pointerStartRef.current.x;
      const swipeStartThreshold = event.pointerType === "touch" ? 10 : 2;
      const delta = {
        x: xPosition,
        y: yPosition
      };
      const isAllowedToSwipe = isDeltaInDirection(delta, direction, swipeStartThreshold);
      if (isAllowedToSwipe) onDrag(event);
      else if (Math.abs(xPosition) > swipeStartThreshold || Math.abs(yPosition) > swipeStartThreshold) {
        pointerStartRef.current = null;
      }
    },
    onPointerUp: (event) => {
      rest.onPointerUp == null ? void 0 : rest.onPointerUp.call(rest, event);
      pointerStartRef.current = null;
      wasBeyondThePointRef.current = false;
      onRelease(event);
    },
    onPointerOut: (event) => {
      rest.onPointerOut == null ? void 0 : rest.onPointerOut.call(rest, event);
      handleOnPointerUp(lastKnownPointerEventRef.current);
    },
    onContextMenu: (event) => {
      rest.onContextMenu == null ? void 0 : rest.onContextMenu.call(rest, event);
      if (lastKnownPointerEventRef.current) {
        handleOnPointerUp(lastKnownPointerEventRef.current);
      }
    }
  });
});
Content.displayName = "Drawer.Content";
const LONG_HANDLE_PRESS_TIMEOUT = 250;
const DOUBLE_TAP_TIMEOUT = 120;
const Handle = /* @__PURE__ */ React__default.forwardRef(function({ preventCycle = false, children, ...rest }, ref) {
  const { closeDrawer, isDragging, snapPoints, activeSnapPoint, setActiveSnapPoint, dismissible, handleOnly, isOpen, onPress, onDrag } = useDrawerContext();
  const closeTimeoutIdRef = React__default.useRef(null);
  const shouldCancelInteractionRef = React__default.useRef(false);
  function handleStartCycle() {
    if (shouldCancelInteractionRef.current) {
      handleCancelInteraction();
      return;
    }
    window.setTimeout(() => {
      handleCycleSnapPoints();
    }, DOUBLE_TAP_TIMEOUT);
  }
  function handleCycleSnapPoints() {
    if (isDragging || preventCycle || shouldCancelInteractionRef.current) {
      handleCancelInteraction();
      return;
    }
    handleCancelInteraction();
    if (!snapPoints || snapPoints.length === 0) {
      if (!dismissible) {
        closeDrawer();
      }
      return;
    }
    const isLastSnapPoint = activeSnapPoint === snapPoints[snapPoints.length - 1];
    if (isLastSnapPoint && dismissible) {
      closeDrawer();
      return;
    }
    const currentSnapIndex = snapPoints.findIndex((point) => point === activeSnapPoint);
    if (currentSnapIndex === -1) return;
    const nextSnapPoint = snapPoints[currentSnapIndex + 1];
    setActiveSnapPoint(nextSnapPoint);
  }
  function handleStartInteraction() {
    closeTimeoutIdRef.current = window.setTimeout(() => {
      shouldCancelInteractionRef.current = true;
    }, LONG_HANDLE_PRESS_TIMEOUT);
  }
  function handleCancelInteraction() {
    if (closeTimeoutIdRef.current) {
      window.clearTimeout(closeTimeoutIdRef.current);
    }
    shouldCancelInteractionRef.current = false;
  }
  return /* @__PURE__ */ React__default.createElement("div", {
    onClick: handleStartCycle,
    onPointerCancel: handleCancelInteraction,
    onPointerDown: (e) => {
      if (handleOnly) onPress(e);
      handleStartInteraction();
    },
    onPointerMove: (e) => {
      if (handleOnly) onDrag(e);
    },
    // onPointerUp is already handled by the content component
    ref,
    "data-vaul-drawer-visible": isOpen ? "true" : "false",
    "data-vaul-handle": "",
    "aria-hidden": "true",
    ...rest
  }, /* @__PURE__ */ React__default.createElement("span", {
    "data-vaul-handle-hitarea": "",
    "aria-hidden": "true"
  }, children));
});
Handle.displayName = "Drawer.Handle";
function Portal(props) {
  const context = useDrawerContext();
  const { container = context.container, ...portalProps } = props;
  return /* @__PURE__ */ React__default.createElement(Portal$1, {
    container,
    ...portalProps
  });
}
const Drawer$1 = {
  Root,
  Content,
  Overlay,
  Trigger,
  Portal,
  Close,
  Title,
  Description
};
function Drawer({
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Drawer$1.Root, { "data-slot": "drawer", ...props });
}
function DrawerTrigger({
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Drawer$1.Trigger, { "data-slot": "drawer-trigger", ...props });
}
function DrawerPortal({
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Drawer$1.Portal, { "data-slot": "drawer-portal", ...props });
}
function DrawerClose({
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Drawer$1.Close, { "data-slot": "drawer-close", ...props });
}
function DrawerOverlay({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Drawer$1.Overlay,
    {
      "data-slot": "drawer-overlay",
      className: cn(
        "fixed inset-0 z-50 bg-black/10 supports-backdrop-filter:backdrop-blur-xs data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0",
        className
      ),
      ...props
    }
  );
}
function DrawerContent({
  className,
  children,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(DrawerPortal, { "data-slot": "drawer-portal", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DrawerOverlay, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Drawer$1.Content,
      {
        "data-slot": "drawer-content",
        className: cn(
          "fixed z-50 flex flex-col bg-background border",
          // Top and bottom
          (!props.style || props.style?.["--vaul-drawer-direction"] === "bottom") && "inset-x-0 bottom-0 mt-24 h-auto rounded-t-[10px]",
          // Right
          props.style?.["--vaul-drawer-direction"] === "right" && "inset-y-0 right-0 w-3/4 max-w-sm sm:max-w-md h-full",
          className
        ),
        ...props,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto mt-4 hidden h-1 w-[100px] shrink-0 rounded-full bg-muted group-data-[vaul-drawer-direction=bottom]/drawer-content:block" }),
          children
        ]
      }
    )
  ] });
}
function DrawerHeader({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      "data-slot": "drawer-header",
      className: cn(
        "flex flex-col gap-0.5 p-4 group-data-[vaul-drawer-direction=bottom]/drawer-content:text-center group-data-[vaul-drawer-direction=top]/drawer-content:text-center md:gap-0.5 md:text-left",
        className
      ),
      ...props
    }
  );
}
function DrawerFooter({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      "data-slot": "drawer-footer",
      className: cn("mt-auto flex flex-col gap-2 p-4", className),
      ...props
    }
  );
}
function DrawerTitle({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Drawer$1.Title,
    {
      "data-slot": "drawer-title",
      className: cn(
        "font-heading text-base font-medium text-foreground",
        className
      ),
      ...props
    }
  );
}
function DrawerDescription({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Drawer$1.Description,
    {
      "data-slot": "drawer-description",
      className: cn("text-sm text-muted-foreground", className),
      ...props
    }
  );
}
function MobileMenu({
  navItems,
  currentPath,
  user,
  isAdmin
}) {
  const isActive = (href, exact = false) => {
    if (href === "/") return currentPath === "/";
    if (exact) return currentPath === href;
    return currentPath.startsWith(href);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Drawer, { direction: "right", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DrawerTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        type: "button",
        className: "inline-flex h-10 w-10 md:hidden cursor-pointer items-center justify-center rounded-xl border border-border/60 bg-background/60 text-sm font-medium text-foreground shadow-sm transition hover:bg-muted",
        "aria-label": "Open Menu",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "svg",
          {
            className: "h-5 w-5 text-foreground",
            fill: "none",
            stroke: "currentColor",
            viewBox: "0 0 24 24",
            strokeWidth: "2",
            strokeLinecap: "round",
            strokeLinejoin: "round",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "3", y1: "12", x2: "21", y2: "12" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "3", y1: "6", x2: "21", y2: "6" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "3", y1: "18", x2: "21", y2: "18" })
            ]
          }
        )
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(DrawerContent, { className: "h-screen top-0 right-0 left-auto mt-0 w-[min(75vw,280px)] rounded-none", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto w-full flex flex-col h-full overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DrawerHeader, { className: "flex flex-row items-center justify-between border-b border-border/50 pb-4 pt-4 px-4 bg-muted/20", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DrawerTitle, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: "/", className: "group flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "img",
            {
              src: "/logo.png",
              alt: "Wuxia Dreams",
              width: "28",
              height: "28",
              className: "h-7 w-7 rounded-md ring-1 ring-border/70",
              loading: "eager"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "leading-tight text-left", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[13px] font-semibold tracking-tight text-foreground", children: "Wuxia Dreams" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] tracking-[0.1em] text-muted-foreground", children: "Free novels online" })
          ] })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DrawerClose, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            className: "h-8 w-8 inline-flex items-center justify-center rounded-lg hover:bg-muted",
            "aria-label": "Close Menu",
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "svg",
              {
                className: "h-5 w-5 text-muted-foreground",
                fill: "none",
                stroke: "currentColor",
                viewBox: "0 0 24 24",
                strokeWidth: "2",
                strokeLinecap: "round",
                strokeLinejoin: "round",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M18 6 6 18" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "m6 6 12 12" })
                ]
              }
            )
          }
        ) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 overflow-y-auto p-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx("form", { action: "/novels", method: "get", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "svg",
            {
              className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/70",
              fill: "none",
              stroke: "currentColor",
              viewBox: "0 0 24 24",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "path",
                {
                  strokeLinecap: "round",
                  strokeLinejoin: "round",
                  strokeWidth: "2",
                  d: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                }
              )
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              name: "q",
              placeholder: "Search titles / authors",
              className: "h-10 w-full rounded-xl border border-input bg-background/60 pl-9 pr-4 text-sm text-foreground shadow-sm placeholder:text-muted-foreground/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 transition-all"
            }
          )
        ] }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1", children: [
          navItems.map(
            (item) => item.subItems ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-2 space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-3 py-2 text-[11px] font-bold text-muted-foreground/70 uppercase tracking-widest", children: item.label }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-0.5 border-l-2 border-border/40 ml-3 pl-1", children: item.subItems.map((sub) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                "a",
                {
                  href: sub.href,
                  className: `block rounded-lg px-3 py-2 text-[13px] font-medium transition-colors ${isActive(sub.href, true) ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"}`,
                  children: sub.label
                },
                sub.label
              )) })
            ] }, item.label) : /* @__PURE__ */ jsxRuntimeExports.jsx(
              "a",
              {
                href: item.href,
                className: `rounded-lg px-3 py-2 text-sm font-medium transition-colors ${isActive(item.href) ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"}`,
                children: item.label
              },
              item.label
            )
          ),
          user ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 border-t border-border/40 pt-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-3 pb-3 mb-2 border-b border-border/40 flex items-center gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-bold uppercase ring-1 ring-primary/20", children: user.name?.charAt(0) || user.email?.charAt(0) || "U" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col overflow-hidden", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-semibold text-foreground truncate", children: user.name }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] text-muted-foreground truncate", children: user.email })
              ] })
            ] }),
            isAdmin && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "a",
              {
                href: "/admin/users",
                className: "flex items-center rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted/70 hover:text-foreground",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "svg",
                    {
                      className: "mr-2 h-4 w-4",
                      fill: "none",
                      stroke: "currentColor",
                      viewBox: "0 0 24 24",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "path",
                        {
                          strokeLinecap: "round",
                          strokeLinejoin: "round",
                          strokeWidth: "2",
                          d: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                        }
                      )
                    }
                  ),
                  "Admin Dashboard"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                "data-logout-btn": true,
                className: "mt-2 flex w-full items-center justify-center rounded-xl bg-destructive/10 px-4 h-10 text-sm font-semibold text-destructive transition-colors hover:bg-destructive/20 cursor-pointer",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "svg",
                    {
                      className: "mr-2 h-4 w-4",
                      fill: "none",
                      stroke: "currentColor",
                      viewBox: "0 0 24 24",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "path",
                        {
                          strokeLinecap: "round",
                          strokeLinejoin: "round",
                          strokeWidth: "2",
                          d: "M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        }
                      )
                    }
                  ),
                  "Log out"
                ]
              }
            )
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 border-t border-border/40 pt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "a",
            {
              href: "/auth/signin",
              className: "flex h-10 w-full items-center justify-center rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90",
              children: "Sign in"
            }
          ) })
        ] })
      ] })
    ] }) })
  ] });
}
var __freeze$1 = Object.freeze;
var __defProp$1 = Object.defineProperty;
var __template$1 = (cooked, raw) => __freeze$1(__defProp$1(cooked, "raw", { value: __freeze$1(cooked.slice()) }));
var _a$1;
const $$Header = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Header;
  const { currentPath = "/" } = Astro2.props;
  const user = Astro2.locals.user;
  const adminEmails = (env.ADMIN_EMAILS ?? "").split(",");
  const isAdmin = user ? adminEmails.includes(user.email || "") : false;
  const navItems = [
    {
      href: "/novels",
      label: "Browse",
      subItems: [
        { href: "/novels", label: "All Novels" },
        { href: "/rankings", label: "Rankings" }
      ]
    },
    { href: "/genres", label: "Genres" },
    { href: "/authors", label: "Authors" },
    { href: "/library", label: "Library" }
  ];
  const isActive = (href, exact = false) => {
    if (href === "/") return currentPath === "/";
    if (exact) return currentPath === href;
    return currentPath.startsWith(href);
  };
  return renderTemplate(_a$1 || (_a$1 = __template$1(["", '<header class="sticky top-0 z-40 border-b border-border/60 bg-background/90 backdrop-blur"> <div class="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4"> <a href="/" class="group flex items-center gap-3"> ', ' <div class="leading-tight"> <div class="text-sm font-semibold tracking-tight text-foreground">\nWuxia Dreams\n</div> <div class="text-[11px] tracking-[0.1em] text-muted-foreground">\nFree Novels Online\n</div> </div> </a> <nav class="ml-6 hidden items-center gap-1 md:flex"> ', ' </nav> <div class="ml-auto flex items-center gap-2"> <form action="/novels" method="get" class="hidden lg:block"> <label class="group relative block"> <input name="q" placeholder="Search titles / authors / tags" class="h-10 w-[22rem] rounded-xl border border-input bg-background/60 px-3 pr-10 text-sm text-foreground shadow-sm transition placeholder:text-muted-foreground/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"> <div class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">\n⌘K\n</div> </label> </form> <button type="button" data-theme-toggle class="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border/60 bg-background/60 text-foreground shadow-sm transition hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50" aria-label="Toggle theme"> <span class="sr-only">Toggle theme</span> <svg class="h-4 w-4 text-muted-foreground dark:hidden" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"> <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"></path> </svg> <svg class="hidden h-4 w-4 text-muted-foreground dark:block" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"> <circle cx="12" cy="12" r="4"></circle> <path d="M12 2v2"></path> <path d="M12 20v2"></path> <path d="M4.93 4.93l1.41 1.41"></path> <path d="M17.66 17.66l1.41 1.41"></path> <path d="M2 12h2"></path> <path d="M20 12h2"></path> <path d="M6.34 17.66l-1.41 1.41"></path> <path d="M19.07 4.93l-1.41 1.41"></path> </svg> </button> ', " ", " </div> </div> </header> ", ' <script>\n  (() => {\n    const buttons = document.querySelectorAll("[data-theme-toggle]");\n    if (!buttons.length) return;\n\n    const root = document.documentElement;\n\n    for (const btn of buttons) {\n      btn.addEventListener("click", () => {\n        const nextIsDark = root.classList.toggle("dark");\n        const next = nextIsDark ? "dark" : "light";\n        root.style.colorScheme = next;\n        try {\n          localStorage.setItem("theme", next);\n        } catch {}\n      });\n    }\n  })();\n<\/script>'])), maybeRenderHead(), renderComponent($$result, "Image", $$Image, { "src": "/logo.png", "alt": "Wuxia Dreams", "width": 32, "height": 32, "class": "h-8 w-8 rounded-md ring-1 ring-border/70", "loading": "eager" }), navItems.map(
    (item) => item.subItems ? renderTemplate`<div class="relative group"> <a${addAttribute(item.href, "href")}${addAttribute(isActive(item.href) ? "page" : void 0, "aria-current")}${addAttribute([
      "inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition",
      isActive(item.href) || item.subItems.some((sub) => isActive(sub.href)) ? "bg-muted text-foreground" : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
    ], "class:list")}> ${item.label} <svg class="h-3.5 w-3.5 opacity-50 transition-transform duration-200 group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path> </svg> </a> <div class="absolute left-0 top-full hidden pt-2 group-hover:block"> <div class="w-48 rounded-xl border border-border/70 bg-background/95 p-1.5 shadow-xl backdrop-blur"> ${item.subItems.map((sub) => renderTemplate`<a${addAttribute(sub.href, "href")}${addAttribute([
      "block rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
      isActive(sub.href, true) ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"
    ], "class:list")}> ${sub.label} </a>`)} </div> </div> </div>` : renderTemplate`<a${addAttribute(item.href, "href")}${addAttribute(isActive(item.href) ? "page" : void 0, "aria-current")}${addAttribute([
      "rounded-lg px-3 py-2 text-sm font-medium transition",
      isActive(item.href) ? "bg-muted text-foreground" : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
    ], "class:list")}> ${item.label} </a>`
  ), user ? renderTemplate`${renderComponent($$result, "UserMenu", UserMenu, { "client:load": true, "isAdmin": isAdmin, "user": {
    id: user.id,
    name: user.name,
    email: user.email,
    image: user.image
  }, "client:component-hydration": "load", "client:component-path": "/Users/yangfuzhang/Desktop/wuxiadreams/wuxiadreams.com/src/components/user-menu", "client:component-export": "UserMenu" })}` : renderTemplate`${renderComponent($$result, "AuthDialog", AuthDialog, { "client:load": true, "client:component-hydration": "load", "client:component-path": "/Users/yangfuzhang/Desktop/wuxiadreams/wuxiadreams.com/src/components/auth-dialog", "client:component-export": "AuthDialog" })}`, renderComponent($$result, "MobileMenu", MobileMenu, { "client:load": true, "navItems": navItems, "currentPath": currentPath, "user": user, "isAdmin": isAdmin, "client:component-hydration": "load", "client:component-path": "/Users/yangfuzhang/Desktop/wuxiadreams/wuxiadreams.com/src/components/mobile-menu", "client:component-export": "MobileMenu" }), renderScript($$result, "/Users/yangfuzhang/Desktop/wuxiadreams/wuxiadreams.com/src/components/header.astro?astro&type=script&index=0&lang.ts"));
}, "/Users/yangfuzhang/Desktop/wuxiadreams/wuxiadreams.com/src/components/header.astro", void 0);
const $$Footer = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Footer;
  const user = Astro2.locals.user;
  const year = (/* @__PURE__ */ new Date()).getFullYear();
  const columns = [
    {
      title: "Explore",
      links: [
        { href: "/novels", label: "Novels" },
        { href: "/rankings", label: "Rankings" },
        { href: "/authors", label: "Authors" },
        { href: "/tags", label: "Tags" }
      ]
    },
    {
      title: "Teams",
      links: [
        { href: "#", label: "About" },
        { href: "#", label: "Contact" },
        { href: "#", label: "Feedback" }
      ]
    }
  ];
  return renderTemplate`${maybeRenderHead()}<footer class="border-t border-border/60 bg-background"> <div class="mx-auto max-w-6xl px-4 py-12"> <div class="grid gap-10 md:grid-cols-[1.2fr_2fr]"> <div> <div class="flex items-center gap-3"> ${renderComponent($$result, "Image", $$Image, { "src": "/logo.png", "alt": "Wuxia Dreams", "width": 36, "height": 36, "class": "h-9 w-9 rounded-md ring-1 ring-border/70", "loading": "lazy" })} <div> <div class="text-base font-semibold tracking-tight">
Wuxia Dreams
</div> <div class="text-xs tracking-[0.22em] text-muted-foreground">
READ · TRACK · DISCOVER
</div> </div> </div> <p class="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
A focused fiction hub built for discovery and tracking. Find your next
          read fast, then keep your progress under control.
</p> <div class="mt-6 flex flex-wrap gap-2"> ${user ? renderTemplate`<a href="/library" class="inline-flex h-10 items-center justify-center rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90">
Go to my library
</a>` : renderTemplate`${renderComponent($$result, "AuthDialog", AuthDialog, { "client:load": true, "triggerText": "Sign in / Start tracking", "triggerClassName": "inline-flex h-10 cursor-pointer items-center justify-center rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90", "client:component-hydration": "load", "client:component-path": "@/components/auth-dialog", "client:component-export": "AuthDialog" })}`} <a href="/novels" class="inline-flex h-10 items-center justify-center rounded-xl border border-border/70 bg-background px-4 text-sm font-semibold text-foreground shadow-sm transition hover:bg-muted">
Browse novels
</a> </div> </div> <div class="grid gap-8 sm:grid-cols-3"> ${columns.map((col) => renderTemplate`<div> <div class="text-sm font-semibold text-foreground"> ${col.title} </div> <div class="mt-3 grid gap-2"> ${col.links.map((link) => renderTemplate`<a${addAttribute(link.href, "href")} class="text-sm text-muted-foreground transition hover:text-foreground"> ${link.label} </a>`)} </div> </div>`)} </div> </div> <div class="mt-10 flex flex-col gap-3 border-t border-border/60 pt-6 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between"> <div>© ${year} Wuxia Dreams. All rights reserved.</div> <div class="flex flex-wrap gap-x-4 gap-y-2"> <a href="/privacy-policy" class="hover:text-foreground">Privacy Policy</a> <a href="/terms-of-service" class="hover:text-foreground">Terms of Service</a> <a href="/dmca" class="hover:text-foreground">DMCA</a> <a href="#" class="hover:text-foreground">Changelog</a> </div> </div> </div> </footer>`;
}, "/Users/yangfuzhang/Desktop/wuxiadreams/wuxiadreams.com/src/components/footer.astro", void 0);
var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Layout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Layout;
  const {
    title = "Wuxia Dreams - Free wuxia, xianxia and light novels reading online",
    description = "Explore Wuxia Dreams for free Wuxia, Xianxia and Light novels. Dive into popular and top ranking online novels today!"
  } = Astro2.props;
  const canonicalURL = new URL(Astro2.url.pathname, Astro2.site);
  const ogImage = new URL("/logo.png", Astro2.site);
  return renderTemplate(_a || (_a = __template(['<html lang="en"> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width"><link rel="icon" type="image/svg+xml" href="/favicon.svg"><link rel="icon" href="/favicon.ico"><link rel="sitemap" href="/sitemap.xml"><link rel="canonical"', "><title>", '</title><meta name="description"', '><meta property="og:type" content="website"><meta property="og:url"', '><meta property="og:title"', '><meta property="og:description"', '><meta property="og:image"', '><meta property="twitter:site" content="@wuxiadreams"><meta property="twitter:card" content="summary_large_image"><meta property="twitter:url"', '><meta property="twitter:title"', '><meta property="twitter:description"', '><meta property="twitter:image"', '><meta name="generator"', '><meta name="color-scheme" content="dark light"><script>\n      (() => {\n        const stored = (() => {\n          try {\n            return localStorage.getItem("theme");\n          } catch {\n            return null;\n          }\n        })();\n\n        const prefersDark =\n          typeof window !== "undefined" &&\n          "matchMedia" in window &&\n          window.matchMedia("(prefers-color-scheme: dark)").matches;\n\n        const theme =\n          stored === "dark" || stored === "light"\n            ? stored\n            : prefersDark\n              ? "dark"\n              : "light";\n\n        const root = document.documentElement;\n        root.classList.toggle("dark", theme === "dark");\n        root.style.colorScheme = theme;\n      })();\n    <\/script>', '</head> <body> <div class="min-h-dvh bg-background text-foreground"> ', " ", " ", " </div> </body></html>"])), addAttribute(canonicalURL, "href"), title, addAttribute(description, "content"), addAttribute(Astro2.url, "content"), addAttribute(title, "content"), addAttribute(description, "content"), addAttribute(ogImage.href, "content"), addAttribute(Astro2.url, "content"), addAttribute(title, "content"), addAttribute(description, "content"), addAttribute(ogImage.href, "content"), addAttribute(Astro2.generator, "content"), renderHead(), renderComponent($$result, "Header", $$Header, {}), renderSlot($$result, $$slots["default"]), renderComponent($$result, "Footer", $$Footer, {}));
}, "/Users/yangfuzhang/Desktop/wuxiadreams/wuxiadreams.com/src/layouts/layout.astro", void 0);
export {
  $$Layout as $,
  AuthDialog as A,
  Drawer as D,
  DrawerTrigger as a,
  DrawerContent as b,
  DrawerHeader as c,
  DrawerTitle as d,
  DrawerDescription as e,
  DrawerFooter as f,
  DrawerClose as g
};
