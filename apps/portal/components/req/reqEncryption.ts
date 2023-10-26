import { _generateRandomString } from "@authportal/core/signIn/utils/crypto";
import { aesGcmDecrypt, aesGcmEncrypt } from "./aesGcm";
import { z } from "zod";
import jsCookie from "js-cookie";

const COOKIE_KEY = "authportal-key";

export const ReqParams = z.object({
  client_id: z.string(),
  code_challenge: z.string().length(43),
  scope: z.literal("firebase_auth"),
  redirect_uri: z.string().max(512),
  state: z.string().max(512).optional(),
  response_mode: z.literal("web_message").optional(),
});

export type ReqParams = z.infer<typeof ReqParams>;

export const encryptReq = async (unsafeParams: ReqParams): Promise<string> => {
  const params = ReqParams.parse(unsafeParams);

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

export const decryptReq = async (req: string): Promise<ReqParams> => {
  const cookie = jsCookie.get(COOKIE_KEY);
  if (cookie == null) throw new Error("Invalid cookie");

  const unsafeParams = await aesGcmDecrypt(req, cookie);

  return ReqParams.parse(unsafeParams);
};
