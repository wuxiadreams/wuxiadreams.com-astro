/** Client-side reading progress (localStorage) + sync helpers. */

export const READING_PROGRESS_KEY = "wd-reading-progress";
export const CHAPTER_OPENS_KEY = "wd-chapter-opens";
export const SYNC_PROMPT_DISMISSED_KEY = "wd-sync-prompt-dismissed";

export type LocalProgressEntry = {
  novelId: string;
  novelSlug: string;
  novelTitle: string;
  cover?: string | null;
  chapterId?: string | null;
  chapterNumber: number;
  chapterTitle: string;
  updatedAt: number;
};

export type LocalProgressMap = Record<string, LocalProgressEntry>;

export function getLocalProgressMap(): LocalProgressMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(READING_PROGRESS_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as LocalProgressMap;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

export function setLocalProgressMap(map: LocalProgressMap) {
  localStorage.setItem(READING_PROGRESS_KEY, JSON.stringify(map));
}

export function upsertLocalProgress(entry: LocalProgressEntry) {
  const map = getLocalProgressMap();
  map[entry.novelId] = entry;
  setLocalProgressMap(map);
  return entry;
}

export function getLocalProgress(novelId: string): LocalProgressEntry | null {
  return getLocalProgressMap()[novelId] ?? null;
}

export function getLocalProgressList(limit = 20): LocalProgressEntry[] {
  return Object.values(getLocalProgressMap())
    .sort((a, b) => b.updatedAt - a.updatedAt)
    .slice(0, limit);
}

export function removeLocalProgress(novelId: string) {
  const map = getLocalProgressMap();
  delete map[novelId];
  setLocalProgressMap(map);
}

export function clearLocalProgress() {
  localStorage.removeItem(READING_PROGRESS_KEY);
}

export function incrementChapterOpens(): number {
  try {
    const next = (Number(localStorage.getItem(CHAPTER_OPENS_KEY)) || 0) + 1;
    localStorage.setItem(CHAPTER_OPENS_KEY, String(next));
    return next;
  } catch {
    return 0;
  }
}

export function getChapterOpens(): number {
  try {
    return Number(localStorage.getItem(CHAPTER_OPENS_KEY)) || 0;
  } catch {
    return 0;
  }
}

export function isSyncPromptDismissed(): boolean {
  try {
    return sessionStorage.getItem(SYNC_PROMPT_DISMISSED_KEY) === "1";
  } catch {
    return false;
  }
}

export function dismissSyncPrompt() {
  try {
    sessionStorage.setItem(SYNC_PROMPT_DISMISSED_KEY, "1");
  } catch {
    /* ignore */
  }
}

const THROTTLE_MS = 5000;
const lastPosted = new Map<string, number>();

function shouldThrottle(novelId: string, chapterNumber: number): boolean {
  const key = `${novelId}:${chapterNumber}`;
  const now = Date.now();
  const prev = lastPosted.get(key) ?? 0;
  if (now - prev < THROTTLE_MS) return true;
  lastPosted.set(key, now);
  return false;
}

export type ProgressPayload = {
  novelId: string;
  novelSlug: string;
  novelTitle: string;
  cover?: string | null;
  chapterId?: string | null;
  chapterNumber: number;
  chapterTitle: string;
};

/** Upsert local always when anonymous; POST to API when logged in. */
export async function recordReadingProgress(
  payload: ProgressPayload,
  options?: { isLoggedIn?: boolean },
) {
  const updatedAt = Date.now();
  const loggedIn = options?.isLoggedIn === true;

  if (!loggedIn) {
    upsertLocalProgress({ ...payload, updatedAt });
    return;
  }

  if (shouldThrottle(payload.novelId, payload.chapterNumber)) return;

  const body = JSON.stringify({
    novelId: payload.novelId,
    chapterId: payload.chapterId ?? null,
    chapterNumber: payload.chapterNumber,
    chapterTitle: payload.chapterTitle,
    updatedAt,
  });

  try {
    if (typeof navigator !== "undefined" && navigator.sendBeacon) {
      const blob = new Blob([body], { type: "application/json" });
      const ok = navigator.sendBeacon("/api/reading-history", blob);
      if (ok) return;
    }
    await fetch("/api/reading-history", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true,
      credentials: "same-origin",
    });
  } catch {
    // Fallback: keep local so progress isn't lost if API fails
    upsertLocalProgress({ ...payload, updatedAt });
  }
}

export type SyncItem = {
  novelId: string;
  chapterId?: string | null;
  chapterNumber: number;
  chapterTitle: string;
  updatedAt: number;
};

/** Merge local progress into cloud after login; clear local on success. */
export async function syncReadingProgressOnLogin(): Promise<boolean> {
  const local = getLocalProgressList(100);
  if (local.length === 0) return true;

  const items: SyncItem[] = local.map((e) => ({
    novelId: e.novelId,
    chapterId: e.chapterId ?? null,
    chapterNumber: e.chapterNumber,
    chapterTitle: e.chapterTitle,
    updatedAt: e.updatedAt,
  }));

  try {
    const res = await fetch("/api/reading-history/sync", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items }),
      credentials: "same-origin",
    });
    if (!res.ok) return false;
    clearLocalProgress();
    return true;
  } catch {
    return false;
  }
}

export type HistoryListItem = {
  novelId: string;
  novelSlug: string;
  novelTitle: string;
  cover: string | null;
  chapterId: string | null;
  chapterNumber: number;
  chapterTitle: string;
  updatedAt: number;
};
