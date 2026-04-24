import { Skeleton } from "@/components/ui/skeleton";

export function RankingSkeleton({
  showHeader = true,
}: {
  showHeader?: boolean;
}) {
  return (
    <div className="flex flex-col w-full">
      {/* 头部骨架 */}
      {showHeader && (
        <div className="mb-4 flex items-end justify-between">
          <div className="space-y-2">
            <Skeleton className="h-8 w-40" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-5 w-16" />
        </div>
      )}

      {/* 列表项骨架 (渲染 10 个) */}
      <div className="flex flex-col gap-3">
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-4 rounded-xl border border-border/40 bg-card/20 p-3"
          >
            {/* 序号 */}
            <Skeleton className="h-8 w-8 shrink-0 rounded-lg" />
            {/* 封面 */}
            <Skeleton className="h-16 w-12 shrink-0 rounded" />
            {/* 标题和信息 */}
            <div className="flex flex-1 flex-col gap-2 py-1">
              <Skeleton className="h-4 w-[80%]" />
              <Skeleton className="h-3 w-[40%]" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
