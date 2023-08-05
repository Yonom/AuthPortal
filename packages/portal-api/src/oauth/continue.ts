import { _generateRandomString } from "@authportal/core/utils/crypto";
import { z } from "zod";
import { decryptState } from "../services/state/stateEncryption";
import { putPayload } from "../services/payload";
import { getDomain, getOrigin } from "../services/origin";

const ContinueSearchParams = z.object({
  state: z.string(),
});

const ContinueBody = z.object({
  payload_json: z.string(),
});

const Payload = z.object({
  firebase_user: z.record(z.unknown()),
});

export const postContinue = async (req: Request, env: Env) => {
  const domain = getDomain(req);
  const origin = getOrigin(req);

  const { searchParams } = new URL(req.url);
  const { state: encryptedState } = ContinueSearchParams.parse(
    Object.fromEntries(searchParams)
  );
  const { payload_json } = ContinueBody.parse(
    Object.fromEntries(await req.formData())
  );
  const payload = Payload.parse(JSON.parse(payload_json));

  const { client_id, code_challenge, redirect_uri, state } = await decryptState(
    req,
    env,
    domain,
    encryptedState
  );

  const code = await putPayload(
    env,
    client_id,
    redirect_uri,
    code_challenge,
    payload
  );

  const redirectUrl = new URL(redirect_uri);
  redirectUrl.searchParams.set("code", code);
  if (state) {
    redirectUrl.searchParams.set("state", state);
  }
  redirectUrl.searchParams.set("iss", origin);

  return Response.redirect(redirectUrl.toString(), 302);
};
