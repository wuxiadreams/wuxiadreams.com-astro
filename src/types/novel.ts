import type { InferSelectModel } from "drizzle-orm";
import { novel } from "@/db/schema";

export type Novel = InferSelectModel<typeof novel>;
