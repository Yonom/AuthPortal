import { _generateRandomString, _generateCodeChallenge } from "../utils/crypto";
import { _setRedirectConfig } from "../utils/localStorage";
import { _AuthPortalConfig } from "../utils/config";

const _getAuthPortalAuthorizeUrl = (
  domain: string,
  client_id: string,
  code_challenge: string,
  scope: "firebase_auth",
  redirect_uri: string
) => {
  const url = new URL(`https://${domain}/authorize`);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("client_id", client_id);
  url.searchParams.set("code_challenge", code_challenge);
  url.searchParams.set("code_challenge_method", "S256");
  url.searchParams.set("scope", scope);
  url.searchParams.set("redirect_uri", redirect_uri);
  return url;
};

const _getReturnTo = (return_to?: string) => {
  // by default return to current page
  return return_to ?? window.location.href;
};

export type _SignInWithAuthPortalConfig = {
  scope: "firebase_auth";
  return_to?: string;
};

export const _signInWithAuthPortal = async (
  config: _AuthPortalConfig,
  signInParams: _SignInWithAuthPortalConfig
) => {
  const codeVerifier = _generateRandomString();
  _setRedirectConfig(config.client_id, {
    redirect_uri: config.redirect_uri,
    code_verifier: codeVerifier,
    return_to: _getReturnTo(signInParams?.return_to),
    expires_at: Date.now() + 60 * 60 * 24 * 1000, // 1 day
  });

  const code_challenge = await _generateCodeChallenge(codeVerifier);
  const url = _getAuthPortalAuthorizeUrl(
    config.domain,
    config.client_id,
    code_challenge,
    signInParams.scope,
    config.redirect_uri
  );

  // redirect to authportal
  window.location.href = url.href;
};
