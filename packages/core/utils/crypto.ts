export const _bytesToBase64UrlSafe = (array: Uint8Array | ArrayBuffer) => {
  return Buffer.from(array)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
};

export const _base64UrlSafeToBytes = (b64: string) => {
  return Buffer.from(b64.replace(/-/g, "+").replace(/_/g, "/"), "base64");
};

export const _generateRandomString = () => {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return _bytesToBase64UrlSafe(array);
};

export const _generateCodeChallenge = async (code_verifier: string) => {
  var digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(code_verifier)
  );
  return _bytesToBase64UrlSafe(digest);
};
