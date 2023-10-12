import { _generateRandomString, _generateCodeChallenge } from "../utils/crypto";
import { _setRedirectConfig } from "./localStorage";
import { _getAuthorizeUrl } from "../utils/portalApi";

const _getReturnTo = (return_to?: string) => {
  // by default return to current page
  return return_to ?? window.location.href;
};

export const _signInWithRedirect = async (
  domain: string,
  client_id: string,
  redirect_uri: string,
  scope: "firebase_auth",
  screen_hint: "signup" | undefined,
  return_to: string | undefined,
) => {
  const code_verifier = _generateRandomString();
  _setRedirectConfig(client_id, {
    redirect_uri,
    code_verifier,
    return_to: _getReturnTo(return_to),
    expires_at: Date.now() + 60 * 60 * 24 * 1000, // 1 day
  });

  const code_challenge = await _generateCodeChallenge(code_verifier);
  const url = _getAuthorizeUrl(
    domain,
    client_id,
    code_challenge,
    scope,
    redirect_uri,
    screen_hint,
  );

  // redirect to authportal
  window.location.href = url.href;
};
