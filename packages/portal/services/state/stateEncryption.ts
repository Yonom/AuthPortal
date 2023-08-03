import { _generateRandomString } from "@authportal/core/utils/crypto";
import { cookies, headers } from "next/headers";
import { aesGcmDecrypt, aesGcmEncrypt } from "./aesGcm";
import { z } from "zod";
import { getConfig } from "../config";
import { ConfigKVObject } from "../db/types";
import { getPortalHost } from "../origin";

const COOKIE_KEY = "authportal.key";

export const AuthorizeState = z.object({
  client_id: z.string(),
  code_challenge: z.string().length(43),
  scope: z.literal("firebase_auth"),
  redirect_uri: z.string().max(512),
  state: z.string().max(512).optional(),
});

export type AuthorizeState = z.infer<typeof AuthorizeState>;

const _isRedirectUriMatch = (
  redirect_uri: string,
  allowed_redirect_uris: string[]
) => {
  const url = new URL(redirect_uri);
  if (url.hostname === "localhost") {
    // ignore port number from localhost urls
    url.port = "";
  }
  const redirect_uri_to_match = url.href;

  return allowed_redirect_uris.indexOf(redirect_uri_to_match) !== -1;
};

const parseState = async (config: ConfigKVObject, unsafeState: unknown) => {
  const state = AuthorizeState.parse(unsafeState);
  const { client_id, redirect_uri } = state;

  const client = config.clients[client_id];
  if (client == null) throw new Error("Invalid client id");

  if (!_isRedirectUriMatch(redirect_uri, client.redirect_uris))
    throw new Error("Invalid redirect uri");

  return state;
};

export const encryptState = async (unsafeState: Record<string, unknown>) => {
  const config = await getConfig(getPortalHost());
  const state = await parseState(config, unsafeState);

  let cookie = cookies().get(COOKIE_KEY)?.value;
  if (cookie == null) {
    cookie = _generateRandomString();
  }

  const secure = !(headers().get("X-Forwarded-Proto") === "http");
  cookies().set(COOKIE_KEY, cookie, {
    path: "/",
    secure,
    httpOnly: true,
    sameSite: secure ? "none" : "lax",
    maxAge: 60 * 60 * 24, // 1 day
  });

  return aesGcmEncrypt(state, cookie);
};

export const decryptState = async (encryptedState: string) => {
  const cookie = cookies().get(COOKIE_KEY)?.value;
  if (cookie == null) throw new Error("Invalid cookie");

  const config = await getConfig(getPortalHost());
  const res = await aesGcmDecrypt(encryptedState, cookie);

  return parseState(config, res);
};
