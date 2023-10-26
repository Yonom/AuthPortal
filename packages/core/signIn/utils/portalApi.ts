import { FirebasePayload } from "@authportal/db-types/cloudflare/payload";

export const _getAuthorizeUrl = (
  domain: string,
  client_id: string,
  code_challenge: string,
  scope: "firebase_auth",
  redirect_uri: string,
  screen_hint: "signup" | undefined,
  response_mode?: "web_message" | undefined,
) => {
  const url = new URL(`https://${domain}/authorize`);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("client_id", client_id);
  url.searchParams.set("code_challenge", code_challenge);
  url.searchParams.set("code_challenge_method", "S256");
  url.searchParams.set("scope", scope);
  url.searchParams.set("redirect_uri", redirect_uri);

  if (screen_hint != null) {
    url.searchParams.set("screen_hint", screen_hint);
  }

  if (response_mode != null) {
    url.searchParams.set("response_mode", response_mode);
  }

  return url;
};

export const _getToken = async (
  domain: string,
  client_id: string,
  redirect_uri: string,
  code: string,
  code_verifier: string,
): Promise<FirebasePayload> => {
  const response = await fetch(`https://${domain}/oauth/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      client_id,
      redirect_uri,
      code,
      code_verifier,
    }),
  });
  if (response.status !== 200)
    throw new Error(`Unexpected status ${response.status}`);
  return await response.json();
};
