import type { InferSelectModel } from "drizzle-orm";
import { tag } from "@/db/schema";

export type Tag = InferSelectModel<typeof tag>;
