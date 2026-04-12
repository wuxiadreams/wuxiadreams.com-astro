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
import type { CategoryListResponse } from "@/pages/api/categories";
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
import CreateCategoryDialog from "./_create";
import EditCategoryDialog from "./_edit";
import DeleteCategoryDialog from "./_delete";
import type { CategoryType } from "@/pages/api/categories";

export default function CategoryTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery] = useDebounce(searchQuery, 500);
  const [sortBy, setSortBy] = useState<"createdAt" | "name">("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Dialogs state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryType | null>(
    null,
  );

  // Delete Confirmation state
  const [deletingCategory, setDeletingCategory] = useState<CategoryType | null>(
    null,
  );

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
      queryKey: ["categories", params],
      queryFn: async (): Promise<CategoryListResponse> => {
        const res = await fetch(`/api/categories?${queryString}`);
        return res.json();
      },
    },
    queryClient,
  );

  const categories = data?.items || [];
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
    queryClient.invalidateQueries({ queryKey: ["categories"] });
  };

  const handleSort = (column: "createdAt" | "name") => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc"); // Default to ascending when sorting by a new column
    }
  };

  const renderSortIcon = (column: "createdAt" | "name") => {
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
            placeholder="按分类名称或 Slug 搜索..."
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
        <Button onClick={() => setIsCreateOpen(true)}>新建分类</Button>
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
            {categories.length > 0 ? (
              categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell>{category.id}</TableCell>
                  <TableCell className="font-medium">{category.name}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {category.slug}
                  </TableCell>
                  <TableCell>{formatDate(category.createdAt)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setEditingCategory(category);
                          setIsEditOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => setDeletingCategory(category)}
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
                  未找到分类
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

      <CreateCategoryDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
      />
      <EditCategoryDialog
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        category={editingCategory}
      />

      <DeleteCategoryDialog
        category={deletingCategory}
        onOpenChange={(open) => !open && setDeletingCategory(null)}
      />
    </div>
  );
}
