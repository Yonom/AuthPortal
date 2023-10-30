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
    updated_at: string | null;
  };
};

const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

// Cloudflare KV is eventually consistent
// this function will retry until the cache is invalidated
export const invalidateVercelCache = async (
  env: Env,
  domain: string,
  targetUpdatedAt: Date | null,
) => {
  await sleep(1000);

  let doubleConfirm = false;
  for (let i = 0; i < 10; i++) {
    const { updated_at } = await invalidateCacheAttempt(env, domain);
    if (
      (targetUpdatedAt === null && updated_at === null) ||
      (targetUpdatedAt && updated_at && new Date(updated_at) >= targetUpdatedAt)
    ) {
      if (doubleConfirm) {
        return;
      } else {
        doubleConfirm = true;

        await sleep(1000);
      }
    } else {
      doubleConfirm = false;

      await sleep(6000);
    }
  }
  throw new Error("Failed to invalidate cache");
};
