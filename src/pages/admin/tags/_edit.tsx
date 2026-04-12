import { useState, useEffect } from "react";
import { useStore } from "@nanostores/react";
import { reactQueryClient } from "@/stores/query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { sanitizeSlug } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import type { TagType } from "@/pages/api/tags";

interface EditTagDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tag: TagType | null;
}

export default function EditTagDialog({
  open,
  onOpenChange,
  tag,
}: EditTagDialogProps) {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useStore(reactQueryClient);

  useEffect(() => {
    if (tag && open) {
      setName(tag.name);
      setSlug(tag.slug);
    }
  }, [tag, open]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const autoSlug = sanitizeSlug(name);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tag) return;

    setIsLoading(true);

    const finalSlug = slug || autoSlug;

    try {
      const res = await fetch(`/api/tags/${tag.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, slug: finalSlug }),
      });

      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        throw new Error(data.error || "更新失败");
      }

      // Success
      toast.success("标签更新成功");
      onOpenChange(false);
      queryClient.invalidateQueries({ queryKey: ["tags"] });
    } catch (err: any) {
      toast.error(err.message || "更新标签失败");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>编辑标签</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label
                htmlFor="edit-name"
                className="text-right text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                名称
              </label>
              <Input
                id="edit-name"
                value={name}
                onChange={handleNameChange}
                className="col-span-3"
                placeholder="例如: 玄幻"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label
                htmlFor="edit-slug"
                className="text-right text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Slug
              </label>
              <Input
                id="edit-slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="col-span-3"
                placeholder={autoSlug || "例如: xuanhuan"}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              取消
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "保存中..." : "保存"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
