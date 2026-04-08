import { env } from "cloudflare:workers";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { drizzle } from "drizzle-orm/d1";
import * as schema from "@db/schema";

export const auth = betterAuth({
  database: drizzleAdapter(
    drizzle(env.DB, { schema }), // 直接从导入的 env 中获取 DB
    { provider: "sqlite" },
  ),
  baseURL: env.BETTER_AUTH_URL,
  secret: env.BETTER_AUTH_SECRET,
  emailAndPassword: { enabled: true },
});
