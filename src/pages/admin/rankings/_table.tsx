import { useState } from "react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { RANK_TYPE } from "@/lib/constants";

type RankingNovel = {
  id: string;
  title: string;
  slug: string;
  status: string;
  rank: number;
  score: number;
};

interface RankingTableProps {
  rankings: RankingNovel[];
  emptyMessage?: string;
}

export function RankingTable({
  rankings,
  emptyMessage = "暂无数据",
}: RankingTableProps) {
  if (rankings.length === 0) {
    return (
      <div className="flex h-32 items-center justify-center rounded-md border border-dashed text-sm text-muted-foreground">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-16 text-center">排名</TableHead>
            <TableHead>小说</TableHead>
            <TableHead className="w-32">状态</TableHead>
            <TableHead className="w-32 text-right">分数</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rankings.map((novel) => (
            <TableRow key={novel.id}>
              <TableCell className="text-center font-medium">
                <span
                  className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs ${novel.rank <= 3 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
                >
                  {novel.rank}
                </span>
              </TableCell>
              <TableCell>
                <a
                  href={`/novel/${novel.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium hover:underline hover:text-primary transition-colors"
                >
                  {novel.title}
                </a>
              </TableCell>
              <TableCell>
                <Badge
                  variant={novel.status === "ongoing" ? "secondary" : "outline"}
                  className="capitalize"
                >
                  {novel.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right font-mono">
                {novel.score.toFixed(1)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

interface RankingsTabsProps {
  weeklyRankings: RankingNovel[];
  monthlyRankings: RankingNovel[];
  risingStarRankings: RankingNovel[];
}

export function RankingsTabs({
  weeklyRankings,
  monthlyRankings,
  risingStarRankings,
}: RankingsTabsProps) {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdateRankings = async () => {
    setIsUpdating(true);
    try {
      const res = await fetch("/api/rankings/generate", {
        method: "POST",
      });

      if (!res.ok) {
        const errorData = (await res.json().catch(() => ({}))) as {
          error?: string;
        };
        throw new Error(errorData.error || "更新失败");
      }

      toast.success("排行榜数据更新成功！");
      // 刷新页面以获取最新数据
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error: any) {
      toast.error(error.message || "更新排行榜数据时出错");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Tabs defaultValue={RANK_TYPE.WEEKLY} className="w-full">
          <div className="flex items-center justify-between mb-6">
            <TabsList className="grid w-full grid-cols-3 max-w-[600px]">
              <TabsTrigger value={RANK_TYPE.WEEKLY}>
                周热度榜 (Weekly)
              </TabsTrigger>
              <TabsTrigger value={RANK_TYPE.MONTHLY}>
                月热度榜 (Monthly)
              </TabsTrigger>
              <TabsTrigger value={RANK_TYPE.RISING_STAR}>
                潜力榜 (Rising Star)
              </TabsTrigger>
            </TabsList>

            <Button
              onClick={handleUpdateRankings}
              disabled={isUpdating}
              className="ml-4"
            >
              <RefreshCw
                className={`mr-2 h-4 w-4 ${isUpdating ? "animate-spin" : ""}`}
              />
              {isUpdating ? "更新中..." : "更新排行榜数据"}
            </Button>
          </div>

          <TabsContent value={RANK_TYPE.WEEKLY} className="mt-0">
            <div className="rounded-xl border border-border/60 bg-card p-6 shadow-sm">
              <div className="mb-4">
                <h2 className="text-lg font-semibold">周热度榜</h2>
                <p className="text-sm text-muted-foreground">
                  按最近一周的点击数排名
                </p>
              </div>
              <RankingTable
                rankings={weeklyRankings}
                emptyMessage="暂无周榜数据，可能系统尚未生成统计缓存"
              />
            </div>
          </TabsContent>

          <TabsContent value={RANK_TYPE.MONTHLY} className="mt-0">
            <div className="rounded-xl border border-border/60 bg-card p-6 shadow-sm">
              <div className="mb-4">
                <h2 className="text-lg font-semibold">月热度榜</h2>
                <p className="text-sm text-muted-foreground">
                  按最近一个月的点击数排名
                </p>
              </div>
              <RankingTable
                rankings={monthlyRankings}
                emptyMessage="暂无月榜数据，可能系统尚未生成统计缓存"
              />
            </div>
          </TabsContent>

          <TabsContent value={RANK_TYPE.RISING_STAR} className="mt-0">
            <div className="rounded-xl border border-border/60 bg-card p-6 shadow-sm">
              <div className="mb-4">
                <h2 className="text-lg font-semibold">潜力榜</h2>
                <p className="text-sm text-muted-foreground">
                  基于近期点击与发布时间的综合热度算法排名
                </p>
              </div>
              <RankingTable
                rankings={risingStarRankings}
                emptyMessage="暂无潜力榜数据，可能系统尚未生成统计缓存"
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
