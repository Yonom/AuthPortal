import { KVNamespace } from "@cloudflare/workers-types";

export interface Env {
  CONFIG: KVNamespace;
  PAYLOAD: KVNamespace;
  API_KEY: string;
}
