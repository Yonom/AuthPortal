import { kv } from "@vercel/kv";
import { KVStore, KVPutOptions } from "./types";

class VercelKVStore<T> implements KVStore<T> {
  constructor(private table: string) {}

  async get(key: string) {
    return kv.get<T>(`${this.table}.${key}`);
  }

  async set(key: string, value: T, options?: KVPutOptions) {
    await kv.set(
      `${this.table}.${key}`,
      value,
      options?.expire
        ? {
            ex: options?.expire,
          }
        : undefined
    );
  }

  async del(key: string) {
    await kv.del(`${this.table}.${key}`);
  }
}

export const kvStoreFactory = async <T>(table: string) => {
  return new VercelKVStore<T>(table);
};
