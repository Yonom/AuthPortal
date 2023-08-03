import { ConfigKVObject, DbAdapter, KVStore, PayloadKVObject } from "./types";

const getDbAdapter = async (): Promise<DbAdapter> => {
  const provider = await import("./" + process.env.KV_PROVIDER);
  const kvFactory = provider.kvStoreFactory as <T>(
    table: string
  ) => Promise<KVStore<T>>;

  const [config, payload] = await Promise.all([
    kvFactory<ConfigKVObject>("config"),
    kvFactory<PayloadKVObject>("payload"),
  ]);

  return { config, payload };
};

const dbAdapterTask = getDbAdapter();

export const getDb = async () => {
  return dbAdapterTask;
};
