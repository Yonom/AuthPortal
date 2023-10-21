import { Env } from "../types";

export const invalidateVercelCache = (env: Env, domain: string) => {
  const url = new URL("https://auth.authportal.dev/api/revalidate");
  url.searchParams.set("tag", `config-${domain}`);
  return fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.API_KEY}`,
    },
  });
};
