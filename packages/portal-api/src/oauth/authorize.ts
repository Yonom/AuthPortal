import { IRequest } from "itty-router";
import {
  AuthorizeState,
  encryptState,
} from "../services/state/stateEncryption";
import { z } from "zod";
import { getDomain, getOrigin } from "../services/origin";

const AuthorizeSearchParams = AuthorizeState.extend({
  response_type: z.literal("code"),
  code_challenge_method: z.literal("S256"),
});

export const getAuthorize = async (req: IRequest, env: Env) => {
  const domain = getDomain(req);
  const origin = getOrigin(req);

  const state = AuthorizeSearchParams.parse(req.query);

  const { setCookie, encryptedState } = await encryptState(
    req,
    env,
    domain,
    state
  );

  const url = new URL("/sign-in", origin);
  url.searchParams.set("state", encryptedState);

  const res = new Response(null, {
    status: 302,
    headers: {
      Location: url.toString(),
      "Set-Cookie": setCookie,
    },
  });
  return res;
};
