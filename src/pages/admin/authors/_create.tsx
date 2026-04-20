import { useState, useEffect } from "react";
import { useStore } from "@nanostores/react";
import { reactQueryClient } from "@/stores/query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { sanitizeSlug } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface CreateAuthorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CreateAuthorDialog({
  open,
  onOpenChange,
}: CreateAuthorDialogProps) {
  const [name, setName] = useState("");
  const [nameAlt, setNameAlt] = useState("");
  const [slug, setSlug] = useState("");
  const [country, setCountry] = useState("");
  const [isPinned, setIsPinned] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useStore(reactQueryClient);

  useEffect(() => {
    if (open) {
      setName("");
      setNameAlt("");
      setSlug("");
      setCountry("");
      setIsPinned(false);
    }
  }, [open]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const autoSlug = sanitizeSlug(name);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const finalSlug = slug || autoSlug;

    try {
      const res = await fetch("/api/authors", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          nameAlt,
          slug: finalSlug,
          country,
          isPinned,
        }),
      });

      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        throw new Error(data.error || "创建失败");
      }

      // Success
      toast.success("作者新建成功");
      setName("");
      setNameAlt("");
      setSlug("");
      setCountry("");
      setIsPinned(false);
      onOpenChange(false);
      queryClient.invalidateQueries({ queryKey: ["authors"] });
    } catch (err: any) {
      toast.error(err.message || "创建作者失败");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>新建作者</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label
                htmlFor="name"
                className="text-right text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                名称
              </label>
              <Input
                id="name"
                value={name}
                onChange={handleNameChange}
                className="col-span-3"
                placeholder="例如: Tang Jia San Shao"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label
                htmlFor="nameAlt"
                className="text-right text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                别名
              </label>
              <Input
                id="nameAlt"
                value={nameAlt}
                onChange={(e) => setNameAlt(e.target.value)}
                className="col-span-3"
                placeholder="例如: 唐家三少"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label
                htmlFor="slug"
                className="text-right text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Slug
              </label>
              <Input
                id="slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="col-span-3"
                placeholder={autoSlug || "例如: tang-jia-san-shao"}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label
                htmlFor="country"
                className="text-right text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                国家
              </label>
              <Input
                id="country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="col-span-3"
                placeholder="例如: 中国"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label
                htmlFor="isPinned"
                className="text-right text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                置顶
              </label>
              <div className="col-span-3 flex items-center space-x-2">
                <Switch
                  id="isPinned"
                  checked={isPinned}
                  onCheckedChange={setIsPinned}
                />
              </div>
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
