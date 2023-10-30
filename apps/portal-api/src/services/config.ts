import { Env } from "../types";
import { ConfigKVObject } from "@authportal/db-types/cloudflare/config";

export const getConfigFromKV = (env: Env, domain: string) => {
  return env.CONFIG.get<ConfigKVObject>(domain, "json");
};

export const putConfigInKV = async (
  env: Env,
  domain: string,
  config: Omit<ConfigKVObject, "updated_at">,
) => {
  await env.CONFIG.put(
    domain,
    JSON.stringify({ ...config, updated_at: new Date().toISOString() }),
  );
};

export const deleteConfigInKV = async (env: Env, domain: string) => {
  await env.CONFIG.delete(domain);
};
