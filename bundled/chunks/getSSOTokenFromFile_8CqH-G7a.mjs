globalThis.process ??= {};
globalThis.process.env ??= {};
import { readFile } from "fs/promises";
import { createHash } from "crypto";
import { join } from "path";
import { j as getHomeDir } from "./r2_fNuLAT3E.mjs";
const getSSOTokenFilepath = (id) => {
  const hasher = createHash("sha1");
  const cacheName = hasher.update(id).digest("hex");
  return join(getHomeDir(), ".aws", "sso", "cache", `${cacheName}.json`);
};
const tokenIntercept = {};
const getSSOTokenFromFile = async (id) => {
  if (tokenIntercept[id]) {
    return tokenIntercept[id];
  }
  const ssoTokenFilepath = getSSOTokenFilepath(id);
  const ssoTokenText = await readFile(ssoTokenFilepath, "utf8");
  return JSON.parse(ssoTokenText);
};
export {
  getSSOTokenFromFile as a,
  getSSOTokenFilepath as g,
  tokenIntercept as t
};
