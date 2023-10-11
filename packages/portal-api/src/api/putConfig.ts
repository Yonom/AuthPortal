import { IRequest } from "itty-router";
import { z } from "zod";
import { ConfigKVObject, putConfigInKV } from "../services/config";

const ConfigParams = ConfigKVObject.extend({
  domains: z.string().array(),
}).strict();

export const putConfig = async (req: IRequest, env: Env) => {
  const { domains, ...newConfig } = ConfigParams.parse(req.query);
  for (const domain of domains) {
    await putConfigInKV(env, domain, newConfig);
  }
  return Response.json({});
};
