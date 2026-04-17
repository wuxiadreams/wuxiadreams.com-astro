// @ts-check
import { defineConfig, memoryCache } from "astro/config";
import react from "@astrojs/react";
import cloudflare from "@astrojs/cloudflare";
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  output: "server",
  site: "https://wuxiadreams.com",
  redirects: {
    "/en": "/",
  },
  prefetch: true,
  experimental: {
    cache: {
      provider: memoryCache(),
    },
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
