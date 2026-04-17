import { chapter } from "./chapter";
import { cover } from "./cover";
import { novelActions } from "./novel";

export const server = {
  chapter,
  cover,
  novel: novelActions,
};
