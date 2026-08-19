import React from "react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export function RemoveHistoryButton({
  novelId,
  novelTitle,
}: {
  novelId: string;
  novelTitle: string;
}) {
  const handleRemove = async () => {
    try {
      const res = await fetch(`/api/reading-history/${novelId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to remove from history");
      }

      toast.success(`${novelTitle} removed from history`);
      window.location.reload();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "An error occurred");
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button
          className="flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm transition-transform hover:scale-110 hover:bg-destructive/90 opacity-0 group-hover:opacity-100 focus:opacity-100"
          aria-label="Remove from history"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Remove from history?</AlertDialogTitle>
          <AlertDialogDescription>
            This will remove{" "}
            <span className="font-semibold text-foreground">{novelTitle}</span>{" "}
            from your reading history. Your library bookmark (if any) is
            unchanged.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleRemove}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Remove
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function ClearHistoryButton() {
  const handleClear = async () => {
    try {
      const res = await fetch("/api/reading-history?all=1", {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to clear history");
      toast.success("Reading history cleared");
      window.location.reload();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "An error occurred");
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button
          type="button"
          className="text-sm font-medium text-muted-foreground transition hover:text-destructive"
        >
          Clear all
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Clear reading history?</AlertDialogTitle>
          <AlertDialogDescription>
            This removes all reading progress from your account. Saved novels in
            your library are not affected.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleClear}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Clear all
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
