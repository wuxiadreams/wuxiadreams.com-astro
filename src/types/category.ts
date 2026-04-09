import type { InferSelectModel } from "drizzle-orm";
import { category } from "@/db/schema";

export type Category = InferSelectModel<typeof category>;
