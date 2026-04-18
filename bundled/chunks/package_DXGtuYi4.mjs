globalThis.process ??= {};
globalThis.process.env ??= {};
class NoAuthSigner {
  async sign(httpRequest, identity, signingProperties) {
    return httpRequest;
  }
}
const version = "3.996.19";
const packageInfo = {
  version
};
export {
  NoAuthSigner as N,
  packageInfo as p
};
