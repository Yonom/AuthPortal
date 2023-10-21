import { Env } from "../types";

export const invalidateVercelCache = (env: Env, domain: string) => {
  // TODO cloudflare KV does not immediately update which can lead to race conditions
  const url = new URL("https://auth.authportal.dev/api/revalidate");
  url.searchParams.set("tag", `config-${domain}`);
  return fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.API_KEY}`,
    },
  });
};
