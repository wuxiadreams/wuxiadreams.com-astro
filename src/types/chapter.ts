import type { InferSelectModel } from "drizzle-orm";
import { chapter } from "@/db/schema";

export type Chapter = InferSelectModel<typeof chapter>;
