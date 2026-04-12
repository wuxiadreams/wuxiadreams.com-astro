import { useState } from "react";
import { useStore } from "@nanostores/react";
import { reactQueryClient } from "@/stores/query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { TagType } from "@/pages/api/tags";

interface DeleteTagDialogProps {
  tag: TagType | null;
  onOpenChange: (open: boolean) => void;
}

export default function DeleteTagDialog({
  tag,
  onOpenChange,
}: DeleteTagDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const queryClient = useStore(reactQueryClient);

  const handleDeleteConfirm = async () => {
    if (!tag) return;

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/tags/${tag.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errorData = (await res.json().catch(() => ({}))) as {
          error?: string;
        };
        throw new Error(errorData.error || "删除失败");
      }

      toast.success("标签删除成功");
      queryClient.invalidateQueries({
        queryKey: ["tags"],
      });
      onOpenChange(false);
    } catch (err: any) {
      toast.error(err.message || "删除标签时出错");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog
      open={!!tag}
      onOpenChange={(open) => !open && onOpenChange(false)}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>确认删除</AlertDialogTitle>
          <AlertDialogDescription>
            你确定要删除标签 "{tag?.name}" 吗？此操作无法撤销。
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>取消</AlertDialogCancel>
          <Button
            variant="destructive"
            onClick={handleDeleteConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? "删除中..." : "删除"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
