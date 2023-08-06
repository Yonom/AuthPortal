import { _generateRandomString } from "@authportal/core/utils/crypto";
import { AuthorizeParams } from "@authportal/portal/components/req/reqEncryption";
import { z } from "zod";
import { putPayload } from "../services/payload";
import { getDomain, getOrigin } from "../services/origin";
import { validateAuthorizeParams } from "../services/validateAuthorizeParams";

const ContinueBody = AuthorizeParams.extend({
  payload_json: z.string(),
}).strict();

const Payload = z
  .object({
    firebase_user: z.record(z.unknown()),
  })
  .strict();

export const postContinue = async (req: Request, env: Env) => {
  const domain = getDomain(req);
  const origin = getOrigin(req);

  const { payload_json, ...unsafeAuthorizeParams } = ContinueBody.parse(
    Object.fromEntries(await req.formData())
  );
  const { client_id, code_challenge, redirect_uri, state } =
    await validateAuthorizeParams(env, domain, unsafeAuthorizeParams);

  const payload = Payload.parse(JSON.parse(payload_json));

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
