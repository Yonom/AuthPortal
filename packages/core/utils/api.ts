export type _AuthPortalFirebasePayload = {
  firebase_user: Record<string, unknown>;
};

export const _getToken = async (
  domain: string,
  client_id: string,
  redirect_uri: string,
  code: string,
  code_verifier: string
): Promise<_AuthPortalFirebasePayload> => {
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
