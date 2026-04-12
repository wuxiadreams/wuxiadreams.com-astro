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
  Pin,
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import DeleteNovelDialog from "./_delete";
import NovelActions from "./_actions";
import type { NovelListResponse, NovelType } from "@/pages/api/novels";

export default function NovelTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery] = useDebounce(searchQuery, 500);
  const [sortBy, setSortBy] = useState<"createdAt" | "title">("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Delete Confirmation state
  const [deletingNovel, setDeletingNovel] = useState<NovelType | null>(null);

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
      queryKey: ["novels", params],
      queryFn: async (): Promise<NovelListResponse> => {
        const res = await fetch(`/api/novels?${queryString}`);
        return res.json();
      },
    },
    queryClient,
  );

  const novels = data?.items || [];
  const meta = data?.meta || { total: 0, totalPages: 0 };
  const { total, totalPages } = meta;

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const formatDate = (date: number | Date | string) => {
    return new Date(date).toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ["novels"] });
  };

  const handleSort = (column: "createdAt" | "title") => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc"); // Default to ascending when sorting by a new column
    }
  };

  const renderSortIcon = (column: "createdAt" | "title") => {
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
            placeholder="按小说名称、别名或 Slug 搜索..."
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
        <a
          href="/admin/novels/create"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button>新建小说</Button>
        </a>
      </div>

      <div className="relative rounded-md border">
        {isFetching && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/50 backdrop-blur-sm">
            <Spinner />
          </div>
        )}
        <Table style={{ minWidth: "800px" }}>
          <TableHeader>
            <TableRow>
              <TableHead
                className="cursor-pointer hover:bg-muted/50 w-[240px]"
                onClick={() => handleSort("title")}
              >
                <div className="flex items-center">
                  标题
                  {renderSortIcon("title")}
                </div>
              </TableHead>
              <TableHead className="w-[240px]">别名</TableHead>
              <TableHead className="w-[240px]">Slug</TableHead>
              <TableHead>状态</TableHead>
              <TableHead>发布</TableHead>
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
            {novels.length > 0 ? (
              novels.map((novel) => (
                <TableRow key={novel.id}>
                  <TableCell
                    className="font-medium max-w-[240px] whitespace-normal break-words"
                    title={novel.title}
                  >
                    <div className="flex items-start space-x-2">
                      {novel.isPinned && (
                        <Pin className="h-3 w-3 text-primary shrink-0 mt-1" />
                      )}
                      <span className="whitespace-normal break-words">
                        {novel.title}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell
                    className="max-w-[240px] whitespace-normal break-words"
                    title={novel.titleAlt}
                  >
                    {novel.titleAlt}
                  </TableCell>
                  <TableCell
                    className="text-muted-foreground max-w-[240px] whitespace-normal break-words"
                    title={novel.slug}
                  >
                    {novel.slug}
                  </TableCell>
                  <TableCell>{novel.status}</TableCell>
                  <TableCell>
                    {novel.published ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <X className="h-4 w-4 text-muted-foreground" />
                    )}
                  </TableCell>
                  <TableCell>
                    {novel.isPinned ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <X className="h-4 w-4 text-muted-foreground" />
                    )}
                  </TableCell>
                  <TableCell>{formatDate(novel.createdAt)}</TableCell>
                  <TableCell className="text-right">
                    <NovelActions
                      novel={novel}
                      onDeleteClick={setDeletingNovel}
                    />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="h-24 text-center text-muted-foreground"
                >
                  未找到小说
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

      <DeleteNovelDialog
        novel={deletingNovel}
        onOpenChange={(open) => !open && setDeletingNovel(null)}
      />
    </div>
  );
}
