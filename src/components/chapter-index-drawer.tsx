import * as React from "react";
import { ListCollapse, ChevronLeft, ChevronRight } from "lucide-react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { actions } from "astro:actions";

interface ChapterIndexDrawerProps {
  novelId: string;
  novelSlug: string;
  novelTitle: string;
  totalChapters: number;
}

export function ChapterIndexDrawer({
  novelId,
  novelSlug,
  novelTitle,
  totalChapters,
}: ChapterIndexDrawerProps) {
  const [open, setOpen] = React.useState(false);
  const [chapters, setChapters] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [page, setPage] = React.useState(1);
  const pageSize = 100;
  const totalPages = Math.max(1, Math.ceil(totalChapters / pageSize));

  // 格式化日期
  const formatDate = (date: Date | number | string) => {
    if (!date) return "";
    const d = new Date(date);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(d);
  };

  const loadChapters = async (targetPage: number) => {
    setLoading(true);
    try {
      const { data, error } = await actions.chapter.getNovelChapters({
        novelId,
        page: targetPage,
        pageSize,
      });

      if (!error && data?.chapters) {
        setChapters(data.chapters);
        setPage(targetPage);
      }
    } catch (err) {
      console.error("Failed to load chapters:", err);
    } finally {
      setLoading(false);
    }
  };

  // Load first page when opened for the first time
  React.useEffect(() => {
    if (open && chapters.length === 0) {
      loadChapters(1);
    }
  }, [open]);

  return (
    <Drawer open={open} onOpenChange={setOpen} direction="right">
      <DrawerTrigger asChild>
        <button
          className="inline-flex h-10 items-center justify-center rounded-xl bg-secondary px-4 text-sm font-medium text-secondary-foreground transition hover:bg-secondary/80"
          aria-label="Table of Contents"
        >
          <ListCollapse className="mr-2 h-4 w-4" />
          Index
        </button>
      </DrawerTrigger>
      <DrawerContent className="h-screen top-0 right-0 left-auto mt-0 w-[80vw] sm:w-[400px] rounded-none">
        <div className="mx-auto w-full flex flex-col h-full overflow-hidden">
          <DrawerHeader>
            <DrawerTitle className="text-xl font-bold">
              {novelTitle} - Index
            </DrawerTitle>
            <DrawerDescription>
              {totalChapters} published chapters
            </DrawerDescription>
          </DrawerHeader>

          {/* 分页控制区 */}
          {totalPages > 1 && (
            <div className="px-4 py-2 flex items-center justify-between border-b border-border/50">
              <button
                onClick={() => loadChapters(page - 1)}
                disabled={page <= 1 || loading}
                className="inline-flex items-center justify-center rounded-md px-3 py-1.5 text-sm font-medium transition hover:bg-muted disabled:opacity-50"
              >
                <ChevronLeft className="mr-1 h-4 w-4" /> Prev
              </button>
              <div className="text-sm text-muted-foreground">
                Page{" "}
                <span className="font-semibold text-foreground">{page}</span> of{" "}
                {totalPages}
              </div>
              <button
                onClick={() => loadChapters(page + 1)}
                disabled={page >= totalPages || loading}
                className="inline-flex items-center justify-center rounded-md px-3 py-1.5 text-sm font-medium transition hover:bg-muted disabled:opacity-50"
              >
                Next <ChevronRight className="ml-1 h-4 w-4" />
              </button>
            </div>
          )}

          {/* 章节列表区 */}
          <div className="flex-1 overflow-y-auto p-4">
            {loading ? (
              <div className="flex justify-center py-12">
                <span className="text-muted-foreground">
                  Loading chapters...
                </span>
              </div>
            ) : (
              <div className="grid gap-2 sm:grid-cols-2">
                {chapters.map((chapter) => (
                  <a
                    key={chapter.id}
                    href={`/novel/${novelSlug}/chapter-${chapter.number}`}
                    className="group flex flex-col justify-between rounded-xl border border-border/50 bg-card p-3 transition hover:border-primary/50 hover:bg-muted/30"
                  >
                    <span className="line-clamp-1 font-medium text-foreground group-hover:text-primary transition-colors text-sm">
                      Chapter {chapter.number}: {chapter.title}
                    </span>
                    <span className="mt-1 text-[10px] text-muted-foreground">
                      {formatDate(chapter.createdAt)}
                    </span>
                  </a>
                ))}
              </div>
            )}
          </div>

          <DrawerFooter className="pt-2 pb-6">
            <DrawerClose asChild>
              <button className="inline-flex h-10 w-full items-center justify-center rounded-xl border border-border bg-background px-4 text-sm font-medium transition hover:bg-muted">
                Close
              </button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
