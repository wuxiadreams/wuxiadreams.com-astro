globalThis.process ??= {};
globalThis.process.env ??= {};
import { j as jsxRuntimeExports, B as Button } from "./button_COaE4f0C.mjs";
import { r as reactExports } from "./worker-entry_BlhFEBb5.mjs";
import { g as getBaseURL, c as createFetch, d as defu, a as capitalizeFirstLetter } from "./string_B15uafkt.mjs";
import { a as atom, l as listenKeys, I as Input } from "./input_DbxlZoJx.mjs";
const MOUNT = 5;
const UNMOUNT = 6;
const REVERT_MUTATION = 10;
let on = (object, listener, eventKey, mutateStore) => {
  object.events = object.events || {};
  if (!object.events[eventKey + REVERT_MUTATION]) {
    object.events[eventKey + REVERT_MUTATION] = mutateStore((eventProps) => {
      object.events[eventKey].reduceRight((event, l) => (l(event), event), {
        shared: {},
        ...eventProps
      });
    });
  }
  object.events[eventKey] = object.events[eventKey] || [];
  object.events[eventKey].push(listener);
  return () => {
    let currentListeners = object.events[eventKey];
    let index = currentListeners.indexOf(listener);
    currentListeners.splice(index, 1);
    if (!currentListeners.length) {
      delete object.events[eventKey];
      object.events[eventKey + REVERT_MUTATION]();
      delete object.events[eventKey + REVERT_MUTATION];
    }
  };
};
let STORE_UNMOUNT_DELAY = 1e3;
let onMount = ($store, initialize) => {
  let listener = (payload) => {
    let destroy = initialize(payload);
    if (destroy) $store.events[UNMOUNT].push(destroy);
  };
  return on($store, listener, MOUNT, (runListeners) => {
    let originListen = $store.listen;
    $store.listen = (...args) => {
      if (!$store.lc && !$store.active) {
        $store.active = true;
        runListeners();
      }
      return originListen(...args);
    };
    let originOff = $store.off;
    $store.events[UNMOUNT] = [];
    $store.off = () => {
      originOff();
      setTimeout(() => {
        if ($store.active && !$store.lc) {
          $store.active = false;
          for (let destroy of $store.events[UNMOUNT]) destroy();
          $store.events[UNMOUNT] = [];
        }
      }, STORE_UNMOUNT_DELAY);
    };
    return () => {
      $store.listen = originListen;
      $store.off = originOff;
    };
  });
};
const PROTO_POLLUTION_PATTERNS = {
  proto: /"(?:_|\\u0{2}5[Ff]){2}(?:p|\\u0{2}70)(?:r|\\u0{2}72)(?:o|\\u0{2}6[Ff])(?:t|\\u0{2}74)(?:o|\\u0{2}6[Ff])(?:_|\\u0{2}5[Ff]){2}"\s*:/,
  constructor: /"(?:c|\\u0063)(?:o|\\u006[Ff])(?:n|\\u006[Ee])(?:s|\\u0073)(?:t|\\u0074)(?:r|\\u0072)(?:u|\\u0075)(?:c|\\u0063)(?:t|\\u0074)(?:o|\\u006[Ff])(?:r|\\u0072)"\s*:/,
  protoShort: /"__proto__"\s*:/,
  constructorShort: /"constructor"\s*:/
};
const JSON_SIGNATURE = /^\s*["[{]|^\s*-?\d{1,16}(\.\d{1,17})?([Ee][+-]?\d+)?\s*$/;
const SPECIAL_VALUES = {
  true: true,
  false: false,
  null: null,
  undefined: void 0,
  nan: NaN,
  infinity: Number.POSITIVE_INFINITY,
  "-infinity": Number.NEGATIVE_INFINITY
};
const ISO_DATE_REGEX = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.(\d{1,7}))?(?:Z|([+-])(\d{2}):(\d{2}))$/;
function isValidDate(date) {
  return date instanceof Date && !isNaN(date.getTime());
}
function parseISODate(value) {
  const match = ISO_DATE_REGEX.exec(value);
  if (!match) return null;
  const [, year, month, day, hour, minute, second, ms, offsetSign, offsetHour, offsetMinute] = match;
  const date = new Date(Date.UTC(parseInt(year, 10), parseInt(month, 10) - 1, parseInt(day, 10), parseInt(hour, 10), parseInt(minute, 10), parseInt(second, 10), ms ? parseInt(ms.padEnd(3, "0"), 10) : 0));
  if (offsetSign) {
    const offset = (parseInt(offsetHour, 10) * 60 + parseInt(offsetMinute, 10)) * (offsetSign === "+" ? -1 : 1);
    date.setUTCMinutes(date.getUTCMinutes() + offset);
  }
  return isValidDate(date) ? date : null;
}
function betterJSONParse(value, options = {}) {
  const { strict = false, warnings = false, reviver, parseDates = true } = options;
  if (typeof value !== "string") return value;
  const trimmed = value.trim();
  if (trimmed.length > 0 && trimmed[0] === '"' && trimmed.endsWith('"') && !trimmed.slice(1, -1).includes('"')) return trimmed.slice(1, -1);
  const lowerValue = trimmed.toLowerCase();
  if (lowerValue.length <= 9 && lowerValue in SPECIAL_VALUES) return SPECIAL_VALUES[lowerValue];
  if (!JSON_SIGNATURE.test(trimmed)) {
    if (strict) throw new SyntaxError("[better-json] Invalid JSON");
    return value;
  }
  if (Object.entries(PROTO_POLLUTION_PATTERNS).some(([key, pattern]) => {
    const matches = pattern.test(trimmed);
    if (matches && warnings) console.warn(`[better-json] Detected potential prototype pollution attempt using ${key} pattern`);
    return matches;
  }) && strict) throw new Error("[better-json] Potential prototype pollution attempt detected");
  try {
    const secureReviver = (key, value2) => {
      if (key === "__proto__" || key === "constructor" && value2 && typeof value2 === "object" && "prototype" in value2) {
        if (warnings) console.warn(`[better-json] Dropping "${key}" key to prevent prototype pollution`);
        return;
      }
      if (parseDates && typeof value2 === "string") {
        const date = parseISODate(value2);
        if (date) return date;
      }
      return reviver ? reviver(key, value2) : value2;
    };
    return JSON.parse(trimmed, secureReviver);
  } catch (error) {
    if (strict) throw error;
    return value;
  }
}
function parseJSON(value, options = { strict: true }) {
  return betterJSONParse(value, options);
}
const redirectPlugin = {
  id: "redirect",
  name: "Redirect",
  hooks: { onSuccess(context) {
    if (context.data?.url && context.data?.redirect) {
      if (typeof window !== "undefined" && window.location) {
        if (window.location) try {
          window.location.href = context.data.url;
        } catch {
        }
      }
    }
  } }
};
const isServer = () => typeof window === "undefined";
const useAuthQuery = (initializedAtom, path, $fetch, options) => {
  const value = atom({
    data: null,
    error: null,
    isPending: true,
    isRefetching: false,
    refetch: (queryParams) => fn(queryParams)
  });
  const fn = async (queryParams) => {
    return new Promise((resolve) => {
      const opts = typeof options === "function" ? options({
        data: value.get().data,
        error: value.get().error,
        isPending: value.get().isPending
      }) : options;
      $fetch(path, {
        ...opts,
        query: {
          ...opts?.query,
          ...queryParams?.query
        },
        async onSuccess(context) {
          value.set({
            data: context.data,
            error: null,
            isPending: false,
            isRefetching: false,
            refetch: value.value.refetch
          });
          await opts?.onSuccess?.(context);
        },
        async onError(context) {
          const { request } = context;
          const retryAttempts = typeof request.retry === "number" ? request.retry : request.retry?.attempts;
          const retryAttempt = request.retryAttempt || 0;
          if (retryAttempts && retryAttempt < retryAttempts) return;
          const isUnauthorized = context.error.status === 401;
          value.set({
            error: context.error,
            data: isUnauthorized ? null : value.get().data,
            isPending: false,
            isRefetching: false,
            refetch: value.value.refetch
          });
          await opts?.onError?.(context);
        },
        async onRequest(context) {
          const currentValue = value.get();
          value.set({
            isPending: currentValue.data === null,
            data: currentValue.data,
            error: null,
            isRefetching: true,
            refetch: value.value.refetch
          });
          await opts?.onRequest?.(context);
        }
      }).catch((error) => {
        value.set({
          error,
          data: value.get().data,
          isPending: false,
          isRefetching: false,
          refetch: value.value.refetch
        });
      }).finally(() => {
        resolve(void 0);
      });
    });
  };
  initializedAtom = Array.isArray(initializedAtom) ? initializedAtom : [initializedAtom];
  let isMounted = false;
  for (const initAtom of initializedAtom) initAtom.subscribe(async () => {
    if (isServer()) return;
    if (isMounted) await fn();
    else onMount(value, () => {
      const timeoutId = setTimeout(async () => {
        if (!isMounted) {
          await fn();
          isMounted = true;
        }
      }, 0);
      return () => {
        value.off();
        initAtom.off();
        clearTimeout(timeoutId);
      };
    });
  });
  return value;
};
const kBroadcastChannel = /* @__PURE__ */ Symbol.for("better-auth:broadcast-channel");
const now$1 = () => Math.floor(Date.now() / 1e3);
var WindowBroadcastChannel = class {
  listeners = /* @__PURE__ */ new Set();
  name;
  constructor(name = "better-auth.message") {
    this.name = name;
  }
  subscribe(listener) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }
  post(message) {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(this.name, JSON.stringify({
        ...message,
        timestamp: now$1()
      }));
    } catch {
    }
  }
  setup() {
    if (typeof window === "undefined" || typeof window.addEventListener === "undefined") return () => {
    };
    const handler = (event) => {
      if (event.key !== this.name) return;
      const message = JSON.parse(event.newValue ?? "{}");
      if (message?.event !== "session" || !message?.data) return;
      this.listeners.forEach((listener) => listener(message));
    };
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener("storage", handler);
    };
  }
};
function getGlobalBroadcastChannel(name = "better-auth.message") {
  if (!globalThis[kBroadcastChannel]) globalThis[kBroadcastChannel] = new WindowBroadcastChannel(name);
  return globalThis[kBroadcastChannel];
}
const kFocusManager = /* @__PURE__ */ Symbol.for("better-auth:focus-manager");
var WindowFocusManager = class {
  listeners = /* @__PURE__ */ new Set();
  subscribe(listener) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }
  setFocused(focused) {
    this.listeners.forEach((listener) => listener(focused));
  }
  setup() {
    if (typeof window === "undefined" || typeof document === "undefined" || typeof window.addEventListener === "undefined") return () => {
    };
    const visibilityHandler = () => {
      if (document.visibilityState === "visible") this.setFocused(true);
    };
    document.addEventListener("visibilitychange", visibilityHandler, false);
    return () => {
      document.removeEventListener("visibilitychange", visibilityHandler, false);
    };
  }
};
function getGlobalFocusManager() {
  if (!globalThis[kFocusManager]) globalThis[kFocusManager] = new WindowFocusManager();
  return globalThis[kFocusManager];
}
const kOnlineManager = /* @__PURE__ */ Symbol.for("better-auth:online-manager");
var WindowOnlineManager = class {
  listeners = /* @__PURE__ */ new Set();
  isOnline = typeof navigator !== "undefined" ? navigator.onLine : true;
  subscribe(listener) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }
  setOnline(online) {
    this.isOnline = online;
    this.listeners.forEach((listener) => listener(online));
  }
  setup() {
    if (typeof window === "undefined" || typeof window.addEventListener === "undefined") return () => {
    };
    const onOnline = () => this.setOnline(true);
    const onOffline = () => this.setOnline(false);
    window.addEventListener("online", onOnline, false);
    window.addEventListener("offline", onOffline, false);
    return () => {
      window.removeEventListener("online", onOnline, false);
      window.removeEventListener("offline", onOffline, false);
    };
  }
};
function getGlobalOnlineManager() {
  if (!globalThis[kOnlineManager]) globalThis[kOnlineManager] = new WindowOnlineManager();
  return globalThis[kOnlineManager];
}
const now = () => Math.floor(Date.now() / 1e3);
function normalizeSessionResponse(res) {
  if (typeof res === "object" && res !== null && "data" in res && "error" in res) return res;
  return {
    data: res,
    error: null
  };
}
const FOCUS_REFETCH_RATE_LIMIT_SECONDS = 5;
function createSessionRefreshManager(opts) {
  const { sessionAtom, sessionSignal, $fetch, options = {} } = opts;
  const refetchInterval = options.sessionOptions?.refetchInterval ?? 0;
  const refetchOnWindowFocus = options.sessionOptions?.refetchOnWindowFocus ?? true;
  const refetchWhenOffline = options.sessionOptions?.refetchWhenOffline ?? false;
  const state = {
    lastSync: 0,
    lastSessionRequest: 0,
    cachedSession: void 0
  };
  const shouldRefetch = () => {
    return refetchWhenOffline || getGlobalOnlineManager().isOnline;
  };
  const triggerRefetch = (event) => {
    if (!shouldRefetch()) return;
    if (event?.event === "storage") {
      state.lastSync = now();
      sessionSignal.set(!sessionSignal.get());
      return;
    }
    const currentSession = sessionAtom.get();
    const fetchSessionWithRefresh = () => {
      state.lastSessionRequest = now();
      $fetch("/get-session").then(async (res) => {
        let { data, error } = normalizeSessionResponse(res);
        if (data?.needsRefresh) try {
          const refreshRes = await $fetch("/get-session", { method: "POST" });
          ({ data, error } = normalizeSessionResponse(refreshRes));
        } catch {
        }
        const sessionData = data?.session && data?.user ? data : null;
        sessionAtom.set({
          ...currentSession,
          data: sessionData,
          error
        });
        state.lastSync = now();
        sessionSignal.set(!sessionSignal.get());
      }).catch(() => {
      });
    };
    if (event?.event === "poll") {
      fetchSessionWithRefresh();
      return;
    }
    if (event?.event === "visibilitychange") {
      if (now() - state.lastSessionRequest < FOCUS_REFETCH_RATE_LIMIT_SECONDS) return;
      state.lastSessionRequest = now();
    }
    if (event?.event === "visibilitychange") {
      fetchSessionWithRefresh();
      return;
    }
    if (currentSession?.data === null || currentSession?.data === void 0) {
      state.lastSync = now();
      sessionSignal.set(!sessionSignal.get());
    }
  };
  const broadcastSessionUpdate = (trigger) => {
    getGlobalBroadcastChannel().post({
      event: "session",
      data: { trigger },
      clientId: Math.random().toString(36).substring(7)
    });
  };
  const setupPolling = () => {
    if (refetchInterval && refetchInterval > 0) state.pollInterval = setInterval(() => {
      if (sessionAtom.get()?.data) triggerRefetch({ event: "poll" });
    }, refetchInterval * 1e3);
  };
  const setupBroadcast = () => {
    state.unsubscribeBroadcast = getGlobalBroadcastChannel().subscribe(() => {
      triggerRefetch({ event: "storage" });
    });
  };
  const setupFocusRefetch = () => {
    if (!refetchOnWindowFocus) return;
    state.unsubscribeFocus = getGlobalFocusManager().subscribe(() => {
      triggerRefetch({ event: "visibilitychange" });
    });
  };
  const setupOnlineRefetch = () => {
    state.unsubscribeOnline = getGlobalOnlineManager().subscribe((online) => {
      if (online) triggerRefetch({ event: "visibilitychange" });
    });
  };
  const init = () => {
    setupPolling();
    setupBroadcast();
    setupFocusRefetch();
    setupOnlineRefetch();
    getGlobalBroadcastChannel().setup();
    getGlobalFocusManager().setup();
    getGlobalOnlineManager().setup();
  };
  const cleanup = () => {
    if (state.pollInterval) {
      clearInterval(state.pollInterval);
      state.pollInterval = void 0;
    }
    if (state.unsubscribeBroadcast) {
      state.unsubscribeBroadcast();
      state.unsubscribeBroadcast = void 0;
    }
    if (state.unsubscribeFocus) {
      state.unsubscribeFocus();
      state.unsubscribeFocus = void 0;
    }
    if (state.unsubscribeOnline) {
      state.unsubscribeOnline();
      state.unsubscribeOnline = void 0;
    }
    state.lastSync = 0;
    state.lastSessionRequest = 0;
    state.cachedSession = void 0;
  };
  return {
    init,
    cleanup,
    triggerRefetch,
    broadcastSessionUpdate
  };
}
function getSessionAtom($fetch, options) {
  const $signal = atom(false);
  const session = useAuthQuery($signal, "/get-session", $fetch, { method: "GET" });
  let broadcastSessionUpdate = () => {
  };
  onMount(session, () => {
    const refreshManager = createSessionRefreshManager({
      sessionAtom: session,
      sessionSignal: $signal,
      $fetch,
      options
    });
    refreshManager.init();
    broadcastSessionUpdate = refreshManager.broadcastSessionUpdate;
    return () => {
      refreshManager.cleanup();
    };
  });
  return {
    session,
    $sessionSignal: $signal,
    broadcastSessionUpdate: (trigger) => broadcastSessionUpdate(trigger)
  };
}
const resolvePublicAuthUrl = (basePath) => {
  if (typeof process === "undefined") return void 0;
  const path = basePath ?? "/api/auth";
  if (process.env.NEXT_PUBLIC_AUTH_URL) return process.env.NEXT_PUBLIC_AUTH_URL;
  if (typeof window === "undefined") {
    if (process.env.NEXTAUTH_URL) try {
      return process.env.NEXTAUTH_URL;
    } catch {
    }
    if (process.env.VERCEL_URL) try {
      const protocol = process.env.VERCEL_URL.startsWith("http") ? "" : "https://";
      return `${new URL(`${protocol}${process.env.VERCEL_URL}`).origin}${path}`;
    } catch {
    }
  }
};
const getClientConfig = (options, loadEnv) => {
  const isCredentialsSupported = "credentials" in Request.prototype;
  const baseURL = getBaseURL(options?.baseURL, options?.basePath, void 0) ?? resolvePublicAuthUrl(options?.basePath) ?? "/api/auth";
  const pluginsFetchPlugins = options?.plugins?.flatMap((plugin) => plugin.fetchPlugins).filter((pl) => pl !== void 0) || [];
  const lifeCyclePlugin = {
    id: "lifecycle-hooks",
    name: "lifecycle-hooks",
    hooks: {
      onSuccess: options?.fetchOptions?.onSuccess,
      onError: options?.fetchOptions?.onError,
      onRequest: options?.fetchOptions?.onRequest,
      onResponse: options?.fetchOptions?.onResponse
    }
  };
  const { onSuccess: _onSuccess, onError: _onError, onRequest: _onRequest, onResponse: _onResponse, ...restOfFetchOptions } = options?.fetchOptions || {};
  const $fetch = createFetch({
    baseURL,
    ...isCredentialsSupported ? { credentials: "include" } : {},
    method: "GET",
    jsonParser(text) {
      if (!text) return null;
      return parseJSON(text, { strict: false });
    },
    customFetchImpl: fetch,
    ...restOfFetchOptions,
    plugins: [
      lifeCyclePlugin,
      ...restOfFetchOptions.plugins || [],
      ...options?.disableDefaultFetchPlugins ? [] : [redirectPlugin],
      ...pluginsFetchPlugins
    ]
  });
  const { $sessionSignal, session, broadcastSessionUpdate } = getSessionAtom($fetch, options);
  const plugins = options?.plugins || [];
  let pluginsActions = {};
  const pluginsAtoms = {
    $sessionSignal,
    session
  };
  const pluginPathMethods = {
    "/sign-out": "POST",
    "/revoke-sessions": "POST",
    "/revoke-other-sessions": "POST",
    "/delete-user": "POST"
  };
  const atomListeners = [{
    signal: "$sessionSignal",
    matcher(path) {
      return path === "/sign-out" || path === "/update-user" || path === "/update-session" || path === "/sign-up/email" || path === "/sign-in/email" || path === "/delete-user" || path === "/verify-email" || path === "/revoke-sessions" || path === "/revoke-session" || path === "/change-email";
    },
    callback(path) {
      if (path === "/sign-out") broadcastSessionUpdate("signout");
      else if (path === "/update-user" || path === "/update-session") broadcastSessionUpdate("updateUser");
    }
  }];
  for (const plugin of plugins) {
    if (plugin.getAtoms) Object.assign(pluginsAtoms, plugin.getAtoms?.($fetch));
    if (plugin.pathMethods) Object.assign(pluginPathMethods, plugin.pathMethods);
    if (plugin.atomListeners) atomListeners.push(...plugin.atomListeners);
  }
  const $store = {
    notify: (signal) => {
      pluginsAtoms[signal].set(!pluginsAtoms[signal].get());
    },
    listen: (signal, listener) => {
      pluginsAtoms[signal].subscribe(listener);
    },
    atoms: pluginsAtoms
  };
  for (const plugin of plugins) if (plugin.getActions) pluginsActions = defu(plugin.getActions?.($fetch, $store, options) ?? {}, pluginsActions);
  return {
    get baseURL() {
      return baseURL;
    },
    pluginsActions,
    pluginsAtoms,
    pluginPathMethods,
    atomListeners,
    $fetch,
    $store
  };
};
function isAtom(value) {
  return typeof value === "object" && value !== null && "get" in value && typeof value.get === "function" && "lc" in value && typeof value.lc === "number";
}
function getMethod(path, knownPathMethods, args) {
  const method = knownPathMethods[path];
  const { fetchOptions, query: _query, ...body } = args || {};
  if (method) return method;
  if (fetchOptions?.method) return fetchOptions.method;
  if (body && Object.keys(body).length > 0) return "POST";
  return "GET";
}
function createDynamicPathProxy(routes, client, knownPathMethods, atoms, atomListeners) {
  function createProxy(path = []) {
    return new Proxy(function() {
    }, {
      get(_, prop) {
        if (typeof prop !== "string") return;
        if (prop === "then" || prop === "catch" || prop === "finally") return;
        const fullPath = [...path, prop];
        let current = routes;
        for (const segment of fullPath) if (current && typeof current === "object" && segment in current) current = current[segment];
        else {
          current = void 0;
          break;
        }
        if (typeof current === "function") return current;
        if (isAtom(current)) return current;
        return createProxy(fullPath);
      },
      apply: async (_, __, args) => {
        const routePath = "/" + path.map((segment) => segment.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)).join("/");
        const arg = args[0] || {};
        const fetchOptions = args[1] || {};
        const { query, fetchOptions: argFetchOptions, ...body } = arg;
        const options = {
          ...fetchOptions,
          ...argFetchOptions
        };
        const method = getMethod(routePath, knownPathMethods, arg);
        return await client(routePath, {
          ...options,
          body: method === "GET" ? void 0 : {
            ...body,
            ...options?.body || {}
          },
          query: query || options?.query,
          method,
          async onSuccess(context) {
            await options?.onSuccess?.(context);
            if (!atomListeners || options.disableSignal) return;
            const matches = atomListeners.filter((s) => s.matcher(routePath));
            if (!matches.length) return;
            const visited = /* @__PURE__ */ new Set();
            for (const match of matches) {
              const signal = atoms[match.signal];
              if (!signal) return;
              if (visited.has(match.signal)) continue;
              visited.add(match.signal);
              const val = signal.get();
              setTimeout(() => {
                signal.set(!val);
              }, 10);
              match.callback?.(routePath);
            }
          }
        });
      }
    });
  }
  return createProxy();
}
function useStore(store, options = {}) {
  const snapshotRef = reactExports.useRef(store.get());
  const { keys, deps = [store, keys] } = options;
  const subscribe = reactExports.useCallback((onChange) => {
    const emitChange = (value) => {
      if (snapshotRef.current === value) return;
      snapshotRef.current = value;
      onChange();
    };
    emitChange(store.value);
    if (keys?.length) return listenKeys(store, keys, emitChange);
    return store.listen(emitChange);
  }, deps);
  const get = () => snapshotRef.current;
  return reactExports.useSyncExternalStore(subscribe, get, get);
}
function getAtomKey(str) {
  return `use${capitalizeFirstLetter(str)}`;
}
function createAuthClient(options) {
  const { pluginPathMethods, pluginsActions, pluginsAtoms, $fetch, $store, atomListeners } = getClientConfig(options);
  const resolvedHooks = {};
  for (const [key, value] of Object.entries(pluginsAtoms)) resolvedHooks[getAtomKey(key)] = () => useStore(value);
  return createDynamicPathProxy({
    ...pluginsActions,
    ...resolvedHooks,
    $fetch,
    $store
  }, $fetch, pluginPathMethods, pluginsAtoms, atomListeners);
}
const authClient = createAuthClient({});
const { signIn, signOut, signUp } = authClient;
function AuthForm({
  isAdmin = false,
  adminEmails = "",
  onSuccess
}) {
  const [isLogin, setIsLogin] = reactExports.useState(true);
  const [email, setEmail] = reactExports.useState("");
  const [password, setPassword] = reactExports.useState("");
  const [name, setName] = reactExports.useState("");
  const [isLoading, setIsLoading] = reactExports.useState(false);
  const [errorMsg, setErrorMsg] = reactExports.useState("");
  const checkIsAdmin = (checkEmail) => {
    if (isAdmin) return true;
    if (adminEmails) {
      const adminList = adminEmails.split(",").map((e) => e.trim());
      return adminList.includes(checkEmail);
    }
    return false;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setIsLoading(true);
    const isUserAdmin = checkIsAdmin(email);
    const targetURL = isUserAdmin ? "/admin/users" : window.location.pathname === "/auth/signin" ? "/" : window.location.pathname;
    try {
      if (isLogin) {
        const { error } = await signIn.email({
          email,
          password,
          callbackURL: targetURL
        });
        if (error) {
          setErrorMsg(error.message || "Invalid email or password.");
        } else {
          if (onSuccess) onSuccess();
          window.location.href = targetURL;
        }
      } else {
        const { error } = await signUp.email({
          email,
          password,
          name,
          callbackURL: targetURL
        });
        if (error) {
          setErrorMsg(error.message || "Failed to create account.");
        } else {
          if (onSuccess) onSuccess();
          window.location.href = targetURL;
        }
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Network or server error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  const handleSocialLogin = async (provider) => {
    setIsLoading(true);
    setErrorMsg("");
    const targetURL = isAdmin ? "/admin/users" : window.location.pathname === "/auth/signin" ? "/" : window.location.pathname;
    try {
      const { error } = await signIn.social({
        provider,
        callbackURL: targetURL
      });
      if (error) {
        setErrorMsg(error.message || `Failed to sign in with ${provider}`);
        setIsLoading(false);
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Network or server error. Please try again.");
      setIsLoading(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center sm:text-center mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "img",
        {
          src: "/logo.png",
          alt: "Logo",
          className: "h-8 w-8 rounded-md ring-1 ring-border/50"
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-bold tracking-tight", children: isLogin ? "Welcome back" : "Create an account" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mt-1.5 text-sm", children: isLogin ? "Enter your details to sign in to your account" : "Enter your details below to create your account" })
    ] }),
    isLogin && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-3 mb-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          type: "button",
          variant: "outline",
          className: "h-11 rounded-xl bg-background/50 hover:bg-muted",
          disabled: isLoading,
          onClick: () => handleSocialLogin("google"),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "svg",
              {
                className: "mr-2 h-4 w-4",
                role: "img",
                viewBox: "0 0 24 24",
                xmlns: "http://www.w3.org/2000/svg",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "path",
                  {
                    fill: "currentColor",
                    d: "M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                  }
                )
              }
            ),
            "Sign in with Google"
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          type: "button",
          variant: "outline",
          className: "h-11 rounded-xl bg-background/50 hover:bg-muted",
          disabled: isLoading,
          onClick: () => handleSocialLogin("github"),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "svg",
              {
                className: "mr-2 h-4 w-4",
                role: "img",
                viewBox: "0 0 24 24",
                xmlns: "http://www.w3.org/2000/svg",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "path",
                  {
                    fill: "currentColor",
                    d: "M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
                  }
                )
              }
            ),
            "Sign in with GitHub"
          ]
        }
      )
    ] }),
    isLogin && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative my-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 flex items-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-full border-t border-border/40" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative flex justify-center text-xs", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bg-card/95 px-2 text-muted-foreground", children: "Or continue with email" }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "grid gap-4 py-2", children: [
      !isLogin && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "label",
          {
            htmlFor: "name",
            className: "text-sm font-medium leading-none text-foreground/90",
            children: "Name"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            id: "name",
            type: "text",
            placeholder: "John Doe",
            value: name,
            onChange: (e) => setName(e.target.value),
            required: !isLogin,
            disabled: isLoading,
            className: "h-11 rounded-xl bg-background/50"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "label",
          {
            htmlFor: "email",
            className: "text-sm font-medium leading-none text-foreground/90",
            children: "Email"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            id: "email",
            type: "email",
            placeholder: "name@example.com",
            value: email,
            onChange: (e) => setEmail(e.target.value),
            required: true,
            disabled: isLoading,
            className: "h-11 rounded-xl bg-background/50"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "label",
            {
              htmlFor: "password",
              className: "text-sm font-medium leading-none text-foreground/90",
              children: "Password"
            }
          ),
          isLogin && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "a",
            {
              href: "#",
              className: "text-xs font-medium text-primary hover:underline",
              children: "Forgot password?"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            id: "password",
            type: "password",
            value: password,
            onChange: (e) => setPassword(e.target.value),
            required: true,
            disabled: isLoading,
            className: "h-11 rounded-xl bg-background/50"
          }
        )
      ] }),
      errorMsg && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[13px] font-medium text-destructive text-center", children: errorMsg }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          type: "submit",
          className: "mt-2 h-11 rounded-xl font-semibold w-full bg-primary hover:bg-primary/90",
          disabled: isLoading,
          children: isLoading ? "Please wait..." : isLogin ? "Sign in" : "Create account"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center text-sm text-muted-foreground mt-4", children: [
      isLogin ? "Don't have an account? " : "Already have an account? ",
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: () => {
            setIsLogin(!isLogin);
            setErrorMsg("");
          },
          className: "font-semibold text-primary hover:underline focus-visible:outline-none",
          children: isLogin ? "Sign up" : "Sign in"
        }
      )
    ] })
  ] });
}
export {
  AuthForm as A,
  authClient as a
};
