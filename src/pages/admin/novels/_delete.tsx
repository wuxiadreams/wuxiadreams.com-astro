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
import type { NovelType } from "@/pages/api/novels";

interface DeleteNovelDialogProps {
  novel: NovelType | null;
  onOpenChange: (open: boolean) => void;
}

export default function DeleteNovelDialog({
  novel,
  onOpenChange,
}: DeleteNovelDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const queryClient = useStore(reactQueryClient);

  const handleDeleteConfirm = async () => {
    if (!novel) return;

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/novels/${novel.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errorData = (await res.json().catch(() => ({}))) as {
          error?: string;
        };
        throw new Error(errorData.error || "删除失败");
      }

      toast.success("小说删除成功");
      queryClient.invalidateQueries({
        queryKey: ["novels"],
      });
      onOpenChange(false);
    } catch (err: any) {
      toast.error(err.message || "删除小说时出错");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog
      open={!!novel}
      onOpenChange={(open) => !open && onOpenChange(false)}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>确认删除</AlertDialogTitle>
          <AlertDialogDescription>
            你确定要删除小说 "{novel?.title}" 吗？此操作无法撤销。
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
