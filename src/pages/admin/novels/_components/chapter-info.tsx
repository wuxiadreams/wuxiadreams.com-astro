import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { ChapterAddDialog } from "./chapter-add-dialog";
import { ChapterListDialog } from "./chapter-list-dialog";

export function ChaptersInfo({
  novelId,
  chapterCount,
}: {
  novelId: string;
  chapterCount: number;
}) {
  const [isChapterDialogOpen, setIsChapterDialogOpen] = useState(false);

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-start justify-between space-y-0">
        <div className="flex flex-col space-y-1.5">
          <CardTitle>章节信息</CardTitle>
          <CardDescription>已上传章节统计信息</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <p className="text-sm font-medium">章节总数：{chapterCount}</p>
          <ChapterListDialog novelId={novelId} />
          <ChapterAddDialog
            novelId={novelId}
            chapterCount={chapterCount}
            open={isChapterDialogOpen}
            onOpenChange={setIsChapterDialogOpen}
          />
        </div>
      </CardContent>
    </Card>
  );
}
