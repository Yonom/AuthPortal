import { error, json, Router, createCors, IRequest } from "itty-router";
import { putToken } from "./oauth/putToken";
import { postToken } from "./oauth/postToken";
import { getConfig } from "./api/getConfig";
import { putConfig } from "./api/putConfig";
import { Env } from "./types";
import { deleteConfig } from "./api/deleteConfig";

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
  .all("/oauth/token", preflight)
  .post("/oauth/token", (req, env) => postToken(req, env).then(corsify))
  .put("/oauth/token", putToken)
  .get("/api/config", withAuthorization, getConfig)
  .put("/api/config", withAuthorization, putConfig)
  .delete("/api/config", withAuthorization, deleteConfig)
  .all("*", () => error(404));

const worker = {
  fetch: (req: Request, env: Env, ctx: ExecutionContext) =>
    router.handle(req, env, ctx).then(json).catch(error),
};

export default worker;
