import { AuthorizeParams } from "@authportal/portal/components/req/reqEncryption";
import { getConfig } from "./config";

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
export const validateAuthorizeParams = async (
  env: Env,
  domain: string,
  params: AuthorizeParams
) => {
  const config = await getConfig(env, domain);

  const { client_id, redirect_uri } = params;

  const client = config.clients[client_id];
  if (client == null) throw new Error("Invalid client id");

  if (!_isRedirectUriMatch(redirect_uri, client.redirect_uris))
    throw new Error("Invalid redirect uri");

  return params;
};
