import { ReqParams } from "@authportal/portal/components/req/reqEncryption";
import { getConfigFromKV } from "./config";

const _isRedirectUriMatch = (
  redirect_uri: string,
  allowed_redirect_uris: string[],
) => {
  const url = new URL(redirect_uri);
  if (url.hostname === "localhost") {
    // ignore port number from localhost urls
    url.port = "";
  }
  const redirect_uri_to_match = url.href;

  return allowed_redirect_uris.indexOf(redirect_uri_to_match) !== -1;
};

const validateRedirectUri = (
  response_mode: "web_message" | undefined,
  redirect_uri: string,
  allowed_redirect_uris: string[],
) => {
  // for web_message (popup), only validate the origin
  if (response_mode === "web_message") {
    const redirect_origin = new URL(redirect_uri).origin + "/";
    const allowed_redirect_origins = allowed_redirect_uris.map(
      (uri) => new URL(uri).origin + "/",
    );
    return _isRedirectUriMatch(redirect_origin, allowed_redirect_origins);
  }

  return _isRedirectUriMatch(redirect_uri, allowed_redirect_uris);
};

export const validateAuthorizeParams = async (
  env: Env,
  domain: string,
  params: ReqParams,
) => {
  const config = await getConfigFromKV(env, domain);

  const { client_id, redirect_uri, response_mode } = params;

  const client = config.clients[client_id];
  if (client == null) throw new Error("Invalid client id");

  if (!validateRedirectUri(response_mode, redirect_uri, client.redirect_uris))
    throw new Error("Invalid redirect uri");

  return params;
};
