import {
  _bytesToBase64UrlSafe,
  _base64UrlSafeToBytes,
} from "@authportal/core/utils/crypto";

export async function aesGcmEncrypt(
  data: object,
  password: string
): Promise<string> {
  const passwordBytes = _base64UrlSafeToBytes(password);

  const dataBytes = new TextEncoder().encode(JSON.stringify(data));

  const iv = crypto.getRandomValues(new Uint8Array(12));
  const alg = { name: "AES-GCM", iv };
  const key = await crypto.subtle.importKey("raw", passwordBytes, alg, false, [
    "encrypt",
  ]);

  const ct = await crypto.subtle.encrypt(alg, key, dataBytes);

  const ivStr = _bytesToBase64UrlSafe(iv);
  const ctStr = _bytesToBase64UrlSafe(new Uint8Array(ct));

  return `${ivStr}.${ctStr}`;
}

export async function aesGcmDecrypt(ciphertext: string, password: string) {
  const parts = ciphertext.split(".");
  if (parts.length !== 2) throw new Error("Invalid ciphertext format");
  const [ivStr, ctStr] = parts;

  const passwordBytes = _base64UrlSafeToBytes(password);

  const ct = _base64UrlSafeToBytes(ctStr);
  const iv = _base64UrlSafeToBytes(ivStr);

  const alg = { name: "AES-GCM", iv };
  const key = await crypto.subtle.importKey("raw", passwordBytes, alg, false, [
    "decrypt",
  ]);

  const dataBytes = await crypto.subtle.decrypt(alg, key, ct);
  const data = new TextDecoder().decode(dataBytes);

  return JSON.parse(data);
}
