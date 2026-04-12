import { env } from "cloudflare:workers";
import { S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import {
  PutObjectCommand,
  CopyObjectCommand,
  DeleteObjectCommand,
  DeleteObjectsCommand,
} from "@aws-sdk/client-s3";
import * as https from "https";

// 配置 HTTPS Agent 以启用 Keep-Alive 连接池
const agent = new https.Agent({
  keepAlive: true, // 保持连接开启，以便复用
  maxSockets: 20, // 最大并发连接数
  timeout: 30000, // 连接超时时间 (30秒)
});

// 存储桶
const R2_NOVELS_BUCKET = env.R2_NOVELS_BUCKET!;
const R2_ASSETS_BUCKET = env.R2_ASSETS_BUCKET!;

// 初始化客户端
const R2 = new S3Client({
  region: env.R2_REGION!,
  endpoint: env.R2_ENDPOINT!,
  credentials: {
    accessKeyId: env.R2_ACCESS_KEY_ID!,
    secretAccessKey: env.R2_SECRET_ACCESS_KEY!,
  },
  requestHandler: {
    destroy: () => {},
    agent,
  },
});

// 上传单个文件
async function uploadSingleFile({
  file,
  fileKey,
  fileType,
  bucket,
  cacheControl,
}: {
  file: File;
  fileKey: string;
  fileType: string;
  bucket: string;
  cacheControl?: string;
}) {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: fileKey,
      Body: buffer,
      ContentType: fileType,
      CacheControl: cacheControl,
    });
    await R2.send(command);

    return { fileKey, error: null };
  } catch (err) {
    console.error(err);
    return { error: err };
  }
}

// 复制临时文件到正式存储桶，同时删除临时文件
async function copySingleFile({
  bucket,
  source,
  destination,
  contentType,
  cacheControl,
}: {
  bucket: string;
  source: string;
  destination: string;
  contentType: string;
  cacheControl?: string;
}) {
  try {
    // A: 复制临时文件
    const copyCommand = new CopyObjectCommand({
      Bucket: bucket,
      CopySource: source,
      Key: destination,
      ContentType: contentType,
      CacheControl: cacheControl,
    });
    await R2.send(copyCommand);

    // B: 删除临时文件
    const deleteCommand = new DeleteObjectCommand({
      Bucket: bucket,
      Key: source,
    });
    await R2.send(deleteCommand);

    return { error: null };
  } catch (err) {
    console.error(err);
    return { error: err };
  }
}

// 删除单个文件
async function deleteSingleFile(fileKey: string, bucket: string) {
  const params = {
    Bucket: bucket,
    Key: fileKey,
  };

  try {
    const command = new DeleteObjectCommand(params);
    await R2.send(command);

    return { success: true };
  } catch (err) {
    console.error(err);
    return { error: err };
  }
}

// 删除多个文件
async function deleteMultipleFiles(fileKeys: string[], bucket: string) {
  try {
    const command = new DeleteObjectsCommand({
      Bucket: bucket,
      Delete: {
        Objects: fileKeys.map((key) => ({ Key: key })),
      },
    });
    await R2.send(command);

    return { success: true };
  } catch (err) {
    console.error(err);
    return { error: err };
  }
}

export {
  R2,
  uploadSingleFile,
  copySingleFile,
  deleteSingleFile,
  deleteMultipleFiles,
  getSignedUrl,
  R2_NOVELS_BUCKET,
  R2_ASSETS_BUCKET,
};
