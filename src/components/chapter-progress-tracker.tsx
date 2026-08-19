import { useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import {
  recordReadingProgress,
  incrementChapterOpens,
} from "@/lib/reading-progress";

type Props = {
  novelId: string;
  novelSlug: string;
  novelTitle: string;
  cover?: string | null;
  chapterId: string;
  chapterNumber: number;
  chapterTitle: string;
};

/**
 * Client island: records reading progress on chapter view.
 * Always writes localStorage; POSTs to API when logged in.
 */
export function ChapterProgressTracker({
  novelId,
  novelSlug,
  novelTitle,
  cover,
  chapterId,
  chapterNumber,
  chapterTitle,
}: Props) {
  useEffect(() => {
    let cancelled = false;

    async function track() {
      incrementChapterOpens();
      const { data: session } = await authClient.getSession();
      if (cancelled) return;

      await recordReadingProgress(
        {
          novelId,
          novelSlug,
          novelTitle,
          cover,
          chapterId,
          chapterNumber,
          chapterTitle,
        },
        { isLoggedIn: !!session },
      );
    }

    track();
    return () => {
      cancelled = true;
    };
  }, [
    novelId,
    novelSlug,
    novelTitle,
    cover,
    chapterId,
    chapterNumber,
    chapterTitle,
  ]);

  return null;
}
