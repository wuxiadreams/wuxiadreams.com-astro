globalThis.process ??= {};
globalThis.process.env ??= {};
import { env } from "cloudflare:workers";
import { d as drizzle, a as schema } from "./schema_98e5FuKX.mjs";
const db = drizzle(env.DB, { schema });
export {
  db as d
};
