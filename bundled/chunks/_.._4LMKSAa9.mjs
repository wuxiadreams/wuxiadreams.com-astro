globalThis.process ??= {};
globalThis.process.env ??= {};
import { f as auth } from "./auth_gvp7x7tU.mjs";
const ALL = async (context) => {
  return auth.handler(context.request);
};
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ALL
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page
};
