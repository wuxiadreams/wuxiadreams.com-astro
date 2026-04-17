"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { actions } from "astro:actions";
import { toast } from "sonner";
import { getNovelWordCount } from "@/lib/file";
import {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Switch } from "@/components/ui/switch";

const chapterFormSchema = z.object({
  number: z.number().min(1, "请输入章节序号"),
  title: z.string().min(1, "请输入章节标题"),
  published: z.boolean(),
});

export function ChapterAddDialog({
  locale,
  novelId,
  chapterCount,
  open,
  onOpenChange,
}: {
  locale: string;
  novelId: string;
  chapterCount: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const defaultValues = {
    number: chapterCount + 1,
    title: "",
    published: false,
  };

  const form = useForm<z.infer<typeof chapterFormSchema>>({
    resolver: zodResolver(chapterFormSchema),
    defaultValues,
  });

  const onSubmit = async (values: z.infer<typeof chapterFormSchema>) => {
    if (!file) {
      toast.error("请上传章节 TXT 文件");
      return;
    }

    if (!file.name.endsWith(".txt")) {
      toast.error("请上传有效的 .txt 文件");
      return;
    }

    try {
      setIsSubmitting(true);

      // 0. 校验章节序号是否已存在
      const checkRes = await actions.chapterManagement.checkChapterExists({
        novelId,
        number: values.number,
      });

      if (checkRes.error) {
        throw new Error("校验章节序号失败");
      }

      if (checkRes.data?.exists) {
        throw new Error(
          `章节序号 ${values.number} 已经存在，请使用其他序号或前往章节列表删除旧章节`,
        );
      }

      // 1. 读取文件内容获取字数
      const text = await file.text();
      const { count: wordCount } = getNovelWordCount(text);

      // 2. 生成上传预签名 URL
      const filename = `${values.number}_${values.title || "Chapter"}.txt`;

      const urlsRes = await actions.chapterManagement.generateChapterUploadUrls(
        {
          novelId,
          chapterDetails: [{ filename, contentType: "text/plain" }],
        },
      );

      if (
        urlsRes.error ||
        !urlsRes.data?.urls ||
        urlsRes.data.urls.length === 0
      ) {
        throw new Error(urlsRes.error?.message || "无法获取上传链接");
      }

      const uploadUrlInfo = urlsRes.data.urls[0];

      // 3. 上传到 R2
      const uploadRes = await fetch(uploadUrlInfo.presignedUrl, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": "text/plain" },
      });

      if (!uploadRes.ok) {
        throw new Error(`文件上传失败: ${uploadRes.statusText}`);
      }

      // 4. 保存数据库元数据
      const saveRes = await actions.chapterManagement.saveChapterMetadata({
        novelId,
        chaptersData: [
          {
            novelId,
            number: values.number,
            title: values.title || "",
            wordCount,
            fileKey: uploadUrlInfo.file_key,
            published: values.published,
          },
        ],
      });

      if (saveRes.error) {
        throw new Error(saveRes.error.message || "保存章节信息失败");
      }

      toast.success("章节新建成功");
      onOpenChange(false);

      // 重置表单状态
      form.reset({
        number: values.number + 1,
        title: "",
        published: false,
      });
      setFile(null);

      // 触发页面刷新，以便外部列表或表单更新状态
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "操作失败");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="w-full gap-2 mb-4 border-dashed border-2 py-6"
        >
          <Plus size="16" />
          上传单章文件
        </Button>
      </DialogTrigger>
      <DialogPortal>
        <DialogOverlay />
        <DialogContent>
          <DialogHeader>
            <DialogTitle>新增单章</DialogTitle>
            <DialogDescription>
              当前小说已有 {chapterCount} 个章节
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4">
            <Form {...form}>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  form.handleSubmit(onSubmit)(e);
                }}
                className="w-full space-y-4"
              >
                <FormField
                  control={form.control}
                  name="published"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 space-y-0 w-full">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">发布状态</FormLabel>
                        <p className="text-sm text-muted-foreground">
                          控制该章节是否在网站前台可见
                        </p>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>章节序号*</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="请输入章节序号"
                          type="number"
                          step={1}
                          min={1}
                          max={99999}
                          value={field.value}
                          onChange={(e) => {
                            field.onChange(Number(e.target.value));
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>章节标题*</FormLabel>
                      <FormControl>
                        <Input placeholder="请输入章节标题" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormItem>
                  <FormLabel>章节内容 (TXT文件)*</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept=".txt"
                      onChange={(e) => {
                        if (e.target.files && e.target.files.length > 0) {
                          setFile(e.target.files[0]);
                        } else {
                          setFile(null);
                        }
                      }}
                    />
                  </FormControl>
                  {file && (
                    <p className="text-xs text-muted-foreground mt-1">
                      已选择: {file.name}
                    </p>
                  )}
                </FormItem>

                <Button
                  className="w-full"
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting && <Spinner className="mr-2 h-4 w-4" />}
                  {isSubmitting ? "上传并保存中..." : "保存章节"}
                </Button>
              </form>
            </Form>
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
