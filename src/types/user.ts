import type { InferSelectModel } from "drizzle-orm";
import { user } from "@/db/schema";

export type User = InferSelectModel<typeof user>;
