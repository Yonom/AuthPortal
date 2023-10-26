import { Env } from "../types";

const invalidateCacheAttempt = async (env: Env, domain: string) => {
  const url = new URL("https://auth.authportal.dev/api/revalidate");
  url.searchParams.set("domain", domain);
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.API_KEY}`,
    },
  });
  if (!res.ok) {
    throw new Error("Failed to invalidate cache");
  }
  return (await res.json()) as {
    revalidated: true;
    updated_at: string;
  };
};

export const invalidateVercelCache = async (
  env: Env,
  domain: string,
  targetUpdatedAt: Date,
) => {
  for (let i = 0; i < 20; i++) {
    const { updated_at } = await invalidateCacheAttempt(env, domain);
    if (new Date(updated_at) >= targetUpdatedAt) {
      return;
    }

    // wait 3 sec
    await new Promise((resolve) => setTimeout(resolve, 3000));
  }
  throw new Error("Failed to invalidate cache");
};

// TODO verify bg script failures bubble up
