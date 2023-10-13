import { IRequest } from "itty-router";
import { z } from "zod";
import { getConfigFromKV } from "../services/config";
import { Env } from "../types";

const ConfigParams = z
  .object({
    domain: z.string(),
  })
  .strict();

export const getConfig = async (req: IRequest, env: Env) => {
  const { domain } = ConfigParams.parse(req.query);
  const config = await getConfigFromKV(env, domain);
  return Response.json(config);
};
