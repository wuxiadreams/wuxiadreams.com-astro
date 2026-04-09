import type { InferSelectModel } from "drizzle-orm";
import { author } from "@/db/schema";

export type Author = InferSelectModel<typeof author>;
