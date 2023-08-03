import {
  _generateCodeChallenge,
  _generateRandomString,
} from "@authportal/core/utils/crypto";
import { _AuthPortalFirebasePayload } from "@authportal/core/utils/api";
import { getDb } from "./db";

export const getPayload = async (
  client_id: string,
  redirect_uri: string,
  code: string,
  code_verifier: string
) => {
  const db = await getDb();
  const payloadKey = `${client_id}.${code}`;
  const payloadObject = await db.payload.get(payloadKey);
  if (payloadObject == null) return null;
  await db.payload.del(payloadKey);

  if (payloadObject.redirect_uri !== redirect_uri) return null;

  const code_challenge = await _generateCodeChallenge(code_verifier);
  if (payloadObject.code_challenge !== code_challenge) return null;

  return payloadObject.payload;
};

export const putPayload = async (
  client_id: string,
  redirect_uri: string,
  code_challenge: string,
  payload: _AuthPortalFirebasePayload
) => {
  const code = _generateRandomString();

  const db = await getDb();
  await db.payload.set(
    `${client_id}.${code}`,
    {
      redirect_uri,
      code_challenge,
      payload,
    },
    {
      expire: 60 * 5, // 5 minutes
    }
  );

  return code;
};
