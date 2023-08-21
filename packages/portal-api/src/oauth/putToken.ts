import { _generateRandomString } from "@authportal/core/signIn/utils/crypto";
import { PutTokenRequestBody } from "@authportal/portal/components/req/continueWithUser";
import { putPayload } from "../services/payload";
import { getHostname } from "../services/hostname";
import { validateAuthorizeParams } from "../services/validateAuthorizeParams";

export const putToken = async (req: Request, env: Env) => {
  const domain = getHostname(req);

  const { payload, ...unsafeAuthorizeParams } = PutTokenRequestBody.parse(
    await req.json(),
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
