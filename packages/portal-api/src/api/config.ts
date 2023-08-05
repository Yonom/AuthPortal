import { IRequest } from "itty-router";
import { z } from "zod";
import { getConfig as getConfigFromDb } from "../services/config";

const AuthorizeSearchParams = z.object({
  domain: z.string(),
});

export const getConfig = async (req: IRequest, env: Env) => {
  const { domain } = AuthorizeSearchParams.parse(req.query);
  const config = await getConfigFromDb(env, domain);
  return Response.json(config);
};
