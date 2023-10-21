import { z } from "zod";
import { Env } from "../types";

export const PortalConfig = z.object({
  firebase_config: z.record(z.string()),
  providers: z.array(z.object({ provider_id: z.string() })),
  theme: z.object({ primary_color: z.string().optional() }).optional(),
});

export const ConfigKVObject = z.object({
  portal_config: PortalConfig,
  clients: z.record(
    z.object({ name: z.string(), redirect_uris: z.string().array() }),
  ),
});

export type PortalConfig = z.infer<typeof PortalConfig>;
export type ConfigKVObject = z.infer<typeof ConfigKVObject>;

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
  await env.CONFIG.put(domain, JSON.stringify(config));
};

export const deleteConfigInKV = async (env: Env, domain: string) => {
  await env.CONFIG.delete(domain);
};
