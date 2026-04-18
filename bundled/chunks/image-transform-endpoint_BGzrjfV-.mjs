globalThis.process ??= {};
globalThis.process.env ??= {};
import { env } from "cloudflare:workers";
import { i as imageConfig } from "./_astro_assets_D3btVnR0.mjs";
import { i as isRemotePath } from "./transition_DzUAhAmX.mjs";
import { i as isRemoteAllowed } from "./index_Hi_Vvptw.mjs";
const qualityTable = {
  low: 25,
  mid: 50,
  high: 80,
  max: 100
};
async function transform(rawUrl, images, assets) {
  const url = new URL(rawUrl);
  const href = url.searchParams.get("href");
  if (!href || isRemotePath(href) && !isRemoteAllowed(href, imageConfig)) {
    return new Response("Forbidden", { status: 403 });
  }
  const imageSrc = new URL(href, url.origin);
  const content = await (isRemotePath(href) ? fetch(imageSrc) : assets.fetch(imageSrc));
  if (!content.body) {
    return new Response(null, { status: 404 });
  }
  const input = images.input(content.body);
  const supportedFormats = {
    jpeg: "image/jpeg",
    jpg: "image/jpeg",
    png: "image/png",
    gif: "image/gif",
    webp: "image/webp",
    avif: "image/avif"
  };
  const outputFormat = supportedFormats[url.searchParams.get("f") ?? ""];
  if (!outputFormat) {
    return new Response(`Unsupported format: ${url.searchParams.get("f")}`, { status: 400 });
  }
  return (await input.transform({
    width: url.searchParams.has("w") ? Number.parseInt(url.searchParams.get("w")) : void 0,
    height: url.searchParams.has("h") ? Number.parseInt(url.searchParams.get("h")) : void 0,
    fit: url.searchParams.get("fit")
  }).output({
    quality: url.searchParams.get("q") ? qualityTable[url.searchParams.get("q")] ?? Number.parseInt(url.searchParams.get("q")) : void 0,
    format: outputFormat
  })).response();
}
const prerender = false;
const GET = async (ctx) => {
  const cache = caches.default;
  if (cache) {
    const cached = await cache.match(ctx.request.url);
    if (cached) return cached;
  }
  const response = await transform(ctx.request.url, env.IMAGES, env.ASSETS);
  if (!response.ok) return response;
  const headers = new Headers(response.headers);
  headers.set("Cache-Control", "public, max-age=31536000, immutable");
  const cachedResponse = new Response(response.body, {
    status: response.status,
    headers
  });
  if (cache) {
    const cfContext = ctx.locals.cfContext;
    if (cfContext) {
      cfContext.waitUntil(cache.put(ctx.request.url, cachedResponse.clone()));
    }
  }
  return cachedResponse;
};
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  GET,
  prerender
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page
};
