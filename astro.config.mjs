// @ts-check
import { defineConfig, memoryCache } from "astro/config";
import react from "@astrojs/react";
import cloudflare from "@astrojs/cloudflare";
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  output: "server",
  site: "https://wuxiadreams.com",
  security: {
    actionBodySizeLimit: 10 * 1024 * 1024, // 10 MB
  },
  redirects: {
    "/en": "/",
  },
  prefetch: {
    prefetchAll: false,
    defaultStrategy: "hover",
  },
  integrations: [react()],
  adapter: cloudflare(),
  vite: {
    plugins: [tailwindcss()],
    server: {
      watch: {
        ignored: ["**/.wrangler/**", "**/node_modules/**", "**/.astro/**"],
      },
      hmr: {
        overlay: false,
      },
    },
  },
});
