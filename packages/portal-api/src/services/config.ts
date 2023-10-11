import { z } from "zod";

export const PortalConfig = z.object({
  firebase_config: z.record(z.string()),
  providers: z.array(z.object({ provider_id: z.string() })),
});

export const ConfigKVObject = z.object({
  portal_config: PortalConfig,
  clients: z.record(z.object({ redirect_uris: z.string().array() })),
});

export type PortalConfig = {
  firebase_config: Record<string, string>;
  providers: { provider_id: string }[];
};

export type ConfigKVObject = {
  portal_config: PortalConfig;
  clients: {
    [client_id: string]: {
      redirect_uris: string[];
    };
  };
};

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
