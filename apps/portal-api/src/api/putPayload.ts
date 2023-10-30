import { _generateRandomString } from "@authportal/core/signIn/utils/crypto";
import { Env } from "../types";
import { FirebasePayload } from "@authportal/db-types/cloudflare/payload";

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
