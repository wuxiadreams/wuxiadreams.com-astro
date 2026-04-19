import { useEffect } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";
import { UploadCloud } from "lucide-react";
import { useStore } from "@nanostores/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { reactQueryClient } from "@/stores/query";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import MdEditor from "@/components/md-editor";
import { sanitizeSlug } from "@/lib/utils";
import { MultiSelect } from "./multi-select";
import { ImageUpload } from "./image-upload";
import { ChaptersUploader } from "./chapter-uploader";
import { ChaptersInfo } from "./chapter-info";
import type { Novel } from "@/types/novel";

const formSchema = z.object({
  title: z.string().min(1, "小说标题必填"),
  titleAlt: z.string().min(1, "小说别名必填"),
  slug: z.string().optional(),
  status: z.enum(["ongoing", "completed"]),
  cover: z.string().optional(),
  synopsis: z.string().optional(),
  score: z.coerce.number().min(0).optional(),
  reviewCount: z.coerce.number().min(0).optional(),
  chapterCount: z.coerce.number().min(0).default(0),
  viewCount: z.coerce.number().min(0).default(0),
  officialLink: z.string().url("请输入有效的URL").optional().or(z.literal("")),
  translatedLink: z
    .string()
    .url("请输入有效的URL")
    .optional()
    .or(z.literal("")),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  published: z.boolean().default(false),
  isPinned: z.boolean().default(false),
  authors: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  categories: z.array(z.string()).optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function NovelForm({
  r2Domain,
  initialData,
  novelId,
}: {
  r2Domain: string;
  initialData?: FormValues & { chapterCount?: number };
  novelId?: string;
}) {
  const queryClient = useStore(reactQueryClient);
  const isEditing = !!novelId;
  const url = isEditing ? `/api/novels/${novelId}` : "/api/novels";
  const method = isEditing ? "PUT" : "POST";

  const { data: fetchedData, isLoading: isFetching } = useQuery(
    {
      queryKey: ["novel", novelId],
      queryFn: async () => {
        if (!novelId) return null;
        const res = await fetch(`/api/novels/${novelId}`);
        if (!res.ok) throw new Error("Failed to fetch novel");
        return res.json() as Promise<
          FormValues & { chapterCount?: number; _initialOptions?: any }
        >;
      },
      enabled: isEditing,
    },
    queryClient,
  );

  const defaultValues = {
    title: "",
    titleAlt: "",
    slug: "",
    status: "ongoing" as any,
    cover: "",
    synopsis: "",
    score: 0,
    reviewCount: 0,
    chapterCount: 0,
    viewCount: 0,
    officialLink: "",
    translatedLink: "",
    seoTitle: "",
    seoDescription: "",
    published: false,
    isPinned: false,
    authors: [],
    tags: [],
    categories: [],
  };
  const form = useForm<FormValues>({
    defaultValues: initialData || { ...defaultValues },
  });

  useEffect(() => {
    if (fetchedData) {
      form.reset({ ...fetchedData });
    }
  }, [fetchedData, form]);

  const autoSlug = sanitizeSlug(form.watch("title") || "");
  const mutation = useMutation(
    {
      mutationFn: async (values: FormValues) => {
        const autoSlug = sanitizeSlug(values.title);
        const finalSlug = values.slug || autoSlug;
        const payload = {
          ...values,
          slug: finalSlug,
        };

        const res = await fetch(url, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          const errorData = (await res.json().catch(() => ({}))) as {
            error?: string;
          };
          throw new Error(
            errorData.error || (isEditing ? "更新小说失败" : "创建小说失败"),
          );
        }

        return res.json() as Promise<{ id?: string }>;
      },
      onSuccess: (data) => {
        toast.success(isEditing ? "小说更新成功" : "小说创建成功");
        queryClient.invalidateQueries({ queryKey: ["novels"] });
        if (isEditing) {
          queryClient.invalidateQueries({ queryKey: ["novel", novelId] });
        } else if (data && data.id) {
          setTimeout(() => {
            window.location.href = `/admin/novels/${data.id}`;
          }, 200);
        }
      },
      onError: (error: any) => {
        toast.error(error.message);
      },
    },
    queryClient,
  );
  const onSubmit = async (values: FormValues) => {
    mutation.mutate(values);
  };

  if (isEditing && isFetching) {
    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-9 gap-8">
          <div className="lg:col-span-6 space-y-6">
            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-2">
                <Skeleton className="h-4 w-[100px]" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-[100px]" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-[100px]" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-2">
                <Skeleton className="h-4 w-[100px]" />
                <Skeleton className="h-[200px] w-[150px] rounded-lg" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-[100px]" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>

            <div className="space-y-2">
              <Skeleton className="h-4 w-[100px]" />
              <Skeleton className="h-[300px] w-full" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Skeleton className="h-4 w-[100px]" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-[100px]" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-[100px]" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="flex flex-col gap-4">
              <Skeleton className="h-[150px] w-full rounded-xl" />
              <Skeleton className="h-[300px] w-full rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-9 gap-8">
          {/* 左侧基本信息 (占据 2 列) */}
          <div className="lg:col-span-6 space-y-6">
            <div className="grid grid-cols-1 gap-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      标题 <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="例如：Martial God Asura" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="titleAlt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      别名 <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="例如：MGA, 修罗武神" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL Slug</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={autoSlug || "例如：martial-god-asura"}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      可选。在URL中使用的唯一标识符，留空将自动根据标题生成
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 gap-6">
              <FormField
                control={form.control}
                name="cover"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>封面图片</FormLabel>
                    <FormControl>
                      <ImageUpload
                        r2Domain={r2Domain}
                        value={field.value || ""}
                        onChange={field.onChange}
                        disabled={mutation.isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="authors"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>作者</FormLabel>
                    <FormControl>
                      <MultiSelect
                        value={field.value || []}
                        onChange={field.onChange}
                        placeholder="搜索作者..."
                        fetchUrl="/api/authors"
                        emptyMessage="未找到作者"
                        initialOptions={fetchedData?._initialOptions?.authors}
                      />
                    </FormControl>
                    <FormDescription>请选择小说的作者（多选）</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="categories"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>分类</FormLabel>
                    <FormControl>
                      <MultiSelect
                        value={field.value || []}
                        onChange={field.onChange}
                        placeholder="搜索分类..."
                        fetchUrl="/api/categories"
                        emptyMessage="未找到分类"
                        initialOptions={
                          fetchedData?._initialOptions?.categories
                        }
                      />
                    </FormControl>
                    <FormDescription>选择小说的分类（多选）</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>标签</FormLabel>
                    <FormControl>
                      <MultiSelect
                        value={field.value || []}
                        onChange={field.onChange}
                        placeholder="搜索标签..."
                        fetchUrl="/api/tags"
                        emptyMessage="未找到标签"
                        initialOptions={fetchedData?._initialOptions?.tags}
                      />
                    </FormControl>
                    <FormDescription>选择小说的标签（多选）</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="synopsis"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>简介</FormLabel>
                  <FormControl>
                    <div className="prose prose-sm dark:prose-invert max-w-none bg-background rounded-md border border-input">
                      <MdEditor
                        value={field.value || ""}
                        onChange={field.onChange}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="chapterCount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>章节数</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        placeholder="例如：100"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>小说总章节数，默认为 0</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="viewCount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>浏览量</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        placeholder="例如：1000"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>小说浏览量，默认为 0</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="score"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>评分</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.1"
                        min={0}
                        max={5}
                        placeholder="例如：5"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>小说评分，默认为 0</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="reviewCount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>评论数</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        max={1000000}
                        placeholder="例如：120"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      小说收到的评论数，默认为 0
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 gap-6">
              <FormField
                control={form.control}
                name="officialLink"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>官方链接</FormLabel>
                    <FormControl>
                      <Input placeholder="https://..." {...field} />
                    </FormControl>
                    <FormDescription>小说原版官方发布链接</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="translatedLink"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>翻译链接</FormLabel>
                    <FormControl>
                      <Input placeholder="https://..." {...field} />
                    </FormControl>
                    <FormDescription>其他翻译平台或相关链接</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 gap-6">
              <FormField
                control={form.control}
                name="seoTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SEO 标题</FormLabel>
                    <FormControl>
                      <Input placeholder="可选的自定义SEO标题" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="seoDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SEO 描述</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="可选的自定义SEO描述"
                        className="min-h-[80px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-6 pt-2">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem className="flex flex-col justify-between rounded-lg border p-4 space-y-2 flex-1">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        状态 <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormDescription>小说的连载状态</FormDescription>
                    </div>
                    <FormControl>
                      <select
                        className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        {...field}
                      >
                        <option value="ongoing">连载中</option>
                        <option value="completed">已完结</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="published"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 space-y-0 flex-1">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">发布</FormLabel>
                      <FormDescription>在网站前台可见</FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isPinned"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 space-y-0 flex-1">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">置顶</FormLabel>
                      <FormDescription>显示在首页推荐中</FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* 右侧章节上传 (占据 1 列) */}
          <div className="lg:col-span-3">
            {novelId ? (
              <div className="flex flex-col gap-4">
                <ChaptersInfo
                  novelId={novelId}
                  chapterCount={form.watch("chapterCount") || 0}
                />
                <ChaptersUploader
                  locale="zh"
                  novel={
                    { id: novelId, title: initialData?.title || "" } as Novel
                  }
                  onUploadSuccess={() => {
                    queryClient.invalidateQueries({
                      queryKey: ["novel", novelId],
                    });
                    queryClient.invalidateQueries({
                      queryKey: ["chapterList", novelId],
                    });
                  }}
                />
              </div>
            ) : (
              <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                <div className="flex flex-col space-y-1.5 p-6 border-b">
                  <h3 className="font-semibold leading-none tracking-tight">
                    章节管理
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    批量上传和管理小说章节
                  </p>
                </div>
                <div className="p-6">
                  <div className="flex flex-col items-center justify-center p-8 text-center border-2 border-dashed rounded-lg bg-muted/20 border-muted-foreground/20">
                    <div className="rounded-full bg-muted p-3 mb-4">
                      <UploadCloud className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <>
                      <h4 className="text-sm font-semibold mb-1">暂不可用</h4>
                      <p className="text-xs text-muted-foreground mb-4 max-w-[200px]">
                        请先填写左侧基本信息并保存小说，创建成功后即可上传章节。
                      </p>
                      <Button
                        type="submit"
                        variant="outline"
                        size="sm"
                        disabled={mutation.isPending}
                      >
                        {mutation.isPending ? (
                          <Spinner className="mr-2 h-3 w-3" />
                        ) : (
                          "立即保存小说"
                        )}
                      </Button>
                    </>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-4 border-t pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              window.location.href = "/admin/novels";
            }}
            disabled={mutation.isPending}
          >
            取消
          </Button>
          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending && <Spinner className="mr-2 h-4 w-4" />}
            {novelId ? "保存修改" : "创建小说"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
