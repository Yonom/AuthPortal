import { Env } from "../types";
import { ConfigKVObject } from "@authportal/db-types/cloudflare/config";

export const getConfigFromKV = async (env: Env, domain: string) => {
  const res = await env.CONFIG.get<ConfigKVObject>(domain, "json");
  if (!res) throw new Error("Invalid domain");

  return res;
};

export const putConfigInKV = async (
  env: Env,
  domain: string,
  config: ConfigKVObject,
) => {
  await env.CONFIG.put(
    domain,
    JSON.stringify({ ...config, updated_at: new Date().toISOString() }),
  );
};

export const deleteConfigInKV = async (env: Env, domain: string) => {
  await env.CONFIG.delete(domain);
};
