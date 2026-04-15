import { env } from "cloudflare:workers";
import { defineAction } from "astro:actions";
import { z } from "zod";
import {
  R2_ASSETS_BUCKET,
  uploadSingleFile,
  copySingleFile,
  deleteSingleFile,
  deleteMultipleFiles,
} from "@/lib/r2";
import { nanoid } from "@/lib/nanoid";

// 提取验证用户权限的私有方法
async function getAuthenticatedUser(locals: App.Locals) {
  const { user } = locals;
  const email = user?.email;
  const adminEmails = (env.ADMIN_EMAILS ?? "").split(",");

  if (!email || !adminEmails.includes(email || "")) {
    throw new Error("Unauthorized");
  }

  return user;
}

export const cover = {
  // 1. 上传封面到临时目录
  upload: defineAction({
    accept: "form",
    input: z.object({
      file: z.instanceof(File),
    }),
    handler: async ({ file }, { locals }) => {
      await getAuthenticatedUser(locals);

      const uuid = nanoid();
      const fileExtension = file.type.split("/")[1] || "jpg";
      const tempFileKey = `temp/${uuid}.${fileExtension}`;

      const { error } = await uploadSingleFile({
        file,
        fileKey: tempFileKey,
        fileType: file.type,
        bucket: R2_ASSETS_BUCKET,
        cacheControl: "public, max-age=31536000, immutable",
      });

      if (error) {
        throw new Error("Failed to upload cover to R2");
      }

      return { fileKey: tempFileKey };
    },
  }),

  // 2. 复制临时文件到正式目录
  copy: defineAction({
    input: z.object({
      source: z.string(),
      destination: z.string(),
      contentType: z.string(),
      cacheControl: z.string().optional(),
    }),
    handler: async (
      { source, destination, contentType, cacheControl },
      { locals },
    ) => {
      await getAuthenticatedUser(locals);

      const { error } = await copySingleFile({
        bucket: R2_ASSETS_BUCKET,
        source,
        destination,
        contentType,
        cacheControl,
      });

      if (error) {
        throw new Error("Failed to copy cover from temp");
      }

      return { success: true };
    },
  }),

  // 3. 删除单个封面
  delete: defineAction({
    input: z.string(),
    handler: async (fileKey, { locals }) => {
      await getAuthenticatedUser(locals);

      const { error } = await deleteSingleFile(fileKey, R2_ASSETS_BUCKET);

      if (error) {
        throw new Error("Failed to delete cover from R2");
      }

      return { success: true };
    },
  }),

  // 4. 批量删除封面
  deleteMultiple: defineAction({
    input: z.array(z.string()),
    handler: async (coverKeys, { locals }) => {
      await getAuthenticatedUser(locals);

      const { error } = await deleteMultipleFiles(coverKeys, R2_ASSETS_BUCKET);

      if (error) {
        throw new Error("Failed to delete covers from R2");
      }

      return { success: true };
    },
  }),
};
