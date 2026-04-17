import { useState, useRef, useEffect } from "react";
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

interface Chapter {
  id: string;
  number: number;
  title: string | null;
  wordCount: number | null;
  published: boolean | null;
}

export function ChapterListDialog({ novelId }: { novelId: string }) {
  const [open, setOpen] = useState(false);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState(false);
  const pageSize = 10;

  const totalPages = Math.ceil(totalCount / pageSize) || 1;

  const fetchChapters = async (currentPage: number) => {
    setIsLoading(true);
    try {
      const res = await actions.chapterManagement.getNovelChapters({
        novelId,
        page: currentPage,
        pageSize,
      });

      if (res.error) {
        toast.error(res.error.message || "获取章节列表失败");
        return;
      }

      if (res.data) {
        setChapters(res.data.chapters as any);
        setTotalCount(res.data.totalCount);
      }
    } catch (error: any) {
      toast.error(error.message || "获取章节列表失败");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchChapters(page);
    }
  }, [open, page, novelId]);

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
  const [isActionPending, setIsActionPending] = useState(false);
  const currentChapter = chapters.find((chapter) => chapter.id === currentId);

  const handleStatusChange = async (chapterId: string, published: boolean) => {
    setActionType("status");
    setCurrentId(chapterId);
    setIsActionPending(true);

    try {
      const res = await actions.chapterManagement.updateChapterStatus({
        chapterId,
        published: !published,
      });

      if (res.error) {
        throw new Error(res.error.message || "更新状态失败");
      }

      toast.success("状态更新成功");
      fetchChapters(page); // 重新加载当前页
    } catch (error: any) {
      toast.error(error.message || "章节状态更新失败");
    } finally {
      setIsActionPending(false);
    }
  };

  // 删除章节
  const [showDelModal, setShowDelModal] = useState<boolean>(false);

  const handleDelete = async () => {
    if (!currentId || actionType !== "delete") return;

    setIsActionPending(true);
    try {
      const res = await actions.chapterManagement.deleteChapter({
        chapterId: currentId,
      });

      if (res.error) {
        throw new Error(res.error.message || "删除章节失败");
      }

      toast.success("章节删除成功");
      setShowDelModal(false);
      fetchChapters(page); // 重新加载当前页

      // 触发页面刷新，以便外部统计更新
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error: any) {
      toast.error(error.message || "章节删除失败");
    } finally {
      setIsActionPending(false);
    }
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
                          disabled={isActionPending}
                          onClick={() =>
                            handleStatusChange(chapter.id, !!chapter.published)
                          }
                        >
                          {isActionPending &&
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
                disabled={isActionPending}
                onClick={handleDelete}
              >
                {isActionPending && <Spinner className="mr-2 h-4 w-4" />}
                确认删除
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
}
