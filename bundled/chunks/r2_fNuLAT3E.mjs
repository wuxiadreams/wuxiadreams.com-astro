globalThis.process ??= {};
globalThis.process.env ??= {};
import { env as env$1 } from "cloudflare:workers";
import * as https from "https";
import { sep, join } from "path";
import { homedir } from "os";
import { readFile as readFile$1 } from "node:fs/promises";
import { Duplex, Writable, Readable as Readable$1, PassThrough } from "stream";
import { Buffer as Buffer$1 } from "buffer";
import crypto$1, { createHmac, createHash } from "crypto";
import { Readable, Writable as Writable$1 } from "node:stream";
import { c as __awaiter, d as __generator, e as __values } from "./tslib.es6_BJr4Ywpw.mjs";
import { ReadStream, lstatSync, fstatSync } from "node:fs";
import { Agent, request } from "node:https";
import { platform, release } from "node:os";
import { versions, env } from "node:process";
import { normalize, sep as sep$1, join as join$1 } from "node:path";
import * as zlib from "node:zlib";
const getHttpHandlerExtensionConfiguration = (runtimeConfig) => {
  return {
    setHttpHandler(handler) {
      runtimeConfig.httpHandler = handler;
    },
    httpHandler() {
      return runtimeConfig.httpHandler;
    },
    updateHttpClientConfig(key, value) {
      runtimeConfig.httpHandler?.updateHttpClientConfig(key, value);
    },
    httpHandlerConfigs() {
      return runtimeConfig.httpHandler.httpHandlerConfigs();
    }
  };
};
const resolveHttpHandlerRuntimeConfig = (httpHandlerExtensionConfiguration) => {
  return {
    httpHandler: httpHandlerExtensionConfiguration.httpHandler()
  };
};
var EndpointURLScheme;
(function(EndpointURLScheme2) {
  EndpointURLScheme2["HTTP"] = "http";
  EndpointURLScheme2["HTTPS"] = "https";
})(EndpointURLScheme || (EndpointURLScheme = {}));
var AlgorithmId;
(function(AlgorithmId2) {
  AlgorithmId2["MD5"] = "md5";
  AlgorithmId2["CRC32"] = "crc32";
  AlgorithmId2["CRC32C"] = "crc32c";
  AlgorithmId2["SHA1"] = "sha1";
  AlgorithmId2["SHA256"] = "sha256";
})(AlgorithmId || (AlgorithmId = {}));
const SMITHY_CONTEXT_KEY = "__smithy_context";
var IniSectionType;
(function(IniSectionType2) {
  IniSectionType2["PROFILE"] = "profile";
  IniSectionType2["SSO_SESSION"] = "sso-session";
  IniSectionType2["SERVICES"] = "services";
})(IniSectionType || (IniSectionType = {}));
class HttpRequest {
  method;
  protocol;
  hostname;
  port;
  path;
  query;
  headers;
  username;
  password;
  fragment;
  body;
  constructor(options) {
    this.method = options.method || "GET";
    this.hostname = options.hostname || "localhost";
    this.port = options.port;
    this.query = options.query || {};
    this.headers = options.headers || {};
    this.body = options.body;
    this.protocol = options.protocol ? options.protocol.slice(-1) !== ":" ? `${options.protocol}:` : options.protocol : "https:";
    this.path = options.path ? options.path.charAt(0) !== "/" ? `/${options.path}` : options.path : "/";
    this.username = options.username;
    this.password = options.password;
    this.fragment = options.fragment;
  }
  static clone(request2) {
    const cloned = new HttpRequest({
      ...request2,
      headers: { ...request2.headers }
    });
    if (cloned.query) {
      cloned.query = cloneQuery(cloned.query);
    }
    return cloned;
  }
  static isInstance(request2) {
    if (!request2) {
      return false;
    }
    const req = request2;
    return "method" in req && "protocol" in req && "hostname" in req && "path" in req && typeof req["query"] === "object" && typeof req["headers"] === "object";
  }
  clone() {
    return HttpRequest.clone(this);
  }
}
function cloneQuery(query) {
  return Object.keys(query).reduce((carry, paramName) => {
    const param = query[paramName];
    return {
      ...carry,
      [paramName]: Array.isArray(param) ? [...param] : param
    };
  }, {});
}
class HttpResponse {
  statusCode;
  reason;
  headers;
  body;
  constructor(options) {
    this.statusCode = options.statusCode;
    this.reason = options.reason;
    this.headers = options.headers || {};
    this.body = options.body;
  }
  static isInstance(response) {
    if (!response)
      return false;
    const resp = response;
    return typeof resp.statusCode === "number" && typeof resp.headers === "object";
  }
}
function addExpectContinueMiddleware(options) {
  return (next) => async (args) => {
    const { request: request2 } = args;
    if (options.expectContinueHeader !== false && HttpRequest.isInstance(request2) && request2.body && options.runtime === "node" && options.requestHandler?.constructor?.name !== "FetchHttpHandler") {
      let sendHeader = true;
      if (typeof options.expectContinueHeader === "number") {
        try {
          const bodyLength = Number(request2.headers?.["content-length"]) ?? options.bodyLengthChecker?.(request2.body) ?? Infinity;
          sendHeader = bodyLength >= options.expectContinueHeader;
        } catch (e2) {
        }
      } else {
        sendHeader = !!options.expectContinueHeader;
      }
      if (sendHeader) {
        request2.headers.Expect = "100-continue";
      }
    }
    return next({
      ...args,
      request: request2
    });
  };
}
const addExpectContinueMiddlewareOptions = {
  step: "build",
  tags: ["SET_EXPECT_HEADER", "EXPECT_HEADER"],
  name: "addExpectContinueMiddleware",
  override: true
};
const getAddExpectContinuePlugin = (options) => ({
  applyToStack: (clientStack) => {
    clientStack.add(addExpectContinueMiddleware(options), addExpectContinueMiddlewareOptions);
  }
});
const RequestChecksumCalculation = {
  WHEN_SUPPORTED: "WHEN_SUPPORTED",
  WHEN_REQUIRED: "WHEN_REQUIRED"
};
const DEFAULT_REQUEST_CHECKSUM_CALCULATION = RequestChecksumCalculation.WHEN_SUPPORTED;
const ResponseChecksumValidation = {
  WHEN_SUPPORTED: "WHEN_SUPPORTED",
  WHEN_REQUIRED: "WHEN_REQUIRED"
};
const DEFAULT_RESPONSE_CHECKSUM_VALIDATION = RequestChecksumCalculation.WHEN_SUPPORTED;
var ChecksumAlgorithm;
(function(ChecksumAlgorithm2) {
  ChecksumAlgorithm2["MD5"] = "MD5";
  ChecksumAlgorithm2["CRC32"] = "CRC32";
  ChecksumAlgorithm2["CRC32C"] = "CRC32C";
  ChecksumAlgorithm2["CRC64NVME"] = "CRC64NVME";
  ChecksumAlgorithm2["SHA1"] = "SHA1";
  ChecksumAlgorithm2["SHA256"] = "SHA256";
})(ChecksumAlgorithm || (ChecksumAlgorithm = {}));
var ChecksumLocation;
(function(ChecksumLocation2) {
  ChecksumLocation2["HEADER"] = "header";
  ChecksumLocation2["TRAILER"] = "trailer";
})(ChecksumLocation || (ChecksumLocation = {}));
const DEFAULT_CHECKSUM_ALGORITHM = ChecksumAlgorithm.CRC32;
var SelectorType$1;
(function(SelectorType2) {
  SelectorType2["ENV"] = "env";
  SelectorType2["CONFIG"] = "shared config entry";
})(SelectorType$1 || (SelectorType$1 = {}));
const stringUnionSelector = (obj, key, union, type) => {
  if (!(key in obj))
    return void 0;
  const value = obj[key].toUpperCase();
  if (!Object.values(union).includes(value)) {
    throw new TypeError(`Cannot load ${type} '${key}'. Expected one of ${Object.values(union)}, got '${obj[key]}'.`);
  }
  return value;
};
const ENV_REQUEST_CHECKSUM_CALCULATION = "AWS_REQUEST_CHECKSUM_CALCULATION";
const CONFIG_REQUEST_CHECKSUM_CALCULATION = "request_checksum_calculation";
const NODE_REQUEST_CHECKSUM_CALCULATION_CONFIG_OPTIONS = {
  environmentVariableSelector: (env2) => stringUnionSelector(env2, ENV_REQUEST_CHECKSUM_CALCULATION, RequestChecksumCalculation, SelectorType$1.ENV),
  configFileSelector: (profile) => stringUnionSelector(profile, CONFIG_REQUEST_CHECKSUM_CALCULATION, RequestChecksumCalculation, SelectorType$1.CONFIG),
  default: DEFAULT_REQUEST_CHECKSUM_CALCULATION
};
const ENV_RESPONSE_CHECKSUM_VALIDATION = "AWS_RESPONSE_CHECKSUM_VALIDATION";
const CONFIG_RESPONSE_CHECKSUM_VALIDATION = "response_checksum_validation";
const NODE_RESPONSE_CHECKSUM_VALIDATION_CONFIG_OPTIONS = {
  environmentVariableSelector: (env2) => stringUnionSelector(env2, ENV_RESPONSE_CHECKSUM_VALIDATION, ResponseChecksumValidation, SelectorType$1.ENV),
  configFileSelector: (profile) => stringUnionSelector(profile, CONFIG_RESPONSE_CHECKSUM_VALIDATION, ResponseChecksumValidation, SelectorType$1.CONFIG),
  default: DEFAULT_RESPONSE_CHECKSUM_VALIDATION
};
const state = {
  warningEmitted: false
};
const emitWarningIfUnsupportedVersion$1 = (version2) => {
  if (version2 && !state.warningEmitted && parseInt(version2.substring(1, version2.indexOf("."))) < 20) {
    state.warningEmitted = true;
    process.emitWarning(`NodeDeprecationWarning: The AWS SDK for JavaScript (v3) will
no longer support Node.js ${version2} in January 2026.

To continue receiving updates to AWS services, bug fixes, and security
updates please upgrade to a supported Node.js LTS version.

More information can be found at: https://a.co/c895JFp`);
  }
};
function setCredentialFeature(credentials, feature, value) {
  if (!credentials.$source) {
    credentials.$source = {};
  }
  credentials.$source[feature] = value;
  return credentials;
}
function setFeature$1(context, feature, value) {
  if (!context.__aws_sdk_context) {
    context.__aws_sdk_context = {
      features: {}
    };
  } else if (!context.__aws_sdk_context.features) {
    context.__aws_sdk_context.features = {};
  }
  context.__aws_sdk_context.features[feature] = value;
}
const isArrayBuffer = (arg) => typeof ArrayBuffer === "function" && arg instanceof ArrayBuffer || Object.prototype.toString.call(arg) === "[object ArrayBuffer]";
const fromArrayBuffer = (input, offset = 0, length = input.byteLength - offset) => {
  if (!isArrayBuffer(input)) {
    throw new TypeError(`The "input" argument must be ArrayBuffer. Received type ${typeof input} (${input})`);
  }
  return Buffer$1.from(input, offset, length);
};
const fromString$1 = (input, encoding) => {
  if (typeof input !== "string") {
    throw new TypeError(`The "input" argument must be of type string. Received type ${typeof input} (${input})`);
  }
  return encoding ? Buffer$1.from(input, encoding) : Buffer$1.from(input);
};
const BASE64_REGEX = /^[A-Za-z0-9+/]*={0,2}$/;
const fromBase64 = (input) => {
  if (input.length * 3 % 4 !== 0) {
    throw new TypeError(`Incorrect padding on base64 string.`);
  }
  if (!BASE64_REGEX.exec(input)) {
    throw new TypeError(`Invalid base64 string.`);
  }
  const buffer = fromString$1(input, "base64");
  return new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength);
};
const fromUtf8$2 = (input) => {
  const buf = fromString$1(input, "utf8");
  return new Uint8Array(buf.buffer, buf.byteOffset, buf.byteLength / Uint8Array.BYTES_PER_ELEMENT);
};
const toUint8Array = (data) => {
  if (typeof data === "string") {
    return fromUtf8$2(data);
  }
  if (ArrayBuffer.isView(data)) {
    return new Uint8Array(data.buffer, data.byteOffset, data.byteLength / Uint8Array.BYTES_PER_ELEMENT);
  }
  return new Uint8Array(data);
};
const toUtf8 = (input) => {
  if (typeof input === "string") {
    return input;
  }
  if (typeof input !== "object" || typeof input.byteOffset !== "number" || typeof input.byteLength !== "number") {
    throw new Error("@smithy/util-utf8: toUtf8 encoder function only accepts string | Uint8Array.");
  }
  return fromArrayBuffer(input.buffer, input.byteOffset, input.byteLength).toString("utf8");
};
const toBase64 = (_input) => {
  let input;
  if (typeof _input === "string") {
    input = fromUtf8$2(_input);
  } else {
    input = _input;
  }
  if (typeof input !== "object" || typeof input.byteOffset !== "number" || typeof input.byteLength !== "number") {
    throw new Error("@smithy/util-base64: toBase64 encoder function only accepts string | Uint8Array.");
  }
  return fromArrayBuffer(input.buffer, input.byteOffset, input.byteLength).toString("base64");
};
class Uint8ArrayBlobAdapter extends Uint8Array {
  static fromString(source, encoding = "utf-8") {
    if (typeof source === "string") {
      if (encoding === "base64") {
        return Uint8ArrayBlobAdapter.mutate(fromBase64(source));
      }
      return Uint8ArrayBlobAdapter.mutate(fromUtf8$2(source));
    }
    throw new Error(`Unsupported conversion from ${typeof source} to Uint8ArrayBlobAdapter.`);
  }
  static mutate(source) {
    Object.setPrototypeOf(source, Uint8ArrayBlobAdapter.prototype);
    return source;
  }
  transformToString(encoding = "utf-8") {
    if (encoding === "base64") {
      return toBase64(this);
    }
    return toUtf8(this);
  }
}
let ChecksumStream$1 = class ChecksumStream extends Duplex {
  expectedChecksum;
  checksumSourceLocation;
  checksum;
  source;
  base64Encoder;
  pendingCallback = null;
  constructor({ expectedChecksum, checksum, source, checksumSourceLocation, base64Encoder }) {
    super();
    if (typeof source.pipe === "function") {
      this.source = source;
    } else {
      throw new Error(`@smithy/util-stream: unsupported source type ${source?.constructor?.name ?? source} in ChecksumStream.`);
    }
    this.base64Encoder = base64Encoder ?? toBase64;
    this.expectedChecksum = expectedChecksum;
    this.checksum = checksum;
    this.checksumSourceLocation = checksumSourceLocation;
    this.source.pipe(this);
  }
  _read(size) {
    if (this.pendingCallback) {
      const callback = this.pendingCallback;
      this.pendingCallback = null;
      callback();
    }
  }
  _write(chunk, encoding, callback) {
    try {
      this.checksum.update(chunk);
      const canPushMore = this.push(chunk);
      if (!canPushMore) {
        this.pendingCallback = callback;
        return;
      }
    } catch (e2) {
      return callback(e2);
    }
    return callback();
  }
  async _final(callback) {
    try {
      const digest = await this.checksum.digest();
      const received = this.base64Encoder(digest);
      if (this.expectedChecksum !== received) {
        return callback(new Error(`Checksum mismatch: expected "${this.expectedChecksum}" but received "${received}" in response header "${this.checksumSourceLocation}".`));
      }
    } catch (e2) {
      return callback(e2);
    }
    this.push(null);
    return callback();
  }
};
const isReadableStream = (stream) => typeof ReadableStream === "function" && (stream?.constructor?.name === ReadableStream.name || stream instanceof ReadableStream);
const isBlob = (blob) => {
  return typeof Blob === "function" && (blob?.constructor?.name === Blob.name || blob instanceof Blob);
};
const ReadableStreamRef = typeof ReadableStream === "function" ? ReadableStream : function() {
};
class ChecksumStream2 extends ReadableStreamRef {
}
const createChecksumStream$1 = ({ expectedChecksum, checksum, source, checksumSourceLocation, base64Encoder }) => {
  if (!isReadableStream(source)) {
    throw new Error(`@smithy/util-stream: unsupported source type ${source?.constructor?.name ?? source} in ChecksumStream.`);
  }
  const encoder = base64Encoder ?? toBase64;
  if (typeof TransformStream !== "function") {
    throw new Error("@smithy/util-stream: unable to instantiate ChecksumStream because API unavailable: ReadableStream/TransformStream.");
  }
  const transform = new TransformStream({
    start() {
    },
    async transform(chunk, controller) {
      checksum.update(chunk);
      controller.enqueue(chunk);
    },
    async flush(controller) {
      const digest = await checksum.digest();
      const received = encoder(digest);
      if (expectedChecksum !== received) {
        const error = new Error(`Checksum mismatch: expected "${expectedChecksum}" but received "${received}" in response header "${checksumSourceLocation}".`);
        controller.error(error);
      } else {
        controller.terminate();
      }
    }
  });
  source.pipeThrough(transform);
  const readable = transform.readable;
  Object.setPrototypeOf(readable, ChecksumStream2.prototype);
  return readable;
};
function createChecksumStream(init) {
  if (typeof ReadableStream === "function" && isReadableStream(init.source)) {
    return createChecksumStream$1(init);
  }
  return new ChecksumStream$1(init);
}
class ByteArrayCollector {
  allocByteArray;
  byteLength = 0;
  byteArrays = [];
  constructor(allocByteArray) {
    this.allocByteArray = allocByteArray;
  }
  push(byteArray) {
    this.byteArrays.push(byteArray);
    this.byteLength += byteArray.byteLength;
  }
  flush() {
    if (this.byteArrays.length === 1) {
      const bytes = this.byteArrays[0];
      this.reset();
      return bytes;
    }
    const aggregation = this.allocByteArray(this.byteLength);
    let cursor = 0;
    for (let i2 = 0; i2 < this.byteArrays.length; ++i2) {
      const bytes = this.byteArrays[i2];
      aggregation.set(bytes, cursor);
      cursor += bytes.byteLength;
    }
    this.reset();
    return aggregation;
  }
  reset() {
    this.byteArrays = [];
    this.byteLength = 0;
  }
}
function createBufferedReadableStream(upstream, size, logger2) {
  const reader = upstream.getReader();
  let streamBufferingLoggedWarning = false;
  let bytesSeen = 0;
  const buffers = ["", new ByteArrayCollector((size2) => new Uint8Array(size2))];
  let mode = -1;
  const pull = async (controller) => {
    const { value, done } = await reader.read();
    const chunk = value;
    if (done) {
      if (mode !== -1) {
        const remainder = flush(buffers, mode);
        if (sizeOf(remainder) > 0) {
          controller.enqueue(remainder);
        }
      }
      controller.close();
    } else {
      const chunkMode = modeOf(chunk, false);
      if (mode !== chunkMode) {
        if (mode >= 0) {
          controller.enqueue(flush(buffers, mode));
        }
        mode = chunkMode;
      }
      if (mode === -1) {
        controller.enqueue(chunk);
        return;
      }
      const chunkSize = sizeOf(chunk);
      bytesSeen += chunkSize;
      const bufferSize = sizeOf(buffers[mode]);
      if (chunkSize >= size && bufferSize === 0) {
        controller.enqueue(chunk);
      } else {
        const newSize = merge(buffers, mode, chunk);
        if (!streamBufferingLoggedWarning && bytesSeen > size * 2) {
          streamBufferingLoggedWarning = true;
          logger2?.warn(`@smithy/util-stream - stream chunk size ${chunkSize} is below threshold of ${size}, automatically buffering.`);
        }
        if (newSize >= size) {
          controller.enqueue(flush(buffers, mode));
        } else {
          await pull(controller);
        }
      }
    }
  };
  return new ReadableStream({
    pull
  });
}
function merge(buffers, mode, chunk) {
  switch (mode) {
    case 0:
      buffers[0] += chunk;
      return sizeOf(buffers[0]);
    case 1:
    case 2:
      buffers[mode].push(chunk);
      return sizeOf(buffers[mode]);
  }
}
function flush(buffers, mode) {
  switch (mode) {
    case 0:
      const s2 = buffers[0];
      buffers[0] = "";
      return s2;
    case 1:
    case 2:
      return buffers[mode].flush();
  }
  throw new Error(`@smithy/util-stream - invalid index ${mode} given to flush()`);
}
function sizeOf(chunk) {
  return chunk?.byteLength ?? chunk?.length ?? 0;
}
function modeOf(chunk, allowBuffer = true) {
  if (allowBuffer && typeof Buffer !== "undefined" && chunk instanceof Buffer) {
    return 2;
  }
  if (chunk instanceof Uint8Array) {
    return 1;
  }
  if (typeof chunk === "string") {
    return 0;
  }
  return -1;
}
function createBufferedReadable(upstream, size, logger2) {
  if (isReadableStream(upstream)) {
    return createBufferedReadableStream(upstream, size, logger2);
  }
  const downstream = new Readable({ read() {
  } });
  let streamBufferingLoggedWarning = false;
  let bytesSeen = 0;
  const buffers = [
    "",
    new ByteArrayCollector((size2) => new Uint8Array(size2)),
    new ByteArrayCollector((size2) => Buffer.from(new Uint8Array(size2)))
  ];
  let mode = -1;
  upstream.on("data", (chunk) => {
    const chunkMode = modeOf(chunk, true);
    if (mode !== chunkMode) {
      if (mode >= 0) {
        downstream.push(flush(buffers, mode));
      }
      mode = chunkMode;
    }
    if (mode === -1) {
      downstream.push(chunk);
      return;
    }
    const chunkSize = sizeOf(chunk);
    bytesSeen += chunkSize;
    const bufferSize = sizeOf(buffers[mode]);
    if (chunkSize >= size && bufferSize === 0) {
      downstream.push(chunk);
    } else {
      const newSize = merge(buffers, mode, chunk);
      if (!streamBufferingLoggedWarning && bytesSeen > size * 2) {
        streamBufferingLoggedWarning = true;
        logger2?.warn(`@smithy/util-stream - stream chunk size ${chunkSize} is below threshold of ${size}, automatically buffering.`);
      }
      if (newSize >= size) {
        downstream.push(flush(buffers, mode));
      }
    }
  });
  upstream.on("end", () => {
    if (mode !== -1) {
      const remainder = flush(buffers, mode);
      if (sizeOf(remainder) > 0) {
        downstream.push(remainder);
      }
    }
    downstream.push(null);
  });
  return downstream;
}
const getAwsChunkedEncodingStream$1 = (readableStream, options) => {
  const { base64Encoder, bodyLengthChecker, checksumAlgorithmFn, checksumLocationName, streamHasher } = options;
  const checksumRequired = base64Encoder !== void 0 && bodyLengthChecker !== void 0 && checksumAlgorithmFn !== void 0 && checksumLocationName !== void 0 && streamHasher !== void 0;
  const digest = checksumRequired ? streamHasher(checksumAlgorithmFn, readableStream) : void 0;
  const reader = readableStream.getReader();
  return new ReadableStream({
    async pull(controller) {
      const { value, done } = await reader.read();
      if (done) {
        controller.enqueue(`0\r
`);
        if (checksumRequired) {
          const checksum = base64Encoder(await digest);
          controller.enqueue(`${checksumLocationName}:${checksum}\r
`);
          controller.enqueue(`\r
`);
        }
        controller.close();
      } else {
        controller.enqueue(`${(bodyLengthChecker(value) || 0).toString(16)}\r
${value}\r
`);
      }
    }
  });
};
function getAwsChunkedEncodingStream(stream, options) {
  const readable = stream;
  const readableStream = stream;
  if (isReadableStream(readableStream)) {
    return getAwsChunkedEncodingStream$1(readableStream, options);
  }
  const { base64Encoder, bodyLengthChecker, checksumAlgorithmFn, checksumLocationName, streamHasher } = options;
  const checksumRequired = base64Encoder !== void 0 && checksumAlgorithmFn !== void 0 && checksumLocationName !== void 0 && streamHasher !== void 0;
  const digest = checksumRequired ? streamHasher(checksumAlgorithmFn, readable) : void 0;
  const awsChunkedEncodingStream = new Readable({
    read: () => {
    }
  });
  readable.on("data", (data) => {
    const length = bodyLengthChecker(data) || 0;
    if (length === 0) {
      return;
    }
    awsChunkedEncodingStream.push(`${length.toString(16)}\r
`);
    awsChunkedEncodingStream.push(data);
    awsChunkedEncodingStream.push("\r\n");
  });
  readable.on("end", async () => {
    awsChunkedEncodingStream.push(`0\r
`);
    if (checksumRequired) {
      const checksum = base64Encoder(await digest);
      awsChunkedEncodingStream.push(`${checksumLocationName}:${checksum}\r
`);
      awsChunkedEncodingStream.push(`\r
`);
    }
    awsChunkedEncodingStream.push(null);
  });
  return awsChunkedEncodingStream;
}
async function headStream$1(stream, bytes) {
  let byteLengthCounter = 0;
  const chunks = [];
  const reader = stream.getReader();
  let isDone = false;
  while (!isDone) {
    const { done, value } = await reader.read();
    if (value) {
      chunks.push(value);
      byteLengthCounter += value?.byteLength ?? 0;
    }
    if (byteLengthCounter >= bytes) {
      break;
    }
    isDone = done;
  }
  reader.releaseLock();
  const collected = new Uint8Array(Math.min(bytes, byteLengthCounter));
  let offset = 0;
  for (const chunk of chunks) {
    if (chunk.byteLength > collected.byteLength - offset) {
      collected.set(chunk.subarray(0, collected.byteLength - offset), offset);
      break;
    } else {
      collected.set(chunk, offset);
    }
    offset += chunk.length;
  }
  return collected;
}
const headStream = (stream, bytes) => {
  if (isReadableStream(stream)) {
    return headStream$1(stream, bytes);
  }
  return new Promise((resolve, reject) => {
    const collector = new Collector$1();
    collector.limit = bytes;
    stream.pipe(collector);
    stream.on("error", (err) => {
      collector.end();
      reject(err);
    });
    collector.on("error", reject);
    collector.on("finish", function() {
      const bytes2 = new Uint8Array(Buffer.concat(this.buffers));
      resolve(bytes2);
    });
  });
};
let Collector$1 = class Collector extends Writable {
  buffers = [];
  limit = Infinity;
  bytesBuffered = 0;
  _write(chunk, encoding, callback) {
    this.buffers.push(chunk);
    this.bytesBuffered += chunk.byteLength ?? 0;
    if (this.bytesBuffered >= this.limit) {
      const excess = this.bytesBuffered - this.limit;
      const tailBuffer = this.buffers[this.buffers.length - 1];
      this.buffers[this.buffers.length - 1] = tailBuffer.subarray(0, tailBuffer.byteLength - excess);
      this.emit("finish");
    }
    callback();
  }
};
const escapeUri = (uri) => encodeURIComponent(uri).replace(/[!'()*]/g, hexEncode);
const hexEncode = (c2) => `%${c2.charCodeAt(0).toString(16).toUpperCase()}`;
function buildQueryString(query) {
  const parts = [];
  for (let key of Object.keys(query).sort()) {
    const value = query[key];
    key = escapeUri(key);
    if (Array.isArray(value)) {
      for (let i2 = 0, iLen = value.length; i2 < iLen; i2++) {
        parts.push(`${key}=${escapeUri(value[i2])}`);
      }
    } else {
      let qsEntry = key;
      if (value || typeof value === "string") {
        qsEntry += `=${escapeUri(value)}`;
      }
      parts.push(qsEntry);
    }
  }
  return parts.join("&");
}
function buildAbortError(abortSignal) {
  const reason = abortSignal && typeof abortSignal === "object" && "reason" in abortSignal ? abortSignal.reason : void 0;
  if (reason) {
    if (reason instanceof Error) {
      const abortError3 = new Error("Request aborted");
      abortError3.name = "AbortError";
      abortError3.cause = reason;
      return abortError3;
    }
    const abortError2 = new Error(String(reason));
    abortError2.name = "AbortError";
    return abortError2;
  }
  const abortError = new Error("Request aborted");
  abortError.name = "AbortError";
  return abortError;
}
const NODEJS_TIMEOUT_ERROR_CODES$1 = ["ECONNRESET", "EPIPE", "ETIMEDOUT"];
const getTransformedHeaders = (headers) => {
  const transformedHeaders = {};
  for (const name of Object.keys(headers)) {
    const headerValues = headers[name];
    transformedHeaders[name] = Array.isArray(headerValues) ? headerValues.join(",") : headerValues;
  }
  return transformedHeaders;
};
const timing = {
  setTimeout: (cb2, ms) => setTimeout(cb2, ms),
  clearTimeout: (timeoutId) => clearTimeout(timeoutId)
};
const DEFER_EVENT_LISTENER_TIME$2 = 1e3;
const setConnectionTimeout = (request2, reject, timeoutInMs = 0) => {
  if (!timeoutInMs) {
    return -1;
  }
  const registerTimeout = (offset) => {
    const timeoutId = timing.setTimeout(() => {
      request2.destroy();
      reject(Object.assign(new Error(`@smithy/node-http-handler - the request socket did not establish a connection with the server within the configured timeout of ${timeoutInMs} ms.`), {
        name: "TimeoutError"
      }));
    }, timeoutInMs - offset);
    const doWithSocket = (socket) => {
      if (socket?.connecting) {
        socket.on("connect", () => {
          timing.clearTimeout(timeoutId);
        });
      } else {
        timing.clearTimeout(timeoutId);
      }
    };
    if (request2.socket) {
      doWithSocket(request2.socket);
    } else {
      request2.on("socket", doWithSocket);
    }
  };
  if (timeoutInMs < 2e3) {
    registerTimeout(0);
    return 0;
  }
  return timing.setTimeout(registerTimeout.bind(null, DEFER_EVENT_LISTENER_TIME$2), DEFER_EVENT_LISTENER_TIME$2);
};
const setRequestTimeout = (req, reject, timeoutInMs = 0, throwOnRequestTimeout, logger2) => {
  if (timeoutInMs) {
    return timing.setTimeout(() => {
      let msg = `@smithy/node-http-handler - [${throwOnRequestTimeout ? "ERROR" : "WARN"}] a request has exceeded the configured ${timeoutInMs} ms requestTimeout.`;
      if (throwOnRequestTimeout) {
        const error = Object.assign(new Error(msg), {
          name: "TimeoutError",
          code: "ETIMEDOUT"
        });
        req.destroy(error);
        reject(error);
      } else {
        msg += ` Init client requestHandler with throwOnRequestTimeout=true to turn this into an error.`;
        logger2?.warn?.(msg);
      }
    }, timeoutInMs);
  }
  return -1;
};
const DEFER_EVENT_LISTENER_TIME$1 = 3e3;
const setSocketKeepAlive = (request2, { keepAlive, keepAliveMsecs }, deferTimeMs = DEFER_EVENT_LISTENER_TIME$1) => {
  if (keepAlive !== true) {
    return -1;
  }
  const registerListener = () => {
    if (request2.socket) {
      request2.socket.setKeepAlive(keepAlive, keepAliveMsecs || 0);
    } else {
      request2.on("socket", (socket) => {
        socket.setKeepAlive(keepAlive, keepAliveMsecs || 0);
      });
    }
  };
  if (deferTimeMs === 0) {
    registerListener();
    return 0;
  }
  return timing.setTimeout(registerListener, deferTimeMs);
};
const DEFER_EVENT_LISTENER_TIME = 3e3;
const setSocketTimeout = (request2, reject, timeoutInMs = 0) => {
  const registerTimeout = (offset) => {
    const timeout = timeoutInMs - offset;
    const onTimeout = () => {
      request2.destroy();
      reject(Object.assign(new Error(`@smithy/node-http-handler - the request socket timed out after ${timeoutInMs} ms of inactivity (configured by client requestHandler).`), { name: "TimeoutError" }));
    };
    if (request2.socket) {
      request2.socket.setTimeout(timeout, onTimeout);
      request2.on("close", () => request2.socket?.removeListener("timeout", onTimeout));
    } else {
      request2.setTimeout(timeout, onTimeout);
    }
  };
  if (0 < timeoutInMs && timeoutInMs < 6e3) {
    registerTimeout(0);
    return 0;
  }
  return timing.setTimeout(registerTimeout.bind(null, timeoutInMs === 0 ? 0 : DEFER_EVENT_LISTENER_TIME), DEFER_EVENT_LISTENER_TIME);
};
const MIN_WAIT_TIME = 6e3;
async function writeRequestBody(httpRequest, request2, maxContinueTimeoutMs = MIN_WAIT_TIME, externalAgent = false) {
  const headers = request2.headers ?? {};
  const expect = headers.Expect || headers.expect;
  let timeoutId = -1;
  let sendBody = true;
  if (!externalAgent && expect === "100-continue") {
    sendBody = await Promise.race([
      new Promise((resolve) => {
        timeoutId = Number(timing.setTimeout(() => resolve(true), Math.max(MIN_WAIT_TIME, maxContinueTimeoutMs)));
      }),
      new Promise((resolve) => {
        httpRequest.on("continue", () => {
          timing.clearTimeout(timeoutId);
          resolve(true);
        });
        httpRequest.on("response", () => {
          timing.clearTimeout(timeoutId);
          resolve(false);
        });
        httpRequest.on("error", () => {
          timing.clearTimeout(timeoutId);
          resolve(false);
        });
      })
    ]);
  }
  if (sendBody) {
    writeBody(httpRequest, request2.body);
  }
}
function writeBody(httpRequest, body) {
  if (body instanceof Readable) {
    body.pipe(httpRequest);
    return;
  }
  if (body) {
    const isBuffer = Buffer.isBuffer(body);
    const isString = typeof body === "string";
    if (isBuffer || isString) {
      if (isBuffer && body.byteLength === 0) {
        httpRequest.end();
      } else {
        httpRequest.end(body);
      }
      return;
    }
    const uint8 = body;
    if (typeof uint8 === "object" && uint8.buffer && typeof uint8.byteOffset === "number" && typeof uint8.byteLength === "number") {
      httpRequest.end(Buffer.from(uint8.buffer, uint8.byteOffset, uint8.byteLength));
      return;
    }
    httpRequest.end(Buffer.from(body));
    return;
  }
  httpRequest.end();
}
let hAgent = void 0;
let hRequest = void 0;
class NodeHttpHandler {
  config;
  configProvider;
  socketWarningTimestamp = 0;
  externalAgent = false;
  metadata = { handlerProtocol: "http/1.1" };
  static create(instanceOrOptions) {
    if (typeof instanceOrOptions?.handle === "function") {
      return instanceOrOptions;
    }
    return new NodeHttpHandler(instanceOrOptions);
  }
  static checkSocketUsage(agent2, socketWarningTimestamp, logger2 = console) {
    const { sockets, requests, maxSockets } = agent2;
    if (typeof maxSockets !== "number" || maxSockets === Infinity) {
      return socketWarningTimestamp;
    }
    const interval = 15e3;
    if (Date.now() - interval < socketWarningTimestamp) {
      return socketWarningTimestamp;
    }
    if (sockets && requests) {
      for (const origin in sockets) {
        const socketsInUse = sockets[origin]?.length ?? 0;
        const requestsEnqueued = requests[origin]?.length ?? 0;
        if (socketsInUse >= maxSockets && requestsEnqueued >= 2 * maxSockets) {
          logger2?.warn?.(`@smithy/node-http-handler:WARN - socket usage at capacity=${socketsInUse} and ${requestsEnqueued} additional requests are enqueued.
See https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/node-configuring-maxsockets.html
or increase socketAcquisitionWarningTimeout=(millis) in the NodeHttpHandler config.`);
          return Date.now();
        }
      }
    }
    return socketWarningTimestamp;
  }
  constructor(options) {
    this.configProvider = new Promise((resolve, reject) => {
      if (typeof options === "function") {
        options().then((_options) => {
          resolve(this.resolveDefaultConfig(_options));
        }).catch(reject);
      } else {
        resolve(this.resolveDefaultConfig(options));
      }
    });
  }
  destroy() {
    this.config?.httpAgent?.destroy();
    this.config?.httpsAgent?.destroy();
  }
  async handle(request$1, { abortSignal, requestTimeout } = {}) {
    if (!this.config) {
      this.config = await this.configProvider;
    }
    const config = this.config;
    const isSSL = request$1.protocol === "https:";
    if (!isSSL && !this.config.httpAgent) {
      this.config.httpAgent = await this.config.httpAgentProvider();
    }
    return new Promise((_resolve, _reject) => {
      let writeRequestBodyPromise = void 0;
      const timeouts = [];
      const resolve = async (arg) => {
        await writeRequestBodyPromise;
        timeouts.forEach(timing.clearTimeout);
        _resolve(arg);
      };
      const reject = async (arg) => {
        await writeRequestBodyPromise;
        timeouts.forEach(timing.clearTimeout);
        _reject(arg);
      };
      if (abortSignal?.aborted) {
        const abortError = buildAbortError(abortSignal);
        reject(abortError);
        return;
      }
      const headers = request$1.headers ?? {};
      const expectContinue = (headers.Expect ?? headers.expect) === "100-continue";
      let agent2 = isSSL ? config.httpsAgent : config.httpAgent;
      if (expectContinue && !this.externalAgent) {
        agent2 = new (isSSL ? Agent : hAgent)({
          keepAlive: false,
          maxSockets: Infinity
        });
      }
      timeouts.push(timing.setTimeout(() => {
        this.socketWarningTimestamp = NodeHttpHandler.checkSocketUsage(agent2, this.socketWarningTimestamp, config.logger);
      }, config.socketAcquisitionWarningTimeout ?? (config.requestTimeout ?? 2e3) + (config.connectionTimeout ?? 1e3)));
      const queryString = buildQueryString(request$1.query || {});
      let auth = void 0;
      if (request$1.username != null || request$1.password != null) {
        const username = request$1.username ?? "";
        const password = request$1.password ?? "";
        auth = `${username}:${password}`;
      }
      let path = request$1.path;
      if (queryString) {
        path += `?${queryString}`;
      }
      if (request$1.fragment) {
        path += `#${request$1.fragment}`;
      }
      let hostname = request$1.hostname ?? "";
      if (hostname[0] === "[" && hostname.endsWith("]")) {
        hostname = request$1.hostname.slice(1, -1);
      } else {
        hostname = request$1.hostname;
      }
      const nodeHttpsOptions = {
        headers: request$1.headers,
        host: hostname,
        method: request$1.method,
        path,
        port: request$1.port,
        agent: agent2,
        auth
      };
      const requestFunc = isSSL ? request : hRequest;
      const req = requestFunc(nodeHttpsOptions, (res) => {
        const httpResponse = new HttpResponse({
          statusCode: res.statusCode || -1,
          reason: res.statusMessage,
          headers: getTransformedHeaders(res.headers),
          body: res
        });
        resolve({ response: httpResponse });
      });
      req.on("error", (err) => {
        if (NODEJS_TIMEOUT_ERROR_CODES$1.includes(err.code)) {
          reject(Object.assign(err, { name: "TimeoutError" }));
        } else {
          reject(err);
        }
      });
      if (abortSignal) {
        const onAbort = () => {
          req.destroy();
          const abortError = buildAbortError(abortSignal);
          reject(abortError);
        };
        if (typeof abortSignal.addEventListener === "function") {
          const signal = abortSignal;
          signal.addEventListener("abort", onAbort, { once: true });
          req.once("close", () => signal.removeEventListener("abort", onAbort));
        } else {
          abortSignal.onabort = onAbort;
        }
      }
      const effectiveRequestTimeout = requestTimeout ?? config.requestTimeout;
      timeouts.push(setConnectionTimeout(req, reject, config.connectionTimeout));
      timeouts.push(setRequestTimeout(req, reject, effectiveRequestTimeout, config.throwOnRequestTimeout, config.logger ?? console));
      timeouts.push(setSocketTimeout(req, reject, config.socketTimeout));
      const httpAgent = nodeHttpsOptions.agent;
      if (typeof httpAgent === "object" && "keepAlive" in httpAgent) {
        timeouts.push(setSocketKeepAlive(req, {
          keepAlive: httpAgent.keepAlive,
          keepAliveMsecs: httpAgent.keepAliveMsecs
        }));
      }
      writeRequestBodyPromise = writeRequestBody(req, request$1, effectiveRequestTimeout, this.externalAgent).catch((e2) => {
        timeouts.forEach(timing.clearTimeout);
        return _reject(e2);
      });
    });
  }
  updateHttpClientConfig(key, value) {
    this.config = void 0;
    this.configProvider = this.configProvider.then((config) => {
      return {
        ...config,
        [key]: value
      };
    });
  }
  httpHandlerConfigs() {
    return this.config ?? {};
  }
  resolveDefaultConfig(options) {
    const { requestTimeout, connectionTimeout, socketTimeout, socketAcquisitionWarningTimeout, httpAgent, httpsAgent, throwOnRequestTimeout, logger: logger2 } = options || {};
    const keepAlive = true;
    const maxSockets = 50;
    return {
      connectionTimeout,
      requestTimeout,
      socketTimeout,
      socketAcquisitionWarningTimeout,
      throwOnRequestTimeout,
      httpAgentProvider: async () => {
        const { Agent: Agent2, request: request2 } = await import("node:http");
        hRequest = request2;
        hAgent = Agent2;
        if (httpAgent instanceof hAgent || typeof httpAgent?.destroy === "function") {
          this.externalAgent = true;
          return httpAgent;
        }
        return new hAgent({ keepAlive, maxSockets, ...httpAgent });
      },
      httpsAgent: (() => {
        if (httpsAgent instanceof Agent || typeof httpsAgent?.destroy === "function") {
          this.externalAgent = true;
          return httpsAgent;
        }
        return new Agent({ keepAlive, maxSockets, ...httpsAgent });
      })(),
      logger: logger2
    };
  }
}
class Collector2 extends Writable$1 {
  bufferedBytes = [];
  _write(chunk, encoding, callback) {
    this.bufferedBytes.push(chunk);
    callback();
  }
}
const streamCollector$1 = (stream) => {
  if (isReadableStreamInstance(stream)) {
    return collectReadableStream(stream);
  }
  return new Promise((resolve, reject) => {
    const collector = new Collector2();
    stream.pipe(collector);
    stream.on("error", (err) => {
      collector.end();
      reject(err);
    });
    collector.on("error", reject);
    collector.on("finish", function() {
      const bytes = new Uint8Array(Buffer.concat(this.bufferedBytes));
      resolve(bytes);
    });
  });
};
const isReadableStreamInstance = (stream) => typeof ReadableStream === "function" && stream instanceof ReadableStream;
async function collectReadableStream(stream) {
  const chunks = [];
  const reader = stream.getReader();
  let isDone = false;
  let length = 0;
  while (!isDone) {
    const { done, value } = await reader.read();
    if (value) {
      chunks.push(value);
      length += value.length;
    }
    isDone = done;
  }
  const collected = new Uint8Array(length);
  let offset = 0;
  for (const chunk of chunks) {
    collected.set(chunk, offset);
    offset += chunk.length;
  }
  return collected;
}
const streamCollector = async (stream) => {
  if (typeof Blob === "function" && stream instanceof Blob || stream.constructor?.name === "Blob") {
    if (Blob.prototype.arrayBuffer !== void 0) {
      return new Uint8Array(await stream.arrayBuffer());
    }
    return collectBlob(stream);
  }
  return collectStream(stream);
};
async function collectBlob(blob) {
  const base64 = await readToBase64(blob);
  const arrayBuffer = fromBase64(base64);
  return new Uint8Array(arrayBuffer);
}
async function collectStream(stream) {
  const chunks = [];
  const reader = stream.getReader();
  let isDone = false;
  let length = 0;
  while (!isDone) {
    const { done, value } = await reader.read();
    if (value) {
      chunks.push(value);
      length += value.length;
    }
    isDone = done;
  }
  const collected = new Uint8Array(length);
  let offset = 0;
  for (const chunk of chunks) {
    collected.set(chunk, offset);
    offset += chunk.length;
  }
  return collected;
}
function readToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (reader.readyState !== 2) {
        return reject(new Error("Reader aborted too early"));
      }
      const result = reader.result ?? "";
      const commaIndex = result.indexOf(",");
      const dataOffset = commaIndex > -1 ? commaIndex + 1 : result.length;
      resolve(result.substring(dataOffset));
    };
    reader.onabort = () => reject(new Error("Read aborted"));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}
const SHORT_TO_HEX = {};
const HEX_TO_SHORT = {};
for (let i2 = 0; i2 < 256; i2++) {
  let encodedByte = i2.toString(16).toLowerCase();
  if (encodedByte.length === 1) {
    encodedByte = `0${encodedByte}`;
  }
  SHORT_TO_HEX[i2] = encodedByte;
  HEX_TO_SHORT[encodedByte] = i2;
}
function fromHex(encoded) {
  if (encoded.length % 2 !== 0) {
    throw new Error("Hex encoded strings must have an even number length");
  }
  const out = new Uint8Array(encoded.length / 2);
  for (let i2 = 0; i2 < encoded.length; i2 += 2) {
    const encodedByte = encoded.slice(i2, i2 + 2).toLowerCase();
    if (encodedByte in HEX_TO_SHORT) {
      out[i2 / 2] = HEX_TO_SHORT[encodedByte];
    } else {
      throw new Error(`Cannot decode unrecognized sequence ${encodedByte} as hexadecimal`);
    }
  }
  return out;
}
function toHex(bytes) {
  let out = "";
  for (let i2 = 0; i2 < bytes.byteLength; i2++) {
    out += SHORT_TO_HEX[bytes[i2]];
  }
  return out;
}
const ERR_MSG_STREAM_HAS_BEEN_TRANSFORMED$1 = "The stream has already been transformed.";
const sdkStreamMixin$1 = (stream) => {
  if (!isBlobInstance(stream) && !isReadableStream(stream)) {
    const name = stream?.__proto__?.constructor?.name || stream;
    throw new Error(`Unexpected stream implementation, expect Blob or ReadableStream, got ${name}`);
  }
  let transformed = false;
  const transformToByteArray = async () => {
    if (transformed) {
      throw new Error(ERR_MSG_STREAM_HAS_BEEN_TRANSFORMED$1);
    }
    transformed = true;
    return await streamCollector(stream);
  };
  const blobToWebStream = (blob) => {
    if (typeof blob.stream !== "function") {
      throw new Error("Cannot transform payload Blob to web stream. Please make sure the Blob.stream() is polyfilled.\nIf you are using React Native, this API is not yet supported, see: https://react-native.canny.io/feature-requests/p/fetch-streaming-body");
    }
    return blob.stream();
  };
  return Object.assign(stream, {
    transformToByteArray,
    transformToString: async (encoding) => {
      const buf = await transformToByteArray();
      if (encoding === "base64") {
        return toBase64(buf);
      } else if (encoding === "hex") {
        return toHex(buf);
      } else if (encoding === void 0 || encoding === "utf8" || encoding === "utf-8") {
        return toUtf8(buf);
      } else if (typeof TextDecoder === "function") {
        return new TextDecoder(encoding).decode(buf);
      } else {
        throw new Error("TextDecoder is not available, please make sure polyfill is provided.");
      }
    },
    transformToWebStream: () => {
      if (transformed) {
        throw new Error(ERR_MSG_STREAM_HAS_BEEN_TRANSFORMED$1);
      }
      transformed = true;
      if (isBlobInstance(stream)) {
        return blobToWebStream(stream);
      } else if (isReadableStream(stream)) {
        return stream;
      } else {
        throw new Error(`Cannot transform payload to web stream, got ${stream}`);
      }
    }
  });
};
const isBlobInstance = (stream) => typeof Blob === "function" && stream instanceof Blob;
const ERR_MSG_STREAM_HAS_BEEN_TRANSFORMED = "The stream has already been transformed.";
const sdkStreamMixin = (stream) => {
  if (!(stream instanceof Readable$1)) {
    try {
      return sdkStreamMixin$1(stream);
    } catch (e2) {
      const name = stream?.__proto__?.constructor?.name || stream;
      throw new Error(`Unexpected stream implementation, expect Stream.Readable instance, got ${name}`);
    }
  }
  let transformed = false;
  const transformToByteArray = async () => {
    if (transformed) {
      throw new Error(ERR_MSG_STREAM_HAS_BEEN_TRANSFORMED);
    }
    transformed = true;
    return await streamCollector$1(stream);
  };
  return Object.assign(stream, {
    transformToByteArray,
    transformToString: async (encoding) => {
      const buf = await transformToByteArray();
      if (encoding === void 0 || Buffer.isEncoding(encoding)) {
        return fromArrayBuffer(buf.buffer, buf.byteOffset, buf.byteLength).toString(encoding);
      } else {
        const decoder = new TextDecoder(encoding);
        return decoder.decode(buf);
      }
    },
    transformToWebStream: () => {
      if (transformed) {
        throw new Error(ERR_MSG_STREAM_HAS_BEEN_TRANSFORMED);
      }
      if (stream.readableFlowing !== null) {
        throw new Error("The stream has been consumed by other callbacks.");
      }
      if (typeof Readable$1.toWeb !== "function") {
        throw new Error("Readable.toWeb() is not supported. Please ensure a polyfill is available.");
      }
      transformed = true;
      return Readable$1.toWeb(stream);
    }
  });
};
async function splitStream$1(stream) {
  if (typeof stream.stream === "function") {
    stream = stream.stream();
  }
  const readableStream = stream;
  return readableStream.tee();
}
async function splitStream(stream) {
  if (isReadableStream(stream) || isBlob(stream)) {
    return splitStream$1(stream);
  }
  const stream1 = new PassThrough();
  const stream2 = new PassThrough();
  stream.pipe(stream1);
  stream.pipe(stream2);
  return [stream1, stream2];
}
const getChecksumAlgorithmForRequest = (input, { requestChecksumRequired, requestAlgorithmMember, requestChecksumCalculation }) => {
  if (!requestAlgorithmMember) {
    return requestChecksumCalculation === RequestChecksumCalculation.WHEN_SUPPORTED || requestChecksumRequired ? DEFAULT_CHECKSUM_ALGORITHM : void 0;
  }
  if (!input[requestAlgorithmMember]) {
    return void 0;
  }
  const checksumAlgorithm = input[requestAlgorithmMember];
  return checksumAlgorithm;
};
const getChecksumLocationName = (algorithm) => algorithm === ChecksumAlgorithm.MD5 ? "content-md5" : `x-amz-checksum-${algorithm.toLowerCase()}`;
const hasHeader$1 = (header, headers) => {
  const soughtHeader = header.toLowerCase();
  for (const headerName of Object.keys(headers)) {
    if (soughtHeader === headerName.toLowerCase()) {
      return true;
    }
  }
  return false;
};
const hasHeaderWithPrefix = (headerPrefix, headers) => {
  const soughtHeaderPrefix = headerPrefix.toLowerCase();
  for (const headerName of Object.keys(headers)) {
    if (headerName.toLowerCase().startsWith(soughtHeaderPrefix)) {
      return true;
    }
  }
  return false;
};
const isStreaming = (body) => body !== void 0 && typeof body !== "string" && !ArrayBuffer.isView(body) && !isArrayBuffer(body);
const fromString = (input, encoding) => {
  if (typeof input !== "string") {
    throw new TypeError(`The "input" argument must be of type string. Received type ${typeof input} (${input})`);
  }
  return Buffer$1.from(input, encoding);
};
const fromUtf8$1 = (input) => {
  const buf = fromString(input, "utf8");
  return new Uint8Array(buf.buffer, buf.byteOffset, buf.byteLength / Uint8Array.BYTES_PER_ELEMENT);
};
var fromUtf8 = typeof Buffer !== "undefined" && Buffer.from ? function(input) {
  return Buffer.from(input, "utf8");
} : fromUtf8$1;
function convertToBuffer(data) {
  if (data instanceof Uint8Array)
    return data;
  if (typeof data === "string") {
    return fromUtf8(data);
  }
  if (ArrayBuffer.isView(data)) {
    return new Uint8Array(data.buffer, data.byteOffset, data.byteLength / Uint8Array.BYTES_PER_ELEMENT);
  }
  return new Uint8Array(data);
}
function isEmptyData(data) {
  if (typeof data === "string") {
    return data.length === 0;
  }
  return data.byteLength === 0;
}
function numToUint8(num) {
  return new Uint8Array([
    (num & 4278190080) >> 24,
    (num & 16711680) >> 16,
    (num & 65280) >> 8,
    num & 255
  ]);
}
function uint32ArrayFrom(a_lookUpTable2) {
  if (!Uint32Array.from) {
    var return_array = new Uint32Array(a_lookUpTable2.length);
    var a_index = 0;
    while (a_index < a_lookUpTable2.length) {
      return_array[a_index] = a_lookUpTable2[a_index];
      a_index += 1;
    }
    return return_array;
  }
  return Uint32Array.from(a_lookUpTable2);
}
var AwsCrc32c = (
  /** @class */
  (function() {
    function AwsCrc32c2() {
      this.crc32c = new Crc32c();
    }
    AwsCrc32c2.prototype.update = function(toHash) {
      if (isEmptyData(toHash))
        return;
      this.crc32c.update(convertToBuffer(toHash));
    };
    AwsCrc32c2.prototype.digest = function() {
      return __awaiter(this, void 0, void 0, function() {
        return __generator(this, function(_a) {
          return [2, numToUint8(this.crc32c.digest())];
        });
      });
    };
    AwsCrc32c2.prototype.reset = function() {
      this.crc32c = new Crc32c();
    };
    return AwsCrc32c2;
  })()
);
var Crc32c = (
  /** @class */
  (function() {
    function Crc32c2() {
      this.checksum = 4294967295;
    }
    Crc32c2.prototype.update = function(data) {
      var e_1, _a;
      try {
        for (var data_1 = __values(data), data_1_1 = data_1.next(); !data_1_1.done; data_1_1 = data_1.next()) {
          var byte = data_1_1.value;
          this.checksum = this.checksum >>> 8 ^ lookupTable$1[(this.checksum ^ byte) & 255];
        }
      } catch (e_1_1) {
        e_1 = { error: e_1_1 };
      } finally {
        try {
          if (data_1_1 && !data_1_1.done && (_a = data_1.return)) _a.call(data_1);
        } finally {
          if (e_1) throw e_1.error;
        }
      }
      return this;
    };
    Crc32c2.prototype.digest = function() {
      return (this.checksum ^ 4294967295) >>> 0;
    };
    return Crc32c2;
  })()
);
var a_lookupTable = [
  0,
  4067132163,
  3778769143,
  324072436,
  3348797215,
  904991772,
  648144872,
  3570033899,
  2329499855,
  2024987596,
  1809983544,
  2575936315,
  1296289744,
  3207089363,
  2893594407,
  1578318884,
  274646895,
  3795141740,
  4049975192,
  51262619,
  3619967088,
  632279923,
  922689671,
  3298075524,
  2592579488,
  1760304291,
  2075979607,
  2312596564,
  1562183871,
  2943781820,
  3156637768,
  1313733451,
  549293790,
  3537243613,
  3246849577,
  871202090,
  3878099393,
  357341890,
  102525238,
  4101499445,
  2858735121,
  1477399826,
  1264559846,
  3107202533,
  1845379342,
  2677391885,
  2361733625,
  2125378298,
  820201905,
  3263744690,
  3520608582,
  598981189,
  4151959214,
  85089709,
  373468761,
  3827903834,
  3124367742,
  1213305469,
  1526817161,
  2842354314,
  2107672161,
  2412447074,
  2627466902,
  1861252501,
  1098587580,
  3004210879,
  2688576843,
  1378610760,
  2262928035,
  1955203488,
  1742404180,
  2511436119,
  3416409459,
  969524848,
  714683780,
  3639785095,
  205050476,
  4266873199,
  3976438427,
  526918040,
  1361435347,
  2739821008,
  2954799652,
  1114974503,
  2529119692,
  1691668175,
  2005155131,
  2247081528,
  3690758684,
  697762079,
  986182379,
  3366744552,
  476452099,
  3993867776,
  4250756596,
  255256311,
  1640403810,
  2477592673,
  2164122517,
  1922457750,
  2791048317,
  1412925310,
  1197962378,
  3037525897,
  3944729517,
  427051182,
  170179418,
  4165941337,
  746937522,
  3740196785,
  3451792453,
  1070968646,
  1905808397,
  2213795598,
  2426610938,
  1657317369,
  3053634322,
  1147748369,
  1463399397,
  2773627110,
  4215344322,
  153784257,
  444234805,
  3893493558,
  1021025245,
  3467647198,
  3722505002,
  797665321,
  2197175160,
  1889384571,
  1674398607,
  2443626636,
  1164749927,
  3070701412,
  2757221520,
  1446797203,
  137323447,
  4198817972,
  3910406976,
  461344835,
  3484808360,
  1037989803,
  781091935,
  3705997148,
  2460548119,
  1623424788,
  1939049696,
  2180517859,
  1429367560,
  2807687179,
  3020495871,
  1180866812,
  410100952,
  3927582683,
  4182430767,
  186734380,
  3756733383,
  763408580,
  1053836080,
  3434856499,
  2722870694,
  1344288421,
  1131464017,
  2971354706,
  1708204729,
  2545590714,
  2229949006,
  1988219213,
  680717673,
  3673779818,
  3383336350,
  1002577565,
  4010310262,
  493091189,
  238226049,
  4233660802,
  2987750089,
  1082061258,
  1395524158,
  2705686845,
  1972364758,
  2279892693,
  2494862625,
  1725896226,
  952904198,
  3399985413,
  3656866545,
  731699698,
  4283874585,
  222117402,
  510512622,
  3959836397,
  3280807620,
  837199303,
  582374963,
  3504198960,
  68661723,
  4135334616,
  3844915500,
  390545967,
  1230274059,
  3141532936,
  2825850620,
  1510247935,
  2395924756,
  2091215383,
  1878366691,
  2644384480,
  3553878443,
  565732008,
  854102364,
  3229815391,
  340358836,
  3861050807,
  4117890627,
  119113024,
  1493875044,
  2875275879,
  3090270611,
  1247431312,
  2660249211,
  1828433272,
  2141937292,
  2378227087,
  3811616794,
  291187481,
  34330861,
  4032846830,
  615137029,
  3603020806,
  3314634738,
  939183345,
  1776939221,
  2609017814,
  2295496738,
  2058945313,
  2926798794,
  1545135305,
  1330124605,
  3173225534,
  4084100981,
  17165430,
  307568514,
  3762199681,
  888469610,
  3332340585,
  3587147933,
  665062302,
  2042050490,
  2346497209,
  2559330125,
  1793573966,
  3190661285,
  1279665062,
  1595330642,
  2910671697
];
var lookupTable$1 = uint32ArrayFrom(a_lookupTable);
const generateCRC64NVMETable = () => {
  const sliceLength = 8;
  const tables = new Array(sliceLength);
  for (let slice = 0; slice < sliceLength; slice++) {
    const table = new Array(512);
    for (let i2 = 0; i2 < 256; i2++) {
      let crc = BigInt(i2);
      for (let j2 = 0; j2 < 8 * (slice + 1); j2++) {
        if (crc & 1n) {
          crc = crc >> 1n ^ 0x9a6c9329ac4bc9b5n;
        } else {
          crc = crc >> 1n;
        }
      }
      table[i2 * 2] = Number(crc >> 32n & 0xffffffffn);
      table[i2 * 2 + 1] = Number(crc & 0xffffffffn);
    }
    tables[slice] = new Uint32Array(table);
  }
  return tables;
};
let CRC64_NVME_REVERSED_TABLE;
let t0, t1, t2, t3;
let t4, t5, t6, t7;
const ensureTablesInitialized = () => {
  if (!CRC64_NVME_REVERSED_TABLE) {
    CRC64_NVME_REVERSED_TABLE = generateCRC64NVMETable();
    [t0, t1, t2, t3, t4, t5, t6, t7] = CRC64_NVME_REVERSED_TABLE;
  }
};
class Crc64Nvme {
  c1 = 0;
  c2 = 0;
  constructor() {
    ensureTablesInitialized();
    this.reset();
  }
  update(data) {
    const len = data.length;
    let i2 = 0;
    let crc1 = this.c1;
    let crc2 = this.c2;
    while (i2 + 8 <= len) {
      const idx0 = ((crc2 ^ data[i2++]) & 255) << 1;
      const idx1 = ((crc2 >>> 8 ^ data[i2++]) & 255) << 1;
      const idx2 = ((crc2 >>> 16 ^ data[i2++]) & 255) << 1;
      const idx3 = ((crc2 >>> 24 ^ data[i2++]) & 255) << 1;
      const idx4 = ((crc1 ^ data[i2++]) & 255) << 1;
      const idx5 = ((crc1 >>> 8 ^ data[i2++]) & 255) << 1;
      const idx6 = ((crc1 >>> 16 ^ data[i2++]) & 255) << 1;
      const idx7 = ((crc1 >>> 24 ^ data[i2++]) & 255) << 1;
      crc1 = t7[idx0] ^ t6[idx1] ^ t5[idx2] ^ t4[idx3] ^ t3[idx4] ^ t2[idx5] ^ t1[idx6] ^ t0[idx7];
      crc2 = t7[idx0 + 1] ^ t6[idx1 + 1] ^ t5[idx2 + 1] ^ t4[idx3 + 1] ^ t3[idx4 + 1] ^ t2[idx5 + 1] ^ t1[idx6 + 1] ^ t0[idx7 + 1];
    }
    while (i2 < len) {
      const idx = ((crc2 ^ data[i2]) & 255) << 1;
      crc2 = (crc2 >>> 8 | (crc1 & 255) << 24) >>> 0;
      crc1 = crc1 >>> 8 ^ t0[idx];
      crc2 ^= t0[idx + 1];
      i2++;
    }
    this.c1 = crc1;
    this.c2 = crc2;
  }
  async digest() {
    const c1 = this.c1 ^ 4294967295;
    const c2 = this.c2 ^ 4294967295;
    return new Uint8Array([
      c1 >>> 24,
      c1 >>> 16 & 255,
      c1 >>> 8 & 255,
      c1 & 255,
      c2 >>> 24,
      c2 >>> 16 & 255,
      c2 >>> 8 & 255,
      c2 & 255
    ]);
  }
  reset() {
    this.c1 = 4294967295;
    this.c2 = 4294967295;
  }
}
var AwsCrc32 = (
  /** @class */
  (function() {
    function AwsCrc322() {
      this.crc32 = new Crc32();
    }
    AwsCrc322.prototype.update = function(toHash) {
      if (isEmptyData(toHash))
        return;
      this.crc32.update(convertToBuffer(toHash));
    };
    AwsCrc322.prototype.digest = function() {
      return __awaiter(this, void 0, void 0, function() {
        return __generator(this, function(_a) {
          return [2, numToUint8(this.crc32.digest())];
        });
      });
    };
    AwsCrc322.prototype.reset = function() {
      this.crc32 = new Crc32();
    };
    return AwsCrc322;
  })()
);
var Crc32 = (
  /** @class */
  (function() {
    function Crc322() {
      this.checksum = 4294967295;
    }
    Crc322.prototype.update = function(data) {
      var e_1, _a;
      try {
        for (var data_1 = __values(data), data_1_1 = data_1.next(); !data_1_1.done; data_1_1 = data_1.next()) {
          var byte = data_1_1.value;
          this.checksum = this.checksum >>> 8 ^ lookupTable[(this.checksum ^ byte) & 255];
        }
      } catch (e_1_1) {
        e_1 = { error: e_1_1 };
      } finally {
        try {
          if (data_1_1 && !data_1_1.done && (_a = data_1.return)) _a.call(data_1);
        } finally {
          if (e_1) throw e_1.error;
        }
      }
      return this;
    };
    Crc322.prototype.digest = function() {
      return (this.checksum ^ 4294967295) >>> 0;
    };
    return Crc322;
  })()
);
var a_lookUpTable = [
  0,
  1996959894,
  3993919788,
  2567524794,
  124634137,
  1886057615,
  3915621685,
  2657392035,
  249268274,
  2044508324,
  3772115230,
  2547177864,
  162941995,
  2125561021,
  3887607047,
  2428444049,
  498536548,
  1789927666,
  4089016648,
  2227061214,
  450548861,
  1843258603,
  4107580753,
  2211677639,
  325883990,
  1684777152,
  4251122042,
  2321926636,
  335633487,
  1661365465,
  4195302755,
  2366115317,
  997073096,
  1281953886,
  3579855332,
  2724688242,
  1006888145,
  1258607687,
  3524101629,
  2768942443,
  901097722,
  1119000684,
  3686517206,
  2898065728,
  853044451,
  1172266101,
  3705015759,
  2882616665,
  651767980,
  1373503546,
  3369554304,
  3218104598,
  565507253,
  1454621731,
  3485111705,
  3099436303,
  671266974,
  1594198024,
  3322730930,
  2970347812,
  795835527,
  1483230225,
  3244367275,
  3060149565,
  1994146192,
  31158534,
  2563907772,
  4023717930,
  1907459465,
  112637215,
  2680153253,
  3904427059,
  2013776290,
  251722036,
  2517215374,
  3775830040,
  2137656763,
  141376813,
  2439277719,
  3865271297,
  1802195444,
  476864866,
  2238001368,
  4066508878,
  1812370925,
  453092731,
  2181625025,
  4111451223,
  1706088902,
  314042704,
  2344532202,
  4240017532,
  1658658271,
  366619977,
  2362670323,
  4224994405,
  1303535960,
  984961486,
  2747007092,
  3569037538,
  1256170817,
  1037604311,
  2765210733,
  3554079995,
  1131014506,
  879679996,
  2909243462,
  3663771856,
  1141124467,
  855842277,
  2852801631,
  3708648649,
  1342533948,
  654459306,
  3188396048,
  3373015174,
  1466479909,
  544179635,
  3110523913,
  3462522015,
  1591671054,
  702138776,
  2966460450,
  3352799412,
  1504918807,
  783551873,
  3082640443,
  3233442989,
  3988292384,
  2596254646,
  62317068,
  1957810842,
  3939845945,
  2647816111,
  81470997,
  1943803523,
  3814918930,
  2489596804,
  225274430,
  2053790376,
  3826175755,
  2466906013,
  167816743,
  2097651377,
  4027552580,
  2265490386,
  503444072,
  1762050814,
  4150417245,
  2154129355,
  426522225,
  1852507879,
  4275313526,
  2312317920,
  282753626,
  1742555852,
  4189708143,
  2394877945,
  397917763,
  1622183637,
  3604390888,
  2714866558,
  953729732,
  1340076626,
  3518719985,
  2797360999,
  1068828381,
  1219638859,
  3624741850,
  2936675148,
  906185462,
  1090812512,
  3747672003,
  2825379669,
  829329135,
  1181335161,
  3412177804,
  3160834842,
  628085408,
  1382605366,
  3423369109,
  3138078467,
  570562233,
  1426400815,
  3317316542,
  2998733608,
  733239954,
  1555261956,
  3268935591,
  3050360625,
  752459403,
  1541320221,
  2607071920,
  3965973030,
  1969922972,
  40735498,
  2617837225,
  3943577151,
  1913087877,
  83908371,
  2512341634,
  3803740692,
  2075208622,
  213261112,
  2463272603,
  3855990285,
  2094854071,
  198958881,
  2262029012,
  4057260610,
  1759359992,
  534414190,
  2176718541,
  4139329115,
  1873836001,
  414664567,
  2282248934,
  4279200368,
  1711684554,
  285281116,
  2405801727,
  4167216745,
  1634467795,
  376229701,
  2685067896,
  3608007406,
  1308918612,
  956543938,
  2808555105,
  3495958263,
  1231636301,
  1047427035,
  2932959818,
  3654703836,
  1088359270,
  936918e3,
  2847714899,
  3736837829,
  1202900863,
  817233897,
  3183342108,
  3401237130,
  1404277552,
  615818150,
  3134207493,
  3453421203,
  1423857449,
  601450431,
  3009837614,
  3294710456,
  1567103746,
  711928724,
  3020668471,
  3272380065,
  1510334235,
  755167117
];
var lookupTable = uint32ArrayFrom(a_lookUpTable);
class NodeCrc32 {
  checksum = 0;
  update(data) {
    this.checksum = zlib.crc32(data, this.checksum);
  }
  async digest() {
    return numToUint8(this.checksum);
  }
  reset() {
    this.checksum = 0;
  }
}
const getCrc32ChecksumAlgorithmFunction = () => {
  if (typeof zlib.crc32 === "undefined") {
    return AwsCrc32;
  }
  return NodeCrc32;
};
const CLIENT_SUPPORTED_ALGORITHMS = [
  ChecksumAlgorithm.CRC32,
  ChecksumAlgorithm.CRC32C,
  ChecksumAlgorithm.CRC64NVME,
  ChecksumAlgorithm.SHA1,
  ChecksumAlgorithm.SHA256
];
const PRIORITY_ORDER_ALGORITHMS = [
  ChecksumAlgorithm.SHA256,
  ChecksumAlgorithm.SHA1,
  ChecksumAlgorithm.CRC32,
  ChecksumAlgorithm.CRC32C,
  ChecksumAlgorithm.CRC64NVME
];
const selectChecksumAlgorithmFunction = (checksumAlgorithm, config) => {
  const { checksumAlgorithms = {} } = config;
  switch (checksumAlgorithm) {
    case ChecksumAlgorithm.MD5:
      return checksumAlgorithms?.MD5 ?? config.md5;
    case ChecksumAlgorithm.CRC32:
      return checksumAlgorithms?.CRC32 ?? getCrc32ChecksumAlgorithmFunction();
    case ChecksumAlgorithm.CRC32C:
      return checksumAlgorithms?.CRC32C ?? AwsCrc32c;
    case ChecksumAlgorithm.CRC64NVME: {
      return checksumAlgorithms?.CRC64NVME ?? Crc64Nvme;
    }
    case ChecksumAlgorithm.SHA1:
      return checksumAlgorithms?.SHA1 ?? config.sha1;
    case ChecksumAlgorithm.SHA256:
      return checksumAlgorithms?.SHA256 ?? config.sha256;
    default:
      if (checksumAlgorithms?.[checksumAlgorithm]) {
        return checksumAlgorithms[checksumAlgorithm];
      }
      throw new Error(`The checksum algorithm "${checksumAlgorithm}" is not supported by the client. Select one of ${CLIENT_SUPPORTED_ALGORITHMS}, or provide an implementation to  the client constructor checksums field.`);
  }
};
const stringHasher = (checksumAlgorithmFn, body) => {
  const hash = new checksumAlgorithmFn();
  hash.update(toUint8Array(body || ""));
  return hash.digest();
};
const flexibleChecksumsMiddlewareOptions = {
  name: "flexibleChecksumsMiddleware",
  step: "build",
  tags: ["BODY_CHECKSUM"],
  override: true
};
const flexibleChecksumsMiddleware = (config, middlewareConfig) => (next, context) => async (args) => {
  if (!HttpRequest.isInstance(args.request)) {
    return next(args);
  }
  if (hasHeaderWithPrefix("x-amz-checksum-", args.request.headers)) {
    return next(args);
  }
  const { request: request2, input } = args;
  const { body: requestBody, headers } = request2;
  const { base64Encoder, streamHasher } = config;
  const { requestChecksumRequired, requestAlgorithmMember } = middlewareConfig;
  const requestChecksumCalculation = await config.requestChecksumCalculation();
  const requestAlgorithmMemberName = requestAlgorithmMember?.name;
  const requestAlgorithmMemberHttpHeader = requestAlgorithmMember?.httpHeader;
  if (requestAlgorithmMemberName && !input[requestAlgorithmMemberName]) {
    if (requestChecksumCalculation === RequestChecksumCalculation.WHEN_SUPPORTED || requestChecksumRequired) {
      input[requestAlgorithmMemberName] = DEFAULT_CHECKSUM_ALGORITHM;
      if (requestAlgorithmMemberHttpHeader) {
        headers[requestAlgorithmMemberHttpHeader] = DEFAULT_CHECKSUM_ALGORITHM;
      }
    }
  }
  const checksumAlgorithm = getChecksumAlgorithmForRequest(input, {
    requestChecksumRequired,
    requestAlgorithmMember: requestAlgorithmMember?.name,
    requestChecksumCalculation
  });
  let updatedBody = requestBody;
  let updatedHeaders = headers;
  if (checksumAlgorithm) {
    switch (checksumAlgorithm) {
      case ChecksumAlgorithm.CRC32:
        setFeature$1(context, "FLEXIBLE_CHECKSUMS_REQ_CRC32", "U");
        break;
      case ChecksumAlgorithm.CRC32C:
        setFeature$1(context, "FLEXIBLE_CHECKSUMS_REQ_CRC32C", "V");
        break;
      case ChecksumAlgorithm.CRC64NVME:
        setFeature$1(context, "FLEXIBLE_CHECKSUMS_REQ_CRC64", "W");
        break;
      case ChecksumAlgorithm.SHA1:
        setFeature$1(context, "FLEXIBLE_CHECKSUMS_REQ_SHA1", "X");
        break;
      case ChecksumAlgorithm.SHA256:
        setFeature$1(context, "FLEXIBLE_CHECKSUMS_REQ_SHA256", "Y");
        break;
    }
    const checksumLocationName = getChecksumLocationName(checksumAlgorithm);
    const checksumAlgorithmFn = selectChecksumAlgorithmFunction(checksumAlgorithm, config);
    if (isStreaming(requestBody)) {
      const { getAwsChunkedEncodingStream: getAwsChunkedEncodingStream2, bodyLengthChecker } = config;
      updatedBody = getAwsChunkedEncodingStream2(typeof config.requestStreamBufferSize === "number" && config.requestStreamBufferSize >= 8 * 1024 ? createBufferedReadable(requestBody, config.requestStreamBufferSize, context.logger) : requestBody, {
        base64Encoder,
        bodyLengthChecker,
        checksumLocationName,
        checksumAlgorithmFn,
        streamHasher
      });
      updatedHeaders = {
        ...headers,
        "content-encoding": headers["content-encoding"] ? `${headers["content-encoding"]},aws-chunked` : "aws-chunked",
        "transfer-encoding": "chunked",
        "x-amz-decoded-content-length": headers["content-length"],
        "x-amz-content-sha256": "STREAMING-UNSIGNED-PAYLOAD-TRAILER",
        "x-amz-trailer": checksumLocationName
      };
      delete updatedHeaders["content-length"];
    } else if (!hasHeader$1(checksumLocationName, headers)) {
      const rawChecksum = await stringHasher(checksumAlgorithmFn, requestBody);
      updatedHeaders = {
        ...headers,
        [checksumLocationName]: base64Encoder(rawChecksum)
      };
    }
  }
  try {
    const result = await next({
      ...args,
      request: {
        ...request2,
        headers: updatedHeaders,
        body: updatedBody
      }
    });
    return result;
  } catch (e2) {
    if (e2 instanceof Error && e2.name === "InvalidChunkSizeError") {
      try {
        if (!e2.message.endsWith(".")) {
          e2.message += ".";
        }
        e2.message += " Set [requestStreamBufferSize=number e.g. 65_536] in client constructor to instruct AWS SDK to buffer your input stream.";
      } catch (ignored) {
      }
    }
    throw e2;
  }
};
const flexibleChecksumsInputMiddlewareOptions = {
  name: "flexibleChecksumsInputMiddleware",
  toMiddleware: "serializerMiddleware",
  relation: "before",
  tags: ["BODY_CHECKSUM"],
  override: true
};
const flexibleChecksumsInputMiddleware = (config, middlewareConfig) => (next, context) => async (args) => {
  const input = args.input;
  const { requestValidationModeMember } = middlewareConfig;
  const requestChecksumCalculation = await config.requestChecksumCalculation();
  const responseChecksumValidation = await config.responseChecksumValidation();
  switch (requestChecksumCalculation) {
    case RequestChecksumCalculation.WHEN_REQUIRED:
      setFeature$1(context, "FLEXIBLE_CHECKSUMS_REQ_WHEN_REQUIRED", "a");
      break;
    case RequestChecksumCalculation.WHEN_SUPPORTED:
      setFeature$1(context, "FLEXIBLE_CHECKSUMS_REQ_WHEN_SUPPORTED", "Z");
      break;
  }
  switch (responseChecksumValidation) {
    case ResponseChecksumValidation.WHEN_REQUIRED:
      setFeature$1(context, "FLEXIBLE_CHECKSUMS_RES_WHEN_REQUIRED", "c");
      break;
    case ResponseChecksumValidation.WHEN_SUPPORTED:
      setFeature$1(context, "FLEXIBLE_CHECKSUMS_RES_WHEN_SUPPORTED", "b");
      break;
  }
  if (requestValidationModeMember && !input[requestValidationModeMember]) {
    if (responseChecksumValidation === ResponseChecksumValidation.WHEN_SUPPORTED) {
      input[requestValidationModeMember] = "ENABLED";
    }
  }
  return next(args);
};
const getChecksumAlgorithmListForResponse = (responseAlgorithms = []) => {
  const validChecksumAlgorithms = [];
  let i2 = PRIORITY_ORDER_ALGORITHMS.length;
  for (const algorithm of responseAlgorithms) {
    const priority = PRIORITY_ORDER_ALGORITHMS.indexOf(algorithm);
    if (priority !== -1) {
      validChecksumAlgorithms[priority] = algorithm;
    } else {
      validChecksumAlgorithms[i2++] = algorithm;
    }
  }
  return validChecksumAlgorithms.filter(Boolean);
};
const isChecksumWithPartNumber = (checksum) => {
  const lastHyphenIndex = checksum.lastIndexOf("-");
  if (lastHyphenIndex !== -1) {
    const numberPart = checksum.slice(lastHyphenIndex + 1);
    if (!numberPart.startsWith("0")) {
      const number = parseInt(numberPart, 10);
      if (!isNaN(number) && number >= 1 && number <= 1e4) {
        return true;
      }
    }
  }
  return false;
};
const getChecksum = async (body, { checksumAlgorithmFn, base64Encoder }) => base64Encoder(await stringHasher(checksumAlgorithmFn, body));
const validateChecksumFromResponse = async (response, { config, responseAlgorithms, logger: logger2 }) => {
  const checksumAlgorithms = getChecksumAlgorithmListForResponse(responseAlgorithms);
  const { body: responseBody, headers: responseHeaders } = response;
  for (const algorithm of checksumAlgorithms) {
    const responseHeader = getChecksumLocationName(algorithm);
    const checksumFromResponse = responseHeaders[responseHeader];
    if (checksumFromResponse) {
      let checksumAlgorithmFn;
      try {
        checksumAlgorithmFn = selectChecksumAlgorithmFunction(algorithm, config);
      } catch (error) {
        if (algorithm === ChecksumAlgorithm.CRC64NVME) {
          logger2?.warn(`Skipping ${ChecksumAlgorithm.CRC64NVME} checksum validation: ${error.message}`);
          continue;
        }
        throw error;
      }
      const { base64Encoder } = config;
      if (isStreaming(responseBody)) {
        response.body = createChecksumStream({
          expectedChecksum: checksumFromResponse,
          checksumSourceLocation: responseHeader,
          checksum: new checksumAlgorithmFn(),
          source: responseBody,
          base64Encoder
        });
        return;
      }
      const checksum = await getChecksum(responseBody, { checksumAlgorithmFn, base64Encoder });
      if (checksum === checksumFromResponse) {
        break;
      }
      throw new Error(`Checksum mismatch: expected "${checksum}" but received "${checksumFromResponse}" in response header "${responseHeader}".`);
    }
  }
};
const flexibleChecksumsResponseMiddlewareOptions = {
  name: "flexibleChecksumsResponseMiddleware",
  toMiddleware: "deserializerMiddleware",
  relation: "after",
  tags: ["BODY_CHECKSUM"],
  override: true
};
const flexibleChecksumsResponseMiddleware = (config, middlewareConfig) => (next, context) => async (args) => {
  if (!HttpRequest.isInstance(args.request)) {
    return next(args);
  }
  const input = args.input;
  const result = await next(args);
  const response = result.response;
  const { requestValidationModeMember, responseAlgorithms } = middlewareConfig;
  if (requestValidationModeMember && input[requestValidationModeMember] === "ENABLED") {
    const { clientName, commandName } = context;
    const customChecksumAlgorithms = Object.keys(config.checksumAlgorithms ?? {}).filter((algorithm) => {
      const responseHeader = getChecksumLocationName(algorithm);
      return response.headers[responseHeader] !== void 0;
    });
    const algoList = getChecksumAlgorithmListForResponse([
      ...responseAlgorithms ?? [],
      ...customChecksumAlgorithms
    ]);
    const isS3WholeObjectMultipartGetResponseChecksum = clientName === "S3Client" && commandName === "GetObjectCommand" && algoList.every((algorithm) => {
      const responseHeader = getChecksumLocationName(algorithm);
      const checksumFromResponse = response.headers[responseHeader];
      return !checksumFromResponse || isChecksumWithPartNumber(checksumFromResponse);
    });
    if (isS3WholeObjectMultipartGetResponseChecksum) {
      return result;
    }
    await validateChecksumFromResponse(response, {
      config,
      responseAlgorithms: algoList,
      logger: context.logger
    });
  }
  return result;
};
const getFlexibleChecksumsPlugin = (config, middlewareConfig) => ({
  applyToStack: (clientStack) => {
    clientStack.add(flexibleChecksumsMiddleware(config, middlewareConfig), flexibleChecksumsMiddlewareOptions);
    clientStack.addRelativeTo(flexibleChecksumsInputMiddleware(config, middlewareConfig), flexibleChecksumsInputMiddlewareOptions);
    clientStack.addRelativeTo(flexibleChecksumsResponseMiddleware(config, middlewareConfig), flexibleChecksumsResponseMiddlewareOptions);
  }
});
const getSmithyContext = (context) => context[SMITHY_CONTEXT_KEY] || (context[SMITHY_CONTEXT_KEY] = {});
const normalizeProvider$1 = (input) => {
  if (typeof input === "function")
    return input;
  const promisified = Promise.resolve(input);
  return () => promisified;
};
const resolveFlexibleChecksumsConfig = (input) => {
  const { requestChecksumCalculation, responseChecksumValidation, requestStreamBufferSize } = input;
  return Object.assign(input, {
    requestChecksumCalculation: normalizeProvider$1(requestChecksumCalculation ?? DEFAULT_REQUEST_CHECKSUM_CALCULATION),
    responseChecksumValidation: normalizeProvider$1(responseChecksumValidation ?? DEFAULT_RESPONSE_CHECKSUM_VALIDATION),
    requestStreamBufferSize: Number(requestStreamBufferSize ?? 0),
    checksumAlgorithms: input.checksumAlgorithms ?? {}
  });
};
function resolveHostHeaderConfig(input) {
  return input;
}
const hostHeaderMiddleware = (options) => (next) => async (args) => {
  if (!HttpRequest.isInstance(args.request))
    return next(args);
  const { request: request2 } = args;
  const { handlerProtocol = "" } = options.requestHandler.metadata || {};
  if (handlerProtocol.indexOf("h2") >= 0 && !request2.headers[":authority"]) {
    delete request2.headers["host"];
    request2.headers[":authority"] = request2.hostname + (request2.port ? ":" + request2.port : "");
  } else if (!request2.headers["host"]) {
    let host = request2.hostname;
    if (request2.port != null)
      host += `:${request2.port}`;
    request2.headers["host"] = host;
  }
  return next(args);
};
const hostHeaderMiddlewareOptions = {
  name: "hostHeaderMiddleware",
  step: "build",
  priority: "low",
  tags: ["HOST"],
  override: true
};
const getHostHeaderPlugin = (options) => ({
  applyToStack: (clientStack) => {
    clientStack.add(hostHeaderMiddleware(options), hostHeaderMiddlewareOptions);
  }
});
const loggerMiddleware = () => (next, context) => async (args) => {
  try {
    const response = await next(args);
    const { clientName, commandName, logger: logger2, dynamoDbDocumentClientOptions = {} } = context;
    const { overrideInputFilterSensitiveLog, overrideOutputFilterSensitiveLog } = dynamoDbDocumentClientOptions;
    const inputFilterSensitiveLog = overrideInputFilterSensitiveLog ?? context.inputFilterSensitiveLog;
    const outputFilterSensitiveLog = overrideOutputFilterSensitiveLog ?? context.outputFilterSensitiveLog;
    const { $metadata, ...outputWithoutMetadata } = response.output;
    logger2?.info?.({
      clientName,
      commandName,
      input: inputFilterSensitiveLog(args.input),
      output: outputFilterSensitiveLog(outputWithoutMetadata),
      metadata: $metadata
    });
    return response;
  } catch (error) {
    const { clientName, commandName, logger: logger2, dynamoDbDocumentClientOptions = {} } = context;
    const { overrideInputFilterSensitiveLog } = dynamoDbDocumentClientOptions;
    const inputFilterSensitiveLog = overrideInputFilterSensitiveLog ?? context.inputFilterSensitiveLog;
    logger2?.error?.({
      clientName,
      commandName,
      input: inputFilterSensitiveLog(args.input),
      error,
      metadata: error.$metadata
    });
    throw error;
  }
};
const loggerMiddlewareOptions = {
  name: "loggerMiddleware",
  tags: ["LOGGER"],
  step: "initialize",
  override: true
};
const getLoggerPlugin = (options) => ({
  applyToStack: (clientStack) => {
    clientStack.add(loggerMiddleware(), loggerMiddlewareOptions);
  }
});
const recursionDetectionMiddlewareOptions = {
  step: "build",
  tags: ["RECURSION_DETECTION"],
  name: "recursionDetectionMiddleware",
  override: true,
  priority: "low"
};
const PROTECTED_KEYS = {
  REQUEST_ID: /* @__PURE__ */ Symbol.for("_AWS_LAMBDA_REQUEST_ID"),
  X_RAY_TRACE_ID: /* @__PURE__ */ Symbol.for("_AWS_LAMBDA_X_RAY_TRACE_ID"),
  TENANT_ID: /* @__PURE__ */ Symbol.for("_AWS_LAMBDA_TENANT_ID")
};
const NO_GLOBAL_AWS_LAMBDA = ["true", "1"].includes(process.env?.AWS_LAMBDA_NODEJS_NO_GLOBAL_AWSLAMBDA ?? "");
if (!NO_GLOBAL_AWS_LAMBDA) {
  globalThis.awslambda = globalThis.awslambda || {};
}
class InvokeStoreBase {
  static PROTECTED_KEYS = PROTECTED_KEYS;
  isProtectedKey(key) {
    return Object.values(PROTECTED_KEYS).includes(key);
  }
  getRequestId() {
    return this.get(PROTECTED_KEYS.REQUEST_ID) ?? "-";
  }
  getXRayTraceId() {
    return this.get(PROTECTED_KEYS.X_RAY_TRACE_ID);
  }
  getTenantId() {
    return this.get(PROTECTED_KEYS.TENANT_ID);
  }
}
class InvokeStoreSingle extends InvokeStoreBase {
  currentContext;
  getContext() {
    return this.currentContext;
  }
  hasContext() {
    return this.currentContext !== void 0;
  }
  get(key) {
    return this.currentContext?.[key];
  }
  set(key, value) {
    if (this.isProtectedKey(key)) {
      throw new Error(`Cannot modify protected Lambda context field: ${String(key)}`);
    }
    this.currentContext = this.currentContext || {};
    this.currentContext[key] = value;
  }
  run(context, fn) {
    this.currentContext = context;
    return fn();
  }
}
class InvokeStoreMulti extends InvokeStoreBase {
  als;
  static async create() {
    const instance = new InvokeStoreMulti();
    const asyncHooks = await import("node:async_hooks");
    instance.als = new asyncHooks.AsyncLocalStorage();
    return instance;
  }
  getContext() {
    return this.als.getStore();
  }
  hasContext() {
    return this.als.getStore() !== void 0;
  }
  get(key) {
    return this.als.getStore()?.[key];
  }
  set(key, value) {
    if (this.isProtectedKey(key)) {
      throw new Error(`Cannot modify protected Lambda context field: ${String(key)}`);
    }
    const store = this.als.getStore();
    if (!store) {
      throw new Error("No context available");
    }
    store[key] = value;
  }
  run(context, fn) {
    return this.als.run(context, fn);
  }
}
var InvokeStore;
(function(InvokeStore2) {
  let instance = null;
  async function getInstanceAsync(forceInvokeStoreMulti) {
    if (!instance) {
      instance = (async () => {
        const isMulti = forceInvokeStoreMulti === true || "AWS_LAMBDA_MAX_CONCURRENCY" in process.env;
        const newInstance = isMulti ? await InvokeStoreMulti.create() : new InvokeStoreSingle();
        if (!NO_GLOBAL_AWS_LAMBDA && globalThis.awslambda?.InvokeStore) {
          return globalThis.awslambda.InvokeStore;
        } else if (!NO_GLOBAL_AWS_LAMBDA && globalThis.awslambda) {
          globalThis.awslambda.InvokeStore = newInstance;
          return newInstance;
        } else {
          return newInstance;
        }
      })();
    }
    return instance;
  }
  InvokeStore2.getInstanceAsync = getInstanceAsync;
  InvokeStore2._testing = process.env.AWS_LAMBDA_BENCHMARK_MODE === "1" ? {
    reset: () => {
      instance = null;
      if (globalThis.awslambda?.InvokeStore) {
        delete globalThis.awslambda.InvokeStore;
      }
      globalThis.awslambda = { InvokeStore: void 0 };
    }
  } : void 0;
})(InvokeStore || (InvokeStore = {}));
const TRACE_ID_HEADER_NAME = "X-Amzn-Trace-Id";
const ENV_LAMBDA_FUNCTION_NAME = "AWS_LAMBDA_FUNCTION_NAME";
const ENV_TRACE_ID = "_X_AMZN_TRACE_ID";
const recursionDetectionMiddleware = () => (next) => async (args) => {
  const { request: request2 } = args;
  if (!HttpRequest.isInstance(request2)) {
    return next(args);
  }
  const traceIdHeader = Object.keys(request2.headers ?? {}).find((h2) => h2.toLowerCase() === TRACE_ID_HEADER_NAME.toLowerCase()) ?? TRACE_ID_HEADER_NAME;
  if (request2.headers.hasOwnProperty(traceIdHeader)) {
    return next(args);
  }
  const functionName = process.env[ENV_LAMBDA_FUNCTION_NAME];
  const traceIdFromEnv = process.env[ENV_TRACE_ID];
  const invokeStore = await InvokeStore.getInstanceAsync();
  const traceIdFromInvokeStore = invokeStore?.getXRayTraceId();
  const traceId = traceIdFromInvokeStore ?? traceIdFromEnv;
  const nonEmptyString = (str) => typeof str === "string" && str.length > 0;
  if (nonEmptyString(functionName) && nonEmptyString(traceId)) {
    request2.headers[TRACE_ID_HEADER_NAME] = traceId;
  }
  return next({
    ...args,
    request: request2
  });
};
const getRecursionDetectionPlugin = (options) => ({
  applyToStack: (clientStack) => {
    clientStack.add(recursionDetectionMiddleware(), recursionDetectionMiddlewareOptions);
  }
});
const getAllAliases = (name, aliases) => {
  const _aliases = [];
  if (name) {
    _aliases.push(name);
  }
  if (aliases) {
    for (const alias of aliases) {
      _aliases.push(alias);
    }
  }
  return _aliases;
};
const getMiddlewareNameWithAliases = (name, aliases) => {
  return `${name || "anonymous"}${aliases && aliases.length > 0 ? ` (a.k.a. ${aliases.join(",")})` : ""}`;
};
const constructStack = () => {
  let absoluteEntries = [];
  let relativeEntries = [];
  let identifyOnResolve = false;
  const entriesNameSet = /* @__PURE__ */ new Set();
  const sort = (entries) => entries.sort((a2, b2) => stepWeights[b2.step] - stepWeights[a2.step] || priorityWeights[b2.priority || "normal"] - priorityWeights[a2.priority || "normal"]);
  const removeByName = (toRemove) => {
    let isRemoved = false;
    const filterCb = (entry) => {
      const aliases = getAllAliases(entry.name, entry.aliases);
      if (aliases.includes(toRemove)) {
        isRemoved = true;
        for (const alias of aliases) {
          entriesNameSet.delete(alias);
        }
        return false;
      }
      return true;
    };
    absoluteEntries = absoluteEntries.filter(filterCb);
    relativeEntries = relativeEntries.filter(filterCb);
    return isRemoved;
  };
  const removeByReference = (toRemove) => {
    let isRemoved = false;
    const filterCb = (entry) => {
      if (entry.middleware === toRemove) {
        isRemoved = true;
        for (const alias of getAllAliases(entry.name, entry.aliases)) {
          entriesNameSet.delete(alias);
        }
        return false;
      }
      return true;
    };
    absoluteEntries = absoluteEntries.filter(filterCb);
    relativeEntries = relativeEntries.filter(filterCb);
    return isRemoved;
  };
  const cloneTo = (toStack) => {
    absoluteEntries.forEach((entry) => {
      toStack.add(entry.middleware, { ...entry });
    });
    relativeEntries.forEach((entry) => {
      toStack.addRelativeTo(entry.middleware, { ...entry });
    });
    toStack.identifyOnResolve?.(stack.identifyOnResolve());
    return toStack;
  };
  const expandRelativeMiddlewareList = (from) => {
    const expandedMiddlewareList = [];
    from.before.forEach((entry) => {
      if (entry.before.length === 0 && entry.after.length === 0) {
        expandedMiddlewareList.push(entry);
      } else {
        expandedMiddlewareList.push(...expandRelativeMiddlewareList(entry));
      }
    });
    expandedMiddlewareList.push(from);
    from.after.reverse().forEach((entry) => {
      if (entry.before.length === 0 && entry.after.length === 0) {
        expandedMiddlewareList.push(entry);
      } else {
        expandedMiddlewareList.push(...expandRelativeMiddlewareList(entry));
      }
    });
    return expandedMiddlewareList;
  };
  const getMiddlewareList = (debug = false) => {
    const normalizedAbsoluteEntries = [];
    const normalizedRelativeEntries = [];
    const normalizedEntriesNameMap = {};
    absoluteEntries.forEach((entry) => {
      const normalizedEntry = {
        ...entry,
        before: [],
        after: []
      };
      for (const alias of getAllAliases(normalizedEntry.name, normalizedEntry.aliases)) {
        normalizedEntriesNameMap[alias] = normalizedEntry;
      }
      normalizedAbsoluteEntries.push(normalizedEntry);
    });
    relativeEntries.forEach((entry) => {
      const normalizedEntry = {
        ...entry,
        before: [],
        after: []
      };
      for (const alias of getAllAliases(normalizedEntry.name, normalizedEntry.aliases)) {
        normalizedEntriesNameMap[alias] = normalizedEntry;
      }
      normalizedRelativeEntries.push(normalizedEntry);
    });
    normalizedRelativeEntries.forEach((entry) => {
      if (entry.toMiddleware) {
        const toMiddleware = normalizedEntriesNameMap[entry.toMiddleware];
        if (toMiddleware === void 0) {
          if (debug) {
            return;
          }
          throw new Error(`${entry.toMiddleware} is not found when adding ${getMiddlewareNameWithAliases(entry.name, entry.aliases)} middleware ${entry.relation} ${entry.toMiddleware}`);
        }
        if (entry.relation === "after") {
          toMiddleware.after.push(entry);
        }
        if (entry.relation === "before") {
          toMiddleware.before.push(entry);
        }
      }
    });
    const mainChain = sort(normalizedAbsoluteEntries).map(expandRelativeMiddlewareList).reduce((wholeList, expandedMiddlewareList) => {
      wholeList.push(...expandedMiddlewareList);
      return wholeList;
    }, []);
    return mainChain;
  };
  const stack = {
    add: (middleware, options = {}) => {
      const { name, override, aliases: _aliases } = options;
      const entry = {
        step: "initialize",
        priority: "normal",
        middleware,
        ...options
      };
      const aliases = getAllAliases(name, _aliases);
      if (aliases.length > 0) {
        if (aliases.some((alias) => entriesNameSet.has(alias))) {
          if (!override)
            throw new Error(`Duplicate middleware name '${getMiddlewareNameWithAliases(name, _aliases)}'`);
          for (const alias of aliases) {
            const toOverrideIndex = absoluteEntries.findIndex((entry2) => entry2.name === alias || entry2.aliases?.some((a2) => a2 === alias));
            if (toOverrideIndex === -1) {
              continue;
            }
            const toOverride = absoluteEntries[toOverrideIndex];
            if (toOverride.step !== entry.step || entry.priority !== toOverride.priority) {
              throw new Error(`"${getMiddlewareNameWithAliases(toOverride.name, toOverride.aliases)}" middleware with ${toOverride.priority} priority in ${toOverride.step} step cannot be overridden by "${getMiddlewareNameWithAliases(name, _aliases)}" middleware with ${entry.priority} priority in ${entry.step} step.`);
            }
            absoluteEntries.splice(toOverrideIndex, 1);
          }
        }
        for (const alias of aliases) {
          entriesNameSet.add(alias);
        }
      }
      absoluteEntries.push(entry);
    },
    addRelativeTo: (middleware, options) => {
      const { name, override, aliases: _aliases } = options;
      const entry = {
        middleware,
        ...options
      };
      const aliases = getAllAliases(name, _aliases);
      if (aliases.length > 0) {
        if (aliases.some((alias) => entriesNameSet.has(alias))) {
          if (!override)
            throw new Error(`Duplicate middleware name '${getMiddlewareNameWithAliases(name, _aliases)}'`);
          for (const alias of aliases) {
            const toOverrideIndex = relativeEntries.findIndex((entry2) => entry2.name === alias || entry2.aliases?.some((a2) => a2 === alias));
            if (toOverrideIndex === -1) {
              continue;
            }
            const toOverride = relativeEntries[toOverrideIndex];
            if (toOverride.toMiddleware !== entry.toMiddleware || toOverride.relation !== entry.relation) {
              throw new Error(`"${getMiddlewareNameWithAliases(toOverride.name, toOverride.aliases)}" middleware ${toOverride.relation} "${toOverride.toMiddleware}" middleware cannot be overridden by "${getMiddlewareNameWithAliases(name, _aliases)}" middleware ${entry.relation} "${entry.toMiddleware}" middleware.`);
            }
            relativeEntries.splice(toOverrideIndex, 1);
          }
        }
        for (const alias of aliases) {
          entriesNameSet.add(alias);
        }
      }
      relativeEntries.push(entry);
    },
    clone: () => cloneTo(constructStack()),
    use: (plugin) => {
      plugin.applyToStack(stack);
    },
    remove: (toRemove) => {
      if (typeof toRemove === "string")
        return removeByName(toRemove);
      else
        return removeByReference(toRemove);
    },
    removeByTag: (toRemove) => {
      let isRemoved = false;
      const filterCb = (entry) => {
        const { tags, name, aliases: _aliases } = entry;
        if (tags && tags.includes(toRemove)) {
          const aliases = getAllAliases(name, _aliases);
          for (const alias of aliases) {
            entriesNameSet.delete(alias);
          }
          isRemoved = true;
          return false;
        }
        return true;
      };
      absoluteEntries = absoluteEntries.filter(filterCb);
      relativeEntries = relativeEntries.filter(filterCb);
      return isRemoved;
    },
    concat: (from) => {
      const cloned = cloneTo(constructStack());
      cloned.use(from);
      cloned.identifyOnResolve(identifyOnResolve || cloned.identifyOnResolve() || (from.identifyOnResolve?.() ?? false));
      return cloned;
    },
    applyToStack: cloneTo,
    identify: () => {
      return getMiddlewareList(true).map((mw) => {
        const step = mw.step ?? mw.relation + " " + mw.toMiddleware;
        return getMiddlewareNameWithAliases(mw.name, mw.aliases) + " - " + step;
      });
    },
    identifyOnResolve(toggle) {
      if (typeof toggle === "boolean")
        identifyOnResolve = toggle;
      return identifyOnResolve;
    },
    resolve: (handler, context) => {
      for (const middleware of getMiddlewareList().map((entry) => entry.middleware).reverse()) {
        handler = middleware(handler, context);
      }
      if (identifyOnResolve) {
        console.log(stack.identify());
      }
      return handler;
    }
  };
  return stack;
};
const stepWeights = {
  initialize: 5,
  serialize: 4,
  build: 3,
  finalizeRequest: 2,
  deserialize: 1
};
const priorityWeights = {
  high: 3,
  normal: 2,
  low: 1
};
class Client {
  config;
  middlewareStack = constructStack();
  initConfig;
  handlers;
  constructor(config) {
    this.config = config;
    const { protocol, protocolSettings } = config;
    if (protocolSettings) {
      if (typeof protocol === "function") {
        config.protocol = new protocol(protocolSettings);
      }
    }
  }
  send(command, optionsOrCb, cb2) {
    const options = typeof optionsOrCb !== "function" ? optionsOrCb : void 0;
    const callback = typeof optionsOrCb === "function" ? optionsOrCb : cb2;
    const useHandlerCache = options === void 0 && this.config.cacheMiddleware === true;
    let handler;
    if (useHandlerCache) {
      if (!this.handlers) {
        this.handlers = /* @__PURE__ */ new WeakMap();
      }
      const handlers = this.handlers;
      if (handlers.has(command.constructor)) {
        handler = handlers.get(command.constructor);
      } else {
        handler = command.resolveMiddleware(this.middlewareStack, this.config, options);
        handlers.set(command.constructor, handler);
      }
    } else {
      delete this.handlers;
      handler = command.resolveMiddleware(this.middlewareStack, this.config, options);
    }
    if (callback) {
      handler(command).then((result) => callback(null, result.output), (err) => callback(err)).catch(() => {
      });
    } else {
      return handler(command).then((result) => result.output);
    }
  }
  destroy() {
    this.config?.requestHandler?.destroy?.();
    delete this.handlers;
  }
}
const collectBody$1 = async (streamBody = new Uint8Array(), context) => {
  if (streamBody instanceof Uint8Array) {
    return Uint8ArrayBlobAdapter.mutate(streamBody);
  }
  if (!streamBody) {
    return Uint8ArrayBlobAdapter.mutate(new Uint8Array());
  }
  const fromContext = context.streamCollector(streamBody);
  return Uint8ArrayBlobAdapter.mutate(await fromContext);
};
function extendedEncodeURIComponent(str) {
  return encodeURIComponent(str).replace(/[!'()*]/g, function(c2) {
    return "%" + c2.charCodeAt(0).toString(16).toUpperCase();
  });
}
const deref = (schemaRef) => {
  if (typeof schemaRef === "function") {
    return schemaRef();
  }
  return schemaRef;
};
const operation = (namespace, name, traits, input, output) => ({
  name,
  namespace,
  traits,
  input,
  output
});
const schemaDeserializationMiddleware = (config) => (next, context) => async (args) => {
  const { response } = await next(args);
  const { operationSchema } = getSmithyContext(context);
  const [, ns, n2, t8, i2, o2] = operationSchema ?? [];
  try {
    const parsed = await config.protocol.deserializeResponse(operation(ns, n2, t8, i2, o2), {
      ...config,
      ...context
    }, response);
    return {
      response,
      output: parsed
    };
  } catch (error) {
    Object.defineProperty(error, "$response", {
      value: response,
      enumerable: false,
      writable: false,
      configurable: false
    });
    if (!("$metadata" in error)) {
      const hint = `Deserialization error: to see the raw response, inspect the hidden field {error}.$response on this object.`;
      try {
        error.message += "\n  " + hint;
      } catch (e2) {
        if (!context.logger || context.logger?.constructor?.name === "NoOpLogger") {
          console.warn(hint);
        } else {
          context.logger?.warn?.(hint);
        }
      }
      if (typeof error.$responseBodyText !== "undefined") {
        if (error.$response) {
          error.$response.body = error.$responseBodyText;
        }
      }
      try {
        if (HttpResponse.isInstance(response)) {
          const { headers = {} } = response;
          const headerEntries = Object.entries(headers);
          error.$metadata = {
            httpStatusCode: response.statusCode,
            requestId: findHeader(/^x-[\w-]+-request-?id$/, headerEntries),
            extendedRequestId: findHeader(/^x-[\w-]+-id-2$/, headerEntries),
            cfId: findHeader(/^x-[\w-]+-cf-id$/, headerEntries)
          };
        }
      } catch (e2) {
      }
    }
    throw error;
  }
};
const findHeader = (pattern, headers) => {
  return (headers.find(([k2]) => {
    return k2.match(pattern);
  }) || [void 0, void 0])[1];
};
function parseQueryString(querystring) {
  const query = {};
  querystring = querystring.replace(/^\?/, "");
  if (querystring) {
    for (const pair of querystring.split("&")) {
      let [key, value = null] = pair.split("=");
      key = decodeURIComponent(key);
      if (value) {
        value = decodeURIComponent(value);
      }
      if (!(key in query)) {
        query[key] = value;
      } else if (Array.isArray(query[key])) {
        query[key].push(value);
      } else {
        query[key] = [query[key], value];
      }
    }
  }
  return query;
}
const parseUrl = (url) => {
  if (typeof url === "string") {
    return parseUrl(new URL(url));
  }
  const { hostname, pathname, port, protocol, search } = url;
  let query;
  if (search) {
    query = parseQueryString(search);
  }
  return {
    hostname,
    port: port ? parseInt(port) : void 0,
    protocol,
    path: pathname,
    query
  };
};
const toEndpointV1$1 = (endpoint) => {
  if (typeof endpoint === "object") {
    if ("url" in endpoint) {
      const v1Endpoint = parseUrl(endpoint.url);
      if (endpoint.headers) {
        v1Endpoint.headers = {};
        for (const [name, values] of Object.entries(endpoint.headers)) {
          v1Endpoint.headers[name.toLowerCase()] = values.join(", ");
        }
      }
      return v1Endpoint;
    }
    return endpoint;
  }
  return parseUrl(endpoint);
};
const schemaSerializationMiddleware = (config) => (next, context) => async (args) => {
  const { operationSchema } = getSmithyContext(context);
  const [, ns, n2, t8, i2, o2] = operationSchema ?? [];
  const endpoint = context.endpointV2 ? async () => toEndpointV1$1(context.endpointV2) : config.endpoint;
  const request2 = await config.protocol.serializeRequest(operation(ns, n2, t8, i2, o2), args.input, {
    ...config,
    ...context,
    endpoint
  });
  return next({
    ...args,
    request: request2
  });
};
const deserializerMiddlewareOption = {
  name: "deserializerMiddleware",
  step: "deserialize",
  tags: ["DESERIALIZER"],
  override: true
};
const serializerMiddlewareOption$1 = {
  name: "serializerMiddleware",
  step: "serialize",
  tags: ["SERIALIZER"],
  override: true
};
function getSchemaSerdePlugin(config) {
  return {
    applyToStack: (commandStack) => {
      commandStack.add(schemaSerializationMiddleware(config), serializerMiddlewareOption$1);
      commandStack.add(schemaDeserializationMiddleware(config), deserializerMiddlewareOption);
      config.protocol.setSerdeContext(config);
    }
  };
}
const traitsCache = [];
function translateTraits(indicator) {
  if (typeof indicator === "object") {
    return indicator;
  }
  indicator = indicator | 0;
  if (traitsCache[indicator]) {
    return traitsCache[indicator];
  }
  const traits = {};
  let i2 = 0;
  for (const trait of [
    "httpLabel",
    "idempotent",
    "idempotencyToken",
    "sensitive",
    "httpPayload",
    "httpResponseCode",
    "httpQueryParams"
  ]) {
    if ((indicator >> i2++ & 1) === 1) {
      traits[trait] = 1;
    }
  }
  return traitsCache[indicator] = traits;
}
const anno = {
  it: /* @__PURE__ */ Symbol.for("@smithy/nor-struct-it"),
  ns: /* @__PURE__ */ Symbol.for("@smithy/ns")
};
const simpleSchemaCacheN = [];
const simpleSchemaCacheS = {};
class NormalizedSchema {
  ref;
  memberName;
  static symbol = /* @__PURE__ */ Symbol.for("@smithy/nor");
  symbol = NormalizedSchema.symbol;
  name;
  schema;
  _isMemberSchema;
  traits;
  memberTraits;
  normalizedTraits;
  constructor(ref, memberName) {
    this.ref = ref;
    this.memberName = memberName;
    const traitStack = [];
    let _ref = ref;
    let schema = ref;
    this._isMemberSchema = false;
    while (isMemberSchema(_ref)) {
      traitStack.push(_ref[1]);
      _ref = _ref[0];
      schema = deref(_ref);
      this._isMemberSchema = true;
    }
    if (traitStack.length > 0) {
      this.memberTraits = {};
      for (let i2 = traitStack.length - 1; i2 >= 0; --i2) {
        const traitSet = traitStack[i2];
        Object.assign(this.memberTraits, translateTraits(traitSet));
      }
    } else {
      this.memberTraits = 0;
    }
    if (schema instanceof NormalizedSchema) {
      const computedMemberTraits = this.memberTraits;
      Object.assign(this, schema);
      this.memberTraits = Object.assign({}, computedMemberTraits, schema.getMemberTraits(), this.getMemberTraits());
      this.normalizedTraits = void 0;
      this.memberName = memberName ?? schema.memberName;
      return;
    }
    this.schema = deref(schema);
    if (isStaticSchema(this.schema)) {
      this.name = `${this.schema[1]}#${this.schema[2]}`;
      this.traits = this.schema[3];
    } else {
      this.name = this.memberName ?? String(schema);
      this.traits = 0;
    }
    if (this._isMemberSchema && !memberName) {
      throw new Error(`@smithy/core/schema - NormalizedSchema member init ${this.getName(true)} missing member name.`);
    }
  }
  static [Symbol.hasInstance](lhs) {
    const isPrototype = this.prototype.isPrototypeOf(lhs);
    if (!isPrototype && typeof lhs === "object" && lhs !== null) {
      const ns = lhs;
      return ns.symbol === this.symbol;
    }
    return isPrototype;
  }
  static of(ref) {
    const keyAble = typeof ref === "function" || typeof ref === "object" && ref !== null;
    if (typeof ref === "number") {
      if (simpleSchemaCacheN[ref]) {
        return simpleSchemaCacheN[ref];
      }
    } else if (typeof ref === "string") {
      if (simpleSchemaCacheS[ref]) {
        return simpleSchemaCacheS[ref];
      }
    } else if (keyAble) {
      if (ref[anno.ns]) {
        return ref[anno.ns];
      }
    }
    const sc = deref(ref);
    if (sc instanceof NormalizedSchema) {
      return sc;
    }
    if (isMemberSchema(sc)) {
      const [ns2, traits] = sc;
      if (ns2 instanceof NormalizedSchema) {
        Object.assign(ns2.getMergedTraits(), translateTraits(traits));
        return ns2;
      }
      throw new Error(`@smithy/core/schema - may not init unwrapped member schema=${JSON.stringify(ref, null, 2)}.`);
    }
    const ns = new NormalizedSchema(sc);
    if (keyAble) {
      return ref[anno.ns] = ns;
    }
    if (typeof sc === "string") {
      return simpleSchemaCacheS[sc] = ns;
    }
    if (typeof sc === "number") {
      return simpleSchemaCacheN[sc] = ns;
    }
    return ns;
  }
  getSchema() {
    const sc = this.schema;
    if (Array.isArray(sc) && sc[0] === 0) {
      return sc[4];
    }
    return sc;
  }
  getName(withNamespace = false) {
    const { name } = this;
    const short = !withNamespace && name && name.includes("#");
    return short ? name.split("#")[1] : name || void 0;
  }
  getMemberName() {
    return this.memberName;
  }
  isMemberSchema() {
    return this._isMemberSchema;
  }
  isListSchema() {
    const sc = this.getSchema();
    return typeof sc === "number" ? sc >= 64 && sc < 128 : sc[0] === 1;
  }
  isMapSchema() {
    const sc = this.getSchema();
    return typeof sc === "number" ? sc >= 128 && sc <= 255 : sc[0] === 2;
  }
  isStructSchema() {
    const sc = this.getSchema();
    if (typeof sc !== "object") {
      return false;
    }
    const id = sc[0];
    return id === 3 || id === -3 || id === 4;
  }
  isUnionSchema() {
    const sc = this.getSchema();
    if (typeof sc !== "object") {
      return false;
    }
    return sc[0] === 4;
  }
  isBlobSchema() {
    const sc = this.getSchema();
    return sc === 21 || sc === 42;
  }
  isTimestampSchema() {
    const sc = this.getSchema();
    return typeof sc === "number" && sc >= 4 && sc <= 7;
  }
  isUnitSchema() {
    return this.getSchema() === "unit";
  }
  isDocumentSchema() {
    return this.getSchema() === 15;
  }
  isStringSchema() {
    return this.getSchema() === 0;
  }
  isBooleanSchema() {
    return this.getSchema() === 2;
  }
  isNumericSchema() {
    return this.getSchema() === 1;
  }
  isBigIntegerSchema() {
    return this.getSchema() === 17;
  }
  isBigDecimalSchema() {
    return this.getSchema() === 19;
  }
  isStreaming() {
    const { streaming } = this.getMergedTraits();
    return !!streaming || this.getSchema() === 42;
  }
  isIdempotencyToken() {
    return !!this.getMergedTraits().idempotencyToken;
  }
  getMergedTraits() {
    return this.normalizedTraits ?? (this.normalizedTraits = {
      ...this.getOwnTraits(),
      ...this.getMemberTraits()
    });
  }
  getMemberTraits() {
    return translateTraits(this.memberTraits);
  }
  getOwnTraits() {
    return translateTraits(this.traits);
  }
  getKeySchema() {
    const [isDoc, isMap] = [this.isDocumentSchema(), this.isMapSchema()];
    if (!isDoc && !isMap) {
      throw new Error(`@smithy/core/schema - cannot get key for non-map: ${this.getName(true)}`);
    }
    const schema = this.getSchema();
    const memberSchema = isDoc ? 15 : schema[4] ?? 0;
    return member([memberSchema, 0], "key");
  }
  getValueSchema() {
    const sc = this.getSchema();
    const [isDoc, isMap, isList] = [this.isDocumentSchema(), this.isMapSchema(), this.isListSchema()];
    const memberSchema = typeof sc === "number" ? 63 & sc : sc && typeof sc === "object" && (isMap || isList) ? sc[3 + sc[0]] : isDoc ? 15 : void 0;
    if (memberSchema != null) {
      return member([memberSchema, 0], isMap ? "value" : "member");
    }
    throw new Error(`@smithy/core/schema - ${this.getName(true)} has no value member.`);
  }
  getMemberSchema(memberName) {
    const struct = this.getSchema();
    if (this.isStructSchema() && struct[4].includes(memberName)) {
      const i2 = struct[4].indexOf(memberName);
      const memberSchema = struct[5][i2];
      return member(isMemberSchema(memberSchema) ? memberSchema : [memberSchema, 0], memberName);
    }
    if (this.isDocumentSchema()) {
      return member([15, 0], memberName);
    }
    throw new Error(`@smithy/core/schema - ${this.getName(true)} has no member=${memberName}.`);
  }
  getMemberSchemas() {
    const buffer = {};
    try {
      for (const [k2, v2] of this.structIterator()) {
        buffer[k2] = v2;
      }
    } catch (ignored) {
    }
    return buffer;
  }
  getEventStreamMember() {
    if (this.isStructSchema()) {
      for (const [memberName, memberSchema] of this.structIterator()) {
        if (memberSchema.isStreaming() && memberSchema.isStructSchema()) {
          return memberName;
        }
      }
    }
    return "";
  }
  *structIterator() {
    if (this.isUnitSchema()) {
      return;
    }
    if (!this.isStructSchema()) {
      throw new Error("@smithy/core/schema - cannot iterate non-struct schema.");
    }
    const struct = this.getSchema();
    const z2 = struct[4].length;
    let it = struct[anno.it];
    if (it && z2 === it.length) {
      yield* it;
      return;
    }
    it = Array(z2);
    for (let i2 = 0; i2 < z2; ++i2) {
      const k2 = struct[4][i2];
      const v2 = member([struct[5][i2], 0], k2);
      yield it[i2] = [k2, v2];
    }
    struct[anno.it] = it;
  }
}
function member(memberSchema, memberName) {
  if (memberSchema instanceof NormalizedSchema) {
    return Object.assign(memberSchema, {
      memberName,
      _isMemberSchema: true
    });
  }
  const internalCtorAccess = NormalizedSchema;
  return new internalCtorAccess(memberSchema, memberName);
}
const isMemberSchema = (sc) => Array.isArray(sc) && sc.length === 2;
const isStaticSchema = (sc) => Array.isArray(sc) && sc.length >= 5;
class TypeRegistry {
  namespace;
  schemas;
  exceptions;
  static registries = /* @__PURE__ */ new Map();
  constructor(namespace, schemas = /* @__PURE__ */ new Map(), exceptions = /* @__PURE__ */ new Map()) {
    this.namespace = namespace;
    this.schemas = schemas;
    this.exceptions = exceptions;
  }
  static for(namespace) {
    if (!TypeRegistry.registries.has(namespace)) {
      TypeRegistry.registries.set(namespace, new TypeRegistry(namespace));
    }
    return TypeRegistry.registries.get(namespace);
  }
  copyFrom(other) {
    const { schemas, exceptions } = this;
    for (const [k2, v2] of other.schemas) {
      if (!schemas.has(k2)) {
        schemas.set(k2, v2);
      }
    }
    for (const [k2, v2] of other.exceptions) {
      if (!exceptions.has(k2)) {
        exceptions.set(k2, v2);
      }
    }
  }
  register(shapeId, schema) {
    const qualifiedName = this.normalizeShapeId(shapeId);
    for (const r2 of [this, TypeRegistry.for(qualifiedName.split("#")[0])]) {
      r2.schemas.set(qualifiedName, schema);
    }
  }
  getSchema(shapeId) {
    const id = this.normalizeShapeId(shapeId);
    if (!this.schemas.has(id)) {
      throw new Error(`@smithy/core/schema - schema not found for ${id}`);
    }
    return this.schemas.get(id);
  }
  registerError(es, ctor) {
    const $error = es;
    const ns = $error[1];
    for (const r2 of [this, TypeRegistry.for(ns)]) {
      r2.schemas.set(ns + "#" + $error[2], $error);
      r2.exceptions.set($error, ctor);
    }
  }
  getErrorCtor(es) {
    const $error = es;
    if (this.exceptions.has($error)) {
      return this.exceptions.get($error);
    }
    const registry = TypeRegistry.for($error[1]);
    return registry.exceptions.get($error);
  }
  getBaseException() {
    for (const exceptionKey of this.exceptions.keys()) {
      if (Array.isArray(exceptionKey)) {
        const [, ns, name] = exceptionKey;
        const id = ns + "#" + name;
        if (id.startsWith("smithy.ts.sdk.synthetic.") && id.endsWith("ServiceException")) {
          return exceptionKey;
        }
      }
    }
    return void 0;
  }
  find(predicate) {
    return [...this.schemas.values()].find(predicate);
  }
  clear() {
    this.schemas.clear();
    this.exceptions.clear();
  }
  normalizeShapeId(shapeId) {
    if (shapeId.includes("#")) {
      return shapeId;
    }
    return this.namespace + "#" + shapeId;
  }
}
const expectNumber = (value) => {
  if (value === null || value === void 0) {
    return void 0;
  }
  if (typeof value === "string") {
    const parsed = parseFloat(value);
    if (!Number.isNaN(parsed)) {
      if (String(parsed) !== String(value)) {
        logger.warn(stackTraceWarning(`Expected number but observed string: ${value}`));
      }
      return parsed;
    }
  }
  if (typeof value === "number") {
    return value;
  }
  throw new TypeError(`Expected number, got ${typeof value}: ${value}`);
};
const MAX_FLOAT = Math.ceil(2 ** 127 * (2 - 2 ** -23));
const expectFloat32 = (value) => {
  const expected = expectNumber(value);
  if (expected !== void 0 && !Number.isNaN(expected) && expected !== Infinity && expected !== -Infinity) {
    if (Math.abs(expected) > MAX_FLOAT) {
      throw new TypeError(`Expected 32-bit float, got ${value}`);
    }
  }
  return expected;
};
const expectLong = (value) => {
  if (value === null || value === void 0) {
    return void 0;
  }
  if (Number.isInteger(value) && !Number.isNaN(value)) {
    return value;
  }
  throw new TypeError(`Expected integer, got ${typeof value}: ${value}`);
};
const expectShort = (value) => expectSizedInt(value, 16);
const expectByte = (value) => expectSizedInt(value, 8);
const expectSizedInt = (value, size) => {
  const expected = expectLong(value);
  if (expected !== void 0 && castInt(expected, size) !== expected) {
    throw new TypeError(`Expected ${size}-bit integer, got ${value}`);
  }
  return expected;
};
const castInt = (value, size) => {
  switch (size) {
    case 32:
      return Int32Array.of(value)[0];
    case 16:
      return Int16Array.of(value)[0];
    case 8:
      return Int8Array.of(value)[0];
  }
};
const strictParseDouble = (value) => {
  if (typeof value == "string") {
    return expectNumber(parseNumber(value));
  }
  return expectNumber(value);
};
const strictParseFloat32 = (value) => {
  if (typeof value == "string") {
    return expectFloat32(parseNumber(value));
  }
  return expectFloat32(value);
};
const NUMBER_REGEX = /(-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?)|(-?Infinity)|(NaN)/g;
const parseNumber = (value) => {
  const matches = value.match(NUMBER_REGEX);
  if (matches === null || matches[0].length !== value.length) {
    throw new TypeError(`Expected real number, got implicit NaN`);
  }
  return parseFloat(value);
};
const strictParseShort = (value) => {
  if (typeof value === "string") {
    return expectShort(parseNumber(value));
  }
  return expectShort(value);
};
const strictParseByte = (value) => {
  if (typeof value === "string") {
    return expectByte(parseNumber(value));
  }
  return expectByte(value);
};
const stackTraceWarning = (message) => {
  return String(new TypeError(message).stack || message).split("\n").slice(0, 5).filter((s2) => !s2.includes("stackTraceWarning")).join("\n");
};
const logger = {
  warn: console.warn
};
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
function dateToUtcString(date2) {
  const year2 = date2.getUTCFullYear();
  const month = date2.getUTCMonth();
  const dayOfWeek = date2.getUTCDay();
  const dayOfMonthInt = date2.getUTCDate();
  const hoursInt = date2.getUTCHours();
  const minutesInt = date2.getUTCMinutes();
  const secondsInt = date2.getUTCSeconds();
  const dayOfMonthString = dayOfMonthInt < 10 ? `0${dayOfMonthInt}` : `${dayOfMonthInt}`;
  const hoursString = hoursInt < 10 ? `0${hoursInt}` : `${hoursInt}`;
  const minutesString = minutesInt < 10 ? `0${minutesInt}` : `${minutesInt}`;
  const secondsString = secondsInt < 10 ? `0${secondsInt}` : `${secondsInt}`;
  return `${DAYS[dayOfWeek]}, ${dayOfMonthString} ${MONTHS[month]} ${year2} ${hoursString}:${minutesString}:${secondsString} GMT`;
}
const RFC3339 = new RegExp(/^(\d{4})-(\d{2})-(\d{2})[tT](\d{2}):(\d{2}):(\d{2})(?:\.(\d+))?[zZ]$/);
const parseRfc3339DateTime = (value) => {
  if (value === null || value === void 0) {
    return void 0;
  }
  if (typeof value !== "string") {
    throw new TypeError("RFC-3339 date-times must be expressed as strings");
  }
  const match = RFC3339.exec(value);
  if (!match) {
    throw new TypeError("Invalid RFC-3339 date-time value");
  }
  const [_, yearStr, monthStr, dayStr, hours, minutes, seconds, fractionalMilliseconds] = match;
  const year2 = strictParseShort(stripLeadingZeroes(yearStr));
  const month = parseDateValue(monthStr, "month", 1, 12);
  const day = parseDateValue(dayStr, "day", 1, 31);
  return buildDate(year2, month, day, { hours, minutes, seconds, fractionalMilliseconds });
};
const RFC3339_WITH_OFFSET$1 = new RegExp(/^(\d{4})-(\d{2})-(\d{2})[tT](\d{2}):(\d{2}):(\d{2})(?:\.(\d+))?(([-+]\d{2}\:\d{2})|[zZ])$/);
const parseRfc3339DateTimeWithOffset = (value) => {
  if (value === null || value === void 0) {
    return void 0;
  }
  if (typeof value !== "string") {
    throw new TypeError("RFC-3339 date-times must be expressed as strings");
  }
  const match = RFC3339_WITH_OFFSET$1.exec(value);
  if (!match) {
    throw new TypeError("Invalid RFC-3339 date-time value");
  }
  const [_, yearStr, monthStr, dayStr, hours, minutes, seconds, fractionalMilliseconds, offsetStr] = match;
  const year2 = strictParseShort(stripLeadingZeroes(yearStr));
  const month = parseDateValue(monthStr, "month", 1, 12);
  const day = parseDateValue(dayStr, "day", 1, 31);
  const date2 = buildDate(year2, month, day, { hours, minutes, seconds, fractionalMilliseconds });
  if (offsetStr.toUpperCase() != "Z") {
    date2.setTime(date2.getTime() - parseOffsetToMilliseconds(offsetStr));
  }
  return date2;
};
const IMF_FIXDATE$1 = new RegExp(/^(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun), (\d{2}) (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) (\d{4}) (\d{1,2}):(\d{2}):(\d{2})(?:\.(\d+))? GMT$/);
const RFC_850_DATE$1 = new RegExp(/^(?:Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday), (\d{2})-(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)-(\d{2}) (\d{1,2}):(\d{2}):(\d{2})(?:\.(\d+))? GMT$/);
const ASC_TIME$1 = new RegExp(/^(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun) (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) ( [1-9]|\d{2}) (\d{1,2}):(\d{2}):(\d{2})(?:\.(\d+))? (\d{4})$/);
const parseRfc7231DateTime = (value) => {
  if (value === null || value === void 0) {
    return void 0;
  }
  if (typeof value !== "string") {
    throw new TypeError("RFC-7231 date-times must be expressed as strings");
  }
  let match = IMF_FIXDATE$1.exec(value);
  if (match) {
    const [_, dayStr, monthStr, yearStr, hours, minutes, seconds, fractionalMilliseconds] = match;
    return buildDate(strictParseShort(stripLeadingZeroes(yearStr)), parseMonthByShortName(monthStr), parseDateValue(dayStr, "day", 1, 31), { hours, minutes, seconds, fractionalMilliseconds });
  }
  match = RFC_850_DATE$1.exec(value);
  if (match) {
    const [_, dayStr, monthStr, yearStr, hours, minutes, seconds, fractionalMilliseconds] = match;
    return adjustRfc850Year(buildDate(parseTwoDigitYear(yearStr), parseMonthByShortName(monthStr), parseDateValue(dayStr, "day", 1, 31), {
      hours,
      minutes,
      seconds,
      fractionalMilliseconds
    }));
  }
  match = ASC_TIME$1.exec(value);
  if (match) {
    const [_, monthStr, dayStr, hours, minutes, seconds, fractionalMilliseconds, yearStr] = match;
    return buildDate(strictParseShort(stripLeadingZeroes(yearStr)), parseMonthByShortName(monthStr), parseDateValue(dayStr.trimLeft(), "day", 1, 31), { hours, minutes, seconds, fractionalMilliseconds });
  }
  throw new TypeError("Invalid RFC-7231 date-time value");
};
const parseEpochTimestamp = (value) => {
  if (value === null || value === void 0) {
    return void 0;
  }
  let valueAsDouble;
  if (typeof value === "number") {
    valueAsDouble = value;
  } else if (typeof value === "string") {
    valueAsDouble = strictParseDouble(value);
  } else if (typeof value === "object" && value.tag === 1) {
    valueAsDouble = value.value;
  } else {
    throw new TypeError("Epoch timestamps must be expressed as floating point numbers or their string representation");
  }
  if (Number.isNaN(valueAsDouble) || valueAsDouble === Infinity || valueAsDouble === -Infinity) {
    throw new TypeError("Epoch timestamps must be valid, non-Infinite, non-NaN numerics");
  }
  return new Date(Math.round(valueAsDouble * 1e3));
};
const buildDate = (year2, month, day, time2) => {
  const adjustedMonth = month - 1;
  validateDayOfMonth(year2, adjustedMonth, day);
  return new Date(Date.UTC(year2, adjustedMonth, day, parseDateValue(time2.hours, "hour", 0, 23), parseDateValue(time2.minutes, "minute", 0, 59), parseDateValue(time2.seconds, "seconds", 0, 60), parseMilliseconds(time2.fractionalMilliseconds)));
};
const parseTwoDigitYear = (value) => {
  const thisYear = (/* @__PURE__ */ new Date()).getUTCFullYear();
  const valueInThisCentury = Math.floor(thisYear / 100) * 100 + strictParseShort(stripLeadingZeroes(value));
  if (valueInThisCentury < thisYear) {
    return valueInThisCentury + 100;
  }
  return valueInThisCentury;
};
const FIFTY_YEARS_IN_MILLIS = 50 * 365 * 24 * 60 * 60 * 1e3;
const adjustRfc850Year = (input) => {
  if (input.getTime() - (/* @__PURE__ */ new Date()).getTime() > FIFTY_YEARS_IN_MILLIS) {
    return new Date(Date.UTC(input.getUTCFullYear() - 100, input.getUTCMonth(), input.getUTCDate(), input.getUTCHours(), input.getUTCMinutes(), input.getUTCSeconds(), input.getUTCMilliseconds()));
  }
  return input;
};
const parseMonthByShortName = (value) => {
  const monthIdx = MONTHS.indexOf(value);
  if (monthIdx < 0) {
    throw new TypeError(`Invalid month: ${value}`);
  }
  return monthIdx + 1;
};
const DAYS_IN_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const validateDayOfMonth = (year2, month, day) => {
  let maxDays = DAYS_IN_MONTH[month];
  if (month === 1 && isLeapYear(year2)) {
    maxDays = 29;
  }
  if (day > maxDays) {
    throw new TypeError(`Invalid day for ${MONTHS[month]} in ${year2}: ${day}`);
  }
};
const isLeapYear = (year2) => {
  return year2 % 4 === 0 && (year2 % 100 !== 0 || year2 % 400 === 0);
};
const parseDateValue = (value, type, lower, upper) => {
  const dateVal = strictParseByte(stripLeadingZeroes(value));
  if (dateVal < lower || dateVal > upper) {
    throw new TypeError(`${type} must be between ${lower} and ${upper}, inclusive`);
  }
  return dateVal;
};
const parseMilliseconds = (value) => {
  if (value === null || value === void 0) {
    return 0;
  }
  return strictParseFloat32("0." + value) * 1e3;
};
const parseOffsetToMilliseconds = (value) => {
  const directionStr = value[0];
  let direction = 1;
  if (directionStr == "+") {
    direction = 1;
  } else if (directionStr == "-") {
    direction = -1;
  } else {
    throw new TypeError(`Offset direction, ${directionStr}, must be "+" or "-"`);
  }
  const hour = Number(value.substring(1, 3));
  const minute = Number(value.substring(4, 6));
  return direction * (hour * 60 + minute) * 60 * 1e3;
};
const stripLeadingZeroes = (value) => {
  let idx = 0;
  while (idx < value.length - 1 && value.charAt(idx) === "0") {
    idx++;
  }
  if (idx === 0) {
    return value;
  }
  return value.slice(idx);
};
const randomUUID = crypto$1.randomUUID.bind(crypto$1);
const decimalToHex = Array.from({ length: 256 }, (_, i2) => i2.toString(16).padStart(2, "0"));
const v4 = () => {
  if (randomUUID) {
    return randomUUID();
  }
  const rnds = new Uint8Array(16);
  crypto.getRandomValues(rnds);
  rnds[6] = rnds[6] & 15 | 64;
  rnds[8] = rnds[8] & 63 | 128;
  return decimalToHex[rnds[0]] + decimalToHex[rnds[1]] + decimalToHex[rnds[2]] + decimalToHex[rnds[3]] + "-" + decimalToHex[rnds[4]] + decimalToHex[rnds[5]] + "-" + decimalToHex[rnds[6]] + decimalToHex[rnds[7]] + "-" + decimalToHex[rnds[8]] + decimalToHex[rnds[9]] + "-" + decimalToHex[rnds[10]] + decimalToHex[rnds[11]] + decimalToHex[rnds[12]] + decimalToHex[rnds[13]] + decimalToHex[rnds[14]] + decimalToHex[rnds[15]];
};
const LazyJsonString = function LazyJsonString2(val) {
  const str = Object.assign(new String(val), {
    deserializeJSON() {
      return JSON.parse(String(val));
    },
    toString() {
      return String(val);
    },
    toJSON() {
      return String(val);
    }
  });
  return str;
};
LazyJsonString.from = (object) => {
  if (object && typeof object === "object" && (object instanceof LazyJsonString || "deserializeJSON" in object)) {
    return object;
  } else if (typeof object === "string" || Object.getPrototypeOf(object) === String.prototype) {
    return LazyJsonString(String(object));
  }
  return LazyJsonString(JSON.stringify(object));
};
LazyJsonString.fromObject = LazyJsonString.from;
function quoteHeader(part) {
  if (part.includes(",") || part.includes('"')) {
    part = `"${part.replace(/"/g, '\\"')}"`;
  }
  return part;
}
const ddd = `(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun)(?:[ne|u?r]?s?day)?`;
const mmm = `(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)`;
const time = `(\\d?\\d):(\\d{2}):(\\d{2})(?:\\.(\\d+))?`;
const date = `(\\d?\\d)`;
const year = `(\\d{4})`;
const RFC3339_WITH_OFFSET = new RegExp(/^(\d{4})-(\d\d)-(\d\d)[tT](\d\d):(\d\d):(\d\d)(\.(\d+))?(([-+]\d\d:\d\d)|[zZ])$/);
const IMF_FIXDATE = new RegExp(`^${ddd}, ${date} ${mmm} ${year} ${time} GMT$`);
const RFC_850_DATE = new RegExp(`^${ddd}, ${date}-${mmm}-(\\d\\d) ${time} GMT$`);
const ASC_TIME = new RegExp(`^${ddd} ${mmm} ( [1-9]|\\d\\d) ${time} ${year}$`);
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const _parseEpochTimestamp = (value) => {
  if (value == null) {
    return void 0;
  }
  let num = NaN;
  if (typeof value === "number") {
    num = value;
  } else if (typeof value === "string") {
    if (!/^-?\d*\.?\d+$/.test(value)) {
      throw new TypeError(`parseEpochTimestamp - numeric string invalid.`);
    }
    num = Number.parseFloat(value);
  } else if (typeof value === "object" && value.tag === 1) {
    num = value.value;
  }
  if (isNaN(num) || Math.abs(num) === Infinity) {
    throw new TypeError("Epoch timestamps must be valid finite numbers.");
  }
  return new Date(Math.round(num * 1e3));
};
const _parseRfc3339DateTimeWithOffset = (value) => {
  if (value == null) {
    return void 0;
  }
  if (typeof value !== "string") {
    throw new TypeError("RFC3339 timestamps must be strings");
  }
  const matches = RFC3339_WITH_OFFSET.exec(value);
  if (!matches) {
    throw new TypeError(`Invalid RFC3339 timestamp format ${value}`);
  }
  const [, yearStr, monthStr, dayStr, hours, minutes, seconds, , ms, offsetStr] = matches;
  range(monthStr, 1, 12);
  range(dayStr, 1, 31);
  range(hours, 0, 23);
  range(minutes, 0, 59);
  range(seconds, 0, 60);
  const date2 = new Date(Date.UTC(Number(yearStr), Number(monthStr) - 1, Number(dayStr), Number(hours), Number(minutes), Number(seconds), Number(ms) ? Math.round(parseFloat(`0.${ms}`) * 1e3) : 0));
  date2.setUTCFullYear(Number(yearStr));
  if (offsetStr.toUpperCase() != "Z") {
    const [, sign, offsetH, offsetM] = /([+-])(\d\d):(\d\d)/.exec(offsetStr) || [void 0, "+", 0, 0];
    const scalar = sign === "-" ? 1 : -1;
    date2.setTime(date2.getTime() + scalar * (Number(offsetH) * 60 * 60 * 1e3 + Number(offsetM) * 60 * 1e3));
  }
  return date2;
};
const _parseRfc7231DateTime = (value) => {
  if (value == null) {
    return void 0;
  }
  if (typeof value !== "string") {
    throw new TypeError("RFC7231 timestamps must be strings.");
  }
  let day;
  let month;
  let year2;
  let hour;
  let minute;
  let second;
  let fraction;
  let matches;
  if (matches = IMF_FIXDATE.exec(value)) {
    [, day, month, year2, hour, minute, second, fraction] = matches;
  } else if (matches = RFC_850_DATE.exec(value)) {
    [, day, month, year2, hour, minute, second, fraction] = matches;
    year2 = (Number(year2) + 1900).toString();
  } else if (matches = ASC_TIME.exec(value)) {
    [, month, day, hour, minute, second, fraction, year2] = matches;
  }
  if (year2 && second) {
    const timestamp = Date.UTC(Number(year2), months.indexOf(month), Number(day), Number(hour), Number(minute), Number(second), fraction ? Math.round(parseFloat(`0.${fraction}`) * 1e3) : 0);
    range(day, 1, 31);
    range(hour, 0, 23);
    range(minute, 0, 59);
    range(second, 0, 60);
    const date2 = new Date(timestamp);
    date2.setUTCFullYear(Number(year2));
    return date2;
  }
  throw new TypeError(`Invalid RFC7231 date-time value ${value}.`);
};
function range(v2, min, max) {
  const _v = Number(v2);
  if (_v < min || _v > max) {
    throw new Error(`Value ${_v} out of range [${min}, ${max}]`);
  }
}
function splitEvery(value, delimiter, numDelimiters) {
  if (!Number.isInteger(numDelimiters)) {
    throw new Error("Invalid number of delimiters (" + numDelimiters + ") for splitEvery.");
  }
  const segments = value.split(delimiter);
  const compoundSegments = [];
  let currentSegment = "";
  for (let i2 = 0; i2 < segments.length; i2++) {
    if (currentSegment === "") {
      currentSegment = segments[i2];
    } else {
      currentSegment += delimiter + segments[i2];
    }
    if ((i2 + 1) % numDelimiters === 0) {
      compoundSegments.push(currentSegment);
      currentSegment = "";
    }
  }
  if (currentSegment !== "") {
    compoundSegments.push(currentSegment);
  }
  return compoundSegments;
}
const splitHeader = (value) => {
  const z2 = value.length;
  const values = [];
  let withinQuotes = false;
  let prevChar = void 0;
  let anchor = 0;
  for (let i2 = 0; i2 < z2; ++i2) {
    const char = value[i2];
    switch (char) {
      case `"`:
        if (prevChar !== "\\") {
          withinQuotes = !withinQuotes;
        }
        break;
      case ",":
        if (!withinQuotes) {
          values.push(value.slice(anchor, i2));
          anchor = i2 + 1;
        }
        break;
    }
    prevChar = char;
  }
  values.push(value.slice(anchor));
  return values.map((v2) => {
    v2 = v2.trim();
    const z3 = v2.length;
    if (z3 < 2) {
      return v2;
    }
    if (v2[0] === `"` && v2[z3 - 1] === `"`) {
      v2 = v2.slice(1, z3 - 1);
    }
    return v2.replace(/\\"/g, '"');
  });
};
const format = /^-?\d*(\.\d+)?$/;
class NumericValue {
  string;
  type;
  constructor(string, type) {
    this.string = string;
    this.type = type;
    if (!format.test(string)) {
      throw new Error(`@smithy/core/serde - NumericValue must only contain [0-9], at most one decimal point ".", and an optional negation prefix "-".`);
    }
  }
  toString() {
    return this.string;
  }
  static [Symbol.hasInstance](object) {
    if (!object || typeof object !== "object") {
      return false;
    }
    const _nv = object;
    return NumericValue.prototype.isPrototypeOf(object) || _nv.type === "bigDecimal" && format.test(_nv.string);
  }
}
class SerdeContext {
  serdeContext;
  setSerdeContext(serdeContext) {
    this.serdeContext = serdeContext;
  }
}
class HttpProtocol extends SerdeContext {
  options;
  compositeErrorRegistry;
  constructor(options) {
    super();
    this.options = options;
    this.compositeErrorRegistry = TypeRegistry.for(options.defaultNamespace);
    for (const etr of options.errorTypeRegistries ?? []) {
      this.compositeErrorRegistry.copyFrom(etr);
    }
  }
  getRequestType() {
    return HttpRequest;
  }
  getResponseType() {
    return HttpResponse;
  }
  setSerdeContext(serdeContext) {
    this.serdeContext = serdeContext;
    this.serializer.setSerdeContext(serdeContext);
    this.deserializer.setSerdeContext(serdeContext);
    if (this.getPayloadCodec()) {
      this.getPayloadCodec().setSerdeContext(serdeContext);
    }
  }
  updateServiceEndpoint(request2, endpoint) {
    if ("url" in endpoint) {
      request2.protocol = endpoint.url.protocol;
      request2.hostname = endpoint.url.hostname;
      request2.port = endpoint.url.port ? Number(endpoint.url.port) : void 0;
      request2.path = endpoint.url.pathname;
      request2.fragment = endpoint.url.hash || void 0;
      request2.username = endpoint.url.username || void 0;
      request2.password = endpoint.url.password || void 0;
      if (!request2.query) {
        request2.query = {};
      }
      for (const [k2, v2] of endpoint.url.searchParams.entries()) {
        request2.query[k2] = v2;
      }
      if (endpoint.headers) {
        for (const [name, values] of Object.entries(endpoint.headers)) {
          request2.headers[name] = values.join(", ");
        }
      }
      return request2;
    } else {
      request2.protocol = endpoint.protocol;
      request2.hostname = endpoint.hostname;
      request2.port = endpoint.port ? Number(endpoint.port) : void 0;
      request2.path = endpoint.path;
      request2.query = {
        ...endpoint.query
      };
      if (endpoint.headers) {
        for (const [name, value] of Object.entries(endpoint.headers)) {
          request2.headers[name] = value;
        }
      }
      return request2;
    }
  }
  setHostPrefix(request2, operationSchema, input) {
    if (this.serdeContext?.disableHostPrefix) {
      return;
    }
    const inputNs = NormalizedSchema.of(operationSchema.input);
    const opTraits = translateTraits(operationSchema.traits ?? {});
    if (opTraits.endpoint) {
      let hostPrefix = opTraits.endpoint?.[0];
      if (typeof hostPrefix === "string") {
        const hostLabelInputs = [...inputNs.structIterator()].filter(([, member2]) => member2.getMergedTraits().hostLabel);
        for (const [name] of hostLabelInputs) {
          const replacement = input[name];
          if (typeof replacement !== "string") {
            throw new Error(`@smithy/core/schema - ${name} in input must be a string as hostLabel.`);
          }
          hostPrefix = hostPrefix.replace(`{${name}}`, replacement);
        }
        request2.hostname = hostPrefix + request2.hostname;
      }
    }
  }
  deserializeMetadata(output) {
    return {
      httpStatusCode: output.statusCode,
      requestId: output.headers["x-amzn-requestid"] ?? output.headers["x-amzn-request-id"] ?? output.headers["x-amz-request-id"],
      extendedRequestId: output.headers["x-amz-id-2"],
      cfId: output.headers["x-amz-cf-id"]
    };
  }
  async serializeEventStream({ eventStream, requestSchema, initialRequest }) {
    const eventStreamSerde = await this.loadEventStreamCapability();
    return eventStreamSerde.serializeEventStream({
      eventStream,
      requestSchema,
      initialRequest
    });
  }
  async deserializeEventStream({ response, responseSchema, initialResponseContainer }) {
    const eventStreamSerde = await this.loadEventStreamCapability();
    return eventStreamSerde.deserializeEventStream({
      response,
      responseSchema,
      initialResponseContainer
    });
  }
  async loadEventStreamCapability() {
    const { EventStreamSerde } = await import("./index_CdwN2pRJ.mjs");
    return new EventStreamSerde({
      marshaller: this.getEventStreamMarshaller(),
      serializer: this.serializer,
      deserializer: this.deserializer,
      serdeContext: this.serdeContext,
      defaultContentType: this.getDefaultContentType()
    });
  }
  getDefaultContentType() {
    throw new Error(`@smithy/core/protocols - ${this.constructor.name} getDefaultContentType() implementation missing.`);
  }
  async deserializeHttpMessage(schema, context, response, arg4, arg5) {
    return [];
  }
  getEventStreamMarshaller() {
    const context = this.serdeContext;
    if (!context.eventStreamMarshaller) {
      throw new Error("@smithy/core - HttpProtocol: eventStreamMarshaller missing in serdeContext.");
    }
    return context.eventStreamMarshaller;
  }
}
class HttpBindingProtocol extends HttpProtocol {
  async serializeRequest(operationSchema, _input, context) {
    const input = _input && typeof _input === "object" ? _input : {};
    const serializer = this.serializer;
    const query = {};
    const headers = {};
    const endpoint = await context.endpoint();
    const ns = NormalizedSchema.of(operationSchema?.input);
    const payloadMemberNames = [];
    const payloadMemberSchemas = [];
    let hasNonHttpBindingMember = false;
    let payload;
    const request2 = new HttpRequest({
      protocol: "",
      hostname: "",
      port: void 0,
      path: "",
      fragment: void 0,
      query,
      headers,
      body: void 0
    });
    if (endpoint) {
      this.updateServiceEndpoint(request2, endpoint);
      this.setHostPrefix(request2, operationSchema, input);
      const opTraits = translateTraits(operationSchema.traits);
      if (opTraits.http) {
        request2.method = opTraits.http[0];
        const [path, search] = opTraits.http[1].split("?");
        if (request2.path == "/") {
          request2.path = path;
        } else {
          request2.path += path;
        }
        const traitSearchParams = new URLSearchParams(search ?? "");
        Object.assign(query, Object.fromEntries(traitSearchParams));
      }
    }
    for (const [memberName, memberNs] of ns.structIterator()) {
      const memberTraits = memberNs.getMergedTraits() ?? {};
      const inputMemberValue = input[memberName];
      if (inputMemberValue == null && !memberNs.isIdempotencyToken()) {
        if (memberTraits.httpLabel) {
          if (request2.path.includes(`{${memberName}+}`) || request2.path.includes(`{${memberName}}`)) {
            throw new Error(`No value provided for input HTTP label: ${memberName}.`);
          }
        }
        continue;
      }
      if (memberTraits.httpPayload) {
        const isStreaming2 = memberNs.isStreaming();
        if (isStreaming2) {
          const isEventStream = memberNs.isStructSchema();
          if (isEventStream) {
            if (input[memberName]) {
              payload = await this.serializeEventStream({
                eventStream: input[memberName],
                requestSchema: ns
              });
            }
          } else {
            payload = inputMemberValue;
          }
        } else {
          serializer.write(memberNs, inputMemberValue);
          payload = serializer.flush();
        }
      } else if (memberTraits.httpLabel) {
        serializer.write(memberNs, inputMemberValue);
        const replacement = serializer.flush();
        if (request2.path.includes(`{${memberName}+}`)) {
          request2.path = request2.path.replace(`{${memberName}+}`, replacement.split("/").map(extendedEncodeURIComponent).join("/"));
        } else if (request2.path.includes(`{${memberName}}`)) {
          request2.path = request2.path.replace(`{${memberName}}`, extendedEncodeURIComponent(replacement));
        }
      } else if (memberTraits.httpHeader) {
        serializer.write(memberNs, inputMemberValue);
        headers[memberTraits.httpHeader.toLowerCase()] = String(serializer.flush());
      } else if (typeof memberTraits.httpPrefixHeaders === "string") {
        for (const [key, val] of Object.entries(inputMemberValue)) {
          const amalgam = memberTraits.httpPrefixHeaders + key;
          serializer.write([memberNs.getValueSchema(), { httpHeader: amalgam }], val);
          headers[amalgam.toLowerCase()] = serializer.flush();
        }
      } else if (memberTraits.httpQuery || memberTraits.httpQueryParams) {
        this.serializeQuery(memberNs, inputMemberValue, query);
      } else {
        hasNonHttpBindingMember = true;
        payloadMemberNames.push(memberName);
        payloadMemberSchemas.push(memberNs);
      }
    }
    if (hasNonHttpBindingMember && input) {
      const [namespace, name] = (ns.getName(true) ?? "#Unknown").split("#");
      const requiredMembers = ns.getSchema()[6];
      const payloadSchema = [
        3,
        namespace,
        name,
        ns.getMergedTraits(),
        payloadMemberNames,
        payloadMemberSchemas,
        void 0
      ];
      if (requiredMembers) {
        payloadSchema[6] = requiredMembers;
      } else {
        payloadSchema.pop();
      }
      serializer.write(payloadSchema, input);
      payload = serializer.flush();
    }
    request2.headers = headers;
    request2.query = query;
    request2.body = payload;
    return request2;
  }
  serializeQuery(ns, data, query) {
    const serializer = this.serializer;
    const traits = ns.getMergedTraits();
    if (traits.httpQueryParams) {
      for (const [key, val] of Object.entries(data)) {
        if (!(key in query)) {
          const valueSchema = ns.getValueSchema();
          Object.assign(valueSchema.getMergedTraits(), {
            ...traits,
            httpQuery: key,
            httpQueryParams: void 0
          });
          this.serializeQuery(valueSchema, val, query);
        }
      }
      return;
    }
    if (ns.isListSchema()) {
      const sparse = !!ns.getMergedTraits().sparse;
      const buffer = [];
      for (const item of data) {
        serializer.write([ns.getValueSchema(), traits], item);
        const serializable = serializer.flush();
        if (sparse || serializable !== void 0) {
          buffer.push(serializable);
        }
      }
      query[traits.httpQuery] = buffer;
    } else {
      serializer.write([ns, traits], data);
      query[traits.httpQuery] = serializer.flush();
    }
  }
  async deserializeResponse(operationSchema, context, response) {
    const deserializer = this.deserializer;
    const ns = NormalizedSchema.of(operationSchema.output);
    const dataObject = {};
    if (response.statusCode >= 300) {
      const bytes = await collectBody$1(response.body, context);
      if (bytes.byteLength > 0) {
        Object.assign(dataObject, await deserializer.read(15, bytes));
      }
      await this.handleError(operationSchema, context, response, dataObject, this.deserializeMetadata(response));
      throw new Error("@smithy/core/protocols - HTTP Protocol error handler failed to throw.");
    }
    for (const header in response.headers) {
      const value = response.headers[header];
      delete response.headers[header];
      response.headers[header.toLowerCase()] = value;
    }
    const nonHttpBindingMembers = await this.deserializeHttpMessage(ns, context, response, dataObject);
    if (nonHttpBindingMembers.length) {
      const bytes = await collectBody$1(response.body, context);
      if (bytes.byteLength > 0) {
        const dataFromBody = await deserializer.read(ns, bytes);
        for (const member2 of nonHttpBindingMembers) {
          if (dataFromBody[member2] != null) {
            dataObject[member2] = dataFromBody[member2];
          }
        }
      }
    } else if (nonHttpBindingMembers.discardResponseBody) {
      await collectBody$1(response.body, context);
    }
    dataObject.$metadata = this.deserializeMetadata(response);
    return dataObject;
  }
  async deserializeHttpMessage(schema, context, response, arg4, arg5) {
    let dataObject;
    if (arg4 instanceof Set) {
      dataObject = arg5;
    } else {
      dataObject = arg4;
    }
    let discardResponseBody = true;
    const deserializer = this.deserializer;
    const ns = NormalizedSchema.of(schema);
    const nonHttpBindingMembers = [];
    for (const [memberName, memberSchema] of ns.structIterator()) {
      const memberTraits = memberSchema.getMemberTraits();
      if (memberTraits.httpPayload) {
        discardResponseBody = false;
        const isStreaming2 = memberSchema.isStreaming();
        if (isStreaming2) {
          const isEventStream = memberSchema.isStructSchema();
          if (isEventStream) {
            dataObject[memberName] = await this.deserializeEventStream({
              response,
              responseSchema: ns
            });
          } else {
            dataObject[memberName] = sdkStreamMixin(response.body);
          }
        } else if (response.body) {
          const bytes = await collectBody$1(response.body, context);
          if (bytes.byteLength > 0) {
            dataObject[memberName] = await deserializer.read(memberSchema, bytes);
          }
        }
      } else if (memberTraits.httpHeader) {
        const key = String(memberTraits.httpHeader).toLowerCase();
        const value = response.headers[key];
        if (null != value) {
          if (memberSchema.isListSchema()) {
            const headerListValueSchema = memberSchema.getValueSchema();
            headerListValueSchema.getMergedTraits().httpHeader = key;
            let sections;
            if (headerListValueSchema.isTimestampSchema() && headerListValueSchema.getSchema() === 4) {
              sections = splitEvery(value, ",", 2);
            } else {
              sections = splitHeader(value);
            }
            const list = [];
            for (const section of sections) {
              list.push(await deserializer.read(headerListValueSchema, section.trim()));
            }
            dataObject[memberName] = list;
          } else {
            dataObject[memberName] = await deserializer.read(memberSchema, value);
          }
        }
      } else if (memberTraits.httpPrefixHeaders !== void 0) {
        dataObject[memberName] = {};
        for (const [header, value] of Object.entries(response.headers)) {
          if (header.startsWith(memberTraits.httpPrefixHeaders)) {
            const valueSchema = memberSchema.getValueSchema();
            valueSchema.getMergedTraits().httpHeader = header;
            dataObject[memberName][header.slice(memberTraits.httpPrefixHeaders.length)] = await deserializer.read(valueSchema, value);
          }
        }
      } else if (memberTraits.httpResponseCode) {
        dataObject[memberName] = response.statusCode;
      } else {
        nonHttpBindingMembers.push(memberName);
      }
    }
    nonHttpBindingMembers.discardResponseBody = discardResponseBody;
    return nonHttpBindingMembers;
  }
}
function determineTimestampFormat(ns, settings) {
  if (settings.timestampFormat.useTrait) {
    if (ns.isTimestampSchema() && (ns.getSchema() === 5 || ns.getSchema() === 6 || ns.getSchema() === 7)) {
      return ns.getSchema();
    }
  }
  const { httpLabel, httpPrefixHeaders, httpHeader, httpQuery } = ns.getMergedTraits();
  const bindingFormat = settings.httpBindings ? typeof httpPrefixHeaders === "string" || Boolean(httpHeader) ? 6 : Boolean(httpQuery) || Boolean(httpLabel) ? 5 : void 0 : void 0;
  return bindingFormat ?? settings.timestampFormat.default;
}
class FromStringShapeDeserializer extends SerdeContext {
  settings;
  constructor(settings) {
    super();
    this.settings = settings;
  }
  read(_schema, data) {
    const ns = NormalizedSchema.of(_schema);
    if (ns.isListSchema()) {
      return splitHeader(data).map((item) => this.read(ns.getValueSchema(), item));
    }
    if (ns.isBlobSchema()) {
      return (this.serdeContext?.base64Decoder ?? fromBase64)(data);
    }
    if (ns.isTimestampSchema()) {
      const format2 = determineTimestampFormat(ns, this.settings);
      switch (format2) {
        case 5:
          return _parseRfc3339DateTimeWithOffset(data);
        case 6:
          return _parseRfc7231DateTime(data);
        case 7:
          return _parseEpochTimestamp(data);
        default:
          console.warn("Missing timestamp format, parsing value with Date constructor:", data);
          return new Date(data);
      }
    }
    if (ns.isStringSchema()) {
      const mediaType = ns.getMergedTraits().mediaType;
      let intermediateValue = data;
      if (mediaType) {
        if (ns.getMergedTraits().httpHeader) {
          intermediateValue = this.base64ToUtf8(intermediateValue);
        }
        const isJson = mediaType === "application/json" || mediaType.endsWith("+json");
        if (isJson) {
          intermediateValue = LazyJsonString.from(intermediateValue);
        }
        return intermediateValue;
      }
    }
    if (ns.isNumericSchema()) {
      return Number(data);
    }
    if (ns.isBigIntegerSchema()) {
      return BigInt(data);
    }
    if (ns.isBigDecimalSchema()) {
      return new NumericValue(data, "bigDecimal");
    }
    if (ns.isBooleanSchema()) {
      return String(data).toLowerCase() === "true";
    }
    return data;
  }
  base64ToUtf8(base64String) {
    return (this.serdeContext?.utf8Encoder ?? toUtf8)((this.serdeContext?.base64Decoder ?? fromBase64)(base64String));
  }
}
class HttpInterceptingShapeDeserializer extends SerdeContext {
  codecDeserializer;
  stringDeserializer;
  constructor(codecDeserializer, codecSettings) {
    super();
    this.codecDeserializer = codecDeserializer;
    this.stringDeserializer = new FromStringShapeDeserializer(codecSettings);
  }
  setSerdeContext(serdeContext) {
    this.stringDeserializer.setSerdeContext(serdeContext);
    this.codecDeserializer.setSerdeContext(serdeContext);
    this.serdeContext = serdeContext;
  }
  read(schema, data) {
    const ns = NormalizedSchema.of(schema);
    const traits = ns.getMergedTraits();
    const toString = this.serdeContext?.utf8Encoder ?? toUtf8;
    if (traits.httpHeader || traits.httpResponseCode) {
      return this.stringDeserializer.read(ns, toString(data));
    }
    if (traits.httpPayload) {
      if (ns.isBlobSchema()) {
        const toBytes = this.serdeContext?.utf8Decoder ?? fromUtf8$2;
        if (typeof data === "string") {
          return toBytes(data);
        }
        return data;
      } else if (ns.isStringSchema()) {
        if ("byteLength" in data) {
          return toString(data);
        }
        return data;
      }
    }
    return this.codecDeserializer.read(ns, data);
  }
}
class ToStringShapeSerializer extends SerdeContext {
  settings;
  stringBuffer = "";
  constructor(settings) {
    super();
    this.settings = settings;
  }
  write(schema, value) {
    const ns = NormalizedSchema.of(schema);
    switch (typeof value) {
      case "object":
        if (value === null) {
          this.stringBuffer = "null";
          return;
        }
        if (ns.isTimestampSchema()) {
          if (!(value instanceof Date)) {
            throw new Error(`@smithy/core/protocols - received non-Date value ${value} when schema expected Date in ${ns.getName(true)}`);
          }
          const format2 = determineTimestampFormat(ns, this.settings);
          switch (format2) {
            case 5:
              this.stringBuffer = value.toISOString().replace(".000Z", "Z");
              break;
            case 6:
              this.stringBuffer = dateToUtcString(value);
              break;
            case 7:
              this.stringBuffer = String(value.getTime() / 1e3);
              break;
            default:
              console.warn("Missing timestamp format, using epoch seconds", value);
              this.stringBuffer = String(value.getTime() / 1e3);
          }
          return;
        }
        if (ns.isBlobSchema() && "byteLength" in value) {
          this.stringBuffer = (this.serdeContext?.base64Encoder ?? toBase64)(value);
          return;
        }
        if (ns.isListSchema() && Array.isArray(value)) {
          let buffer = "";
          for (const item of value) {
            this.write([ns.getValueSchema(), ns.getMergedTraits()], item);
            const headerItem = this.flush();
            const serialized = ns.getValueSchema().isTimestampSchema() ? headerItem : quoteHeader(headerItem);
            if (buffer !== "") {
              buffer += ", ";
            }
            buffer += serialized;
          }
          this.stringBuffer = buffer;
          return;
        }
        this.stringBuffer = JSON.stringify(value, null, 2);
        break;
      case "string":
        const mediaType = ns.getMergedTraits().mediaType;
        let intermediateValue = value;
        if (mediaType) {
          const isJson = mediaType === "application/json" || mediaType.endsWith("+json");
          if (isJson) {
            intermediateValue = LazyJsonString.from(intermediateValue);
          }
          if (ns.getMergedTraits().httpHeader) {
            this.stringBuffer = (this.serdeContext?.base64Encoder ?? toBase64)(intermediateValue.toString());
            return;
          }
        }
        this.stringBuffer = value;
        break;
      default:
        if (ns.isIdempotencyToken()) {
          this.stringBuffer = v4();
        } else {
          this.stringBuffer = String(value);
        }
    }
  }
  flush() {
    const buffer = this.stringBuffer;
    this.stringBuffer = "";
    return buffer;
  }
}
class HttpInterceptingShapeSerializer {
  codecSerializer;
  stringSerializer;
  buffer;
  constructor(codecSerializer, codecSettings, stringSerializer = new ToStringShapeSerializer(codecSettings)) {
    this.codecSerializer = codecSerializer;
    this.stringSerializer = stringSerializer;
  }
  setSerdeContext(serdeContext) {
    this.codecSerializer.setSerdeContext(serdeContext);
    this.stringSerializer.setSerdeContext(serdeContext);
  }
  write(schema, value) {
    const ns = NormalizedSchema.of(schema);
    const traits = ns.getMergedTraits();
    if (traits.httpHeader || traits.httpLabel || traits.httpQuery) {
      this.stringSerializer.write(ns, value);
      this.buffer = this.stringSerializer.flush();
      return;
    }
    return this.codecSerializer.write(ns, value);
  }
  flush() {
    if (this.buffer !== void 0) {
      const buffer = this.buffer;
      this.buffer = void 0;
      return buffer;
    }
    return this.codecSerializer.flush();
  }
}
const SENSITIVE_STRING = "***SensitiveInformation***";
function schemaLogFilter(schema, data) {
  if (data == null) {
    return data;
  }
  const ns = NormalizedSchema.of(schema);
  if (ns.getMergedTraits().sensitive) {
    return SENSITIVE_STRING;
  }
  if (ns.isListSchema()) {
    const isSensitive = !!ns.getValueSchema().getMergedTraits().sensitive;
    if (isSensitive) {
      return SENSITIVE_STRING;
    }
  } else if (ns.isMapSchema()) {
    const isSensitive = !!ns.getKeySchema().getMergedTraits().sensitive || !!ns.getValueSchema().getMergedTraits().sensitive;
    if (isSensitive) {
      return SENSITIVE_STRING;
    }
  } else if (ns.isStructSchema() && typeof data === "object") {
    const object = data;
    const newObject = {};
    for (const [member2, memberNs] of ns.structIterator()) {
      if (object[member2] != null) {
        newObject[member2] = schemaLogFilter(memberNs, object[member2]);
      }
    }
    return newObject;
  }
  return data;
}
class Command {
  middlewareStack = constructStack();
  schema;
  static classBuilder() {
    return new ClassBuilder();
  }
  resolveMiddlewareWithContext(clientStack, configuration, options, { middlewareFn, clientName, commandName, inputFilterSensitiveLog, outputFilterSensitiveLog, smithyContext, additionalContext, CommandCtor }) {
    for (const mw of middlewareFn.bind(this)(CommandCtor, clientStack, configuration, options)) {
      this.middlewareStack.use(mw);
    }
    const stack = clientStack.concat(this.middlewareStack);
    const { logger: logger2 } = configuration;
    const handlerExecutionContext = {
      logger: logger2,
      clientName,
      commandName,
      inputFilterSensitiveLog,
      outputFilterSensitiveLog,
      [SMITHY_CONTEXT_KEY]: {
        commandInstance: this,
        ...smithyContext
      },
      ...additionalContext
    };
    const { requestHandler } = configuration;
    return stack.resolve((request2) => requestHandler.handle(request2.request, options || {}), handlerExecutionContext);
  }
}
class ClassBuilder {
  _init = () => {
  };
  _ep = {};
  _middlewareFn = () => [];
  _commandName = "";
  _clientName = "";
  _additionalContext = {};
  _smithyContext = {};
  _inputFilterSensitiveLog = void 0;
  _outputFilterSensitiveLog = void 0;
  _serializer = null;
  _deserializer = null;
  _operationSchema;
  init(cb2) {
    this._init = cb2;
  }
  ep(endpointParameterInstructions) {
    this._ep = endpointParameterInstructions;
    return this;
  }
  m(middlewareSupplier) {
    this._middlewareFn = middlewareSupplier;
    return this;
  }
  s(service, operation2, smithyContext = {}) {
    this._smithyContext = {
      service,
      operation: operation2,
      ...smithyContext
    };
    return this;
  }
  c(additionalContext = {}) {
    this._additionalContext = additionalContext;
    return this;
  }
  n(clientName, commandName) {
    this._clientName = clientName;
    this._commandName = commandName;
    return this;
  }
  f(inputFilter = (_) => _, outputFilter = (_) => _) {
    this._inputFilterSensitiveLog = inputFilter;
    this._outputFilterSensitiveLog = outputFilter;
    return this;
  }
  ser(serializer) {
    this._serializer = serializer;
    return this;
  }
  de(deserializer) {
    this._deserializer = deserializer;
    return this;
  }
  sc(operation2) {
    this._operationSchema = operation2;
    this._smithyContext.operationSchema = operation2;
    return this;
  }
  build() {
    const closure = this;
    let CommandRef;
    return CommandRef = class extends Command {
      input;
      static getEndpointParameterInstructions() {
        return closure._ep;
      }
      constructor(...[input]) {
        super();
        this.input = input ?? {};
        closure._init(this);
        this.schema = closure._operationSchema;
      }
      resolveMiddleware(stack, configuration, options) {
        const op = closure._operationSchema;
        const input = op?.[4] ?? op?.input;
        const output = op?.[5] ?? op?.output;
        return this.resolveMiddlewareWithContext(stack, configuration, options, {
          CommandCtor: CommandRef,
          middlewareFn: closure._middlewareFn,
          clientName: closure._clientName,
          commandName: closure._commandName,
          inputFilterSensitiveLog: closure._inputFilterSensitiveLog ?? (op ? schemaLogFilter.bind(null, input) : (_) => _),
          outputFilterSensitiveLog: closure._outputFilterSensitiveLog ?? (op ? schemaLogFilter.bind(null, output) : (_) => _),
          smithyContext: closure._smithyContext,
          additionalContext: closure._additionalContext
        });
      }
      serialize = closure._serializer;
      deserialize = closure._deserializer;
    };
  }
}
class ServiceException extends Error {
  $fault;
  $response;
  $retryable;
  $metadata;
  constructor(options) {
    super(options.message);
    Object.setPrototypeOf(this, Object.getPrototypeOf(this).constructor.prototype);
    this.name = options.name;
    this.$fault = options.$fault;
    this.$metadata = options.$metadata;
  }
  static isInstance(value) {
    if (!value)
      return false;
    const candidate = value;
    return ServiceException.prototype.isPrototypeOf(candidate) || Boolean(candidate.$fault) && Boolean(candidate.$metadata) && (candidate.$fault === "client" || candidate.$fault === "server");
  }
  static [Symbol.hasInstance](instance) {
    if (!instance)
      return false;
    const candidate = instance;
    if (this === ServiceException) {
      return ServiceException.isInstance(instance);
    }
    if (ServiceException.isInstance(instance)) {
      if (candidate.name && this.name) {
        return this.prototype.isPrototypeOf(instance) || candidate.name === this.name;
      }
      return this.prototype.isPrototypeOf(instance);
    }
    return false;
  }
}
const decorateServiceException = (exception, additions = {}) => {
  Object.entries(additions).filter(([, v2]) => v2 !== void 0).forEach(([k2, v2]) => {
    if (exception[k2] == void 0 || exception[k2] === "") {
      exception[k2] = v2;
    }
  });
  const message = exception.message || exception.Message || "UnknownError";
  exception.message = message;
  delete exception.Message;
  return exception;
};
const loadConfigsForDefaultMode = (mode) => {
  switch (mode) {
    case "standard":
      return {
        retryMode: "standard",
        connectionTimeout: 3100
      };
    case "in-region":
      return {
        retryMode: "standard",
        connectionTimeout: 1100
      };
    case "cross-region":
      return {
        retryMode: "standard",
        connectionTimeout: 3100
      };
    case "mobile":
      return {
        retryMode: "standard",
        connectionTimeout: 3e4
      };
    default:
      return {};
  }
};
let warningEmitted = false;
const emitWarningIfUnsupportedVersion = (version2) => {
  if (version2 && !warningEmitted && parseInt(version2.substring(1, version2.indexOf("."))) < 16) {
    warningEmitted = true;
  }
};
const knownAlgorithms = Object.values(AlgorithmId);
const getChecksumConfiguration = (runtimeConfig) => {
  const checksumAlgorithms = [];
  for (const id in AlgorithmId) {
    const algorithmId = AlgorithmId[id];
    if (runtimeConfig[algorithmId] === void 0) {
      continue;
    }
    checksumAlgorithms.push({
      algorithmId: () => algorithmId,
      checksumConstructor: () => runtimeConfig[algorithmId]
    });
  }
  for (const [id, ChecksumCtor] of Object.entries(runtimeConfig.checksumAlgorithms ?? {})) {
    checksumAlgorithms.push({
      algorithmId: () => id,
      checksumConstructor: () => ChecksumCtor
    });
  }
  return {
    addChecksumAlgorithm(algo) {
      runtimeConfig.checksumAlgorithms = runtimeConfig.checksumAlgorithms ?? {};
      const id = algo.algorithmId();
      const ctor = algo.checksumConstructor();
      if (knownAlgorithms.includes(id)) {
        runtimeConfig.checksumAlgorithms[id.toUpperCase()] = ctor;
      } else {
        runtimeConfig.checksumAlgorithms[id] = ctor;
      }
      checksumAlgorithms.push(algo);
    },
    checksumAlgorithms() {
      return checksumAlgorithms;
    }
  };
};
const resolveChecksumRuntimeConfig = (clientConfig) => {
  const runtimeConfig = {};
  clientConfig.checksumAlgorithms().forEach((checksumAlgorithm) => {
    const id = checksumAlgorithm.algorithmId();
    if (knownAlgorithms.includes(id)) {
      runtimeConfig[id] = checksumAlgorithm.checksumConstructor();
    }
  });
  return runtimeConfig;
};
const getRetryConfiguration = (runtimeConfig) => {
  return {
    setRetryStrategy(retryStrategy) {
      runtimeConfig.retryStrategy = retryStrategy;
    },
    retryStrategy() {
      return runtimeConfig.retryStrategy;
    }
  };
};
const resolveRetryRuntimeConfig = (retryStrategyConfiguration) => {
  const runtimeConfig = {};
  runtimeConfig.retryStrategy = retryStrategyConfiguration.retryStrategy();
  return runtimeConfig;
};
const getDefaultExtensionConfiguration = (runtimeConfig) => {
  return Object.assign(getChecksumConfiguration(runtimeConfig), getRetryConfiguration(runtimeConfig));
};
const resolveDefaultRuntimeConfig = (config) => {
  return Object.assign(resolveChecksumRuntimeConfig(config), resolveRetryRuntimeConfig(config));
};
const getValueFromTextNode = (obj) => {
  const textNodeName = "#text";
  for (const key in obj) {
    if (obj.hasOwnProperty(key) && obj[key][textNodeName] !== void 0) {
      obj[key] = obj[key][textNodeName];
    } else if (typeof obj[key] === "object" && obj[key] !== null) {
      obj[key] = getValueFromTextNode(obj[key]);
    }
  }
  return obj;
};
class NoOpLogger {
  trace() {
  }
  debug() {
  }
  info() {
  }
  warn() {
  }
  error() {
  }
}
const CONTENT_LENGTH_HEADER$1 = "content-length";
const DECODED_CONTENT_LENGTH_HEADER = "x-amz-decoded-content-length";
function checkContentLengthHeader() {
  return (next, context) => async (args) => {
    const { request: request2 } = args;
    if (HttpRequest.isInstance(request2)) {
      if (!(CONTENT_LENGTH_HEADER$1 in request2.headers) && !(DECODED_CONTENT_LENGTH_HEADER in request2.headers)) {
        const message = `Are you using a Stream of unknown length as the Body of a PutObject request? Consider using Upload instead from @aws-sdk/lib-storage.`;
        if (typeof context?.logger?.warn === "function" && !(context.logger instanceof NoOpLogger)) {
          context.logger.warn(message);
        } else {
          console.warn(message);
        }
      }
    }
    return next({ ...args });
  };
}
const checkContentLengthHeaderMiddlewareOptions = {
  step: "finalizeRequest",
  tags: ["CHECK_CONTENT_LENGTH_HEADER"],
  name: "getCheckContentLengthHeaderPlugin",
  override: true
};
const getCheckContentLengthHeaderPlugin = (unused) => ({
  applyToStack: (clientStack) => {
    clientStack.add(checkContentLengthHeader(), checkContentLengthHeaderMiddlewareOptions);
  }
});
const regionRedirectEndpointMiddleware = (config) => {
  return (next, context) => async (args) => {
    const originalRegion = await config.region();
    const regionProviderRef = config.region;
    let unlock = () => {
    };
    if (context.__s3RegionRedirect) {
      Object.defineProperty(config, "region", {
        writable: false,
        value: async () => {
          return context.__s3RegionRedirect;
        }
      });
      unlock = () => Object.defineProperty(config, "region", {
        writable: true,
        value: regionProviderRef
      });
    }
    try {
      const result = await next(args);
      if (context.__s3RegionRedirect) {
        unlock();
        const region = await config.region();
        if (originalRegion !== region) {
          throw new Error("Region was not restored following S3 region redirect.");
        }
      }
      return result;
    } catch (e2) {
      unlock();
      throw e2;
    }
  };
};
const regionRedirectEndpointMiddlewareOptions = {
  tags: ["REGION_REDIRECT", "S3"],
  name: "regionRedirectEndpointMiddleware",
  override: true,
  relation: "before",
  toMiddleware: "endpointV2Middleware"
};
function regionRedirectMiddleware(clientConfig) {
  return (next, context) => async (args) => {
    try {
      return await next(args);
    } catch (err) {
      if (clientConfig.followRegionRedirects) {
        const statusCode = err?.$metadata?.httpStatusCode;
        const isHeadBucket = context.commandName === "HeadBucketCommand";
        const bucketRegionHeader = err?.$response?.headers?.["x-amz-bucket-region"];
        if (bucketRegionHeader) {
          if (statusCode === 301 || statusCode === 400 && (err?.name === "IllegalLocationConstraintException" || isHeadBucket)) {
            try {
              const actualRegion = bucketRegionHeader;
              context.logger?.debug(`Redirecting from ${await clientConfig.region()} to ${actualRegion}`);
              context.__s3RegionRedirect = actualRegion;
            } catch (e2) {
              throw new Error("Region redirect failed: " + e2);
            }
            return next(args);
          }
        }
      }
      throw err;
    }
  };
}
const regionRedirectMiddlewareOptions = {
  step: "initialize",
  tags: ["REGION_REDIRECT", "S3"],
  name: "regionRedirectMiddleware",
  override: true
};
const getRegionRedirectMiddlewarePlugin = (clientConfig) => ({
  applyToStack: (clientStack) => {
    clientStack.add(regionRedirectMiddleware(clientConfig), regionRedirectMiddlewareOptions);
    clientStack.addRelativeTo(regionRedirectEndpointMiddleware(clientConfig), regionRedirectEndpointMiddlewareOptions);
  }
});
class S3ExpressIdentityCache {
  data;
  lastPurgeTime = Date.now();
  static EXPIRED_CREDENTIAL_PURGE_INTERVAL_MS = 3e4;
  constructor(data = {}) {
    this.data = data;
  }
  get(key) {
    const entry = this.data[key];
    if (!entry) {
      return;
    }
    return entry;
  }
  set(key, entry) {
    this.data[key] = entry;
    return entry;
  }
  delete(key) {
    delete this.data[key];
  }
  async purgeExpired() {
    const now = Date.now();
    if (this.lastPurgeTime + S3ExpressIdentityCache.EXPIRED_CREDENTIAL_PURGE_INTERVAL_MS > now) {
      return;
    }
    for (const key in this.data) {
      const entry = this.data[key];
      if (!entry.isRefreshing) {
        const credential = await entry.identity;
        if (credential.expiration) {
          if (credential.expiration.getTime() < now) {
            delete this.data[key];
          }
        }
      }
    }
  }
}
class S3ExpressIdentityCacheEntry {
  _identity;
  isRefreshing;
  accessed;
  constructor(_identity, isRefreshing = false, accessed = Date.now()) {
    this._identity = _identity;
    this.isRefreshing = isRefreshing;
    this.accessed = accessed;
  }
  get identity() {
    this.accessed = Date.now();
    return this._identity;
  }
}
class S3ExpressIdentityProviderImpl {
  createSessionFn;
  cache;
  static REFRESH_WINDOW_MS = 6e4;
  constructor(createSessionFn, cache2 = new S3ExpressIdentityCache()) {
    this.createSessionFn = createSessionFn;
    this.cache = cache2;
  }
  async getS3ExpressIdentity(awsIdentity, identityProperties) {
    const key = identityProperties.Bucket;
    const { cache: cache2 } = this;
    const entry = cache2.get(key);
    if (entry) {
      return entry.identity.then((identity) => {
        const isExpired = (identity.expiration?.getTime() ?? 0) < Date.now();
        if (isExpired) {
          return cache2.set(key, new S3ExpressIdentityCacheEntry(this.getIdentity(key))).identity;
        }
        const isExpiringSoon = (identity.expiration?.getTime() ?? 0) < Date.now() + S3ExpressIdentityProviderImpl.REFRESH_WINDOW_MS;
        if (isExpiringSoon && !entry.isRefreshing) {
          entry.isRefreshing = true;
          this.getIdentity(key).then((id) => {
            cache2.set(key, new S3ExpressIdentityCacheEntry(Promise.resolve(id)));
          });
        }
        return identity;
      });
    }
    return cache2.set(key, new S3ExpressIdentityCacheEntry(this.getIdentity(key))).identity;
  }
  async getIdentity(key) {
    await this.cache.purgeExpired().catch((error) => {
      console.warn("Error while clearing expired entries in S3ExpressIdentityCache: \n" + error);
    });
    const session = await this.createSessionFn(key);
    if (!session.Credentials?.AccessKeyId || !session.Credentials?.SecretAccessKey) {
      throw new Error("s3#createSession response credential missing AccessKeyId or SecretAccessKey.");
    }
    const identity = {
      accessKeyId: session.Credentials.AccessKeyId,
      secretAccessKey: session.Credentials.SecretAccessKey,
      sessionToken: session.Credentials.SessionToken,
      expiration: session.Credentials.Expiration ? new Date(session.Credentials.Expiration) : void 0
    };
    return identity;
  }
}
const ALGORITHM_QUERY_PARAM = "X-Amz-Algorithm";
const CREDENTIAL_QUERY_PARAM = "X-Amz-Credential";
const AMZ_DATE_QUERY_PARAM = "X-Amz-Date";
const SIGNED_HEADERS_QUERY_PARAM = "X-Amz-SignedHeaders";
const EXPIRES_QUERY_PARAM = "X-Amz-Expires";
const SIGNATURE_QUERY_PARAM = "X-Amz-Signature";
const TOKEN_QUERY_PARAM = "X-Amz-Security-Token";
const AUTH_HEADER = "authorization";
const AMZ_DATE_HEADER = AMZ_DATE_QUERY_PARAM.toLowerCase();
const DATE_HEADER = "date";
const GENERATED_HEADERS = [AUTH_HEADER, AMZ_DATE_HEADER, DATE_HEADER];
const SIGNATURE_HEADER = SIGNATURE_QUERY_PARAM.toLowerCase();
const SHA256_HEADER = "x-amz-content-sha256";
const TOKEN_HEADER = TOKEN_QUERY_PARAM.toLowerCase();
const ALWAYS_UNSIGNABLE_HEADERS = {
  authorization: true,
  "cache-control": true,
  connection: true,
  expect: true,
  from: true,
  "keep-alive": true,
  "max-forwards": true,
  pragma: true,
  referer: true,
  te: true,
  trailer: true,
  "transfer-encoding": true,
  upgrade: true,
  "user-agent": true,
  "x-amzn-trace-id": true
};
const PROXY_HEADER_PATTERN = /^proxy-/;
const SEC_HEADER_PATTERN = /^sec-/;
const ALGORITHM_IDENTIFIER = "AWS4-HMAC-SHA256";
const EVENT_ALGORITHM_IDENTIFIER = "AWS4-HMAC-SHA256-PAYLOAD";
const UNSIGNED_PAYLOAD = "UNSIGNED-PAYLOAD";
const MAX_CACHE_SIZE = 50;
const KEY_TYPE_IDENTIFIER = "aws4_request";
const MAX_PRESIGNED_TTL = 60 * 60 * 24 * 7;
const signingKeyCache = {};
const cacheQueue = [];
const createScope = (shortDate, region, service) => `${shortDate}/${region}/${service}/${KEY_TYPE_IDENTIFIER}`;
const getSigningKey = async (sha256Constructor, credentials, shortDate, region, service) => {
  const credsHash = await hmac(sha256Constructor, credentials.secretAccessKey, credentials.accessKeyId);
  const cacheKey = `${shortDate}:${region}:${service}:${toHex(credsHash)}:${credentials.sessionToken}`;
  if (cacheKey in signingKeyCache) {
    return signingKeyCache[cacheKey];
  }
  cacheQueue.push(cacheKey);
  while (cacheQueue.length > MAX_CACHE_SIZE) {
    delete signingKeyCache[cacheQueue.shift()];
  }
  let key = `AWS4${credentials.secretAccessKey}`;
  for (const signable of [shortDate, region, service, KEY_TYPE_IDENTIFIER]) {
    key = await hmac(sha256Constructor, key, signable);
  }
  return signingKeyCache[cacheKey] = key;
};
const hmac = (ctor, secret, data) => {
  const hash = new ctor(secret);
  hash.update(toUint8Array(data));
  return hash.digest();
};
const getCanonicalHeaders = ({ headers }, unsignableHeaders, signableHeaders) => {
  const canonical = {};
  for (const headerName of Object.keys(headers).sort()) {
    if (headers[headerName] == void 0) {
      continue;
    }
    const canonicalHeaderName = headerName.toLowerCase();
    if (canonicalHeaderName in ALWAYS_UNSIGNABLE_HEADERS || unsignableHeaders?.has(canonicalHeaderName) || PROXY_HEADER_PATTERN.test(canonicalHeaderName) || SEC_HEADER_PATTERN.test(canonicalHeaderName)) {
      if (!signableHeaders || signableHeaders && !signableHeaders.has(canonicalHeaderName)) {
        continue;
      }
    }
    canonical[canonicalHeaderName] = headers[headerName].trim().replace(/\s+/g, " ");
  }
  return canonical;
};
const getPayloadHash = async ({ headers, body }, hashConstructor) => {
  for (const headerName of Object.keys(headers)) {
    if (headerName.toLowerCase() === SHA256_HEADER) {
      return headers[headerName];
    }
  }
  if (body == void 0) {
    return "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";
  } else if (typeof body === "string" || ArrayBuffer.isView(body) || isArrayBuffer(body)) {
    const hashCtor = new hashConstructor();
    hashCtor.update(toUint8Array(body));
    return toHex(await hashCtor.digest());
  }
  return UNSIGNED_PAYLOAD;
};
class HeaderFormatter {
  format(headers) {
    const chunks = [];
    for (const headerName of Object.keys(headers)) {
      const bytes = fromUtf8$2(headerName);
      chunks.push(Uint8Array.from([bytes.byteLength]), bytes, this.formatHeaderValue(headers[headerName]));
    }
    const out = new Uint8Array(chunks.reduce((carry, bytes) => carry + bytes.byteLength, 0));
    let position = 0;
    for (const chunk of chunks) {
      out.set(chunk, position);
      position += chunk.byteLength;
    }
    return out;
  }
  formatHeaderValue(header) {
    switch (header.type) {
      case "boolean":
        return Uint8Array.from([header.value ? 0 : 1]);
      case "byte":
        return Uint8Array.from([2, header.value]);
      case "short":
        const shortView = new DataView(new ArrayBuffer(3));
        shortView.setUint8(0, 3);
        shortView.setInt16(1, header.value, false);
        return new Uint8Array(shortView.buffer);
      case "integer":
        const intView = new DataView(new ArrayBuffer(5));
        intView.setUint8(0, 4);
        intView.setInt32(1, header.value, false);
        return new Uint8Array(intView.buffer);
      case "long":
        const longBytes = new Uint8Array(9);
        longBytes[0] = 5;
        longBytes.set(header.value.bytes, 1);
        return longBytes;
      case "binary":
        const binView = new DataView(new ArrayBuffer(3 + header.value.byteLength));
        binView.setUint8(0, 6);
        binView.setUint16(1, header.value.byteLength, false);
        const binBytes = new Uint8Array(binView.buffer);
        binBytes.set(header.value, 3);
        return binBytes;
      case "string":
        const utf8Bytes = fromUtf8$2(header.value);
        const strView = new DataView(new ArrayBuffer(3 + utf8Bytes.byteLength));
        strView.setUint8(0, 7);
        strView.setUint16(1, utf8Bytes.byteLength, false);
        const strBytes = new Uint8Array(strView.buffer);
        strBytes.set(utf8Bytes, 3);
        return strBytes;
      case "timestamp":
        const tsBytes = new Uint8Array(9);
        tsBytes[0] = 8;
        tsBytes.set(Int64$1.fromNumber(header.value.valueOf()).bytes, 1);
        return tsBytes;
      case "uuid":
        if (!UUID_PATTERN$1.test(header.value)) {
          throw new Error(`Invalid UUID received: ${header.value}`);
        }
        const uuidBytes = new Uint8Array(17);
        uuidBytes[0] = 9;
        uuidBytes.set(fromHex(header.value.replace(/\-/g, "")), 1);
        return uuidBytes;
    }
  }
}
var HEADER_VALUE_TYPE$1;
(function(HEADER_VALUE_TYPE2) {
  HEADER_VALUE_TYPE2[HEADER_VALUE_TYPE2["boolTrue"] = 0] = "boolTrue";
  HEADER_VALUE_TYPE2[HEADER_VALUE_TYPE2["boolFalse"] = 1] = "boolFalse";
  HEADER_VALUE_TYPE2[HEADER_VALUE_TYPE2["byte"] = 2] = "byte";
  HEADER_VALUE_TYPE2[HEADER_VALUE_TYPE2["short"] = 3] = "short";
  HEADER_VALUE_TYPE2[HEADER_VALUE_TYPE2["integer"] = 4] = "integer";
  HEADER_VALUE_TYPE2[HEADER_VALUE_TYPE2["long"] = 5] = "long";
  HEADER_VALUE_TYPE2[HEADER_VALUE_TYPE2["byteArray"] = 6] = "byteArray";
  HEADER_VALUE_TYPE2[HEADER_VALUE_TYPE2["string"] = 7] = "string";
  HEADER_VALUE_TYPE2[HEADER_VALUE_TYPE2["timestamp"] = 8] = "timestamp";
  HEADER_VALUE_TYPE2[HEADER_VALUE_TYPE2["uuid"] = 9] = "uuid";
})(HEADER_VALUE_TYPE$1 || (HEADER_VALUE_TYPE$1 = {}));
const UUID_PATTERN$1 = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/;
let Int64$1 = class Int64 {
  bytes;
  constructor(bytes) {
    this.bytes = bytes;
    if (bytes.byteLength !== 8) {
      throw new Error("Int64 buffers must be exactly 8 bytes");
    }
  }
  static fromNumber(number) {
    if (number > 9223372036854776e3 || number < -9223372036854776e3) {
      throw new Error(`${number} is too large (or, if negative, too small) to represent as an Int64`);
    }
    const bytes = new Uint8Array(8);
    for (let i2 = 7, remaining = Math.abs(Math.round(number)); i2 > -1 && remaining > 0; i2--, remaining /= 256) {
      bytes[i2] = remaining;
    }
    if (number < 0) {
      negate$1(bytes);
    }
    return new Int64(bytes);
  }
  valueOf() {
    const bytes = this.bytes.slice(0);
    const negative = bytes[0] & 128;
    if (negative) {
      negate$1(bytes);
    }
    return parseInt(toHex(bytes), 16) * (negative ? -1 : 1);
  }
  toString() {
    return String(this.valueOf());
  }
};
function negate$1(bytes) {
  for (let i2 = 0; i2 < 8; i2++) {
    bytes[i2] ^= 255;
  }
  for (let i2 = 7; i2 > -1; i2--) {
    bytes[i2]++;
    if (bytes[i2] !== 0)
      break;
  }
}
const hasHeader = (soughtHeader, headers) => {
  soughtHeader = soughtHeader.toLowerCase();
  for (const headerName of Object.keys(headers)) {
    if (soughtHeader === headerName.toLowerCase()) {
      return true;
    }
  }
  return false;
};
const moveHeadersToQuery = (request2, options = {}) => {
  const { headers, query = {} } = HttpRequest.clone(request2);
  for (const name of Object.keys(headers)) {
    const lname = name.toLowerCase();
    if (lname.slice(0, 6) === "x-amz-" && !options.unhoistableHeaders?.has(lname) || options.hoistableHeaders?.has(lname)) {
      query[name] = headers[name];
      delete headers[name];
    }
  }
  return {
    ...request2,
    headers,
    query
  };
};
const prepareRequest = (request2) => {
  request2 = HttpRequest.clone(request2);
  for (const headerName of Object.keys(request2.headers)) {
    if (GENERATED_HEADERS.indexOf(headerName.toLowerCase()) > -1) {
      delete request2.headers[headerName];
    }
  }
  return request2;
};
const getCanonicalQuery = ({ query = {} }) => {
  const keys = [];
  const serialized = {};
  for (const key of Object.keys(query)) {
    if (key.toLowerCase() === SIGNATURE_HEADER) {
      continue;
    }
    const encodedKey = escapeUri(key);
    keys.push(encodedKey);
    const value = query[key];
    if (typeof value === "string") {
      serialized[encodedKey] = `${encodedKey}=${escapeUri(value)}`;
    } else if (Array.isArray(value)) {
      serialized[encodedKey] = value.slice(0).reduce((encoded, value2) => encoded.concat([`${encodedKey}=${escapeUri(value2)}`]), []).sort().join("&");
    }
  }
  return keys.sort().map((key) => serialized[key]).filter((serialized2) => serialized2).join("&");
};
const iso8601 = (time2) => toDate(time2).toISOString().replace(/\.\d{3}Z$/, "Z");
const toDate = (time2) => {
  if (typeof time2 === "number") {
    return new Date(time2 * 1e3);
  }
  if (typeof time2 === "string") {
    if (Number(time2)) {
      return new Date(Number(time2) * 1e3);
    }
    return new Date(time2);
  }
  return time2;
};
class SignatureV4Base {
  service;
  regionProvider;
  credentialProvider;
  sha256;
  uriEscapePath;
  applyChecksum;
  constructor({ applyChecksum, credentials, region, service, sha256, uriEscapePath = true }) {
    this.service = service;
    this.sha256 = sha256;
    this.uriEscapePath = uriEscapePath;
    this.applyChecksum = typeof applyChecksum === "boolean" ? applyChecksum : true;
    this.regionProvider = normalizeProvider$1(region);
    this.credentialProvider = normalizeProvider$1(credentials);
  }
  createCanonicalRequest(request2, canonicalHeaders, payloadHash) {
    const sortedHeaders = Object.keys(canonicalHeaders).sort();
    return `${request2.method}
${this.getCanonicalPath(request2)}
${getCanonicalQuery(request2)}
${sortedHeaders.map((name) => `${name}:${canonicalHeaders[name]}`).join("\n")}

${sortedHeaders.join(";")}
${payloadHash}`;
  }
  async createStringToSign(longDate, credentialScope, canonicalRequest, algorithmIdentifier) {
    const hash = new this.sha256();
    hash.update(toUint8Array(canonicalRequest));
    const hashedRequest = await hash.digest();
    return `${algorithmIdentifier}
${longDate}
${credentialScope}
${toHex(hashedRequest)}`;
  }
  getCanonicalPath({ path }) {
    if (this.uriEscapePath) {
      const normalizedPathSegments = [];
      for (const pathSegment of path.split("/")) {
        if (pathSegment?.length === 0)
          continue;
        if (pathSegment === ".")
          continue;
        if (pathSegment === "..") {
          normalizedPathSegments.pop();
        } else {
          normalizedPathSegments.push(pathSegment);
        }
      }
      const normalizedPath = `${path?.startsWith("/") ? "/" : ""}${normalizedPathSegments.join("/")}${normalizedPathSegments.length > 0 && path?.endsWith("/") ? "/" : ""}`;
      const doubleEncoded = escapeUri(normalizedPath);
      return doubleEncoded.replace(/%2F/g, "/");
    }
    return path;
  }
  validateResolvedCredentials(credentials) {
    if (typeof credentials !== "object" || typeof credentials.accessKeyId !== "string" || typeof credentials.secretAccessKey !== "string") {
      throw new Error("Resolved credential object is not valid");
    }
  }
  formatDate(now) {
    const longDate = iso8601(now).replace(/[\-:]/g, "");
    return {
      longDate,
      shortDate: longDate.slice(0, 8)
    };
  }
  getCanonicalHeaderList(headers) {
    return Object.keys(headers).sort().join(";");
  }
}
class SignatureV4 extends SignatureV4Base {
  headerFormatter = new HeaderFormatter();
  constructor({ applyChecksum, credentials, region, service, sha256, uriEscapePath = true }) {
    super({
      applyChecksum,
      credentials,
      region,
      service,
      sha256,
      uriEscapePath
    });
  }
  async presign(originalRequest, options = {}) {
    const { signingDate = /* @__PURE__ */ new Date(), expiresIn = 3600, unsignableHeaders, unhoistableHeaders, signableHeaders, hoistableHeaders, signingRegion, signingService } = options;
    const credentials = await this.credentialProvider();
    this.validateResolvedCredentials(credentials);
    const region = signingRegion ?? await this.regionProvider();
    const { longDate, shortDate } = this.formatDate(signingDate);
    if (expiresIn > MAX_PRESIGNED_TTL) {
      return Promise.reject("Signature version 4 presigned URLs must have an expiration date less than one week in the future");
    }
    const scope = createScope(shortDate, region, signingService ?? this.service);
    const request2 = moveHeadersToQuery(prepareRequest(originalRequest), { unhoistableHeaders, hoistableHeaders });
    if (credentials.sessionToken) {
      request2.query[TOKEN_QUERY_PARAM] = credentials.sessionToken;
    }
    request2.query[ALGORITHM_QUERY_PARAM] = ALGORITHM_IDENTIFIER;
    request2.query[CREDENTIAL_QUERY_PARAM] = `${credentials.accessKeyId}/${scope}`;
    request2.query[AMZ_DATE_QUERY_PARAM] = longDate;
    request2.query[EXPIRES_QUERY_PARAM] = expiresIn.toString(10);
    const canonicalHeaders = getCanonicalHeaders(request2, unsignableHeaders, signableHeaders);
    request2.query[SIGNED_HEADERS_QUERY_PARAM] = this.getCanonicalHeaderList(canonicalHeaders);
    request2.query[SIGNATURE_QUERY_PARAM] = await this.getSignature(longDate, scope, this.getSigningKey(credentials, region, shortDate, signingService), this.createCanonicalRequest(request2, canonicalHeaders, await getPayloadHash(originalRequest, this.sha256)));
    return request2;
  }
  async sign(toSign, options) {
    if (typeof toSign === "string") {
      return this.signString(toSign, options);
    } else if (toSign.headers && toSign.payload) {
      return this.signEvent(toSign, options);
    } else if (toSign.message) {
      return this.signMessage(toSign, options);
    } else {
      return this.signRequest(toSign, options);
    }
  }
  async signEvent({ headers, payload }, { signingDate = /* @__PURE__ */ new Date(), priorSignature, signingRegion, signingService }) {
    const region = signingRegion ?? await this.regionProvider();
    const { shortDate, longDate } = this.formatDate(signingDate);
    const scope = createScope(shortDate, region, signingService ?? this.service);
    const hashedPayload = await getPayloadHash({ headers: {}, body: payload }, this.sha256);
    const hash = new this.sha256();
    hash.update(headers);
    const hashedHeaders = toHex(await hash.digest());
    const stringToSign = [
      EVENT_ALGORITHM_IDENTIFIER,
      longDate,
      scope,
      priorSignature,
      hashedHeaders,
      hashedPayload
    ].join("\n");
    return this.signString(stringToSign, { signingDate, signingRegion: region, signingService });
  }
  async signMessage(signableMessage, { signingDate = /* @__PURE__ */ new Date(), signingRegion, signingService }) {
    const promise = this.signEvent({
      headers: this.headerFormatter.format(signableMessage.message.headers),
      payload: signableMessage.message.body
    }, {
      signingDate,
      signingRegion,
      signingService,
      priorSignature: signableMessage.priorSignature
    });
    return promise.then((signature) => {
      return { message: signableMessage.message, signature };
    });
  }
  async signString(stringToSign, { signingDate = /* @__PURE__ */ new Date(), signingRegion, signingService } = {}) {
    const credentials = await this.credentialProvider();
    this.validateResolvedCredentials(credentials);
    const region = signingRegion ?? await this.regionProvider();
    const { shortDate } = this.formatDate(signingDate);
    const hash = new this.sha256(await this.getSigningKey(credentials, region, shortDate, signingService));
    hash.update(toUint8Array(stringToSign));
    return toHex(await hash.digest());
  }
  async signRequest(requestToSign, { signingDate = /* @__PURE__ */ new Date(), signableHeaders, unsignableHeaders, signingRegion, signingService } = {}) {
    const credentials = await this.credentialProvider();
    this.validateResolvedCredentials(credentials);
    const region = signingRegion ?? await this.regionProvider();
    const request2 = prepareRequest(requestToSign);
    const { longDate, shortDate } = this.formatDate(signingDate);
    const scope = createScope(shortDate, region, signingService ?? this.service);
    request2.headers[AMZ_DATE_HEADER] = longDate;
    if (credentials.sessionToken) {
      request2.headers[TOKEN_HEADER] = credentials.sessionToken;
    }
    const payloadHash = await getPayloadHash(request2, this.sha256);
    if (!hasHeader(SHA256_HEADER, request2.headers) && this.applyChecksum) {
      request2.headers[SHA256_HEADER] = payloadHash;
    }
    const canonicalHeaders = getCanonicalHeaders(request2, unsignableHeaders, signableHeaders);
    const signature = await this.getSignature(longDate, scope, this.getSigningKey(credentials, region, shortDate, signingService), this.createCanonicalRequest(request2, canonicalHeaders, payloadHash));
    request2.headers[AUTH_HEADER] = `${ALGORITHM_IDENTIFIER} Credential=${credentials.accessKeyId}/${scope}, SignedHeaders=${this.getCanonicalHeaderList(canonicalHeaders)}, Signature=${signature}`;
    return request2;
  }
  async getSignature(longDate, credentialScope, keyPromise, canonicalRequest) {
    const stringToSign = await this.createStringToSign(longDate, credentialScope, canonicalRequest, ALGORITHM_IDENTIFIER);
    const hash = new this.sha256(await keyPromise);
    hash.update(toUint8Array(stringToSign));
    return toHex(await hash.digest());
  }
  getSigningKey(credentials, region, shortDate, service) {
    return getSigningKey(this.sha256, credentials, shortDate, region, service || this.service);
  }
}
const booleanSelector = (obj, key, type) => {
  if (!(key in obj))
    return void 0;
  if (obj[key] === "true")
    return true;
  if (obj[key] === "false")
    return false;
  throw new Error(`Cannot load ${type} "${key}". Expected "true" or "false", got ${obj[key]}.`);
};
var SelectorType;
(function(SelectorType2) {
  SelectorType2["ENV"] = "env";
  SelectorType2["CONFIG"] = "shared config entry";
})(SelectorType || (SelectorType = {}));
const S3_EXPRESS_BUCKET_TYPE = "Directory";
const S3_EXPRESS_BACKEND = "S3Express";
const S3_EXPRESS_AUTH_SCHEME = "sigv4-s3express";
const SESSION_TOKEN_QUERY_PARAM = "X-Amz-S3session-Token";
const SESSION_TOKEN_HEADER = SESSION_TOKEN_QUERY_PARAM.toLowerCase();
const NODE_DISABLE_S3_EXPRESS_SESSION_AUTH_ENV_NAME = "AWS_S3_DISABLE_EXPRESS_SESSION_AUTH";
const NODE_DISABLE_S3_EXPRESS_SESSION_AUTH_INI_NAME = "s3_disable_express_session_auth";
const NODE_DISABLE_S3_EXPRESS_SESSION_AUTH_OPTIONS = {
  environmentVariableSelector: (env2) => booleanSelector(env2, NODE_DISABLE_S3_EXPRESS_SESSION_AUTH_ENV_NAME, SelectorType.ENV),
  configFileSelector: (profile) => booleanSelector(profile, NODE_DISABLE_S3_EXPRESS_SESSION_AUTH_INI_NAME, SelectorType.CONFIG),
  default: false
};
class SignatureV4S3Express extends SignatureV4 {
  async signWithCredentials(requestToSign, credentials, options) {
    const credentialsWithoutSessionToken = getCredentialsWithoutSessionToken(credentials);
    requestToSign.headers[SESSION_TOKEN_HEADER] = credentials.sessionToken;
    const privateAccess = this;
    setSingleOverride(privateAccess, credentialsWithoutSessionToken);
    return privateAccess.signRequest(requestToSign, options ?? {});
  }
  async presignWithCredentials(requestToSign, credentials, options) {
    const credentialsWithoutSessionToken = getCredentialsWithoutSessionToken(credentials);
    delete requestToSign.headers[SESSION_TOKEN_HEADER];
    requestToSign.headers[SESSION_TOKEN_QUERY_PARAM] = credentials.sessionToken;
    requestToSign.query = requestToSign.query ?? {};
    requestToSign.query[SESSION_TOKEN_QUERY_PARAM] = credentials.sessionToken;
    const privateAccess = this;
    setSingleOverride(privateAccess, credentialsWithoutSessionToken);
    return this.presign(requestToSign, options);
  }
}
function getCredentialsWithoutSessionToken(credentials) {
  const credentialsWithoutSessionToken = {
    accessKeyId: credentials.accessKeyId,
    secretAccessKey: credentials.secretAccessKey,
    expiration: credentials.expiration
  };
  return credentialsWithoutSessionToken;
}
function setSingleOverride(privateAccess, credentialsWithoutSessionToken) {
  const id = setTimeout(() => {
    throw new Error("SignatureV4S3Express credential override was created but not called.");
  }, 10);
  const currentCredentialProvider = privateAccess.credentialProvider;
  const overrideCredentialsProviderOnce = () => {
    clearTimeout(id);
    privateAccess.credentialProvider = currentCredentialProvider;
    return Promise.resolve(credentialsWithoutSessionToken);
  };
  privateAccess.credentialProvider = overrideCredentialsProviderOnce;
}
const s3ExpressMiddleware = (options) => {
  return (next, context) => async (args) => {
    if (context.endpointV2) {
      const endpoint = context.endpointV2;
      const isS3ExpressAuth = endpoint.properties?.authSchemes?.[0]?.name === S3_EXPRESS_AUTH_SCHEME;
      const isS3ExpressBucket = endpoint.properties?.backend === S3_EXPRESS_BACKEND || endpoint.properties?.bucketType === S3_EXPRESS_BUCKET_TYPE;
      if (isS3ExpressBucket) {
        setFeature$1(context, "S3_EXPRESS_BUCKET", "J");
        context.isS3ExpressBucket = true;
      }
      if (isS3ExpressAuth) {
        const requestBucket = args.input.Bucket;
        if (requestBucket) {
          const s3ExpressIdentity = await options.s3ExpressIdentityProvider.getS3ExpressIdentity(await options.credentials(), {
            Bucket: requestBucket
          });
          context.s3ExpressIdentity = s3ExpressIdentity;
          if (HttpRequest.isInstance(args.request) && s3ExpressIdentity.sessionToken) {
            args.request.headers[SESSION_TOKEN_HEADER] = s3ExpressIdentity.sessionToken;
          }
        }
      }
    }
    return next(args);
  };
};
const s3ExpressMiddlewareOptions = {
  name: "s3ExpressMiddleware",
  step: "build",
  tags: ["S3", "S3_EXPRESS"],
  override: true
};
const getS3ExpressPlugin = (options) => ({
  applyToStack: (clientStack) => {
    clientStack.add(s3ExpressMiddleware(options), s3ExpressMiddlewareOptions);
  }
});
const resolveAuthOptions = (candidateAuthOptions, authSchemePreference) => {
  if (!authSchemePreference || authSchemePreference.length === 0) {
    return candidateAuthOptions;
  }
  const preferredAuthOptions = [];
  for (const preferredSchemeName of authSchemePreference) {
    for (const candidateAuthOption of candidateAuthOptions) {
      const candidateAuthSchemeName = candidateAuthOption.schemeId.split("#")[1];
      if (candidateAuthSchemeName === preferredSchemeName) {
        preferredAuthOptions.push(candidateAuthOption);
      }
    }
  }
  for (const candidateAuthOption of candidateAuthOptions) {
    if (!preferredAuthOptions.find(({ schemeId }) => schemeId === candidateAuthOption.schemeId)) {
      preferredAuthOptions.push(candidateAuthOption);
    }
  }
  return preferredAuthOptions;
};
function convertHttpAuthSchemesToMap(httpAuthSchemes) {
  const map = /* @__PURE__ */ new Map();
  for (const scheme of httpAuthSchemes) {
    map.set(scheme.schemeId, scheme);
  }
  return map;
}
const httpAuthSchemeMiddleware = (config, mwOptions) => (next, context) => async (args) => {
  const options = config.httpAuthSchemeProvider(await mwOptions.httpAuthSchemeParametersProvider(config, context, args.input));
  const authSchemePreference = config.authSchemePreference ? await config.authSchemePreference() : [];
  const resolvedOptions = resolveAuthOptions(options, authSchemePreference);
  const authSchemes = convertHttpAuthSchemesToMap(config.httpAuthSchemes);
  const smithyContext = getSmithyContext(context);
  const failureReasons = [];
  for (const option of resolvedOptions) {
    const scheme = authSchemes.get(option.schemeId);
    if (!scheme) {
      failureReasons.push(`HttpAuthScheme \`${option.schemeId}\` was not enabled for this service.`);
      continue;
    }
    const identityProvider = scheme.identityProvider(await mwOptions.identityProviderConfigProvider(config));
    if (!identityProvider) {
      failureReasons.push(`HttpAuthScheme \`${option.schemeId}\` did not have an IdentityProvider configured.`);
      continue;
    }
    const { identityProperties = {}, signingProperties = {} } = option.propertiesExtractor?.(config, context) || {};
    option.identityProperties = Object.assign(option.identityProperties || {}, identityProperties);
    option.signingProperties = Object.assign(option.signingProperties || {}, signingProperties);
    smithyContext.selectedHttpAuthScheme = {
      httpAuthOption: option,
      identity: await identityProvider(option.identityProperties),
      signer: scheme.signer
    };
    break;
  }
  if (!smithyContext.selectedHttpAuthScheme) {
    throw new Error(failureReasons.join("\n"));
  }
  return next(args);
};
const httpAuthSchemeEndpointRuleSetMiddlewareOptions = {
  step: "serialize",
  tags: ["HTTP_AUTH_SCHEME"],
  name: "httpAuthSchemeMiddleware",
  override: true,
  relation: "before",
  toMiddleware: "endpointV2Middleware"
};
const getHttpAuthSchemeEndpointRuleSetPlugin = (config, { httpAuthSchemeParametersProvider, identityProviderConfigProvider }) => ({
  applyToStack: (clientStack) => {
    clientStack.addRelativeTo(httpAuthSchemeMiddleware(config, {
      httpAuthSchemeParametersProvider,
      identityProviderConfigProvider
    }), httpAuthSchemeEndpointRuleSetMiddlewareOptions);
  }
});
const defaultErrorHandler$1 = (signingProperties) => (error) => {
  throw error;
};
const defaultSuccessHandler$1 = (httpResponse, signingProperties) => {
};
const httpSigningMiddleware = (config) => (next, context) => async (args) => {
  if (!HttpRequest.isInstance(args.request)) {
    return next(args);
  }
  const smithyContext = getSmithyContext(context);
  const scheme = smithyContext.selectedHttpAuthScheme;
  if (!scheme) {
    throw new Error(`No HttpAuthScheme was selected: unable to sign request`);
  }
  const { httpAuthOption: { signingProperties = {} }, identity, signer } = scheme;
  const output = await next({
    ...args,
    request: await signer.sign(args.request, identity, signingProperties)
  }).catch((signer.errorHandler || defaultErrorHandler$1)(signingProperties));
  (signer.successHandler || defaultSuccessHandler$1)(output.response, signingProperties);
  return output;
};
const httpSigningMiddlewareOptions = {
  step: "finalizeRequest",
  tags: ["HTTP_SIGNING"],
  name: "httpSigningMiddleware",
  aliases: ["apiKeyMiddleware", "tokenMiddleware", "awsAuthMiddleware"],
  override: true,
  relation: "after",
  toMiddleware: "retryMiddleware"
};
const getHttpSigningPlugin = (config) => ({
  applyToStack: (clientStack) => {
    clientStack.addRelativeTo(httpSigningMiddleware(), httpSigningMiddlewareOptions);
  }
});
const normalizeProvider = (input) => {
  if (typeof input === "function")
    return input;
  const promisified = Promise.resolve(input);
  return () => promisified;
};
function setFeature(context, feature, value) {
  if (!context.__smithy_context) {
    context.__smithy_context = {
      features: {}
    };
  } else if (!context.__smithy_context.features) {
    context.__smithy_context.features = {};
  }
  context.__smithy_context.features[feature] = value;
}
class DefaultIdentityProviderConfig {
  authSchemes = /* @__PURE__ */ new Map();
  constructor(config) {
    for (const [key, value] of Object.entries(config)) {
      if (value !== void 0) {
        this.authSchemes.set(key, value);
      }
    }
  }
  getIdentityProvider(schemeId) {
    return this.authSchemes.get(schemeId);
  }
}
const createIsIdentityExpiredFunction = (expirationMs) => function isIdentityExpired2(identity) {
  return doesIdentityRequireRefresh(identity) && identity.expiration.getTime() - Date.now() < expirationMs;
};
const EXPIRATION_MS = 3e5;
const isIdentityExpired = createIsIdentityExpiredFunction(EXPIRATION_MS);
const doesIdentityRequireRefresh = (identity) => identity.expiration !== void 0;
const memoizeIdentityProvider = (provider, isExpired, requiresRefresh) => {
  if (provider === void 0) {
    return void 0;
  }
  const normalizedProvider = typeof provider !== "function" ? async () => Promise.resolve(provider) : provider;
  let resolved;
  let pending;
  let hasResult;
  let isConstant = false;
  const coalesceProvider = async (options) => {
    if (!pending) {
      pending = normalizedProvider(options);
    }
    try {
      resolved = await pending;
      hasResult = true;
      isConstant = false;
    } finally {
      pending = void 0;
    }
    return resolved;
  };
  if (isExpired === void 0) {
    return async (options) => {
      if (!hasResult || options?.forceRefresh) {
        resolved = await coalesceProvider(options);
      }
      return resolved;
    };
  }
  return async (options) => {
    if (!hasResult || options?.forceRefresh) {
      resolved = await coalesceProvider(options);
    }
    if (isConstant) {
      return resolved;
    }
    if (!requiresRefresh(resolved)) {
      isConstant = true;
      return resolved;
    }
    if (isExpired(resolved)) {
      await coalesceProvider(options);
      return resolved;
    }
    return resolved;
  };
};
const signS3Express = async (s3ExpressIdentity, signingOptions, request2, sigV4MultiRegionSigner) => {
  const signedRequest = await sigV4MultiRegionSigner.signWithCredentials(request2, s3ExpressIdentity, {});
  if (signedRequest.headers["X-Amz-Security-Token"] || signedRequest.headers["x-amz-security-token"]) {
    throw new Error("X-Amz-Security-Token must not be set for s3-express requests.");
  }
  return signedRequest;
};
const defaultErrorHandler = (signingProperties) => (error) => {
  throw error;
};
const defaultSuccessHandler = (httpResponse, signingProperties) => {
};
const s3ExpressHttpSigningMiddleware = (config) => (next, context) => async (args) => {
  if (!HttpRequest.isInstance(args.request)) {
    return next(args);
  }
  const smithyContext = getSmithyContext(context);
  const scheme = smithyContext.selectedHttpAuthScheme;
  if (!scheme) {
    throw new Error(`No HttpAuthScheme was selected: unable to sign request`);
  }
  const { httpAuthOption: { signingProperties = {} }, identity, signer } = scheme;
  let request2;
  if (context.s3ExpressIdentity) {
    request2 = await signS3Express(context.s3ExpressIdentity, signingProperties, args.request, await config.signer());
  } else {
    request2 = await signer.sign(args.request, identity, signingProperties);
  }
  const output = await next({
    ...args,
    request: request2
  }).catch((signer.errorHandler || defaultErrorHandler)(signingProperties));
  (signer.successHandler || defaultSuccessHandler)(output.response, signingProperties);
  return output;
};
const getS3ExpressHttpSigningPlugin = (config) => ({
  applyToStack: (clientStack) => {
    clientStack.addRelativeTo(s3ExpressHttpSigningMiddleware(config), httpSigningMiddlewareOptions);
  }
});
const resolveS3Config = (input, { session }) => {
  const [s3ClientProvider, CreateSessionCommandCtor] = session;
  const { forcePathStyle, useAccelerateEndpoint, disableMultiregionAccessPoints, followRegionRedirects, s3ExpressIdentityProvider, bucketEndpoint, expectContinueHeader } = input;
  return Object.assign(input, {
    forcePathStyle: forcePathStyle ?? false,
    useAccelerateEndpoint: useAccelerateEndpoint ?? false,
    disableMultiregionAccessPoints: disableMultiregionAccessPoints ?? false,
    followRegionRedirects: followRegionRedirects ?? false,
    s3ExpressIdentityProvider: s3ExpressIdentityProvider ?? new S3ExpressIdentityProviderImpl(async (key) => s3ClientProvider().send(new CreateSessionCommandCtor({
      Bucket: key
    }))),
    bucketEndpoint: bucketEndpoint ?? false,
    expectContinueHeader: expectContinueHeader ?? 2097152
  });
};
const THROW_IF_EMPTY_BODY = {
  CopyObjectCommand: true,
  UploadPartCopyCommand: true,
  CompleteMultipartUploadCommand: true
};
const MAX_BYTES_TO_INSPECT = 3e3;
const throw200ExceptionsMiddleware = (config) => (next, context) => async (args) => {
  const result = await next(args);
  const { response } = result;
  if (!HttpResponse.isInstance(response)) {
    return result;
  }
  const { statusCode, body: sourceBody } = response;
  if (statusCode < 200 || statusCode >= 300) {
    return result;
  }
  const isSplittableStream = typeof sourceBody?.stream === "function" || typeof sourceBody?.pipe === "function" || typeof sourceBody?.tee === "function";
  if (!isSplittableStream) {
    return result;
  }
  let bodyCopy = sourceBody;
  let body = sourceBody;
  if (sourceBody && typeof sourceBody === "object" && !(sourceBody instanceof Uint8Array)) {
    [bodyCopy, body] = await splitStream(sourceBody);
  }
  response.body = body;
  const bodyBytes = await collectBody(bodyCopy, {
    streamCollector: async (stream) => {
      return headStream(stream, MAX_BYTES_TO_INSPECT);
    }
  });
  if (typeof bodyCopy?.destroy === "function") {
    bodyCopy.destroy();
  }
  const bodyStringTail = config.utf8Encoder(bodyBytes.subarray(bodyBytes.length - 16));
  if (bodyBytes.length === 0 && THROW_IF_EMPTY_BODY[context.commandName]) {
    const err = new Error("S3 aborted request");
    err.name = "InternalError";
    throw err;
  }
  if (bodyStringTail && bodyStringTail.endsWith("</Error>")) {
    response.statusCode = 400;
  }
  return result;
};
const collectBody = (streamBody = new Uint8Array(), context) => {
  if (streamBody instanceof Uint8Array) {
    return Promise.resolve(streamBody);
  }
  return context.streamCollector(streamBody) || Promise.resolve(new Uint8Array());
};
const throw200ExceptionsMiddlewareOptions = {
  relation: "after",
  toMiddleware: "deserializerMiddleware",
  tags: ["THROW_200_EXCEPTIONS", "S3"],
  name: "throw200ExceptionsMiddleware",
  override: true
};
const getThrow200ExceptionsPlugin = (config) => ({
  applyToStack: (clientStack) => {
    clientStack.addRelativeTo(throw200ExceptionsMiddleware(config), throw200ExceptionsMiddlewareOptions);
  }
});
const validate$1 = (str) => typeof str === "string" && str.indexOf("arn:") === 0 && str.split(":").length >= 6;
function bucketEndpointMiddleware(options) {
  return (next, context) => async (args) => {
    if (options.bucketEndpoint) {
      const endpoint = context.endpointV2;
      if (endpoint) {
        const bucket = args.input.Bucket;
        if (typeof bucket === "string") {
          try {
            const bucketEndpointUrl = new URL(bucket);
            context.endpointV2 = {
              ...endpoint,
              url: bucketEndpointUrl
            };
          } catch (e2) {
            const warning = `@aws-sdk/middleware-sdk-s3: bucketEndpoint=true was set but Bucket=${bucket} could not be parsed as URL.`;
            if (context.logger?.constructor?.name === "NoOpLogger") {
              console.warn(warning);
            } else {
              context.logger?.warn?.(warning);
            }
            throw e2;
          }
        }
      }
    }
    return next(args);
  };
}
const bucketEndpointMiddlewareOptions = {
  name: "bucketEndpointMiddleware",
  override: true,
  relation: "after",
  toMiddleware: "endpointV2Middleware"
};
function validateBucketNameMiddleware({ bucketEndpoint }) {
  return (next) => async (args) => {
    const { input: { Bucket } } = args;
    if (!bucketEndpoint && typeof Bucket === "string" && !validate$1(Bucket) && Bucket.indexOf("/") >= 0) {
      const err = new Error(`Bucket name shouldn't contain '/', received '${Bucket}'`);
      err.name = "InvalidBucketName";
      throw err;
    }
    return next({ ...args });
  };
}
const validateBucketNameMiddlewareOptions = {
  step: "initialize",
  tags: ["VALIDATE_BUCKET_NAME"],
  name: "validateBucketNameMiddleware",
  override: true
};
const getValidateBucketNamePlugin = (options) => ({
  applyToStack: (clientStack) => {
    clientStack.add(validateBucketNameMiddleware(options), validateBucketNameMiddlewareOptions);
    clientStack.addRelativeTo(bucketEndpointMiddleware(options), bucketEndpointMiddlewareOptions);
  }
});
class ProtocolLib {
  queryCompat;
  errorRegistry;
  constructor(queryCompat = false) {
    this.queryCompat = queryCompat;
  }
  resolveRestContentType(defaultContentType, inputSchema) {
    const members = inputSchema.getMemberSchemas();
    const httpPayloadMember = Object.values(members).find((m2) => {
      return !!m2.getMergedTraits().httpPayload;
    });
    if (httpPayloadMember) {
      const mediaType = httpPayloadMember.getMergedTraits().mediaType;
      if (mediaType) {
        return mediaType;
      } else if (httpPayloadMember.isStringSchema()) {
        return "text/plain";
      } else if (httpPayloadMember.isBlobSchema()) {
        return "application/octet-stream";
      } else {
        return defaultContentType;
      }
    } else if (!inputSchema.isUnitSchema()) {
      const hasBody = Object.values(members).find((m2) => {
        const { httpQuery, httpQueryParams, httpHeader, httpLabel, httpPrefixHeaders } = m2.getMergedTraits();
        const noPrefixHeaders = httpPrefixHeaders === void 0;
        return !httpQuery && !httpQueryParams && !httpHeader && !httpLabel && noPrefixHeaders;
      });
      if (hasBody) {
        return defaultContentType;
      }
    }
  }
  async getErrorSchemaOrThrowBaseException(errorIdentifier, defaultNamespace, response, dataObject, metadata, getErrorSchema) {
    let errorName = errorIdentifier;
    if (errorIdentifier.includes("#")) {
      [, errorName] = errorIdentifier.split("#");
    }
    const errorMetadata = {
      $metadata: metadata,
      $fault: response.statusCode < 500 ? "client" : "server"
    };
    if (!this.errorRegistry) {
      throw new Error("@aws-sdk/core/protocols - error handler not initialized.");
    }
    try {
      const errorSchema = getErrorSchema?.(this.errorRegistry, errorName) ?? this.errorRegistry.getSchema(errorIdentifier);
      return { errorSchema, errorMetadata };
    } catch (e2) {
      dataObject.message = dataObject.message ?? dataObject.Message ?? "UnknownError";
      const synthetic = this.errorRegistry;
      const baseExceptionSchema = synthetic.getBaseException();
      if (baseExceptionSchema) {
        const ErrorCtor = synthetic.getErrorCtor(baseExceptionSchema) ?? Error;
        throw this.decorateServiceException(Object.assign(new ErrorCtor({ name: errorName }), errorMetadata), dataObject);
      }
      const d2 = dataObject;
      const message = d2?.message ?? d2?.Message ?? d2?.Error?.Message ?? d2?.Error?.message;
      throw this.decorateServiceException(Object.assign(new Error(message), {
        name: errorName
      }, errorMetadata), dataObject);
    }
  }
  compose(composite, errorIdentifier, defaultNamespace) {
    let namespace = defaultNamespace;
    if (errorIdentifier.includes("#")) {
      [namespace] = errorIdentifier.split("#");
    }
    const staticRegistry = TypeRegistry.for(namespace);
    const defaultSyntheticRegistry = TypeRegistry.for("smithy.ts.sdk.synthetic." + defaultNamespace);
    composite.copyFrom(staticRegistry);
    composite.copyFrom(defaultSyntheticRegistry);
    this.errorRegistry = composite;
  }
  decorateServiceException(exception, additions = {}) {
    if (this.queryCompat) {
      const msg = exception.Message ?? additions.Message;
      const error = decorateServiceException(exception, additions);
      if (msg) {
        error.message = msg;
      }
      error.Error = {
        ...error.Error,
        Type: error.Error?.Type,
        Code: error.Error?.Code,
        Message: error.Error?.message ?? error.Error?.Message ?? msg
      };
      const reqId = error.$metadata.requestId;
      if (reqId) {
        error.RequestId = reqId;
      }
      return error;
    }
    return decorateServiceException(exception, additions);
  }
  setQueryCompatError(output, response) {
    const queryErrorHeader = response.headers?.["x-amzn-query-error"];
    if (output !== void 0 && queryErrorHeader != null) {
      const [Code, Type] = queryErrorHeader.split(";");
      const entries = Object.entries(output);
      const Error2 = {
        Code,
        Type
      };
      Object.assign(output, Error2);
      for (const [k2, v2] of entries) {
        Error2[k2 === "message" ? "Message" : k2] = v2;
      }
      delete Error2.__type;
      output.Error = Error2;
    }
  }
  queryCompatOutput(queryCompatErrorData, errorData) {
    if (queryCompatErrorData.Error) {
      errorData.Error = queryCompatErrorData.Error;
    }
    if (queryCompatErrorData.Type) {
      errorData.Type = queryCompatErrorData.Type;
    }
    if (queryCompatErrorData.Code) {
      errorData.Code = queryCompatErrorData.Code;
    }
  }
  findQueryCompatibleError(registry, errorName) {
    try {
      return registry.getSchema(errorName);
    } catch (e2) {
      return registry.find((schema) => NormalizedSchema.of(schema).getMergedTraits().awsQueryError?.[0] === errorName);
    }
  }
}
class SerdeContextConfig {
  serdeContext;
  setSerdeContext(serdeContext) {
    this.serdeContext = serdeContext;
  }
}
class UnionSerde {
  from;
  to;
  keys;
  constructor(from, to) {
    this.from = from;
    this.to = to;
    this.keys = new Set(Object.keys(this.from).filter((k2) => k2 !== "__type"));
  }
  mark(key) {
    this.keys.delete(key);
  }
  hasUnknown() {
    return this.keys.size === 1 && Object.keys(this.to).length === 0;
  }
  writeUnknown() {
    if (this.hasUnknown()) {
      const k2 = this.keys.values().next().value;
      const v2 = this.from[k2];
      this.to.$unknown = [k2, v2];
    }
  }
}
const ATTR_ESCAPE_RE = /[&<>"]/g;
const ATTR_ESCAPE_MAP = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;"
};
function escapeAttribute(value) {
  return value.replace(ATTR_ESCAPE_RE, (ch2) => ATTR_ESCAPE_MAP[ch2]);
}
const ELEMENT_ESCAPE_RE = /[&"'<>\r\n\u0085\u2028]/g;
const ELEMENT_ESCAPE_MAP = {
  "&": "&amp;",
  '"': "&quot;",
  "'": "&apos;",
  "<": "&lt;",
  ">": "&gt;",
  "\r": "&#x0D;",
  "\n": "&#x0A;",
  "": "&#x85;",
  "\u2028": "&#x2028;"
};
function escapeElement(value) {
  return value.replace(ELEMENT_ESCAPE_RE, (ch2) => ELEMENT_ESCAPE_MAP[ch2]);
}
class XmlText {
  value;
  constructor(value) {
    this.value = value;
  }
  toString() {
    return escapeElement("" + this.value);
  }
}
let XmlNode$1 = class XmlNode {
  name;
  children;
  attributes = {};
  static of(name, childText, withName) {
    const node = new XmlNode(name);
    if (childText !== void 0) {
      node.addChildNode(new XmlText(childText));
    }
    if (withName !== void 0) {
      node.withName(withName);
    }
    return node;
  }
  constructor(name, children = []) {
    this.name = name;
    this.children = children;
  }
  withName(name) {
    this.name = name;
    return this;
  }
  addAttribute(name, value) {
    this.attributes[name] = value;
    return this;
  }
  addChildNode(child) {
    this.children.push(child);
    return this;
  }
  removeAttribute(name) {
    delete this.attributes[name];
    return this;
  }
  n(name) {
    this.name = name;
    return this;
  }
  c(child) {
    this.children.push(child);
    return this;
  }
  a(name, value) {
    if (value != null) {
      this.attributes[name] = value;
    }
    return this;
  }
  cc(input, field, withName = field) {
    if (input[field] != null) {
      const node = XmlNode.of(field, input[field]).withName(withName);
      this.c(node);
    }
  }
  l(input, listName, memberName, valueProvider) {
    if (input[listName] != null) {
      const nodes = valueProvider();
      nodes.map((node) => {
        node.withName(memberName);
        this.c(node);
      });
    }
  }
  lc(input, listName, memberName, valueProvider) {
    if (input[listName] != null) {
      const nodes = valueProvider();
      const containerNode = new XmlNode(memberName);
      nodes.map((node) => {
        containerNode.c(node);
      });
      this.c(containerNode);
    }
  }
  toString() {
    const hasChildren = Boolean(this.children.length);
    let xmlText = `<${this.name}`;
    const attributes = this.attributes;
    for (const attributeName of Object.keys(attributes)) {
      const attribute = attributes[attributeName];
      if (attribute != null) {
        xmlText += ` ${attributeName}="${escapeAttribute("" + attribute)}"`;
      }
    }
    return xmlText += !hasChildren ? "/>" : `>${this.children.map((c2) => c2.toString()).join("")}</${this.name}>`;
  }
};
const nameStartChar = ":A-Za-z_\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD";
const nameChar = nameStartChar + "\\-.\\d\\u00B7\\u0300-\\u036F\\u203F-\\u2040";
const nameRegexp = "[" + nameStartChar + "][" + nameChar + "]*";
const regexName = new RegExp("^" + nameRegexp + "$");
function getAllMatches(string, regex) {
  const matches = [];
  let match = regex.exec(string);
  while (match) {
    const allmatches = [];
    allmatches.startIndex = regex.lastIndex - match[0].length;
    const len = match.length;
    for (let index = 0; index < len; index++) {
      allmatches.push(match[index]);
    }
    matches.push(allmatches);
    match = regex.exec(string);
  }
  return matches;
}
const isName = function(string) {
  const match = regexName.exec(string);
  return !(match === null || typeof match === "undefined");
};
function isExist(v2) {
  return typeof v2 !== "undefined";
}
const DANGEROUS_PROPERTY_NAMES = [
  // '__proto__',
  // 'constructor',
  // 'prototype',
  "hasOwnProperty",
  "toString",
  "valueOf",
  "__defineGetter__",
  "__defineSetter__",
  "__lookupGetter__",
  "__lookupSetter__"
];
const criticalProperties = ["__proto__", "constructor", "prototype"];
const defaultOptions$1 = {
  allowBooleanAttributes: false,
  //A tag can have attributes without any value
  unpairedTags: []
};
function validate(xmlData, options) {
  options = Object.assign({}, defaultOptions$1, options);
  const tags = [];
  let tagFound = false;
  let reachedRoot = false;
  if (xmlData[0] === "\uFEFF") {
    xmlData = xmlData.substr(1);
  }
  for (let i2 = 0; i2 < xmlData.length; i2++) {
    if (xmlData[i2] === "<" && xmlData[i2 + 1] === "?") {
      i2 += 2;
      i2 = readPI(xmlData, i2);
      if (i2.err) return i2;
    } else if (xmlData[i2] === "<") {
      let tagStartPos = i2;
      i2++;
      if (xmlData[i2] === "!") {
        i2 = readCommentAndCDATA(xmlData, i2);
        continue;
      } else {
        let closingTag = false;
        if (xmlData[i2] === "/") {
          closingTag = true;
          i2++;
        }
        let tagName = "";
        for (; i2 < xmlData.length && xmlData[i2] !== ">" && xmlData[i2] !== " " && xmlData[i2] !== "	" && xmlData[i2] !== "\n" && xmlData[i2] !== "\r"; i2++) {
          tagName += xmlData[i2];
        }
        tagName = tagName.trim();
        if (tagName[tagName.length - 1] === "/") {
          tagName = tagName.substring(0, tagName.length - 1);
          i2--;
        }
        if (!validateTagName(tagName)) {
          let msg;
          if (tagName.trim().length === 0) {
            msg = "Invalid space after '<'.";
          } else {
            msg = "Tag '" + tagName + "' is an invalid name.";
          }
          return getErrorObject("InvalidTag", msg, getLineNumberForPosition(xmlData, i2));
        }
        const result = readAttributeStr(xmlData, i2);
        if (result === false) {
          return getErrorObject("InvalidAttr", "Attributes for '" + tagName + "' have open quote.", getLineNumberForPosition(xmlData, i2));
        }
        let attrStr = result.value;
        i2 = result.index;
        if (attrStr[attrStr.length - 1] === "/") {
          const attrStrStart = i2 - attrStr.length;
          attrStr = attrStr.substring(0, attrStr.length - 1);
          const isValid = validateAttributeString(attrStr, options);
          if (isValid === true) {
            tagFound = true;
          } else {
            return getErrorObject(isValid.err.code, isValid.err.msg, getLineNumberForPosition(xmlData, attrStrStart + isValid.err.line));
          }
        } else if (closingTag) {
          if (!result.tagClosed) {
            return getErrorObject("InvalidTag", "Closing tag '" + tagName + "' doesn't have proper closing.", getLineNumberForPosition(xmlData, i2));
          } else if (attrStr.trim().length > 0) {
            return getErrorObject("InvalidTag", "Closing tag '" + tagName + "' can't have attributes or invalid starting.", getLineNumberForPosition(xmlData, tagStartPos));
          } else if (tags.length === 0) {
            return getErrorObject("InvalidTag", "Closing tag '" + tagName + "' has not been opened.", getLineNumberForPosition(xmlData, tagStartPos));
          } else {
            const otg = tags.pop();
            if (tagName !== otg.tagName) {
              let openPos = getLineNumberForPosition(xmlData, otg.tagStartPos);
              return getErrorObject(
                "InvalidTag",
                "Expected closing tag '" + otg.tagName + "' (opened in line " + openPos.line + ", col " + openPos.col + ") instead of closing tag '" + tagName + "'.",
                getLineNumberForPosition(xmlData, tagStartPos)
              );
            }
            if (tags.length == 0) {
              reachedRoot = true;
            }
          }
        } else {
          const isValid = validateAttributeString(attrStr, options);
          if (isValid !== true) {
            return getErrorObject(isValid.err.code, isValid.err.msg, getLineNumberForPosition(xmlData, i2 - attrStr.length + isValid.err.line));
          }
          if (reachedRoot === true) {
            return getErrorObject("InvalidXml", "Multiple possible root nodes found.", getLineNumberForPosition(xmlData, i2));
          } else if (options.unpairedTags.indexOf(tagName) !== -1) ;
          else {
            tags.push({ tagName, tagStartPos });
          }
          tagFound = true;
        }
        for (i2++; i2 < xmlData.length; i2++) {
          if (xmlData[i2] === "<") {
            if (xmlData[i2 + 1] === "!") {
              i2++;
              i2 = readCommentAndCDATA(xmlData, i2);
              continue;
            } else if (xmlData[i2 + 1] === "?") {
              i2 = readPI(xmlData, ++i2);
              if (i2.err) return i2;
            } else {
              break;
            }
          } else if (xmlData[i2] === "&") {
            const afterAmp = validateAmpersand(xmlData, i2);
            if (afterAmp == -1)
              return getErrorObject("InvalidChar", "char '&' is not expected.", getLineNumberForPosition(xmlData, i2));
            i2 = afterAmp;
          } else {
            if (reachedRoot === true && !isWhiteSpace(xmlData[i2])) {
              return getErrorObject("InvalidXml", "Extra text at the end", getLineNumberForPosition(xmlData, i2));
            }
          }
        }
        if (xmlData[i2] === "<") {
          i2--;
        }
      }
    } else {
      if (isWhiteSpace(xmlData[i2])) {
        continue;
      }
      return getErrorObject("InvalidChar", "char '" + xmlData[i2] + "' is not expected.", getLineNumberForPosition(xmlData, i2));
    }
  }
  if (!tagFound) {
    return getErrorObject("InvalidXml", "Start tag expected.", 1);
  } else if (tags.length == 1) {
    return getErrorObject("InvalidTag", "Unclosed tag '" + tags[0].tagName + "'.", getLineNumberForPosition(xmlData, tags[0].tagStartPos));
  } else if (tags.length > 0) {
    return getErrorObject("InvalidXml", "Invalid '" + JSON.stringify(tags.map((t8) => t8.tagName), null, 4).replace(/\r?\n/g, "") + "' found.", { line: 1, col: 1 });
  }
  return true;
}
function isWhiteSpace(char) {
  return char === " " || char === "	" || char === "\n" || char === "\r";
}
function readPI(xmlData, i2) {
  const start = i2;
  for (; i2 < xmlData.length; i2++) {
    if (xmlData[i2] == "?" || xmlData[i2] == " ") {
      const tagname = xmlData.substr(start, i2 - start);
      if (i2 > 5 && tagname === "xml") {
        return getErrorObject("InvalidXml", "XML declaration allowed only at the start of the document.", getLineNumberForPosition(xmlData, i2));
      } else if (xmlData[i2] == "?" && xmlData[i2 + 1] == ">") {
        i2++;
        break;
      } else {
        continue;
      }
    }
  }
  return i2;
}
function readCommentAndCDATA(xmlData, i2) {
  if (xmlData.length > i2 + 5 && xmlData[i2 + 1] === "-" && xmlData[i2 + 2] === "-") {
    for (i2 += 3; i2 < xmlData.length; i2++) {
      if (xmlData[i2] === "-" && xmlData[i2 + 1] === "-" && xmlData[i2 + 2] === ">") {
        i2 += 2;
        break;
      }
    }
  } else if (xmlData.length > i2 + 8 && xmlData[i2 + 1] === "D" && xmlData[i2 + 2] === "O" && xmlData[i2 + 3] === "C" && xmlData[i2 + 4] === "T" && xmlData[i2 + 5] === "Y" && xmlData[i2 + 6] === "P" && xmlData[i2 + 7] === "E") {
    let angleBracketsCount = 1;
    for (i2 += 8; i2 < xmlData.length; i2++) {
      if (xmlData[i2] === "<") {
        angleBracketsCount++;
      } else if (xmlData[i2] === ">") {
        angleBracketsCount--;
        if (angleBracketsCount === 0) {
          break;
        }
      }
    }
  } else if (xmlData.length > i2 + 9 && xmlData[i2 + 1] === "[" && xmlData[i2 + 2] === "C" && xmlData[i2 + 3] === "D" && xmlData[i2 + 4] === "A" && xmlData[i2 + 5] === "T" && xmlData[i2 + 6] === "A" && xmlData[i2 + 7] === "[") {
    for (i2 += 8; i2 < xmlData.length; i2++) {
      if (xmlData[i2] === "]" && xmlData[i2 + 1] === "]" && xmlData[i2 + 2] === ">") {
        i2 += 2;
        break;
      }
    }
  }
  return i2;
}
const doubleQuote = '"';
const singleQuote = "'";
function readAttributeStr(xmlData, i2) {
  let attrStr = "";
  let startChar = "";
  let tagClosed = false;
  for (; i2 < xmlData.length; i2++) {
    if (xmlData[i2] === doubleQuote || xmlData[i2] === singleQuote) {
      if (startChar === "") {
        startChar = xmlData[i2];
      } else if (startChar !== xmlData[i2]) ;
      else {
        startChar = "";
      }
    } else if (xmlData[i2] === ">") {
      if (startChar === "") {
        tagClosed = true;
        break;
      }
    }
    attrStr += xmlData[i2];
  }
  if (startChar !== "") {
    return false;
  }
  return {
    value: attrStr,
    index: i2,
    tagClosed
  };
}
const validAttrStrRegxp = new RegExp(`(\\s*)([^\\s=]+)(\\s*=)?(\\s*(['"])(([\\s\\S])*?)\\5)?`, "g");
function validateAttributeString(attrStr, options) {
  const matches = getAllMatches(attrStr, validAttrStrRegxp);
  const attrNames = {};
  for (let i2 = 0; i2 < matches.length; i2++) {
    if (matches[i2][1].length === 0) {
      return getErrorObject("InvalidAttr", "Attribute '" + matches[i2][2] + "' has no space in starting.", getPositionFromMatch(matches[i2]));
    } else if (matches[i2][3] !== void 0 && matches[i2][4] === void 0) {
      return getErrorObject("InvalidAttr", "Attribute '" + matches[i2][2] + "' is without value.", getPositionFromMatch(matches[i2]));
    } else if (matches[i2][3] === void 0 && !options.allowBooleanAttributes) {
      return getErrorObject("InvalidAttr", "boolean attribute '" + matches[i2][2] + "' is not allowed.", getPositionFromMatch(matches[i2]));
    }
    const attrName = matches[i2][2];
    if (!validateAttrName(attrName)) {
      return getErrorObject("InvalidAttr", "Attribute '" + attrName + "' is an invalid name.", getPositionFromMatch(matches[i2]));
    }
    if (!Object.prototype.hasOwnProperty.call(attrNames, attrName)) {
      attrNames[attrName] = 1;
    } else {
      return getErrorObject("InvalidAttr", "Attribute '" + attrName + "' is repeated.", getPositionFromMatch(matches[i2]));
    }
  }
  return true;
}
function validateNumberAmpersand(xmlData, i2) {
  let re = /\d/;
  if (xmlData[i2] === "x") {
    i2++;
    re = /[\da-fA-F]/;
  }
  for (; i2 < xmlData.length; i2++) {
    if (xmlData[i2] === ";")
      return i2;
    if (!xmlData[i2].match(re))
      break;
  }
  return -1;
}
function validateAmpersand(xmlData, i2) {
  i2++;
  if (xmlData[i2] === ";")
    return -1;
  if (xmlData[i2] === "#") {
    i2++;
    return validateNumberAmpersand(xmlData, i2);
  }
  let count = 0;
  for (; i2 < xmlData.length; i2++, count++) {
    if (xmlData[i2].match(/\w/) && count < 20)
      continue;
    if (xmlData[i2] === ";")
      break;
    return -1;
  }
  return i2;
}
function getErrorObject(code, message, lineNumber) {
  return {
    err: {
      code,
      msg: message,
      line: lineNumber.line || lineNumber,
      col: lineNumber.col
    }
  };
}
function validateAttrName(attrName) {
  return isName(attrName);
}
function validateTagName(tagname) {
  return isName(tagname);
}
function getLineNumberForPosition(xmlData, index) {
  const lines = xmlData.substring(0, index).split(/\r?\n/);
  return {
    line: lines.length,
    // column number is last line's length + 1, because column numbering starts at 1:
    col: lines[lines.length - 1].length + 1
  };
}
function getPositionFromMatch(match) {
  return match.startIndex + match[1].length;
}
const defaultOnDangerousProperty = (name) => {
  if (DANGEROUS_PROPERTY_NAMES.includes(name)) {
    return "__" + name;
  }
  return name;
};
const defaultOptions = {
  preserveOrder: false,
  attributeNamePrefix: "@_",
  attributesGroupName: false,
  textNodeName: "#text",
  ignoreAttributes: true,
  removeNSPrefix: false,
  // remove NS from tag name or attribute name if true
  allowBooleanAttributes: false,
  //a tag can have attributes without any value
  //ignoreRootElement : false,
  parseTagValue: true,
  parseAttributeValue: false,
  trimValues: true,
  //Trim string values of tag and attributes
  cdataPropName: false,
  numberParseOptions: {
    hex: true,
    leadingZeros: true,
    eNotation: true
  },
  tagValueProcessor: function(tagName, val) {
    return val;
  },
  attributeValueProcessor: function(attrName, val) {
    return val;
  },
  stopNodes: [],
  //nested tags will not be parsed even for errors
  alwaysCreateTextNode: false,
  isArray: () => false,
  commentPropName: false,
  unpairedTags: [],
  processEntities: true,
  htmlEntities: false,
  ignoreDeclaration: false,
  ignorePiTags: false,
  transformTagName: false,
  transformAttributeName: false,
  updateTag: function(tagName, jPath, attrs) {
    return tagName;
  },
  // skipEmptyListItem: false
  captureMetaData: false,
  maxNestedTags: 100,
  strictReservedNames: true,
  jPath: true,
  // if true, pass jPath string to callbacks; if false, pass matcher instance
  onDangerousProperty: defaultOnDangerousProperty
};
function validatePropertyName(propertyName, optionName) {
  if (typeof propertyName !== "string") {
    return;
  }
  const normalized = propertyName.toLowerCase();
  if (DANGEROUS_PROPERTY_NAMES.some((dangerous) => normalized === dangerous.toLowerCase())) {
    throw new Error(
      `[SECURITY] Invalid ${optionName}: "${propertyName}" is a reserved JavaScript keyword that could cause prototype pollution`
    );
  }
  if (criticalProperties.some((dangerous) => normalized === dangerous.toLowerCase())) {
    throw new Error(
      `[SECURITY] Invalid ${optionName}: "${propertyName}" is a reserved JavaScript keyword that could cause prototype pollution`
    );
  }
}
function normalizeProcessEntities(value) {
  if (typeof value === "boolean") {
    return {
      enabled: value,
      // true or false
      maxEntitySize: 1e4,
      maxExpansionDepth: 10,
      maxTotalExpansions: 1e3,
      maxExpandedLength: 1e5,
      maxEntityCount: 100,
      allowedTags: null,
      tagFilter: null
    };
  }
  if (typeof value === "object" && value !== null) {
    return {
      enabled: value.enabled !== false,
      maxEntitySize: Math.max(1, value.maxEntitySize ?? 1e4),
      maxExpansionDepth: Math.max(1, value.maxExpansionDepth ?? 10),
      maxTotalExpansions: Math.max(1, value.maxTotalExpansions ?? 1e3),
      maxExpandedLength: Math.max(1, value.maxExpandedLength ?? 1e5),
      maxEntityCount: Math.max(1, value.maxEntityCount ?? 100),
      allowedTags: value.allowedTags ?? null,
      tagFilter: value.tagFilter ?? null
    };
  }
  return normalizeProcessEntities(true);
}
const buildOptions = function(options) {
  const built = Object.assign({}, defaultOptions, options);
  const propertyNameOptions = [
    { value: built.attributeNamePrefix, name: "attributeNamePrefix" },
    { value: built.attributesGroupName, name: "attributesGroupName" },
    { value: built.textNodeName, name: "textNodeName" },
    { value: built.cdataPropName, name: "cdataPropName" },
    { value: built.commentPropName, name: "commentPropName" }
  ];
  for (const { value, name } of propertyNameOptions) {
    if (value) {
      validatePropertyName(value, name);
    }
  }
  if (built.onDangerousProperty === null) {
    built.onDangerousProperty = defaultOnDangerousProperty;
  }
  built.processEntities = normalizeProcessEntities(built.processEntities);
  if (built.stopNodes && Array.isArray(built.stopNodes)) {
    built.stopNodes = built.stopNodes.map((node) => {
      if (typeof node === "string" && node.startsWith("*.")) {
        return ".." + node.substring(2);
      }
      return node;
    });
  }
  return built;
};
let METADATA_SYMBOL$1;
if (typeof Symbol !== "function") {
  METADATA_SYMBOL$1 = "@@xmlMetadata";
} else {
  METADATA_SYMBOL$1 = /* @__PURE__ */ Symbol("XML Node Metadata");
}
class XmlNode2 {
  constructor(tagname) {
    this.tagname = tagname;
    this.child = [];
    this[":@"] = /* @__PURE__ */ Object.create(null);
  }
  add(key, val) {
    if (key === "__proto__") key = "#__proto__";
    this.child.push({ [key]: val });
  }
  addChild(node, startIndex) {
    if (node.tagname === "__proto__") node.tagname = "#__proto__";
    if (node[":@"] && Object.keys(node[":@"]).length > 0) {
      this.child.push({ [node.tagname]: node.child, [":@"]: node[":@"] });
    } else {
      this.child.push({ [node.tagname]: node.child });
    }
    if (startIndex !== void 0) {
      this.child[this.child.length - 1][METADATA_SYMBOL$1] = { startIndex };
    }
  }
  /** symbol used for metadata */
  static getMetaDataSymbol() {
    return METADATA_SYMBOL$1;
  }
}
class DocTypeReader {
  constructor(options) {
    this.suppressValidationErr = !options;
    this.options = options;
  }
  readDocType(xmlData, i2) {
    const entities = /* @__PURE__ */ Object.create(null);
    let entityCount = 0;
    if (xmlData[i2 + 3] === "O" && xmlData[i2 + 4] === "C" && xmlData[i2 + 5] === "T" && xmlData[i2 + 6] === "Y" && xmlData[i2 + 7] === "P" && xmlData[i2 + 8] === "E") {
      i2 = i2 + 9;
      let angleBracketsCount = 1;
      let hasBody = false, comment = false;
      let exp = "";
      for (; i2 < xmlData.length; i2++) {
        if (xmlData[i2] === "<" && !comment) {
          if (hasBody && hasSeq(xmlData, "!ENTITY", i2)) {
            i2 += 7;
            let entityName, val;
            [entityName, val, i2] = this.readEntityExp(xmlData, i2 + 1, this.suppressValidationErr);
            if (val.indexOf("&") === -1) {
              if (this.options.enabled !== false && this.options.maxEntityCount != null && entityCount >= this.options.maxEntityCount) {
                throw new Error(
                  `Entity count (${entityCount + 1}) exceeds maximum allowed (${this.options.maxEntityCount})`
                );
              }
              const escaped = entityName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
              entities[entityName] = {
                regx: RegExp(`&${escaped};`, "g"),
                val
              };
              entityCount++;
            }
          } else if (hasBody && hasSeq(xmlData, "!ELEMENT", i2)) {
            i2 += 8;
            const { index } = this.readElementExp(xmlData, i2 + 1);
            i2 = index;
          } else if (hasBody && hasSeq(xmlData, "!ATTLIST", i2)) {
            i2 += 8;
          } else if (hasBody && hasSeq(xmlData, "!NOTATION", i2)) {
            i2 += 9;
            const { index } = this.readNotationExp(xmlData, i2 + 1, this.suppressValidationErr);
            i2 = index;
          } else if (hasSeq(xmlData, "!--", i2)) comment = true;
          else throw new Error(`Invalid DOCTYPE`);
          angleBracketsCount++;
          exp = "";
        } else if (xmlData[i2] === ">") {
          if (comment) {
            if (xmlData[i2 - 1] === "-" && xmlData[i2 - 2] === "-") {
              comment = false;
              angleBracketsCount--;
            }
          } else {
            angleBracketsCount--;
          }
          if (angleBracketsCount === 0) {
            break;
          }
        } else if (xmlData[i2] === "[") {
          hasBody = true;
        } else {
          exp += xmlData[i2];
        }
      }
      if (angleBracketsCount !== 0) {
        throw new Error(`Unclosed DOCTYPE`);
      }
    } else {
      throw new Error(`Invalid Tag instead of DOCTYPE`);
    }
    return { entities, i: i2 };
  }
  readEntityExp(xmlData, i2) {
    i2 = skipWhitespace(xmlData, i2);
    const startIndex = i2;
    while (i2 < xmlData.length && !/\s/.test(xmlData[i2]) && xmlData[i2] !== '"' && xmlData[i2] !== "'") {
      i2++;
    }
    let entityName = xmlData.substring(startIndex, i2);
    validateEntityName(entityName);
    i2 = skipWhitespace(xmlData, i2);
    if (!this.suppressValidationErr) {
      if (xmlData.substring(i2, i2 + 6).toUpperCase() === "SYSTEM") {
        throw new Error("External entities are not supported");
      } else if (xmlData[i2] === "%") {
        throw new Error("Parameter entities are not supported");
      }
    }
    let entityValue = "";
    [i2, entityValue] = this.readIdentifierVal(xmlData, i2, "entity");
    if (this.options.enabled !== false && this.options.maxEntitySize != null && entityValue.length > this.options.maxEntitySize) {
      throw new Error(
        `Entity "${entityName}" size (${entityValue.length}) exceeds maximum allowed size (${this.options.maxEntitySize})`
      );
    }
    i2--;
    return [entityName, entityValue, i2];
  }
  readNotationExp(xmlData, i2) {
    i2 = skipWhitespace(xmlData, i2);
    const startIndex = i2;
    while (i2 < xmlData.length && !/\s/.test(xmlData[i2])) {
      i2++;
    }
    let notationName = xmlData.substring(startIndex, i2);
    !this.suppressValidationErr && validateEntityName(notationName);
    i2 = skipWhitespace(xmlData, i2);
    const identifierType = xmlData.substring(i2, i2 + 6).toUpperCase();
    if (!this.suppressValidationErr && identifierType !== "SYSTEM" && identifierType !== "PUBLIC") {
      throw new Error(`Expected SYSTEM or PUBLIC, found "${identifierType}"`);
    }
    i2 += identifierType.length;
    i2 = skipWhitespace(xmlData, i2);
    let publicIdentifier = null;
    let systemIdentifier = null;
    if (identifierType === "PUBLIC") {
      [i2, publicIdentifier] = this.readIdentifierVal(xmlData, i2, "publicIdentifier");
      i2 = skipWhitespace(xmlData, i2);
      if (xmlData[i2] === '"' || xmlData[i2] === "'") {
        [i2, systemIdentifier] = this.readIdentifierVal(xmlData, i2, "systemIdentifier");
      }
    } else if (identifierType === "SYSTEM") {
      [i2, systemIdentifier] = this.readIdentifierVal(xmlData, i2, "systemIdentifier");
      if (!this.suppressValidationErr && !systemIdentifier) {
        throw new Error("Missing mandatory system identifier for SYSTEM notation");
      }
    }
    return { notationName, publicIdentifier, systemIdentifier, index: --i2 };
  }
  readIdentifierVal(xmlData, i2, type) {
    let identifierVal = "";
    const startChar = xmlData[i2];
    if (startChar !== '"' && startChar !== "'") {
      throw new Error(`Expected quoted string, found "${startChar}"`);
    }
    i2++;
    const startIndex = i2;
    while (i2 < xmlData.length && xmlData[i2] !== startChar) {
      i2++;
    }
    identifierVal = xmlData.substring(startIndex, i2);
    if (xmlData[i2] !== startChar) {
      throw new Error(`Unterminated ${type} value`);
    }
    i2++;
    return [i2, identifierVal];
  }
  readElementExp(xmlData, i2) {
    i2 = skipWhitespace(xmlData, i2);
    const startIndex = i2;
    while (i2 < xmlData.length && !/\s/.test(xmlData[i2])) {
      i2++;
    }
    let elementName = xmlData.substring(startIndex, i2);
    if (!this.suppressValidationErr && !isName(elementName)) {
      throw new Error(`Invalid element name: "${elementName}"`);
    }
    i2 = skipWhitespace(xmlData, i2);
    let contentModel = "";
    if (xmlData[i2] === "E" && hasSeq(xmlData, "MPTY", i2)) i2 += 4;
    else if (xmlData[i2] === "A" && hasSeq(xmlData, "NY", i2)) i2 += 2;
    else if (xmlData[i2] === "(") {
      i2++;
      const startIndex2 = i2;
      while (i2 < xmlData.length && xmlData[i2] !== ")") {
        i2++;
      }
      contentModel = xmlData.substring(startIndex2, i2);
      if (xmlData[i2] !== ")") {
        throw new Error("Unterminated content model");
      }
    } else if (!this.suppressValidationErr) {
      throw new Error(`Invalid Element Expression, found "${xmlData[i2]}"`);
    }
    return {
      elementName,
      contentModel: contentModel.trim(),
      index: i2
    };
  }
  readAttlistExp(xmlData, i2) {
    i2 = skipWhitespace(xmlData, i2);
    let startIndex = i2;
    while (i2 < xmlData.length && !/\s/.test(xmlData[i2])) {
      i2++;
    }
    let elementName = xmlData.substring(startIndex, i2);
    validateEntityName(elementName);
    i2 = skipWhitespace(xmlData, i2);
    startIndex = i2;
    while (i2 < xmlData.length && !/\s/.test(xmlData[i2])) {
      i2++;
    }
    let attributeName = xmlData.substring(startIndex, i2);
    if (!validateEntityName(attributeName)) {
      throw new Error(`Invalid attribute name: "${attributeName}"`);
    }
    i2 = skipWhitespace(xmlData, i2);
    let attributeType = "";
    if (xmlData.substring(i2, i2 + 8).toUpperCase() === "NOTATION") {
      attributeType = "NOTATION";
      i2 += 8;
      i2 = skipWhitespace(xmlData, i2);
      if (xmlData[i2] !== "(") {
        throw new Error(`Expected '(', found "${xmlData[i2]}"`);
      }
      i2++;
      let allowedNotations = [];
      while (i2 < xmlData.length && xmlData[i2] !== ")") {
        const startIndex2 = i2;
        while (i2 < xmlData.length && xmlData[i2] !== "|" && xmlData[i2] !== ")") {
          i2++;
        }
        let notation = xmlData.substring(startIndex2, i2);
        notation = notation.trim();
        if (!validateEntityName(notation)) {
          throw new Error(`Invalid notation name: "${notation}"`);
        }
        allowedNotations.push(notation);
        if (xmlData[i2] === "|") {
          i2++;
          i2 = skipWhitespace(xmlData, i2);
        }
      }
      if (xmlData[i2] !== ")") {
        throw new Error("Unterminated list of notations");
      }
      i2++;
      attributeType += " (" + allowedNotations.join("|") + ")";
    } else {
      const startIndex2 = i2;
      while (i2 < xmlData.length && !/\s/.test(xmlData[i2])) {
        i2++;
      }
      attributeType += xmlData.substring(startIndex2, i2);
      const validTypes = ["CDATA", "ID", "IDREF", "IDREFS", "ENTITY", "ENTITIES", "NMTOKEN", "NMTOKENS"];
      if (!this.suppressValidationErr && !validTypes.includes(attributeType.toUpperCase())) {
        throw new Error(`Invalid attribute type: "${attributeType}"`);
      }
    }
    i2 = skipWhitespace(xmlData, i2);
    let defaultValue = "";
    if (xmlData.substring(i2, i2 + 8).toUpperCase() === "#REQUIRED") {
      defaultValue = "#REQUIRED";
      i2 += 8;
    } else if (xmlData.substring(i2, i2 + 7).toUpperCase() === "#IMPLIED") {
      defaultValue = "#IMPLIED";
      i2 += 7;
    } else {
      [i2, defaultValue] = this.readIdentifierVal(xmlData, i2, "ATTLIST");
    }
    return {
      elementName,
      attributeName,
      attributeType,
      defaultValue,
      index: i2
    };
  }
}
const skipWhitespace = (data, index) => {
  while (index < data.length && /\s/.test(data[index])) {
    index++;
  }
  return index;
};
function hasSeq(data, seq, i2) {
  for (let j2 = 0; j2 < seq.length; j2++) {
    if (seq[j2] !== data[i2 + j2 + 1]) return false;
  }
  return true;
}
function validateEntityName(name) {
  if (isName(name))
    return name;
  else
    throw new Error(`Invalid entity name ${name}`);
}
const hexRegex = /^[-+]?0x[a-fA-F0-9]+$/;
const numRegex = /^([\-\+])?(0*)([0-9]*(\.[0-9]*)?)$/;
const consider = {
  hex: true,
  // oct: false,
  leadingZeros: true,
  decimalPoint: ".",
  eNotation: true,
  //skipLike: /regex/,
  infinity: "original"
  // "null", "infinity" (Infinity type), "string" ("Infinity" (the string literal))
};
function toNumber(str, options = {}) {
  options = Object.assign({}, consider, options);
  if (!str || typeof str !== "string") return str;
  let trimmedStr = str.trim();
  if (trimmedStr.length === 0) return str;
  else if (options.skipLike !== void 0 && options.skipLike.test(trimmedStr)) return str;
  else if (trimmedStr === "0") return 0;
  else if (options.hex && hexRegex.test(trimmedStr)) {
    return parse_int(trimmedStr, 16);
  } else if (!isFinite(trimmedStr)) {
    return handleInfinity(str, Number(trimmedStr), options);
  } else if (trimmedStr.includes("e") || trimmedStr.includes("E")) {
    return resolveEnotation(str, trimmedStr, options);
  } else {
    const match = numRegex.exec(trimmedStr);
    if (match) {
      const sign = match[1] || "";
      const leadingZeros = match[2];
      let numTrimmedByZeros = trimZeros(match[3]);
      const decimalAdjacentToLeadingZeros = sign ? (
        // 0., -00., 000.
        str[leadingZeros.length + 1] === "."
      ) : str[leadingZeros.length] === ".";
      if (!options.leadingZeros && (leadingZeros.length > 1 || leadingZeros.length === 1 && !decimalAdjacentToLeadingZeros)) {
        return str;
      } else {
        const num = Number(trimmedStr);
        const parsedStr = String(num);
        if (num === 0) return num;
        if (parsedStr.search(/[eE]/) !== -1) {
          if (options.eNotation) return num;
          else return str;
        } else if (trimmedStr.indexOf(".") !== -1) {
          if (parsedStr === "0") return num;
          else if (parsedStr === numTrimmedByZeros) return num;
          else if (parsedStr === `${sign}${numTrimmedByZeros}`) return num;
          else return str;
        }
        let n2 = leadingZeros ? numTrimmedByZeros : trimmedStr;
        if (leadingZeros) {
          return n2 === parsedStr || sign + n2 === parsedStr ? num : str;
        } else {
          return n2 === parsedStr || n2 === sign + parsedStr ? num : str;
        }
      }
    } else {
      return str;
    }
  }
}
const eNotationRegx = /^([-+])?(0*)(\d*(\.\d*)?[eE][-\+]?\d+)$/;
function resolveEnotation(str, trimmedStr, options) {
  if (!options.eNotation) return str;
  const notation = trimmedStr.match(eNotationRegx);
  if (notation) {
    let sign = notation[1] || "";
    const eChar = notation[3].indexOf("e") === -1 ? "E" : "e";
    const leadingZeros = notation[2];
    const eAdjacentToLeadingZeros = sign ? (
      // 0E.
      str[leadingZeros.length + 1] === eChar
    ) : str[leadingZeros.length] === eChar;
    if (leadingZeros.length > 1 && eAdjacentToLeadingZeros) return str;
    else if (leadingZeros.length === 1 && (notation[3].startsWith(`.${eChar}`) || notation[3][0] === eChar)) {
      return Number(trimmedStr);
    } else if (leadingZeros.length > 0) {
      if (options.leadingZeros && !eAdjacentToLeadingZeros) {
        trimmedStr = (notation[1] || "") + notation[3];
        return Number(trimmedStr);
      } else return str;
    } else {
      return Number(trimmedStr);
    }
  } else {
    return str;
  }
}
function trimZeros(numStr) {
  if (numStr && numStr.indexOf(".") !== -1) {
    numStr = numStr.replace(/0+$/, "");
    if (numStr === ".") numStr = "0";
    else if (numStr[0] === ".") numStr = "0" + numStr;
    else if (numStr[numStr.length - 1] === ".") numStr = numStr.substring(0, numStr.length - 1);
    return numStr;
  }
  return numStr;
}
function parse_int(numStr, base) {
  if (parseInt) return parseInt(numStr, base);
  else if (Number.parseInt) return Number.parseInt(numStr, base);
  else if (window && window.parseInt) return window.parseInt(numStr, base);
  else throw new Error("parseInt, Number.parseInt, window.parseInt are not supported");
}
function handleInfinity(str, num, options) {
  const isPositive = num === Infinity;
  switch (options.infinity.toLowerCase()) {
    case "null":
      return null;
    case "infinity":
      return num;
    // Return Infinity or -Infinity
    case "string":
      return isPositive ? "Infinity" : "-Infinity";
    case "original":
    default:
      return str;
  }
}
function getIgnoreAttributesFn(ignoreAttributes) {
  if (typeof ignoreAttributes === "function") {
    return ignoreAttributes;
  }
  if (Array.isArray(ignoreAttributes)) {
    return (attrName) => {
      for (const pattern of ignoreAttributes) {
        if (typeof pattern === "string" && attrName === pattern) {
          return true;
        }
        if (pattern instanceof RegExp && pattern.test(attrName)) {
          return true;
        }
      }
    };
  }
  return () => false;
}
class Expression {
  /**
   * Create a new Expression
   * @param {string} pattern - Pattern string (e.g., "root.users.user", "..user[id]")
   * @param {Object} options - Configuration options
   * @param {string} options.separator - Path separator (default: '.')
   */
  constructor(pattern, options = {}, data) {
    this.pattern = pattern;
    this.separator = options.separator || ".";
    this.segments = this._parse(pattern);
    this.data = data;
    this._hasDeepWildcard = this.segments.some((seg) => seg.type === "deep-wildcard");
    this._hasAttributeCondition = this.segments.some((seg) => seg.attrName !== void 0);
    this._hasPositionSelector = this.segments.some((seg) => seg.position !== void 0);
  }
  /**
   * Parse pattern string into segments
   * @private
   * @param {string} pattern - Pattern to parse
   * @returns {Array} Array of segment objects
   */
  _parse(pattern) {
    const segments = [];
    let i2 = 0;
    let currentPart = "";
    while (i2 < pattern.length) {
      if (pattern[i2] === this.separator) {
        if (i2 + 1 < pattern.length && pattern[i2 + 1] === this.separator) {
          if (currentPart.trim()) {
            segments.push(this._parseSegment(currentPart.trim()));
            currentPart = "";
          }
          segments.push({ type: "deep-wildcard" });
          i2 += 2;
        } else {
          if (currentPart.trim()) {
            segments.push(this._parseSegment(currentPart.trim()));
          }
          currentPart = "";
          i2++;
        }
      } else {
        currentPart += pattern[i2];
        i2++;
      }
    }
    if (currentPart.trim()) {
      segments.push(this._parseSegment(currentPart.trim()));
    }
    return segments;
  }
  /**
   * Parse a single segment
   * @private
   * @param {string} part - Segment string (e.g., "user", "ns::user", "user[id]", "ns::user:first")
   * @returns {Object} Segment object
   */
  _parseSegment(part) {
    const segment = { type: "tag" };
    let bracketContent = null;
    let withoutBrackets = part;
    const bracketMatch = part.match(/^([^\[]+)(\[[^\]]*\])(.*)$/);
    if (bracketMatch) {
      withoutBrackets = bracketMatch[1] + bracketMatch[3];
      if (bracketMatch[2]) {
        const content = bracketMatch[2].slice(1, -1);
        if (content) {
          bracketContent = content;
        }
      }
    }
    let namespace = void 0;
    let tagAndPosition = withoutBrackets;
    if (withoutBrackets.includes("::")) {
      const nsIndex = withoutBrackets.indexOf("::");
      namespace = withoutBrackets.substring(0, nsIndex).trim();
      tagAndPosition = withoutBrackets.substring(nsIndex + 2).trim();
      if (!namespace) {
        throw new Error(`Invalid namespace in pattern: ${part}`);
      }
    }
    let tag = void 0;
    let positionMatch = null;
    if (tagAndPosition.includes(":")) {
      const colonIndex = tagAndPosition.lastIndexOf(":");
      const tagPart = tagAndPosition.substring(0, colonIndex).trim();
      const posPart = tagAndPosition.substring(colonIndex + 1).trim();
      const isPositionKeyword = ["first", "last", "odd", "even"].includes(posPart) || /^nth\(\d+\)$/.test(posPart);
      if (isPositionKeyword) {
        tag = tagPart;
        positionMatch = posPart;
      } else {
        tag = tagAndPosition;
      }
    } else {
      tag = tagAndPosition;
    }
    if (!tag) {
      throw new Error(`Invalid segment pattern: ${part}`);
    }
    segment.tag = tag;
    if (namespace) {
      segment.namespace = namespace;
    }
    if (bracketContent) {
      if (bracketContent.includes("=")) {
        const eqIndex = bracketContent.indexOf("=");
        segment.attrName = bracketContent.substring(0, eqIndex).trim();
        segment.attrValue = bracketContent.substring(eqIndex + 1).trim();
      } else {
        segment.attrName = bracketContent.trim();
      }
    }
    if (positionMatch) {
      const nthMatch = positionMatch.match(/^nth\((\d+)\)$/);
      if (nthMatch) {
        segment.position = "nth";
        segment.positionValue = parseInt(nthMatch[1], 10);
      } else {
        segment.position = positionMatch;
      }
    }
    return segment;
  }
  /**
   * Get the number of segments
   * @returns {number}
   */
  get length() {
    return this.segments.length;
  }
  /**
   * Check if expression contains deep wildcard
   * @returns {boolean}
   */
  hasDeepWildcard() {
    return this._hasDeepWildcard;
  }
  /**
   * Check if expression has attribute conditions
   * @returns {boolean}
   */
  hasAttributeCondition() {
    return this._hasAttributeCondition;
  }
  /**
   * Check if expression has position selectors
   * @returns {boolean}
   */
  hasPositionSelector() {
    return this._hasPositionSelector;
  }
  /**
   * Get string representation
   * @returns {string}
   */
  toString() {
    return this.pattern;
  }
}
class MatcherView {
  /**
   * @param {Matcher} matcher - The parent Matcher instance to read from.
   */
  constructor(matcher) {
    this._matcher = matcher;
  }
  /**
   * Get the path separator used by the parent matcher.
   * @returns {string}
   */
  get separator() {
    return this._matcher.separator;
  }
  /**
   * Get current tag name.
   * @returns {string|undefined}
   */
  getCurrentTag() {
    const path = this._matcher.path;
    return path.length > 0 ? path[path.length - 1].tag : void 0;
  }
  /**
   * Get current namespace.
   * @returns {string|undefined}
   */
  getCurrentNamespace() {
    const path = this._matcher.path;
    return path.length > 0 ? path[path.length - 1].namespace : void 0;
  }
  /**
   * Get current node's attribute value.
   * @param {string} attrName
   * @returns {*}
   */
  getAttrValue(attrName) {
    const path = this._matcher.path;
    if (path.length === 0) return void 0;
    return path[path.length - 1].values?.[attrName];
  }
  /**
   * Check if current node has an attribute.
   * @param {string} attrName
   * @returns {boolean}
   */
  hasAttr(attrName) {
    const path = this._matcher.path;
    if (path.length === 0) return false;
    const current = path[path.length - 1];
    return current.values !== void 0 && attrName in current.values;
  }
  /**
   * Get current node's sibling position (child index in parent).
   * @returns {number}
   */
  getPosition() {
    const path = this._matcher.path;
    if (path.length === 0) return -1;
    return path[path.length - 1].position ?? 0;
  }
  /**
   * Get current node's repeat counter (occurrence count of this tag name).
   * @returns {number}
   */
  getCounter() {
    const path = this._matcher.path;
    if (path.length === 0) return -1;
    return path[path.length - 1].counter ?? 0;
  }
  /**
   * Get current node's sibling index (alias for getPosition).
   * @returns {number}
   * @deprecated Use getPosition() or getCounter() instead
   */
  getIndex() {
    return this.getPosition();
  }
  /**
   * Get current path depth.
   * @returns {number}
   */
  getDepth() {
    return this._matcher.path.length;
  }
  /**
   * Get path as string.
   * @param {string} [separator] - Optional separator (uses default if not provided)
   * @param {boolean} [includeNamespace=true]
   * @returns {string}
   */
  toString(separator, includeNamespace = true) {
    return this._matcher.toString(separator, includeNamespace);
  }
  /**
   * Get path as array of tag names.
   * @returns {string[]}
   */
  toArray() {
    return this._matcher.path.map((n2) => n2.tag);
  }
  /**
   * Match current path against an Expression.
   * @param {Expression} expression
   * @returns {boolean}
   */
  matches(expression) {
    return this._matcher.matches(expression);
  }
  /**
   * Match any expression in the given set against the current path.
   * @param {ExpressionSet} exprSet
   * @returns {boolean}
   */
  matchesAny(exprSet) {
    return exprSet.matchesAny(this._matcher);
  }
}
class Matcher {
  /**
   * Create a new Matcher.
   * @param {Object} [options={}]
   * @param {string} [options.separator='.'] - Default path separator
   */
  constructor(options = {}) {
    this.separator = options.separator || ".";
    this.path = [];
    this.siblingStacks = [];
    this._pathStringCache = null;
    this._view = new MatcherView(this);
  }
  /**
   * Push a new tag onto the path.
   * @param {string} tagName
   * @param {Object|null} [attrValues=null]
   * @param {string|null} [namespace=null]
   */
  push(tagName, attrValues = null, namespace = null) {
    this._pathStringCache = null;
    if (this.path.length > 0) {
      this.path[this.path.length - 1].values = void 0;
    }
    const currentLevel = this.path.length;
    if (!this.siblingStacks[currentLevel]) {
      this.siblingStacks[currentLevel] = /* @__PURE__ */ new Map();
    }
    const siblings = this.siblingStacks[currentLevel];
    const siblingKey = namespace ? `${namespace}:${tagName}` : tagName;
    const counter = siblings.get(siblingKey) || 0;
    let position = 0;
    for (const count of siblings.values()) {
      position += count;
    }
    siblings.set(siblingKey, counter + 1);
    const node = {
      tag: tagName,
      position,
      counter
    };
    if (namespace !== null && namespace !== void 0) {
      node.namespace = namespace;
    }
    if (attrValues !== null && attrValues !== void 0) {
      node.values = attrValues;
    }
    this.path.push(node);
  }
  /**
   * Pop the last tag from the path.
   * @returns {Object|undefined} The popped node
   */
  pop() {
    if (this.path.length === 0) return void 0;
    this._pathStringCache = null;
    const node = this.path.pop();
    if (this.siblingStacks.length > this.path.length + 1) {
      this.siblingStacks.length = this.path.length + 1;
    }
    return node;
  }
  /**
   * Update current node's attribute values.
   * Useful when attributes are parsed after push.
   * @param {Object} attrValues
   */
  updateCurrent(attrValues) {
    if (this.path.length > 0) {
      const current = this.path[this.path.length - 1];
      if (attrValues !== null && attrValues !== void 0) {
        current.values = attrValues;
      }
    }
  }
  /**
   * Get current tag name.
   * @returns {string|undefined}
   */
  getCurrentTag() {
    return this.path.length > 0 ? this.path[this.path.length - 1].tag : void 0;
  }
  /**
   * Get current namespace.
   * @returns {string|undefined}
   */
  getCurrentNamespace() {
    return this.path.length > 0 ? this.path[this.path.length - 1].namespace : void 0;
  }
  /**
   * Get current node's attribute value.
   * @param {string} attrName
   * @returns {*}
   */
  getAttrValue(attrName) {
    if (this.path.length === 0) return void 0;
    return this.path[this.path.length - 1].values?.[attrName];
  }
  /**
   * Check if current node has an attribute.
   * @param {string} attrName
   * @returns {boolean}
   */
  hasAttr(attrName) {
    if (this.path.length === 0) return false;
    const current = this.path[this.path.length - 1];
    return current.values !== void 0 && attrName in current.values;
  }
  /**
   * Get current node's sibling position (child index in parent).
   * @returns {number}
   */
  getPosition() {
    if (this.path.length === 0) return -1;
    return this.path[this.path.length - 1].position ?? 0;
  }
  /**
   * Get current node's repeat counter (occurrence count of this tag name).
   * @returns {number}
   */
  getCounter() {
    if (this.path.length === 0) return -1;
    return this.path[this.path.length - 1].counter ?? 0;
  }
  /**
   * Get current node's sibling index (alias for getPosition).
   * @returns {number}
   * @deprecated Use getPosition() or getCounter() instead
   */
  getIndex() {
    return this.getPosition();
  }
  /**
   * Get current path depth.
   * @returns {number}
   */
  getDepth() {
    return this.path.length;
  }
  /**
   * Get path as string.
   * @param {string} [separator] - Optional separator (uses default if not provided)
   * @param {boolean} [includeNamespace=true]
   * @returns {string}
   */
  toString(separator, includeNamespace = true) {
    const sep2 = separator || this.separator;
    const isDefault = sep2 === this.separator && includeNamespace === true;
    if (isDefault) {
      if (this._pathStringCache !== null) {
        return this._pathStringCache;
      }
      const result = this.path.map(
        (n2) => n2.namespace ? `${n2.namespace}:${n2.tag}` : n2.tag
      ).join(sep2);
      this._pathStringCache = result;
      return result;
    }
    return this.path.map(
      (n2) => includeNamespace && n2.namespace ? `${n2.namespace}:${n2.tag}` : n2.tag
    ).join(sep2);
  }
  /**
   * Get path as array of tag names.
   * @returns {string[]}
   */
  toArray() {
    return this.path.map((n2) => n2.tag);
  }
  /**
   * Reset the path to empty.
   */
  reset() {
    this._pathStringCache = null;
    this.path = [];
    this.siblingStacks = [];
  }
  /**
   * Match current path against an Expression.
   * @param {Expression} expression
   * @returns {boolean}
   */
  matches(expression) {
    const segments = expression.segments;
    if (segments.length === 0) {
      return false;
    }
    if (expression.hasDeepWildcard()) {
      return this._matchWithDeepWildcard(segments);
    }
    return this._matchSimple(segments);
  }
  /**
   * @private
   */
  _matchSimple(segments) {
    if (this.path.length !== segments.length) {
      return false;
    }
    for (let i2 = 0; i2 < segments.length; i2++) {
      if (!this._matchSegment(segments[i2], this.path[i2], i2 === this.path.length - 1)) {
        return false;
      }
    }
    return true;
  }
  /**
   * @private
   */
  _matchWithDeepWildcard(segments) {
    let pathIdx = this.path.length - 1;
    let segIdx = segments.length - 1;
    while (segIdx >= 0 && pathIdx >= 0) {
      const segment = segments[segIdx];
      if (segment.type === "deep-wildcard") {
        segIdx--;
        if (segIdx < 0) {
          return true;
        }
        const nextSeg = segments[segIdx];
        let found = false;
        for (let i2 = pathIdx; i2 >= 0; i2--) {
          if (this._matchSegment(nextSeg, this.path[i2], i2 === this.path.length - 1)) {
            pathIdx = i2 - 1;
            segIdx--;
            found = true;
            break;
          }
        }
        if (!found) {
          return false;
        }
      } else {
        if (!this._matchSegment(segment, this.path[pathIdx], pathIdx === this.path.length - 1)) {
          return false;
        }
        pathIdx--;
        segIdx--;
      }
    }
    return segIdx < 0;
  }
  /**
   * @private
   */
  _matchSegment(segment, node, isCurrentNode) {
    if (segment.tag !== "*" && segment.tag !== node.tag) {
      return false;
    }
    if (segment.namespace !== void 0) {
      if (segment.namespace !== "*" && segment.namespace !== node.namespace) {
        return false;
      }
    }
    if (segment.attrName !== void 0) {
      if (!isCurrentNode) {
        return false;
      }
      if (!node.values || !(segment.attrName in node.values)) {
        return false;
      }
      if (segment.attrValue !== void 0) {
        if (String(node.values[segment.attrName]) !== String(segment.attrValue)) {
          return false;
        }
      }
    }
    if (segment.position !== void 0) {
      if (!isCurrentNode) {
        return false;
      }
      const counter = node.counter ?? 0;
      if (segment.position === "first" && counter !== 0) {
        return false;
      } else if (segment.position === "odd" && counter % 2 !== 1) {
        return false;
      } else if (segment.position === "even" && counter % 2 !== 0) {
        return false;
      } else if (segment.position === "nth" && counter !== segment.positionValue) {
        return false;
      }
    }
    return true;
  }
  /**
   * Match any expression in the given set against the current path.
   * @param {ExpressionSet} exprSet
   * @returns {boolean}
   */
  matchesAny(exprSet) {
    return exprSet.matchesAny(this);
  }
  /**
   * Create a snapshot of current state.
   * @returns {Object}
   */
  snapshot() {
    return {
      path: this.path.map((node) => ({ ...node })),
      siblingStacks: this.siblingStacks.map((map) => new Map(map))
    };
  }
  /**
   * Restore state from snapshot.
   * @param {Object} snapshot
   */
  restore(snapshot) {
    this._pathStringCache = null;
    this.path = snapshot.path.map((node) => ({ ...node }));
    this.siblingStacks = snapshot.siblingStacks.map((map) => new Map(map));
  }
  /**
   * Return the read-only {@link MatcherView} for this matcher.
   *
   * The same instance is returned on every call — no allocation occurs.
   * It always reflects the current parser state and is safe to pass to
   * user callbacks without risk of accidental mutation.
   *
   * @returns {MatcherView}
   *
   * @example
   * const view = matcher.readOnly();
   * // pass view to callbacks — it stays in sync automatically
   * view.matches(expr);       // ✓
   * view.getCurrentTag();     // ✓
   * // view.push(...)         // ✗ method does not exist — caught by TypeScript
   */
  readOnly() {
    return this._view;
  }
}
function extractRawAttributes(prefixedAttrs, options) {
  if (!prefixedAttrs) return {};
  const attrs = options.attributesGroupName ? prefixedAttrs[options.attributesGroupName] : prefixedAttrs;
  if (!attrs) return {};
  const rawAttrs = {};
  for (const key in attrs) {
    if (key.startsWith(options.attributeNamePrefix)) {
      const rawName = key.substring(options.attributeNamePrefix.length);
      rawAttrs[rawName] = attrs[key];
    } else {
      rawAttrs[key] = attrs[key];
    }
  }
  return rawAttrs;
}
function extractNamespace(rawTagName) {
  if (!rawTagName || typeof rawTagName !== "string") return void 0;
  const colonIndex = rawTagName.indexOf(":");
  if (colonIndex !== -1 && colonIndex > 0) {
    const ns = rawTagName.substring(0, colonIndex);
    if (ns !== "xmlns") {
      return ns;
    }
  }
  return void 0;
}
class OrderedObjParser {
  constructor(options) {
    this.options = options;
    this.currentNode = null;
    this.tagsNodeStack = [];
    this.docTypeEntities = {};
    this.lastEntities = {
      "apos": { regex: /&(apos|#39|#x27);/g, val: "'" },
      "gt": { regex: /&(gt|#62|#x3E);/g, val: ">" },
      "lt": { regex: /&(lt|#60|#x3C);/g, val: "<" },
      "quot": { regex: /&(quot|#34|#x22);/g, val: '"' }
    };
    this.ampEntity = { regex: /&(amp|#38|#x26);/g, val: "&" };
    this.htmlEntities = {
      "space": { regex: /&(nbsp|#160);/g, val: " " },
      // "lt" : { regex: /&(lt|#60);/g, val: "<" },
      // "gt" : { regex: /&(gt|#62);/g, val: ">" },
      // "amp" : { regex: /&(amp|#38);/g, val: "&" },
      // "quot" : { regex: /&(quot|#34);/g, val: "\"" },
      // "apos" : { regex: /&(apos|#39);/g, val: "'" },
      "cent": { regex: /&(cent|#162);/g, val: "¢" },
      "pound": { regex: /&(pound|#163);/g, val: "£" },
      "yen": { regex: /&(yen|#165);/g, val: "¥" },
      "euro": { regex: /&(euro|#8364);/g, val: "€" },
      "copyright": { regex: /&(copy|#169);/g, val: "©" },
      "reg": { regex: /&(reg|#174);/g, val: "®" },
      "inr": { regex: /&(inr|#8377);/g, val: "₹" },
      "num_dec": { regex: /&#([0-9]{1,7});/g, val: (_, str) => fromCodePoint(str, 10, "&#") },
      "num_hex": { regex: /&#x([0-9a-fA-F]{1,6});/g, val: (_, str) => fromCodePoint(str, 16, "&#x") }
    };
    this.addExternalEntities = addExternalEntities;
    this.parseXml = parseXml;
    this.parseTextData = parseTextData;
    this.resolveNameSpace = resolveNameSpace;
    this.buildAttributesMap = buildAttributesMap;
    this.isItStopNode = isItStopNode;
    this.replaceEntitiesValue = replaceEntitiesValue;
    this.readStopNodeData = readStopNodeData;
    this.saveTextToParentTag = saveTextToParentTag;
    this.addChild = addChild;
    this.ignoreAttributesFn = getIgnoreAttributesFn(this.options.ignoreAttributes);
    this.entityExpansionCount = 0;
    this.currentExpandedLength = 0;
    this.matcher = new Matcher();
    this.readonlyMatcher = this.matcher.readOnly();
    this.isCurrentNodeStopNode = false;
    if (this.options.stopNodes && this.options.stopNodes.length > 0) {
      this.stopNodeExpressions = [];
      for (let i2 = 0; i2 < this.options.stopNodes.length; i2++) {
        const stopNodeExp = this.options.stopNodes[i2];
        if (typeof stopNodeExp === "string") {
          this.stopNodeExpressions.push(new Expression(stopNodeExp));
        } else if (stopNodeExp instanceof Expression) {
          this.stopNodeExpressions.push(stopNodeExp);
        }
      }
    }
  }
}
function addExternalEntities(externalEntities) {
  const entKeys = Object.keys(externalEntities);
  for (let i2 = 0; i2 < entKeys.length; i2++) {
    const ent = entKeys[i2];
    const escaped = ent.replace(/[.\-+*:]/g, "\\.");
    this.lastEntities[ent] = {
      regex: new RegExp("&" + escaped + ";", "g"),
      val: externalEntities[ent]
    };
  }
}
function parseTextData(val, tagName, jPath, dontTrim, hasAttributes, isLeafNode, escapeEntities) {
  if (val !== void 0) {
    if (this.options.trimValues && !dontTrim) {
      val = val.trim();
    }
    if (val.length > 0) {
      if (!escapeEntities) val = this.replaceEntitiesValue(val, tagName, jPath);
      const jPathOrMatcher = this.options.jPath ? jPath.toString() : jPath;
      const newval = this.options.tagValueProcessor(tagName, val, jPathOrMatcher, hasAttributes, isLeafNode);
      if (newval === null || newval === void 0) {
        return val;
      } else if (typeof newval !== typeof val || newval !== val) {
        return newval;
      } else if (this.options.trimValues) {
        return parseValue(val, this.options.parseTagValue, this.options.numberParseOptions);
      } else {
        const trimmedVal = val.trim();
        if (trimmedVal === val) {
          return parseValue(val, this.options.parseTagValue, this.options.numberParseOptions);
        } else {
          return val;
        }
      }
    }
  }
}
function resolveNameSpace(tagname) {
  if (this.options.removeNSPrefix) {
    const tags = tagname.split(":");
    const prefix = tagname.charAt(0) === "/" ? "/" : "";
    if (tags[0] === "xmlns") {
      return "";
    }
    if (tags.length === 2) {
      tagname = prefix + tags[1];
    }
  }
  return tagname;
}
const attrsRegx = new RegExp(`([^\\s=]+)\\s*(=\\s*(['"])([\\s\\S]*?)\\3)?`, "gm");
function buildAttributesMap(attrStr, jPath, tagName) {
  if (this.options.ignoreAttributes !== true && typeof attrStr === "string") {
    const matches = getAllMatches(attrStr, attrsRegx);
    const len = matches.length;
    const attrs = {};
    const rawAttrsForMatcher = {};
    for (let i2 = 0; i2 < len; i2++) {
      const attrName = this.resolveNameSpace(matches[i2][1]);
      const oldVal = matches[i2][4];
      if (attrName.length && oldVal !== void 0) {
        let parsedVal = oldVal;
        if (this.options.trimValues) {
          parsedVal = parsedVal.trim();
        }
        parsedVal = this.replaceEntitiesValue(parsedVal, tagName, this.readonlyMatcher);
        rawAttrsForMatcher[attrName] = parsedVal;
      }
    }
    if (Object.keys(rawAttrsForMatcher).length > 0 && typeof jPath === "object" && jPath.updateCurrent) {
      jPath.updateCurrent(rawAttrsForMatcher);
    }
    for (let i2 = 0; i2 < len; i2++) {
      const attrName = this.resolveNameSpace(matches[i2][1]);
      const jPathStr = this.options.jPath ? jPath.toString() : this.readonlyMatcher;
      if (this.ignoreAttributesFn(attrName, jPathStr)) {
        continue;
      }
      let oldVal = matches[i2][4];
      let aName = this.options.attributeNamePrefix + attrName;
      if (attrName.length) {
        if (this.options.transformAttributeName) {
          aName = this.options.transformAttributeName(aName);
        }
        aName = sanitizeName(aName, this.options);
        if (oldVal !== void 0) {
          if (this.options.trimValues) {
            oldVal = oldVal.trim();
          }
          oldVal = this.replaceEntitiesValue(oldVal, tagName, this.readonlyMatcher);
          const jPathOrMatcher = this.options.jPath ? jPath.toString() : this.readonlyMatcher;
          const newVal = this.options.attributeValueProcessor(attrName, oldVal, jPathOrMatcher);
          if (newVal === null || newVal === void 0) {
            attrs[aName] = oldVal;
          } else if (typeof newVal !== typeof oldVal || newVal !== oldVal) {
            attrs[aName] = newVal;
          } else {
            attrs[aName] = parseValue(
              oldVal,
              this.options.parseAttributeValue,
              this.options.numberParseOptions
            );
          }
        } else if (this.options.allowBooleanAttributes) {
          attrs[aName] = true;
        }
      }
    }
    if (!Object.keys(attrs).length) {
      return;
    }
    if (this.options.attributesGroupName) {
      const attrCollection = {};
      attrCollection[this.options.attributesGroupName] = attrs;
      return attrCollection;
    }
    return attrs;
  }
}
const parseXml = function(xmlData) {
  xmlData = xmlData.replace(/\r\n?/g, "\n");
  const xmlObj = new XmlNode2("!xml");
  let currentNode = xmlObj;
  let textData = "";
  this.matcher.reset();
  this.entityExpansionCount = 0;
  this.currentExpandedLength = 0;
  const docTypeReader = new DocTypeReader(this.options.processEntities);
  for (let i2 = 0; i2 < xmlData.length; i2++) {
    const ch2 = xmlData[i2];
    if (ch2 === "<") {
      if (xmlData[i2 + 1] === "/") {
        const closeIndex = findClosingIndex(xmlData, ">", i2, "Closing Tag is not closed.");
        let tagName = xmlData.substring(i2 + 2, closeIndex).trim();
        if (this.options.removeNSPrefix) {
          const colonIndex = tagName.indexOf(":");
          if (colonIndex !== -1) {
            tagName = tagName.substr(colonIndex + 1);
          }
        }
        tagName = transformTagName(this.options.transformTagName, tagName, "", this.options).tagName;
        if (currentNode) {
          textData = this.saveTextToParentTag(textData, currentNode, this.readonlyMatcher);
        }
        const lastTagName = this.matcher.getCurrentTag();
        if (tagName && this.options.unpairedTags.indexOf(tagName) !== -1) {
          throw new Error(`Unpaired tag can not be used as closing tag: </${tagName}>`);
        }
        if (lastTagName && this.options.unpairedTags.indexOf(lastTagName) !== -1) {
          this.matcher.pop();
          this.tagsNodeStack.pop();
        }
        this.matcher.pop();
        this.isCurrentNodeStopNode = false;
        currentNode = this.tagsNodeStack.pop();
        textData = "";
        i2 = closeIndex;
      } else if (xmlData[i2 + 1] === "?") {
        let tagData = readTagExp(xmlData, i2, false, "?>");
        if (!tagData) throw new Error("Pi Tag is not closed.");
        textData = this.saveTextToParentTag(textData, currentNode, this.readonlyMatcher);
        if (this.options.ignoreDeclaration && tagData.tagName === "?xml" || this.options.ignorePiTags) ;
        else {
          const childNode = new XmlNode2(tagData.tagName);
          childNode.add(this.options.textNodeName, "");
          if (tagData.tagName !== tagData.tagExp && tagData.attrExpPresent) {
            childNode[":@"] = this.buildAttributesMap(tagData.tagExp, this.matcher, tagData.tagName);
          }
          this.addChild(currentNode, childNode, this.readonlyMatcher, i2);
        }
        i2 = tagData.closeIndex + 1;
      } else if (xmlData.substr(i2 + 1, 3) === "!--") {
        const endIndex = findClosingIndex(xmlData, "-->", i2 + 4, "Comment is not closed.");
        if (this.options.commentPropName) {
          const comment = xmlData.substring(i2 + 4, endIndex - 2);
          textData = this.saveTextToParentTag(textData, currentNode, this.readonlyMatcher);
          currentNode.add(this.options.commentPropName, [{ [this.options.textNodeName]: comment }]);
        }
        i2 = endIndex;
      } else if (xmlData.substr(i2 + 1, 2) === "!D") {
        const result = docTypeReader.readDocType(xmlData, i2);
        this.docTypeEntities = result.entities;
        i2 = result.i;
      } else if (xmlData.substr(i2 + 1, 2) === "![") {
        const closeIndex = findClosingIndex(xmlData, "]]>", i2, "CDATA is not closed.") - 2;
        const tagExp = xmlData.substring(i2 + 9, closeIndex);
        textData = this.saveTextToParentTag(textData, currentNode, this.readonlyMatcher);
        let val = this.parseTextData(tagExp, currentNode.tagname, this.readonlyMatcher, true, false, true, true);
        if (val == void 0) val = "";
        if (this.options.cdataPropName) {
          currentNode.add(this.options.cdataPropName, [{ [this.options.textNodeName]: tagExp }]);
        } else {
          currentNode.add(this.options.textNodeName, val);
        }
        i2 = closeIndex + 2;
      } else {
        let result = readTagExp(xmlData, i2, this.options.removeNSPrefix);
        if (!result) {
          const context = xmlData.substring(Math.max(0, i2 - 50), Math.min(xmlData.length, i2 + 50));
          throw new Error(`readTagExp returned undefined at position ${i2}. Context: "${context}"`);
        }
        let tagName = result.tagName;
        const rawTagName = result.rawTagName;
        let tagExp = result.tagExp;
        let attrExpPresent = result.attrExpPresent;
        let closeIndex = result.closeIndex;
        ({ tagName, tagExp } = transformTagName(this.options.transformTagName, tagName, tagExp, this.options));
        if (this.options.strictReservedNames && (tagName === this.options.commentPropName || tagName === this.options.cdataPropName || tagName === this.options.textNodeName || tagName === this.options.attributesGroupName)) {
          throw new Error(`Invalid tag name: ${tagName}`);
        }
        if (currentNode && textData) {
          if (currentNode.tagname !== "!xml") {
            textData = this.saveTextToParentTag(textData, currentNode, this.readonlyMatcher, false);
          }
        }
        const lastTag = currentNode;
        if (lastTag && this.options.unpairedTags.indexOf(lastTag.tagname) !== -1) {
          currentNode = this.tagsNodeStack.pop();
          this.matcher.pop();
        }
        let isSelfClosing = false;
        if (tagExp.length > 0 && tagExp.lastIndexOf("/") === tagExp.length - 1) {
          isSelfClosing = true;
          if (tagName[tagName.length - 1] === "/") {
            tagName = tagName.substr(0, tagName.length - 1);
            tagExp = tagName;
          } else {
            tagExp = tagExp.substr(0, tagExp.length - 1);
          }
          attrExpPresent = tagName !== tagExp;
        }
        let prefixedAttrs = null;
        let namespace = void 0;
        namespace = extractNamespace(rawTagName);
        if (tagName !== xmlObj.tagname) {
          this.matcher.push(tagName, {}, namespace);
        }
        if (tagName !== tagExp && attrExpPresent) {
          prefixedAttrs = this.buildAttributesMap(tagExp, this.matcher, tagName);
          if (prefixedAttrs) {
            extractRawAttributes(prefixedAttrs, this.options);
          }
        }
        if (tagName !== xmlObj.tagname) {
          this.isCurrentNodeStopNode = this.isItStopNode(this.stopNodeExpressions, this.matcher);
        }
        const startIndex = i2;
        if (this.isCurrentNodeStopNode) {
          let tagContent = "";
          if (isSelfClosing) {
            i2 = result.closeIndex;
          } else if (this.options.unpairedTags.indexOf(tagName) !== -1) {
            i2 = result.closeIndex;
          } else {
            const result2 = this.readStopNodeData(xmlData, rawTagName, closeIndex + 1);
            if (!result2) throw new Error(`Unexpected end of ${rawTagName}`);
            i2 = result2.i;
            tagContent = result2.tagContent;
          }
          const childNode = new XmlNode2(tagName);
          if (prefixedAttrs) {
            childNode[":@"] = prefixedAttrs;
          }
          childNode.add(this.options.textNodeName, tagContent);
          this.matcher.pop();
          this.isCurrentNodeStopNode = false;
          this.addChild(currentNode, childNode, this.readonlyMatcher, startIndex);
        } else {
          if (isSelfClosing) {
            ({ tagName, tagExp } = transformTagName(this.options.transformTagName, tagName, tagExp, this.options));
            const childNode = new XmlNode2(tagName);
            if (prefixedAttrs) {
              childNode[":@"] = prefixedAttrs;
            }
            this.addChild(currentNode, childNode, this.readonlyMatcher, startIndex);
            this.matcher.pop();
            this.isCurrentNodeStopNode = false;
          } else if (this.options.unpairedTags.indexOf(tagName) !== -1) {
            const childNode = new XmlNode2(tagName);
            if (prefixedAttrs) {
              childNode[":@"] = prefixedAttrs;
            }
            this.addChild(currentNode, childNode, this.readonlyMatcher, startIndex);
            this.matcher.pop();
            this.isCurrentNodeStopNode = false;
            i2 = result.closeIndex;
            continue;
          } else {
            const childNode = new XmlNode2(tagName);
            if (this.tagsNodeStack.length > this.options.maxNestedTags) {
              throw new Error("Maximum nested tags exceeded");
            }
            this.tagsNodeStack.push(currentNode);
            if (prefixedAttrs) {
              childNode[":@"] = prefixedAttrs;
            }
            this.addChild(currentNode, childNode, this.readonlyMatcher, startIndex);
            currentNode = childNode;
          }
          textData = "";
          i2 = closeIndex;
        }
      }
    } else {
      textData += xmlData[i2];
    }
  }
  return xmlObj.child;
};
function addChild(currentNode, childNode, matcher, startIndex) {
  if (!this.options.captureMetaData) startIndex = void 0;
  const jPathOrMatcher = this.options.jPath ? matcher.toString() : matcher;
  const result = this.options.updateTag(childNode.tagname, jPathOrMatcher, childNode[":@"]);
  if (result === false) ;
  else if (typeof result === "string") {
    childNode.tagname = result;
    currentNode.addChild(childNode, startIndex);
  } else {
    currentNode.addChild(childNode, startIndex);
  }
}
function replaceEntitiesValue(val, tagName, jPath) {
  const entityConfig = this.options.processEntities;
  if (!entityConfig || !entityConfig.enabled) {
    return val;
  }
  if (entityConfig.allowedTags) {
    const jPathOrMatcher = this.options.jPath ? jPath.toString() : jPath;
    const allowed = Array.isArray(entityConfig.allowedTags) ? entityConfig.allowedTags.includes(tagName) : entityConfig.allowedTags(tagName, jPathOrMatcher);
    if (!allowed) {
      return val;
    }
  }
  if (entityConfig.tagFilter) {
    const jPathOrMatcher = this.options.jPath ? jPath.toString() : jPath;
    if (!entityConfig.tagFilter(tagName, jPathOrMatcher)) {
      return val;
    }
  }
  for (const entityName of Object.keys(this.docTypeEntities)) {
    const entity = this.docTypeEntities[entityName];
    const matches = val.match(entity.regx);
    if (matches) {
      this.entityExpansionCount += matches.length;
      if (entityConfig.maxTotalExpansions && this.entityExpansionCount > entityConfig.maxTotalExpansions) {
        throw new Error(
          `Entity expansion limit exceeded: ${this.entityExpansionCount} > ${entityConfig.maxTotalExpansions}`
        );
      }
      const lengthBefore = val.length;
      val = val.replace(entity.regx, entity.val);
      if (entityConfig.maxExpandedLength) {
        this.currentExpandedLength += val.length - lengthBefore;
        if (this.currentExpandedLength > entityConfig.maxExpandedLength) {
          throw new Error(
            `Total expanded content size exceeded: ${this.currentExpandedLength} > ${entityConfig.maxExpandedLength}`
          );
        }
      }
    }
  }
  for (const entityName of Object.keys(this.lastEntities)) {
    const entity = this.lastEntities[entityName];
    const matches = val.match(entity.regex);
    if (matches) {
      this.entityExpansionCount += matches.length;
      if (entityConfig.maxTotalExpansions && this.entityExpansionCount > entityConfig.maxTotalExpansions) {
        throw new Error(
          `Entity expansion limit exceeded: ${this.entityExpansionCount} > ${entityConfig.maxTotalExpansions}`
        );
      }
    }
    val = val.replace(entity.regex, entity.val);
  }
  if (val.indexOf("&") === -1) return val;
  if (this.options.htmlEntities) {
    for (const entityName of Object.keys(this.htmlEntities)) {
      const entity = this.htmlEntities[entityName];
      const matches = val.match(entity.regex);
      if (matches) {
        this.entityExpansionCount += matches.length;
        if (entityConfig.maxTotalExpansions && this.entityExpansionCount > entityConfig.maxTotalExpansions) {
          throw new Error(
            `Entity expansion limit exceeded: ${this.entityExpansionCount} > ${entityConfig.maxTotalExpansions}`
          );
        }
      }
      val = val.replace(entity.regex, entity.val);
    }
  }
  val = val.replace(this.ampEntity.regex, this.ampEntity.val);
  return val;
}
function saveTextToParentTag(textData, parentNode, matcher, isLeafNode) {
  if (textData) {
    if (isLeafNode === void 0) isLeafNode = parentNode.child.length === 0;
    textData = this.parseTextData(
      textData,
      parentNode.tagname,
      matcher,
      false,
      parentNode[":@"] ? Object.keys(parentNode[":@"]).length !== 0 : false,
      isLeafNode
    );
    if (textData !== void 0 && textData !== "")
      parentNode.add(this.options.textNodeName, textData);
    textData = "";
  }
  return textData;
}
function isItStopNode(stopNodeExpressions, matcher) {
  if (!stopNodeExpressions || stopNodeExpressions.length === 0) return false;
  for (let i2 = 0; i2 < stopNodeExpressions.length; i2++) {
    if (matcher.matches(stopNodeExpressions[i2])) {
      return true;
    }
  }
  return false;
}
function tagExpWithClosingIndex(xmlData, i2, closingChar = ">") {
  let attrBoundary;
  let tagExp = "";
  for (let index = i2; index < xmlData.length; index++) {
    let ch2 = xmlData[index];
    if (attrBoundary) {
      if (ch2 === attrBoundary) attrBoundary = "";
    } else if (ch2 === '"' || ch2 === "'") {
      attrBoundary = ch2;
    } else if (ch2 === closingChar[0]) {
      if (closingChar[1]) {
        if (xmlData[index + 1] === closingChar[1]) {
          return {
            data: tagExp,
            index
          };
        }
      } else {
        return {
          data: tagExp,
          index
        };
      }
    } else if (ch2 === "	") {
      ch2 = " ";
    }
    tagExp += ch2;
  }
}
function findClosingIndex(xmlData, str, i2, errMsg) {
  const closingIndex = xmlData.indexOf(str, i2);
  if (closingIndex === -1) {
    throw new Error(errMsg);
  } else {
    return closingIndex + str.length - 1;
  }
}
function readTagExp(xmlData, i2, removeNSPrefix, closingChar = ">") {
  const result = tagExpWithClosingIndex(xmlData, i2 + 1, closingChar);
  if (!result) return;
  let tagExp = result.data;
  const closeIndex = result.index;
  const separatorIndex = tagExp.search(/\s/);
  let tagName = tagExp;
  let attrExpPresent = true;
  if (separatorIndex !== -1) {
    tagName = tagExp.substring(0, separatorIndex);
    tagExp = tagExp.substring(separatorIndex + 1).trimStart();
  }
  const rawTagName = tagName;
  if (removeNSPrefix) {
    const colonIndex = tagName.indexOf(":");
    if (colonIndex !== -1) {
      tagName = tagName.substr(colonIndex + 1);
      attrExpPresent = tagName !== result.data.substr(colonIndex + 1);
    }
  }
  return {
    tagName,
    tagExp,
    closeIndex,
    attrExpPresent,
    rawTagName
  };
}
function readStopNodeData(xmlData, tagName, i2) {
  const startIndex = i2;
  let openTagCount = 1;
  for (; i2 < xmlData.length; i2++) {
    if (xmlData[i2] === "<") {
      if (xmlData[i2 + 1] === "/") {
        const closeIndex = findClosingIndex(xmlData, ">", i2, `${tagName} is not closed`);
        let closeTagName = xmlData.substring(i2 + 2, closeIndex).trim();
        if (closeTagName === tagName) {
          openTagCount--;
          if (openTagCount === 0) {
            return {
              tagContent: xmlData.substring(startIndex, i2),
              i: closeIndex
            };
          }
        }
        i2 = closeIndex;
      } else if (xmlData[i2 + 1] === "?") {
        const closeIndex = findClosingIndex(xmlData, "?>", i2 + 1, "StopNode is not closed.");
        i2 = closeIndex;
      } else if (xmlData.substr(i2 + 1, 3) === "!--") {
        const closeIndex = findClosingIndex(xmlData, "-->", i2 + 3, "StopNode is not closed.");
        i2 = closeIndex;
      } else if (xmlData.substr(i2 + 1, 2) === "![") {
        const closeIndex = findClosingIndex(xmlData, "]]>", i2, "StopNode is not closed.") - 2;
        i2 = closeIndex;
      } else {
        const tagData = readTagExp(xmlData, i2, ">");
        if (tagData) {
          const openTagName = tagData && tagData.tagName;
          if (openTagName === tagName && tagData.tagExp[tagData.tagExp.length - 1] !== "/") {
            openTagCount++;
          }
          i2 = tagData.closeIndex;
        }
      }
    }
  }
}
function parseValue(val, shouldParse, options) {
  if (shouldParse && typeof val === "string") {
    const newval = val.trim();
    if (newval === "true") return true;
    else if (newval === "false") return false;
    else return toNumber(val, options);
  } else {
    if (isExist(val)) {
      return val;
    } else {
      return "";
    }
  }
}
function fromCodePoint(str, base, prefix) {
  const codePoint = Number.parseInt(str, base);
  if (codePoint >= 0 && codePoint <= 1114111) {
    return String.fromCodePoint(codePoint);
  } else {
    return prefix + str + ";";
  }
}
function transformTagName(fn, tagName, tagExp, options) {
  if (fn) {
    const newTagName = fn(tagName);
    if (tagExp === tagName) {
      tagExp = newTagName;
    }
    tagName = newTagName;
  }
  tagName = sanitizeName(tagName, options);
  return { tagName, tagExp };
}
function sanitizeName(name, options) {
  if (criticalProperties.includes(name)) {
    throw new Error(`[SECURITY] Invalid name: "${name}" is a reserved JavaScript keyword that could cause prototype pollution`);
  } else if (DANGEROUS_PROPERTY_NAMES.includes(name)) {
    return options.onDangerousProperty(name);
  }
  return name;
}
const METADATA_SYMBOL = XmlNode2.getMetaDataSymbol();
function stripAttributePrefix(attrs, prefix) {
  if (!attrs || typeof attrs !== "object") return {};
  if (!prefix) return attrs;
  const rawAttrs = {};
  for (const key in attrs) {
    if (key.startsWith(prefix)) {
      const rawName = key.substring(prefix.length);
      rawAttrs[rawName] = attrs[key];
    } else {
      rawAttrs[key] = attrs[key];
    }
  }
  return rawAttrs;
}
function prettify(node, options, matcher, readonlyMatcher) {
  return compress(node, options, matcher, readonlyMatcher);
}
function compress(arr, options, matcher, readonlyMatcher) {
  let text;
  const compressedObj = {};
  for (let i2 = 0; i2 < arr.length; i2++) {
    const tagObj = arr[i2];
    const property = propName(tagObj);
    if (property !== void 0 && property !== options.textNodeName) {
      const rawAttrs = stripAttributePrefix(
        tagObj[":@"] || {},
        options.attributeNamePrefix
      );
      matcher.push(property, rawAttrs);
    }
    if (property === options.textNodeName) {
      if (text === void 0) text = tagObj[property];
      else text += "" + tagObj[property];
    } else if (property === void 0) {
      continue;
    } else if (tagObj[property]) {
      let val = compress(tagObj[property], options, matcher, readonlyMatcher);
      const isLeaf = isLeafTag(val, options);
      if (tagObj[":@"]) {
        assignAttributes(val, tagObj[":@"], readonlyMatcher, options);
      } else if (Object.keys(val).length === 1 && val[options.textNodeName] !== void 0 && !options.alwaysCreateTextNode) {
        val = val[options.textNodeName];
      } else if (Object.keys(val).length === 0) {
        if (options.alwaysCreateTextNode) val[options.textNodeName] = "";
        else val = "";
      }
      if (tagObj[METADATA_SYMBOL] !== void 0 && typeof val === "object" && val !== null) {
        val[METADATA_SYMBOL] = tagObj[METADATA_SYMBOL];
      }
      if (compressedObj[property] !== void 0 && Object.prototype.hasOwnProperty.call(compressedObj, property)) {
        if (!Array.isArray(compressedObj[property])) {
          compressedObj[property] = [compressedObj[property]];
        }
        compressedObj[property].push(val);
      } else {
        const jPathOrMatcher = options.jPath ? readonlyMatcher.toString() : readonlyMatcher;
        if (options.isArray(property, jPathOrMatcher, isLeaf)) {
          compressedObj[property] = [val];
        } else {
          compressedObj[property] = val;
        }
      }
      if (property !== void 0 && property !== options.textNodeName) {
        matcher.pop();
      }
    }
  }
  if (typeof text === "string") {
    if (text.length > 0) compressedObj[options.textNodeName] = text;
  } else if (text !== void 0) compressedObj[options.textNodeName] = text;
  return compressedObj;
}
function propName(obj) {
  const keys = Object.keys(obj);
  for (let i2 = 0; i2 < keys.length; i2++) {
    const key = keys[i2];
    if (key !== ":@") return key;
  }
}
function assignAttributes(obj, attrMap, readonlyMatcher, options) {
  if (attrMap) {
    const keys = Object.keys(attrMap);
    const len = keys.length;
    for (let i2 = 0; i2 < len; i2++) {
      const atrrName = keys[i2];
      const rawAttrName = atrrName.startsWith(options.attributeNamePrefix) ? atrrName.substring(options.attributeNamePrefix.length) : atrrName;
      const jPathOrMatcher = options.jPath ? readonlyMatcher.toString() + "." + rawAttrName : readonlyMatcher;
      if (options.isArray(atrrName, jPathOrMatcher, true, true)) {
        obj[atrrName] = [attrMap[atrrName]];
      } else {
        obj[atrrName] = attrMap[atrrName];
      }
    }
  }
}
function isLeafTag(obj, options) {
  const { textNodeName } = options;
  const propCount = Object.keys(obj).length;
  if (propCount === 0) {
    return true;
  }
  if (propCount === 1 && (obj[textNodeName] || typeof obj[textNodeName] === "boolean" || obj[textNodeName] === 0)) {
    return true;
  }
  return false;
}
class XMLParser {
  constructor(options) {
    this.externalEntities = {};
    this.options = buildOptions(options);
  }
  /**
   * Parse XML dats to JS object 
   * @param {string|Uint8Array} xmlData 
   * @param {boolean|Object} validationOption 
   */
  parse(xmlData, validationOption) {
    if (typeof xmlData !== "string" && xmlData.toString) {
      xmlData = xmlData.toString();
    } else if (typeof xmlData !== "string") {
      throw new Error("XML data is accepted in String or Bytes[] form.");
    }
    if (validationOption) {
      if (validationOption === true) validationOption = {};
      const result = validate(xmlData, validationOption);
      if (result !== true) {
        throw Error(`${result.err.msg}:${result.err.line}:${result.err.col}`);
      }
    }
    const orderedObjParser = new OrderedObjParser(this.options);
    orderedObjParser.addExternalEntities(this.externalEntities);
    const orderedResult = orderedObjParser.parseXml(xmlData);
    if (this.options.preserveOrder || orderedResult === void 0) return orderedResult;
    else return prettify(orderedResult, this.options, orderedObjParser.matcher, orderedObjParser.readonlyMatcher);
  }
  /**
   * Add Entity which is not by default supported by this library
   * @param {string} key 
   * @param {string} value 
   */
  addEntity(key, value) {
    if (value.indexOf("&") !== -1) {
      throw new Error("Entity value can't have '&'");
    } else if (key.indexOf("&") !== -1 || key.indexOf(";") !== -1) {
      throw new Error("An entity must be set without '&' and ';'. Eg. use '#xD' for '&#xD;'");
    } else if (value === "&") {
      throw new Error("An entity with value '&' is not permitted");
    } else {
      this.externalEntities[key] = value;
    }
  }
  /**
   * Returns a Symbol that can be used to access the metadata
   * property on a node.
   * 
   * If Symbol is not available in the environment, an ordinary property is used
   * and the name of the property is here returned.
   * 
   * The XMLMetaData property is only present when `captureMetaData`
   * is true in the options.
   */
  static getMetaDataSymbol() {
    return XmlNode2.getMetaDataSymbol();
  }
}
const parser = new XMLParser({
  attributeNamePrefix: "",
  processEntities: {
    enabled: true,
    maxTotalExpansions: Infinity
  },
  htmlEntities: true,
  ignoreAttributes: false,
  ignoreDeclaration: true,
  parseTagValue: false,
  trimValues: false,
  tagValueProcessor: (_, val) => val.trim() === "" && val.includes("\n") ? "" : void 0,
  maxNestedTags: Infinity
});
parser.addEntity("#xD", "\r");
parser.addEntity("#10", "\n");
function parseXML(xmlString) {
  return parser.parse(xmlString, true);
}
class XmlShapeDeserializer extends SerdeContextConfig {
  settings;
  stringDeserializer;
  constructor(settings) {
    super();
    this.settings = settings;
    this.stringDeserializer = new FromStringShapeDeserializer(settings);
  }
  setSerdeContext(serdeContext) {
    this.serdeContext = serdeContext;
    this.stringDeserializer.setSerdeContext(serdeContext);
  }
  read(schema, bytes, key) {
    const ns = NormalizedSchema.of(schema);
    const memberSchemas = ns.getMemberSchemas();
    const isEventPayload = ns.isStructSchema() && ns.isMemberSchema() && !!Object.values(memberSchemas).find((memberNs) => {
      return !!memberNs.getMemberTraits().eventPayload;
    });
    if (isEventPayload) {
      const output = {};
      const memberName = Object.keys(memberSchemas)[0];
      const eventMemberSchema = memberSchemas[memberName];
      if (eventMemberSchema.isBlobSchema()) {
        output[memberName] = bytes;
      } else {
        output[memberName] = this.read(memberSchemas[memberName], bytes);
      }
      return output;
    }
    const xmlString = (this.serdeContext?.utf8Encoder ?? toUtf8)(bytes);
    const parsedObject = this.parseXml(xmlString);
    return this.readSchema(schema, key ? parsedObject[key] : parsedObject);
  }
  readSchema(_schema, value) {
    const ns = NormalizedSchema.of(_schema);
    if (ns.isUnitSchema()) {
      return;
    }
    const traits = ns.getMergedTraits();
    if (ns.isListSchema() && !Array.isArray(value)) {
      return this.readSchema(ns, [value]);
    }
    if (value == null) {
      return value;
    }
    if (typeof value === "object") {
      const flat = !!traits.xmlFlattened;
      if (ns.isListSchema()) {
        const listValue = ns.getValueSchema();
        const buffer2 = [];
        const sourceKey = listValue.getMergedTraits().xmlName ?? "member";
        const source = flat ? value : (value[0] ?? value)[sourceKey];
        if (source == null) {
          return buffer2;
        }
        const sourceArray = Array.isArray(source) ? source : [source];
        for (const v2 of sourceArray) {
          buffer2.push(this.readSchema(listValue, v2));
        }
        return buffer2;
      }
      const buffer = {};
      if (ns.isMapSchema()) {
        const keyNs = ns.getKeySchema();
        const memberNs = ns.getValueSchema();
        let entries;
        if (flat) {
          entries = Array.isArray(value) ? value : [value];
        } else {
          entries = Array.isArray(value.entry) ? value.entry : [value.entry];
        }
        const keyProperty = keyNs.getMergedTraits().xmlName ?? "key";
        const valueProperty = memberNs.getMergedTraits().xmlName ?? "value";
        for (const entry of entries) {
          const key = entry[keyProperty];
          const value2 = entry[valueProperty];
          buffer[key] = this.readSchema(memberNs, value2);
        }
        return buffer;
      }
      if (ns.isStructSchema()) {
        const union = ns.isUnionSchema();
        let unionSerde;
        if (union) {
          unionSerde = new UnionSerde(value, buffer);
        }
        for (const [memberName, memberSchema] of ns.structIterator()) {
          const memberTraits = memberSchema.getMergedTraits();
          const xmlObjectKey = !memberTraits.httpPayload ? memberSchema.getMemberTraits().xmlName ?? memberName : memberTraits.xmlName ?? memberSchema.getName();
          if (union) {
            unionSerde.mark(xmlObjectKey);
          }
          if (value[xmlObjectKey] != null) {
            buffer[memberName] = this.readSchema(memberSchema, value[xmlObjectKey]);
          }
        }
        if (union) {
          unionSerde.writeUnknown();
        }
        return buffer;
      }
      if (ns.isDocumentSchema()) {
        return value;
      }
      throw new Error(`@aws-sdk/core/protocols - xml deserializer unhandled schema type for ${ns.getName(true)}`);
    }
    if (ns.isListSchema()) {
      return [];
    }
    if (ns.isMapSchema() || ns.isStructSchema()) {
      return {};
    }
    return this.stringDeserializer.read(ns, value);
  }
  parseXml(xml) {
    if (xml.length) {
      let parsedObj;
      try {
        parsedObj = parseXML(xml);
      } catch (e2) {
        if (e2 && typeof e2 === "object") {
          Object.defineProperty(e2, "$responseBodyText", {
            value: xml
          });
        }
        throw e2;
      }
      const textNodeName = "#text";
      const key = Object.keys(parsedObj)[0];
      const parsedObjToReturn = parsedObj[key];
      if (parsedObjToReturn[textNodeName]) {
        parsedObjToReturn[key] = parsedObjToReturn[textNodeName];
        delete parsedObjToReturn[textNodeName];
      }
      return getValueFromTextNode(parsedObjToReturn);
    }
    return {};
  }
}
const loadRestXmlErrorCode = (output, data) => {
  if (data?.Error?.Code !== void 0) {
    return data.Error.Code;
  }
  if (data?.Code !== void 0) {
    return data.Code;
  }
  if (output.statusCode == 404) {
    return "NotFound";
  }
};
class XmlShapeSerializer extends SerdeContextConfig {
  settings;
  stringBuffer;
  byteBuffer;
  buffer;
  constructor(settings) {
    super();
    this.settings = settings;
  }
  write(schema, value) {
    const ns = NormalizedSchema.of(schema);
    if (ns.isStringSchema() && typeof value === "string") {
      this.stringBuffer = value;
    } else if (ns.isBlobSchema()) {
      this.byteBuffer = "byteLength" in value ? value : (this.serdeContext?.base64Decoder ?? fromBase64)(value);
    } else {
      this.buffer = this.writeStruct(ns, value, void 0);
      const traits = ns.getMergedTraits();
      if (traits.httpPayload && !traits.xmlName) {
        this.buffer.withName(ns.getName());
      }
    }
  }
  flush() {
    if (this.byteBuffer !== void 0) {
      const bytes = this.byteBuffer;
      delete this.byteBuffer;
      return bytes;
    }
    if (this.stringBuffer !== void 0) {
      const str = this.stringBuffer;
      delete this.stringBuffer;
      return str;
    }
    const buffer = this.buffer;
    if (this.settings.xmlNamespace) {
      if (!buffer?.attributes?.["xmlns"]) {
        buffer.addAttribute("xmlns", this.settings.xmlNamespace);
      }
    }
    delete this.buffer;
    return buffer.toString();
  }
  writeStruct(ns, value, parentXmlns) {
    const traits = ns.getMergedTraits();
    const name = ns.isMemberSchema() && !traits.httpPayload ? ns.getMemberTraits().xmlName ?? ns.getMemberName() : traits.xmlName ?? ns.getName();
    if (!name || !ns.isStructSchema()) {
      throw new Error(`@aws-sdk/core/protocols - xml serializer, cannot write struct with empty name or non-struct, schema=${ns.getName(true)}.`);
    }
    const structXmlNode = XmlNode$1.of(name);
    const [xmlnsAttr, xmlns] = this.getXmlnsAttribute(ns, parentXmlns);
    for (const [memberName, memberSchema] of ns.structIterator()) {
      const val = value[memberName];
      if (val != null || memberSchema.isIdempotencyToken()) {
        if (memberSchema.getMergedTraits().xmlAttribute) {
          structXmlNode.addAttribute(memberSchema.getMergedTraits().xmlName ?? memberName, this.writeSimple(memberSchema, val));
          continue;
        }
        if (memberSchema.isListSchema()) {
          this.writeList(memberSchema, val, structXmlNode, xmlns);
        } else if (memberSchema.isMapSchema()) {
          this.writeMap(memberSchema, val, structXmlNode, xmlns);
        } else if (memberSchema.isStructSchema()) {
          structXmlNode.addChildNode(this.writeStruct(memberSchema, val, xmlns));
        } else {
          const memberNode = XmlNode$1.of(memberSchema.getMergedTraits().xmlName ?? memberSchema.getMemberName());
          this.writeSimpleInto(memberSchema, val, memberNode, xmlns);
          structXmlNode.addChildNode(memberNode);
        }
      }
    }
    const { $unknown } = value;
    if ($unknown && ns.isUnionSchema() && Array.isArray($unknown) && Object.keys(value).length === 1) {
      const [k2, v2] = $unknown;
      const node = XmlNode$1.of(k2);
      if (typeof v2 !== "string") {
        if (value instanceof XmlNode$1 || value instanceof XmlText) {
          structXmlNode.addChildNode(value);
        } else {
          throw new Error(`@aws-sdk - $unknown union member in XML requires value of type string, @aws-sdk/xml-builder::XmlNode or XmlText.`);
        }
      }
      this.writeSimpleInto(0, v2, node, xmlns);
      structXmlNode.addChildNode(node);
    }
    if (xmlns) {
      structXmlNode.addAttribute(xmlnsAttr, xmlns);
    }
    return structXmlNode;
  }
  writeList(listMember, array, container, parentXmlns) {
    if (!listMember.isMemberSchema()) {
      throw new Error(`@aws-sdk/core/protocols - xml serializer, cannot write non-member list: ${listMember.getName(true)}`);
    }
    const listTraits = listMember.getMergedTraits();
    const listValueSchema = listMember.getValueSchema();
    const listValueTraits = listValueSchema.getMergedTraits();
    const sparse = !!listValueTraits.sparse;
    const flat = !!listTraits.xmlFlattened;
    const [xmlnsAttr, xmlns] = this.getXmlnsAttribute(listMember, parentXmlns);
    const writeItem = (container2, value) => {
      if (listValueSchema.isListSchema()) {
        this.writeList(listValueSchema, Array.isArray(value) ? value : [value], container2, xmlns);
      } else if (listValueSchema.isMapSchema()) {
        this.writeMap(listValueSchema, value, container2, xmlns);
      } else if (listValueSchema.isStructSchema()) {
        const struct = this.writeStruct(listValueSchema, value, xmlns);
        container2.addChildNode(struct.withName(flat ? listTraits.xmlName ?? listMember.getMemberName() : listValueTraits.xmlName ?? "member"));
      } else {
        const listItemNode = XmlNode$1.of(flat ? listTraits.xmlName ?? listMember.getMemberName() : listValueTraits.xmlName ?? "member");
        this.writeSimpleInto(listValueSchema, value, listItemNode, xmlns);
        container2.addChildNode(listItemNode);
      }
    };
    if (flat) {
      for (const value of array) {
        if (sparse || value != null) {
          writeItem(container, value);
        }
      }
    } else {
      const listNode = XmlNode$1.of(listTraits.xmlName ?? listMember.getMemberName());
      if (xmlns) {
        listNode.addAttribute(xmlnsAttr, xmlns);
      }
      for (const value of array) {
        if (sparse || value != null) {
          writeItem(listNode, value);
        }
      }
      container.addChildNode(listNode);
    }
  }
  writeMap(mapMember, map, container, parentXmlns, containerIsMap = false) {
    if (!mapMember.isMemberSchema()) {
      throw new Error(`@aws-sdk/core/protocols - xml serializer, cannot write non-member map: ${mapMember.getName(true)}`);
    }
    const mapTraits = mapMember.getMergedTraits();
    const mapKeySchema = mapMember.getKeySchema();
    const mapKeyTraits = mapKeySchema.getMergedTraits();
    const keyTag = mapKeyTraits.xmlName ?? "key";
    const mapValueSchema = mapMember.getValueSchema();
    const mapValueTraits = mapValueSchema.getMergedTraits();
    const valueTag = mapValueTraits.xmlName ?? "value";
    const sparse = !!mapValueTraits.sparse;
    const flat = !!mapTraits.xmlFlattened;
    const [xmlnsAttr, xmlns] = this.getXmlnsAttribute(mapMember, parentXmlns);
    const addKeyValue = (entry, key, val) => {
      const keyNode = XmlNode$1.of(keyTag, key);
      const [keyXmlnsAttr, keyXmlns] = this.getXmlnsAttribute(mapKeySchema, xmlns);
      if (keyXmlns) {
        keyNode.addAttribute(keyXmlnsAttr, keyXmlns);
      }
      entry.addChildNode(keyNode);
      let valueNode = XmlNode$1.of(valueTag);
      if (mapValueSchema.isListSchema()) {
        this.writeList(mapValueSchema, val, valueNode, xmlns);
      } else if (mapValueSchema.isMapSchema()) {
        this.writeMap(mapValueSchema, val, valueNode, xmlns, true);
      } else if (mapValueSchema.isStructSchema()) {
        valueNode = this.writeStruct(mapValueSchema, val, xmlns);
      } else {
        this.writeSimpleInto(mapValueSchema, val, valueNode, xmlns);
      }
      entry.addChildNode(valueNode);
    };
    if (flat) {
      for (const [key, val] of Object.entries(map)) {
        if (sparse || val != null) {
          const entry = XmlNode$1.of(mapTraits.xmlName ?? mapMember.getMemberName());
          addKeyValue(entry, key, val);
          container.addChildNode(entry);
        }
      }
    } else {
      let mapNode;
      if (!containerIsMap) {
        mapNode = XmlNode$1.of(mapTraits.xmlName ?? mapMember.getMemberName());
        if (xmlns) {
          mapNode.addAttribute(xmlnsAttr, xmlns);
        }
        container.addChildNode(mapNode);
      }
      for (const [key, val] of Object.entries(map)) {
        if (sparse || val != null) {
          const entry = XmlNode$1.of("entry");
          addKeyValue(entry, key, val);
          (containerIsMap ? container : mapNode).addChildNode(entry);
        }
      }
    }
  }
  writeSimple(_schema, value) {
    if (null === value) {
      throw new Error("@aws-sdk/core/protocols - (XML serializer) cannot write null value.");
    }
    const ns = NormalizedSchema.of(_schema);
    let nodeContents = null;
    if (value && typeof value === "object") {
      if (ns.isBlobSchema()) {
        nodeContents = (this.serdeContext?.base64Encoder ?? toBase64)(value);
      } else if (ns.isTimestampSchema() && value instanceof Date) {
        const format2 = determineTimestampFormat(ns, this.settings);
        switch (format2) {
          case 5:
            nodeContents = value.toISOString().replace(".000Z", "Z");
            break;
          case 6:
            nodeContents = dateToUtcString(value);
            break;
          case 7:
            nodeContents = String(value.getTime() / 1e3);
            break;
          default:
            console.warn("Missing timestamp format, using http date", value);
            nodeContents = dateToUtcString(value);
            break;
        }
      } else if (ns.isBigDecimalSchema() && value) {
        if (value instanceof NumericValue) {
          return value.string;
        }
        return String(value);
      } else if (ns.isMapSchema() || ns.isListSchema()) {
        throw new Error("@aws-sdk/core/protocols - xml serializer, cannot call _write() on List/Map schema, call writeList or writeMap() instead.");
      } else {
        throw new Error(`@aws-sdk/core/protocols - xml serializer, unhandled schema type for object value and schema: ${ns.getName(true)}`);
      }
    }
    if (ns.isBooleanSchema() || ns.isNumericSchema() || ns.isBigIntegerSchema() || ns.isBigDecimalSchema()) {
      nodeContents = String(value);
    }
    if (ns.isStringSchema()) {
      if (value === void 0 && ns.isIdempotencyToken()) {
        nodeContents = v4();
      } else {
        nodeContents = String(value);
      }
    }
    if (nodeContents === null) {
      throw new Error(`Unhandled schema-value pair ${ns.getName(true)}=${value}`);
    }
    return nodeContents;
  }
  writeSimpleInto(_schema, value, into, parentXmlns) {
    const nodeContents = this.writeSimple(_schema, value);
    const ns = NormalizedSchema.of(_schema);
    const content = new XmlText(nodeContents);
    const [xmlnsAttr, xmlns] = this.getXmlnsAttribute(ns, parentXmlns);
    if (xmlns) {
      into.addAttribute(xmlnsAttr, xmlns);
    }
    into.addChildNode(content);
  }
  getXmlnsAttribute(ns, parentXmlns) {
    const traits = ns.getMergedTraits();
    const [prefix, xmlns] = traits.xmlNamespace ?? [];
    if (xmlns && xmlns !== parentXmlns) {
      return [prefix ? `xmlns:${prefix}` : "xmlns", xmlns];
    }
    return [void 0, void 0];
  }
}
class XmlCodec extends SerdeContextConfig {
  settings;
  constructor(settings) {
    super();
    this.settings = settings;
  }
  createSerializer() {
    const serializer = new XmlShapeSerializer(this.settings);
    serializer.setSerdeContext(this.serdeContext);
    return serializer;
  }
  createDeserializer() {
    const deserializer = new XmlShapeDeserializer(this.settings);
    deserializer.setSerdeContext(this.serdeContext);
    return deserializer;
  }
}
class AwsRestXmlProtocol extends HttpBindingProtocol {
  codec;
  serializer;
  deserializer;
  mixin = new ProtocolLib();
  constructor(options) {
    super(options);
    const settings = {
      timestampFormat: {
        useTrait: true,
        default: 5
      },
      httpBindings: true,
      xmlNamespace: options.xmlNamespace,
      serviceNamespace: options.defaultNamespace
    };
    this.codec = new XmlCodec(settings);
    this.serializer = new HttpInterceptingShapeSerializer(this.codec.createSerializer(), settings);
    this.deserializer = new HttpInterceptingShapeDeserializer(this.codec.createDeserializer(), settings);
    this.compositeErrorRegistry;
  }
  getPayloadCodec() {
    return this.codec;
  }
  getShapeId() {
    return "aws.protocols#restXml";
  }
  async serializeRequest(operationSchema, input, context) {
    const request2 = await super.serializeRequest(operationSchema, input, context);
    const inputSchema = NormalizedSchema.of(operationSchema.input);
    if (!request2.headers["content-type"]) {
      const contentType = this.mixin.resolveRestContentType(this.getDefaultContentType(), inputSchema);
      if (contentType) {
        request2.headers["content-type"] = contentType;
      }
    }
    if (typeof request2.body === "string" && request2.headers["content-type"] === this.getDefaultContentType() && !request2.body.startsWith("<?xml ") && !this.hasUnstructuredPayloadBinding(inputSchema)) {
      request2.body = '<?xml version="1.0" encoding="UTF-8"?>' + request2.body;
    }
    return request2;
  }
  async deserializeResponse(operationSchema, context, response) {
    return super.deserializeResponse(operationSchema, context, response);
  }
  async handleError(operationSchema, context, response, dataObject, metadata) {
    const errorIdentifier = loadRestXmlErrorCode(response, dataObject) ?? "Unknown";
    this.mixin.compose(this.compositeErrorRegistry, errorIdentifier, this.options.defaultNamespace);
    if (dataObject.Error && typeof dataObject.Error === "object") {
      for (const key of Object.keys(dataObject.Error)) {
        dataObject[key] = dataObject.Error[key];
        if (key.toLowerCase() === "message") {
          dataObject.message = dataObject.Error[key];
        }
      }
    }
    if (dataObject.RequestId && !metadata.requestId) {
      metadata.requestId = dataObject.RequestId;
    }
    const { errorSchema, errorMetadata } = await this.mixin.getErrorSchemaOrThrowBaseException(errorIdentifier, this.options.defaultNamespace, response, dataObject, metadata);
    const ns = NormalizedSchema.of(errorSchema);
    const message = dataObject.Error?.message ?? dataObject.Error?.Message ?? dataObject.message ?? dataObject.Message ?? "UnknownError";
    const ErrorCtor = this.compositeErrorRegistry.getErrorCtor(errorSchema) ?? Error;
    const exception = new ErrorCtor(message);
    await this.deserializeHttpMessage(errorSchema, context, response, dataObject);
    const output = {};
    for (const [name, member2] of ns.structIterator()) {
      const target = member2.getMergedTraits().xmlName ?? name;
      const value = dataObject.Error?.[target] ?? dataObject[target];
      output[name] = this.codec.createDeserializer().readSchema(member2, value);
    }
    throw this.mixin.decorateServiceException(Object.assign(exception, errorMetadata, {
      $fault: ns.getMergedTraits().error,
      message
    }, output), dataObject);
  }
  getDefaultContentType() {
    return "application/xml";
  }
  hasUnstructuredPayloadBinding(ns) {
    for (const [, member2] of ns.structIterator()) {
      if (member2.getMergedTraits().httpPayload) {
        return !(member2.isStructSchema() || member2.isMapSchema() || member2.isListSchema());
      }
    }
    return false;
  }
}
class S3RestXmlProtocol extends AwsRestXmlProtocol {
  async serializeRequest(operationSchema, input, context) {
    const request2 = await super.serializeRequest(operationSchema, input, context);
    const ns = NormalizedSchema.of(operationSchema.input);
    const staticStructureSchema = ns.getSchema();
    let bucketMemberIndex = 0;
    const requiredMemberCount = staticStructureSchema[6] ?? 0;
    if (input && typeof input === "object") {
      for (const [memberName, memberNs] of ns.structIterator()) {
        if (++bucketMemberIndex > requiredMemberCount) {
          break;
        }
        if (memberName === "Bucket") {
          if (!input.Bucket && memberNs.getMergedTraits().httpLabel) {
            throw new Error(`No value provided for input HTTP label: Bucket.`);
          }
          break;
        }
      }
    }
    return request2;
  }
}
const DEFAULT_UA_APP_ID = void 0;
function isValidUserAgentAppId(appId) {
  if (appId === void 0) {
    return true;
  }
  return typeof appId === "string" && appId.length <= 50;
}
function resolveUserAgentConfig(input) {
  const normalizedAppIdProvider = normalizeProvider(input.userAgentAppId ?? DEFAULT_UA_APP_ID);
  const { customUserAgent } = input;
  return Object.assign(input, {
    customUserAgent: typeof customUserAgent === "string" ? [[customUserAgent]] : customUserAgent,
    userAgentAppId: async () => {
      const appId = await normalizedAppIdProvider();
      if (!isValidUserAgentAppId(appId)) {
        const logger2 = input.logger?.constructor?.name === "NoOpLogger" || !input.logger ? console : input.logger;
        if (typeof appId !== "string") {
          logger2?.warn("userAgentAppId must be a string or undefined.");
        } else if (appId.length > 50) {
          logger2?.warn("The provided userAgentAppId exceeds the maximum length of 50 characters.");
        }
      }
      return appId;
    }
  });
}
class EndpointCache {
  capacity;
  data = /* @__PURE__ */ new Map();
  parameters = [];
  constructor({ size, params }) {
    this.capacity = size ?? 50;
    if (params) {
      this.parameters = params;
    }
  }
  get(endpointParams, resolver) {
    const key = this.hash(endpointParams);
    if (key === false) {
      return resolver();
    }
    if (!this.data.has(key)) {
      if (this.data.size > this.capacity + 10) {
        const keys = this.data.keys();
        let i2 = 0;
        while (true) {
          const { value, done } = keys.next();
          this.data.delete(value);
          if (done || ++i2 > 10) {
            break;
          }
        }
      }
      this.data.set(key, resolver());
    }
    return this.data.get(key);
  }
  size() {
    return this.data.size;
  }
  hash(endpointParams) {
    let buffer = "";
    const { parameters } = this;
    if (parameters.length === 0) {
      return false;
    }
    for (const param of parameters) {
      const val = String(endpointParams[param] ?? "");
      if (val.includes("|;")) {
        return false;
      }
      buffer += val + "|;";
    }
    return buffer;
  }
}
const IP_V4_REGEX = new RegExp(`^(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)(?:\\.(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)){3}$`);
const isIpAddress = (value) => IP_V4_REGEX.test(value) || value.startsWith("[") && value.endsWith("]");
const VALID_HOST_LABEL_REGEX = new RegExp(`^(?!.*-$)(?!-)[a-zA-Z0-9-]{1,63}$`);
const isValidHostLabel = (value, allowSubDomains = false) => {
  if (!allowSubDomains) {
    return VALID_HOST_LABEL_REGEX.test(value);
  }
  const labels = value.split(".");
  for (const label of labels) {
    if (!isValidHostLabel(label)) {
      return false;
    }
  }
  return true;
};
const customEndpointFunctions = {};
const debugId = "endpoints";
function toDebugString(input) {
  if (typeof input !== "object" || input == null) {
    return input;
  }
  if ("ref" in input) {
    return `$${toDebugString(input.ref)}`;
  }
  if ("fn" in input) {
    return `${input.fn}(${(input.argv || []).map(toDebugString).join(", ")})`;
  }
  return JSON.stringify(input, null, 2);
}
class EndpointError extends Error {
  constructor(message) {
    super(message);
    this.name = "EndpointError";
  }
}
const booleanEquals = (value1, value2) => value1 === value2;
const getAttrPathList = (path) => {
  const parts = path.split(".");
  const pathList = [];
  for (const part of parts) {
    const squareBracketIndex = part.indexOf("[");
    if (squareBracketIndex !== -1) {
      if (part.indexOf("]") !== part.length - 1) {
        throw new EndpointError(`Path: '${path}' does not end with ']'`);
      }
      const arrayIndex = part.slice(squareBracketIndex + 1, -1);
      if (Number.isNaN(parseInt(arrayIndex))) {
        throw new EndpointError(`Invalid array index: '${arrayIndex}' in path: '${path}'`);
      }
      if (squareBracketIndex !== 0) {
        pathList.push(part.slice(0, squareBracketIndex));
      }
      pathList.push(arrayIndex);
    } else {
      pathList.push(part);
    }
  }
  return pathList;
};
const getAttr = (value, path) => getAttrPathList(path).reduce((acc, index) => {
  if (typeof acc !== "object") {
    throw new EndpointError(`Index '${index}' in '${path}' not found in '${JSON.stringify(value)}'`);
  } else if (Array.isArray(acc)) {
    return acc[parseInt(index)];
  }
  return acc[index];
}, value);
const isSet = (value) => value != null;
const not = (value) => !value;
const DEFAULT_PORTS = {
  [EndpointURLScheme.HTTP]: 80,
  [EndpointURLScheme.HTTPS]: 443
};
const parseURL = (value) => {
  const whatwgURL = (() => {
    try {
      if (value instanceof URL) {
        return value;
      }
      if (typeof value === "object" && "hostname" in value) {
        const { hostname: hostname2, port, protocol: protocol2 = "", path = "", query = {} } = value;
        const url = new URL(`${protocol2}//${hostname2}${port ? `:${port}` : ""}${path}`);
        url.search = Object.entries(query).map(([k2, v2]) => `${k2}=${v2}`).join("&");
        return url;
      }
      return new URL(value);
    } catch (error) {
      return null;
    }
  })();
  if (!whatwgURL) {
    console.error(`Unable to parse ${JSON.stringify(value)} as a whatwg URL.`);
    return null;
  }
  const urlString = whatwgURL.href;
  const { host, hostname, pathname, protocol, search } = whatwgURL;
  if (search) {
    return null;
  }
  const scheme = protocol.slice(0, -1);
  if (!Object.values(EndpointURLScheme).includes(scheme)) {
    return null;
  }
  const isIp = isIpAddress(hostname);
  const inputContainsDefaultPort = urlString.includes(`${host}:${DEFAULT_PORTS[scheme]}`) || typeof value === "string" && value.includes(`${host}:${DEFAULT_PORTS[scheme]}`);
  const authority = `${host}${inputContainsDefaultPort ? `:${DEFAULT_PORTS[scheme]}` : ``}`;
  return {
    scheme,
    authority,
    path: pathname,
    normalizedPath: pathname.endsWith("/") ? pathname : `${pathname}/`,
    isIp
  };
};
const stringEquals = (value1, value2) => value1 === value2;
const substring = (input, start, stop, reverse) => {
  if (start >= stop || input.length < stop || /[^\u0000-\u007f]/.test(input)) {
    return null;
  }
  if (!reverse) {
    return input.substring(start, stop);
  }
  return input.substring(input.length - stop, input.length - start);
};
const uriEncode = (value) => encodeURIComponent(value).replace(/[!*'()]/g, (c2) => `%${c2.charCodeAt(0).toString(16).toUpperCase()}`);
const endpointFunctions = {
  booleanEquals,
  getAttr,
  isSet,
  isValidHostLabel,
  not,
  parseURL,
  stringEquals,
  substring,
  uriEncode
};
const evaluateTemplate = (template, options) => {
  const evaluatedTemplateArr = [];
  const templateContext = {
    ...options.endpointParams,
    ...options.referenceRecord
  };
  let currentIndex = 0;
  while (currentIndex < template.length) {
    const openingBraceIndex = template.indexOf("{", currentIndex);
    if (openingBraceIndex === -1) {
      evaluatedTemplateArr.push(template.slice(currentIndex));
      break;
    }
    evaluatedTemplateArr.push(template.slice(currentIndex, openingBraceIndex));
    const closingBraceIndex = template.indexOf("}", openingBraceIndex);
    if (closingBraceIndex === -1) {
      evaluatedTemplateArr.push(template.slice(openingBraceIndex));
      break;
    }
    if (template[openingBraceIndex + 1] === "{" && template[closingBraceIndex + 1] === "}") {
      evaluatedTemplateArr.push(template.slice(openingBraceIndex + 1, closingBraceIndex));
      currentIndex = closingBraceIndex + 2;
    }
    const parameterName = template.substring(openingBraceIndex + 1, closingBraceIndex);
    if (parameterName.includes("#")) {
      const [refName, attrName] = parameterName.split("#");
      evaluatedTemplateArr.push(getAttr(templateContext[refName], attrName));
    } else {
      evaluatedTemplateArr.push(templateContext[parameterName]);
    }
    currentIndex = closingBraceIndex + 1;
  }
  return evaluatedTemplateArr.join("");
};
const getReferenceValue = ({ ref }, options) => {
  const referenceRecord = {
    ...options.endpointParams,
    ...options.referenceRecord
  };
  return referenceRecord[ref];
};
const evaluateExpression = (obj, keyName, options) => {
  if (typeof obj === "string") {
    return evaluateTemplate(obj, options);
  } else if (obj["fn"]) {
    return group$2.callFunction(obj, options);
  } else if (obj["ref"]) {
    return getReferenceValue(obj, options);
  }
  throw new EndpointError(`'${keyName}': ${String(obj)} is not a string, function or reference.`);
};
const callFunction = ({ fn, argv }, options) => {
  const evaluatedArgs = argv.map((arg) => ["boolean", "number"].includes(typeof arg) ? arg : group$2.evaluateExpression(arg, "arg", options));
  const fnSegments = fn.split(".");
  if (fnSegments[0] in customEndpointFunctions && fnSegments[1] != null) {
    return customEndpointFunctions[fnSegments[0]][fnSegments[1]](...evaluatedArgs);
  }
  return endpointFunctions[fn](...evaluatedArgs);
};
const group$2 = {
  evaluateExpression,
  callFunction
};
const evaluateCondition = ({ assign, ...fnArgs }, options) => {
  if (assign && assign in options.referenceRecord) {
    throw new EndpointError(`'${assign}' is already defined in Reference Record.`);
  }
  const value = callFunction(fnArgs, options);
  options.logger?.debug?.(`${debugId} evaluateCondition: ${toDebugString(fnArgs)} = ${toDebugString(value)}`);
  return {
    result: value === "" ? true : !!value,
    ...assign != null && { toAssign: { name: assign, value } }
  };
};
const evaluateConditions = (conditions = [], options) => {
  const conditionsReferenceRecord = {};
  for (const condition of conditions) {
    const { result, toAssign } = evaluateCondition(condition, {
      ...options,
      referenceRecord: {
        ...options.referenceRecord,
        ...conditionsReferenceRecord
      }
    });
    if (!result) {
      return { result };
    }
    if (toAssign) {
      conditionsReferenceRecord[toAssign.name] = toAssign.value;
      options.logger?.debug?.(`${debugId} assign: ${toAssign.name} := ${toDebugString(toAssign.value)}`);
    }
  }
  return { result: true, referenceRecord: conditionsReferenceRecord };
};
const getEndpointHeaders = (headers, options) => Object.entries(headers).reduce((acc, [headerKey, headerVal]) => ({
  ...acc,
  [headerKey]: headerVal.map((headerValEntry) => {
    const processedExpr = evaluateExpression(headerValEntry, "Header value entry", options);
    if (typeof processedExpr !== "string") {
      throw new EndpointError(`Header '${headerKey}' value '${processedExpr}' is not a string`);
    }
    return processedExpr;
  })
}), {});
const getEndpointProperties = (properties, options) => Object.entries(properties).reduce((acc, [propertyKey, propertyVal]) => ({
  ...acc,
  [propertyKey]: group$1.getEndpointProperty(propertyVal, options)
}), {});
const getEndpointProperty = (property, options) => {
  if (Array.isArray(property)) {
    return property.map((propertyEntry) => getEndpointProperty(propertyEntry, options));
  }
  switch (typeof property) {
    case "string":
      return evaluateTemplate(property, options);
    case "object":
      if (property === null) {
        throw new EndpointError(`Unexpected endpoint property: ${property}`);
      }
      return group$1.getEndpointProperties(property, options);
    case "boolean":
      return property;
    default:
      throw new EndpointError(`Unexpected endpoint property type: ${typeof property}`);
  }
};
const group$1 = {
  getEndpointProperty,
  getEndpointProperties
};
const getEndpointUrl = (endpointUrl, options) => {
  const expression = evaluateExpression(endpointUrl, "Endpoint URL", options);
  if (typeof expression === "string") {
    try {
      return new URL(expression);
    } catch (error) {
      console.error(`Failed to construct URL with ${expression}`, error);
      throw error;
    }
  }
  throw new EndpointError(`Endpoint URL must be a string, got ${typeof expression}`);
};
const evaluateEndpointRule = (endpointRule, options) => {
  const { conditions, endpoint } = endpointRule;
  const { result, referenceRecord } = evaluateConditions(conditions, options);
  if (!result) {
    return;
  }
  const endpointRuleOptions = {
    ...options,
    referenceRecord: { ...options.referenceRecord, ...referenceRecord }
  };
  const { url, properties, headers } = endpoint;
  options.logger?.debug?.(`${debugId} Resolving endpoint from template: ${toDebugString(endpoint)}`);
  return {
    ...headers != void 0 && {
      headers: getEndpointHeaders(headers, endpointRuleOptions)
    },
    ...properties != void 0 && {
      properties: getEndpointProperties(properties, endpointRuleOptions)
    },
    url: getEndpointUrl(url, endpointRuleOptions)
  };
};
const evaluateErrorRule = (errorRule, options) => {
  const { conditions, error } = errorRule;
  const { result, referenceRecord } = evaluateConditions(conditions, options);
  if (!result) {
    return;
  }
  throw new EndpointError(evaluateExpression(error, "Error", {
    ...options,
    referenceRecord: { ...options.referenceRecord, ...referenceRecord }
  }));
};
const evaluateRules = (rules, options) => {
  for (const rule of rules) {
    if (rule.type === "endpoint") {
      const endpointOrUndefined = evaluateEndpointRule(rule, options);
      if (endpointOrUndefined) {
        return endpointOrUndefined;
      }
    } else if (rule.type === "error") {
      evaluateErrorRule(rule, options);
    } else if (rule.type === "tree") {
      const endpointOrUndefined = group.evaluateTreeRule(rule, options);
      if (endpointOrUndefined) {
        return endpointOrUndefined;
      }
    } else {
      throw new EndpointError(`Unknown endpoint rule: ${rule}`);
    }
  }
  throw new EndpointError(`Rules evaluation failed`);
};
const evaluateTreeRule = (treeRule, options) => {
  const { conditions, rules } = treeRule;
  const { result, referenceRecord } = evaluateConditions(conditions, options);
  if (!result) {
    return;
  }
  return group.evaluateRules(rules, {
    ...options,
    referenceRecord: { ...options.referenceRecord, ...referenceRecord }
  });
};
const group = {
  evaluateRules,
  evaluateTreeRule
};
const resolveEndpoint = (ruleSetObject, options) => {
  const { endpointParams, logger: logger2 } = options;
  const { parameters, rules } = ruleSetObject;
  options.logger?.debug?.(`${debugId} Initial EndpointParams: ${toDebugString(endpointParams)}`);
  const paramsWithDefault = Object.entries(parameters).filter(([, v2]) => v2.default != null).map(([k2, v2]) => [k2, v2.default]);
  if (paramsWithDefault.length > 0) {
    for (const [paramKey, paramDefaultValue] of paramsWithDefault) {
      endpointParams[paramKey] = endpointParams[paramKey] ?? paramDefaultValue;
    }
  }
  const requiredParams = Object.entries(parameters).filter(([, v2]) => v2.required).map(([k2]) => k2);
  for (const requiredParam of requiredParams) {
    if (endpointParams[requiredParam] == null) {
      throw new EndpointError(`Missing required parameter: '${requiredParam}'`);
    }
  }
  const endpoint = evaluateRules(rules, { endpointParams, logger: logger2, referenceRecord: {} });
  options.logger?.debug?.(`${debugId} Resolved endpoint: ${toDebugString(endpoint)}`);
  return endpoint;
};
const isVirtualHostableS3Bucket = (value, allowSubDomains = false) => {
  if (allowSubDomains) {
    for (const label of value.split(".")) {
      if (!isVirtualHostableS3Bucket(label)) {
        return false;
      }
    }
    return true;
  }
  if (!isValidHostLabel(value)) {
    return false;
  }
  if (value.length < 3 || value.length > 63) {
    return false;
  }
  if (value !== value.toLowerCase()) {
    return false;
  }
  if (isIpAddress(value)) {
    return false;
  }
  return true;
};
const ARN_DELIMITER = ":";
const RESOURCE_DELIMITER = "/";
const parseArn = (value) => {
  const segments = value.split(ARN_DELIMITER);
  if (segments.length < 6)
    return null;
  const [arn, partition2, service, region, accountId, ...resourcePath] = segments;
  if (arn !== "arn" || partition2 === "" || service === "" || resourcePath.join(ARN_DELIMITER) === "")
    return null;
  const resourceId = resourcePath.map((resource) => resource.split(RESOURCE_DELIMITER)).flat();
  return {
    partition: partition2,
    service,
    region,
    accountId,
    resourceId
  };
};
const partitions = [{ "id": "aws", "outputs": { "dnsSuffix": "amazonaws.com", "dualStackDnsSuffix": "api.aws", "implicitGlobalRegion": "us-east-1", "name": "aws", "supportsDualStack": true, "supportsFIPS": true }, "regionRegex": "^(us|eu|ap|sa|ca|me|af|il|mx)\\-\\w+\\-\\d+$", "regions": { "af-south-1": { "description": "Africa (Cape Town)" }, "ap-east-1": { "description": "Asia Pacific (Hong Kong)" }, "ap-east-2": { "description": "Asia Pacific (Taipei)" }, "ap-northeast-1": { "description": "Asia Pacific (Tokyo)" }, "ap-northeast-2": { "description": "Asia Pacific (Seoul)" }, "ap-northeast-3": { "description": "Asia Pacific (Osaka)" }, "ap-south-1": { "description": "Asia Pacific (Mumbai)" }, "ap-south-2": { "description": "Asia Pacific (Hyderabad)" }, "ap-southeast-1": { "description": "Asia Pacific (Singapore)" }, "ap-southeast-2": { "description": "Asia Pacific (Sydney)" }, "ap-southeast-3": { "description": "Asia Pacific (Jakarta)" }, "ap-southeast-4": { "description": "Asia Pacific (Melbourne)" }, "ap-southeast-5": { "description": "Asia Pacific (Malaysia)" }, "ap-southeast-6": { "description": "Asia Pacific (New Zealand)" }, "ap-southeast-7": { "description": "Asia Pacific (Thailand)" }, "aws-global": { "description": "aws global region" }, "ca-central-1": { "description": "Canada (Central)" }, "ca-west-1": { "description": "Canada West (Calgary)" }, "eu-central-1": { "description": "Europe (Frankfurt)" }, "eu-central-2": { "description": "Europe (Zurich)" }, "eu-north-1": { "description": "Europe (Stockholm)" }, "eu-south-1": { "description": "Europe (Milan)" }, "eu-south-2": { "description": "Europe (Spain)" }, "eu-west-1": { "description": "Europe (Ireland)" }, "eu-west-2": { "description": "Europe (London)" }, "eu-west-3": { "description": "Europe (Paris)" }, "il-central-1": { "description": "Israel (Tel Aviv)" }, "me-central-1": { "description": "Middle East (UAE)" }, "me-south-1": { "description": "Middle East (Bahrain)" }, "mx-central-1": { "description": "Mexico (Central)" }, "sa-east-1": { "description": "South America (Sao Paulo)" }, "us-east-1": { "description": "US East (N. Virginia)" }, "us-east-2": { "description": "US East (Ohio)" }, "us-west-1": { "description": "US West (N. California)" }, "us-west-2": { "description": "US West (Oregon)" } } }, { "id": "aws-cn", "outputs": { "dnsSuffix": "amazonaws.com.cn", "dualStackDnsSuffix": "api.amazonwebservices.com.cn", "implicitGlobalRegion": "cn-northwest-1", "name": "aws-cn", "supportsDualStack": true, "supportsFIPS": true }, "regionRegex": "^cn\\-\\w+\\-\\d+$", "regions": { "aws-cn-global": { "description": "aws-cn global region" }, "cn-north-1": { "description": "China (Beijing)" }, "cn-northwest-1": { "description": "China (Ningxia)" } } }, { "id": "aws-eusc", "outputs": { "dnsSuffix": "amazonaws.eu", "dualStackDnsSuffix": "api.amazonwebservices.eu", "implicitGlobalRegion": "eusc-de-east-1", "name": "aws-eusc", "supportsDualStack": true, "supportsFIPS": true }, "regionRegex": "^eusc\\-(de)\\-\\w+\\-\\d+$", "regions": { "eusc-de-east-1": { "description": "AWS European Sovereign Cloud (Germany)" } } }, { "id": "aws-iso", "outputs": { "dnsSuffix": "c2s.ic.gov", "dualStackDnsSuffix": "api.aws.ic.gov", "implicitGlobalRegion": "us-iso-east-1", "name": "aws-iso", "supportsDualStack": true, "supportsFIPS": true }, "regionRegex": "^us\\-iso\\-\\w+\\-\\d+$", "regions": { "aws-iso-global": { "description": "aws-iso global region" }, "us-iso-east-1": { "description": "US ISO East" }, "us-iso-west-1": { "description": "US ISO WEST" } } }, { "id": "aws-iso-b", "outputs": { "dnsSuffix": "sc2s.sgov.gov", "dualStackDnsSuffix": "api.aws.scloud", "implicitGlobalRegion": "us-isob-east-1", "name": "aws-iso-b", "supportsDualStack": true, "supportsFIPS": true }, "regionRegex": "^us\\-isob\\-\\w+\\-\\d+$", "regions": { "aws-iso-b-global": { "description": "aws-iso-b global region" }, "us-isob-east-1": { "description": "US ISOB East (Ohio)" }, "us-isob-west-1": { "description": "US ISOB West" } } }, { "id": "aws-iso-e", "outputs": { "dnsSuffix": "cloud.adc-e.uk", "dualStackDnsSuffix": "api.cloud-aws.adc-e.uk", "implicitGlobalRegion": "eu-isoe-west-1", "name": "aws-iso-e", "supportsDualStack": true, "supportsFIPS": true }, "regionRegex": "^eu\\-isoe\\-\\w+\\-\\d+$", "regions": { "aws-iso-e-global": { "description": "aws-iso-e global region" }, "eu-isoe-west-1": { "description": "EU ISOE West" } } }, { "id": "aws-iso-f", "outputs": { "dnsSuffix": "csp.hci.ic.gov", "dualStackDnsSuffix": "api.aws.hci.ic.gov", "implicitGlobalRegion": "us-isof-south-1", "name": "aws-iso-f", "supportsDualStack": true, "supportsFIPS": true }, "regionRegex": "^us\\-isof\\-\\w+\\-\\d+$", "regions": { "aws-iso-f-global": { "description": "aws-iso-f global region" }, "us-isof-east-1": { "description": "US ISOF EAST" }, "us-isof-south-1": { "description": "US ISOF SOUTH" } } }, { "id": "aws-us-gov", "outputs": { "dnsSuffix": "amazonaws.com", "dualStackDnsSuffix": "api.aws", "implicitGlobalRegion": "us-gov-west-1", "name": "aws-us-gov", "supportsDualStack": true, "supportsFIPS": true }, "regionRegex": "^us\\-gov\\-\\w+\\-\\d+$", "regions": { "aws-us-gov-global": { "description": "aws-us-gov global region" }, "us-gov-east-1": { "description": "AWS GovCloud (US-East)" }, "us-gov-west-1": { "description": "AWS GovCloud (US-West)" } } }];
const partitionsInfo = {
  partitions
};
let selectedPartitionsInfo = partitionsInfo;
const partition = (value) => {
  const { partitions: partitions2 } = selectedPartitionsInfo;
  for (const partition2 of partitions2) {
    const { regions, outputs } = partition2;
    for (const [region, regionData] of Object.entries(regions)) {
      if (region === value) {
        return {
          ...outputs,
          ...regionData
        };
      }
    }
  }
  for (const partition2 of partitions2) {
    const { regionRegex, outputs } = partition2;
    if (new RegExp(regionRegex).test(value)) {
      return {
        ...outputs
      };
    }
  }
  const DEFAULT_PARTITION = partitions2.find((partition2) => partition2.id === "aws");
  if (!DEFAULT_PARTITION) {
    throw new Error("Provided region was not found in the partition array or regex, and default partition with id 'aws' doesn't exist.");
  }
  return {
    ...DEFAULT_PARTITION.outputs
  };
};
const awsEndpointFunctions = {
  isVirtualHostableS3Bucket,
  parseArn,
  partition
};
customEndpointFunctions.aws = awsEndpointFunctions;
var RETRY_MODES;
(function(RETRY_MODES2) {
  RETRY_MODES2["STANDARD"] = "standard";
  RETRY_MODES2["ADAPTIVE"] = "adaptive";
})(RETRY_MODES || (RETRY_MODES = {}));
const DEFAULT_MAX_ATTEMPTS = 3;
const DEFAULT_RETRY_MODE = RETRY_MODES.STANDARD;
const THROTTLING_ERROR_CODES = [
  "BandwidthLimitExceeded",
  "EC2ThrottledException",
  "LimitExceededException",
  "PriorRequestNotComplete",
  "ProvisionedThroughputExceededException",
  "RequestLimitExceeded",
  "RequestThrottled",
  "RequestThrottledException",
  "SlowDown",
  "ThrottledException",
  "Throttling",
  "ThrottlingException",
  "TooManyRequestsException",
  "TransactionInProgressException"
];
const TRANSIENT_ERROR_CODES = ["TimeoutError", "RequestTimeout", "RequestTimeoutException"];
const TRANSIENT_ERROR_STATUS_CODES = [500, 502, 503, 504];
const NODEJS_TIMEOUT_ERROR_CODES = ["ECONNRESET", "ECONNREFUSED", "EPIPE", "ETIMEDOUT"];
const NODEJS_NETWORK_ERROR_CODES = ["EHOSTUNREACH", "ENETUNREACH", "ENOTFOUND"];
const isRetryableByTrait = (error) => error?.$retryable !== void 0;
const isClockSkewCorrectedError = (error) => error.$metadata?.clockSkewCorrected;
const isBrowserNetworkError = (error) => {
  const errorMessages = /* @__PURE__ */ new Set([
    "Failed to fetch",
    "NetworkError when attempting to fetch resource",
    "The Internet connection appears to be offline",
    "Load failed",
    "Network request failed"
  ]);
  const isValid = error && error instanceof TypeError;
  if (!isValid) {
    return false;
  }
  return errorMessages.has(error.message);
};
const isThrottlingError = (error) => error.$metadata?.httpStatusCode === 429 || THROTTLING_ERROR_CODES.includes(error.name) || error.$retryable?.throttling == true;
const isTransientError = (error, depth = 0) => isRetryableByTrait(error) || isClockSkewCorrectedError(error) || TRANSIENT_ERROR_CODES.includes(error.name) || NODEJS_TIMEOUT_ERROR_CODES.includes(error?.code || "") || NODEJS_NETWORK_ERROR_CODES.includes(error?.code || "") || TRANSIENT_ERROR_STATUS_CODES.includes(error.$metadata?.httpStatusCode || 0) || isBrowserNetworkError(error) || error.cause !== void 0 && depth <= 10 && isTransientError(error.cause, depth + 1);
const isServerError = (error) => {
  if (error.$metadata?.httpStatusCode !== void 0) {
    const statusCode = error.$metadata.httpStatusCode;
    if (500 <= statusCode && statusCode <= 599 && !isTransientError(error)) {
      return true;
    }
    return false;
  }
  return false;
};
class DefaultRateLimiter {
  static setTimeoutFn = setTimeout;
  beta;
  minCapacity;
  minFillRate;
  scaleConstant;
  smooth;
  enabled = false;
  availableTokens = 0;
  lastMaxRate = 0;
  measuredTxRate = 0;
  requestCount = 0;
  fillRate;
  lastThrottleTime;
  lastTimestamp = 0;
  lastTxRateBucket;
  maxCapacity;
  timeWindow = 0;
  constructor(options) {
    this.beta = options?.beta ?? 0.7;
    this.minCapacity = options?.minCapacity ?? 1;
    this.minFillRate = options?.minFillRate ?? 0.5;
    this.scaleConstant = options?.scaleConstant ?? 0.4;
    this.smooth = options?.smooth ?? 0.8;
    this.lastThrottleTime = this.getCurrentTimeInSeconds();
    this.lastTxRateBucket = Math.floor(this.getCurrentTimeInSeconds());
    this.fillRate = this.minFillRate;
    this.maxCapacity = this.minCapacity;
  }
  async getSendToken() {
    return this.acquireTokenBucket(1);
  }
  updateClientSendingRate(response) {
    let calculatedRate;
    this.updateMeasuredRate();
    const retryErrorInfo = response;
    const isThrottling = retryErrorInfo?.errorType === "THROTTLING" || isThrottlingError(retryErrorInfo?.error ?? response);
    if (isThrottling) {
      const rateToUse = !this.enabled ? this.measuredTxRate : Math.min(this.measuredTxRate, this.fillRate);
      this.lastMaxRate = rateToUse;
      this.calculateTimeWindow();
      this.lastThrottleTime = this.getCurrentTimeInSeconds();
      calculatedRate = this.cubicThrottle(rateToUse);
      this.enableTokenBucket();
    } else {
      this.calculateTimeWindow();
      calculatedRate = this.cubicSuccess(this.getCurrentTimeInSeconds());
    }
    const newRate = Math.min(calculatedRate, 2 * this.measuredTxRate);
    this.updateTokenBucketRate(newRate);
  }
  getCurrentTimeInSeconds() {
    return Date.now() / 1e3;
  }
  async acquireTokenBucket(amount) {
    if (!this.enabled) {
      return;
    }
    this.refillTokenBucket();
    if (amount > this.availableTokens) {
      const delay = (amount - this.availableTokens) / this.fillRate * 1e3;
      await new Promise((resolve) => DefaultRateLimiter.setTimeoutFn(resolve, delay));
    }
    this.availableTokens = this.availableTokens - amount;
  }
  refillTokenBucket() {
    const timestamp = this.getCurrentTimeInSeconds();
    if (!this.lastTimestamp) {
      this.lastTimestamp = timestamp;
      return;
    }
    const fillAmount = (timestamp - this.lastTimestamp) * this.fillRate;
    this.availableTokens = Math.min(this.maxCapacity, this.availableTokens + fillAmount);
    this.lastTimestamp = timestamp;
  }
  calculateTimeWindow() {
    this.timeWindow = this.getPrecise(Math.pow(this.lastMaxRate * (1 - this.beta) / this.scaleConstant, 1 / 3));
  }
  cubicThrottle(rateToUse) {
    return this.getPrecise(rateToUse * this.beta);
  }
  cubicSuccess(timestamp) {
    return this.getPrecise(this.scaleConstant * Math.pow(timestamp - this.lastThrottleTime - this.timeWindow, 3) + this.lastMaxRate);
  }
  enableTokenBucket() {
    this.enabled = true;
  }
  updateTokenBucketRate(newRate) {
    this.refillTokenBucket();
    this.fillRate = Math.max(newRate, this.minFillRate);
    this.maxCapacity = Math.max(newRate, this.minCapacity);
    this.availableTokens = Math.min(this.availableTokens, this.maxCapacity);
  }
  updateMeasuredRate() {
    const t8 = this.getCurrentTimeInSeconds();
    const timeBucket = Math.floor(t8 * 2) / 2;
    this.requestCount++;
    if (timeBucket > this.lastTxRateBucket) {
      const currentRate = this.requestCount / (timeBucket - this.lastTxRateBucket);
      this.measuredTxRate = this.getPrecise(currentRate * this.smooth + this.measuredTxRate * (1 - this.smooth));
      this.requestCount = 0;
      this.lastTxRateBucket = timeBucket;
    }
  }
  getPrecise(num) {
    return parseFloat(num.toFixed(8));
  }
}
const MAXIMUM_RETRY_DELAY = 20 * 1e3;
const INITIAL_RETRY_TOKENS = 500;
const NO_RETRY_INCREMENT = 1;
const INVOCATION_ID_HEADER = "amz-sdk-invocation-id";
const REQUEST_HEADER = "amz-sdk-request";
class Retry {
  static v2026 = typeof process !== "undefined" && process.env?.SMITHY_NEW_RETRIES_2026 === "true";
  static delay() {
    return Retry.v2026 ? 50 : 100;
  }
  static throttlingDelay() {
    return Retry.v2026 ? 1e3 : 500;
  }
  static cost() {
    return Retry.v2026 ? 14 : 5;
  }
  static throttlingCost() {
    return Retry.v2026 ? 5 : 10;
  }
  static modifiedCostType() {
    return Retry.v2026 ? "THROTTLING" : "TRANSIENT";
  }
}
class DefaultRetryBackoffStrategy {
  x = Retry.delay();
  computeNextBackoffDelay(i2) {
    const b2 = Math.random();
    const r2 = 2;
    const t_i = b2 * Math.min(this.x * r2 ** i2, MAXIMUM_RETRY_DELAY);
    return Math.floor(t_i);
  }
  setDelayBase(delay) {
    this.x = delay;
  }
}
class DefaultRetryToken {
  delay;
  count;
  cost;
  longPoll;
  constructor(delay, count, cost, longPoll) {
    this.delay = delay;
    this.count = count;
    this.cost = cost;
    this.longPoll = longPoll;
  }
  getRetryCount() {
    return this.count;
  }
  getRetryDelay() {
    return Math.min(MAXIMUM_RETRY_DELAY, this.delay);
  }
  getRetryCost() {
    return this.cost;
  }
  isLongPoll() {
    return this.longPoll;
  }
}
class StandardRetryStrategy {
  mode = RETRY_MODES.STANDARD;
  capacity = INITIAL_RETRY_TOKENS;
  retryBackoffStrategy;
  maxAttemptsProvider;
  baseDelay;
  constructor(arg1) {
    if (typeof arg1 === "number") {
      this.maxAttemptsProvider = async () => arg1;
    } else if (typeof arg1 === "function") {
      this.maxAttemptsProvider = arg1;
    } else if (arg1 && typeof arg1 === "object") {
      this.maxAttemptsProvider = async () => arg1.maxAttempts;
      this.baseDelay = arg1.baseDelay;
      this.retryBackoffStrategy = arg1.backoff;
    }
    this.maxAttemptsProvider ??= async () => DEFAULT_MAX_ATTEMPTS;
    this.baseDelay ??= Retry.delay();
    this.retryBackoffStrategy ??= new DefaultRetryBackoffStrategy();
  }
  async acquireInitialRetryToken(retryTokenScope) {
    return new DefaultRetryToken(Retry.delay(), 0, void 0, Retry.v2026 && retryTokenScope.includes(":longpoll"));
  }
  async refreshRetryTokenForRetry(token, errorInfo) {
    const maxAttempts = await this.getMaxAttempts();
    const shouldRetry = this.shouldRetry(token, errorInfo, maxAttempts);
    if (shouldRetry || token.isLongPoll?.()) {
      const errorType = errorInfo.errorType;
      this.retryBackoffStrategy.setDelayBase(errorType === "THROTTLING" ? Retry.throttlingDelay() : this.baseDelay);
      const delayFromErrorType = this.retryBackoffStrategy.computeNextBackoffDelay(token.getRetryCount());
      let retryDelay = delayFromErrorType;
      if (errorInfo.retryAfterHint instanceof Date) {
        retryDelay = Math.max(delayFromErrorType, Math.min(errorInfo.retryAfterHint.getTime() - Date.now(), delayFromErrorType + 5e3));
      }
      if (!shouldRetry) {
        throw Object.assign(new Error("No retry token available"), { $backoff: Retry.v2026 ? retryDelay : 0 });
      } else {
        const capacityCost = this.getCapacityCost(errorType);
        this.capacity -= capacityCost;
        return new DefaultRetryToken(retryDelay, token.getRetryCount() + 1, capacityCost, token.isLongPoll?.() ?? false);
      }
    }
    throw new Error("No retry token available");
  }
  recordSuccess(token) {
    this.capacity = Math.min(INITIAL_RETRY_TOKENS, this.capacity + (token.getRetryCost() ?? NO_RETRY_INCREMENT));
  }
  getCapacity() {
    return this.capacity;
  }
  async getMaxAttempts() {
    try {
      return await this.maxAttemptsProvider();
    } catch (error) {
      console.warn(`Max attempts provider could not resolve. Using default of ${DEFAULT_MAX_ATTEMPTS}`);
      return DEFAULT_MAX_ATTEMPTS;
    }
  }
  shouldRetry(tokenToRenew, errorInfo, maxAttempts) {
    const attempts = tokenToRenew.getRetryCount() + 1;
    return attempts < maxAttempts && this.capacity >= this.getCapacityCost(errorInfo.errorType) && this.isRetryableError(errorInfo.errorType);
  }
  getCapacityCost(errorType) {
    return errorType === Retry.modifiedCostType() ? Retry.throttlingCost() : Retry.cost();
  }
  isRetryableError(errorType) {
    return errorType === "THROTTLING" || errorType === "TRANSIENT";
  }
  async maxAttempts() {
    return this.maxAttemptsProvider();
  }
}
class AdaptiveRetryStrategy {
  mode = RETRY_MODES.ADAPTIVE;
  rateLimiter;
  standardRetryStrategy;
  constructor(maxAttemptsProvider, options) {
    const { rateLimiter } = options ?? {};
    this.rateLimiter = rateLimiter ?? new DefaultRateLimiter();
    this.standardRetryStrategy = options ? new StandardRetryStrategy({
      maxAttempts: typeof maxAttemptsProvider === "number" ? maxAttemptsProvider : 3,
      ...options
    }) : new StandardRetryStrategy(maxAttemptsProvider);
  }
  async acquireInitialRetryToken(retryTokenScope) {
    await this.rateLimiter.getSendToken();
    return this.standardRetryStrategy.acquireInitialRetryToken(retryTokenScope);
  }
  async refreshRetryTokenForRetry(tokenToRenew, errorInfo) {
    this.rateLimiter.updateClientSendingRate(errorInfo);
    return this.standardRetryStrategy.refreshRetryTokenForRetry(tokenToRenew, errorInfo);
  }
  recordSuccess(token) {
    this.rateLimiter.updateClientSendingRate({});
    this.standardRetryStrategy.recordSuccess(token);
  }
  async maxAttemptsProvider() {
    return this.standardRetryStrategy.maxAttempts();
  }
}
const ACCOUNT_ID_ENDPOINT_REGEX = /\d{12}\.ddb/;
async function checkFeatures(context, config, args) {
  const request2 = args.request;
  if (request2?.headers?.["smithy-protocol"] === "rpc-v2-cbor") {
    setFeature$1(context, "PROTOCOL_RPC_V2_CBOR", "M");
  }
  if (typeof config.retryStrategy === "function") {
    const retryStrategy = await config.retryStrategy();
    if (typeof retryStrategy.mode === "string") {
      switch (retryStrategy.mode) {
        case RETRY_MODES.ADAPTIVE:
          setFeature$1(context, "RETRY_MODE_ADAPTIVE", "F");
          break;
        case RETRY_MODES.STANDARD:
          setFeature$1(context, "RETRY_MODE_STANDARD", "E");
          break;
      }
    }
  }
  if (typeof config.accountIdEndpointMode === "function") {
    const endpointV2 = context.endpointV2;
    if (String(endpointV2?.url?.hostname).match(ACCOUNT_ID_ENDPOINT_REGEX)) {
      setFeature$1(context, "ACCOUNT_ID_ENDPOINT", "O");
    }
    switch (await config.accountIdEndpointMode?.()) {
      case "disabled":
        setFeature$1(context, "ACCOUNT_ID_MODE_DISABLED", "Q");
        break;
      case "preferred":
        setFeature$1(context, "ACCOUNT_ID_MODE_PREFERRED", "P");
        break;
      case "required":
        setFeature$1(context, "ACCOUNT_ID_MODE_REQUIRED", "R");
        break;
    }
  }
  const identity = context.__smithy_context?.selectedHttpAuthScheme?.identity;
  if (identity?.$source) {
    const credentials = identity;
    if (credentials.accountId) {
      setFeature$1(context, "RESOLVED_ACCOUNT_ID", "T");
    }
    for (const [key, value] of Object.entries(credentials.$source ?? {})) {
      setFeature$1(context, key, value);
    }
  }
}
const USER_AGENT = "user-agent";
const X_AMZ_USER_AGENT = "x-amz-user-agent";
const SPACE = " ";
const UA_NAME_SEPARATOR = "/";
const UA_NAME_ESCAPE_REGEX = /[^!$%&'*+\-.^_`|~\w]/g;
const UA_VALUE_ESCAPE_REGEX = /[^!$%&'*+\-.^_`|~\w#]/g;
const UA_ESCAPE_CHAR = "-";
const BYTE_LIMIT = 1024;
function encodeFeatures(features) {
  let buffer = "";
  for (const key in features) {
    const val = features[key];
    if (buffer.length + val.length + 1 <= BYTE_LIMIT) {
      if (buffer.length) {
        buffer += "," + val;
      } else {
        buffer += val;
      }
      continue;
    }
    break;
  }
  return buffer;
}
const userAgentMiddleware = (options) => (next, context) => async (args) => {
  const { request: request2 } = args;
  if (!HttpRequest.isInstance(request2)) {
    return next(args);
  }
  const { headers } = request2;
  const userAgent = context?.userAgent?.map(escapeUserAgent) || [];
  const defaultUserAgent = (await options.defaultUserAgentProvider()).map(escapeUserAgent);
  await checkFeatures(context, options, args);
  const awsContext = context;
  defaultUserAgent.push(`m/${encodeFeatures(Object.assign({}, context.__smithy_context?.features, awsContext.__aws_sdk_context?.features))}`);
  const customUserAgent = options?.customUserAgent?.map(escapeUserAgent) || [];
  const appId = await options.userAgentAppId();
  if (appId) {
    defaultUserAgent.push(escapeUserAgent([`app`, `${appId}`]));
  }
  const sdkUserAgentValue = [].concat([...defaultUserAgent, ...userAgent, ...customUserAgent]).join(SPACE);
  const normalUAValue = [
    ...defaultUserAgent.filter((section) => section.startsWith("aws-sdk-")),
    ...customUserAgent
  ].join(SPACE);
  if (options.runtime !== "browser") {
    if (normalUAValue) {
      headers[X_AMZ_USER_AGENT] = headers[X_AMZ_USER_AGENT] ? `${headers[USER_AGENT]} ${normalUAValue}` : normalUAValue;
    }
    headers[USER_AGENT] = sdkUserAgentValue;
  } else {
    headers[X_AMZ_USER_AGENT] = sdkUserAgentValue;
  }
  return next({
    ...args,
    request: request2
  });
};
const escapeUserAgent = (userAgentPair) => {
  const name = userAgentPair[0].split(UA_NAME_SEPARATOR).map((part) => part.replace(UA_NAME_ESCAPE_REGEX, UA_ESCAPE_CHAR)).join(UA_NAME_SEPARATOR);
  const version2 = userAgentPair[1]?.replace(UA_VALUE_ESCAPE_REGEX, UA_ESCAPE_CHAR);
  const prefixSeparatorIndex = name.indexOf(UA_NAME_SEPARATOR);
  const prefix = name.substring(0, prefixSeparatorIndex);
  let uaName = name.substring(prefixSeparatorIndex + 1);
  if (prefix === "api") {
    uaName = uaName.toLowerCase();
  }
  return [prefix, uaName, version2].filter((item) => item && item.length > 0).reduce((acc, item, index) => {
    switch (index) {
      case 0:
        return item;
      case 1:
        return `${acc}/${item}`;
      default:
        return `${acc}#${item}`;
    }
  }, "");
};
const getUserAgentMiddlewareOptions = {
  name: "getUserAgentMiddleware",
  step: "build",
  priority: "low",
  tags: ["SET_USER_AGENT", "USER_AGENT"],
  override: true
};
const getUserAgentPlugin = (config) => ({
  applyToStack: (clientStack) => {
    clientStack.add(userAgentMiddleware(config), getUserAgentMiddlewareOptions);
  }
});
const ENV_USE_DUALSTACK_ENDPOINT = "AWS_USE_DUALSTACK_ENDPOINT";
const CONFIG_USE_DUALSTACK_ENDPOINT = "use_dualstack_endpoint";
const NODE_USE_DUALSTACK_ENDPOINT_CONFIG_OPTIONS = {
  environmentVariableSelector: (env2) => booleanSelector(env2, ENV_USE_DUALSTACK_ENDPOINT, SelectorType.ENV),
  configFileSelector: (profile) => booleanSelector(profile, CONFIG_USE_DUALSTACK_ENDPOINT, SelectorType.CONFIG),
  default: false
};
const ENV_USE_FIPS_ENDPOINT = "AWS_USE_FIPS_ENDPOINT";
const CONFIG_USE_FIPS_ENDPOINT = "use_fips_endpoint";
const NODE_USE_FIPS_ENDPOINT_CONFIG_OPTIONS = {
  environmentVariableSelector: (env2) => booleanSelector(env2, ENV_USE_FIPS_ENDPOINT, SelectorType.ENV),
  configFileSelector: (profile) => booleanSelector(profile, CONFIG_USE_FIPS_ENDPOINT, SelectorType.CONFIG),
  default: false
};
const REGION_ENV_NAME = "AWS_REGION";
const REGION_INI_NAME = "region";
const NODE_REGION_CONFIG_OPTIONS = {
  environmentVariableSelector: (env2) => env2[REGION_ENV_NAME],
  configFileSelector: (profile) => profile[REGION_INI_NAME],
  default: () => {
    throw new Error("Region is missing");
  }
};
const NODE_REGION_CONFIG_FILE_OPTIONS = {
  preferredFile: "credentials"
};
const validRegions = /* @__PURE__ */ new Set();
const checkRegion = (region, check = isValidHostLabel) => {
  if (!validRegions.has(region) && !check(region)) {
    if (region === "*") {
      console.warn(`@smithy/config-resolver WARN - Please use the caller region instead of "*". See "sigv4a" in https://github.com/aws/aws-sdk-js-v3/blob/main/supplemental-docs/CLIENTS.md.`);
    } else {
      throw new Error(`Region not accepted: region="${region}" is not a valid hostname component.`);
    }
  } else {
    validRegions.add(region);
  }
};
const isFipsRegion = (region) => typeof region === "string" && (region.startsWith("fips-") || region.endsWith("-fips"));
const getRealRegion = (region) => isFipsRegion(region) ? ["fips-aws-global", "aws-fips"].includes(region) ? "us-east-1" : region.replace(/fips-(dkr-|prod-)?|-fips/, "") : region;
const resolveRegionConfig = (input) => {
  const { region, useFipsEndpoint } = input;
  if (!region) {
    throw new Error("Region is missing");
  }
  return Object.assign(input, {
    region: async () => {
      const providedRegion = typeof region === "function" ? await region() : region;
      const realRegion = getRealRegion(providedRegion);
      checkRegion(realRegion);
      return realRegion;
    },
    useFipsEndpoint: async () => {
      const providedRegion = typeof region === "string" ? region : await region();
      if (isFipsRegion(providedRegion)) {
        return true;
      }
      return typeof useFipsEndpoint !== "function" ? Promise.resolve(!!useFipsEndpoint) : useFipsEndpoint();
    }
  });
};
const resolveEventStreamSerdeConfig = (input) => Object.assign(input, {
  eventStreamMarshaller: input.eventStreamSerdeProvider(input)
});
const CONTENT_LENGTH_HEADER = "content-length";
function contentLengthMiddleware(bodyLengthChecker) {
  return (next) => async (args) => {
    const request2 = args.request;
    if (HttpRequest.isInstance(request2)) {
      const { body, headers } = request2;
      if (body && Object.keys(headers).map((str) => str.toLowerCase()).indexOf(CONTENT_LENGTH_HEADER) === -1) {
        try {
          const length = bodyLengthChecker(body);
          request2.headers = {
            ...request2.headers,
            [CONTENT_LENGTH_HEADER]: String(length)
          };
        } catch (error) {
        }
      }
    }
    return next({
      ...args,
      request: request2
    });
  };
}
const contentLengthMiddlewareOptions = {
  step: "build",
  tags: ["SET_CONTENT_LENGTH", "CONTENT_LENGTH"],
  name: "contentLengthMiddleware",
  override: true
};
const getContentLengthPlugin = (options) => ({
  applyToStack: (clientStack) => {
    clientStack.add(contentLengthMiddleware(options.bodyLengthChecker), contentLengthMiddlewareOptions);
  }
});
const resolveParamsForS3 = async (endpointParams) => {
  const bucket = endpointParams?.Bucket || "";
  if (typeof endpointParams.Bucket === "string") {
    endpointParams.Bucket = bucket.replace(/#/g, encodeURIComponent("#")).replace(/\?/g, encodeURIComponent("?"));
  }
  if (isArnBucketName(bucket)) {
    if (endpointParams.ForcePathStyle === true) {
      throw new Error("Path-style addressing cannot be used with ARN buckets");
    }
  } else if (!isDnsCompatibleBucketName(bucket) || bucket.indexOf(".") !== -1 && !String(endpointParams.Endpoint).startsWith("http:") || bucket.toLowerCase() !== bucket || bucket.length < 3) {
    endpointParams.ForcePathStyle = true;
  }
  if (endpointParams.DisableMultiRegionAccessPoints) {
    endpointParams.disableMultiRegionAccessPoints = true;
    endpointParams.DisableMRAP = true;
  }
  return endpointParams;
};
const DOMAIN_PATTERN = /^[a-z0-9][a-z0-9\.\-]{1,61}[a-z0-9]$/;
const IP_ADDRESS_PATTERN = /(\d+\.){3}\d+/;
const DOTS_PATTERN = /\.\./;
const isDnsCompatibleBucketName = (bucketName) => DOMAIN_PATTERN.test(bucketName) && !IP_ADDRESS_PATTERN.test(bucketName) && !DOTS_PATTERN.test(bucketName);
const isArnBucketName = (bucketName) => {
  const [arn, partition2, service, , , bucket] = bucketName.split(":");
  const isArn = arn === "arn" && bucketName.split(":").length >= 6;
  const isValidArn = Boolean(isArn && partition2 && service && bucket);
  if (isArn && !isValidArn) {
    throw new Error(`Invalid ARN: ${bucketName} was an invalid ARN.`);
  }
  return isValidArn;
};
const createConfigValueProvider = (configKey, canonicalEndpointParamKey, config, isClientContextParam = false) => {
  const configProvider = async () => {
    let configValue;
    if (isClientContextParam) {
      const clientContextParams = config.clientContextParams;
      const nestedValue = clientContextParams?.[configKey];
      configValue = nestedValue ?? config[configKey] ?? config[canonicalEndpointParamKey];
    } else {
      configValue = config[configKey] ?? config[canonicalEndpointParamKey];
    }
    if (typeof configValue === "function") {
      return configValue();
    }
    return configValue;
  };
  if (configKey === "credentialScope" || canonicalEndpointParamKey === "CredentialScope") {
    return async () => {
      const credentials = typeof config.credentials === "function" ? await config.credentials() : config.credentials;
      const configValue = credentials?.credentialScope ?? credentials?.CredentialScope;
      return configValue;
    };
  }
  if (configKey === "accountId" || canonicalEndpointParamKey === "AccountId") {
    return async () => {
      const credentials = typeof config.credentials === "function" ? await config.credentials() : config.credentials;
      const configValue = credentials?.accountId ?? credentials?.AccountId;
      return configValue;
    };
  }
  if (configKey === "endpoint" || canonicalEndpointParamKey === "endpoint") {
    return async () => {
      if (config.isCustomEndpoint === false) {
        return void 0;
      }
      const endpoint = await configProvider();
      if (endpoint && typeof endpoint === "object") {
        if ("url" in endpoint) {
          return endpoint.url.href;
        }
        if ("hostname" in endpoint) {
          const { protocol, hostname, port, path } = endpoint;
          return `${protocol}//${hostname}${port ? ":" + port : ""}${path}`;
        }
      }
      return endpoint;
    };
  }
  return configProvider;
};
class ProviderError extends Error {
  name = "ProviderError";
  tryNextLink;
  constructor(message, options = true) {
    let logger2;
    let tryNextLink = true;
    if (typeof options === "boolean") {
      logger2 = void 0;
      tryNextLink = options;
    } else if (options != null && typeof options === "object") {
      logger2 = options.logger;
      tryNextLink = options.tryNextLink ?? true;
    }
    super(message);
    this.tryNextLink = tryNextLink;
    Object.setPrototypeOf(this, ProviderError.prototype);
    logger2?.debug?.(`@smithy/property-provider ${tryNextLink ? "->" : "(!)"} ${message}`);
  }
  static from(error, options = true) {
    return Object.assign(new this(error.message, options), error);
  }
}
class CredentialsProviderError extends ProviderError {
  name = "CredentialsProviderError";
  constructor(message, options = true) {
    super(message, options);
    Object.setPrototypeOf(this, CredentialsProviderError.prototype);
  }
}
const chain = (...providers) => async () => {
  if (providers.length === 0) {
    throw new ProviderError("No providers in chain");
  }
  let lastProviderError;
  for (const provider of providers) {
    try {
      const credentials = await provider();
      return credentials;
    } catch (err) {
      lastProviderError = err;
      if (err?.tryNextLink) {
        continue;
      }
      throw err;
    }
  }
  throw lastProviderError;
};
const fromStatic$1 = (staticValue) => () => Promise.resolve(staticValue);
const memoize = (provider, isExpired, requiresRefresh) => {
  let resolved;
  let pending;
  let hasResult;
  let isConstant = false;
  const coalesceProvider = async () => {
    if (!pending) {
      pending = provider();
    }
    try {
      resolved = await pending;
      hasResult = true;
      isConstant = false;
    } finally {
      pending = void 0;
    }
    return resolved;
  };
  {
    return async (options) => {
      if (!hasResult || options?.forceRefresh) {
        resolved = await coalesceProvider();
      }
      return resolved;
    };
  }
};
function getSelectorName(functionString) {
  try {
    const constants = new Set(Array.from(functionString.match(/([A-Z_]){3,}/g) ?? []));
    constants.delete("CONFIG");
    constants.delete("CONFIG_PREFIX_SEPARATOR");
    constants.delete("ENV");
    return [...constants].join(", ");
  } catch (e2) {
    return functionString;
  }
}
const fromEnv$1 = (envVarSelector, options) => async () => {
  try {
    const config = envVarSelector(process.env, options);
    if (config === void 0) {
      throw new Error();
    }
    return config;
  } catch (e2) {
    throw new CredentialsProviderError(e2.message || `Not found in ENV: ${getSelectorName(envVarSelector.toString())}`, { logger: options?.logger });
  }
};
const homeDirCache = {};
const getHomeDirCacheKey = () => {
  if (process && process.geteuid) {
    return `${process.geteuid()}`;
  }
  return "DEFAULT";
};
const getHomeDir = () => {
  const { HOME, USERPROFILE, HOMEPATH, HOMEDRIVE = `C:${sep}` } = process.env;
  if (HOME)
    return HOME;
  if (USERPROFILE)
    return USERPROFILE;
  if (HOMEPATH)
    return `${HOMEDRIVE}${HOMEPATH}`;
  const homeDirCacheKey = getHomeDirCacheKey();
  if (!homeDirCache[homeDirCacheKey])
    homeDirCache[homeDirCacheKey] = homedir();
  return homeDirCache[homeDirCacheKey];
};
const ENV_PROFILE = "AWS_PROFILE";
const DEFAULT_PROFILE = "default";
const getProfileName = (init) => init.profile || process.env[ENV_PROFILE] || DEFAULT_PROFILE;
const CONFIG_PREFIX_SEPARATOR = ".";
const getConfigData = (data) => Object.entries(data).filter(([key]) => {
  const indexOfSeparator = key.indexOf(CONFIG_PREFIX_SEPARATOR);
  if (indexOfSeparator === -1) {
    return false;
  }
  return Object.values(IniSectionType).includes(key.substring(0, indexOfSeparator));
}).reduce((acc, [key, value]) => {
  const indexOfSeparator = key.indexOf(CONFIG_PREFIX_SEPARATOR);
  const updatedKey = key.substring(0, indexOfSeparator) === IniSectionType.PROFILE ? key.substring(indexOfSeparator + 1) : key;
  acc[updatedKey] = value;
  return acc;
}, {
  ...data.default && { default: data.default }
});
const ENV_CONFIG_PATH = "AWS_CONFIG_FILE";
const getConfigFilepath = () => process.env[ENV_CONFIG_PATH] || join(getHomeDir(), ".aws", "config");
const ENV_CREDENTIALS_PATH = "AWS_SHARED_CREDENTIALS_FILE";
const getCredentialsFilepath = () => process.env[ENV_CREDENTIALS_PATH] || join(getHomeDir(), ".aws", "credentials");
const prefixKeyRegex = /^([\w-]+)\s(["'])?([\w-@\+\.%:/]+)\2$/;
const profileNameBlockList = ["__proto__", "profile __proto__"];
const parseIni = (iniData) => {
  const map = {};
  let currentSection;
  let currentSubSection;
  for (const iniLine of iniData.split(/\r?\n/)) {
    const trimmedLine = iniLine.split(/(^|\s)[;#]/)[0].trim();
    const isSection = trimmedLine[0] === "[" && trimmedLine[trimmedLine.length - 1] === "]";
    if (isSection) {
      currentSection = void 0;
      currentSubSection = void 0;
      const sectionName = trimmedLine.substring(1, trimmedLine.length - 1);
      const matches = prefixKeyRegex.exec(sectionName);
      if (matches) {
        const [, prefix, , name] = matches;
        if (Object.values(IniSectionType).includes(prefix)) {
          currentSection = [prefix, name].join(CONFIG_PREFIX_SEPARATOR);
        }
      } else {
        currentSection = sectionName;
      }
      if (profileNameBlockList.includes(sectionName)) {
        throw new Error(`Found invalid profile name "${sectionName}"`);
      }
    } else if (currentSection) {
      const indexOfEqualsSign = trimmedLine.indexOf("=");
      if (![0, -1].includes(indexOfEqualsSign)) {
        const [name, value] = [
          trimmedLine.substring(0, indexOfEqualsSign).trim(),
          trimmedLine.substring(indexOfEqualsSign + 1).trim()
        ];
        if (value === "") {
          currentSubSection = name;
        } else {
          if (currentSubSection && iniLine.trimStart() === iniLine) {
            currentSubSection = void 0;
          }
          map[currentSection] = map[currentSection] || {};
          const key = currentSubSection ? [currentSubSection, name].join(CONFIG_PREFIX_SEPARATOR) : name;
          map[currentSection][key] = value;
        }
      }
    }
  }
  return map;
};
const filePromises = {};
const fileIntercept = {};
const readFile = (path, options) => {
  if (fileIntercept[path] !== void 0) {
    return fileIntercept[path];
  }
  if (!filePromises[path] || options?.ignoreCache) {
    filePromises[path] = readFile$1(path, "utf8");
  }
  return filePromises[path];
};
const swallowError = () => ({});
const loadSharedConfigFiles = async (init = {}) => {
  const { filepath = getCredentialsFilepath(), configFilepath = getConfigFilepath() } = init;
  const homeDir = getHomeDir();
  const relativeHomeDirPrefix = "~/";
  let resolvedFilepath = filepath;
  if (filepath.startsWith(relativeHomeDirPrefix)) {
    resolvedFilepath = join(homeDir, filepath.slice(2));
  }
  let resolvedConfigFilepath = configFilepath;
  if (configFilepath.startsWith(relativeHomeDirPrefix)) {
    resolvedConfigFilepath = join(homeDir, configFilepath.slice(2));
  }
  const parsedFiles = await Promise.all([
    readFile(resolvedConfigFilepath, {
      ignoreCache: init.ignoreCache
    }).then(parseIni).then(getConfigData).catch(swallowError),
    readFile(resolvedFilepath, {
      ignoreCache: init.ignoreCache
    }).then(parseIni).catch(swallowError)
  ]);
  return {
    configFile: parsedFiles[0],
    credentialsFile: parsedFiles[1]
  };
};
const fromSharedConfigFiles = (configSelector, { preferredFile = "config", ...init } = {}) => async () => {
  const profile = getProfileName(init);
  const { configFile, credentialsFile } = await loadSharedConfigFiles(init);
  const profileFromCredentials = credentialsFile[profile] || {};
  const profileFromConfig = configFile[profile] || {};
  const mergedProfile = preferredFile === "config" ? { ...profileFromCredentials, ...profileFromConfig } : { ...profileFromConfig, ...profileFromCredentials };
  try {
    const cfgFile = preferredFile === "config" ? configFile : credentialsFile;
    const configValue = configSelector(mergedProfile, cfgFile);
    if (configValue === void 0) {
      throw new Error();
    }
    return configValue;
  } catch (e2) {
    throw new CredentialsProviderError(e2.message || `Not found in config files w/ profile [${profile}]: ${getSelectorName(configSelector.toString())}`, { logger: init.logger });
  }
};
const isFunction = (func) => typeof func === "function";
const fromStatic = (defaultValue) => isFunction(defaultValue) ? async () => await defaultValue() : fromStatic$1(defaultValue);
const loadConfig = ({ environmentVariableSelector, configFileSelector, default: defaultValue }, configuration = {}) => {
  const { signingName, logger: logger2 } = configuration;
  const envOptions = { signingName, logger: logger2 };
  return memoize(chain(fromEnv$1(environmentVariableSelector, envOptions), fromSharedConfigFiles(configFileSelector, configuration), fromStatic(defaultValue)));
};
const ENV_ENDPOINT_URL = "AWS_ENDPOINT_URL";
const CONFIG_ENDPOINT_URL = "endpoint_url";
const getEndpointUrlConfig = (serviceId) => ({
  environmentVariableSelector: (env2) => {
    const serviceSuffixParts = serviceId.split(" ").map((w2) => w2.toUpperCase());
    const serviceEndpointUrl = env2[[ENV_ENDPOINT_URL, ...serviceSuffixParts].join("_")];
    if (serviceEndpointUrl)
      return serviceEndpointUrl;
    const endpointUrl = env2[ENV_ENDPOINT_URL];
    if (endpointUrl)
      return endpointUrl;
    return void 0;
  },
  configFileSelector: (profile, config) => {
    if (config && profile.services) {
      const servicesSection = config[["services", profile.services].join(CONFIG_PREFIX_SEPARATOR)];
      if (servicesSection) {
        const servicePrefixParts = serviceId.split(" ").map((w2) => w2.toLowerCase());
        const endpointUrl2 = servicesSection[[servicePrefixParts.join("_"), CONFIG_ENDPOINT_URL].join(CONFIG_PREFIX_SEPARATOR)];
        if (endpointUrl2)
          return endpointUrl2;
      }
    }
    const endpointUrl = profile[CONFIG_ENDPOINT_URL];
    if (endpointUrl)
      return endpointUrl;
    return void 0;
  },
  default: void 0
});
const getEndpointFromConfig = async (serviceId) => loadConfig(getEndpointUrlConfig(serviceId ?? ""))();
const toEndpointV1 = (endpoint) => {
  if (typeof endpoint === "object") {
    if ("url" in endpoint) {
      const v1Endpoint = parseUrl(endpoint.url);
      if (endpoint.headers) {
        v1Endpoint.headers = {};
        for (const [name, values] of Object.entries(endpoint.headers)) {
          v1Endpoint.headers[name.toLowerCase()] = values.join(", ");
        }
      }
      return v1Endpoint;
    }
    return endpoint;
  }
  return parseUrl(endpoint);
};
const getEndpointFromInstructions = async (commandInput, instructionsSupplier, clientConfig, context) => {
  if (!clientConfig.isCustomEndpoint) {
    let endpointFromConfig;
    if (clientConfig.serviceConfiguredEndpoint) {
      endpointFromConfig = await clientConfig.serviceConfiguredEndpoint();
    } else {
      endpointFromConfig = await getEndpointFromConfig(clientConfig.serviceId);
    }
    if (endpointFromConfig) {
      clientConfig.endpoint = () => Promise.resolve(toEndpointV1(endpointFromConfig));
      clientConfig.isCustomEndpoint = true;
    }
  }
  const endpointParams = await resolveParams(commandInput, instructionsSupplier, clientConfig);
  if (typeof clientConfig.endpointProvider !== "function") {
    throw new Error("config.endpointProvider is not set.");
  }
  const endpoint = clientConfig.endpointProvider(endpointParams, context);
  if (clientConfig.isCustomEndpoint && clientConfig.endpoint) {
    const customEndpoint = await clientConfig.endpoint();
    if (customEndpoint?.headers) {
      endpoint.headers ??= {};
      for (const [name, value] of Object.entries(customEndpoint.headers)) {
        endpoint.headers[name] = Array.isArray(value) ? value : [value];
      }
    }
  }
  return endpoint;
};
const resolveParams = async (commandInput, instructionsSupplier, clientConfig) => {
  const endpointParams = {};
  const instructions = instructionsSupplier?.getEndpointParameterInstructions?.() || {};
  for (const [name, instruction] of Object.entries(instructions)) {
    switch (instruction.type) {
      case "staticContextParams":
        endpointParams[name] = instruction.value;
        break;
      case "contextParams":
        endpointParams[name] = commandInput[instruction.name];
        break;
      case "clientContextParams":
      case "builtInParams":
        endpointParams[name] = await createConfigValueProvider(instruction.name, name, clientConfig, instruction.type !== "builtInParams")();
        break;
      case "operationContextParams":
        endpointParams[name] = instruction.get(commandInput);
        break;
      default:
        throw new Error("Unrecognized endpoint parameter instruction: " + JSON.stringify(instruction));
    }
  }
  if (Object.keys(instructions).length === 0) {
    Object.assign(endpointParams, clientConfig);
  }
  if (String(clientConfig.serviceId).toLowerCase() === "s3") {
    await resolveParamsForS3(endpointParams);
  }
  return endpointParams;
};
const endpointMiddleware = ({ config, instructions }) => {
  return (next, context) => async (args) => {
    if (config.isCustomEndpoint) {
      setFeature(context, "ENDPOINT_OVERRIDE", "N");
    }
    const endpoint = await getEndpointFromInstructions(args.input, {
      getEndpointParameterInstructions() {
        return instructions;
      }
    }, { ...config }, context);
    context.endpointV2 = endpoint;
    context.authSchemes = endpoint.properties?.authSchemes;
    const authScheme = context.authSchemes?.[0];
    if (authScheme) {
      context["signing_region"] = authScheme.signingRegion;
      context["signing_service"] = authScheme.signingName;
      const smithyContext = getSmithyContext(context);
      const httpAuthOption = smithyContext?.selectedHttpAuthScheme?.httpAuthOption;
      if (httpAuthOption) {
        httpAuthOption.signingProperties = Object.assign(httpAuthOption.signingProperties || {}, {
          signing_region: authScheme.signingRegion,
          signingRegion: authScheme.signingRegion,
          signing_service: authScheme.signingName,
          signingName: authScheme.signingName,
          signingRegionSet: authScheme.signingRegionSet
        }, authScheme.properties);
      }
    }
    return next({
      ...args
    });
  };
};
const serializerMiddlewareOption = {
  name: "serializerMiddleware"
};
const endpointMiddlewareOptions = {
  step: "serialize",
  tags: ["ENDPOINT_PARAMETERS", "ENDPOINT_V2", "ENDPOINT"],
  name: "endpointV2Middleware",
  override: true,
  relation: "before",
  toMiddleware: serializerMiddlewareOption.name
};
const getEndpointPlugin = (config, instructions) => ({
  applyToStack: (clientStack) => {
    clientStack.addRelativeTo(endpointMiddleware({
      config,
      instructions
    }), endpointMiddlewareOptions);
  }
});
const resolveEndpointConfig = (input) => {
  const tls = input.tls ?? true;
  const { endpoint, useDualstackEndpoint, useFipsEndpoint } = input;
  const customEndpointProvider = endpoint != null ? async () => toEndpointV1(await normalizeProvider$1(endpoint)()) : void 0;
  const isCustomEndpoint = !!endpoint;
  const resolvedConfig = Object.assign(input, {
    endpoint: customEndpointProvider,
    tls,
    isCustomEndpoint,
    useDualstackEndpoint: normalizeProvider$1(useDualstackEndpoint ?? false),
    useFipsEndpoint: normalizeProvider$1(useFipsEndpoint ?? false)
  });
  let configuredEndpointPromise = void 0;
  resolvedConfig.serviceConfiguredEndpoint = async () => {
    if (input.serviceId && !configuredEndpointPromise) {
      configuredEndpointPromise = getEndpointFromConfig(input.serviceId);
    }
    return configuredEndpointPromise;
  };
  return resolvedConfig;
};
const asSdkError = (error) => {
  if (error instanceof Error)
    return error;
  if (error instanceof Object)
    return Object.assign(new Error(), error);
  if (typeof error === "string")
    return new Error(error);
  return new Error(`AWS SDK error wrapper for ${error}`);
};
const ENV_MAX_ATTEMPTS = "AWS_MAX_ATTEMPTS";
const CONFIG_MAX_ATTEMPTS = "max_attempts";
const NODE_MAX_ATTEMPT_CONFIG_OPTIONS = {
  environmentVariableSelector: (env2) => {
    const value = env2[ENV_MAX_ATTEMPTS];
    if (!value)
      return void 0;
    const maxAttempt = parseInt(value);
    if (Number.isNaN(maxAttempt)) {
      throw new Error(`Environment variable ${ENV_MAX_ATTEMPTS} mast be a number, got "${value}"`);
    }
    return maxAttempt;
  },
  configFileSelector: (profile) => {
    const value = profile[CONFIG_MAX_ATTEMPTS];
    if (!value)
      return void 0;
    const maxAttempt = parseInt(value);
    if (Number.isNaN(maxAttempt)) {
      throw new Error(`Shared config file entry ${CONFIG_MAX_ATTEMPTS} mast be a number, got "${value}"`);
    }
    return maxAttempt;
  },
  default: DEFAULT_MAX_ATTEMPTS
};
const resolveRetryConfig = (input) => {
  const { retryStrategy, retryMode } = input;
  const maxAttempts = normalizeProvider$1(input.maxAttempts ?? DEFAULT_MAX_ATTEMPTS);
  let controller = retryStrategy ? Promise.resolve(retryStrategy) : void 0;
  const getDefault = async () => await normalizeProvider$1(retryMode)() === RETRY_MODES.ADAPTIVE ? new AdaptiveRetryStrategy(maxAttempts) : new StandardRetryStrategy(maxAttempts);
  return Object.assign(input, {
    maxAttempts,
    retryStrategy: () => controller ??= getDefault()
  });
};
const ENV_RETRY_MODE = "AWS_RETRY_MODE";
const CONFIG_RETRY_MODE = "retry_mode";
const NODE_RETRY_MODE_CONFIG_OPTIONS = {
  environmentVariableSelector: (env2) => env2[ENV_RETRY_MODE],
  configFileSelector: (profile) => profile[CONFIG_RETRY_MODE],
  default: DEFAULT_RETRY_MODE
};
const isStreamingPayload = (request2) => request2?.body instanceof Readable$1 || typeof ReadableStream !== "undefined" && request2?.body instanceof ReadableStream;
function parseRetryAfterHeader(response, logger2) {
  if (!HttpResponse.isInstance(response)) {
    return;
  }
  for (const header of Object.keys(response.headers)) {
    const h2 = header.toLowerCase();
    if (h2 === "retry-after") {
      const retryAfter = response.headers[header];
      let retryAfterSeconds = NaN;
      if (retryAfter.endsWith("GMT")) {
        try {
          const date2 = parseRfc7231DateTime(retryAfter);
          retryAfterSeconds = (date2.getTime() - Date.now()) / 1e3;
        } catch (e2) {
          logger2?.trace?.("Failed to parse retry-after header");
          logger2?.trace?.(e2);
        }
      } else if (retryAfter.match(/ GMT, ((\d+)|(\d+\.\d+))$/)) {
        retryAfterSeconds = Number(retryAfter.match(/ GMT, ([\d.]+)$/)?.[1]);
      } else if (retryAfter.match(/^((\d+)|(\d+\.\d+))$/)) {
        retryAfterSeconds = Number(retryAfter);
      } else if (Date.parse(retryAfter) >= Date.now()) {
        retryAfterSeconds = (Date.parse(retryAfter) - Date.now()) / 1e3;
      }
      if (isNaN(retryAfterSeconds)) {
        return;
      }
      return new Date(Date.now() + retryAfterSeconds * 1e3);
    } else if (h2 === "x-amz-retry-after") {
      const v2 = response.headers[header];
      const backoffMilliseconds = Number(v2);
      if (isNaN(backoffMilliseconds)) {
        logger2?.trace?.(`Failed to parse x-amz-retry-after=${v2}`);
        return;
      }
      return new Date(Date.now() + backoffMilliseconds);
    }
  }
}
const retryMiddleware = (options) => (next, context) => async (args) => {
  let retryStrategy = await options.retryStrategy();
  const maxAttempts = await options.maxAttempts();
  if (isRetryStrategyV2(retryStrategy)) {
    retryStrategy = retryStrategy;
    let retryToken = await retryStrategy.acquireInitialRetryToken((context["partition_id"] ?? "") + (context.__retryLongPoll ? ":longpoll" : ""));
    let lastError = new Error();
    let attempts = 0;
    let totalRetryDelay = 0;
    const { request: request2 } = args;
    const isRequest = HttpRequest.isInstance(request2);
    if (isRequest) {
      request2.headers[INVOCATION_ID_HEADER] = v4();
    }
    while (true) {
      try {
        if (isRequest) {
          request2.headers[REQUEST_HEADER] = `attempt=${attempts + 1}; max=${maxAttempts}`;
        }
        const { response, output } = await next(args);
        retryStrategy.recordSuccess(retryToken);
        output.$metadata.attempts = attempts + 1;
        output.$metadata.totalRetryDelay = totalRetryDelay;
        return { response, output };
      } catch (e2) {
        const retryErrorInfo = getRetryErrorInfo(e2, options.logger);
        lastError = asSdkError(e2);
        if (isRequest && isStreamingPayload(request2)) {
          (context.logger instanceof NoOpLogger ? console : context.logger)?.warn("An error was encountered in a non-retryable streaming request.");
          throw lastError;
        }
        try {
          retryToken = await retryStrategy.refreshRetryTokenForRetry(retryToken, retryErrorInfo);
        } catch (refreshError) {
          if (typeof refreshError.$backoff === "number") {
            await cooldown(refreshError.$backoff);
          }
          if (!lastError.$metadata) {
            lastError.$metadata = {};
          }
          lastError.$metadata.attempts = attempts + 1;
          lastError.$metadata.totalRetryDelay = totalRetryDelay;
          throw lastError;
        }
        attempts = retryToken.getRetryCount();
        const delay = retryToken.getRetryDelay();
        totalRetryDelay += delay;
        await cooldown(delay);
      }
    }
  } else {
    retryStrategy = retryStrategy;
    if (retryStrategy?.mode) {
      context.userAgent = [...context.userAgent || [], ["cfg/retry-mode", retryStrategy.mode]];
    }
    return retryStrategy.retry(next, args);
  }
};
const cooldown = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const isRetryStrategyV2 = (retryStrategy) => typeof retryStrategy.acquireInitialRetryToken !== "undefined" && typeof retryStrategy.refreshRetryTokenForRetry !== "undefined" && typeof retryStrategy.recordSuccess !== "undefined";
const getRetryErrorInfo = (error, logger2) => {
  const errorInfo = {
    error,
    errorType: getRetryErrorType(error)
  };
  const retryAfterHint = parseRetryAfterHeader(error.$response, logger2);
  if (retryAfterHint) {
    errorInfo.retryAfterHint = retryAfterHint;
  }
  return errorInfo;
};
const getRetryErrorType = (error) => {
  if (isThrottlingError(error))
    return "THROTTLING";
  if (isTransientError(error))
    return "TRANSIENT";
  if (isServerError(error))
    return "SERVER_ERROR";
  return "CLIENT_ERROR";
};
const retryMiddlewareOptions = {
  name: "retryMiddleware",
  tags: ["RETRY"],
  step: "finalizeRequest",
  priority: "high",
  override: true
};
const getRetryPlugin = (options) => ({
  applyToStack: (clientStack) => {
    clientStack.add(retryMiddleware(options), retryMiddlewareOptions);
  }
});
const getDateHeader = (response) => HttpResponse.isInstance(response) ? response.headers?.date ?? response.headers?.Date : void 0;
const getSkewCorrectedDate = (systemClockOffset) => new Date(Date.now() + systemClockOffset);
const isClockSkewed = (clockTime, systemClockOffset) => Math.abs(getSkewCorrectedDate(systemClockOffset).getTime() - clockTime) >= 3e5;
const getUpdatedSystemClockOffset = (clockTime, currentSystemClockOffset) => {
  const clockTimeInMs = Date.parse(clockTime);
  if (isClockSkewed(clockTimeInMs, currentSystemClockOffset)) {
    return clockTimeInMs - Date.now();
  }
  return currentSystemClockOffset;
};
const throwSigningPropertyError = (name, property) => {
  if (!property) {
    throw new Error(`Property \`${name}\` is not resolved for AWS SDK SigV4Auth`);
  }
  return property;
};
const validateSigningProperties = async (signingProperties) => {
  const context = throwSigningPropertyError("context", signingProperties.context);
  const config = throwSigningPropertyError("config", signingProperties.config);
  const authScheme = context.endpointV2?.properties?.authSchemes?.[0];
  const signerFunction = throwSigningPropertyError("signer", config.signer);
  const signer = await signerFunction(authScheme);
  const signingRegion = signingProperties?.signingRegion;
  const signingRegionSet = signingProperties?.signingRegionSet;
  const signingName = signingProperties?.signingName;
  return {
    config,
    signer,
    signingRegion,
    signingRegionSet,
    signingName
  };
};
class AwsSdkSigV4Signer {
  async sign(httpRequest, identity, signingProperties) {
    if (!HttpRequest.isInstance(httpRequest)) {
      throw new Error("The request is not an instance of `HttpRequest` and cannot be signed");
    }
    const validatedProps = await validateSigningProperties(signingProperties);
    const { config, signer } = validatedProps;
    let { signingRegion, signingName } = validatedProps;
    const handlerExecutionContext = signingProperties.context;
    if (handlerExecutionContext?.authSchemes?.length ?? 0 > 1) {
      const [first, second] = handlerExecutionContext.authSchemes;
      if (first?.name === "sigv4a" && second?.name === "sigv4") {
        signingRegion = second?.signingRegion ?? signingRegion;
        signingName = second?.signingName ?? signingName;
      }
    }
    const signedRequest = await signer.sign(httpRequest, {
      signingDate: getSkewCorrectedDate(config.systemClockOffset),
      signingRegion,
      signingService: signingName
    });
    return signedRequest;
  }
  errorHandler(signingProperties) {
    return (error) => {
      const serverTime = error.ServerTime ?? getDateHeader(error.$response);
      if (serverTime) {
        const config = throwSigningPropertyError("config", signingProperties.config);
        const initialSystemClockOffset = config.systemClockOffset;
        config.systemClockOffset = getUpdatedSystemClockOffset(serverTime, config.systemClockOffset);
        const clockSkewCorrected = config.systemClockOffset !== initialSystemClockOffset;
        if (clockSkewCorrected && error.$metadata) {
          error.$metadata.clockSkewCorrected = true;
        }
      }
      throw error;
    };
  }
  successHandler(httpResponse, signingProperties) {
    const dateHeader = getDateHeader(httpResponse);
    if (dateHeader) {
      const config = throwSigningPropertyError("config", signingProperties.config);
      config.systemClockOffset = getUpdatedSystemClockOffset(dateHeader, config.systemClockOffset);
    }
  }
}
class AwsSdkSigV4ASigner extends AwsSdkSigV4Signer {
  async sign(httpRequest, identity, signingProperties) {
    if (!HttpRequest.isInstance(httpRequest)) {
      throw new Error("The request is not an instance of `HttpRequest` and cannot be signed");
    }
    const { config, signer, signingRegion, signingRegionSet, signingName } = await validateSigningProperties(signingProperties);
    const configResolvedSigningRegionSet = await config.sigv4aSigningRegionSet?.();
    const multiRegionOverride = (configResolvedSigningRegionSet ?? signingRegionSet ?? [signingRegion]).join(",");
    const signedRequest = await signer.sign(httpRequest, {
      signingDate: getSkewCorrectedDate(config.systemClockOffset),
      signingRegion: multiRegionOverride,
      signingService: signingName
    });
    return signedRequest;
  }
}
const getArrayForCommaSeparatedString = (str) => typeof str === "string" && str.length > 0 ? str.split(",").map((item) => item.trim()) : [];
const getBearerTokenEnvKey = (signingName) => `AWS_BEARER_TOKEN_${signingName.replace(/[\s-]/g, "_").toUpperCase()}`;
const NODE_AUTH_SCHEME_PREFERENCE_ENV_KEY = "AWS_AUTH_SCHEME_PREFERENCE";
const NODE_AUTH_SCHEME_PREFERENCE_CONFIG_KEY = "auth_scheme_preference";
const NODE_AUTH_SCHEME_PREFERENCE_OPTIONS = {
  environmentVariableSelector: (env2, options) => {
    if (options?.signingName) {
      const bearerTokenKey = getBearerTokenEnvKey(options.signingName);
      if (bearerTokenKey in env2)
        return ["httpBearerAuth"];
    }
    if (!(NODE_AUTH_SCHEME_PREFERENCE_ENV_KEY in env2))
      return void 0;
    return getArrayForCommaSeparatedString(env2[NODE_AUTH_SCHEME_PREFERENCE_ENV_KEY]);
  },
  configFileSelector: (profile) => {
    if (!(NODE_AUTH_SCHEME_PREFERENCE_CONFIG_KEY in profile))
      return void 0;
    return getArrayForCommaSeparatedString(profile[NODE_AUTH_SCHEME_PREFERENCE_CONFIG_KEY]);
  },
  default: []
};
const resolveAwsSdkSigV4AConfig = (config) => {
  config.sigv4aSigningRegionSet = normalizeProvider(config.sigv4aSigningRegionSet);
  return config;
};
const NODE_SIGV4A_CONFIG_OPTIONS = {
  environmentVariableSelector(env2) {
    if (env2.AWS_SIGV4A_SIGNING_REGION_SET) {
      return env2.AWS_SIGV4A_SIGNING_REGION_SET.split(",").map((_) => _.trim());
    }
    throw new ProviderError("AWS_SIGV4A_SIGNING_REGION_SET not set in env.", {
      tryNextLink: true
    });
  },
  configFileSelector(profile) {
    if (profile.sigv4a_signing_region_set) {
      return (profile.sigv4a_signing_region_set ?? "").split(",").map((_) => _.trim());
    }
    throw new ProviderError("sigv4a_signing_region_set not set in profile.", {
      tryNextLink: true
    });
  },
  default: void 0
};
const resolveAwsSdkSigV4Config = (config) => {
  let inputCredentials = config.credentials;
  let isUserSupplied = !!config.credentials;
  let resolvedCredentials = void 0;
  Object.defineProperty(config, "credentials", {
    set(credentials) {
      if (credentials && credentials !== inputCredentials && credentials !== resolvedCredentials) {
        isUserSupplied = true;
      }
      inputCredentials = credentials;
      const memoizedProvider = normalizeCredentialProvider(config, {
        credentials: inputCredentials,
        credentialDefaultProvider: config.credentialDefaultProvider
      });
      const boundProvider = bindCallerConfig(config, memoizedProvider);
      if (isUserSupplied && !boundProvider.attributed) {
        const isCredentialObject = typeof inputCredentials === "object" && inputCredentials !== null;
        resolvedCredentials = async (options) => {
          const creds = await boundProvider(options);
          const attributedCreds = creds;
          if (isCredentialObject && (!attributedCreds.$source || Object.keys(attributedCreds.$source).length === 0)) {
            return setCredentialFeature(attributedCreds, "CREDENTIALS_CODE", "e");
          }
          return attributedCreds;
        };
        resolvedCredentials.memoized = boundProvider.memoized;
        resolvedCredentials.configBound = boundProvider.configBound;
        resolvedCredentials.attributed = true;
      } else {
        resolvedCredentials = boundProvider;
      }
    },
    get() {
      return resolvedCredentials;
    },
    enumerable: true,
    configurable: true
  });
  config.credentials = inputCredentials;
  const { signingEscapePath = true, systemClockOffset = config.systemClockOffset || 0, sha256 } = config;
  let signer;
  if (config.signer) {
    signer = normalizeProvider(config.signer);
  } else if (config.regionInfoProvider) {
    signer = () => normalizeProvider(config.region)().then(async (region) => [
      await config.regionInfoProvider(region, {
        useFipsEndpoint: await config.useFipsEndpoint(),
        useDualstackEndpoint: await config.useDualstackEndpoint()
      }) || {},
      region
    ]).then(([regionInfo, region]) => {
      const { signingRegion, signingService } = regionInfo;
      config.signingRegion = config.signingRegion || signingRegion || region;
      config.signingName = config.signingName || signingService || config.serviceId;
      const params = {
        ...config,
        credentials: config.credentials,
        region: config.signingRegion,
        service: config.signingName,
        sha256,
        uriEscapePath: signingEscapePath
      };
      const SignerCtor = config.signerConstructor || SignatureV4;
      return new SignerCtor(params);
    });
  } else {
    signer = async (authScheme) => {
      authScheme = Object.assign({}, {
        name: "sigv4",
        signingName: config.signingName || config.defaultSigningName,
        signingRegion: await normalizeProvider(config.region)(),
        properties: {}
      }, authScheme);
      const signingRegion = authScheme.signingRegion;
      const signingService = authScheme.signingName;
      config.signingRegion = config.signingRegion || signingRegion;
      config.signingName = config.signingName || signingService || config.serviceId;
      const params = {
        ...config,
        credentials: config.credentials,
        region: config.signingRegion,
        service: config.signingName,
        sha256,
        uriEscapePath: signingEscapePath
      };
      const SignerCtor = config.signerConstructor || SignatureV4;
      return new SignerCtor(params);
    };
  }
  const resolvedConfig = Object.assign(config, {
    systemClockOffset,
    signingEscapePath,
    signer
  });
  return resolvedConfig;
};
function normalizeCredentialProvider(config, { credentials, credentialDefaultProvider }) {
  let credentialsProvider;
  if (credentials) {
    if (!credentials?.memoized) {
      credentialsProvider = memoizeIdentityProvider(credentials, isIdentityExpired, doesIdentityRequireRefresh);
    } else {
      credentialsProvider = credentials;
    }
  } else {
    if (credentialDefaultProvider) {
      credentialsProvider = normalizeProvider(credentialDefaultProvider(Object.assign({}, config, {
        parentClientConfig: config
      })));
    } else {
      credentialsProvider = async () => {
        throw new Error("@aws-sdk/core::resolveAwsSdkSigV4Config - `credentials` not provided and no credentialDefaultProvider was configured.");
      };
    }
  }
  credentialsProvider.memoized = true;
  return credentialsProvider;
}
function bindCallerConfig(config, credentialsProvider) {
  if (credentialsProvider.configBound) {
    return credentialsProvider;
  }
  const fn = async (options) => credentialsProvider({ ...options, callerClientConfig: config });
  fn.memoized = credentialsProvider.memoized;
  fn.configBound = true;
  return fn;
}
class SignatureV4MultiRegion {
  sigv4aSigner;
  sigv4Signer;
  signerOptions;
  static sigv4aDependency() {
    return "none";
  }
  constructor(options) {
    this.sigv4Signer = new SignatureV4S3Express(options);
    this.signerOptions = options;
  }
  async sign(requestToSign, options = {}) {
    if (options.signingRegion === "*") {
      return this.getSigv4aSigner().sign(requestToSign, options);
    }
    return this.sigv4Signer.sign(requestToSign, options);
  }
  async signWithCredentials(requestToSign, credentials, options = {}) {
    if (options.signingRegion === "*") {
      this.getSigv4aSigner();
      {
        throw new Error(`signWithCredentials with signingRegion '*' is only supported when using the CRT dependency @aws-sdk/signature-v4-crt. Please check whether you have installed the "@aws-sdk/signature-v4-crt" package explicitly. You must also register the package by calling [require("@aws-sdk/signature-v4-crt");] or an ESM equivalent such as [import "@aws-sdk/signature-v4-crt";]. For more information please go to https://github.com/aws/aws-sdk-js-v3#functionality-requiring-aws-common-runtime-crt`);
      }
    }
    return this.sigv4Signer.signWithCredentials(requestToSign, credentials, options);
  }
  async presign(originalRequest, options = {}) {
    if (options.signingRegion === "*") {
      this.getSigv4aSigner();
      {
        throw new Error(`presign with signingRegion '*' is only supported when using the CRT dependency @aws-sdk/signature-v4-crt. Please check whether you have installed the "@aws-sdk/signature-v4-crt" package explicitly. You must also register the package by calling [require("@aws-sdk/signature-v4-crt");] or an ESM equivalent such as [import "@aws-sdk/signature-v4-crt";]. For more information please go to https://github.com/aws/aws-sdk-js-v3#functionality-requiring-aws-common-runtime-crt`);
      }
    }
    return this.sigv4Signer.presign(originalRequest, options);
  }
  async presignWithCredentials(originalRequest, credentials, options = {}) {
    if (options.signingRegion === "*") {
      throw new Error("Method presignWithCredentials is not supported for [signingRegion=*].");
    }
    return this.sigv4Signer.presignWithCredentials(originalRequest, credentials, options);
  }
  getSigv4aSigner() {
    if (!this.sigv4aSigner) {
      if (this.signerOptions.runtime === "node") {
        {
          throw new Error("Neither CRT nor JS SigV4a implementation is available. Please load either @aws-sdk/signature-v4-crt or @aws-sdk/signature-v4a. For more information please go to https://github.com/aws/aws-sdk-js-v3#functionality-requiring-aws-common-runtime-crt");
        }
      } else {
        {
          throw new Error("JS SigV4a implementation is not available or not a valid constructor. Please check whether you have installed the @aws-sdk/signature-v4a package explicitly. The CRT implementation is not available for browsers. You must also register the package by calling [require('@aws-sdk/signature-v4a');] or an ESM equivalent such as [import '@aws-sdk/signature-v4a';]. For more information please go to https://github.com/aws/aws-sdk-js-v3#using-javascript-non-crt-implementation-of-sigv4a");
        }
      }
    }
    return this.sigv4aSigner;
  }
}
const cs = "required", ct = "type", cu = "rules", cv = "conditions", cw = "fn", cx = "argv", cy = "ref", cz = "assign", cA = "url", cB = "properties", cC = "backend", cD = "authSchemes", cE = "disableDoubleEncoding", cF = "signingName", cG = "signingRegion", cH = "headers", cI = "signingRegionSet";
const a = 6, b = false, c = true, d = "isSet", e = "booleanEquals", f = "error", g = "aws.partition", h = "stringEquals", i = "getAttr", j = "name", k = "substring", l = "bucketSuffix", m = "parseURL", n = "endpoint", o = "tree", p = "aws.isVirtualHostableS3Bucket", q = "{url#scheme}://{Bucket}.{url#authority}{url#path}", r = "not", s = "accessPointSuffix", t = "{url#scheme}://{url#authority}{url#path}", u = "hardwareType", v = "regionPrefix", w = "bucketAliasSuffix", x = "outpostId", y = "isValidHostLabel", z = "sigv4a", A = "s3-outposts", B = "s3", C = "{url#scheme}://{url#authority}{url#normalizedPath}{Bucket}", D = "https://{Bucket}.s3-accelerate.{partitionResult#dnsSuffix}", E = "https://{Bucket}.s3.{partitionResult#dnsSuffix}", F = "aws.parseArn", G = "bucketArn", H = "arnType", I = "", J = "s3-object-lambda", K = "accesspoint", L = "accessPointName", M = "{url#scheme}://{accessPointName}-{bucketArn#accountId}.{url#authority}{url#path}", N = "mrapPartition", O = "outpostType", P = "arnPrefix", Q = "{url#scheme}://{url#authority}{url#normalizedPath}{uri_encoded_bucket}", R = "https://s3.{partitionResult#dnsSuffix}/{uri_encoded_bucket}", S = "https://s3.{partitionResult#dnsSuffix}", T = { [cs]: false, [ct]: "string" }, U = { [cs]: true, "default": false, [ct]: "boolean" }, V = { [cs]: false, [ct]: "boolean" }, W = { [cw]: e, [cx]: [{ [cy]: "Accelerate" }, true] }, X = { [cw]: e, [cx]: [{ [cy]: "UseFIPS" }, true] }, Y = { [cw]: e, [cx]: [{ [cy]: "UseDualStack" }, true] }, Z = { [cw]: d, [cx]: [{ [cy]: "Endpoint" }] }, aa = { [cw]: g, [cx]: [{ [cy]: "Region" }], [cz]: "partitionResult" }, ab = { [cw]: h, [cx]: [{ [cw]: i, [cx]: [{ [cy]: "partitionResult" }, j] }, "aws-cn"] }, ac = { [cw]: d, [cx]: [{ [cy]: "Bucket" }] }, ad = { [cy]: "Bucket" }, ae = { [cv]: [W], [f]: "S3Express does not support S3 Accelerate.", [ct]: f }, af = { [cv]: [Z, { [cw]: m, [cx]: [{ [cy]: "Endpoint" }], [cz]: "url" }], [cu]: [{ [cv]: [{ [cw]: d, [cx]: [{ [cy]: "DisableS3ExpressSessionAuth" }] }, { [cw]: e, [cx]: [{ [cy]: "DisableS3ExpressSessionAuth" }, true] }], [cu]: [{ [cv]: [{ [cw]: e, [cx]: [{ [cw]: i, [cx]: [{ [cy]: "url" }, "isIp"] }, true] }], [cu]: [{ [cv]: [{ [cw]: "uriEncode", [cx]: [ad], [cz]: "uri_encoded_bucket" }], [cu]: [{ [n]: { [cA]: "{url#scheme}://{url#authority}/{uri_encoded_bucket}{url#path}", [cB]: { [cC]: "S3Express", [cD]: [{ [cE]: true, [j]: "sigv4", [cF]: "s3express", [cG]: "{Region}" }] }, [cH]: {} }, [ct]: n }], [ct]: o }], [ct]: o }, { [cv]: [{ [cw]: p, [cx]: [ad, false] }], [cu]: [{ [n]: { [cA]: q, [cB]: { [cC]: "S3Express", [cD]: [{ [cE]: true, [j]: "sigv4", [cF]: "s3express", [cG]: "{Region}" }] }, [cH]: {} }, [ct]: n }], [ct]: o }, { [f]: "S3Express bucket name is not a valid virtual hostable name.", [ct]: f }], [ct]: o }, { [cv]: [{ [cw]: e, [cx]: [{ [cw]: i, [cx]: [{ [cy]: "url" }, "isIp"] }, true] }], [cu]: [{ [cv]: [{ [cw]: "uriEncode", [cx]: [ad], [cz]: "uri_encoded_bucket" }], [cu]: [{ [n]: { [cA]: "{url#scheme}://{url#authority}/{uri_encoded_bucket}{url#path}", [cB]: { [cC]: "S3Express", [cD]: [{ [cE]: true, [j]: "sigv4-s3express", [cF]: "s3express", [cG]: "{Region}" }] }, [cH]: {} }, [ct]: n }], [ct]: o }], [ct]: o }, { [cv]: [{ [cw]: p, [cx]: [ad, false] }], [cu]: [{ [n]: { [cA]: q, [cB]: { [cC]: "S3Express", [cD]: [{ [cE]: true, [j]: "sigv4-s3express", [cF]: "s3express", [cG]: "{Region}" }] }, [cH]: {} }, [ct]: n }], [ct]: o }, { [f]: "S3Express bucket name is not a valid virtual hostable name.", [ct]: f }], [ct]: o }, ag = { [cw]: m, [cx]: [{ [cy]: "Endpoint" }], [cz]: "url" }, ah = { [cw]: e, [cx]: [{ [cw]: i, [cx]: [{ [cy]: "url" }, "isIp"] }, true] }, ai = { [cy]: "url" }, aj = { [cw]: "uriEncode", [cx]: [ad], [cz]: "uri_encoded_bucket" }, ak = { [cC]: "S3Express", [cD]: [{ [cE]: true, [j]: "sigv4", [cF]: "s3express", [cG]: "{Region}" }] }, al = {}, am = { [cw]: p, [cx]: [ad, false] }, an = { [f]: "S3Express bucket name is not a valid virtual hostable name.", [ct]: f }, ao = { [cw]: d, [cx]: [{ [cy]: "UseS3ExpressControlEndpoint" }] }, ap = { [cw]: e, [cx]: [{ [cy]: "UseS3ExpressControlEndpoint" }, true] }, aq = { [cw]: r, [cx]: [Z] }, ar = { [cw]: e, [cx]: [{ [cy]: "UseDualStack" }, false] }, as = { [cw]: e, [cx]: [{ [cy]: "UseFIPS" }, false] }, at = { [f]: "Unrecognized S3Express bucket name format.", [ct]: f }, au = { [cw]: r, [cx]: [ac] }, av = { [cy]: u }, aw = { [cv]: [aq], [f]: "Expected a endpoint to be specified but no endpoint was found", [ct]: f }, ax = { [cD]: [{ [cE]: true, [j]: z, [cF]: A, [cI]: ["*"] }, { [cE]: true, [j]: "sigv4", [cF]: A, [cG]: "{Region}" }] }, ay = { [cw]: e, [cx]: [{ [cy]: "ForcePathStyle" }, false] }, az = { [cy]: "ForcePathStyle" }, aA = { [cw]: e, [cx]: [{ [cy]: "Accelerate" }, false] }, aB = { [cw]: h, [cx]: [{ [cy]: "Region" }, "aws-global"] }, aC = { [cD]: [{ [cE]: true, [j]: "sigv4", [cF]: B, [cG]: "us-east-1" }] }, aD = { [cw]: r, [cx]: [aB] }, aE = { [cw]: e, [cx]: [{ [cy]: "UseGlobalEndpoint" }, true] }, aF = { [cA]: "https://{Bucket}.s3-fips.dualstack.{Region}.{partitionResult#dnsSuffix}", [cB]: { [cD]: [{ [cE]: true, [j]: "sigv4", [cF]: B, [cG]: "{Region}" }] }, [cH]: {} }, aG = { [cD]: [{ [cE]: true, [j]: "sigv4", [cF]: B, [cG]: "{Region}" }] }, aH = { [cw]: e, [cx]: [{ [cy]: "UseGlobalEndpoint" }, false] }, aI = { [cA]: "https://{Bucket}.s3-fips.{Region}.{partitionResult#dnsSuffix}", [cB]: aG, [cH]: {} }, aJ = { [cA]: "https://{Bucket}.s3-accelerate.dualstack.{partitionResult#dnsSuffix}", [cB]: aG, [cH]: {} }, aK = { [cA]: "https://{Bucket}.s3.dualstack.{Region}.{partitionResult#dnsSuffix}", [cB]: aG, [cH]: {} }, aL = { [cw]: e, [cx]: [{ [cw]: i, [cx]: [ai, "isIp"] }, false] }, aM = { [cA]: C, [cB]: aG, [cH]: {} }, aN = { [cA]: q, [cB]: aG, [cH]: {} }, aO = { [n]: aN, [ct]: n }, aP = { [cA]: D, [cB]: aG, [cH]: {} }, aQ = { [cA]: "https://{Bucket}.s3.{Region}.{partitionResult#dnsSuffix}", [cB]: aG, [cH]: {} }, aR = { [f]: "Invalid region: region was not a valid DNS name.", [ct]: f }, aS = { [cy]: G }, aT = { [cy]: H }, aU = { [cw]: i, [cx]: [aS, "service"] }, aV = { [cy]: L }, aW = { [cv]: [Y], [f]: "S3 Object Lambda does not support Dual-stack", [ct]: f }, aX = { [cv]: [W], [f]: "S3 Object Lambda does not support S3 Accelerate", [ct]: f }, aY = { [cv]: [{ [cw]: d, [cx]: [{ [cy]: "DisableAccessPoints" }] }, { [cw]: e, [cx]: [{ [cy]: "DisableAccessPoints" }, true] }], [f]: "Access points are not supported for this operation", [ct]: f }, aZ = { [cv]: [{ [cw]: d, [cx]: [{ [cy]: "UseArnRegion" }] }, { [cw]: e, [cx]: [{ [cy]: "UseArnRegion" }, false] }, { [cw]: r, [cx]: [{ [cw]: h, [cx]: [{ [cw]: i, [cx]: [aS, "region"] }, "{Region}"] }] }], [f]: "Invalid configuration: region from ARN `{bucketArn#region}` does not match client region `{Region}` and UseArnRegion is `false`", [ct]: f }, ba = { [cw]: i, [cx]: [{ [cy]: "bucketPartition" }, j] }, bb = { [cw]: i, [cx]: [aS, "accountId"] }, bc = { [cD]: [{ [cE]: true, [j]: "sigv4", [cF]: J, [cG]: "{bucketArn#region}" }] }, bd = { [f]: "Invalid ARN: The access point name may only contain a-z, A-Z, 0-9 and `-`. Found: `{accessPointName}`", [ct]: f }, be = { [f]: "Invalid ARN: The account id may only contain a-z, A-Z, 0-9 and `-`. Found: `{bucketArn#accountId}`", [ct]: f }, bf = { [f]: "Invalid region in ARN: `{bucketArn#region}` (invalid DNS name)", [ct]: f }, bg = { [f]: "Client was configured for partition `{partitionResult#name}` but ARN (`{Bucket}`) has `{bucketPartition#name}`", [ct]: f }, bh = { [f]: "Invalid ARN: The ARN may only contain a single resource component after `accesspoint`.", [ct]: f }, bi = { [f]: "Invalid ARN: Expected a resource of the format `accesspoint:<accesspoint name>` but no name was provided", [ct]: f }, bj = { [cD]: [{ [cE]: true, [j]: "sigv4", [cF]: B, [cG]: "{bucketArn#region}" }] }, bk = { [cD]: [{ [cE]: true, [j]: z, [cF]: A, [cI]: ["*"] }, { [cE]: true, [j]: "sigv4", [cF]: A, [cG]: "{bucketArn#region}" }] }, bl = { [cw]: F, [cx]: [ad] }, bm = { [cA]: "https://s3-fips.dualstack.{Region}.{partitionResult#dnsSuffix}/{uri_encoded_bucket}", [cB]: aG, [cH]: {} }, bn = { [cA]: "https://s3-fips.{Region}.{partitionResult#dnsSuffix}/{uri_encoded_bucket}", [cB]: aG, [cH]: {} }, bo = { [cA]: "https://s3.dualstack.{Region}.{partitionResult#dnsSuffix}/{uri_encoded_bucket}", [cB]: aG, [cH]: {} }, bp = { [cA]: Q, [cB]: aG, [cH]: {} }, bq = { [cA]: "https://s3.{Region}.{partitionResult#dnsSuffix}/{uri_encoded_bucket}", [cB]: aG, [cH]: {} }, br = { [cy]: "UseObjectLambdaEndpoint" }, bs = { [cD]: [{ [cE]: true, [j]: "sigv4", [cF]: J, [cG]: "{Region}" }] }, bt = { [cA]: "https://s3-fips.dualstack.{Region}.{partitionResult#dnsSuffix}", [cB]: aG, [cH]: {} }, bu = { [cA]: "https://s3-fips.{Region}.{partitionResult#dnsSuffix}", [cB]: aG, [cH]: {} }, bv = { [cA]: "https://s3.dualstack.{Region}.{partitionResult#dnsSuffix}", [cB]: aG, [cH]: {} }, bw = { [cA]: t, [cB]: aG, [cH]: {} }, bx = { [cA]: "https://s3.{Region}.{partitionResult#dnsSuffix}", [cB]: aG, [cH]: {} }, by = [{ [cy]: "Region" }], bz = [{ [cy]: "Endpoint" }], bA = [ad], bB = [W], bC = [Z, ag], bD = [{ [cw]: d, [cx]: [{ [cy]: "DisableS3ExpressSessionAuth" }] }, { [cw]: e, [cx]: [{ [cy]: "DisableS3ExpressSessionAuth" }, true] }], bE = [aj], bF = [am], bG = [aa], bH = [X, Y], bI = [X, ar], bJ = [as, Y], bK = [as, ar], bL = [{ [cw]: k, [cx]: [ad, 6, 14, true], [cz]: "s3expressAvailabilityZoneId" }, { [cw]: k, [cx]: [ad, 14, 16, true], [cz]: "s3expressAvailabilityZoneDelim" }, { [cw]: h, [cx]: [{ [cy]: "s3expressAvailabilityZoneDelim" }, "--"] }], bM = [{ [cv]: [X, Y], [n]: { [cA]: "https://{Bucket}.s3express-fips-{s3expressAvailabilityZoneId}.dualstack.{Region}.{partitionResult#dnsSuffix}", [cB]: ak, [cH]: {} }, [ct]: n }, { [cv]: bI, [n]: { [cA]: "https://{Bucket}.s3express-fips-{s3expressAvailabilityZoneId}.{Region}.{partitionResult#dnsSuffix}", [cB]: ak, [cH]: {} }, [ct]: n }, { [cv]: bJ, [n]: { [cA]: "https://{Bucket}.s3express-{s3expressAvailabilityZoneId}.dualstack.{Region}.{partitionResult#dnsSuffix}", [cB]: ak, [cH]: {} }, [ct]: n }, { [cv]: bK, [n]: { [cA]: "https://{Bucket}.s3express-{s3expressAvailabilityZoneId}.{Region}.{partitionResult#dnsSuffix}", [cB]: ak, [cH]: {} }, [ct]: n }], bN = [{ [cw]: k, [cx]: [ad, 6, 15, true], [cz]: "s3expressAvailabilityZoneId" }, { [cw]: k, [cx]: [ad, 15, 17, true], [cz]: "s3expressAvailabilityZoneDelim" }, { [cw]: h, [cx]: [{ [cy]: "s3expressAvailabilityZoneDelim" }, "--"] }], bO = [{ [cw]: k, [cx]: [ad, 6, 19, true], [cz]: "s3expressAvailabilityZoneId" }, { [cw]: k, [cx]: [ad, 19, 21, true], [cz]: "s3expressAvailabilityZoneDelim" }, { [cw]: h, [cx]: [{ [cy]: "s3expressAvailabilityZoneDelim" }, "--"] }], bP = [{ [cw]: k, [cx]: [ad, 6, 20, true], [cz]: "s3expressAvailabilityZoneId" }, { [cw]: k, [cx]: [ad, 20, 22, true], [cz]: "s3expressAvailabilityZoneDelim" }, { [cw]: h, [cx]: [{ [cy]: "s3expressAvailabilityZoneDelim" }, "--"] }], bQ = [{ [cw]: k, [cx]: [ad, 6, 26, true], [cz]: "s3expressAvailabilityZoneId" }, { [cw]: k, [cx]: [ad, 26, 28, true], [cz]: "s3expressAvailabilityZoneDelim" }, { [cw]: h, [cx]: [{ [cy]: "s3expressAvailabilityZoneDelim" }, "--"] }], bR = [{ [cv]: [X, Y], [n]: { [cA]: "https://{Bucket}.s3express-fips-{s3expressAvailabilityZoneId}.dualstack.{Region}.{partitionResult#dnsSuffix}", [cB]: { [cC]: "S3Express", [cD]: [{ [cE]: true, [j]: "sigv4-s3express", [cF]: "s3express", [cG]: "{Region}" }] }, [cH]: {} }, [ct]: n }, { [cv]: bI, [n]: { [cA]: "https://{Bucket}.s3express-fips-{s3expressAvailabilityZoneId}.{Region}.{partitionResult#dnsSuffix}", [cB]: { [cC]: "S3Express", [cD]: [{ [cE]: true, [j]: "sigv4-s3express", [cF]: "s3express", [cG]: "{Region}" }] }, [cH]: {} }, [ct]: n }, { [cv]: bJ, [n]: { [cA]: "https://{Bucket}.s3express-{s3expressAvailabilityZoneId}.dualstack.{Region}.{partitionResult#dnsSuffix}", [cB]: { [cC]: "S3Express", [cD]: [{ [cE]: true, [j]: "sigv4-s3express", [cF]: "s3express", [cG]: "{Region}" }] }, [cH]: {} }, [ct]: n }, { [cv]: bK, [n]: { [cA]: "https://{Bucket}.s3express-{s3expressAvailabilityZoneId}.{Region}.{partitionResult#dnsSuffix}", [cB]: { [cC]: "S3Express", [cD]: [{ [cE]: true, [j]: "sigv4-s3express", [cF]: "s3express", [cG]: "{Region}" }] }, [cH]: {} }, [ct]: n }], bS = [ad, 0, 7, true], bT = [{ [cw]: k, [cx]: [ad, 7, 15, true], [cz]: "s3expressAvailabilityZoneId" }, { [cw]: k, [cx]: [ad, 15, 17, true], [cz]: "s3expressAvailabilityZoneDelim" }, { [cw]: h, [cx]: [{ [cy]: "s3expressAvailabilityZoneDelim" }, "--"] }], bU = [{ [cw]: k, [cx]: [ad, 7, 16, true], [cz]: "s3expressAvailabilityZoneId" }, { [cw]: k, [cx]: [ad, 16, 18, true], [cz]: "s3expressAvailabilityZoneDelim" }, { [cw]: h, [cx]: [{ [cy]: "s3expressAvailabilityZoneDelim" }, "--"] }], bV = [{ [cw]: k, [cx]: [ad, 7, 20, true], [cz]: "s3expressAvailabilityZoneId" }, { [cw]: k, [cx]: [ad, 20, 22, true], [cz]: "s3expressAvailabilityZoneDelim" }, { [cw]: h, [cx]: [{ [cy]: "s3expressAvailabilityZoneDelim" }, "--"] }], bW = [{ [cw]: k, [cx]: [ad, 7, 21, true], [cz]: "s3expressAvailabilityZoneId" }, { [cw]: k, [cx]: [ad, 21, 23, true], [cz]: "s3expressAvailabilityZoneDelim" }, { [cw]: h, [cx]: [{ [cy]: "s3expressAvailabilityZoneDelim" }, "--"] }], bX = [{ [cw]: k, [cx]: [ad, 7, 27, true], [cz]: "s3expressAvailabilityZoneId" }, { [cw]: k, [cx]: [ad, 27, 29, true], [cz]: "s3expressAvailabilityZoneDelim" }, { [cw]: h, [cx]: [{ [cy]: "s3expressAvailabilityZoneDelim" }, "--"] }], bY = [ac], bZ = [{ [cw]: y, [cx]: [{ [cy]: x }, false] }], ca = [{ [cw]: h, [cx]: [{ [cy]: v }, "beta"] }], cb = ["*"], cc = [{ [cw]: y, [cx]: [{ [cy]: "Region" }, false] }], cd = [{ [cw]: h, [cx]: [{ [cy]: "Region" }, "us-east-1"] }], ce = [{ [cw]: h, [cx]: [aT, K] }], cf = [{ [cw]: i, [cx]: [aS, "resourceId[1]"], [cz]: L }, { [cw]: r, [cx]: [{ [cw]: h, [cx]: [aV, I] }] }], cg = [aS, "resourceId[1]"], ch = [Y], ci = [{ [cw]: r, [cx]: [{ [cw]: h, [cx]: [{ [cw]: i, [cx]: [aS, "region"] }, I] }] }], cj = [{ [cw]: r, [cx]: [{ [cw]: d, [cx]: [{ [cw]: i, [cx]: [aS, "resourceId[2]"] }] }] }], ck = [aS, "resourceId[2]"], cl = [{ [cw]: g, [cx]: [{ [cw]: i, [cx]: [aS, "region"] }], [cz]: "bucketPartition" }], cm = [{ [cw]: h, [cx]: [ba, { [cw]: i, [cx]: [{ [cy]: "partitionResult" }, j] }] }], cn = [{ [cw]: y, [cx]: [{ [cw]: i, [cx]: [aS, "region"] }, true] }], co = [{ [cw]: y, [cx]: [bb, false] }], cp = [{ [cw]: y, [cx]: [aV, false] }], cq = [X], cr = [{ [cw]: y, [cx]: [{ [cy]: "Region" }, true] }];
const _data = { parameters: { Bucket: T, Region: T, UseFIPS: U, UseDualStack: U, Endpoint: T, ForcePathStyle: U, Accelerate: U, UseGlobalEndpoint: U, UseObjectLambdaEndpoint: V, Key: T, Prefix: T, CopySource: T, DisableAccessPoints: V, DisableMultiRegionAccessPoints: U, UseArnRegion: V, UseS3ExpressControlEndpoint: V, DisableS3ExpressSessionAuth: V }, [cu]: [{ [cv]: [{ [cw]: d, [cx]: by }], [cu]: [{ [cv]: [W, X], error: "Accelerate cannot be used with FIPS", [ct]: f }, { [cv]: [Y, Z], error: "Cannot set dual-stack in combination with a custom endpoint.", [ct]: f }, { [cv]: [Z, X], error: "A custom endpoint cannot be combined with FIPS", [ct]: f }, { [cv]: [Z, W], error: "A custom endpoint cannot be combined with S3 Accelerate", [ct]: f }, { [cv]: [X, aa, ab], error: "Partition does not support FIPS", [ct]: f }, { [cv]: [ac, { [cw]: k, [cx]: [ad, 0, a, c], [cz]: l }, { [cw]: h, [cx]: [{ [cy]: l }, "--x-s3"] }], [cu]: [ae, af, { [cv]: [ao, ap], [cu]: [{ [cv]: bG, [cu]: [{ [cv]: [aj, aq], [cu]: [{ [cv]: bH, endpoint: { [cA]: "https://s3express-control-fips.dualstack.{Region}.{partitionResult#dnsSuffix}/{uri_encoded_bucket}", [cB]: ak, [cH]: al }, [ct]: n }, { [cv]: bI, endpoint: { [cA]: "https://s3express-control-fips.{Region}.{partitionResult#dnsSuffix}/{uri_encoded_bucket}", [cB]: ak, [cH]: al }, [ct]: n }, { [cv]: bJ, endpoint: { [cA]: "https://s3express-control.dualstack.{Region}.{partitionResult#dnsSuffix}/{uri_encoded_bucket}", [cB]: ak, [cH]: al }, [ct]: n }, { [cv]: bK, endpoint: { [cA]: "https://s3express-control.{Region}.{partitionResult#dnsSuffix}/{uri_encoded_bucket}", [cB]: ak, [cH]: al }, [ct]: n }], [ct]: o }], [ct]: o }], [ct]: o }, { [cv]: bF, [cu]: [{ [cv]: bG, [cu]: [{ [cv]: bD, [cu]: [{ [cv]: bL, [cu]: bM, [ct]: o }, { [cv]: bN, [cu]: bM, [ct]: o }, { [cv]: bO, [cu]: bM, [ct]: o }, { [cv]: bP, [cu]: bM, [ct]: o }, { [cv]: bQ, [cu]: bM, [ct]: o }, at], [ct]: o }, { [cv]: bL, [cu]: bR, [ct]: o }, { [cv]: bN, [cu]: bR, [ct]: o }, { [cv]: bO, [cu]: bR, [ct]: o }, { [cv]: bP, [cu]: bR, [ct]: o }, { [cv]: bQ, [cu]: bR, [ct]: o }, at], [ct]: o }], [ct]: o }, an], [ct]: o }, { [cv]: [ac, { [cw]: k, [cx]: bS, [cz]: s }, { [cw]: h, [cx]: [{ [cy]: s }, "--xa-s3"] }], [cu]: [ae, af, { [cv]: bF, [cu]: [{ [cv]: bG, [cu]: [{ [cv]: bD, [cu]: [{ [cv]: bT, [cu]: bM, [ct]: o }, { [cv]: bU, [cu]: bM, [ct]: o }, { [cv]: bV, [cu]: bM, [ct]: o }, { [cv]: bW, [cu]: bM, [ct]: o }, { [cv]: bX, [cu]: bM, [ct]: o }, at], [ct]: o }, { [cv]: bT, [cu]: bR, [ct]: o }, { [cv]: bU, [cu]: bR, [ct]: o }, { [cv]: bV, [cu]: bR, [ct]: o }, { [cv]: bW, [cu]: bR, [ct]: o }, { [cv]: bX, [cu]: bR, [ct]: o }, at], [ct]: o }], [ct]: o }, an], [ct]: o }, { [cv]: [au, ao, ap], [cu]: [{ [cv]: bG, [cu]: [{ [cv]: bC, endpoint: { [cA]: t, [cB]: ak, [cH]: al }, [ct]: n }, { [cv]: bH, endpoint: { [cA]: "https://s3express-control-fips.dualstack.{Region}.{partitionResult#dnsSuffix}", [cB]: ak, [cH]: al }, [ct]: n }, { [cv]: bI, endpoint: { [cA]: "https://s3express-control-fips.{Region}.{partitionResult#dnsSuffix}", [cB]: ak, [cH]: al }, [ct]: n }, { [cv]: bJ, endpoint: { [cA]: "https://s3express-control.dualstack.{Region}.{partitionResult#dnsSuffix}", [cB]: ak, [cH]: al }, [ct]: n }, { [cv]: bK, endpoint: { [cA]: "https://s3express-control.{Region}.{partitionResult#dnsSuffix}", [cB]: ak, [cH]: al }, [ct]: n }], [ct]: o }], [ct]: o }, { [cv]: [ac, { [cw]: k, [cx]: [ad, 49, 50, c], [cz]: u }, { [cw]: k, [cx]: [ad, 8, 12, c], [cz]: v }, { [cw]: k, [cx]: bS, [cz]: w }, { [cw]: k, [cx]: [ad, 32, 49, c], [cz]: x }, { [cw]: g, [cx]: by, [cz]: "regionPartition" }, { [cw]: h, [cx]: [{ [cy]: w }, "--op-s3"] }], [cu]: [{ [cv]: bZ, [cu]: [{ [cv]: bF, [cu]: [{ [cv]: [{ [cw]: h, [cx]: [av, "e"] }], [cu]: [{ [cv]: ca, [cu]: [aw, { [cv]: bC, endpoint: { [cA]: "https://{Bucket}.ec2.{url#authority}", [cB]: ax, [cH]: al }, [ct]: n }], [ct]: o }, { endpoint: { [cA]: "https://{Bucket}.ec2.s3-outposts.{Region}.{regionPartition#dnsSuffix}", [cB]: ax, [cH]: al }, [ct]: n }], [ct]: o }, { [cv]: [{ [cw]: h, [cx]: [av, "o"] }], [cu]: [{ [cv]: ca, [cu]: [aw, { [cv]: bC, endpoint: { [cA]: "https://{Bucket}.op-{outpostId}.{url#authority}", [cB]: ax, [cH]: al }, [ct]: n }], [ct]: o }, { endpoint: { [cA]: "https://{Bucket}.op-{outpostId}.s3-outposts.{Region}.{regionPartition#dnsSuffix}", [cB]: ax, [cH]: al }, [ct]: n }], [ct]: o }, { error: 'Unrecognized hardware type: "Expected hardware type o or e but got {hardwareType}"', [ct]: f }], [ct]: o }, { error: "Invalid Outposts Bucket alias - it must be a valid bucket name.", [ct]: f }], [ct]: o }, { error: "Invalid ARN: The outpost Id must only contain a-z, A-Z, 0-9 and `-`.", [ct]: f }], [ct]: o }, { [cv]: bY, [cu]: [{ [cv]: [Z, { [cw]: r, [cx]: [{ [cw]: d, [cx]: [{ [cw]: m, [cx]: bz }] }] }], error: "Custom endpoint `{Endpoint}` was not a valid URI", [ct]: f }, { [cv]: [ay, am], [cu]: [{ [cv]: bG, [cu]: [{ [cv]: cc, [cu]: [{ [cv]: [W, ab], error: "S3 Accelerate cannot be used in this region", [ct]: f }, { [cv]: [Y, X, aA, aq, aB], endpoint: { [cA]: "https://{Bucket}.s3-fips.dualstack.us-east-1.{partitionResult#dnsSuffix}", [cB]: aC, [cH]: al }, [ct]: n }, { [cv]: [Y, X, aA, aq, aD, aE], [cu]: [{ endpoint: aF, [ct]: n }], [ct]: o }, { [cv]: [Y, X, aA, aq, aD, aH], endpoint: aF, [ct]: n }, { [cv]: [ar, X, aA, aq, aB], endpoint: { [cA]: "https://{Bucket}.s3-fips.us-east-1.{partitionResult#dnsSuffix}", [cB]: aC, [cH]: al }, [ct]: n }, { [cv]: [ar, X, aA, aq, aD, aE], [cu]: [{ endpoint: aI, [ct]: n }], [ct]: o }, { [cv]: [ar, X, aA, aq, aD, aH], endpoint: aI, [ct]: n }, { [cv]: [Y, as, W, aq, aB], endpoint: { [cA]: "https://{Bucket}.s3-accelerate.dualstack.us-east-1.{partitionResult#dnsSuffix}", [cB]: aC, [cH]: al }, [ct]: n }, { [cv]: [Y, as, W, aq, aD, aE], [cu]: [{ endpoint: aJ, [ct]: n }], [ct]: o }, { [cv]: [Y, as, W, aq, aD, aH], endpoint: aJ, [ct]: n }, { [cv]: [Y, as, aA, aq, aB], endpoint: { [cA]: "https://{Bucket}.s3.dualstack.us-east-1.{partitionResult#dnsSuffix}", [cB]: aC, [cH]: al }, [ct]: n }, { [cv]: [Y, as, aA, aq, aD, aE], [cu]: [{ endpoint: aK, [ct]: n }], [ct]: o }, { [cv]: [Y, as, aA, aq, aD, aH], endpoint: aK, [ct]: n }, { [cv]: [ar, as, aA, Z, ag, ah, aB], endpoint: { [cA]: C, [cB]: aC, [cH]: al }, [ct]: n }, { [cv]: [ar, as, aA, Z, ag, aL, aB], endpoint: { [cA]: q, [cB]: aC, [cH]: al }, [ct]: n }, { [cv]: [ar, as, aA, Z, ag, ah, aD, aE], [cu]: [{ [cv]: cd, endpoint: aM, [ct]: n }, { endpoint: aM, [ct]: n }], [ct]: o }, { [cv]: [ar, as, aA, Z, ag, aL, aD, aE], [cu]: [{ [cv]: cd, endpoint: aN, [ct]: n }, aO], [ct]: o }, { [cv]: [ar, as, aA, Z, ag, ah, aD, aH], endpoint: aM, [ct]: n }, { [cv]: [ar, as, aA, Z, ag, aL, aD, aH], endpoint: aN, [ct]: n }, { [cv]: [ar, as, W, aq, aB], endpoint: { [cA]: D, [cB]: aC, [cH]: al }, [ct]: n }, { [cv]: [ar, as, W, aq, aD, aE], [cu]: [{ [cv]: cd, endpoint: aP, [ct]: n }, { endpoint: aP, [ct]: n }], [ct]: o }, { [cv]: [ar, as, W, aq, aD, aH], endpoint: aP, [ct]: n }, { [cv]: [ar, as, aA, aq, aB], endpoint: { [cA]: E, [cB]: aC, [cH]: al }, [ct]: n }, { [cv]: [ar, as, aA, aq, aD, aE], [cu]: [{ [cv]: cd, endpoint: { [cA]: E, [cB]: aG, [cH]: al }, [ct]: n }, { endpoint: aQ, [ct]: n }], [ct]: o }, { [cv]: [ar, as, aA, aq, aD, aH], endpoint: aQ, [ct]: n }], [ct]: o }, aR], [ct]: o }], [ct]: o }, { [cv]: [Z, ag, { [cw]: h, [cx]: [{ [cw]: i, [cx]: [ai, "scheme"] }, "http"] }, { [cw]: p, [cx]: [ad, c] }, ay, as, ar, aA], [cu]: [{ [cv]: bG, [cu]: [{ [cv]: cc, [cu]: [aO], [ct]: o }, aR], [ct]: o }], [ct]: o }, { [cv]: [ay, { [cw]: F, [cx]: bA, [cz]: G }], [cu]: [{ [cv]: [{ [cw]: i, [cx]: [aS, "resourceId[0]"], [cz]: H }, { [cw]: r, [cx]: [{ [cw]: h, [cx]: [aT, I] }] }], [cu]: [{ [cv]: [{ [cw]: h, [cx]: [aU, J] }], [cu]: [{ [cv]: ce, [cu]: [{ [cv]: cf, [cu]: [aW, aX, { [cv]: ci, [cu]: [aY, { [cv]: cj, [cu]: [aZ, { [cv]: cl, [cu]: [{ [cv]: bG, [cu]: [{ [cv]: cm, [cu]: [{ [cv]: cn, [cu]: [{ [cv]: [{ [cw]: h, [cx]: [bb, I] }], error: "Invalid ARN: Missing account id", [ct]: f }, { [cv]: co, [cu]: [{ [cv]: cp, [cu]: [{ [cv]: bC, endpoint: { [cA]: M, [cB]: bc, [cH]: al }, [ct]: n }, { [cv]: cq, endpoint: { [cA]: "https://{accessPointName}-{bucketArn#accountId}.s3-object-lambda-fips.{bucketArn#region}.{bucketPartition#dnsSuffix}", [cB]: bc, [cH]: al }, [ct]: n }, { endpoint: { [cA]: "https://{accessPointName}-{bucketArn#accountId}.s3-object-lambda.{bucketArn#region}.{bucketPartition#dnsSuffix}", [cB]: bc, [cH]: al }, [ct]: n }], [ct]: o }, bd], [ct]: o }, be], [ct]: o }, bf], [ct]: o }, bg], [ct]: o }], [ct]: o }], [ct]: o }, bh], [ct]: o }, { error: "Invalid ARN: bucket ARN is missing a region", [ct]: f }], [ct]: o }, bi], [ct]: o }, { error: "Invalid ARN: Object Lambda ARNs only support `accesspoint` arn types, but found: `{arnType}`", [ct]: f }], [ct]: o }, { [cv]: ce, [cu]: [{ [cv]: cf, [cu]: [{ [cv]: ci, [cu]: [{ [cv]: ce, [cu]: [{ [cv]: ci, [cu]: [aY, { [cv]: cj, [cu]: [aZ, { [cv]: cl, [cu]: [{ [cv]: bG, [cu]: [{ [cv]: [{ [cw]: h, [cx]: [ba, "{partitionResult#name}"] }], [cu]: [{ [cv]: cn, [cu]: [{ [cv]: [{ [cw]: h, [cx]: [aU, B] }], [cu]: [{ [cv]: co, [cu]: [{ [cv]: cp, [cu]: [{ [cv]: bB, error: "Access Points do not support S3 Accelerate", [ct]: f }, { [cv]: bH, endpoint: { [cA]: "https://{accessPointName}-{bucketArn#accountId}.s3-accesspoint-fips.dualstack.{bucketArn#region}.{bucketPartition#dnsSuffix}", [cB]: bj, [cH]: al }, [ct]: n }, { [cv]: bI, endpoint: { [cA]: "https://{accessPointName}-{bucketArn#accountId}.s3-accesspoint-fips.{bucketArn#region}.{bucketPartition#dnsSuffix}", [cB]: bj, [cH]: al }, [ct]: n }, { [cv]: bJ, endpoint: { [cA]: "https://{accessPointName}-{bucketArn#accountId}.s3-accesspoint.dualstack.{bucketArn#region}.{bucketPartition#dnsSuffix}", [cB]: bj, [cH]: al }, [ct]: n }, { [cv]: [as, ar, Z, ag], endpoint: { [cA]: M, [cB]: bj, [cH]: al }, [ct]: n }, { [cv]: bK, endpoint: { [cA]: "https://{accessPointName}-{bucketArn#accountId}.s3-accesspoint.{bucketArn#region}.{bucketPartition#dnsSuffix}", [cB]: bj, [cH]: al }, [ct]: n }], [ct]: o }, bd], [ct]: o }, be], [ct]: o }, { error: "Invalid ARN: The ARN was not for the S3 service, found: {bucketArn#service}", [ct]: f }], [ct]: o }, bf], [ct]: o }, bg], [ct]: o }], [ct]: o }], [ct]: o }, bh], [ct]: o }], [ct]: o }], [ct]: o }, { [cv]: [{ [cw]: y, [cx]: [aV, c] }], [cu]: [{ [cv]: ch, error: "S3 MRAP does not support dual-stack", [ct]: f }, { [cv]: cq, error: "S3 MRAP does not support FIPS", [ct]: f }, { [cv]: bB, error: "S3 MRAP does not support S3 Accelerate", [ct]: f }, { [cv]: [{ [cw]: e, [cx]: [{ [cy]: "DisableMultiRegionAccessPoints" }, c] }], error: "Invalid configuration: Multi-Region Access Point ARNs are disabled.", [ct]: f }, { [cv]: [{ [cw]: g, [cx]: by, [cz]: N }], [cu]: [{ [cv]: [{ [cw]: h, [cx]: [{ [cw]: i, [cx]: [{ [cy]: N }, j] }, { [cw]: i, [cx]: [aS, "partition"] }] }], [cu]: [{ endpoint: { [cA]: "https://{accessPointName}.accesspoint.s3-global.{mrapPartition#dnsSuffix}", [cB]: { [cD]: [{ [cE]: c, name: z, [cF]: B, [cI]: cb }] }, [cH]: al }, [ct]: n }], [ct]: o }, { error: "Client was configured for partition `{mrapPartition#name}` but bucket referred to partition `{bucketArn#partition}`", [ct]: f }], [ct]: o }], [ct]: o }, { error: "Invalid Access Point Name", [ct]: f }], [ct]: o }, bi], [ct]: o }, { [cv]: [{ [cw]: h, [cx]: [aU, A] }], [cu]: [{ [cv]: ch, error: "S3 Outposts does not support Dual-stack", [ct]: f }, { [cv]: cq, error: "S3 Outposts does not support FIPS", [ct]: f }, { [cv]: bB, error: "S3 Outposts does not support S3 Accelerate", [ct]: f }, { [cv]: [{ [cw]: d, [cx]: [{ [cw]: i, [cx]: [aS, "resourceId[4]"] }] }], error: "Invalid Arn: Outpost Access Point ARN contains sub resources", [ct]: f }, { [cv]: [{ [cw]: i, [cx]: cg, [cz]: x }], [cu]: [{ [cv]: bZ, [cu]: [aZ, { [cv]: cl, [cu]: [{ [cv]: bG, [cu]: [{ [cv]: cm, [cu]: [{ [cv]: cn, [cu]: [{ [cv]: co, [cu]: [{ [cv]: [{ [cw]: i, [cx]: ck, [cz]: O }], [cu]: [{ [cv]: [{ [cw]: i, [cx]: [aS, "resourceId[3]"], [cz]: L }], [cu]: [{ [cv]: [{ [cw]: h, [cx]: [{ [cy]: O }, K] }], [cu]: [{ [cv]: bC, endpoint: { [cA]: "https://{accessPointName}-{bucketArn#accountId}.{outpostId}.{url#authority}", [cB]: bk, [cH]: al }, [ct]: n }, { endpoint: { [cA]: "https://{accessPointName}-{bucketArn#accountId}.{outpostId}.s3-outposts.{bucketArn#region}.{bucketPartition#dnsSuffix}", [cB]: bk, [cH]: al }, [ct]: n }], [ct]: o }, { error: "Expected an outpost type `accesspoint`, found {outpostType}", [ct]: f }], [ct]: o }, { error: "Invalid ARN: expected an access point name", [ct]: f }], [ct]: o }, { error: "Invalid ARN: Expected a 4-component resource", [ct]: f }], [ct]: o }, be], [ct]: o }, bf], [ct]: o }, bg], [ct]: o }], [ct]: o }], [ct]: o }, { error: "Invalid ARN: The outpost Id may only contain a-z, A-Z, 0-9 and `-`. Found: `{outpostId}`", [ct]: f }], [ct]: o }, { error: "Invalid ARN: The Outpost Id was not set", [ct]: f }], [ct]: o }, { error: "Invalid ARN: Unrecognized format: {Bucket} (type: {arnType})", [ct]: f }], [ct]: o }, { error: "Invalid ARN: No ARN type specified", [ct]: f }], [ct]: o }, { [cv]: [{ [cw]: k, [cx]: [ad, 0, 4, b], [cz]: P }, { [cw]: h, [cx]: [{ [cy]: P }, "arn:"] }, { [cw]: r, [cx]: [{ [cw]: d, [cx]: [bl] }] }], error: "Invalid ARN: `{Bucket}` was not a valid ARN", [ct]: f }, { [cv]: [{ [cw]: e, [cx]: [az, c] }, bl], error: "Path-style addressing cannot be used with ARN buckets", [ct]: f }, { [cv]: bE, [cu]: [{ [cv]: bG, [cu]: [{ [cv]: [aA], [cu]: [{ [cv]: [Y, aq, X, aB], endpoint: { [cA]: "https://s3-fips.dualstack.us-east-1.{partitionResult#dnsSuffix}/{uri_encoded_bucket}", [cB]: aC, [cH]: al }, [ct]: n }, { [cv]: [Y, aq, X, aD, aE], [cu]: [{ endpoint: bm, [ct]: n }], [ct]: o }, { [cv]: [Y, aq, X, aD, aH], endpoint: bm, [ct]: n }, { [cv]: [ar, aq, X, aB], endpoint: { [cA]: "https://s3-fips.us-east-1.{partitionResult#dnsSuffix}/{uri_encoded_bucket}", [cB]: aC, [cH]: al }, [ct]: n }, { [cv]: [ar, aq, X, aD, aE], [cu]: [{ endpoint: bn, [ct]: n }], [ct]: o }, { [cv]: [ar, aq, X, aD, aH], endpoint: bn, [ct]: n }, { [cv]: [Y, aq, as, aB], endpoint: { [cA]: "https://s3.dualstack.us-east-1.{partitionResult#dnsSuffix}/{uri_encoded_bucket}", [cB]: aC, [cH]: al }, [ct]: n }, { [cv]: [Y, aq, as, aD, aE], [cu]: [{ endpoint: bo, [ct]: n }], [ct]: o }, { [cv]: [Y, aq, as, aD, aH], endpoint: bo, [ct]: n }, { [cv]: [ar, Z, ag, as, aB], endpoint: { [cA]: Q, [cB]: aC, [cH]: al }, [ct]: n }, { [cv]: [ar, Z, ag, as, aD, aE], [cu]: [{ [cv]: cd, endpoint: bp, [ct]: n }, { endpoint: bp, [ct]: n }], [ct]: o }, { [cv]: [ar, Z, ag, as, aD, aH], endpoint: bp, [ct]: n }, { [cv]: [ar, aq, as, aB], endpoint: { [cA]: R, [cB]: aC, [cH]: al }, [ct]: n }, { [cv]: [ar, aq, as, aD, aE], [cu]: [{ [cv]: cd, endpoint: { [cA]: R, [cB]: aG, [cH]: al }, [ct]: n }, { endpoint: bq, [ct]: n }], [ct]: o }, { [cv]: [ar, aq, as, aD, aH], endpoint: bq, [ct]: n }], [ct]: o }, { error: "Path-style addressing cannot be used with S3 Accelerate", [ct]: f }], [ct]: o }], [ct]: o }], [ct]: o }, { [cv]: [{ [cw]: d, [cx]: [br] }, { [cw]: e, [cx]: [br, c] }], [cu]: [{ [cv]: bG, [cu]: [{ [cv]: cr, [cu]: [aW, aX, { [cv]: bC, endpoint: { [cA]: t, [cB]: bs, [cH]: al }, [ct]: n }, { [cv]: cq, endpoint: { [cA]: "https://s3-object-lambda-fips.{Region}.{partitionResult#dnsSuffix}", [cB]: bs, [cH]: al }, [ct]: n }, { endpoint: { [cA]: "https://s3-object-lambda.{Region}.{partitionResult#dnsSuffix}", [cB]: bs, [cH]: al }, [ct]: n }], [ct]: o }, aR], [ct]: o }], [ct]: o }, { [cv]: [au], [cu]: [{ [cv]: bG, [cu]: [{ [cv]: cr, [cu]: [{ [cv]: [X, Y, aq, aB], endpoint: { [cA]: "https://s3-fips.dualstack.us-east-1.{partitionResult#dnsSuffix}", [cB]: aC, [cH]: al }, [ct]: n }, { [cv]: [X, Y, aq, aD, aE], [cu]: [{ endpoint: bt, [ct]: n }], [ct]: o }, { [cv]: [X, Y, aq, aD, aH], endpoint: bt, [ct]: n }, { [cv]: [X, ar, aq, aB], endpoint: { [cA]: "https://s3-fips.us-east-1.{partitionResult#dnsSuffix}", [cB]: aC, [cH]: al }, [ct]: n }, { [cv]: [X, ar, aq, aD, aE], [cu]: [{ endpoint: bu, [ct]: n }], [ct]: o }, { [cv]: [X, ar, aq, aD, aH], endpoint: bu, [ct]: n }, { [cv]: [as, Y, aq, aB], endpoint: { [cA]: "https://s3.dualstack.us-east-1.{partitionResult#dnsSuffix}", [cB]: aC, [cH]: al }, [ct]: n }, { [cv]: [as, Y, aq, aD, aE], [cu]: [{ endpoint: bv, [ct]: n }], [ct]: o }, { [cv]: [as, Y, aq, aD, aH], endpoint: bv, [ct]: n }, { [cv]: [as, ar, Z, ag, aB], endpoint: { [cA]: t, [cB]: aC, [cH]: al }, [ct]: n }, { [cv]: [as, ar, Z, ag, aD, aE], [cu]: [{ [cv]: cd, endpoint: bw, [ct]: n }, { endpoint: bw, [ct]: n }], [ct]: o }, { [cv]: [as, ar, Z, ag, aD, aH], endpoint: bw, [ct]: n }, { [cv]: [as, ar, aq, aB], endpoint: { [cA]: S, [cB]: aC, [cH]: al }, [ct]: n }, { [cv]: [as, ar, aq, aD, aE], [cu]: [{ [cv]: cd, endpoint: { [cA]: S, [cB]: aG, [cH]: al }, [ct]: n }, { endpoint: bx, [ct]: n }], [ct]: o }, { [cv]: [as, ar, aq, aD, aH], endpoint: bx, [ct]: n }], [ct]: o }, aR], [ct]: o }], [ct]: o }], [ct]: o }, { error: "A region must be set when sending requests to S3.", [ct]: f }] };
const ruleSet = _data;
const cache = new EndpointCache({
  size: 50,
  params: [
    "Accelerate",
    "Bucket",
    "DisableAccessPoints",
    "DisableMultiRegionAccessPoints",
    "DisableS3ExpressSessionAuth",
    "Endpoint",
    "ForcePathStyle",
    "Region",
    "UseArnRegion",
    "UseDualStack",
    "UseFIPS",
    "UseGlobalEndpoint",
    "UseObjectLambdaEndpoint",
    "UseS3ExpressControlEndpoint"
  ]
});
const defaultEndpointResolver = (endpointParams, context = {}) => {
  return cache.get(endpointParams, () => resolveEndpoint(ruleSet, {
    endpointParams,
    logger: context.logger
  }));
};
customEndpointFunctions.aws = awsEndpointFunctions;
const createEndpointRuleSetHttpAuthSchemeParametersProvider = (defaultHttpAuthSchemeParametersProvider) => async (config, context, input) => {
  if (!input) {
    throw new Error("Could not find `input` for `defaultEndpointRuleSetHttpAuthSchemeParametersProvider`");
  }
  const defaultParameters = await defaultHttpAuthSchemeParametersProvider(config, context, input);
  const instructionsFn = getSmithyContext(context)?.commandInstance?.constructor?.getEndpointParameterInstructions;
  if (!instructionsFn) {
    throw new Error(`getEndpointParameterInstructions() is not defined on '${context.commandName}'`);
  }
  const endpointParameters = await resolveParams(input, { getEndpointParameterInstructions: instructionsFn }, config);
  return Object.assign(defaultParameters, endpointParameters);
};
const _defaultS3HttpAuthSchemeParametersProvider = async (config, context, input) => {
  return {
    operation: getSmithyContext(context).operation,
    region: await normalizeProvider$1(config.region)() || (() => {
      throw new Error("expected `region` to be configured for `aws.auth#sigv4`");
    })()
  };
};
const defaultS3HttpAuthSchemeParametersProvider = createEndpointRuleSetHttpAuthSchemeParametersProvider(_defaultS3HttpAuthSchemeParametersProvider);
function createAwsAuthSigv4HttpAuthOption(authParameters) {
  return {
    schemeId: "aws.auth#sigv4",
    signingProperties: {
      name: "s3",
      region: authParameters.region
    },
    propertiesExtractor: (config, context) => ({
      signingProperties: {
        config,
        context
      }
    })
  };
}
function createAwsAuthSigv4aHttpAuthOption(authParameters) {
  return {
    schemeId: "aws.auth#sigv4a",
    signingProperties: {
      name: "s3",
      region: authParameters.region
    },
    propertiesExtractor: (config, context) => ({
      signingProperties: {
        config,
        context
      }
    })
  };
}
const createEndpointRuleSetHttpAuthSchemeProvider = (defaultEndpointResolver2, defaultHttpAuthSchemeResolver, createHttpAuthOptionFunctions) => {
  const endpointRuleSetHttpAuthSchemeProvider = (authParameters) => {
    const endpoint = defaultEndpointResolver2(authParameters);
    const authSchemes = endpoint.properties?.authSchemes;
    if (!authSchemes) {
      return defaultHttpAuthSchemeResolver(authParameters);
    }
    const options = [];
    for (const scheme of authSchemes) {
      const { name: resolvedName, properties = {}, ...rest } = scheme;
      const name = resolvedName.toLowerCase();
      if (resolvedName !== name) {
        console.warn(`HttpAuthScheme has been normalized with lowercasing: '${resolvedName}' to '${name}'`);
      }
      let schemeId;
      if (name === "sigv4a") {
        schemeId = "aws.auth#sigv4a";
        const sigv4Present = authSchemes.find((s2) => {
          const name2 = s2.name.toLowerCase();
          return name2 !== "sigv4a" && name2.startsWith("sigv4");
        });
        if (SignatureV4MultiRegion.sigv4aDependency() === "none" && sigv4Present) {
          continue;
        }
      } else if (name.startsWith("sigv4")) {
        schemeId = "aws.auth#sigv4";
      } else {
        throw new Error(`Unknown HttpAuthScheme found in '@smithy.rules#endpointRuleSet': '${name}'`);
      }
      const createOption = createHttpAuthOptionFunctions[schemeId];
      if (!createOption) {
        throw new Error(`Could not find HttpAuthOption create function for '${schemeId}'`);
      }
      const option = createOption(authParameters);
      option.schemeId = schemeId;
      option.signingProperties = { ...option.signingProperties || {}, ...rest, ...properties };
      options.push(option);
    }
    return options;
  };
  return endpointRuleSetHttpAuthSchemeProvider;
};
const _defaultS3HttpAuthSchemeProvider = (authParameters) => {
  const options = [];
  switch (authParameters.operation) {
    default: {
      options.push(createAwsAuthSigv4HttpAuthOption(authParameters));
      options.push(createAwsAuthSigv4aHttpAuthOption(authParameters));
    }
  }
  return options;
};
const defaultS3HttpAuthSchemeProvider = createEndpointRuleSetHttpAuthSchemeProvider(defaultEndpointResolver, _defaultS3HttpAuthSchemeProvider, {
  "aws.auth#sigv4": createAwsAuthSigv4HttpAuthOption,
  "aws.auth#sigv4a": createAwsAuthSigv4aHttpAuthOption
});
const resolveHttpAuthSchemeConfig = (config) => {
  const config_0 = resolveAwsSdkSigV4Config(config);
  const config_1 = resolveAwsSdkSigV4AConfig(config_0);
  return Object.assign(config_1, {
    authSchemePreference: normalizeProvider$1(config.authSchemePreference ?? [])
  });
};
const resolveClientEndpointParameters = (options) => {
  return Object.assign(options, {
    useFipsEndpoint: options.useFipsEndpoint ?? false,
    useDualstackEndpoint: options.useDualstackEndpoint ?? false,
    forcePathStyle: options.forcePathStyle ?? false,
    useAccelerateEndpoint: options.useAccelerateEndpoint ?? false,
    useGlobalEndpoint: options.useGlobalEndpoint ?? false,
    disableMultiregionAccessPoints: options.disableMultiregionAccessPoints ?? false,
    defaultSigningName: "s3",
    clientContextParams: options.clientContextParams ?? {}
  });
};
const commonParams = {
  ForcePathStyle: { type: "clientContextParams", name: "forcePathStyle" },
  UseArnRegion: { type: "clientContextParams", name: "useArnRegion" },
  DisableMultiRegionAccessPoints: { type: "clientContextParams", name: "disableMultiregionAccessPoints" },
  Accelerate: { type: "clientContextParams", name: "useAccelerateEndpoint" },
  DisableS3ExpressSessionAuth: { type: "clientContextParams", name: "disableS3ExpressSessionAuth" },
  UseGlobalEndpoint: { type: "builtInParams", name: "useGlobalEndpoint" },
  UseFIPS: { type: "builtInParams", name: "useFipsEndpoint" },
  Endpoint: { type: "builtInParams", name: "endpoint" },
  Region: { type: "builtInParams", name: "region" },
  UseDualStack: { type: "builtInParams", name: "useDualstackEndpoint" }
};
class S3ServiceException extends ServiceException {
  constructor(options) {
    super(options);
    Object.setPrototypeOf(this, S3ServiceException.prototype);
  }
}
class NoSuchUpload extends S3ServiceException {
  name = "NoSuchUpload";
  $fault = "client";
  constructor(opts) {
    super({
      name: "NoSuchUpload",
      $fault: "client",
      ...opts
    });
    Object.setPrototypeOf(this, NoSuchUpload.prototype);
  }
}
class AccessDenied extends S3ServiceException {
  name = "AccessDenied";
  $fault = "client";
  constructor(opts) {
    super({
      name: "AccessDenied",
      $fault: "client",
      ...opts
    });
    Object.setPrototypeOf(this, AccessDenied.prototype);
  }
}
class ObjectNotInActiveTierError extends S3ServiceException {
  name = "ObjectNotInActiveTierError";
  $fault = "client";
  constructor(opts) {
    super({
      name: "ObjectNotInActiveTierError",
      $fault: "client",
      ...opts
    });
    Object.setPrototypeOf(this, ObjectNotInActiveTierError.prototype);
  }
}
class BucketAlreadyExists extends S3ServiceException {
  name = "BucketAlreadyExists";
  $fault = "client";
  constructor(opts) {
    super({
      name: "BucketAlreadyExists",
      $fault: "client",
      ...opts
    });
    Object.setPrototypeOf(this, BucketAlreadyExists.prototype);
  }
}
class BucketAlreadyOwnedByYou extends S3ServiceException {
  name = "BucketAlreadyOwnedByYou";
  $fault = "client";
  constructor(opts) {
    super({
      name: "BucketAlreadyOwnedByYou",
      $fault: "client",
      ...opts
    });
    Object.setPrototypeOf(this, BucketAlreadyOwnedByYou.prototype);
  }
}
class NoSuchBucket extends S3ServiceException {
  name = "NoSuchBucket";
  $fault = "client";
  constructor(opts) {
    super({
      name: "NoSuchBucket",
      $fault: "client",
      ...opts
    });
    Object.setPrototypeOf(this, NoSuchBucket.prototype);
  }
}
class InvalidObjectState extends S3ServiceException {
  name = "InvalidObjectState";
  $fault = "client";
  StorageClass;
  AccessTier;
  constructor(opts) {
    super({
      name: "InvalidObjectState",
      $fault: "client",
      ...opts
    });
    Object.setPrototypeOf(this, InvalidObjectState.prototype);
    this.StorageClass = opts.StorageClass;
    this.AccessTier = opts.AccessTier;
  }
}
class NoSuchKey extends S3ServiceException {
  name = "NoSuchKey";
  $fault = "client";
  constructor(opts) {
    super({
      name: "NoSuchKey",
      $fault: "client",
      ...opts
    });
    Object.setPrototypeOf(this, NoSuchKey.prototype);
  }
}
class NotFound extends S3ServiceException {
  name = "NotFound";
  $fault = "client";
  constructor(opts) {
    super({
      name: "NotFound",
      $fault: "client",
      ...opts
    });
    Object.setPrototypeOf(this, NotFound.prototype);
  }
}
class EncryptionTypeMismatch extends S3ServiceException {
  name = "EncryptionTypeMismatch";
  $fault = "client";
  constructor(opts) {
    super({
      name: "EncryptionTypeMismatch",
      $fault: "client",
      ...opts
    });
    Object.setPrototypeOf(this, EncryptionTypeMismatch.prototype);
  }
}
class InvalidRequest extends S3ServiceException {
  name = "InvalidRequest";
  $fault = "client";
  constructor(opts) {
    super({
      name: "InvalidRequest",
      $fault: "client",
      ...opts
    });
    Object.setPrototypeOf(this, InvalidRequest.prototype);
  }
}
class InvalidWriteOffset extends S3ServiceException {
  name = "InvalidWriteOffset";
  $fault = "client";
  constructor(opts) {
    super({
      name: "InvalidWriteOffset",
      $fault: "client",
      ...opts
    });
    Object.setPrototypeOf(this, InvalidWriteOffset.prototype);
  }
}
class TooManyParts extends S3ServiceException {
  name = "TooManyParts";
  $fault = "client";
  constructor(opts) {
    super({
      name: "TooManyParts",
      $fault: "client",
      ...opts
    });
    Object.setPrototypeOf(this, TooManyParts.prototype);
  }
}
class IdempotencyParameterMismatch extends S3ServiceException {
  name = "IdempotencyParameterMismatch";
  $fault = "client";
  constructor(opts) {
    super({
      name: "IdempotencyParameterMismatch",
      $fault: "client",
      ...opts
    });
    Object.setPrototypeOf(this, IdempotencyParameterMismatch.prototype);
  }
}
class ObjectAlreadyInActiveTierError extends S3ServiceException {
  name = "ObjectAlreadyInActiveTierError";
  $fault = "client";
  constructor(opts) {
    super({
      name: "ObjectAlreadyInActiveTierError",
      $fault: "client",
      ...opts
    });
    Object.setPrototypeOf(this, ObjectAlreadyInActiveTierError.prototype);
  }
}
const _ACL_ = "ACL";
const _AD = "AccessDenied";
const _AKI = "AccessKeyId";
const _AR = "AcceptRanges";
const _AT = "AccessTier";
const _B = "Bucket";
const _BAE = "BucketAlreadyExists";
const _BAOBY = "BucketAlreadyOwnedByYou";
const _BGR = "BypassGovernanceRetention";
const _BKE = "BucketKeyEnabled";
const _Bo = "Body";
const _CA = "ChecksumAlgorithm";
const _CC = "CacheControl";
const _CCRC = "ChecksumCRC32";
const _CCRCC = "ChecksumCRC32C";
const _CCRCNVME = "ChecksumCRC64NVME";
const _CC_ = "Cache-Control";
const _CD_ = "Content-Disposition";
const _CDo = "ContentDisposition";
const _CE_ = "Content-Encoding";
const _CEo = "ContentEncoding";
const _CL = "ContentLanguage";
const _CL_ = "Content-Language";
const _CL__ = "Content-Length";
const _CLo = "ContentLength";
const _CM = "Content-MD5";
const _CMD = "ContentMD5";
const _CMh = "ChecksumMode";
const _CO = "CopyObject";
const _COO = "CopyObjectOutput";
const _COR = "CopyObjectResult";
const _CORo = "CopyObjectRequest";
const _CP = "CommonPrefix";
const _CPL = "CommonPrefixList";
const _CPom = "CommonPrefixes";
const _CR = "ContentRange";
const _CR_ = "Content-Range";
const _CS = "CopySource";
const _CSHA = "ChecksumSHA1";
const _CSHAh = "ChecksumSHA256";
const _CSIM = "CopySourceIfMatch";
const _CSIMS = "CopySourceIfModifiedSince";
const _CSINM = "CopySourceIfNoneMatch";
const _CSIUS = "CopySourceIfUnmodifiedSince";
const _CSO = "CreateSessionOutput";
const _CSR = "CreateSessionResult";
const _CSRr = "CreateSessionRequest";
const _CSSSECA = "CopySourceSSECustomerAlgorithm";
const _CSSSECK = "CopySourceSSECustomerKey";
const _CSSSECKMD = "CopySourceSSECustomerKeyMD5";
const _CSVI = "CopySourceVersionId";
const _CSr = "CreateSession";
const _CT = "ChecksumType";
const _CT_ = "Content-Type";
const _CTo = "ContentType";
const _CTon = "ContinuationToken";
const _Cod = "Code";
const _Con = "Contents";
const _Cr = "Credentials";
const _DM = "DeleteMarker";
const _DMVI = "DeleteMarkerVersionId";
const _DN = "DisplayName";
const _DO = "DeletedObject";
const _DOO = "DeleteObjectOutput";
const _DOOe = "DeleteObjectsOutput";
const _DOR = "DeleteObjectRequest";
const _DORe = "DeleteObjectsRequest";
const _DOe = "DeletedObjects";
const _DOel = "DeleteObject";
const _DOele = "DeleteObjects";
const _DRel = "DeleteResult";
const _De = "Delete";
const _Del = "Deleted";
const _Deli = "Delimiter";
const _E = "Expiration";
const _EBO = "ExpectedBucketOwner";
const _ES = "ExpiresString";
const _ESBO = "ExpectedSourceBucketOwner";
const _ETM = "EncryptionTypeMismatch";
const _ETa = "ETag";
const _ETn = "EncodingType";
const _Er = "Errors";
const _Err = "Error";
const _Ex = "Expires";
const _FO = "FetchOwner";
const _GFC = "GrantFullControl";
const _GO = "GetObject";
const _GOO = "GetObjectOutput";
const _GOR = "GetObjectRequest";
const _GR = "GrantRead";
const _GRACP = "GrantReadACP";
const _GWACP = "GrantWriteACP";
const _ID = "ID";
const _IM = "IfMatch";
const _IMLMT = "IfMatchLastModifiedTime";
const _IMS = "IfMatchSize";
const _IMS_ = "If-Modified-Since";
const _IMSf = "IfModifiedSince";
const _IM_ = "If-Match";
const _INM = "IfNoneMatch";
const _INM_ = "If-None-Match";
const _IOS = "InvalidObjectState";
const _IPM = "IdempotencyParameterMismatch";
const _IR = "InvalidRequest";
const _IRIP = "IsRestoreInProgress";
const _IT = "IsTruncated";
const _IUS = "IfUnmodifiedSince";
const _IUS_ = "If-Unmodified-Since";
const _IWO = "InvalidWriteOffset";
const _K = "Key";
const _KC = "KeyCount";
const _LBRi = "ListBucketResult";
const _LM = "LastModified";
const _LMT = "LastModifiedTime";
const _LM_ = "Last-Modified";
const _LOV = "ListObjectsV2";
const _LOVO = "ListObjectsV2Output";
const _LOVR = "ListObjectsV2Request";
const _M = "Metadata";
const _MD = "MetadataDirective";
const _MFA = "MFA";
const _MK = "MaxKeys";
const _MM = "MissingMeta";
const _Mes = "Message";
const _N = "Name";
const _NCT = "NextContinuationToken";
const _NF = "NotFound";
const _NSB = "NoSuchBucket";
const _NSK = "NoSuchKey";
const _NSU = "NoSuchUpload";
const _O = "Owner";
const _OAIATE = "ObjectAlreadyInActiveTierError";
const _OI = "ObjectIdentifier";
const _OIL = "ObjectIdentifierList";
const _OLLHS = "ObjectLockLegalHoldStatus";
const _OLM = "ObjectLockMode";
const _OLRUD = "ObjectLockRetainUntilDate";
const _OLb = "ObjectList";
const _ONIATE = "ObjectNotInActiveTierError";
const _OOA = "OptionalObjectAttributes";
const _Ob = "Objects";
const _Obj = "Object";
const _P = "Prefix";
const _PC = "PartsCount";
const _PN = "PartNumber";
const _PO = "PutObject";
const _POO = "PutObjectOutput";
const _POR = "PutObjectRequest";
const _Q = "Quiet";
const _RC = "RequestCharged";
const _RCC = "ResponseCacheControl";
const _RCD = "ResponseContentDisposition";
const _RCE = "ResponseContentEncoding";
const _RCL = "ResponseContentLanguage";
const _RCT = "ResponseContentType";
const _RE = "ResponseExpires";
const _RED = "RestoreExpiryDate";
const _RP = "RequestPayer";
const _RS = "ReplicationStatus";
const _RSe = "RestoreStatus";
const _Ra = "Range";
const _Re = "Restore";
const _SA = "StartAfter";
const _SAK = "SecretAccessKey";
const _SB = "StreamingBlob";
const _SC = "StorageClass";
const _SCV = "SessionCredentialValue";
const _SCe = "SessionCredentials";
const _SM = "SessionMode";
const _SSE = "ServerSideEncryption";
const _SSECA = "SSECustomerAlgorithm";
const _SSECK = "SSECustomerKey";
const _SSECKMD = "SSECustomerKeyMD5";
const _SSEKMSEC = "SSEKMSEncryptionContext";
const _SSEKMSKI = "SSEKMSKeyId";
const _ST = "SessionToken";
const _Si = "Size";
const _TC = "TagCount";
const _TD = "TaggingDirective";
const _TMP = "TooManyParts";
const _Tag = "Tagging";
const _VI = "VersionId";
const _WOB = "WriteOffsetBytes";
const _WRL = "WebsiteRedirectLocation";
const _ar = "accept-ranges";
const _c = "client";
const _ct = "continuation-token";
const _d = "delimiter";
const _e = "error";
const _et = "encoding-type";
const _fo = "fetch-owner";
const _h = "http";
const _hC = "httpChecksum";
const _hE = "httpError";
const _hH = "httpHeader";
const _hP = "httpPayload";
const _hPH = "httpPrefixHeaders";
const _hQ = "httpQuery";
const _mk = "max-keys";
const _p = "prefix";
const _pN = "partNumber";
const _rcc = "response-cache-control";
const _rcd = "response-content-disposition";
const _rce = "response-content-encoding";
const _rcl = "response-content-language";
const _rct = "response-content-type";
const _re = "response-expires";
const _s = "smithy.ts.sdk.synthetic.com.amazonaws.s3";
const _sa = "start-after";
const _st = "streaming";
const _vI = "versionId";
const _xF = "xmlFlattened";
const _xN = "xmlName";
const _xaa = "x-amz-acl";
const _xabgr = "x-amz-bypass-governance-retention";
const _xaca = "x-amz-checksum-algorithm";
const _xacc = "x-amz-checksum-crc32";
const _xacc_ = "x-amz-checksum-crc32c";
const _xacc__ = "x-amz-checksum-crc64nvme";
const _xacm = "x-amz-checksum-mode";
const _xacs = "x-amz-checksum-sha1";
const _xacs_ = "x-amz-checksum-sha256";
const _xacs__ = "x-amz-copy-source";
const _xacsim = "x-amz-copy-source-if-match";
const _xacsims = "x-amz-copy-source-if-modified-since";
const _xacsinm = "x-amz-copy-source-if-none-match";
const _xacsius = "x-amz-copy-source-if-unmodified-since";
const _xacsm = "x-amz-create-session-mode";
const _xacssseca = "x-amz-copy-source-server-side-encryption-customer-algorithm";
const _xacssseck = "x-amz-copy-source-server-side-encryption-customer-key";
const _xacssseckM = "x-amz-copy-source-server-side-encryption-customer-key-MD5";
const _xacsvi = "x-amz-copy-source-version-id";
const _xact = "x-amz-checksum-type";
const _xadm = "x-amz-delete-marker";
const _xae = "x-amz-expiration";
const _xaebo = "x-amz-expected-bucket-owner";
const _xagfc = "x-amz-grant-full-control";
const _xagr = "x-amz-grant-read";
const _xagra = "x-amz-grant-read-acp";
const _xagwa = "x-amz-grant-write-acp";
const _xaimlmt = "x-amz-if-match-last-modified-time";
const _xaims = "x-amz-if-match-size";
const _xam = "x-amz-meta-";
const _xam_ = "x-amz-mfa";
const _xamd = "x-amz-metadata-directive";
const _xamm = "x-amz-missing-meta";
const _xampc = "x-amz-mp-parts-count";
const _xaollh = "x-amz-object-lock-legal-hold";
const _xaolm = "x-amz-object-lock-mode";
const _xaolrud = "x-amz-object-lock-retain-until-date";
const _xaooa = "x-amz-optional-object-attributes";
const _xaos = "x-amz-object-size";
const _xar = "x-amz-restore";
const _xarc = "x-amz-request-charged";
const _xarp = "x-amz-request-payer";
const _xars = "x-amz-replication-status";
const _xasc = "x-amz-storage-class";
const _xasca = "x-amz-sdk-checksum-algorithm";
const _xasebo = "x-amz-source-expected-bucket-owner";
const _xasse = "x-amz-server-side-encryption";
const _xasseakki = "x-amz-server-side-encryption-aws-kms-key-id";
const _xassebke = "x-amz-server-side-encryption-bucket-key-enabled";
const _xassec = "x-amz-server-side-encryption-context";
const _xasseca = "x-amz-server-side-encryption-customer-algorithm";
const _xasseck = "x-amz-server-side-encryption-customer-key";
const _xasseckM = "x-amz-server-side-encryption-customer-key-MD5";
const _xat = "x-amz-tagging";
const _xatc = "x-amz-tagging-count";
const _xatd = "x-amz-tagging-directive";
const _xavi = "x-amz-version-id";
const _xawob = "x-amz-write-offset-bytes";
const _xawrl = "x-amz-website-redirect-location";
const n0 = "com.amazonaws.s3";
const _s_registry = TypeRegistry.for(_s);
var S3ServiceException$ = [-3, _s, "S3ServiceException", 0, [], []];
_s_registry.registerError(S3ServiceException$, S3ServiceException);
const n0_registry = TypeRegistry.for(n0);
var AccessDenied$ = [
  -3,
  n0,
  _AD,
  { [_e]: _c, [_hE]: 403 },
  [],
  []
];
n0_registry.registerError(AccessDenied$, AccessDenied);
var BucketAlreadyExists$ = [
  -3,
  n0,
  _BAE,
  { [_e]: _c, [_hE]: 409 },
  [],
  []
];
n0_registry.registerError(BucketAlreadyExists$, BucketAlreadyExists);
var BucketAlreadyOwnedByYou$ = [
  -3,
  n0,
  _BAOBY,
  { [_e]: _c, [_hE]: 409 },
  [],
  []
];
n0_registry.registerError(BucketAlreadyOwnedByYou$, BucketAlreadyOwnedByYou);
var EncryptionTypeMismatch$ = [
  -3,
  n0,
  _ETM,
  { [_e]: _c, [_hE]: 400 },
  [],
  []
];
n0_registry.registerError(EncryptionTypeMismatch$, EncryptionTypeMismatch);
var IdempotencyParameterMismatch$ = [
  -3,
  n0,
  _IPM,
  { [_e]: _c, [_hE]: 400 },
  [],
  []
];
n0_registry.registerError(IdempotencyParameterMismatch$, IdempotencyParameterMismatch);
var InvalidObjectState$ = [
  -3,
  n0,
  _IOS,
  { [_e]: _c, [_hE]: 403 },
  [_SC, _AT],
  [0, 0]
];
n0_registry.registerError(InvalidObjectState$, InvalidObjectState);
var InvalidRequest$ = [
  -3,
  n0,
  _IR,
  { [_e]: _c, [_hE]: 400 },
  [],
  []
];
n0_registry.registerError(InvalidRequest$, InvalidRequest);
var InvalidWriteOffset$ = [
  -3,
  n0,
  _IWO,
  { [_e]: _c, [_hE]: 400 },
  [],
  []
];
n0_registry.registerError(InvalidWriteOffset$, InvalidWriteOffset);
var NoSuchBucket$ = [
  -3,
  n0,
  _NSB,
  { [_e]: _c, [_hE]: 404 },
  [],
  []
];
n0_registry.registerError(NoSuchBucket$, NoSuchBucket);
var NoSuchKey$ = [
  -3,
  n0,
  _NSK,
  { [_e]: _c, [_hE]: 404 },
  [],
  []
];
n0_registry.registerError(NoSuchKey$, NoSuchKey);
var NoSuchUpload$ = [
  -3,
  n0,
  _NSU,
  { [_e]: _c, [_hE]: 404 },
  [],
  []
];
n0_registry.registerError(NoSuchUpload$, NoSuchUpload);
var NotFound$ = [
  -3,
  n0,
  _NF,
  { [_e]: _c },
  [],
  []
];
n0_registry.registerError(NotFound$, NotFound);
var ObjectAlreadyInActiveTierError$ = [
  -3,
  n0,
  _OAIATE,
  { [_e]: _c, [_hE]: 403 },
  [],
  []
];
n0_registry.registerError(ObjectAlreadyInActiveTierError$, ObjectAlreadyInActiveTierError);
var ObjectNotInActiveTierError$ = [
  -3,
  n0,
  _ONIATE,
  { [_e]: _c, [_hE]: 403 },
  [],
  []
];
n0_registry.registerError(ObjectNotInActiveTierError$, ObjectNotInActiveTierError);
var TooManyParts$ = [
  -3,
  n0,
  _TMP,
  { [_e]: _c, [_hE]: 400 },
  [],
  []
];
n0_registry.registerError(TooManyParts$, TooManyParts);
const errorTypeRegistries = [
  _s_registry,
  n0_registry
];
var CopySourceSSECustomerKey = [0, n0, _CSSSECK, 8, 0];
var SessionCredentialValue = [0, n0, _SCV, 8, 0];
var SSECustomerKey = [0, n0, _SSECK, 8, 0];
var SSEKMSEncryptionContext = [0, n0, _SSEKMSEC, 8, 0];
var SSEKMSKeyId = [0, n0, _SSEKMSKI, 8, 0];
var StreamingBlob = [0, n0, _SB, { [_st]: 1 }, 42];
var CommonPrefix$ = [
  3,
  n0,
  _CP,
  0,
  [_P],
  [0]
];
var CopyObjectOutput$ = [
  3,
  n0,
  _COO,
  0,
  [_COR, _E, _CSVI, _VI, _SSE, _SSECA, _SSECKMD, _SSEKMSKI, _SSEKMSEC, _BKE, _RC],
  [[() => CopyObjectResult$, 16], [0, { [_hH]: _xae }], [0, { [_hH]: _xacsvi }], [0, { [_hH]: _xavi }], [0, { [_hH]: _xasse }], [0, { [_hH]: _xasseca }], [0, { [_hH]: _xasseckM }], [() => SSEKMSKeyId, { [_hH]: _xasseakki }], [() => SSEKMSEncryptionContext, { [_hH]: _xassec }], [2, { [_hH]: _xassebke }], [0, { [_hH]: _xarc }]]
];
var CopyObjectRequest$ = [
  3,
  n0,
  _CORo,
  0,
  [_B, _CS, _K, _ACL_, _CC, _CA, _CDo, _CEo, _CL, _CTo, _CSIM, _CSIMS, _CSINM, _CSIUS, _Ex, _GFC, _GR, _GRACP, _GWACP, _IM, _INM, _M, _MD, _TD, _SSE, _SC, _WRL, _SSECA, _SSECK, _SSECKMD, _SSEKMSKI, _SSEKMSEC, _BKE, _CSSSECA, _CSSSECK, _CSSSECKMD, _RP, _Tag, _OLM, _OLRUD, _OLLHS, _EBO, _ESBO],
  [[0, 1], [0, { [_hH]: _xacs__ }], [0, 1], [0, { [_hH]: _xaa }], [0, { [_hH]: _CC_ }], [0, { [_hH]: _xaca }], [0, { [_hH]: _CD_ }], [0, { [_hH]: _CE_ }], [0, { [_hH]: _CL_ }], [0, { [_hH]: _CT_ }], [0, { [_hH]: _xacsim }], [4, { [_hH]: _xacsims }], [0, { [_hH]: _xacsinm }], [4, { [_hH]: _xacsius }], [4, { [_hH]: _Ex }], [0, { [_hH]: _xagfc }], [0, { [_hH]: _xagr }], [0, { [_hH]: _xagra }], [0, { [_hH]: _xagwa }], [0, { [_hH]: _IM_ }], [0, { [_hH]: _INM_ }], [128 | 0, { [_hPH]: _xam }], [0, { [_hH]: _xamd }], [0, { [_hH]: _xatd }], [0, { [_hH]: _xasse }], [0, { [_hH]: _xasc }], [0, { [_hH]: _xawrl }], [0, { [_hH]: _xasseca }], [() => SSECustomerKey, { [_hH]: _xasseck }], [0, { [_hH]: _xasseckM }], [() => SSEKMSKeyId, { [_hH]: _xasseakki }], [() => SSEKMSEncryptionContext, { [_hH]: _xassec }], [2, { [_hH]: _xassebke }], [0, { [_hH]: _xacssseca }], [() => CopySourceSSECustomerKey, { [_hH]: _xacssseck }], [0, { [_hH]: _xacssseckM }], [0, { [_hH]: _xarp }], [0, { [_hH]: _xat }], [0, { [_hH]: _xaolm }], [5, { [_hH]: _xaolrud }], [0, { [_hH]: _xaollh }], [0, { [_hH]: _xaebo }], [0, { [_hH]: _xasebo }]],
  3
];
var CopyObjectResult$ = [
  3,
  n0,
  _COR,
  0,
  [_ETa, _LM, _CT, _CCRC, _CCRCC, _CCRCNVME, _CSHA, _CSHAh],
  [0, 4, 0, 0, 0, 0, 0, 0]
];
var CreateSessionOutput$ = [
  3,
  n0,
  _CSO,
  { [_xN]: _CSR },
  [_Cr, _SSE, _SSEKMSKI, _SSEKMSEC, _BKE],
  [[() => SessionCredentials$, { [_xN]: _Cr }], [0, { [_hH]: _xasse }], [() => SSEKMSKeyId, { [_hH]: _xasseakki }], [() => SSEKMSEncryptionContext, { [_hH]: _xassec }], [2, { [_hH]: _xassebke }]],
  1
];
var CreateSessionRequest$ = [
  3,
  n0,
  _CSRr,
  0,
  [_B, _SM, _SSE, _SSEKMSKI, _SSEKMSEC, _BKE],
  [[0, 1], [0, { [_hH]: _xacsm }], [0, { [_hH]: _xasse }], [() => SSEKMSKeyId, { [_hH]: _xasseakki }], [() => SSEKMSEncryptionContext, { [_hH]: _xassec }], [2, { [_hH]: _xassebke }]],
  1
];
var Delete$ = [
  3,
  n0,
  _De,
  0,
  [_Ob, _Q],
  [[() => ObjectIdentifierList, { [_xF]: 1, [_xN]: _Obj }], 2],
  1
];
var DeletedObject$ = [
  3,
  n0,
  _DO,
  0,
  [_K, _VI, _DM, _DMVI],
  [0, 0, 2, 0]
];
var DeleteObjectOutput$ = [
  3,
  n0,
  _DOO,
  0,
  [_DM, _VI, _RC],
  [[2, { [_hH]: _xadm }], [0, { [_hH]: _xavi }], [0, { [_hH]: _xarc }]]
];
var DeleteObjectRequest$ = [
  3,
  n0,
  _DOR,
  0,
  [_B, _K, _MFA, _VI, _RP, _BGR, _EBO, _IM, _IMLMT, _IMS],
  [[0, 1], [0, 1], [0, { [_hH]: _xam_ }], [0, { [_hQ]: _vI }], [0, { [_hH]: _xarp }], [2, { [_hH]: _xabgr }], [0, { [_hH]: _xaebo }], [0, { [_hH]: _IM_ }], [6, { [_hH]: _xaimlmt }], [1, { [_hH]: _xaims }]],
  2
];
var DeleteObjectsOutput$ = [
  3,
  n0,
  _DOOe,
  { [_xN]: _DRel },
  [_Del, _RC, _Er],
  [[() => DeletedObjects, { [_xF]: 1 }], [0, { [_hH]: _xarc }], [() => Errors, { [_xF]: 1, [_xN]: _Err }]]
];
var DeleteObjectsRequest$ = [
  3,
  n0,
  _DORe,
  0,
  [_B, _De, _MFA, _RP, _BGR, _EBO, _CA],
  [[0, 1], [() => Delete$, { [_hP]: 1, [_xN]: _De }], [0, { [_hH]: _xam_ }], [0, { [_hH]: _xarp }], [2, { [_hH]: _xabgr }], [0, { [_hH]: _xaebo }], [0, { [_hH]: _xasca }]],
  2
];
var _Error$ = [
  3,
  n0,
  _Err,
  0,
  [_K, _VI, _Cod, _Mes],
  [0, 0, 0, 0]
];
var GetObjectOutput$ = [
  3,
  n0,
  _GOO,
  0,
  [_Bo, _DM, _AR, _E, _Re, _LM, _CLo, _ETa, _CCRC, _CCRCC, _CCRCNVME, _CSHA, _CSHAh, _CT, _MM, _VI, _CC, _CDo, _CEo, _CL, _CR, _CTo, _Ex, _ES, _WRL, _SSE, _M, _SSECA, _SSECKMD, _SSEKMSKI, _BKE, _SC, _RC, _RS, _PC, _TC, _OLM, _OLRUD, _OLLHS],
  [[() => StreamingBlob, 16], [2, { [_hH]: _xadm }], [0, { [_hH]: _ar }], [0, { [_hH]: _xae }], [0, { [_hH]: _xar }], [4, { [_hH]: _LM_ }], [1, { [_hH]: _CL__ }], [0, { [_hH]: _ETa }], [0, { [_hH]: _xacc }], [0, { [_hH]: _xacc_ }], [0, { [_hH]: _xacc__ }], [0, { [_hH]: _xacs }], [0, { [_hH]: _xacs_ }], [0, { [_hH]: _xact }], [1, { [_hH]: _xamm }], [0, { [_hH]: _xavi }], [0, { [_hH]: _CC_ }], [0, { [_hH]: _CD_ }], [0, { [_hH]: _CE_ }], [0, { [_hH]: _CL_ }], [0, { [_hH]: _CR_ }], [0, { [_hH]: _CT_ }], [4, { [_hH]: _Ex }], [0, { [_hH]: _ES }], [0, { [_hH]: _xawrl }], [0, { [_hH]: _xasse }], [128 | 0, { [_hPH]: _xam }], [0, { [_hH]: _xasseca }], [0, { [_hH]: _xasseckM }], [() => SSEKMSKeyId, { [_hH]: _xasseakki }], [2, { [_hH]: _xassebke }], [0, { [_hH]: _xasc }], [0, { [_hH]: _xarc }], [0, { [_hH]: _xars }], [1, { [_hH]: _xampc }], [1, { [_hH]: _xatc }], [0, { [_hH]: _xaolm }], [5, { [_hH]: _xaolrud }], [0, { [_hH]: _xaollh }]]
];
var GetObjectRequest$ = [
  3,
  n0,
  _GOR,
  0,
  [_B, _K, _IM, _IMSf, _INM, _IUS, _Ra, _RCC, _RCD, _RCE, _RCL, _RCT, _RE, _VI, _SSECA, _SSECK, _SSECKMD, _RP, _PN, _EBO, _CMh],
  [[0, 1], [0, 1], [0, { [_hH]: _IM_ }], [4, { [_hH]: _IMS_ }], [0, { [_hH]: _INM_ }], [4, { [_hH]: _IUS_ }], [0, { [_hH]: _Ra }], [0, { [_hQ]: _rcc }], [0, { [_hQ]: _rcd }], [0, { [_hQ]: _rce }], [0, { [_hQ]: _rcl }], [0, { [_hQ]: _rct }], [6, { [_hQ]: _re }], [0, { [_hQ]: _vI }], [0, { [_hH]: _xasseca }], [() => SSECustomerKey, { [_hH]: _xasseck }], [0, { [_hH]: _xasseckM }], [0, { [_hH]: _xarp }], [1, { [_hQ]: _pN }], [0, { [_hH]: _xaebo }], [0, { [_hH]: _xacm }]],
  2
];
var ListObjectsV2Output$ = [
  3,
  n0,
  _LOVO,
  { [_xN]: _LBRi },
  [_IT, _Con, _N, _P, _Deli, _MK, _CPom, _ETn, _KC, _CTon, _NCT, _SA, _RC],
  [2, [() => ObjectList, { [_xF]: 1 }], 0, 0, 0, 1, [() => CommonPrefixList, { [_xF]: 1 }], 0, 1, 0, 0, 0, [0, { [_hH]: _xarc }]]
];
var ListObjectsV2Request$ = [
  3,
  n0,
  _LOVR,
  0,
  [_B, _Deli, _ETn, _MK, _P, _CTon, _FO, _SA, _RP, _EBO, _OOA],
  [[0, 1], [0, { [_hQ]: _d }], [0, { [_hQ]: _et }], [1, { [_hQ]: _mk }], [0, { [_hQ]: _p }], [0, { [_hQ]: _ct }], [2, { [_hQ]: _fo }], [0, { [_hQ]: _sa }], [0, { [_hH]: _xarp }], [0, { [_hH]: _xaebo }], [64 | 0, { [_hH]: _xaooa }]],
  1
];
var _Object$ = [
  3,
  n0,
  _Obj,
  0,
  [_K, _LM, _ETa, _CA, _CT, _Si, _SC, _O, _RSe],
  [0, 4, 0, [64 | 0, { [_xF]: 1 }], 0, 1, 0, () => Owner$, () => RestoreStatus$]
];
var ObjectIdentifier$ = [
  3,
  n0,
  _OI,
  0,
  [_K, _VI, _ETa, _LMT, _Si],
  [0, 0, 0, 6, 1],
  1
];
var Owner$ = [
  3,
  n0,
  _O,
  0,
  [_DN, _ID],
  [0, 0]
];
var PutObjectOutput$ = [
  3,
  n0,
  _POO,
  0,
  [_E, _ETa, _CCRC, _CCRCC, _CCRCNVME, _CSHA, _CSHAh, _CT, _SSE, _VI, _SSECA, _SSECKMD, _SSEKMSKI, _SSEKMSEC, _BKE, _Si, _RC],
  [[0, { [_hH]: _xae }], [0, { [_hH]: _ETa }], [0, { [_hH]: _xacc }], [0, { [_hH]: _xacc_ }], [0, { [_hH]: _xacc__ }], [0, { [_hH]: _xacs }], [0, { [_hH]: _xacs_ }], [0, { [_hH]: _xact }], [0, { [_hH]: _xasse }], [0, { [_hH]: _xavi }], [0, { [_hH]: _xasseca }], [0, { [_hH]: _xasseckM }], [() => SSEKMSKeyId, { [_hH]: _xasseakki }], [() => SSEKMSEncryptionContext, { [_hH]: _xassec }], [2, { [_hH]: _xassebke }], [1, { [_hH]: _xaos }], [0, { [_hH]: _xarc }]]
];
var PutObjectRequest$ = [
  3,
  n0,
  _POR,
  0,
  [_B, _K, _ACL_, _Bo, _CC, _CDo, _CEo, _CL, _CLo, _CMD, _CTo, _CA, _CCRC, _CCRCC, _CCRCNVME, _CSHA, _CSHAh, _Ex, _IM, _INM, _GFC, _GR, _GRACP, _GWACP, _WOB, _M, _SSE, _SC, _WRL, _SSECA, _SSECK, _SSECKMD, _SSEKMSKI, _SSEKMSEC, _BKE, _RP, _Tag, _OLM, _OLRUD, _OLLHS, _EBO],
  [[0, 1], [0, 1], [0, { [_hH]: _xaa }], [() => StreamingBlob, 16], [0, { [_hH]: _CC_ }], [0, { [_hH]: _CD_ }], [0, { [_hH]: _CE_ }], [0, { [_hH]: _CL_ }], [1, { [_hH]: _CL__ }], [0, { [_hH]: _CM }], [0, { [_hH]: _CT_ }], [0, { [_hH]: _xasca }], [0, { [_hH]: _xacc }], [0, { [_hH]: _xacc_ }], [0, { [_hH]: _xacc__ }], [0, { [_hH]: _xacs }], [0, { [_hH]: _xacs_ }], [4, { [_hH]: _Ex }], [0, { [_hH]: _IM_ }], [0, { [_hH]: _INM_ }], [0, { [_hH]: _xagfc }], [0, { [_hH]: _xagr }], [0, { [_hH]: _xagra }], [0, { [_hH]: _xagwa }], [1, { [_hH]: _xawob }], [128 | 0, { [_hPH]: _xam }], [0, { [_hH]: _xasse }], [0, { [_hH]: _xasc }], [0, { [_hH]: _xawrl }], [0, { [_hH]: _xasseca }], [() => SSECustomerKey, { [_hH]: _xasseck }], [0, { [_hH]: _xasseckM }], [() => SSEKMSKeyId, { [_hH]: _xasseakki }], [() => SSEKMSEncryptionContext, { [_hH]: _xassec }], [2, { [_hH]: _xassebke }], [0, { [_hH]: _xarp }], [0, { [_hH]: _xat }], [0, { [_hH]: _xaolm }], [5, { [_hH]: _xaolrud }], [0, { [_hH]: _xaollh }], [0, { [_hH]: _xaebo }]],
  2
];
var RestoreStatus$ = [
  3,
  n0,
  _RSe,
  0,
  [_IRIP, _RED],
  [2, 4]
];
var SessionCredentials$ = [
  3,
  n0,
  _SCe,
  0,
  [_AKI, _SAK, _ST, _E],
  [[0, { [_xN]: _AKI }], [() => SessionCredentialValue, { [_xN]: _SAK }], [() => SessionCredentialValue, { [_xN]: _ST }], [4, { [_xN]: _E }]],
  4
];
var CommonPrefixList = [
  1,
  n0,
  _CPL,
  0,
  () => CommonPrefix$
];
var DeletedObjects = [
  1,
  n0,
  _DOe,
  0,
  () => DeletedObject$
];
var Errors = [
  1,
  n0,
  _Er,
  0,
  () => _Error$
];
var ObjectIdentifierList = [
  1,
  n0,
  _OIL,
  0,
  () => ObjectIdentifier$
];
var ObjectList = [
  1,
  n0,
  _OLb,
  0,
  [
    () => _Object$,
    0
  ]
];
var CopyObject$ = [
  9,
  n0,
  _CO,
  { [_h]: ["PUT", "/{Key+}?x-id=CopyObject", 200] },
  () => CopyObjectRequest$,
  () => CopyObjectOutput$
];
var CreateSession$ = [
  9,
  n0,
  _CSr,
  { [_h]: ["GET", "/?session", 200] },
  () => CreateSessionRequest$,
  () => CreateSessionOutput$
];
var DeleteObject$ = [
  9,
  n0,
  _DOel,
  { [_h]: ["DELETE", "/{Key+}?x-id=DeleteObject", 204] },
  () => DeleteObjectRequest$,
  () => DeleteObjectOutput$
];
var DeleteObjects$ = [
  9,
  n0,
  _DOele,
  { [_hC]: "-", [_h]: ["POST", "/?delete", 200] },
  () => DeleteObjectsRequest$,
  () => DeleteObjectsOutput$
];
var GetObject$ = [
  9,
  n0,
  _GO,
  { [_hC]: "-", [_h]: ["GET", "/{Key+}?x-id=GetObject", 200] },
  () => GetObjectRequest$,
  () => GetObjectOutput$
];
var ListObjectsV2$ = [
  9,
  n0,
  _LOV,
  { [_h]: ["GET", "/?list-type=2", 200] },
  () => ListObjectsV2Request$,
  () => ListObjectsV2Output$
];
var PutObject$ = [
  9,
  n0,
  _PO,
  { [_hC]: "-", [_h]: ["PUT", "/{Key+}?x-id=PutObject", 200] },
  () => PutObjectRequest$,
  () => PutObjectOutput$
];
class CreateSessionCommand extends Command.classBuilder().ep({
  ...commonParams,
  DisableS3ExpressSessionAuth: { type: "staticContextParams", value: true },
  Bucket: { type: "contextParams", name: "Bucket" }
}).m(function(Command2, cs2, config, o2) {
  return [
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions()),
    getThrow200ExceptionsPlugin(config)
  ];
}).s("AmazonS3", "CreateSession", {}).n("S3Client", "CreateSessionCommand").sc(CreateSession$).build() {
}
const version = "3.1029.0";
const packageInfo = {
  version
};
const ENV_KEY = "AWS_ACCESS_KEY_ID";
const ENV_SECRET = "AWS_SECRET_ACCESS_KEY";
const ENV_SESSION = "AWS_SESSION_TOKEN";
const ENV_EXPIRATION = "AWS_CREDENTIAL_EXPIRATION";
const ENV_CREDENTIAL_SCOPE = "AWS_CREDENTIAL_SCOPE";
const ENV_ACCOUNT_ID = "AWS_ACCOUNT_ID";
const fromEnv = (init) => async () => {
  init?.logger?.debug("@aws-sdk/credential-provider-env - fromEnv");
  const accessKeyId = process.env[ENV_KEY];
  const secretAccessKey = process.env[ENV_SECRET];
  const sessionToken = process.env[ENV_SESSION];
  const expiry = process.env[ENV_EXPIRATION];
  const credentialScope = process.env[ENV_CREDENTIAL_SCOPE];
  const accountId = process.env[ENV_ACCOUNT_ID];
  if (accessKeyId && secretAccessKey) {
    const credentials = {
      accessKeyId,
      secretAccessKey,
      ...sessionToken && { sessionToken },
      ...expiry && { expiration: new Date(expiry) },
      ...credentialScope && { credentialScope },
      ...accountId && { accountId }
    };
    setCredentialFeature(credentials, "CREDENTIALS_ENV_VARS", "g");
    return credentials;
  }
  throw new CredentialsProviderError("Unable to find environment variable credentials.", { logger: init?.logger });
};
const ENV_IMDS_DISABLED$1 = "AWS_EC2_METADATA_DISABLED";
const remoteProvider = async (init) => {
  const { ENV_CMDS_FULL_URI, ENV_CMDS_RELATIVE_URI, fromContainerMetadata, fromInstanceMetadata } = await import("./index_CxeI6Cja.mjs");
  if (process.env[ENV_CMDS_RELATIVE_URI] || process.env[ENV_CMDS_FULL_URI]) {
    init.logger?.debug("@aws-sdk/credential-provider-node - remoteProvider::fromHttp/fromContainerMetadata");
    const { fromHttp } = await import("./index_De4eYpI3.mjs");
    return chain(fromHttp(init), fromContainerMetadata(init));
  }
  if (process.env[ENV_IMDS_DISABLED$1] && process.env[ENV_IMDS_DISABLED$1] !== "false") {
    return async () => {
      throw new CredentialsProviderError("EC2 Instance Metadata Service access disabled", { logger: init.logger });
    };
  }
  init.logger?.debug("@aws-sdk/credential-provider-node - remoteProvider::fromInstanceMetadata");
  return fromInstanceMetadata(init);
};
function memoizeChain(providers, treatAsExpired) {
  const chain2 = internalCreateChain(providers);
  let activeLock;
  let passiveLock;
  let credentials;
  const provider = async (options) => {
    if (options?.forceRefresh) {
      return await chain2(options);
    }
    if (credentials?.expiration) {
      if (credentials?.expiration?.getTime() < Date.now()) {
        credentials = void 0;
      }
    }
    if (activeLock) {
      await activeLock;
    } else if (!credentials || treatAsExpired?.(credentials)) {
      if (credentials) {
        if (!passiveLock) {
          passiveLock = chain2(options).then((c2) => {
            credentials = c2;
          }).finally(() => {
            passiveLock = void 0;
          });
        }
      } else {
        activeLock = chain2(options).then((c2) => {
          credentials = c2;
        }).finally(() => {
          activeLock = void 0;
        });
        return provider(options);
      }
    }
    return credentials;
  };
  return provider;
}
const internalCreateChain = (providers) => async (awsIdentityProperties) => {
  let lastProviderError;
  for (const provider of providers) {
    try {
      return await provider(awsIdentityProperties);
    } catch (err) {
      lastProviderError = err;
      if (err?.tryNextLink) {
        continue;
      }
      throw err;
    }
  }
  throw lastProviderError;
};
let multipleCredentialSourceWarningEmitted = false;
const defaultProvider = (init = {}) => memoizeChain([
  async () => {
    const profile = init.profile ?? process.env[ENV_PROFILE];
    if (profile) {
      const envStaticCredentialsAreSet = process.env[ENV_KEY] && process.env[ENV_SECRET];
      if (envStaticCredentialsAreSet) {
        if (!multipleCredentialSourceWarningEmitted) {
          const warnFn = init.logger?.warn && init.logger?.constructor?.name !== "NoOpLogger" ? init.logger.warn.bind(init.logger) : console.warn;
          warnFn(`@aws-sdk/credential-provider-node - defaultProvider::fromEnv WARNING:
    Multiple credential sources detected: 
    Both AWS_PROFILE and the pair AWS_ACCESS_KEY_ID/AWS_SECRET_ACCESS_KEY static credentials are set.
    This SDK will proceed with the AWS_PROFILE value.
    
    However, a future version may change this behavior to prefer the ENV static credentials.
    Please ensure that your environment only sets either the AWS_PROFILE or the
    AWS_ACCESS_KEY_ID/AWS_SECRET_ACCESS_KEY pair.
`);
          multipleCredentialSourceWarningEmitted = true;
        }
      }
      throw new CredentialsProviderError("AWS_PROFILE is set, skipping fromEnv provider.", {
        logger: init.logger,
        tryNextLink: true
      });
    }
    init.logger?.debug("@aws-sdk/credential-provider-node - defaultProvider::fromEnv");
    return fromEnv(init)();
  },
  async (awsIdentityProperties) => {
    init.logger?.debug("@aws-sdk/credential-provider-node - defaultProvider::fromSSO");
    const { ssoStartUrl, ssoAccountId, ssoRegion, ssoRoleName, ssoSession } = init;
    if (!ssoStartUrl && !ssoAccountId && !ssoRegion && !ssoRoleName && !ssoSession) {
      throw new CredentialsProviderError("Skipping SSO provider in default chain (inputs do not include SSO fields).", { logger: init.logger });
    }
    const { fromSSO } = await import("./index_DzIJR0N6.mjs");
    return fromSSO(init)(awsIdentityProperties);
  },
  async (awsIdentityProperties) => {
    init.logger?.debug("@aws-sdk/credential-provider-node - defaultProvider::fromIni");
    const { fromIni } = await import("./index_C5Nt6d4P.mjs");
    return fromIni(init)(awsIdentityProperties);
  },
  async (awsIdentityProperties) => {
    init.logger?.debug("@aws-sdk/credential-provider-node - defaultProvider::fromProcess");
    const { fromProcess } = await import("./index_CWPaQR_c.mjs");
    return fromProcess(init)(awsIdentityProperties);
  },
  async (awsIdentityProperties) => {
    init.logger?.debug("@aws-sdk/credential-provider-node - defaultProvider::fromTokenFile");
    const { fromTokenFile } = await import("./index_CTIwOMkH.mjs");
    return fromTokenFile(init)(awsIdentityProperties);
  },
  async () => {
    init.logger?.debug("@aws-sdk/credential-provider-node - defaultProvider::remoteProvider");
    return (await remoteProvider(init))();
  },
  async () => {
    throw new CredentialsProviderError("Could not load credentials from any providers", {
      tryNextLink: false,
      logger: init.logger
    });
  }
], credentialsTreatedAsExpired);
const credentialsTreatedAsExpired = (credentials) => credentials?.expiration !== void 0 && credentials.expiration.getTime() - Date.now() < 3e5;
const NODE_USE_ARN_REGION_ENV_NAME = "AWS_S3_USE_ARN_REGION";
const NODE_USE_ARN_REGION_INI_NAME = "s3_use_arn_region";
const NODE_USE_ARN_REGION_CONFIG_OPTIONS = {
  environmentVariableSelector: (env2) => booleanSelector(env2, NODE_USE_ARN_REGION_ENV_NAME, SelectorType.ENV),
  configFileSelector: (profile) => booleanSelector(profile, NODE_USE_ARN_REGION_INI_NAME, SelectorType.CONFIG),
  default: void 0
};
const getRuntimeUserAgentPair = () => {
  const runtimesToCheck = ["deno", "bun", "llrt"];
  for (const runtime of runtimesToCheck) {
    if (versions[runtime]) {
      return [`md/${runtime}`, versions[runtime]];
    }
  }
  return ["md/nodejs", versions.node];
};
const getNodeModulesParentDirs = (dirname) => {
  const cwd = process.cwd();
  if (!dirname) {
    return [cwd];
  }
  const normalizedPath = normalize(dirname);
  const parts = normalizedPath.split(sep$1);
  const nodeModulesIndex = parts.indexOf("node_modules");
  const parentDir = nodeModulesIndex !== -1 ? parts.slice(0, nodeModulesIndex).join(sep$1) : normalizedPath;
  if (cwd === parentDir) {
    return [cwd];
  }
  return [parentDir, cwd];
};
const SEMVER_REGEX = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+[0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*)?$/;
const getSanitizedTypeScriptVersion = (version2 = "") => {
  const match = version2.match(SEMVER_REGEX);
  if (!match) {
    return void 0;
  }
  const [major, minor, patch, prerelease] = [match[1], match[2], match[3], match[4]];
  return prerelease ? `${major}.${minor}.${patch}-${prerelease}` : `${major}.${minor}.${patch}`;
};
const ALLOWED_PREFIXES = ["^", "~", ">=", "<=", ">", "<"];
const ALLOWED_DIST_TAGS = ["latest", "beta", "dev", "rc", "insiders", "next"];
const getSanitizedDevTypeScriptVersion = (version2 = "") => {
  if (ALLOWED_DIST_TAGS.includes(version2)) {
    return version2;
  }
  const prefix = ALLOWED_PREFIXES.find((p2) => version2.startsWith(p2)) ?? "";
  const sanitizedTypeScriptVersion = getSanitizedTypeScriptVersion(version2.slice(prefix.length));
  if (!sanitizedTypeScriptVersion) {
    return void 0;
  }
  return `${prefix}${sanitizedTypeScriptVersion}`;
};
let tscVersion;
const TS_PACKAGE_JSON = join$1("node_modules", "typescript", "package.json");
const getTypeScriptUserAgentPair = async () => {
  if (tscVersion === null) {
    return void 0;
  } else if (typeof tscVersion === "string") {
    return ["md/tsc", tscVersion];
  }
  let isTypeScriptDetectionDisabled = false;
  try {
    isTypeScriptDetectionDisabled = booleanSelector(process.env, "AWS_SDK_JS_TYPESCRIPT_DETECTION_DISABLED", SelectorType.ENV) || false;
  } catch {
  }
  if (isTypeScriptDetectionDisabled) {
    tscVersion = null;
    return void 0;
  }
  const dirname = typeof __dirname !== "undefined" ? __dirname : void 0;
  const nodeModulesParentDirs = getNodeModulesParentDirs(dirname);
  let versionFromApp;
  for (const nodeModulesParentDir of nodeModulesParentDirs) {
    try {
      const appPackageJsonPath = join$1(nodeModulesParentDir, "package.json");
      const packageJson = await readFile$1(appPackageJsonPath, "utf-8");
      const { dependencies, devDependencies } = JSON.parse(packageJson);
      const version2 = devDependencies?.typescript ?? dependencies?.typescript;
      if (typeof version2 !== "string") {
        continue;
      }
      versionFromApp = version2;
      break;
    } catch {
    }
  }
  if (!versionFromApp) {
    tscVersion = null;
    return void 0;
  }
  let versionFromNodeModules;
  for (const nodeModulesParentDir of nodeModulesParentDirs) {
    try {
      const tsPackageJsonPath = join$1(nodeModulesParentDir, TS_PACKAGE_JSON);
      const packageJson = await readFile$1(tsPackageJsonPath, "utf-8");
      const { version: version2 } = JSON.parse(packageJson);
      const sanitizedVersion2 = getSanitizedTypeScriptVersion(version2);
      if (typeof sanitizedVersion2 !== "string") {
        continue;
      }
      versionFromNodeModules = sanitizedVersion2;
      break;
    } catch {
    }
  }
  if (versionFromNodeModules) {
    tscVersion = versionFromNodeModules;
    return ["md/tsc", tscVersion];
  }
  const sanitizedVersion = getSanitizedDevTypeScriptVersion(versionFromApp);
  if (typeof sanitizedVersion !== "string") {
    tscVersion = null;
    return void 0;
  }
  tscVersion = `dev_${sanitizedVersion}`;
  return ["md/tsc", tscVersion];
};
const isCrtAvailable = () => {
  return null;
};
const createDefaultUserAgentProvider = ({ serviceId, clientVersion }) => {
  const runtimeUserAgentPair = getRuntimeUserAgentPair();
  return async (config) => {
    const sections = [
      ["aws-sdk-js", clientVersion],
      ["ua", "2.1"],
      [`os/${platform()}`, release()],
      ["lang/js"],
      runtimeUserAgentPair
    ];
    const typescriptUserAgentPair = await getTypeScriptUserAgentPair();
    if (typescriptUserAgentPair) {
      sections.push(typescriptUserAgentPair);
    }
    const crtAvailable = isCrtAvailable();
    if (crtAvailable) {
      sections.push(crtAvailable);
    }
    if (serviceId) {
      sections.push([`api/${serviceId}`, clientVersion]);
    }
    if (env.AWS_EXECUTION_ENV) {
      sections.push([`exec-env/${env.AWS_EXECUTION_ENV}`]);
    }
    const appId = await config?.userAgentAppId?.();
    const resolvedUserAgent = appId ? [...sections, [`app/${appId}`]] : [...sections];
    return resolvedUserAgent;
  };
};
const UA_APP_ID_ENV_NAME = "AWS_SDK_UA_APP_ID";
const UA_APP_ID_INI_NAME = "sdk_ua_app_id";
const UA_APP_ID_INI_NAME_DEPRECATED = "sdk-ua-app-id";
const NODE_APP_ID_CONFIG_OPTIONS = {
  environmentVariableSelector: (env2) => env2[UA_APP_ID_ENV_NAME],
  configFileSelector: (profile) => profile[UA_APP_ID_INI_NAME] ?? profile[UA_APP_ID_INI_NAME_DEPRECATED],
  default: DEFAULT_UA_APP_ID
};
class Int642 {
  bytes;
  constructor(bytes) {
    this.bytes = bytes;
    if (bytes.byteLength !== 8) {
      throw new Error("Int64 buffers must be exactly 8 bytes");
    }
  }
  static fromNumber(number) {
    if (number > 9223372036854776e3 || number < -9223372036854776e3) {
      throw new Error(`${number} is too large (or, if negative, too small) to represent as an Int64`);
    }
    const bytes = new Uint8Array(8);
    for (let i2 = 7, remaining = Math.abs(Math.round(number)); i2 > -1 && remaining > 0; i2--, remaining /= 256) {
      bytes[i2] = remaining;
    }
    if (number < 0) {
      negate(bytes);
    }
    return new Int642(bytes);
  }
  valueOf() {
    const bytes = this.bytes.slice(0);
    const negative = bytes[0] & 128;
    if (negative) {
      negate(bytes);
    }
    return parseInt(toHex(bytes), 16) * (negative ? -1 : 1);
  }
  toString() {
    return String(this.valueOf());
  }
}
function negate(bytes) {
  for (let i2 = 0; i2 < 8; i2++) {
    bytes[i2] ^= 255;
  }
  for (let i2 = 7; i2 > -1; i2--) {
    bytes[i2]++;
    if (bytes[i2] !== 0)
      break;
  }
}
class HeaderMarshaller {
  toUtf8;
  fromUtf8;
  constructor(toUtf82, fromUtf82) {
    this.toUtf8 = toUtf82;
    this.fromUtf8 = fromUtf82;
  }
  format(headers) {
    const chunks = [];
    for (const headerName of Object.keys(headers)) {
      const bytes = this.fromUtf8(headerName);
      chunks.push(Uint8Array.from([bytes.byteLength]), bytes, this.formatHeaderValue(headers[headerName]));
    }
    const out = new Uint8Array(chunks.reduce((carry, bytes) => carry + bytes.byteLength, 0));
    let position = 0;
    for (const chunk of chunks) {
      out.set(chunk, position);
      position += chunk.byteLength;
    }
    return out;
  }
  formatHeaderValue(header) {
    switch (header.type) {
      case "boolean":
        return Uint8Array.from([header.value ? 0 : 1]);
      case "byte":
        return Uint8Array.from([2, header.value]);
      case "short":
        const shortView = new DataView(new ArrayBuffer(3));
        shortView.setUint8(0, 3);
        shortView.setInt16(1, header.value, false);
        return new Uint8Array(shortView.buffer);
      case "integer":
        const intView = new DataView(new ArrayBuffer(5));
        intView.setUint8(0, 4);
        intView.setInt32(1, header.value, false);
        return new Uint8Array(intView.buffer);
      case "long":
        const longBytes = new Uint8Array(9);
        longBytes[0] = 5;
        longBytes.set(header.value.bytes, 1);
        return longBytes;
      case "binary":
        const binView = new DataView(new ArrayBuffer(3 + header.value.byteLength));
        binView.setUint8(0, 6);
        binView.setUint16(1, header.value.byteLength, false);
        const binBytes = new Uint8Array(binView.buffer);
        binBytes.set(header.value, 3);
        return binBytes;
      case "string":
        const utf8Bytes = this.fromUtf8(header.value);
        const strView = new DataView(new ArrayBuffer(3 + utf8Bytes.byteLength));
        strView.setUint8(0, 7);
        strView.setUint16(1, utf8Bytes.byteLength, false);
        const strBytes = new Uint8Array(strView.buffer);
        strBytes.set(utf8Bytes, 3);
        return strBytes;
      case "timestamp":
        const tsBytes = new Uint8Array(9);
        tsBytes[0] = 8;
        tsBytes.set(Int642.fromNumber(header.value.valueOf()).bytes, 1);
        return tsBytes;
      case "uuid":
        if (!UUID_PATTERN.test(header.value)) {
          throw new Error(`Invalid UUID received: ${header.value}`);
        }
        const uuidBytes = new Uint8Array(17);
        uuidBytes[0] = 9;
        uuidBytes.set(fromHex(header.value.replace(/\-/g, "")), 1);
        return uuidBytes;
    }
  }
  parse(headers) {
    const out = {};
    let position = 0;
    while (position < headers.byteLength) {
      const nameLength = headers.getUint8(position++);
      const name = this.toUtf8(new Uint8Array(headers.buffer, headers.byteOffset + position, nameLength));
      position += nameLength;
      switch (headers.getUint8(position++)) {
        case 0:
          out[name] = {
            type: BOOLEAN_TAG,
            value: true
          };
          break;
        case 1:
          out[name] = {
            type: BOOLEAN_TAG,
            value: false
          };
          break;
        case 2:
          out[name] = {
            type: BYTE_TAG,
            value: headers.getInt8(position++)
          };
          break;
        case 3:
          out[name] = {
            type: SHORT_TAG,
            value: headers.getInt16(position, false)
          };
          position += 2;
          break;
        case 4:
          out[name] = {
            type: INT_TAG,
            value: headers.getInt32(position, false)
          };
          position += 4;
          break;
        case 5:
          out[name] = {
            type: LONG_TAG,
            value: new Int642(new Uint8Array(headers.buffer, headers.byteOffset + position, 8))
          };
          position += 8;
          break;
        case 6:
          const binaryLength = headers.getUint16(position, false);
          position += 2;
          out[name] = {
            type: BINARY_TAG,
            value: new Uint8Array(headers.buffer, headers.byteOffset + position, binaryLength)
          };
          position += binaryLength;
          break;
        case 7:
          const stringLength = headers.getUint16(position, false);
          position += 2;
          out[name] = {
            type: STRING_TAG,
            value: this.toUtf8(new Uint8Array(headers.buffer, headers.byteOffset + position, stringLength))
          };
          position += stringLength;
          break;
        case 8:
          out[name] = {
            type: TIMESTAMP_TAG,
            value: new Date(new Int642(new Uint8Array(headers.buffer, headers.byteOffset + position, 8)).valueOf())
          };
          position += 8;
          break;
        case 9:
          const uuidBytes = new Uint8Array(headers.buffer, headers.byteOffset + position, 16);
          position += 16;
          out[name] = {
            type: UUID_TAG,
            value: `${toHex(uuidBytes.subarray(0, 4))}-${toHex(uuidBytes.subarray(4, 6))}-${toHex(uuidBytes.subarray(6, 8))}-${toHex(uuidBytes.subarray(8, 10))}-${toHex(uuidBytes.subarray(10))}`
          };
          break;
        default:
          throw new Error(`Unrecognized header type tag`);
      }
    }
    return out;
  }
}
var HEADER_VALUE_TYPE;
(function(HEADER_VALUE_TYPE2) {
  HEADER_VALUE_TYPE2[HEADER_VALUE_TYPE2["boolTrue"] = 0] = "boolTrue";
  HEADER_VALUE_TYPE2[HEADER_VALUE_TYPE2["boolFalse"] = 1] = "boolFalse";
  HEADER_VALUE_TYPE2[HEADER_VALUE_TYPE2["byte"] = 2] = "byte";
  HEADER_VALUE_TYPE2[HEADER_VALUE_TYPE2["short"] = 3] = "short";
  HEADER_VALUE_TYPE2[HEADER_VALUE_TYPE2["integer"] = 4] = "integer";
  HEADER_VALUE_TYPE2[HEADER_VALUE_TYPE2["long"] = 5] = "long";
  HEADER_VALUE_TYPE2[HEADER_VALUE_TYPE2["byteArray"] = 6] = "byteArray";
  HEADER_VALUE_TYPE2[HEADER_VALUE_TYPE2["string"] = 7] = "string";
  HEADER_VALUE_TYPE2[HEADER_VALUE_TYPE2["timestamp"] = 8] = "timestamp";
  HEADER_VALUE_TYPE2[HEADER_VALUE_TYPE2["uuid"] = 9] = "uuid";
})(HEADER_VALUE_TYPE || (HEADER_VALUE_TYPE = {}));
const BOOLEAN_TAG = "boolean";
const BYTE_TAG = "byte";
const SHORT_TAG = "short";
const INT_TAG = "integer";
const LONG_TAG = "long";
const BINARY_TAG = "binary";
const STRING_TAG = "string";
const TIMESTAMP_TAG = "timestamp";
const UUID_TAG = "uuid";
const UUID_PATTERN = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/;
const PRELUDE_MEMBER_LENGTH = 4;
const PRELUDE_LENGTH = PRELUDE_MEMBER_LENGTH * 2;
const CHECKSUM_LENGTH = 4;
const MINIMUM_MESSAGE_LENGTH = PRELUDE_LENGTH + CHECKSUM_LENGTH * 2;
function splitMessage({ byteLength, byteOffset, buffer }) {
  if (byteLength < MINIMUM_MESSAGE_LENGTH) {
    throw new Error("Provided message too short to accommodate event stream message overhead");
  }
  const view = new DataView(buffer, byteOffset, byteLength);
  const messageLength = view.getUint32(0, false);
  if (byteLength !== messageLength) {
    throw new Error("Reported message length does not match received message length");
  }
  const headerLength = view.getUint32(PRELUDE_MEMBER_LENGTH, false);
  const expectedPreludeChecksum = view.getUint32(PRELUDE_LENGTH, false);
  const expectedMessageChecksum = view.getUint32(byteLength - CHECKSUM_LENGTH, false);
  const checksummer = new Crc32().update(new Uint8Array(buffer, byteOffset, PRELUDE_LENGTH));
  if (expectedPreludeChecksum !== checksummer.digest()) {
    throw new Error(`The prelude checksum specified in the message (${expectedPreludeChecksum}) does not match the calculated CRC32 checksum (${checksummer.digest()})`);
  }
  checksummer.update(new Uint8Array(buffer, byteOffset + PRELUDE_LENGTH, byteLength - (PRELUDE_LENGTH + CHECKSUM_LENGTH)));
  if (expectedMessageChecksum !== checksummer.digest()) {
    throw new Error(`The message checksum (${checksummer.digest()}) did not match the expected value of ${expectedMessageChecksum}`);
  }
  return {
    headers: new DataView(buffer, byteOffset + PRELUDE_LENGTH + CHECKSUM_LENGTH, headerLength),
    body: new Uint8Array(buffer, byteOffset + PRELUDE_LENGTH + CHECKSUM_LENGTH + headerLength, messageLength - headerLength - (PRELUDE_LENGTH + CHECKSUM_LENGTH + CHECKSUM_LENGTH))
  };
}
class EventStreamCodec {
  headerMarshaller;
  messageBuffer;
  isEndOfStream;
  constructor(toUtf82, fromUtf82) {
    this.headerMarshaller = new HeaderMarshaller(toUtf82, fromUtf82);
    this.messageBuffer = [];
    this.isEndOfStream = false;
  }
  feed(message) {
    this.messageBuffer.push(this.decode(message));
  }
  endOfStream() {
    this.isEndOfStream = true;
  }
  getMessage() {
    const message = this.messageBuffer.pop();
    const isEndOfStream = this.isEndOfStream;
    return {
      getMessage() {
        return message;
      },
      isEndOfStream() {
        return isEndOfStream;
      }
    };
  }
  getAvailableMessages() {
    const messages = this.messageBuffer;
    this.messageBuffer = [];
    const isEndOfStream = this.isEndOfStream;
    return {
      getMessages() {
        return messages;
      },
      isEndOfStream() {
        return isEndOfStream;
      }
    };
  }
  encode({ headers: rawHeaders, body }) {
    const headers = this.headerMarshaller.format(rawHeaders);
    const length = headers.byteLength + body.byteLength + 16;
    const out = new Uint8Array(length);
    const view = new DataView(out.buffer, out.byteOffset, out.byteLength);
    const checksum = new Crc32();
    view.setUint32(0, length, false);
    view.setUint32(4, headers.byteLength, false);
    view.setUint32(8, checksum.update(out.subarray(0, 8)).digest(), false);
    out.set(headers, 12);
    out.set(body, headers.byteLength + 12);
    view.setUint32(length - 4, checksum.update(out.subarray(8, length - 4)).digest(), false);
    return out;
  }
  decode(message) {
    const { headers, body } = splitMessage(message);
    return { headers: this.headerMarshaller.parse(headers), body };
  }
  formatHeaders(rawHeaders) {
    return this.headerMarshaller.format(rawHeaders);
  }
}
class MessageDecoderStream {
  options;
  constructor(options) {
    this.options = options;
  }
  [Symbol.asyncIterator]() {
    return this.asyncIterator();
  }
  async *asyncIterator() {
    for await (const bytes of this.options.inputStream) {
      const decoded = this.options.decoder.decode(bytes);
      yield decoded;
    }
  }
}
class MessageEncoderStream {
  options;
  constructor(options) {
    this.options = options;
  }
  [Symbol.asyncIterator]() {
    return this.asyncIterator();
  }
  async *asyncIterator() {
    for await (const msg of this.options.messageStream) {
      const encoded = this.options.encoder.encode(msg);
      yield encoded;
    }
    if (this.options.includeEndFrame) {
      yield new Uint8Array(0);
    }
  }
}
class SmithyMessageDecoderStream {
  options;
  constructor(options) {
    this.options = options;
  }
  [Symbol.asyncIterator]() {
    return this.asyncIterator();
  }
  async *asyncIterator() {
    for await (const message of this.options.messageStream) {
      const deserialized = await this.options.deserializer(message);
      if (deserialized === void 0)
        continue;
      yield deserialized;
    }
  }
}
class SmithyMessageEncoderStream {
  options;
  constructor(options) {
    this.options = options;
  }
  [Symbol.asyncIterator]() {
    return this.asyncIterator();
  }
  async *asyncIterator() {
    for await (const chunk of this.options.inputStream) {
      const payloadBuf = this.options.serializer(chunk);
      yield payloadBuf;
    }
  }
}
function getChunkedStream(source) {
  let currentMessageTotalLength = 0;
  let currentMessagePendingLength = 0;
  let currentMessage = null;
  let messageLengthBuffer = null;
  const allocateMessage = (size) => {
    if (typeof size !== "number") {
      throw new Error("Attempted to allocate an event message where size was not a number: " + size);
    }
    currentMessageTotalLength = size;
    currentMessagePendingLength = 4;
    currentMessage = new Uint8Array(size);
    const currentMessageView = new DataView(currentMessage.buffer);
    currentMessageView.setUint32(0, size, false);
  };
  const iterator = async function* () {
    const sourceIterator = source[Symbol.asyncIterator]();
    while (true) {
      const { value, done } = await sourceIterator.next();
      if (done) {
        if (!currentMessageTotalLength) {
          return;
        } else if (currentMessageTotalLength === currentMessagePendingLength) {
          yield currentMessage;
        } else {
          throw new Error("Truncated event message received.");
        }
        return;
      }
      const chunkLength = value.length;
      let currentOffset = 0;
      while (currentOffset < chunkLength) {
        if (!currentMessage) {
          const bytesRemaining = chunkLength - currentOffset;
          if (!messageLengthBuffer) {
            messageLengthBuffer = new Uint8Array(4);
          }
          const numBytesForTotal = Math.min(4 - currentMessagePendingLength, bytesRemaining);
          messageLengthBuffer.set(value.slice(currentOffset, currentOffset + numBytesForTotal), currentMessagePendingLength);
          currentMessagePendingLength += numBytesForTotal;
          currentOffset += numBytesForTotal;
          if (currentMessagePendingLength < 4) {
            break;
          }
          allocateMessage(new DataView(messageLengthBuffer.buffer).getUint32(0, false));
          messageLengthBuffer = null;
        }
        const numBytesToWrite = Math.min(currentMessageTotalLength - currentMessagePendingLength, chunkLength - currentOffset);
        currentMessage.set(value.slice(currentOffset, currentOffset + numBytesToWrite), currentMessagePendingLength);
        currentMessagePendingLength += numBytesToWrite;
        currentOffset += numBytesToWrite;
        if (currentMessageTotalLength && currentMessageTotalLength === currentMessagePendingLength) {
          yield currentMessage;
          currentMessage = null;
          currentMessageTotalLength = 0;
          currentMessagePendingLength = 0;
        }
      }
    }
  };
  return {
    [Symbol.asyncIterator]: iterator
  };
}
function getMessageUnmarshaller(deserializer, toUtf82) {
  return async function(message) {
    const { value: messageType } = message.headers[":message-type"];
    if (messageType === "error") {
      const unmodeledError = new Error(message.headers[":error-message"].value || "UnknownError");
      unmodeledError.name = message.headers[":error-code"].value;
      throw unmodeledError;
    } else if (messageType === "exception") {
      const code = message.headers[":exception-type"].value;
      const exception = { [code]: message };
      const deserializedException = await deserializer(exception);
      if (deserializedException.$unknown) {
        const error = new Error(toUtf82(message.body));
        error.name = code;
        throw error;
      }
      throw deserializedException[code];
    } else if (messageType === "event") {
      const event = {
        [message.headers[":event-type"].value]: message
      };
      const deserialized = await deserializer(event);
      if (deserialized.$unknown)
        return;
      return deserialized;
    } else {
      throw Error(`Unrecognizable event type: ${message.headers[":event-type"].value}`);
    }
  };
}
let EventStreamMarshaller$1 = class EventStreamMarshaller {
  eventStreamCodec;
  utfEncoder;
  constructor({ utf8Encoder, utf8Decoder }) {
    this.eventStreamCodec = new EventStreamCodec(utf8Encoder, utf8Decoder);
    this.utfEncoder = utf8Encoder;
  }
  deserialize(body, deserializer) {
    const inputStream = getChunkedStream(body);
    return new SmithyMessageDecoderStream({
      messageStream: new MessageDecoderStream({ inputStream, decoder: this.eventStreamCodec }),
      deserializer: getMessageUnmarshaller(deserializer, this.utfEncoder)
    });
  }
  serialize(inputStream, serializer) {
    return new MessageEncoderStream({
      messageStream: new SmithyMessageEncoderStream({ inputStream, serializer }),
      encoder: this.eventStreamCodec,
      includeEndFrame: true
    });
  }
};
async function* readabletoIterable(readStream) {
  let streamEnded = false;
  let generationEnded = false;
  const records = new Array();
  readStream.on("error", (err) => {
    if (!streamEnded) {
      streamEnded = true;
    }
    if (err) {
      throw err;
    }
  });
  readStream.on("data", (data) => {
    records.push(data);
  });
  readStream.on("end", () => {
    streamEnded = true;
  });
  while (!generationEnded) {
    const value = await new Promise((resolve) => setTimeout(() => resolve(records.shift()), 0));
    if (value) {
      yield value;
    }
    generationEnded = streamEnded && records.length === 0;
  }
}
class EventStreamMarshaller2 {
  universalMarshaller;
  constructor({ utf8Encoder, utf8Decoder }) {
    this.universalMarshaller = new EventStreamMarshaller$1({
      utf8Decoder,
      utf8Encoder
    });
  }
  deserialize(body, deserializer) {
    const bodyIterable = typeof body[Symbol.asyncIterator] === "function" ? body : readabletoIterable(body);
    return this.universalMarshaller.deserialize(bodyIterable, deserializer);
  }
  serialize(input, serializer) {
    return Readable$1.from(this.universalMarshaller.serialize(input, serializer));
  }
}
const eventStreamSerdeProvider = (options) => new EventStreamMarshaller2(options);
class Hash {
  algorithmIdentifier;
  secret;
  hash;
  constructor(algorithmIdentifier, secret) {
    this.algorithmIdentifier = algorithmIdentifier;
    this.secret = secret;
    this.reset();
  }
  update(toHash, encoding) {
    this.hash.update(toUint8Array(castSourceData(toHash, encoding)));
  }
  digest() {
    return Promise.resolve(this.hash.digest());
  }
  reset() {
    this.hash = this.secret ? createHmac(this.algorithmIdentifier, castSourceData(this.secret)) : createHash(this.algorithmIdentifier);
  }
}
function castSourceData(toCast, encoding) {
  if (Buffer$1.isBuffer(toCast)) {
    return toCast;
  }
  if (typeof toCast === "string") {
    return fromString$1(toCast, encoding);
  }
  if (ArrayBuffer.isView(toCast)) {
    return fromArrayBuffer(toCast.buffer, toCast.byteOffset, toCast.byteLength);
  }
  return fromArrayBuffer(toCast);
}
class HashCalculator extends Writable {
  hash;
  constructor(hash, options) {
    super(options);
    this.hash = hash;
  }
  _write(chunk, encoding, callback) {
    try {
      this.hash.update(toUint8Array(chunk));
    } catch (err) {
      return callback(err);
    }
    callback();
  }
}
const readableStreamHasher = (hashCtor, readableStream) => {
  if (readableStream.readableFlowing !== null) {
    throw new Error("Unable to calculate hash for flowing readable stream");
  }
  const hash = new hashCtor();
  const hashCalculator = new HashCalculator(hash);
  readableStream.pipe(hashCalculator);
  return new Promise((resolve, reject) => {
    readableStream.on("error", (err) => {
      hashCalculator.end();
      reject(err);
    });
    hashCalculator.on("error", reject);
    hashCalculator.on("finish", () => {
      hash.digest().then(resolve).catch(reject);
    });
  });
};
const calculateBodyLength = (body) => {
  if (!body) {
    return 0;
  }
  if (typeof body === "string") {
    return Buffer.byteLength(body);
  } else if (typeof body.byteLength === "number") {
    return body.byteLength;
  } else if (typeof body.size === "number") {
    return body.size;
  } else if (typeof body.start === "number" && typeof body.end === "number") {
    return body.end + 1 - body.start;
  } else if (body instanceof ReadStream) {
    if (body.path != null) {
      return lstatSync(body.path).size;
    } else if (typeof body.fd === "number") {
      return fstatSync(body.fd).size;
    }
  }
  throw new Error(`Body Length computation failed for ${body}`);
};
const AWS_EXECUTION_ENV = "AWS_EXECUTION_ENV";
const AWS_REGION_ENV = "AWS_REGION";
const AWS_DEFAULT_REGION_ENV = "AWS_DEFAULT_REGION";
const ENV_IMDS_DISABLED = "AWS_EC2_METADATA_DISABLED";
const DEFAULTS_MODE_OPTIONS = ["in-region", "cross-region", "mobile", "standard", "legacy"];
const IMDS_REGION_PATH = "/latest/meta-data/placement/region";
const AWS_DEFAULTS_MODE_ENV = "AWS_DEFAULTS_MODE";
const AWS_DEFAULTS_MODE_CONFIG = "defaults_mode";
const NODE_DEFAULTS_MODE_CONFIG_OPTIONS = {
  environmentVariableSelector: (env2) => {
    return env2[AWS_DEFAULTS_MODE_ENV];
  },
  configFileSelector: (profile) => {
    return profile[AWS_DEFAULTS_MODE_CONFIG];
  },
  default: "legacy"
};
const resolveDefaultsModeConfig = ({ region = loadConfig(NODE_REGION_CONFIG_OPTIONS), defaultsMode = loadConfig(NODE_DEFAULTS_MODE_CONFIG_OPTIONS) } = {}) => memoize(async () => {
  const mode = typeof defaultsMode === "function" ? await defaultsMode() : defaultsMode;
  switch (mode?.toLowerCase()) {
    case "auto":
      return resolveNodeDefaultsModeAuto(region);
    case "in-region":
    case "cross-region":
    case "mobile":
    case "standard":
    case "legacy":
      return Promise.resolve(mode?.toLocaleLowerCase());
    case void 0:
      return Promise.resolve("legacy");
    default:
      throw new Error(`Invalid parameter for "defaultsMode", expect ${DEFAULTS_MODE_OPTIONS.join(", ")}, got ${mode}`);
  }
});
const resolveNodeDefaultsModeAuto = async (clientRegion) => {
  if (clientRegion) {
    const resolvedRegion = typeof clientRegion === "function" ? await clientRegion() : clientRegion;
    const inferredRegion = await inferPhysicalRegion();
    if (!inferredRegion) {
      return "standard";
    }
    if (resolvedRegion === inferredRegion) {
      return "in-region";
    } else {
      return "cross-region";
    }
  }
  return "standard";
};
const inferPhysicalRegion = async () => {
  if (process.env[AWS_EXECUTION_ENV] && (process.env[AWS_REGION_ENV] || process.env[AWS_DEFAULT_REGION_ENV])) {
    return process.env[AWS_REGION_ENV] ?? process.env[AWS_DEFAULT_REGION_ENV];
  }
  if (!process.env[ENV_IMDS_DISABLED]) {
    try {
      const { getInstanceMetadataEndpoint, httpRequest } = await import("./index_CxeI6Cja.mjs");
      const endpoint = await getInstanceMetadataEndpoint();
      return (await httpRequest({ ...endpoint, path: IMDS_REGION_PATH })).toString();
    } catch (e2) {
    }
  }
};
const getRuntimeConfig$1 = (config) => {
  return {
    apiVersion: "2006-03-01",
    base64Decoder: config?.base64Decoder ?? fromBase64,
    base64Encoder: config?.base64Encoder ?? toBase64,
    disableHostPrefix: config?.disableHostPrefix ?? false,
    endpointProvider: config?.endpointProvider ?? defaultEndpointResolver,
    extensions: config?.extensions ?? [],
    getAwsChunkedEncodingStream: config?.getAwsChunkedEncodingStream ?? getAwsChunkedEncodingStream,
    httpAuthSchemeProvider: config?.httpAuthSchemeProvider ?? defaultS3HttpAuthSchemeProvider,
    httpAuthSchemes: config?.httpAuthSchemes ?? [
      {
        schemeId: "aws.auth#sigv4",
        identityProvider: (ipc) => ipc.getIdentityProvider("aws.auth#sigv4"),
        signer: new AwsSdkSigV4Signer()
      },
      {
        schemeId: "aws.auth#sigv4a",
        identityProvider: (ipc) => ipc.getIdentityProvider("aws.auth#sigv4a"),
        signer: new AwsSdkSigV4ASigner()
      }
    ],
    logger: config?.logger ?? new NoOpLogger(),
    protocol: config?.protocol ?? S3RestXmlProtocol,
    protocolSettings: config?.protocolSettings ?? {
      defaultNamespace: "com.amazonaws.s3",
      errorTypeRegistries,
      xmlNamespace: "http://s3.amazonaws.com/doc/2006-03-01/",
      version: "2006-03-01",
      serviceTarget: "AmazonS3"
    },
    sdkStreamMixin: config?.sdkStreamMixin ?? sdkStreamMixin,
    serviceId: config?.serviceId ?? "S3",
    signerConstructor: config?.signerConstructor ?? SignatureV4MultiRegion,
    signingEscapePath: config?.signingEscapePath ?? false,
    urlParser: config?.urlParser ?? parseUrl,
    useArnRegion: config?.useArnRegion ?? void 0,
    utf8Decoder: config?.utf8Decoder ?? fromUtf8$2,
    utf8Encoder: config?.utf8Encoder ?? toUtf8
  };
};
const getRuntimeConfig = (config) => {
  emitWarningIfUnsupportedVersion(process.version);
  const defaultsMode = resolveDefaultsModeConfig(config);
  const defaultConfigProvider = () => defaultsMode().then(loadConfigsForDefaultMode);
  const clientSharedValues = getRuntimeConfig$1(config);
  emitWarningIfUnsupportedVersion$1(process.version);
  const loaderConfig = {
    profile: config?.profile,
    logger: clientSharedValues.logger
  };
  return {
    ...clientSharedValues,
    ...config,
    runtime: "node",
    defaultsMode,
    authSchemePreference: config?.authSchemePreference ?? loadConfig(NODE_AUTH_SCHEME_PREFERENCE_OPTIONS, loaderConfig),
    bodyLengthChecker: config?.bodyLengthChecker ?? calculateBodyLength,
    credentialDefaultProvider: config?.credentialDefaultProvider ?? defaultProvider,
    defaultUserAgentProvider: config?.defaultUserAgentProvider ?? createDefaultUserAgentProvider({ serviceId: clientSharedValues.serviceId, clientVersion: packageInfo.version }),
    disableS3ExpressSessionAuth: config?.disableS3ExpressSessionAuth ?? loadConfig(NODE_DISABLE_S3_EXPRESS_SESSION_AUTH_OPTIONS, loaderConfig),
    eventStreamSerdeProvider: config?.eventStreamSerdeProvider ?? eventStreamSerdeProvider,
    maxAttempts: config?.maxAttempts ?? loadConfig(NODE_MAX_ATTEMPT_CONFIG_OPTIONS, config),
    md5: config?.md5 ?? Hash.bind(null, "md5"),
    region: config?.region ?? loadConfig(NODE_REGION_CONFIG_OPTIONS, { ...NODE_REGION_CONFIG_FILE_OPTIONS, ...loaderConfig }),
    requestChecksumCalculation: config?.requestChecksumCalculation ?? loadConfig(NODE_REQUEST_CHECKSUM_CALCULATION_CONFIG_OPTIONS, loaderConfig),
    requestHandler: NodeHttpHandler.create(config?.requestHandler ?? defaultConfigProvider),
    responseChecksumValidation: config?.responseChecksumValidation ?? loadConfig(NODE_RESPONSE_CHECKSUM_VALIDATION_CONFIG_OPTIONS, loaderConfig),
    retryMode: config?.retryMode ?? loadConfig({
      ...NODE_RETRY_MODE_CONFIG_OPTIONS,
      default: async () => (await defaultConfigProvider()).retryMode || DEFAULT_RETRY_MODE
    }, config),
    sha1: config?.sha1 ?? Hash.bind(null, "sha1"),
    sha256: config?.sha256 ?? Hash.bind(null, "sha256"),
    sigv4aSigningRegionSet: config?.sigv4aSigningRegionSet ?? loadConfig(NODE_SIGV4A_CONFIG_OPTIONS, loaderConfig),
    streamCollector: config?.streamCollector ?? streamCollector$1,
    streamHasher: config?.streamHasher ?? readableStreamHasher,
    useArnRegion: config?.useArnRegion ?? loadConfig(NODE_USE_ARN_REGION_CONFIG_OPTIONS, loaderConfig),
    useDualstackEndpoint: config?.useDualstackEndpoint ?? loadConfig(NODE_USE_DUALSTACK_ENDPOINT_CONFIG_OPTIONS, loaderConfig),
    useFipsEndpoint: config?.useFipsEndpoint ?? loadConfig(NODE_USE_FIPS_ENDPOINT_CONFIG_OPTIONS, loaderConfig),
    userAgentAppId: config?.userAgentAppId ?? loadConfig(NODE_APP_ID_CONFIG_OPTIONS, loaderConfig)
  };
};
const getAwsRegionExtensionConfiguration = (runtimeConfig) => {
  return {
    setRegion(region) {
      runtimeConfig.region = region;
    },
    region() {
      return runtimeConfig.region;
    }
  };
};
const resolveAwsRegionExtensionConfiguration = (awsRegionExtensionConfiguration) => {
  return {
    region: awsRegionExtensionConfiguration.region()
  };
};
const getHttpAuthExtensionConfiguration = (runtimeConfig) => {
  const _httpAuthSchemes = runtimeConfig.httpAuthSchemes;
  let _httpAuthSchemeProvider = runtimeConfig.httpAuthSchemeProvider;
  let _credentials = runtimeConfig.credentials;
  return {
    setHttpAuthScheme(httpAuthScheme) {
      const index = _httpAuthSchemes.findIndex((scheme) => scheme.schemeId === httpAuthScheme.schemeId);
      if (index === -1) {
        _httpAuthSchemes.push(httpAuthScheme);
      } else {
        _httpAuthSchemes.splice(index, 1, httpAuthScheme);
      }
    },
    httpAuthSchemes() {
      return _httpAuthSchemes;
    },
    setHttpAuthSchemeProvider(httpAuthSchemeProvider) {
      _httpAuthSchemeProvider = httpAuthSchemeProvider;
    },
    httpAuthSchemeProvider() {
      return _httpAuthSchemeProvider;
    },
    setCredentials(credentials) {
      _credentials = credentials;
    },
    credentials() {
      return _credentials;
    }
  };
};
const resolveHttpAuthRuntimeConfig = (config) => {
  return {
    httpAuthSchemes: config.httpAuthSchemes(),
    httpAuthSchemeProvider: config.httpAuthSchemeProvider(),
    credentials: config.credentials()
  };
};
const resolveRuntimeExtensions = (runtimeConfig, extensions) => {
  const extensionConfiguration = Object.assign(getAwsRegionExtensionConfiguration(runtimeConfig), getDefaultExtensionConfiguration(runtimeConfig), getHttpHandlerExtensionConfiguration(runtimeConfig), getHttpAuthExtensionConfiguration(runtimeConfig));
  extensions.forEach((extension) => extension.configure(extensionConfiguration));
  return Object.assign(runtimeConfig, resolveAwsRegionExtensionConfiguration(extensionConfiguration), resolveDefaultRuntimeConfig(extensionConfiguration), resolveHttpHandlerRuntimeConfig(extensionConfiguration), resolveHttpAuthRuntimeConfig(extensionConfiguration));
};
class S3Client extends Client {
  config;
  constructor(...[configuration]) {
    const _config_0 = getRuntimeConfig(configuration || {});
    super(_config_0);
    this.initConfig = _config_0;
    const _config_1 = resolveClientEndpointParameters(_config_0);
    const _config_2 = resolveUserAgentConfig(_config_1);
    const _config_3 = resolveFlexibleChecksumsConfig(_config_2);
    const _config_4 = resolveRetryConfig(_config_3);
    const _config_5 = resolveRegionConfig(_config_4);
    const _config_6 = resolveHostHeaderConfig(_config_5);
    const _config_7 = resolveEndpointConfig(_config_6);
    const _config_8 = resolveEventStreamSerdeConfig(_config_7);
    const _config_9 = resolveHttpAuthSchemeConfig(_config_8);
    const _config_10 = resolveS3Config(_config_9, { session: [() => this, CreateSessionCommand] });
    const _config_11 = resolveRuntimeExtensions(_config_10, configuration?.extensions || []);
    this.config = _config_11;
    this.middlewareStack.use(getSchemaSerdePlugin(this.config));
    this.middlewareStack.use(getUserAgentPlugin(this.config));
    this.middlewareStack.use(getRetryPlugin(this.config));
    this.middlewareStack.use(getContentLengthPlugin(this.config));
    this.middlewareStack.use(getHostHeaderPlugin(this.config));
    this.middlewareStack.use(getLoggerPlugin(this.config));
    this.middlewareStack.use(getRecursionDetectionPlugin(this.config));
    this.middlewareStack.use(getHttpAuthSchemeEndpointRuleSetPlugin(this.config, {
      httpAuthSchemeParametersProvider: defaultS3HttpAuthSchemeParametersProvider,
      identityProviderConfigProvider: async (config) => new DefaultIdentityProviderConfig({
        "aws.auth#sigv4": config.credentials,
        "aws.auth#sigv4a": config.credentials
      })
    }));
    this.middlewareStack.use(getHttpSigningPlugin(this.config));
    this.middlewareStack.use(getValidateBucketNamePlugin(this.config));
    this.middlewareStack.use(getAddExpectContinuePlugin(this.config));
    this.middlewareStack.use(getRegionRedirectMiddlewarePlugin(this.config));
    this.middlewareStack.use(getS3ExpressPlugin(this.config));
    this.middlewareStack.use(getS3ExpressHttpSigningPlugin(this.config));
  }
  destroy() {
    super.destroy();
  }
}
function ssecMiddleware(options) {
  return (next) => async (args) => {
    const input = { ...args.input };
    const properties = [
      {
        target: "SSECustomerKey",
        hash: "SSECustomerKeyMD5"
      },
      {
        target: "CopySourceSSECustomerKey",
        hash: "CopySourceSSECustomerKeyMD5"
      }
    ];
    for (const prop of properties) {
      const value = input[prop.target];
      if (value) {
        let valueForHash;
        if (typeof value === "string") {
          if (isValidBase64EncodedSSECustomerKey(value, options)) {
            valueForHash = options.base64Decoder(value);
          } else {
            valueForHash = options.utf8Decoder(value);
            input[prop.target] = options.base64Encoder(valueForHash);
          }
        } else {
          valueForHash = ArrayBuffer.isView(value) ? new Uint8Array(value.buffer, value.byteOffset, value.byteLength) : new Uint8Array(value);
          input[prop.target] = options.base64Encoder(valueForHash);
        }
        const hash = new options.md5();
        hash.update(valueForHash);
        input[prop.hash] = options.base64Encoder(await hash.digest());
      }
    }
    return next({
      ...args,
      input
    });
  };
}
const ssecMiddlewareOptions = {
  name: "ssecMiddleware",
  step: "initialize",
  tags: ["SSE"],
  override: true
};
const getSsecPlugin = (config) => ({
  applyToStack: (clientStack) => {
    clientStack.add(ssecMiddleware(config), ssecMiddlewareOptions);
  }
});
function isValidBase64EncodedSSECustomerKey(str, options) {
  const base64Regex = /^(?:[A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;
  if (!base64Regex.test(str))
    return false;
  try {
    const decodedBytes = options.base64Decoder(str);
    return decodedBytes.length === 32;
  } catch {
    return false;
  }
}
class CopyObjectCommand extends Command.classBuilder().ep({
  ...commonParams,
  DisableS3ExpressSessionAuth: { type: "staticContextParams", value: true },
  Bucket: { type: "contextParams", name: "Bucket" },
  Key: { type: "contextParams", name: "Key" },
  CopySource: { type: "contextParams", name: "CopySource" }
}).m(function(Command2, cs2, config, o2) {
  return [
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions()),
    getThrow200ExceptionsPlugin(config),
    getSsecPlugin(config)
  ];
}).s("AmazonS3", "CopyObject", {}).n("S3Client", "CopyObjectCommand").sc(CopyObject$).build() {
}
class DeleteObjectCommand extends Command.classBuilder().ep({
  ...commonParams,
  Bucket: { type: "contextParams", name: "Bucket" },
  Key: { type: "contextParams", name: "Key" }
}).m(function(Command2, cs2, config, o2) {
  return [
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions()),
    getThrow200ExceptionsPlugin(config)
  ];
}).s("AmazonS3", "DeleteObject", {}).n("S3Client", "DeleteObjectCommand").sc(DeleteObject$).build() {
}
class DeleteObjectsCommand extends Command.classBuilder().ep({
  ...commonParams,
  Bucket: { type: "contextParams", name: "Bucket" }
}).m(function(Command2, cs2, config, o2) {
  return [
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions()),
    getFlexibleChecksumsPlugin(config, {
      requestAlgorithmMember: { "httpHeader": "x-amz-sdk-checksum-algorithm", "name": "ChecksumAlgorithm" },
      requestChecksumRequired: true
    }),
    getThrow200ExceptionsPlugin(config)
  ];
}).s("AmazonS3", "DeleteObjects", {}).n("S3Client", "DeleteObjectsCommand").sc(DeleteObjects$).build() {
}
class PutObjectCommand extends Command.classBuilder().ep({
  ...commonParams,
  Bucket: { type: "contextParams", name: "Bucket" },
  Key: { type: "contextParams", name: "Key" }
}).m(function(Command2, cs2, config, o2) {
  return [
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions()),
    getFlexibleChecksumsPlugin(config, {
      requestAlgorithmMember: { "httpHeader": "x-amz-sdk-checksum-algorithm", "name": "ChecksumAlgorithm" },
      requestChecksumRequired: false
    }),
    getCheckContentLengthHeaderPlugin(),
    getThrow200ExceptionsPlugin(config),
    getSsecPlugin(config)
  ];
}).s("AmazonS3", "PutObject", {}).n("S3Client", "PutObjectCommand").sc(PutObject$).build() {
}
const agent = new https.Agent({
  keepAlive: true,
  // 保持连接开启，以便复用
  maxSockets: 20,
  // 最大并发连接数
  timeout: 3e4
  // 连接超时时间 (30秒)
});
const R2_NOVELS_BUCKET = env$1.R2_NOVELS_BUCKET;
const R2_ASSETS_BUCKET = env$1.R2_ASSETS_BUCKET;
const R2 = new S3Client({
  region: env$1.R2_REGION,
  endpoint: env$1.R2_ENDPOINT,
  credentials: {
    accessKeyId: env$1.R2_ACCESS_KEY_ID,
    secretAccessKey: env$1.R2_SECRET_ACCESS_KEY
  },
  requestHandler: {
    destroy: () => {
    },
    agent
  }
});
async function uploadSingleFile({
  file,
  fileKey,
  fileType,
  bucket,
  cacheControl
}) {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: fileKey,
      Body: buffer,
      ContentType: fileType,
      CacheControl: cacheControl
    });
    await R2.send(command);
    return { fileKey, error: null };
  } catch (err) {
    console.error(err);
    return { error: err };
  }
}
async function copySingleFile({
  bucket,
  source,
  destination,
  contentType,
  cacheControl
}) {
  try {
    const copyCommand = new CopyObjectCommand({
      Bucket: bucket,
      CopySource: source,
      Key: destination,
      ContentType: contentType,
      CacheControl: cacheControl
    });
    await R2.send(copyCommand);
    const deleteCommand = new DeleteObjectCommand({
      Bucket: bucket,
      Key: source
    });
    await R2.send(deleteCommand);
    return { error: null };
  } catch (err) {
    console.error(err);
    return { error: err };
  }
}
async function deleteSingleFile(fileKey, bucket) {
  const params = {
    Bucket: bucket,
    Key: fileKey
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
async function deleteMultipleFiles(fileKeys, bucket) {
  try {
    const command = new DeleteObjectsCommand({
      Bucket: bucket,
      Delete: {
        Objects: fileKeys.map((key) => ({ Key: key }))
      }
    });
    await R2.send(command);
    return { success: true };
  } catch (err) {
    console.error(err);
    return { error: err };
  }
}
export {
  resolveDefaultsModeConfig as $,
  v4 as A,
  HttpBindingProtocol as B,
  CredentialsProviderError as C,
  HttpInterceptingShapeSerializer as D,
  ENV_ACCOUNT_ID as E,
  HttpInterceptingShapeDeserializer as F,
  chain as G,
  HttpRequest as H,
  readFile as I,
  resolveAwsSdkSigV4Config as J,
  normalizeProvider$1 as K,
  LazyJsonString as L,
  getSmithyContext as M,
  NodeHttpHandler as N,
  EndpointCache as O,
  ProtocolLib as P,
  resolveEndpoint as Q,
  awsEndpointFunctions as R,
  SerdeContextConfig as S,
  customEndpointFunctions as T,
  UnionSerde as U,
  ServiceException as V,
  TypeRegistry as W,
  parseUrl as X,
  NoOpLogger as Y,
  AwsSdkSigV4Signer as Z,
  emitWarningIfUnsupportedVersion as _,
  ENV_CREDENTIAL_SCOPE as a,
  HttpProtocol as a$,
  emitWarningIfUnsupportedVersion$1 as a0,
  streamCollector$1 as a1,
  calculateBodyLength as a2,
  loadConfig as a3,
  NODE_APP_ID_CONFIG_OPTIONS as a4,
  NODE_USE_FIPS_ENDPOINT_CONFIG_OPTIONS as a5,
  NODE_USE_DUALSTACK_ENDPOINT_CONFIG_OPTIONS as a6,
  Hash as a7,
  NODE_RETRY_MODE_CONFIG_OPTIONS as a8,
  DEFAULT_RETRY_MODE as a9,
  getHttpSigningPlugin as aA,
  resolveHostHeaderConfig as aB,
  Command as aC,
  getEndpointPlugin as aD,
  HttpResponse as aE,
  commonParams as aF,
  getFlexibleChecksumsPlugin as aG,
  getSsecPlugin as aH,
  GetObject$ as aI,
  getThrow200ExceptionsPlugin as aJ,
  ListObjectsV2$ as aK,
  buildQueryString as aL,
  SignatureV4MultiRegion as aM,
  getEndpointFromInstructions as aN,
  R2_NOVELS_BUCKET as aO,
  R2 as aP,
  deleteMultipleFiles as aQ,
  deleteSingleFile as aR,
  R2_ASSETS_BUCKET as aS,
  uploadSingleFile as aT,
  DeleteObjectsCommand as aU,
  PutObjectCommand as aV,
  ProviderError as aW,
  IniSectionType as aX,
  CONFIG_PREFIX_SEPARATOR as aY,
  getConfigFilepath as aZ,
  parseIni as a_,
  NODE_REGION_CONFIG_FILE_OPTIONS as aa,
  NODE_REGION_CONFIG_OPTIONS as ab,
  NODE_MAX_ATTEMPT_CONFIG_OPTIONS as ac,
  createDefaultUserAgentProvider as ad,
  NODE_AUTH_SCHEME_PREFERENCE_OPTIONS as ae,
  loadConfigsForDefaultMode as af,
  getAwsRegionExtensionConfiguration as ag,
  getDefaultExtensionConfiguration as ah,
  getHttpHandlerExtensionConfiguration as ai,
  resolveAwsRegionExtensionConfiguration as aj,
  resolveDefaultRuntimeConfig as ak,
  resolveHttpHandlerRuntimeConfig as al,
  Client as am,
  resolveUserAgentConfig as an,
  resolveRetryConfig as ao,
  resolveRegionConfig as ap,
  resolveEndpointConfig as aq,
  getSchemaSerdePlugin as ar,
  getUserAgentPlugin as as,
  getRetryPlugin as at,
  getContentLengthPlugin as au,
  getHostHeaderPlugin as av,
  getLoggerPlugin as aw,
  getRecursionDetectionPlugin as ax,
  getHttpAuthSchemeEndpointRuleSetPlugin as ay,
  DefaultIdentityProviderConfig as az,
  ENV_EXPIRATION as b,
  extendedEncodeURIComponent as b0,
  XmlShapeDeserializer as b1,
  deref as b2,
  ENV_KEY as c,
  ENV_SECRET as d,
  ENV_SESSION as e,
  fromEnv as f,
  fileIntercept as g,
  fromUtf8$2 as h,
  copySingleFile as i,
  getHomeDir as j,
  getProfileName as k,
  loadSharedConfigFiles as l,
  sdkStreamMixin as m,
  NumericValue as n,
  collectBody$1 as o,
  parseRfc3339DateTime as p,
  NormalizedSchema as q,
  fromBase64 as r,
  setCredentialFeature as s,
  toUtf8 as t,
  determineTimestampFormat as u,
  parseEpochTimestamp as v,
  parseRfc7231DateTime as w,
  parseRfc3339DateTimeWithOffset as x,
  toBase64 as y,
  dateToUtcString as z
};
