import {
  _generateCodeChallenge,
  _generateRandomString,
} from "@authportal/core/utils/crypto";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getPayload } from "@/services/payload";

export const runtime = "edge";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

const json = (obj: unknown, init?: ResponseInit) => {
  return NextResponse.json(obj, {
    ...init,
    headers: { ...corsHeaders, ...init?.headers },
  });
};

export const OPTIONS = async () => {
  return json(undefined);
};

const PostTokenContent = z.object({
  client_id: z.string(),
  redirect_uri: z.string(),
  code: z.string().length(43),
  code_verifier: z.string().min(43).max(128),
});

export const POST = async (request: NextRequest) => {
  const body = await request.json();
  const contentObj = PostTokenContent.safeParse(body);
  if (!contentObj.success)
    return json({ error: "invalid_request" }, { status: 400 });

  const { client_id, redirect_uri, code, code_verifier } = contentObj.data;
  const payload = await getPayload(
    client_id,
    redirect_uri,
    code,
    code_verifier
  );
  if (payload == null) return json({ error: "not_found" }, { status: 404 });

  return json(
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
    }
  );
};
