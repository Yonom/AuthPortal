import { IRequest } from "itty-router";
import { z } from "zod";
import { deleteConfigInKV } from "../services/config";
import { Env } from "../types";
import { invalidateVercelCache } from "../services/invalidateVercelCache";

const ConfigParams = z
  .object({
    domain: z.string(),
  })
  .strict();

export const deleteConfig = async (req: IRequest, env: Env) => {
  const { domain } = ConfigParams.parse(req.query);
  await deleteConfigInKV(env, domain);
  await invalidateVercelCache(env, domain);
  return Response.json({});
};
