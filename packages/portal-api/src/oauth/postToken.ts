import {
  _generateCodeChallenge,
  _generateRandomString,
} from "@authportal/core/signIn/utils/crypto";
import { z } from "zod";
import { getPayload } from "../services/payload";
import { Env } from "../types";

const PostTokenContent = z
  .object({
    client_id: z.string(),
    redirect_uri: z.string(),
    code: z.string().length(43),
    code_verifier: z.string().min(43).max(128),
  })
  .strict();

export const postToken = async (req: Request, env: Env) => {
  const body = await req.json();
  const contentObj = PostTokenContent.safeParse(body);
  if (!contentObj.success)
    return Response.json({ error: "invalid_request" }, { status: 400 });

  const { client_id, redirect_uri, code, code_verifier } = contentObj.data;
  const payload = await getPayload(
    env,
    client_id,
    redirect_uri,
    code,
    code_verifier,
  );
  if (payload == null)
    return Response.json({ error: "not_found" }, { status: 404 });

  return Response.json(
    {
      access_token: _generateRandomString(),
      token_type: "Bearer",
      firebase_user: payload.firebase_user,
    },
    {
      headers: {
        "Cache-Control": "no-store",
        Pragma: "no-cache",
      },
    },
  );
};
