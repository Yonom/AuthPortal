import { IRequest } from "itty-router";
import { z } from "zod";
import { getConfig as getConfigFromDb } from "../services/config";

const ConfigParams = z
  .object({
    domain: z.string(),
  })
  .strict();

export const getConfig = async (req: IRequest, env: Env) => {
  const { domain } = ConfigParams.parse(req.query);
  const config = await getConfigFromDb(env, domain);
  return Response.json(config);
};
