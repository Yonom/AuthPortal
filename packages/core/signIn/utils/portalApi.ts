export type _FirebasePayload = {
  firebase_user: Record<string, unknown>;
};

export const _getAuthorizeUrl = (
  domain: string,
  client_id: string,
  code_challenge: string,
  scope: "firebase_auth",
  redirect_uri: string,
) => {
  const url = new URL(`https://${domain}/authorize`);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("client_id", client_id);
  url.searchParams.set("code_challenge", code_challenge);
  url.searchParams.set("code_challenge_method", "S256");
  url.searchParams.set("scope", scope);
  url.searchParams.set("redirect_uri", redirect_uri);
  return url;
};

export const _getToken = async (
  domain: string,
  client_id: string,
  redirect_uri: string,
  code: string,
  code_verifier: string,
): Promise<_FirebasePayload> => {
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
