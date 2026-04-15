import { useState } from "react";
import { useStore } from "@nanostores/react";
import { reactQueryClient } from "@/stores/query";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import MdEditor from "@/components/md-editor";
import { sanitizeSlug } from "@/lib/utils";
import type { PostType } from "@/pages/api/posts";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const postSchema = z.object({
  title: z.string().min(1, { message: "标题是必填项" }),
  slug: z.string().optional(),
  cover: z
    .string()
    .min(1, { message: "封面链接是必填项" })
    .url({ message: "必须是有效的 URL" }),
  abstract: z.string().optional(),
  content: z.string().optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  published: z.boolean(),
});

export type PostFormValues = z.infer<typeof postSchema>;

interface PostFormProps {
  initialData?: PostType;
}

export default function PostForm({ initialData }: PostFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEdit = !!initialData;
  const queryClient = useStore(reactQueryClient);

  const form = useForm<PostFormValues>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: initialData?.title || "",
      slug: initialData?.slug || "",
      cover: initialData?.cover || "",
      abstract: initialData?.abstract || "",
      content: initialData?.content || "",
      seoTitle: initialData?.seoTitle || "",
      seoDescription: initialData?.seoDescription || "",
      published: initialData?.published || false,
    },
  });

  const titleValue = form.watch("title");
  const autoSlug = sanitizeSlug(titleValue || "");

  const onSubmit = async (values: PostFormValues) => {
    const finalSlug = values.slug || autoSlug;
    if (!finalSlug) {
      form.setError("slug", {
        type: "manual",
        message: "Slug 不能为空，请提供标题或手动输入",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const url = isEdit ? `/api/posts/${initialData.id}` : "/api/posts";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...values, slug: finalSlug }),
      });

      if (!res.ok) {
        const errorData = (await res.json().catch(() => ({}))) as {
          error?: string;
        };
        throw new Error(errorData.error || (isEdit ? "更新失败" : "创建失败"));
      }

      toast.success(isEdit ? "文章更新成功" : "文章创建成功");
      queryClient.invalidateQueries({ queryKey: ["posts"] });

      // Redirect back to list
      window.location.href = "/admin/posts";
    } catch (err: any) {
      toast.error(
        err.message || (isEdit ? "更新文章时出错" : "创建文章时出错"),
      );
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 max-w-4xl"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  标题 <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="输入文章标题" {...field} />
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
                <FormLabel>Slug</FormLabel>
                <FormControl>
                  <Input
                    placeholder={autoSlug || "例如: my-first-post"}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="cover"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                封面链接 <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="https://..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="abstract"
          render={({ field }) => (
            <FormItem>
              <FormLabel>摘要</FormLabel>
              <FormControl>
                <Input placeholder="文章简短摘要..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>文章内容</FormLabel>
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

        <div className="grid grid-cols-1 gap-6">
          <FormField
            control={form.control}
            name="seoTitle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>SEO 标题</FormLabel>
                <FormControl>
                  <Input placeholder="可选" {...field} />
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
                  <Textarea placeholder="可选" rows={3} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="published"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">立即发布</FormLabel>
                <FormDescription>打开后文章将对公众可见</FormDescription>
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

        <div className="flex gap-4 pt-4">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "保存中..." : isEdit ? "保存更改" : "创建文章"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => (window.location.href = "/admin/posts")}
            disabled={isSubmitting}
          >
            取消
          </Button>
        </div>
      </form>
    </Form>
  );
}
