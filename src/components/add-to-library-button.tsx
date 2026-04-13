import React, { useState, useEffect } from "react";
import { BookmarkPlus, BookmarkCheck } from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { AuthForm } from "@/components/auth-form";

export function AddToLibraryButton({ novelId }: { novelId: string }) {
  const [isInLibrary, setIsInLibrary] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [showAuthDialog, setShowAuthDialog] = useState<boolean>(false);

  const checkStatus = async () => {
    setIsLoading(true);
    const { data: session } = await authClient.getSession();
    if (!session) {
      setIsLoggedIn(false);
      setIsLoading(false);
      return;
    }
    setIsLoggedIn(true);

    try {
      const res = await fetch(`/api/library/status?novelId=${novelId}`);
      if (res.ok) {
        const data = (await res.json()) as { isInLibrary: boolean };
        setIsInLibrary(data.isInLibrary);
      }
    } catch (e) {
      console.error("Failed to fetch library status");
    }
    setIsLoading(false);
  };

  useEffect(() => {
    checkStatus();
  }, [novelId]);

  const handleToggle = async () => {
    if (!isLoggedIn) {
      toast.info("Please sign in to add to your library");
      setShowAuthDialog(true);
      return;
    }

    if (isLoading) return;

    setIsLoading(true);
    try {
      if (isInLibrary) {
        const res = await fetch(`/api/library/${novelId}`, {
          method: "DELETE",
        });
        if (!res.ok) throw new Error("Failed to remove");
        setIsInLibrary(false);
        toast.success("Removed from your library");
      } else {
        const res = await fetch("/api/library", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ novelId }),
        });
        if (!res.ok) throw new Error("Failed to add");
        setIsInLibrary(true);
        toast.success("Added to your library");
      }
    } catch (e) {
      toast.error("An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={handleToggle}
        disabled={isLoading}
        className={`inline-flex h-11 items-center justify-center rounded-xl border border-border/70 px-6 text-sm font-semibold shadow-sm transition ${
          isInLibrary
            ? "bg-primary/10 text-primary hover:bg-primary/20 border-primary/20"
            : "bg-background text-foreground hover:bg-muted"
        } disabled:opacity-50`}
      >
        {isInLibrary ? (
          <>
            <BookmarkCheck className="mr-2 h-4 w-4" />
            In Library
          </>
        ) : (
          <>
            <BookmarkPlus className="mr-2 h-4 w-4" />
            Add to Library
          </>
        )}
      </button>

      <Dialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
        <DialogContent className="sm:max-w-[400px] border-border/40 bg-card/95 backdrop-blur-xl shadow-2xl p-6">
          <AuthForm
            onSuccess={() => {
              setShowAuthDialog(false);
              // Re-check status after successful login
              checkStatus();
            }}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
