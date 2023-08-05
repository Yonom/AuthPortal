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


export const getConfig = async (env: Env, domain: string) => {
  const res = await env.CONFIG.get<ConfigKVObject>(domain, "json");
  if (!res) throw new Error("Invalid domain");

  return res;
};
