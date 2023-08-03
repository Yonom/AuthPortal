import { _normalizeRedirectUri } from "./redirectUri";

export type _AuthPortalRedirectConfig =
  | {
      redirect_uri: string;
    }
  | {
      redirect_path: string;
    };

export type _AuthPortalConfig = {
  domain: string;
  client_id: string;
  redirect_uri: string;
};

export type InitAuthPortalConfig = Omit<_AuthPortalConfig, "redirect_uri"> &
  _AuthPortalRedirectConfig;

export const _normalizeConfig = (
  config: InitAuthPortalConfig
): _AuthPortalConfig => {
  if (config == null) throw new Error("config is required");
  if (!config.domain) throw new Error("config.domain is required");
  if (!config.client_id) throw new Error("config.client_id is required");
  if (!("redirect_uri" in config) && !("redirect_path" in config))
    throw new Error("config.redirect_uri or config.redirect_path is required");

  let redirect_uri: string;
  if ("redirect_path" in config) {
    const origin =
      typeof window === "undefined"
        ? "https://localhost"
        : window.location.origin;
    redirect_uri = `${origin}${config.redirect_path}`;
  } else {
    redirect_uri = config.redirect_uri;
  }

  return Object.freeze({
    domain: config.domain,
    client_id: config.client_id,
    redirect_uri: _normalizeRedirectUri(redirect_uri),
  });
};
