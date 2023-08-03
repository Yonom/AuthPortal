import { KVPutOptions, KVStore } from "./types";

type TAndMetadata<T> = {
  value: T;
  expiration?: number;
};

class InMemoryKVStore<T> implements KVStore<T> {
  private store: Map<string, TAndMetadata<T>> = new Map();

  async get(key: string) {
    const value = this.store.get(key);
    if (value == null) return null;
    if (value.expiration != null && value.expiration < Date.now()) {
      this.store.delete(key);
      return null;
    }

    return value.value;
  }

  async set(key: string, value: T, options?: KVPutOptions) {
    this.store.set(key, {
      value,
      expiration: Date.now() + (options?.expire ?? 0) * 1000,
    });
  }

  async del(key: string) {
    this.store.delete(key);
  }
}

export const kvStoreFactory = async <T>() => {
  return new InMemoryKVStore<T>();
};
