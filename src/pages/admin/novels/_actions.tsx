import { useState } from "react";
import { useStore } from "@nanostores/react";
import { reactQueryClient } from "@/stores/query";
import { toast } from "sonner";
import {
  MoreHorizontal,
  Edit,
  Trash2,
  Pin,
  PinOff,
  Eye,
  EyeOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import type { NovelType } from "@/pages/api/novels";

interface NovelActionsProps {
  novel: NovelType;
  onDeleteClick: (novel: NovelType) => void;
}

export default function NovelActions({
  novel,
  onDeleteClick,
}: NovelActionsProps) {
  const queryClient = useStore(reactQueryClient);
  const [isUpdating, setIsUpdating] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    field: "published" | "isPinned" | null;
    currentValue: boolean;
    title: string;
    description: string;
  }>({
    open: false,
    field: null,
    currentValue: false,
    title: "",
    description: "",
  });

  const openConfirmDialog = (
    field: "published" | "isPinned",
    currentValue: boolean,
  ) => {
    const actionName =
      field === "published"
        ? currentValue
          ? "取消发布"
          : "发布"
        : currentValue
          ? "取消置顶"
          : "置顶";

    setConfirmDialog({
      open: true,
      field,
      currentValue,
      title: `确认${actionName}`,
      description: `你确定要${actionName}小说 "${novel.title}" 吗？`,
    });
  };

  const handleConfirm = async () => {
    const { field, currentValue } = confirmDialog;
    if (!field || isUpdating) return;

    setIsUpdating(true);

    try {
      const res = await fetch(`/api/novels/${novel.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ [field]: !currentValue }),
      });

      if (!res.ok) {
        const errorData = (await res.json().catch(() => ({}))) as {
          error?: string;
        };
        throw new Error(errorData.error || "更新状态失败");
      }

      toast.success(
        field === "published"
          ? !currentValue
            ? "发布成功"
            : "已取消发布"
          : !currentValue
            ? "置顶成功"
            : "已取消置顶",
      );

      setConfirmDialog((prev) => ({ ...prev, open: false }));
      queryClient.invalidateQueries({
        queryKey: ["novels"],
      });
    } catch (err: any) {
      toast.error(err.message || "更新失败");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">打开菜单</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>操作</DropdownMenuLabel>
          <DropdownMenuItem asChild>
            <a
              href={`/admin/novels/${novel.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="cursor-pointer flex items-center w-full"
            >
              <Edit className="mr-2 h-4 w-4" />
              <span>编辑</span>
            </a>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => openConfirmDialog("published", novel.published)}
            disabled={isUpdating}
            className="cursor-pointer"
          >
            {novel.published ? (
              <>
                <EyeOff className="mr-2 h-4 w-4" />
                <span>取消发布</span>
              </>
            ) : (
              <>
                <Eye className="mr-2 h-4 w-4" />
                <span>发布</span>
              </>
            )}
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => openConfirmDialog("isPinned", novel.isPinned)}
            disabled={isUpdating}
            className="cursor-pointer"
          >
            {novel.isPinned ? (
              <>
                <PinOff className="mr-2 h-4 w-4" />
                <span>取消置顶</span>
              </>
            ) : (
              <>
                <Pin className="mr-2 h-4 w-4" />
                <span>置顶</span>
              </>
            )}
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={() => onDeleteClick(novel)}
            className="text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            <span>删除</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog
        open={confirmDialog.open}
        onOpenChange={(open) => setConfirmDialog((prev) => ({ ...prev, open }))}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{confirmDialog.title}</AlertDialogTitle>
            <AlertDialogDescription>
              {confirmDialog.description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isUpdating}>取消</AlertDialogCancel>
            <Button onClick={handleConfirm} disabled={isUpdating}>
              {isUpdating ? "更新中..." : "确认"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
