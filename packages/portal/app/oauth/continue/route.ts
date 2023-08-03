import { _generateRandomString } from "@authportal/core/utils/crypto";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { decryptState } from "@/services/state/stateEncryption";
import { putPayload } from "@/services/payload";
import { getPortalOrigin } from "@/services/origin";

export const runtime = "edge";

const ContinueSearchParams = z.object({
  state: z.string(),
});

const ContinueBody = z.object({
  payload_json: z.string(),
});

const Payload = z.object({
  firebase_user: z.record(z.unknown()),
});

export const POST = async (request: NextRequest) => {
  const { state: encryptedState } = ContinueSearchParams.parse(
    Object.fromEntries(request.nextUrl.searchParams)
  );
  const { payload_json } = ContinueBody.parse(
    Object.fromEntries(await request.formData())
  );
  const payload = Payload.parse(JSON.parse(payload_json));

  const { client_id, code_challenge, redirect_uri, state } = await decryptState(
    encryptedState
  );

  const code = await putPayload(
    client_id,
    redirect_uri,
    code_challenge,
    payload
  );

  const redirectUrl = new URL(redirect_uri);
  redirectUrl.searchParams.set("code", code);
  if (state) {
    redirectUrl.searchParams.set("state", state);
  }
  redirectUrl.searchParams.set("iss", getPortalOrigin());

  return NextResponse.redirect(redirectUrl.toString(), {
    status: 302,
  });
};
