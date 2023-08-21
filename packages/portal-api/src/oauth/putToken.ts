import { _generateRandomString } from "@authportal/core/signIn/utils/crypto";
import { ReqParams } from "@authportal/portal/components/req/reqEncryption";
import { z } from "zod";
import { putPayload } from "../services/payload";
import { getHostname } from "../services/hostname";
import { validateAuthorizeParams } from "../services/validateAuthorizeParams";

const ContinueBody = ReqParams.extend({
  payload: z
    .object({
      firebase_user: z.record(z.unknown()),
    })
    .strict(),
}).strict();

export const putToken = async (req: Request, env: Env) => {
  const domain = getHostname(req);

  const { payload, ...unsafeAuthorizeParams } = ContinueBody.parse(
    Object.fromEntries(await req.formData()),
  );
  const { client_id, code_challenge, redirect_uri } =
    await validateAuthorizeParams(env, domain, unsafeAuthorizeParams);

  const code = await putPayload(
    env,
    client_id,
    redirect_uri,
    code_challenge,
    payload,
  );

  return Response.json({ code });
};
