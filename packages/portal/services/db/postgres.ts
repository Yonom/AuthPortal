import { KVStore, KVPutOptions } from "./types";
import { Pool } from "pg";

class PostgresKVStore<T> implements KVStore<T> {
  constructor(
    private db: Pool,
    private table: string
  ) {}

  async setup() {
    await this.db.query(
      `CREATE TABLE IF NOT EXISTS ${this.table} (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL,
        expiration TIMESTAMP WITH TIME ZONE
      )`
    );
  }

  async get(key: string) {
    const result = await this.db.query(
      `SELECT value FROM ${this.table} WHERE key = $1 AND (expiration IS NULL OR expiration > NOW())`,
      [key]
    );

    if (result.rows.length === 0) return null;
    return JSON.parse(result.rows[0].value) as T;
  }

  async set(key: string, value: T, options?: KVPutOptions) {
    const { expire: expirationTtl } = options ?? {};
    const expiration = expirationTtl
      ? new Date(Date.now() + expirationTtl * 1000)
      : null;

    await this.db.query(
      `INSERT INTO ${this.table} (key, value, expiration) VALUES ($1, $2, $3) 
      ON CONFLICT (key) DO UPDATE SET value = $2, expiration = $3`,
      [key, JSON.stringify(value), expiration]
    );
  }

  async del(key: string) {
    await this.db.query("DELETE FROM kv WHERE key = $1", [key]);
  }
}

const pool = new Pool();
export const kvStoreFactory = async <T>(table: string) => {
  const store = new PostgresKVStore<T>(pool, table);
  await store.setup();
  return store;
};
