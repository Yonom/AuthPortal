import { _normalizeRedirectUri } from "./redirectUri";

export type _RedirectConfig =
  | {
      redirect_uri: string;
    }
  | {
      redirect_path: string;
    };

export type _Config = {
  domain: string;
  client_id: string;
  redirect_uri: string;
};

export type _InitConfig = Omit<_Config, "redirect_uri"> & _RedirectConfig;

export const _normalizeConfig = <T>(config: T & _InitConfig): T & _Config => {
  if (config == null) throw new Error("config is required");
  if (!config.domain) throw new Error("config.domain is required");
  if (!config.client_id) throw new Error("config.client_id is required");
  if (!("redirect_uri" in config) && !("redirect_path" in config))
    throw new Error("config.redirect_uri or config.redirect_path is required");

  let res: T & _Config;
  if ("redirect_path" in config) {
    const { redirect_path, ...r } = config;

    const origin =
      typeof window === "undefined"
        ? "https://localhost"
        : window.location.origin;

    res = {
      ...r,
      redirect_uri: `${origin}${redirect_path}`,
    } as T & _Config;
  } else {
    res = { ...config };
  }

  return Object.freeze(res);
};
