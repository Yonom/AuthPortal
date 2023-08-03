import type { _AuthPortalFirebasePayload } from "@authportal/core/utils/api";

export type KVPutOptions = {
  expire?: number;
};

export type KVStore<T> = {
  get: (key: string) => Promise<T | null>;
  set: (key: string, value: T, options?: KVPutOptions) => Promise<void>;
  del: (key: string) => Promise<void>;
};

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

export type PayloadKVObject = {
  code_challenge: string;
  redirect_uri: string;
  payload: _AuthPortalFirebasePayload;
};

export type DbAdapter = {
  config: KVStore<ConfigKVObject>;
  payload: KVStore<PayloadKVObject>;
};
