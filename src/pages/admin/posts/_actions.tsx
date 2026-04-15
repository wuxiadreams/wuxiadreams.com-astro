import { useState } from "react";
import { useStore } from "@nanostores/react";
import { reactQueryClient } from "@/stores/query";
import { toast } from "sonner";
import {
  MoreHorizontal,
  Edit,
  Trash2,
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
import type { PostType } from "@/pages/api/posts";

interface PostActionsProps {
  post: PostType;
  onDeleteClick: (post: PostType) => void;
}

export default function PostActions({
  post,
  onDeleteClick,
}: PostActionsProps) {
  const queryClient = useStore(reactQueryClient);
  const [isUpdating, setIsUpdating] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    field: "published" | null;
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
    field: "published",
    currentValue: boolean,
  ) => {
    const actionName =
      field === "published"
        ? currentValue
          ? "取消发布"
          : "发布"
        : "";

    setConfirmDialog({
      open: true,
      field,
      currentValue,
      title: `确认${actionName}`,
      description: `你确定要${actionName}文章 "${post.title}" 吗？`,
    });
  };

  const handleConfirm = async () => {
    const { field, currentValue } = confirmDialog;
    if (!field || isUpdating) return;

    setIsUpdating(true);

    try {
      const res = await fetch(`/api/posts/${post.id}`, {
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
        throw new Error(errorData.error || "更新失败");
      }

      toast.success("文章状态已更新");
      queryClient.invalidateQueries({
        queryKey: ["posts"],
      });
    } catch (err: any) {
      toast.error(err.message || "更新文章状态时出错");
    } finally {
      setIsUpdating(false);
      setConfirmDialog({ ...confirmDialog, open: false });
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

          <a href={`/admin/posts/${post.id}`}>
            <DropdownMenuItem className="cursor-pointer">
              <Edit className="mr-2 h-4 w-4" />
              编辑文章
            </DropdownMenuItem>
          </a>

          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => openConfirmDialog("published", post.published)}
            disabled={isUpdating}
          >
            {post.published ? (
              <>
                <EyeOff className="mr-2 h-4 w-4" />
                取消发布
              </>
            ) : (
              <>
                <Eye className="mr-2 h-4 w-4" />
                发布文章
              </>
            )}
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            className="cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10"
            onClick={() => onDeleteClick(post)}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            删除文章
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog
        open={confirmDialog.open}
        onOpenChange={(open) =>
          setConfirmDialog({ ...confirmDialog, open })
        }
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
            <AlertDialogAction
              onClick={handleConfirm}
              disabled={isUpdating}
            >
              {isUpdating ? "更新中..." : "确认"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}