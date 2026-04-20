import { useState } from "react";
import { useStore } from "@nanostores/react";
import {
  RefreshCcw,
  Edit,
  Trash2,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Check,
  X,
} from "lucide-react";
import { useDebounce } from "use-debounce";
import { useQuery } from "@tanstack/react-query";
import { reactQueryClient } from "@/stores/query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import CreateAuthorDialog from "./_create";
import EditAuthorDialog from "./_edit";
import DeleteAuthorDialog from "./_delete";
import type { AuthorListResponse, AuthorType } from "@/pages/api/authors";

export default function AuthorTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery] = useDebounce(searchQuery, 1000);
  const [sortBy, setSortBy] = useState<"createdAt" | "name" | "novelCount">(
    "createdAt",
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Dialogs state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingAuthor, setEditingAuthor] = useState<AuthorType | null>(null);

  // Delete Confirmation state
  const [deletingAuthor, setDeletingAuthor] = useState<AuthorType | null>(null);

  // Sync state
  const [isSyncing, setIsSyncing] = useState(false);

  const params = {
    page: String(currentPage),
    pageSize: String(pageSize),
    search: debouncedSearchQuery,
    sortBy,
    sortOrder,
  };
  const queryString = new URLSearchParams(params).toString();
  const queryClient = useStore(reactQueryClient);
  const { data, isFetching } = useQuery(
    {
      queryKey: ["authors", params],
      queryFn: async (): Promise<AuthorListResponse> => {
        const res = await fetch(`/api/authors?${queryString}`);
        return res.json();
      },
    },
    queryClient,
  );

  const authors = data?.items || [];
  const meta = data?.meta || { total: 0, totalPages: 0 };
  const { total, totalPages } = meta;

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const formatDate = (date: number | Date) => {
    return new Date(date).toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ["authors"] });
  };

  const handleSyncNovelCount = async () => {
    try {
      setIsSyncing(true);
      const res = await fetch("/api/authors/sync", {
        method: "POST",
      });
      if (res.ok) {
        toast.success("同步作者关联小说数量成功");
        handleRefresh();
      } else {
        const errorData = (await res.json()) as { error?: string };
        toast.error(errorData.error || "同步失败");
      }
    } catch (error) {
      toast.error("网络请求错误");
    } finally {
      setIsSyncing(false);
    }
  };

  const handleSort = (column: "createdAt" | "name" | "novelCount") => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc"); // Default to ascending when sorting by a new column
    }
  };

  const renderSortIcon = (column: "createdAt" | "name" | "novelCount") => {
    if (sortBy !== column)
      return <ArrowUpDown className="ml-2 h-4 w-4 text-muted-foreground" />;
    return sortOrder === "asc" ? (
      <ArrowUp className="ml-2 h-4 w-4 text-foreground" />
    ) : (
      <ArrowDown className="ml-2 h-4 w-4 text-foreground" />
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Input
            placeholder="按作者名称、别名或 Slug 搜索..."
            value={searchQuery}
            onChange={handleSearch}
            className="w-72"
          />
          <RefreshCcw
            size="16"
            className="cursor-pointer text-muted-foreground hover:text-primary transition-colors"
            onClick={handleRefresh}
          />
        </div>
        <div className="flex items-center space-x-2">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="secondary" disabled={isSyncing}>
                {isSyncing ? (
                  <Spinner className="mr-2 h-4 w-4" />
                ) : (
                  <RefreshCcw className="mr-2 h-4 w-4" />
                )}
                同步关联小说数
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>确认同步作者关联的小说数？</AlertDialogTitle>
                <AlertDialogDescription>
                  此操作会遍历数据库并重新统计所有作者关联的小说数。
                  <br />
                  <br />
                  <strong>注意：</strong>
                  该操作可能会消耗较多的数据库读写额度，请确认是否继续？
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>取消</AlertDialogCancel>
                <AlertDialogAction onClick={handleSyncNovelCount}>
                  确认同步
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <Button onClick={() => setIsCreateOpen(true)}>新建作者</Button>
        </div>
      </div>

      <div className="relative rounded-md border">
        {isFetching && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/50 backdrop-blur-sm">
            <Spinner />
          </div>
        )}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => handleSort("name")}
              >
                <div className="flex items-center">
                  名称
                  {renderSortIcon("name")}
                </div>
              </TableHead>
              <TableHead>别名</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => handleSort("novelCount")}
              >
                <div className="flex items-center">
                  关联小说数
                  {renderSortIcon("novelCount")}
                </div>
              </TableHead>
              <TableHead>国家</TableHead>
              <TableHead>置顶</TableHead>
              <TableHead
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => handleSort("createdAt")}
              >
                <div className="flex items-center">
                  创建时间
                  {renderSortIcon("createdAt")}
                </div>
              </TableHead>
              <TableHead className="text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {authors.length > 0 ? (
              authors.map((author) => (
                <TableRow key={author.id}>
                  <TableCell className="font-medium">
                    <a
                      href={`/author/${author.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline hover:text-primary transition-colors"
                    >
                      {author.name}
                    </a>
                  </TableCell>
                  <TableCell>{author.nameAlt}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {author.slug}
                  </TableCell>
                  <TableCell>{author.novelCount || 0}</TableCell>
                  <TableCell>{author.country}</TableCell>
                  <TableCell>
                    {author.isPinned ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <X className="h-4 w-4 text-muted-foreground" />
                    )}
                  </TableCell>
                  <TableCell>{formatDate(author.createdAt)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setEditingAuthor(author);
                          setIsEditOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => setDeletingAuthor(author)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="h-24 text-center text-muted-foreground"
                >
                  未找到作者
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between px-2">
        <div className="text-sm text-muted-foreground">
          显示第 {(currentPage - 1) * pageSize + 1} 到{" "}
          {Math.min(currentPage * pageSize, total)} 条记录，共 {total} 条记录
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            上一页
          </Button>
          <div className="text-sm font-medium">
            第 {currentPage} 页 / 共 {totalPages} 页
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage >= totalPages || totalPages === 0}
          >
            下一页
          </Button>
        </div>
      </div>

      <CreateAuthorDialog open={isCreateOpen} onOpenChange={setIsCreateOpen} />
      <EditAuthorDialog
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        author={editingAuthor}
      />

      <DeleteAuthorDialog
        author={deletingAuthor}
        onOpenChange={(open) => !open && setDeletingAuthor(null)}
      />
    </div>
  );
}
