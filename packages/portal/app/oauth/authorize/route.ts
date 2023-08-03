import { NextRequest, NextResponse } from "next/server";
import { AuthorizeState, encryptState } from "@/services/state/stateEncryption";
import { z } from "zod";

export const runtime = "edge";

const AuthorizeSearchParams = AuthorizeState.extend({
  response_type: z.literal("code"),
  code_challenge_method: z.literal("S256"),
});

export const GET = async (request: NextRequest) => {
  const state = AuthorizeSearchParams.parse(
    Object.fromEntries(request.nextUrl.searchParams)
  );

  const encryptedState = await encryptState(state);

  const url = new URL("/sign-in", request.url);
  url.searchParams.set("state", encryptedState);

  return NextResponse.redirect(url, {
    status: 302,
  });
};
