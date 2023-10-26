import {
  _generateCodeChallenge,
  _generateRandomString,
} from "@authportal/core/signIn/utils/crypto";
import { Env } from "../types";
import {
  FirebasePayload,
  PayloadKVObject,
} from "@authportal/db-types/cloudflare/payload";

export const getPayload = async (
  env: Env,
  client_id: string,
  redirect_uri: string,
  code: string,
  code_verifier: string,
) => {
  const payloadKey = `${client_id}.${code}`;
  const payloadObject = await env.PAYLOAD.get<PayloadKVObject>(
    payloadKey,
    "json",
  );
  if (payloadObject == null) return null;
  await env.PAYLOAD.delete(payloadKey);

  if (payloadObject.redirect_uri !== redirect_uri) return null;

  const code_challenge = await _generateCodeChallenge(code_verifier);
  if (payloadObject.code_challenge !== code_challenge) return null;

  return payloadObject.payload;
};

export const putPayload = async (
  env: Env,
  client_id: string,
  redirect_uri: string,
  code_challenge: string,
  payload: FirebasePayload,
) => {
  const code = _generateRandomString();

  await env.PAYLOAD.put(
    `${client_id}.${code}`,
    JSON.stringify({
      redirect_uri,
      code_challenge,
      payload,
    }),
    {
      expirationTtl: 60 * 5, // 5 minutes
    },
  );

  return code;
};
