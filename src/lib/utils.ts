import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function sanitizeSlug(slug: string) {
  return slug
    .trim() // 移除首尾空格
    .replace(/\s+/g, "-") // 空格替换为“-”
    .replace(/[^\p{L}\p{N}\s]+/gu, "-") // 替换非语言字符
    .replace(/-+/g, "-") // 连续"-"只保留一个
    .replace(/^-+|-+$/g, "") // 去掉首尾"-"
    .toLocaleLowerCase(); // 转换为小写
}
