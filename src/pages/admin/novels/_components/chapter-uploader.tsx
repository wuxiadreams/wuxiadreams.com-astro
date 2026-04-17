"use client";
import { useState, useCallback, useRef } from "react";
import { Upload } from "lucide-react";
import JSZip from "jszip";
import pLimit from "p-limit";
import { getNovelWordCount } from "@/lib/file";
import { actions } from "astro:actions";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { Novel } from "@/types/novel";

// 最大上传并发数
const MAX_CONCURRENT_UPLOADS = 10;

export function ChaptersUploader({
  locale,
  novel,
}: {
  locale: string;
  novel: Novel;
}) {
  const { id: novelId } = novel;
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState("未选择文件");
  const [progress, setProgress] = useState(0);

  // 辅助函数：从完整路径中提取文件名
  const getFileNameFromPath = (fullPath: string): string => {
    // 兼容 Unix (/) 和 Windows (\) 路径分隔符
    // 找到最后一个分隔符的位置，然后返回后面的部分
    const lastSlash = fullPath.lastIndexOf("/");
    const lastBackslash = fullPath.lastIndexOf("\\");

    const lastSeparatorIndex = Math.max(lastSlash, lastBackslash);

    // 如果找到了分隔符，则返回分隔符之后的部分；否则返回原路径
    return lastSeparatorIndex !== -1
      ? fullPath.substring(lastSeparatorIndex + 1)
      : fullPath;
  };

  // 辅助函数：解析章节文件名，提取标题和章节序号
  const parseChapterMetadata = useCallback(
    (filename: string, fileKey: string, wordCount: number) => {
      // 匹配开头的数字（例如 "0001" 或 "0001.1"）
      const numberMatch = filename.match(/^(\d+(?:\.\d+)?)_/);
      const number = numberMatch ? parseFloat(numberMatch[1]) : 0;

      // 提取标题：移除开头的数字和下划线，移除末尾的文件扩展名
      let title = filename
        .replace(/^(\d+(?:\.\d+)?)_/, "") // 移除 "0001_"或"0001.1_" 部分
        .replace(/\.(txt)$/i, ""); // 移除文件.txt扩展名

      // 可选：将标题中的下划线替换为空格，并确保首字母大写等格式美化
      title = title.replace(/_/g, " ");
      // 替换 "%slash%" 为 "/"
      title = title.replace(/%slash%/g, "/");
      // 示例: "chaptername" -> "Chaptername"
      if (title) {
        title = title.charAt(0).toUpperCase() + title.slice(1);
      }

      return {
        title,
        number,
        word_count: wordCount,
        file_key: fileKey,
        locale,
      };
    },
    [locale],
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setStatus(`已选择文件：${e.target.files[0].name}`);
      setProgress(0);
    } else {
      setFile(null);
      setStatus("未选择文件");
      setProgress(0);
    }
  };

  const handleUpload = useCallback(async () => {
    if (!file || file.type !== "application/zip") {
      setStatus("请选择 .ZIP 文件");
      return;
    }

    const limit = pLimit(MAX_CONCURRENT_UPLOADS);

    try {
      // 0. 在上传前清理现有的章节文件
      setStatus("处理中, 清理旧章节文件...");
      setProgress(5);

      const deleteRes = await actions.chapterManagement.deleteChapterFiles({
        novelId,
      });

      if (deleteRes.error) {
        throw new Error(`清理旧章节失败: ${deleteRes.error.message}`);
      }

      // 1. 客户端解压 ZIP 文件
      setStatus("处理中, 开始解压...");
      setProgress(10); // 标记开始解压

      const zip = new JSZip();
      const loadedZip = await zip.loadAsync(file);

      // 收集所有文件信息以便批量请求 URL
      const chapterDetails = [];
      const zipEntries = Object.entries(loadedZip.files).filter(
        ([relativePath, entry]) =>
          !entry.dir && !relativePath.startsWith("__MACOSX/"),
      );

      for (const [relativePath, entry] of zipEntries) {
        // 读取内容为文本，计算字数
        const contentText = await entry.async("text");
        const { count: wordCount } = getNovelWordCount(contentText);

        // 读取 Blob 内容
        const contentBlob = await entry.async("blob");

        // 为上传创建一个新的 File 对象
        const chapterFile = new File([contentBlob], relativePath);

        chapterDetails.push({
          filename: getFileNameFromPath(relativePath),
          contentType: "text/plain",
          wordCount,
          chapterFile: chapterFile,
        });
      }

      // 2. 批量生成上传 URL
      setStatus("处理中, 生成预签名URL...");
      setProgress(20);

      const urlsRes = await actions.chapterManagement.generateChapterUploadUrls(
        {
          novelId,
          chapterDetails: chapterDetails.map((detail) => ({
            filename: detail.filename,
            contentType: detail.contentType,
          })),
        },
      );

      if (urlsRes.error || !urlsRes.data?.urls) {
        setStatus(
          `生成预签名URLs错误: ${urlsRes.error?.message || "未知错误"}`,
        );
        return;
      }

      const urls = urlsRes.data.urls;

      // 将 URL 映射回文件对象
      const urlMap = new Map(urls.map((u) => [u.filename, u]));

      // 3. 执行并发上传任务
      setStatus("处理中, 上传章节文件...");

      const failedChapters: string[] = [];

      const uploadPromises = chapterDetails.map((detail) =>
        limit(async () => {
          try {
            const urlData = urlMap.get(detail.filename);
            if (!urlData) {
              throw new Error(`${detail.filename} 的预签名URL未找到`);
            }

            // PUT 上传到 R2
            const response = await fetch(urlData.presignedUrl, {
              method: "PUT",
              body: detail.chapterFile,
              headers: {
                "Content-Type": "text/plain",
              },
            });

            if (!response.ok) {
              throw new Error(
                `R2 上传文件 ${detail.filename} 失败: ${response.statusText}`,
              );
            }

            // 返回元数据
            return parseChapterMetadata(
              detail.filename,
              urlData.file_key,
              detail.wordCount,
            );
          } catch (err) {
            console.error(`章节 ${detail.filename} 上传失败:`, err);
            failedChapters.push(detail.filename);
            return null;
          }
        }),
      );

      // 监听进度
      let completedCount = 0;
      const totalCount = uploadPromises.length;
      const updateProgress = () => {
        completedCount++;
        // 进度条从 20% (解压) 到 90% (上传)
        setStatus(
          `处理中, 已上传 ${completedCount} 个章节，共 ${totalCount} 个...`,
        );
        setProgress(20 + Math.floor((completedCount / totalCount) * 70));
      };

      // 包装 Promise，以便在完成时更新进度
      const wrappedPromises = uploadPromises.map((p) =>
        p.then((result) => {
          updateProgress();
          return result;
        }),
      );

      const successfulMetadata = (await Promise.all(wrappedPromises)).filter(
        (item): item is NonNullable<typeof item> => item !== null,
      );

      setProgress(90);

      if (successfulMetadata.length === 0) {
        throw new Error("所有章节上传均失败");
      }

      // 4. 批量保存元数据到 数据库
      setStatus("保存章节元数据...");

      const saveRes = await actions.chapterManagement.saveChapterMetadata({
        novelId,
        chaptersData: successfulMetadata.map((m) => ({
          novelId,
          number: m.number,
          title: m.title,
          wordCount: m.word_count,
          fileKey: m.file_key,
          published: true, // Default published
        })),
      });

      if (saveRes.error) {
        setStatus(`保存章节元数据失败: ${saveRes.error.message}`);
        return;
      }

      setProgress(100);

      if (failedChapters.length > 0) {
        // 尝试从文件名中提取章节号，如果提取失败则显示文件名
        const failedDetails = failedChapters
          .map((filename) => {
            const match = filename.match(/^(\d+)_/);
            return match ? match[1] : filename;
          })
          .sort((a, b) => {
            // 如果都是数字字符串，按数字大小排序
            const numA = parseInt(a);
            const numB = parseInt(b);
            if (!isNaN(numA) && !isNaN(numB)) {
              return numA - numB;
            }
            return a.localeCompare(b);
          });

        setStatus(
          `部分完成! ${successfulMetadata.length} 个章节成功，${
            failedChapters.length
          } 个失败。失败章节: [${failedDetails.join(", ")}]`,
        );
      } else {
        setStatus("成功! 所有章节数据已上传并保存");
      }
      setFile(null);
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    } catch (error) {
      console.log(error);
      setStatus(`致命错误：请在控制台中查看错误详情`);
      setProgress(0);
    }
  }, [file, novelId, parseChapterMetadata]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>章节上传</CardTitle>
        <CardDescription>
          请上传小说章节 .zip 压缩包，文件格式
          .txt，上传新压缩包将删除全部旧的章节数据，并使服务端已存在的章节缓存失效
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Input
            ref={inputRef}
            id="chapters"
            type="file"
            accept=".zip"
            onChange={handleFileChange}
          />

          <p className="text-sm text-primary">状态：{status}</p>

          {status.includes("处理中") && progress > 0 && progress < 100 && (
            <progress value={progress} max="100" className="w-full">
              {progress}%
            </progress>
          )}
        </div>

        <Button
          className="gap-1"
          disabled={!file || status.includes("处理中")}
          onClick={handleUpload}
        >
          <Upload size="16" />
          上传章节
        </Button>
      </CardContent>
    </Card>
  );
}
