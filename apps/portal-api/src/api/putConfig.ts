import { IRequest } from "itty-router";
import { z } from "zod";
import { putConfigInKV } from "../services/config";
import { Env } from "../types";
import { invalidateVercelCache } from "../services/invalidateVercelCache";
import { ConfigKVObject } from "@authportal/db-types/cloudflare/config";

const ConfigParams = ConfigKVObject.omit({ updated_at: true })
  .extend({
    domains: z.string().array(),
  })
  .strict();

export const putConfig = async (req: IRequest, env: Env) => {
  const body = await req.json();
  const contentObj = ConfigParams.safeParse(body);
  if (!contentObj.success)
    return Response.json({ error: "invalid_request" }, { status: 400 });

  const { domains, ...newConfig } = contentObj.data;
  for (const domain of domains) {
    const targetUpdatedAt = new Date();
    await putConfigInKV(env, domain, newConfig);
    await invalidateVercelCache(env, domain, targetUpdatedAt);
  }
  return Response.json({});
};
