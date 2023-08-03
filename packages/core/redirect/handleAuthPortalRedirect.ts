import { _AuthPortalFirebasePayload, _getToken } from "../utils/api";
import {
  _getRedirectConfig,
  _removeRedirectConfig,
} from "../utils/localStorage";

const _getRedirectParams = (domain: string, current_url: string) => {
  const url = new URL(current_url);
  const code = url.searchParams.get("code");
  const iss = url.searchParams.get("iss");
  if (code == null) return null;
  if (iss !== "https://" + domain) return null;
  return { code };
};

export const _handleAuthPortalRedirect = async (
  domain: string,
  client_id: string,
  current_url: string
) => {
  const redirectConfig = _getRedirectConfig(client_id);
  if (redirectConfig == null) throw new Error("Unexpected redirect");

  const redirectParams = _getRedirectParams(domain, current_url);
  if (redirectParams == null) throw new Error("Invalid redirect params");

  const payload = await _getToken(
    domain,
    client_id,
    redirectConfig.redirect_uri,
    redirectParams.code,
    redirectConfig.code_verifier
  );
  _removeRedirectConfig(client_id);
  return { return_to: redirectConfig.return_to, payload };
};
