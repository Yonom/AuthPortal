function base64ToBytes(base64: string) {
  const binString = atob(base64);
  return Uint8Array.from(binString, (m) => m.codePointAt(0) ?? 0);
}

function bytesToBase64(bytes: Uint8Array) {
  const binString = Array.from(bytes, (x) => String.fromCodePoint(x)).join("");
  return btoa(binString);
}

export const _bytesToBase64UrlSafe = (array: Uint8Array) => {
  return bytesToBase64(array)
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
};

export const _base64UrlSafeToBytes = (b64: string) => {
  return base64ToBytes(b64.replace(/-/g, "+").replace(/_/g, "/"));
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
  return _bytesToBase64UrlSafe(new Uint8Array(digest));
};
