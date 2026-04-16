import { useState } from "react";
import { useStore } from "@nanostores/react";
import {
  RefreshCcw,
  Edit,
  Trash2,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { useDebounce } from "use-debounce";
import { useQuery } from "@tanstack/react-query";
import { reactQueryClient } from "@/stores/query";
import type { TagListResponse } from "@/pages/api/tags";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import CreateTagDialog from "./_create";
import EditTagDialog from "./_edit";
import DeleteTagDialog from "./_delete";
import type { TagType } from "@/pages/api/tags";

export default function TagTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery] = useDebounce(searchQuery, 500);
  const [sortBy, setSortBy] = useState<"createdAt" | "name" | "novelCount">(
    "createdAt",
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Dialogs state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingTag, setEditingTag] = useState<TagType | null>(null);

  // Delete Confirmation state
  const [deletingTag, setDeletingTag] = useState<TagType | null>(null);

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
      queryKey: ["tags", params],
      queryFn: async (): Promise<TagListResponse> => {
        const res = await fetch(`/api/tags?${queryString}`);
        return res.json();
      },
    },
    queryClient,
  );

  const tags = data?.items || [];
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
    queryClient.invalidateQueries({ queryKey: ["tags"] });
  };

  const handleSyncNovelCount = async () => {
    try {
      setIsSyncing(true);
      const res = await fetch("/api/tags/sync", {
        method: "POST",
      });
      if (res.ok) {
        toast.success("同步标签关联小说数量成功");
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
            placeholder="按标签名称或 Slug 搜索..."
            value={searchQuery}
            onChange={handleSearch}
            className="w-64"
          />
          <RefreshCcw
            size="16"
            className="cursor-pointer text-muted-foreground hover:text-primary transition-colors"
            onClick={handleRefresh}
          />
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="secondary"
            onClick={handleSyncNovelCount}
            disabled={isSyncing}
          >
            {isSyncing ? (
              <Spinner className="mr-2 h-4 w-4" />
            ) : (
              <RefreshCcw className="mr-2 h-4 w-4" />
            )}
            同步关联小说数
          </Button>
          <Button onClick={() => setIsCreateOpen(true)}>新建标签</Button>
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
              <TableHead>ID</TableHead>
              <TableHead
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => handleSort("name")}
              >
                <div className="flex items-center">
                  名称
                  {renderSortIcon("name")}
                </div>
              </TableHead>
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
            {tags.length > 0 ? (
              tags.map((tag) => (
                <TableRow key={tag.id}>
                  <TableCell>{tag.id}</TableCell>
                  <TableCell className="font-medium">
                    <a
                      href={`/tag/${tag.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline hover:text-primary transition-colors"
                    >
                      {tag.name}
                    </a>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {tag.slug}
                  </TableCell>
                  <TableCell>{tag.novelCount || 0}</TableCell>
                  <TableCell>{formatDate(tag.createdAt)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setEditingTag(tag);
                          setIsEditOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => setDeletingTag(tag)}
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
                  colSpan={5}
                  className="h-24 text-center text-muted-foreground"
                >
                  {isFetching ? "" : "暂无标签数据"}
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

      <CreateTagDialog open={isCreateOpen} onOpenChange={setIsCreateOpen} />
      <EditTagDialog
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        tag={editingTag}
      />

      <DeleteTagDialog
        tag={deletingTag}
        onOpenChange={(open) => !open && setDeletingTag(null)}
      />
    </div>
  );
}
