import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
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
import { Trash2, AlertTriangle, RefreshCw } from "lucide-react";

export default function CacheManager() {
  const [urls, setUrls] = useState("");
  const [isPurgingSingle, setIsPurgingSingle] = useState(false);
  const [isPurgingAll, setIsPurgingAll] = useState(false);

  const handlePurgeSingle = async () => {
    if (!urls.trim()) {
      toast.error("请输入至少一个 URL");
      return;
    }

    // 将多行文本拆分成数组并过滤空行
    const urlArray = urls
      .split("\n")
      .map((u) => u.trim())
      .filter(Boolean);

    if (urlArray.length === 0) {
      toast.error("请输入有效的 URL");
      return;
    }

    setIsPurgingSingle(true);
    try {
      const res = await fetch("/api/cache/single", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ urls: urlArray }),
      });

      const data = (await res.json()) as any;

      if (!res.ok) {
        throw new Error(data.error || "清理缓存失败");
      }

      toast.success(`成功清理了 ${urlArray.length} 个 URL 的缓存`);
      setUrls(""); // 清空输入框
    } catch (err: any) {
      toast.error(err.message || "发生了一个错误");
    } finally {
      setIsPurgingSingle(false);
    }
  };

  const handlePurgeAll = async () => {
    setIsPurgingAll(true);
    try {
      const res = await fetch("/api/cache/all", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ purge_everything: true }),
      });

      const data = (await res.json()) as any;

      if (!res.ok) {
        throw new Error(data.error || "清理全站缓存失败");
      }

      toast.success("成功清理了全站的所有缓存");
    } catch (err: any) {
      toast.error(err.message || "发生了一个错误");
    } finally {
      setIsPurgingAll(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5 text-primary" />
            清理指定 URL 缓存
          </CardTitle>
          <CardDescription>
            请输入您想从 Cloudflare 缓存中移除的完整 URL（每行一个）。
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder={`https://example.com/novel/my-novel\nhttps://example.com/rankings`}
            value={urls}
            onChange={(e) => setUrls(e.target.value)}
            rows={6}
            className="font-mono text-sm"
          />
          <Button
            onClick={handlePurgeSingle}
            disabled={isPurgingSingle || !urls.trim()}
            className="w-full sm:w-auto"
          >
            {isPurgingSingle ? "清理中..." : "清理指定的 URL"}
          </Button>
        </CardContent>
      </Card>

      <Card className="border-destructive/20 bg-destructive/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            清理全站缓存
          </CardTitle>
          <CardDescription className="text-destructive/80">
            此操作将立即清除全站域名下在 Cloudflare 上的所有资源缓存。
            请谨慎使用，因为这可能会导致源站的流量在短时间内激增。
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" disabled={isPurgingAll}>
                <Trash2 className="mr-2 h-4 w-4" />
                {isPurgingAll ? "清理中..." : "一键清理全站缓存"}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>您绝对确定要这么做吗？</AlertDialogTitle>
                <AlertDialogDescription>
                  此操作不可撤销。它将强制 Cloudflare
                  在下一次请求时从您的源服务器获取所有文件的全新副本，
                  这可能会导致短暂的性能下降和服务器负载激增。
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>取消</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handlePurgeAll}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  是的，我要清理全部缓存
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </div>
  );
}
