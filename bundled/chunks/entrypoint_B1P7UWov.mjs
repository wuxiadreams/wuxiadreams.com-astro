globalThis.process ??= {};
globalThis.process.env ??= {};
import "./server_B0Fce2x_.mjs";
import { aE as HttpResponse, w as parseRfc7231DateTime, aC as Command, aF as commonParams, aD as getEndpointPlugin, aG as getFlexibleChecksumsPlugin, aH as getSsecPlugin, aI as GetObject$, aJ as getThrow200ExceptionsPlugin, aK as ListObjectsV2$, aL as buildQueryString, aM as SignatureV4MultiRegion, aN as getEndpointFromInstructions, H as HttpRequest, aO as R2_NOVELS_BUCKET, aP as R2, aQ as deleteMultipleFiles, aR as deleteSingleFile, i as copySingleFile, aS as R2_ASSETS_BUCKET, aT as uploadSingleFile, aU as DeleteObjectsCommand, aV as PutObjectCommand } from "./r2_fNuLAT3E.mjs";
import { d as db } from "./db_1qztcB8G.mjs";
import { n as novel, b as and, e as eq, x as chapter$1, y as lt, c as desc, z as gt, h as asc, s as sql, q as dailyStat, f as author, j as novelAuthor, i as category, m as novelCategory, v as tag, k as novelTag } from "./schema_98e5FuKX.mjs";
import { env } from "cloudflare:workers";
import { f as defineAction } from "./worker-entry_BlhFEBb5.mjs";
import { T as object, U as number, V as string, _ as _instanceof, W as array, X as boolean, Y as _enum, Z as union, $ as date } from "./transition_DzUAhAmX.mjs";
import { c as count } from "./aggregate_Dn_MtSgz.mjs";
const s3ExpiresMiddleware = (config) => {
  return (next, context) => async (args) => {
    const result = await next(args);
    const { response } = result;
    if (HttpResponse.isInstance(response)) {
      if (response.headers.expires) {
        response.headers.expiresstring = response.headers.expires;
        try {
          parseRfc7231DateTime(response.headers.expires);
        } catch (e) {
          context.logger?.warn(`AWS SDK Warning for ${context.clientName}::${context.commandName} response parsing (${response.headers.expires}): ${e}`);
          delete response.headers.expires;
        }
      }
    }
    return result;
  };
};
const s3ExpiresMiddlewareOptions = {
  tags: ["S3"],
  name: "s3ExpiresMiddleware",
  override: true,
  relation: "after",
  toMiddleware: "deserializerMiddleware"
};
const getS3ExpiresMiddlewarePlugin = (clientConfig) => ({
  applyToStack: (clientStack) => {
    clientStack.addRelativeTo(s3ExpiresMiddleware(), s3ExpiresMiddlewareOptions);
  }
});
class GetObjectCommand extends Command.classBuilder().ep({
  ...commonParams,
  Bucket: { type: "contextParams", name: "Bucket" },
  Key: { type: "contextParams", name: "Key" }
}).m(function(Command2, cs, config, o) {
  return [
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions()),
    getFlexibleChecksumsPlugin(config, {
      requestChecksumRequired: false,
      requestValidationModeMember: "ChecksumMode",
      "responseAlgorithms": ["CRC64NVME", "CRC32", "CRC32C", "SHA256", "SHA1"]
    }),
    getSsecPlugin(config),
    getS3ExpiresMiddlewarePlugin()
  ];
}).s("AmazonS3", "GetObject", {}).n("S3Client", "GetObjectCommand").sc(GetObject$).build() {
}
class ListObjectsV2Command extends Command.classBuilder().ep({
  ...commonParams,
  Bucket: { type: "contextParams", name: "Bucket" },
  Prefix: { type: "contextParams", name: "Prefix" }
}).m(function(Command2, cs, config, o) {
  return [
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions()),
    getThrow200ExceptionsPlugin(config)
  ];
}).s("AmazonS3", "ListObjectsV2", {}).n("S3Client", "ListObjectsV2Command").sc(ListObjectsV2$).build() {
}
function formatUrl(request) {
  const { port, query } = request;
  let { protocol, path, hostname } = request;
  if (protocol && protocol.slice(-1) !== ":") {
    protocol += ":";
  }
  if (port) {
    hostname += `:${port}`;
  }
  if (path && path.charAt(0) !== "/") {
    path = `/${path}`;
  }
  let queryString = query ? buildQueryString(query) : "";
  if (queryString && queryString[0] !== "?") {
    queryString = `?${queryString}`;
  }
  let auth = "";
  if (request.username != null || request.password != null) {
    const username = request.username ?? "";
    const password = request.password ?? "";
    auth = `${username}:${password}@`;
  }
  let fragment = "";
  if (request.fragment) {
    fragment = `#${request.fragment}`;
  }
  return `${protocol}//${auth}${hostname}${path}${queryString}${fragment}`;
}
const UNSIGNED_PAYLOAD = "UNSIGNED-PAYLOAD";
const SHA256_HEADER = "X-Amz-Content-Sha256";
class S3RequestPresigner {
  signer;
  constructor(options) {
    const resolvedOptions = {
      service: options.signingName || options.service || "s3",
      uriEscapePath: options.uriEscapePath || false,
      applyChecksum: options.applyChecksum || false,
      ...options
    };
    this.signer = new SignatureV4MultiRegion(resolvedOptions);
  }
  presign(requestToSign, { unsignableHeaders = /* @__PURE__ */ new Set(), hoistableHeaders = /* @__PURE__ */ new Set(), unhoistableHeaders = /* @__PURE__ */ new Set(), ...options } = {}) {
    this.prepareRequest(requestToSign, {
      unsignableHeaders,
      unhoistableHeaders,
      hoistableHeaders
    });
    return this.signer.presign(requestToSign, {
      expiresIn: 900,
      unsignableHeaders,
      unhoistableHeaders,
      ...options
    });
  }
  presignWithCredentials(requestToSign, credentials, { unsignableHeaders = /* @__PURE__ */ new Set(), hoistableHeaders = /* @__PURE__ */ new Set(), unhoistableHeaders = /* @__PURE__ */ new Set(), ...options } = {}) {
    this.prepareRequest(requestToSign, {
      unsignableHeaders,
      unhoistableHeaders,
      hoistableHeaders
    });
    return this.signer.presignWithCredentials(requestToSign, credentials, {
      expiresIn: 900,
      unsignableHeaders,
      unhoistableHeaders,
      ...options
    });
  }
  prepareRequest(requestToSign, { unsignableHeaders = /* @__PURE__ */ new Set(), unhoistableHeaders = /* @__PURE__ */ new Set(), hoistableHeaders = /* @__PURE__ */ new Set() } = {}) {
    unsignableHeaders.add("content-type");
    Object.keys(requestToSign.headers).map((header) => header.toLowerCase()).filter((header) => header.startsWith("x-amz-server-side-encryption")).forEach((header) => {
      if (!hoistableHeaders.has(header)) {
        unhoistableHeaders.add(header);
      }
    });
    requestToSign.headers[SHA256_HEADER] = UNSIGNED_PAYLOAD;
    const currentHostHeader = requestToSign.headers.host;
    const port = requestToSign.port;
    const expectedHostHeader = `${requestToSign.hostname}${requestToSign.port != null ? ":" + port : ""}`;
    if (!currentHostHeader || currentHostHeader === requestToSign.hostname && requestToSign.port != null) {
      requestToSign.headers.host = expectedHostHeader;
    }
  }
}
const getSignedUrl = async (client, command, options = {}) => {
  let s3Presigner;
  let region;
  if (typeof client.config.endpointProvider === "function") {
    const endpointV2 = await getEndpointFromInstructions(command.input, command.constructor, client.config);
    const authScheme = endpointV2.properties?.authSchemes?.[0];
    if (authScheme?.name === "sigv4a") {
      region = authScheme?.signingRegionSet?.join(",");
    } else {
      region = authScheme?.signingRegion;
    }
    s3Presigner = new S3RequestPresigner({
      ...client.config,
      signingName: authScheme?.signingName,
      region: async () => region
    });
  } else {
    s3Presigner = new S3RequestPresigner(client.config);
  }
  const presignInterceptMiddleware = (next, context) => async (args) => {
    const { request } = args;
    if (!HttpRequest.isInstance(request)) {
      throw new Error("Request to be presigned is not an valid HTTP request.");
    }
    delete request.headers["amz-sdk-invocation-id"];
    delete request.headers["amz-sdk-request"];
    delete request.headers["x-amz-user-agent"];
    let presigned2;
    const presignerOptions = {
      ...options,
      signingRegion: options.signingRegion ?? context["signing_region"] ?? region,
      signingService: options.signingService ?? context["signing_service"]
    };
    if (context.s3ExpressIdentity) {
      presigned2 = await s3Presigner.presignWithCredentials(request, context.s3ExpressIdentity, presignerOptions);
    } else {
      presigned2 = await s3Presigner.presign(request, presignerOptions);
    }
    return {
      response: {},
      output: {
        $metadata: { httpStatusCode: 200 },
        presigned: presigned2
      }
    };
  };
  const middlewareName = "presignInterceptMiddleware";
  const clientStack = client.middlewareStack.clone();
  clientStack.addRelativeTo(presignInterceptMiddleware, {
    name: middlewareName,
    relation: "before",
    toMiddleware: "awsAuthMiddleware",
    override: true
  });
  const handler = command.resolveMiddleware(clientStack, client.config, {});
  const { output } = await handler({ input: command.input });
  const { presigned } = output;
  return formatUrl(presigned);
};
const chapter = {
  fetchChapterContent: defineAction({
    accept: "json",
    input: object({
      fileKey: string()
    }),
    handler: async (input) => {
      const { fileKey } = input;
      if (!fileKey) {
        return { data: null, error: "File key is missing." };
      }
      try {
        const command = new GetObjectCommand({
          Bucket: R2_NOVELS_BUCKET,
          Key: fileKey
        });
        const response = await R2.send(command);
        if (response.Body) {
          const chapterText = await response.Body.transformToString("utf-8");
          return { data: chapterText, error: null };
        } else {
          return {
            data: null,
            error: "R2 response was successful but file content body is empty."
          };
        }
      } catch (e) {
        const errorMsg = e instanceof Error ? e.message : "An unknown error occurred during R2 content fetching.";
        return {
          data: null,
          error: `Failed to fetch chapter content from R2: ${errorMsg}`
        };
      }
    }
  }),
  getNovelChapters: defineAction({
    accept: "json",
    input: object({
      novelId: string(),
      page: number().min(1).default(1),
      pageSize: number().min(1).max(500).default(100)
    }),
    handler: async (input) => {
      const { novelId, page, pageSize } = input;
      try {
        const chaptersData = await db.select({
          id: chapter$1.id,
          title: chapter$1.title,
          number: chapter$1.number,
          wordCount: chapter$1.wordCount,
          createdAt: chapter$1.createdAt
        }).from(chapter$1).where(
          and(
            eq(chapter$1.novelId, novelId),
            eq(chapter$1.published, true)
          )
        ).orderBy(asc(chapter$1.number)).limit(pageSize).offset((page - 1) * pageSize);
        return { chapters: chaptersData, error: null };
      } catch (e) {
        const errorMsg = e instanceof Error ? e.message : "Unknown error";
        return { chapters: [], error: `Failed to fetch chapters: ${errorMsg}` };
      }
    }
  }),
  getChapterData: defineAction({
    accept: "json",
    input: object({
      slug: string(),
      chapterNumber: number()
    }),
    handler: async (input) => {
      const { slug, chapterNumber } = input;
      const novelData = await db.select({
        id: novel.id,
        title: novel.title,
        slug: novel.slug,
        cover: novel.cover,
        reviewCount: novel.reviewCount,
        totalChapters: novel.chapterCount
      }).from(novel).where(and(eq(novel.slug, slug), eq(novel.published, true))).get();
      if (!novelData) {
        return { data: null, error: "Novel not found" };
      }
      const currentChapter = await db.select().from(chapter$1).where(
        and(
          eq(chapter$1.novelId, novelData.id),
          eq(chapter$1.number, chapterNumber),
          eq(chapter$1.published, true)
        )
      ).get();
      if (!currentChapter) {
        return { data: null, error: "Chapter not found", novelData };
      }
      const [prevChapter, nextChapter] = await Promise.all([
        db.select({ number: chapter$1.number }).from(chapter$1).where(
          and(
            eq(chapter$1.novelId, novelData.id),
            lt(chapter$1.number, chapterNumber),
            eq(chapter$1.published, true)
          )
        ).orderBy(desc(chapter$1.number)).limit(1).get(),
        db.select({ number: chapter$1.number }).from(chapter$1).where(
          and(
            eq(chapter$1.novelId, novelData.id),
            gt(chapter$1.number, chapterNumber),
            eq(chapter$1.published, true)
          )
        ).orderBy(asc(chapter$1.number)).limit(1).get()
      ]);
      return {
        data: {
          novelData,
          currentChapter,
          prevChapter,
          nextChapter,
          totalChapters: novelData.totalChapters
        },
        error: null
      };
    }
  })
};
let random = (bytes) => crypto.getRandomValues(new Uint8Array(bytes));
let customRandom = (alphabet2, defaultSize, getRandom) => {
  let mask = (2 << Math.log2(alphabet2.length - 1)) - 1;
  let step = -~(1.6 * mask * defaultSize / alphabet2.length);
  return (size = defaultSize) => {
    let id = "";
    while (true) {
      let bytes = getRandom(step);
      let j = step | 0;
      while (j--) {
        id += alphabet2[bytes[j] & mask] || "";
        if (id.length >= size) return id;
      }
    }
  };
};
let customAlphabet = (alphabet2, size = 21) => customRandom(alphabet2, size | 0, random);
const alphabet = "0123456789abcdefghijklmnopqrstuvwxyz";
const nanoid = customAlphabet(alphabet, 24);
async function getAuthenticatedUser(locals) {
  const { user } = locals;
  const email = user?.email;
  const adminEmails = (env.ADMIN_EMAILS ?? "").split(",");
  if (!email || !adminEmails.includes(email || "")) {
    throw new Error("Unauthorized");
  }
  return user;
}
const cover = {
  // 1. 上传封面到临时目录
  upload: defineAction({
    accept: "form",
    input: object({
      file: _instanceof(File)
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
        cacheControl: "public, max-age=31536000, immutable"
      });
      if (error) {
        throw new Error("Failed to upload cover to R2");
      }
      return { fileKey: tempFileKey };
    }
  }),
  // 2. 复制临时文件到正式目录
  copy: defineAction({
    input: object({
      source: string(),
      destination: string(),
      contentType: string(),
      cacheControl: string().optional()
    }),
    handler: async ({ source, destination, contentType, cacheControl }, { locals }) => {
      await getAuthenticatedUser(locals);
      const { error } = await copySingleFile({
        bucket: R2_ASSETS_BUCKET,
        source,
        destination,
        contentType,
        cacheControl
      });
      if (error) {
        throw new Error("Failed to copy cover from temp");
      }
      return { success: true };
    }
  }),
  // 3. 删除单个封面
  delete: defineAction({
    input: string(),
    handler: async (fileKey, { locals }) => {
      await getAuthenticatedUser(locals);
      const { error } = await deleteSingleFile(fileKey, R2_ASSETS_BUCKET);
      if (error) {
        throw new Error("Failed to delete cover from R2");
      }
      return { success: true };
    }
  }),
  // 4. 批量删除封面
  deleteMultiple: defineAction({
    input: array(string()),
    handler: async (coverKeys, { locals }) => {
      await getAuthenticatedUser(locals);
      const { error } = await deleteMultipleFiles(coverKeys, R2_ASSETS_BUCKET);
      if (error) {
        throw new Error("Failed to delete covers from R2");
      }
      return { success: true };
    }
  })
};
const novelActions = {
  getNovelInfo: defineAction({
    accept: "json",
    input: object({
      slug: string(),
      currentPage: number().default(1),
      sortOrder: _enum(["asc", "desc"]).default("asc"),
      pageSize: number().default(100),
      incrementView: boolean().default(false)
    }),
    handler: async (input) => {
      const { slug, currentPage, sortOrder, pageSize, incrementView } = input;
      const novelData = await db.select().from(novel).where(and(eq(novel.slug, slug), eq(novel.published, true))).get();
      if (!novelData) {
        return { novelData: null };
      }
      if (incrementView) {
        const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
        await db.update(novel).set({ viewCount: sql`${novel.viewCount} + 1` }).where(eq(novel.id, novelData.id));
        const stat = await db.select().from(dailyStat).where(
          and(eq(dailyStat.novelId, novelData.id), eq(dailyStat.date, today))
        ).get();
        if (stat) {
          await db.update(dailyStat).set({ viewCount: sql`${dailyStat.viewCount} + 1` }).where(
            and(
              eq(dailyStat.novelId, novelData.id),
              eq(dailyStat.date, today)
            )
          );
        } else {
          await db.insert(dailyStat).values({ novelId: novelData.id, date: today, viewCount: 1 });
        }
        novelData.viewCount += 1;
      }
      const [
        authorsData,
        categoriesData,
        tagsData,
        chaptersData,
        [firstChapterData]
      ] = await Promise.all([
        // 获取作者
        db.select({
          id: author.id,
          name: author.name,
          nameAlt: author.nameAlt,
          slug: author.slug
        }).from(novelAuthor).innerJoin(author, eq(novelAuthor.authorId, author.id)).where(eq(novelAuthor.novelId, novelData.id)),
        // 获取分类
        db.select({
          id: category.id,
          name: category.name,
          slug: category.slug
        }).from(novelCategory).innerJoin(category, eq(novelCategory.categoryId, category.id)).where(eq(novelCategory.novelId, novelData.id)),
        // 获取标签
        db.select({
          id: tag.id,
          name: tag.name,
          slug: tag.slug
        }).from(novelTag).innerJoin(tag, eq(novelTag.tagId, tag.id)).where(eq(novelTag.novelId, novelData.id)),
        // 获取章节数据
        db.select({
          id: chapter$1.id,
          title: chapter$1.title,
          number: chapter$1.number,
          wordCount: chapter$1.wordCount,
          createdAt: chapter$1.createdAt
        }).from(chapter$1).where(
          and(eq(chapter$1.novelId, novelData.id), eq(chapter$1.published, true))
        ).orderBy(
          sortOrder === "desc" ? desc(chapter$1.number) : asc(chapter$1.number)
        ).limit(pageSize).offset((currentPage - 1) * pageSize),
        // 获取第一章数据 (仅查一个字段，用于“开始阅读”按钮)
        db.select({ number: chapter$1.number }).from(chapter$1).where(
          and(eq(chapter$1.novelId, novelData.id), eq(chapter$1.published, true))
        ).orderBy(asc(chapter$1.number)).limit(1)
      ]);
      const totalChapters = novelData.chapterCount;
      let authorOtherNovels = [];
      if (authorsData.length > 0) {
        authorOtherNovels = await db.select({
          slug: novel.slug,
          title: novel.title,
          cover: novel.cover,
          score: novel.score,
          status: novel.status,
          chapterCount: novel.chapterCount
        }).from(novel).innerJoin(novelAuthor, eq(novel.id, novelAuthor.novelId)).where(
          and(
            eq(novel.published, true),
            eq(novelAuthor.authorId, authorsData[0].id)
          )
        ).orderBy(desc(novel.viewCount)).limit(7);
        authorOtherNovels = authorOtherNovels.filter((n) => n.slug !== novelData.slug).slice(0, 6);
      }
      return {
        novelData,
        authorsData,
        categoriesData,
        tagsData,
        chaptersData,
        totalChapters,
        firstChapterData,
        authorOtherNovels
      };
    }
  })
};
async function getAuthenticatedAdmin(locals) {
  const { user } = locals;
  const email = user?.email;
  const adminEmails = (env.ADMIN_EMAILS ?? "").split(",");
  if (!email || !adminEmails.includes(email || "")) {
    throw new Error("Unauthorized");
  }
  return user;
}
const chapterManagement = {
  // 上传单独章节文件
  uploadChapterFile: defineAction({
    accept: "form",
    input: object({
      file: _instanceof(File)
    }),
    handler: async ({ file }, { locals }) => {
      await getAuthenticatedAdmin(locals);
      const uuid = nanoid();
      const tempFileKey = `temp/${uuid}.txt`;
      const { error } = await uploadSingleFile({
        file,
        fileKey: tempFileKey,
        fileType: "text/plain",
        bucket: R2_NOVELS_BUCKET,
        cacheControl: "public, max-age=31536000, immutable"
      });
      if (error) {
        console.error(error);
        throw new Error("Failed to upload file to R2");
      }
      return { fileKey: tempFileKey };
    }
  }),
  // 复制临时章节文件到小说目录
  copyChapterFile: defineAction({
    accept: "json",
    input: object({
      bucket: string(),
      source: string(),
      destination: string(),
      contentType: string(),
      cacheControl: string().optional()
    }),
    handler: async (input, { locals }) => {
      await getAuthenticatedAdmin(locals);
      const { error } = await copySingleFile(input);
      if (error) {
        throw new Error("Failed to copy chapter from temp");
      }
      return { success: true };
    }
  }),
  // 删除章节文件
  deleteChapterFile: defineAction({
    accept: "json",
    input: object({
      fileKey: string()
    }),
    handler: async ({ fileKey }, { locals }) => {
      await getAuthenticatedAdmin(locals);
      const { error } = await deleteSingleFile(fileKey, R2_NOVELS_BUCKET);
      if (error) {
        throw new Error("Failed to delete R2 file");
      }
      return { success: true };
    }
  }),
  // 生成章节上传的预签名 URL
  generateChapterUploadUrls: defineAction({
    accept: "json",
    input: object({
      novelId: string(),
      chapterDetails: array(
        object({
          filename: string(),
          contentType: string()
        })
      )
    }),
    handler: async ({ novelId, chapterDetails }, { locals }) => {
      await getAuthenticatedAdmin(locals);
      try {
        const urlPromises = chapterDetails.map((detail) => {
          const uniqueKey = `${novelId}/${detail.filename}`;
          const command = new PutObjectCommand({
            Bucket: R2_NOVELS_BUCKET,
            Key: uniqueKey,
            ContentType: "text/plain"
          });
          return getSignedUrl(R2, command, { expiresIn: 12e3 }).then(
            (presignedUrl) => ({
              presignedUrl,
              file_key: uniqueKey,
              filename: detail.filename
            })
          );
        });
        const urls = await Promise.all(urlPromises);
        return { urls };
      } catch (error) {
        console.error(error);
        throw new Error("Failed to generate presigned URLs");
      }
    }
  }),
  // 保存章节元数据到数据库 (批量插入)
  saveChapterMetadata: defineAction({
    accept: "json",
    input: object({
      novelId: string(),
      chaptersData: array(
        object({
          id: string().optional(),
          novelId: string(),
          number: number(),
          title: string(),
          wordCount: number().default(0),
          fileKey: string(),
          published: boolean().default(false),
          publishedAt: union([date(), string(), number()]).optional()
        })
      )
    }),
    handler: async ({ novelId, chaptersData }, { locals, cache }) => {
      await getAuthenticatedAdmin(locals);
      try {
        await db.delete(chapter$1).where(eq(chapter$1.novelId, novelId));
        await cache.invalidate({ tags: [`chapters:${novelId}`] });
      } catch (e) {
        const errorMsg = e instanceof Error ? e.message : String(e);
        throw new Error(`Failed to delete existing chapters: ${errorMsg}`);
      }
      const mappedData = chaptersData.map((c) => ({
        ...c,
        publishedAt: c.publishedAt ? new Date(c.publishedAt) : /* @__PURE__ */ new Date(),
        createdAt: /* @__PURE__ */ new Date(),
        updatedAt: /* @__PURE__ */ new Date()
      }));
      const BATCH_SIZE = 5;
      const allStatements = [];
      for (let i = 0; i < mappedData.length; i += BATCH_SIZE) {
        const batch = mappedData.slice(i, i + BATCH_SIZE);
        allStatements.push(
          db.insert(chapter$1).values(batch).onConflictDoNothing()
        );
      }
      if (allStatements.length > 0) {
        try {
          await db.batch(allStatements);
          await db.update(novel).set({
            chapterCount: chaptersData.length,
            updatedAt: /* @__PURE__ */ new Date()
          }).where(eq(novel.id, novelId));
        } catch (e) {
          const errorMsg = e instanceof Error ? e.message : String(e);
          throw new Error(`Database transaction failed: ${errorMsg}`);
        }
      }
    }
  }),
  // 递归删除 R2 存储桶中指定前缀下的所有对象
  deleteChapterFiles: defineAction({
    accept: "json",
    input: object({
      novelId: string()
    }),
    handler: async ({ novelId }, { locals }) => {
      await getAuthenticatedAdmin(locals);
      let deletedCount = 0;
      let continuationToken = void 0;
      const finalPrefix = `${novelId}/`;
      try {
        do {
          const listCommand = new ListObjectsV2Command({
            Bucket: R2_NOVELS_BUCKET,
            Prefix: finalPrefix,
            ContinuationToken: continuationToken
          });
          const listResponse = await R2.send(listCommand);
          const objects = listResponse.Contents;
          if (!objects || objects.length === 0) {
            break;
          }
          const deleteKeys = objects.map((obj) => ({ Key: obj.Key })).filter((key) => !!key.Key);
          if (deleteKeys.length === 0) {
            break;
          }
          const deleteCommand = new DeleteObjectsCommand({
            Bucket: R2_NOVELS_BUCKET,
            Delete: {
              Objects: deleteKeys,
              Quiet: true
            }
          });
          const deleteResponse = await R2.send(deleteCommand);
          if (deleteResponse.Errors && deleteResponse.Errors.length > 0) {
            console.error(
              "Batch deletion encountered errors:",
              deleteResponse.Errors
            );
            throw new Error(
              `Failed to delete some objects. First error: ${deleteResponse.Errors[0].Key} - ${deleteResponse.Errors[0].Code}`
            );
          }
          deletedCount += deleteKeys.length;
          continuationToken = listResponse.NextContinuationToken;
        } while (continuationToken);
        return { success: true, deletedCount };
      } catch (e) {
        const error = e instanceof Error ? e.message : "An unknown error occurred during R2 deletion.";
        console.error(`R2 Deletion failed for prefix ${finalPrefix}:`, error);
        throw new Error(error);
      }
    }
  }),
  // 获取小说章节
  getNovelChapters: defineAction({
    accept: "json",
    input: object({
      novelId: string(),
      page: number().min(1).default(1),
      pageSize: number().min(1).max(500).default(10)
    }),
    handler: async (input, { locals }) => {
      await getAuthenticatedAdmin(locals);
      const { novelId, page, pageSize } = input;
      try {
        const [chaptersData, totalCount] = await Promise.all([
          db.select().from(chapter$1).where(eq(chapter$1.novelId, novelId)).orderBy(asc(chapter$1.number)).limit(pageSize).offset((page - 1) * pageSize),
          db.select({ count: count() }).from(chapter$1).where(eq(chapter$1.novelId, novelId)).get()
        ]);
        return {
          chapters: chaptersData,
          totalCount: totalCount?.count || 0,
          error: null
        };
      } catch (e) {
        const errorMsg = e instanceof Error ? e.message : "Unknown error";
        return {
          chapters: [],
          totalCount: 0,
          error: `Failed to fetch chapters: ${errorMsg}`
        };
      }
    }
  }),
  // 更新章节状态
  updateChapterStatus: defineAction({
    accept: "json",
    input: object({
      chapterId: string(),
      published: boolean()
    }),
    handler: async ({ chapterId, published }, { locals }) => {
      await getAuthenticatedAdmin(locals);
      await db.update(chapter$1).set({ published, updatedAt: /* @__PURE__ */ new Date() }).where(eq(chapter$1.id, chapterId));
      return { success: true };
    }
  }),
  // 添加单个章节
  addChapter: defineAction({
    accept: "json",
    input: object({
      novelId: string(),
      number: number(),
      title: string(),
      wordCount: number().default(0),
      fileKey: string(),
      published: boolean().default(false),
      publishedAt: union([date(), string(), number()]).optional()
    }),
    handler: async (input, { locals }) => {
      await getAuthenticatedAdmin(locals);
      const { novelId, ...chapterData } = input;
      try {
        await db.insert(chapter$1).values({
          ...chapterData,
          novelId,
          publishedAt: chapterData.publishedAt ? new Date(chapterData.publishedAt) : /* @__PURE__ */ new Date(),
          createdAt: /* @__PURE__ */ new Date(),
          updatedAt: /* @__PURE__ */ new Date()
        });
        await db.update(novel).set({
          chapterCount: sql`${novel.chapterCount} + 1`,
          updatedAt: /* @__PURE__ */ new Date()
        }).where(eq(novel.id, novelId));
        return { success: true };
      } catch (e) {
        const errorMsg = e instanceof Error ? e.message : String(e);
        throw new Error(`Failed to add chapter: ${errorMsg}`);
      }
    }
  }),
  // 删除单个章节
  deleteChapter: defineAction({
    accept: "json",
    input: object({
      chapterId: string()
    }),
    handler: async ({ chapterId }, { locals, cache }) => {
      await getAuthenticatedAdmin(locals);
      const targetChapter = await db.select().from(chapter$1).where(eq(chapter$1.id, chapterId)).get();
      if (!targetChapter) {
        throw new Error("章节不存在");
      }
      await cache.invalidate({
        tags: [`chapter:${targetChapter.novelId}-${targetChapter.number}`]
      });
      if (targetChapter.fileKey) {
        await deleteSingleFile(targetChapter.fileKey, R2_NOVELS_BUCKET);
      }
      await db.delete(chapter$1).where(eq(chapter$1.id, chapterId));
      await db.update(novel).set({
        chapterCount: sql`${novel.chapterCount} - 1`,
        updatedAt: /* @__PURE__ */ new Date()
      }).where(eq(novel.id, targetChapter.novelId));
      return { success: true };
    }
  }),
  // 检查章节是否存在
  checkChapterExists: defineAction({
    accept: "json",
    input: object({
      novelId: string(),
      number: number()
    }),
    handler: async ({ novelId, number: number2 }, { locals }) => {
      await getAuthenticatedAdmin(locals);
      const existingChapter = await db.select({ id: chapter$1.id }).from(chapter$1).where(
        and(
          eq(chapter$1.novelId, novelId),
          eq(chapter$1.number, number2)
        )
      ).get();
      return { exists: !!existingChapter };
    }
  })
};
const server = {
  chapter,
  cover,
  novel: novelActions,
  chapterManagement
};
export {
  server
};
