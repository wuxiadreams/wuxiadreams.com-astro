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

export function RemoveLibraryButton({
  novelId,
  novelTitle,
}: {
  novelId: string;
  novelTitle: string;
}) {
  const handleRemove = async (e: React.MouseEvent) => {
    try {
      const res = await fetch(`/api/library/${novelId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to remove novel from library");
      }

      toast.success(`${novelTitle} removed from library`);
      // reload page to refresh data
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
          aria-label="Remove from library"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Remove from library?</AlertDialogTitle>
          <AlertDialogDescription>
            This will remove{" "}
            <span className="font-semibold text-foreground">{novelTitle}</span>{" "}
            from your saved novels. You can always add it back later.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              handleRemove(e as any);
            }}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Remove
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
