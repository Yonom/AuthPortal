import { error, json, Router, createCors, IRequest } from "itty-router";
import { postContinue } from "./oauth/continue";
import { postToken } from "./oauth/token";
import { getConfig } from "./api/config";

const { preflight, corsify } = createCors({
  origins: ["*"],
  methods: ["POST"],
});

const withAuthorization = (req: IRequest, env: Env) => {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }

  const apiKey = authHeader.split(" ")[1];
  if (apiKey !== env.API_KEY) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }
};

const router = Router()
  .post("/oauth/continue", postContinue)
  .all("/oauth/token", preflight)
  .post("/oauth/token", (req, env) => postToken(req, env).then(corsify))
  .get("/api/config", withAuthorization, getConfig)
  .all("*", () => error(404));

export default {
  fetch: (req: Request, env: Env, ctx: ExecutionContext) =>
    router.handle(req, env, ctx).then(json).catch(error),
};
