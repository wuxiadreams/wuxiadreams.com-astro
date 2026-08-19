import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { AuthForm } from "@/components/auth-form";
import {
  getChapterOpens,
  getLocalProgressList,
  isSyncPromptDismissed,
  dismissSyncPrompt,
} from "@/lib/reading-progress";

/**
 * Soft prompt after enough reading: encourage sign-in to sync progress.
 * Does not block reading; dismissible for the session.
 */
export function SyncProgressPrompt() {
  const [visible, setVisible] = useState(false);
  const [showAuth, setShowAuth] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function check() {
      if (isSyncPromptDismissed()) return;

      const { data: session } = await authClient.getSession();
      if (cancelled || session) return;

      const opens = getChapterOpens();
      const books = getLocalProgressList(10);
      const hasSecondChapter =
        books.some((b) => b.chapterNumber >= 2) || opens >= 3;

      if (hasSecondChapter) {
        setVisible(true);
      }
    }

    check();
    return () => {
      cancelled = true;
    };
  }, []);

  if (!visible && !showAuth) return null;

  return (
    <>
      {visible && (
        <div className="fixed bottom-24 left-4 right-4 z-40 mx-auto max-w-md sm:bottom-10 sm:left-auto sm:right-24">
          <div className="flex items-start gap-3 rounded-2xl border border-border/70 bg-background/95 p-4 shadow-xl backdrop-blur-xl">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-foreground">
                Sync your progress
              </p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                Sign in to keep reading where you left off on any device.
              </p>
              <button
                type="button"
                onClick={() => {
                  setShowAuth(true);
                  setVisible(false);
                }}
                className="mt-3 inline-flex h-9 items-center justify-center rounded-xl bg-primary px-4 text-xs font-semibold text-primary-foreground transition hover:bg-primary/90"
              >
                Sign in to sync
              </button>
            </div>
            <button
              type="button"
              aria-label="Dismiss"
              onClick={() => {
                dismissSyncPrompt();
                setVisible(false);
              }}
              className="rounded-lg p-1 text-muted-foreground transition hover:bg-muted hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      <Dialog open={showAuth} onOpenChange={setShowAuth}>
        <DialogContent className="sm:max-w-[400px] border-border/40 bg-card/95 backdrop-blur-xl shadow-2xl p-6">
          <DialogTitle className="sr-only">Sign in</DialogTitle>
          <AuthForm
            subtitle="Keep reading where you left off on any device"
            onSuccess={() => setShowAuth(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
