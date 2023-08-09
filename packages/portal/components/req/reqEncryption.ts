import { _generateRandomString } from "@authportal/core/utils/crypto";
import { aesGcmDecrypt, aesGcmEncrypt } from "./aesGcm";
import { z } from "zod";
import jsCookie from "js-cookie";

const COOKIE_KEY = "authportal-key";

export const AuthorizeParams = z.object({
  client_id: z.string(),
  code_challenge: z.string().length(43),
  scope: z.literal("firebase_auth"),
  redirect_uri: z.string().max(512),
  state: z.string().max(512).optional(),
});

export type AuthorizeParams = z.infer<typeof AuthorizeParams>;

export const encryptReq = async (
  unsafeParams: AuthorizeParams
): Promise<string> => {
  const params = AuthorizeParams.parse(unsafeParams);

  let cookie = jsCookie.get(COOKIE_KEY);
  if (cookie == null) {
    cookie = _generateRandomString();
  }

  const secure = window.location.protocol !== "http";
  jsCookie.set(COOKIE_KEY, cookie, {
    expires: 1,
    secure,
    sameSite: secure ? "None" : "Lax",
  });

  const req = await aesGcmEncrypt(params, cookie);

  return req;
};

export const decryptReq = async (req: string): Promise<AuthorizeParams> => {
  const cookie = jsCookie.get(COOKIE_KEY);
  if (cookie == null) throw new Error("Invalid cookie");

  const unsafeParams = await aesGcmDecrypt(req, cookie);

  return AuthorizeParams.parse(unsafeParams);
};
