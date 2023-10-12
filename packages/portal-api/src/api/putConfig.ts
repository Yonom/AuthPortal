import { IRequest } from "itty-router";
import { z } from "zod";
import { ConfigKVObject, putConfigInKV } from "../services/config";

const ConfigParams = ConfigKVObject.extend({
  domains: z.string().array(),
}).strict();

export const putConfig = async (req: IRequest, env: Env) => {
  const body = await req.json();
  const contentObj = ConfigParams.safeParse(body);
  if (!contentObj.success)
    return Response.json({ error: "invalid_request" }, { status: 400 });

  const { domains, ...newConfig } = contentObj.data;
  for (const domain of domains) {
    await putConfigInKV(env, domain, newConfig);
  }
  return Response.json({});
};
