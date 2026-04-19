import { useState } from "react";
import { toast } from "sonner";
import { actions } from "astro:actions";
import {
  FileUpload,
  FileUploadDropzone,
  FileUploadList,
} from "@/components/ui/file-upload";

interface ImageUploadProps {
  r2Domain: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function ImageUpload({
  r2Domain,
  value,
  onChange,
  disabled,
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);

  const handleValueChange = async (files: File[]) => {
    if (!files || files.length === 0) return;

    const file = files[0];

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("file", file);

      const res = await actions.cover.upload(formData);

      if (res.error) {
        throw new Error(res.error.message || "上传失败");
      }

      if (res.data?.fileKey) {
        onChange(res.data.fileKey);
        console.log(res.data.fileKey);
        toast.success("图片上传成功");
      }
    } catch (error: any) {
      toast.error(error.message || "上传图片失败");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <FileUpload
      accept="image/*"
      maxFiles={1}
      maxSize={5 * 1024 * 1024} // 5MB
      onValueChange={handleValueChange}
      disabled={disabled || isUploading}
    >
      {!value ? (
        <FileUploadDropzone className="flex min-h-[150px] flex-col items-center justify-center rounded-lg border-2 border-dashed bg-muted/20 px-4 py-6 text-center transition-colors hover:bg-muted/50 data-[state=active]:border-primary data-[state=active]:bg-primary/5">
          <div className="flex flex-col items-center gap-2">
            <div className="rounded-full bg-background p-3 shadow-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6 text-muted-foreground"
              >
                <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                <circle cx="9" cy="9" r="2" />
                <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
              </svg>
            </div>
            <div className="text-sm font-medium">
              {isUploading ? "正在上传..." : "点击或拖拽上传封面"}
            </div>
            <div className="text-xs text-muted-foreground">
              支持 JPG, PNG, WEBP (最大 5MB)
            </div>
          </div>
        </FileUploadDropzone>
      ) : (
        <div className="relative overflow-hidden p-0 border-none bg-transparent flex justify-center h-[200px] sm:h-[300px]">
          <img
            src={`https://${r2Domain}/${value}`}
            alt="Cover Preview"
            className="h-full min-w-[200px] object-contain rounded-md border border-border/50 bg-muted/10 shadow-sm"
          />
          <button
            type="button"
            className="absolute right-2 top-2 rounded-full bg-background/80 p-1.5 shadow-sm backdrop-blur-sm transition-colors hover:bg-destructive hover:text-destructive-foreground z-10"
            onClick={() => onChange("")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>
      )}

      <FileUploadList />
    </FileUpload>
  );
}
