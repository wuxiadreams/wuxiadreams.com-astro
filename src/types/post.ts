import type { InferSelectModel } from "drizzle-orm";
import { post } from "@/db/schema";

export type Post = InferSelectModel<typeof post>;
