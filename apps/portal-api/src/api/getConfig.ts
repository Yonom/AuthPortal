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
  if (!config) {
    return Response.json(
      { error: "Config not found for domain: " + domain },
      { status: 404 },
    );
  }
  return Response.json(config);
};
