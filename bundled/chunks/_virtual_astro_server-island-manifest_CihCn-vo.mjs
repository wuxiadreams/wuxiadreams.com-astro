globalThis.process ??= {};
globalThis.process.env ??= {};
const serverIslandMap = /* @__PURE__ */ new Map([
  ["RankingSection", () => import("../chunks/RankingSection_3Mp71nj2.mjs")]
]);
const serverIslandNameMap = /* @__PURE__ */ new Map([
  [
    "@/components/ranking-section.astro",
    "RankingSection"
  ]
]);
export {
  serverIslandMap,
  serverIslandNameMap
};
