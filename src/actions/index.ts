import { chapter } from "./chapter";
import { cover } from "./cover";
import { novelActions } from "./novel";
import { chapterManagement } from "./chapter-management";

export const server = {
  chapter,
  cover,
  novel: novelActions,
  chapterManagement,
};
