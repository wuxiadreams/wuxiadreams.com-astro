import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { authClient } from "@/lib/auth-client";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { AuthForm } from "@/components/auth-form";
import {
  getLocalProgressList,
  type HistoryListItem,
  type LocalProgressEntry,
} from "@/lib/reading-progress";

type Item = {
  novelId: string;
  novelSlug: string;
  novelTitle: string;
  cover: string | null;
  chapterNumber: number;
  chapterTitle: string;
  updatedAt: number;
  source: "cloud" | "local";
};

/**
 * Homepage continue strip. Client-only so homepage CDN cache stays intact.
 * Shows cloud history when logged in; otherwise local progress + Sync CTA.
 */
export function ContinueReadingStrip() {
  const [items, setItems] = useState<Item[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [ready, setReady] = useState(false);
  const [showAuth, setShowAuth] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const { data: session } = await authClient.getSession();
      if (cancelled) return;
      setIsLoggedIn(!!session);

      if (session) {
        try {
          const res = await fetch("/api/reading-history?limit=6");
          if (res.ok) {
            const data = (await res.json()) as { items: HistoryListItem[] };
            if (!cancelled) {
              setItems(
                (data.items || []).map((i) => ({
                  novelId: i.novelId,
                  novelSlug: i.novelSlug,
                  novelTitle: i.novelTitle,
                  cover: i.cover,
                  chapterNumber: i.chapterNumber,
                  chapterTitle: i.chapterTitle,
                  updatedAt: i.updatedAt,
                  source: "cloud" as const,
                })),
              );
            }
          }
        } catch {
          /* fall through to local */
        }
      }

      if (!session) {
        const local = getLocalProgressList(6);
        if (!cancelled) {
          setItems(
            local.map((e: LocalProgressEntry) => ({
              novelId: e.novelId,
              novelSlug: e.novelSlug,
              novelTitle: e.novelTitle,
              cover: e.cover ?? null,
              chapterNumber: e.chapterNumber,
              chapterTitle: e.chapterTitle,
              updatedAt: e.updatedAt,
              source: "local" as const,
            })),
          );
        }
      }

      if (!cancelled) setReady(true);
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  if (!ready || items.length === 0) return null;

  const primary = items[0];

  return (
    <>
      <section className="border-b border-border/60 bg-muted/20">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 flex-1 items-center gap-4">
            {primary.cover ? (
              <img
                src={primary.cover}
                alt=""
                width={48}
                height={72}
                className="h-16 w-11 shrink-0 rounded-md object-cover ring-1 ring-border/60"
              />
            ) : (
              <div className="flex h-16 w-11 shrink-0 items-center justify-center rounded-md bg-muted text-[10px] text-muted-foreground ring-1 ring-border/60">
                —
              </div>
            )}
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wider text-primary/90">
                Continue reading
              </p>
              <p className="mt-0.5 truncate text-base font-semibold text-foreground">
                {primary.novelTitle}
              </p>
              <p className="mt-0.5 truncate text-sm text-muted-foreground">
                Ch. {primary.chapterNumber}
                {primary.chapterTitle ? ` · ${primary.chapterTitle}` : ""}
                {" · "}
                {formatDistanceToNow(new Date(primary.updatedAt), {
                  addSuffix: true,
                })}
              </p>
            </div>
          </div>

          <div className="flex shrink-0 flex-wrap items-center gap-2">
            <a
              href={`/novel/${primary.novelSlug}/chapter-${primary.chapterNumber}`}
              className="inline-flex h-10 items-center justify-center rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
            >
              Continue
            </a>
            {!isLoggedIn && (
              <button
                type="button"
                onClick={() => setShowAuth(true)}
                className="inline-flex h-10 items-center justify-center rounded-xl border border-border/70 bg-background px-4 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"
              >
                Sync
              </button>
            )}
            {isLoggedIn && (
              <a
                href="/library?tab=history"
                className="inline-flex h-10 items-center justify-center rounded-xl border border-border/70 bg-background px-4 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"
              >
                History
              </a>
            )}
          </div>
        </div>
      </section>

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
