globalThis.process ??= {};
globalThis.process.env ??= {};
import { t as tokenIntercept } from "./getSSOTokenFromFile_8CqH-G7a.mjs";
import { g as fileIntercept } from "./r2_fNuLAT3E.mjs";
const externalDataInterceptor = {
  getFileRecord() {
    return fileIntercept;
  },
  interceptFile(path, contents) {
    fileIntercept[path] = Promise.resolve(contents);
  },
  getTokenRecord() {
    return tokenIntercept;
  },
  interceptToken(id, contents) {
    tokenIntercept[id] = contents;
  }
};
export {
  externalDataInterceptor as e
};
