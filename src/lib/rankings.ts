import { sql, desc, eq, and, isNotNull } from "drizzle-orm";
import type { DrizzleD1Database } from "drizzle-orm/d1";
import { novel, ranking } from "@/db/schema";
import { RANK_TYPE } from "./constants";

export type RankingItem = {
  id: string;
  title: string;
  slug: string;
  cover: string | null;
  status: string;
  viewCount: number;
  score: number;
  bookmarkCount: number;
  chapterCount: number;
  rankScore?: number; // for stored rankings
};

export async function fetchRankingData(
  db: DrizzleD1Database<any>,
  type: string,
  limit: number = 10,
  offset: number = 0,
): Promise<RankingItem[]> {
  switch (type) {
    case RANK_TYPE.VIEW:
      return db
        .select({
          id: novel.id,
          title: novel.title,
          slug: novel.slug,
          cover: novel.cover,
          status: novel.status,
          viewCount: novel.viewCount,
          score: novel.score,
          bookmarkCount: novel.bookmarkCount,
          chapterCount: novel.chapterCount,
        })
        .from(novel)
        .where(eq(novel.published, true))
        .orderBy(desc(novel.viewCount))
        .limit(limit)
        .offset(offset);

    case RANK_TYPE.BOOKMARK:
      return db
        .select({
          id: novel.id,
          title: novel.title,
          slug: novel.slug,
          cover: novel.cover,
          status: novel.status,
          viewCount: novel.viewCount,
          score: novel.score,
          bookmarkCount: novel.bookmarkCount,
          chapterCount: novel.chapterCount,
        })
        .from(novel)
        .where(eq(novel.published, true))
        .orderBy(desc(novel.bookmarkCount))
        .limit(limit)
        .offset(offset);

    case RANK_TYPE.HIGH_RATED:
      return db
        .select({
          id: novel.id,
          title: novel.title,
          slug: novel.slug,
          cover: novel.cover,
          status: novel.status,
          viewCount: novel.viewCount,
          score: novel.score,
          bookmarkCount: novel.bookmarkCount,
          chapterCount: novel.chapterCount,
        })
        .from(novel)
        .where(eq(novel.published, true))
        .orderBy(desc(novel.score))
        .limit(limit)
        .offset(offset);

    case RANK_TYPE.EDITOR_PICK:
      return db
        .select({
          id: novel.id,
          title: novel.title,
          slug: novel.slug,
          cover: novel.cover,
          status: novel.status,
          viewCount: novel.viewCount,
          score: novel.score,
          bookmarkCount: novel.bookmarkCount,
          chapterCount: novel.chapterCount,
        })
        .from(novel)
        .where(and(eq(novel.published, true), eq(novel.isPinned, true)))
        .orderBy(desc(novel.createdAt))
        .limit(limit)
        .offset(offset);

    case RANK_TYPE.WEEKLY:
    case RANK_TYPE.MONTHLY:
    case RANK_TYPE.RISING_STAR:
      return db
        .select({
          id: novel.id,
          title: novel.title,
          slug: novel.slug,
          cover: novel.cover,
          status: novel.status,
          viewCount: novel.viewCount,
          score: novel.score,
          bookmarkCount: novel.bookmarkCount,
          chapterCount: novel.chapterCount,
          rankScore: ranking.score,
        })
        .from(ranking)
        .innerJoin(novel, eq(ranking.novelId, novel.id))
        .where(and(eq(ranking.type, type), eq(novel.published, true)))
        .orderBy(ranking.rank)
        .limit(limit)
        .offset(offset);

    default:
      return [];
  }
}

export const RANKING_METADATA: Record<
  string,
  {
    title: string;
    description: string;
    formatValue: (item: RankingItem) => string;
    icon: string;
  }
> = {
  [RANK_TYPE.VIEW]: {
    title: "Most Viewed",
    description: "The most popular novels of all time",
    icon: "👁️",
    formatValue: (item) => `${item.viewCount.toLocaleString()} views`,
  },
  [RANK_TYPE.WEEKLY]: {
    title: "Weekly Hot",
    description: "Trending novels in the past 7 days",
    icon: "🔥",
    formatValue: (item) => `${(item.rankScore || 0).toLocaleString()} views`,
  },
  [RANK_TYPE.MONTHLY]: {
    title: "Monthly Hot",
    description: "Trending novels in the past 30 days",
    icon: "📅",
    formatValue: (item) => `${(item.rankScore || 0).toLocaleString()} views`,
  },
  [RANK_TYPE.RISING_STAR]: {
    title: "Rising Stars",
    description: "Fastest growing novels recently",
    icon: "⭐",
    formatValue: (item) => `${(item.rankScore || 0).toFixed(2)} potential`,
  },
  [RANK_TYPE.BOOKMARK]: {
    title: "Most Bookmarked",
    description: "Novels readers love to save",
    icon: "🔖",
    formatValue: (item) => `${item.bookmarkCount.toLocaleString()} saves`,
  },
  [RANK_TYPE.HIGH_RATED]: {
    title: "Highest Rated",
    description: "Critically acclaimed by readers",
    icon: "🏆",
    formatValue: (item) => `${item.score.toFixed(1)} rating`,
  },
  [RANK_TYPE.EDITOR_PICK]: {
    title: "Editor's Pick",
    description: "Handpicked gems by our editors",
    icon: "👑",
    formatValue: (item) => `${item.chapterCount} chapters`,
  },
};
