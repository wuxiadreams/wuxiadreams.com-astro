import { useState, useRef } from "react";
import { useStore } from "@nanostores/react";
import { reactQueryClient } from "@/stores/query";
import { useQuery, useMutation } from "@tanstack/react-query";
import { List } from "lucide-react";
import { actions } from "astro:actions";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

export function ChapterListDialog({ novelId }: { novelId: string }) {
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState<number>(1);
  const pageSize = 10;
  const queryClient = useStore(reactQueryClient);

  const { data: chaptersData, isPending: isLoading } = useQuery(
    {
      queryKey: ["chapterList", novelId, page, pageSize],
      queryFn: async () => {
        return await actions.chapterManagement.getNovelChapters({
          novelId,
          page,
          pageSize,
        });
      },
    },
    queryClient,
  );
  const chapters = chaptersData?.data?.chapters || [];
  const totalCount = chaptersData?.data?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / pageSize) || 1;

  const handlePrevious = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };
  const handleNext = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  // 当前操作章节
  const [actionType, setActionType] = useState<string | null>(null);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const currentChapter = chapters.find((chapter) => chapter.id === currentId);

  const statusMutation = useMutation(
    {
      mutationFn: async (chapterId: string) => {
        return actions.chapterManagement.updateChapterStatus({
          chapterId,
          published: !currentChapter?.published,
        });
      },
      onSuccess: () => {
        toast.success("状态更新成功");
        queryClient.invalidateQueries({ queryKey: ["novel", novelId] });
        queryClient.invalidateQueries({
          queryKey: ["chapterList", novelId, page, pageSize],
        });
      },
      onError: (error: any) => {
        toast.error(error.message || "章节状态更新失败");
      },
    },
    queryClient,
  );
  const handleStatusChange = async (chapterId: string, published: boolean) => {
    setActionType("status");
    setCurrentId(chapterId);

    statusMutation.mutate(chapterId);
  };

  // 删除章节
  const [showDelModal, setShowDelModal] = useState<boolean>(false);

  const delMutation = useMutation(
    {
      mutationFn: async (chapterId: string) => {
        return actions.chapterManagement.deleteChapter({
          chapterId,
        });
      },
      onSuccess: () => {
        toast.success("章节删除成功");
        setShowDelModal(false);
        queryClient.invalidateQueries({ queryKey: ["novel", novelId] });
        queryClient.invalidateQueries({
          queryKey: ["chapterList", novelId, page, pageSize],
        });
      },
      onError: (error: any) => {
        toast.error(error.message || "章节删除失败");
      },
    },
    queryClient,
  );
  const handleDelete = async () => {
    if (!currentId || actionType !== "delete") return;

    delMutation.mutate(currentId);
  };

  // 跳转
  const inputRef = useRef<HTMLInputElement>(null);
  const handleJump = () => {
    if (inputRef.current) {
      const toPage = Number(inputRef.current.value);
      setPage(Math.max(1, Math.min(toPage, totalPages)));
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="gap-1 cursor-pointer w-full"
          >
            <List size="16" />
            查看/管理全部章节列表
          </Button>
        </DialogTrigger>
        <DialogContent
          className="w-full md:min-w-2xl"
          onInteractOutside={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>章节列表</DialogTitle>
            <DialogDescription>
              当前小说总计 {totalCount} 个章节
            </DialogDescription>
          </DialogHeader>

          <div className="max-w-full overflow-auto flex flex-col gap-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">章节序号</TableHead>
                  <TableHead>标题</TableHead>
                  <TableHead>字数</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead>操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      <Spinner className="mx-auto" />
                    </TableCell>
                  </TableRow>
                ) : chapters.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="h-24 text-center text-muted-foreground"
                    >
                      暂无章节数据
                    </TableCell>
                  </TableRow>
                ) : (
                  chapters.map((chapter) => (
                    <TableRow key={chapter.id}>
                      <TableCell className="font-medium">
                        {chapter.number}
                      </TableCell>
                      <TableCell>{chapter.title}</TableCell>
                      <TableCell>{chapter.wordCount}</TableCell>
                      <TableCell>
                        {chapter.published ? "已发布" : "未发布"}
                      </TableCell>
                      <TableCell className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant={chapter.published ? "secondary" : "default"}
                          className="text-sm cursor-pointer"
                          disabled={
                            statusMutation.isPending && currentId === chapter.id
                          }
                          onClick={() =>
                            handleStatusChange(chapter.id, !!chapter.published)
                          }
                        >
                          {statusMutation.isPending &&
                            actionType === "status" &&
                            chapter.id === currentId && (
                              <Spinner className="mr-2 h-3 w-3" />
                            )}
                          {chapter.published ? "取消发布" : "发布"}
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          className="text-sm cursor-pointer"
                          onClick={() => {
                            setActionType("delete");
                            setCurrentId(chapter.id);
                            setShowDelModal(true);
                          }}
                        >
                          删除
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={4}>共{totalPages}页</TableCell>
                  <TableCell className="text-right">当前第{page}页</TableCell>
                </TableRow>
              </TableFooter>
            </Table>

            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    text="上一页"
                    className={
                      page === 1
                        ? "cursor-not-allowed opacity-50"
                        : "cursor-pointer"
                    }
                    onClick={handlePrevious}
                  />
                </PaginationItem>

                <PaginationItem>
                  <PaginationNext
                    text="下一页"
                    className={
                      page === totalPages
                        ? "cursor-not-allowed opacity-50"
                        : "cursor-pointer"
                    }
                    onClick={handleNext}
                  />
                </PaginationItem>

                <PaginationItem className="flex items-center gap-2 ml-4">
                  <Input
                    ref={inputRef}
                    className="w-16"
                    type="number"
                    step={1}
                    min={1}
                    max={totalPages}
                    defaultValue={page}
                  />
                  <Button variant="secondary" onClick={handleJump}>
                    跳转
                  </Button>
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </DialogContent>
      </Dialog>

      {showDelModal && (
        <AlertDialog open={showDelModal} onOpenChange={setShowDelModal}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                确认删除章节{" "}
                <span className="text-primary font-bold">
                  {currentChapter?.title || currentChapter?.number}
                </span>{" "}
                吗？
              </AlertDialogTitle>
              <AlertDialogDescription>
                此操作会同步删除该章节关联的 TXT
                文件，且数据将无法恢复，请谨慎操作。
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="cursor-pointer">
                取消
              </AlertDialogCancel>
              <Button
                variant="destructive"
                className="cursor-pointer"
                disabled={delMutation.isPending}
                onClick={handleDelete}
              >
                {delMutation.isPending && <Spinner className="mr-2 h-4 w-4" />}
                确认删除
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
}
