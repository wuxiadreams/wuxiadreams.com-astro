import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { AuthForm } from "@/components/auth-form";
import { getLocalProgress } from "@/lib/reading-progress";

type Props = {
  novelId: string;
  novelSlug: string;
  firstChapterNumber?: number | null;
};

type Progress = {
  chapterNumber: number;
  chapterTitle?: string;
};

/**
 * Novel detail CTA: Continue when progress exists, else Start Reading.
 * Merges cloud (logged-in) and local (anonymous) progress.
 */
export function ContinueReadingButton({
  novelId,
  novelSlug,
  firstChapterNumber,
}: Props) {
  const [progress, setProgress] = useState<Progress | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAuth, setShowAuth] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      const { data: session } = await authClient.getSession();
      if (cancelled) return;
      setIsLoggedIn(!!session);

      let cloud: Progress | null = null;
      if (session) {
        try {
          const res = await fetch(
            `/api/reading-history/status?novelId=${encodeURIComponent(novelId)}`,
          );
          if (res.ok) {
            const data = (await res.json()) as {
              progress: {
                chapterNumber: number;
                chapterTitle: string;
              } | null;
            };
            if (data.progress) {
              cloud = {
                chapterNumber: data.progress.chapterNumber,
                chapterTitle: data.progress.chapterTitle,
              };
            }
          }
        } catch {
          /* ignore */
        }
      }

      const local = getLocalProgress(novelId);
      let chosen: Progress | null = null;
      if (session) {
        chosen = cloud ?? (local
          ? {
              chapterNumber: local.chapterNumber,
              chapterTitle: local.chapterTitle,
            }
          : null);
      } else {
        chosen = local
          ? {
              chapterNumber: local.chapterNumber,
              chapterTitle: local.chapterTitle,
            }
          : null;
      }

      if (!cancelled) {
        setProgress(chosen);
        setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [novelId]);

  const href = progress
    ? `/novel/${novelSlug}/chapter-${progress.chapterNumber}`
    : firstChapterNumber != null
      ? `/novel/${novelSlug}/chapter-${firstChapterNumber}`
      : null;

  if (loading) {
    return (
      <button
        disabled
        className="inline-flex h-11 items-center justify-center rounded-xl bg-primary/70 px-8 text-sm font-semibold text-primary-foreground"
      >
        Loading…
      </button>
    );
  }

  if (!href) {
    return (
      <button
        disabled
        className="inline-flex h-11 items-center justify-center rounded-xl bg-muted px-8 text-sm font-semibold text-muted-foreground cursor-not-allowed"
      >
        No Chapters
      </button>
    );
  }

  const label = progress
    ? `Continue · Ch. ${progress.chapterNumber}`
    : "Start Reading";

  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
        <a
          href={href}
          className="inline-flex h-11 items-center justify-center rounded-xl bg-primary px-8 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
        >
          {label}
        </a>
        {!isLoggedIn && progress && (
          <button
            type="button"
            onClick={() => setShowAuth(true)}
            className="inline-flex h-11 items-center justify-center rounded-xl border border-border/70 px-4 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"
          >
            Sync
          </button>
        )}
      </div>

      <Dialog open={showAuth} onOpenChange={setShowAuth}>
        <DialogContent className="sm:max-w-[400px] border-border/40 bg-card/95 backdrop-blur-xl shadow-2xl p-6">
          <DialogTitle className="sr-only">Sign in</DialogTitle>
          <AuthForm
            subtitle="Keep reading where you left off on any device"
            onSuccess={() => {
              setShowAuth(false);
              window.location.reload();
            }}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
