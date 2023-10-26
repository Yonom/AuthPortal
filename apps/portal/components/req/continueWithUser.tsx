import { User } from "firebase/auth";
import { getReq } from "./urlWithReq";
import { PutTokenRequestBody } from "./PutTokenRequestBody";

type PutTokenResponse = {
  code: string;
};

const respond = (
  response_mode: "web_message" | undefined,
  redirect_uri: string,
  code: string,
  state: string | undefined,
) => {
  if (response_mode === "web_message") {
    const targetOrigin = new URL(redirect_uri).origin;
    const message = {
      type: "authorization_response",
      response: {
        code,
        state,
      },
    };
    window.opener.postMessage(message, { targetOrigin });
  } else {
    const redirectUrl = new URL(redirect_uri);
    redirectUrl.searchParams.set("code", code);
    if (state) {
      redirectUrl.searchParams.set("state", state);
    }
    redirectUrl.searchParams.set("iss", window.location.origin);

    // TODO history push or replace?
    window.location.href = redirectUrl.href;
  }
};

export const continueWithUser = async (user: User) => {
  const { reqObj } = await getReq();

  const res = await fetch("/oauth/token", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...reqObj,
      payload: {
        firebase_user: user.toJSON() as Record<string, unknown>,
      },
    } as PutTokenRequestBody),
  });

  // TODO error handling
  if (!res.ok) {
    throw new Error("Failed to put token");
  }

  const { code } = (await res.json()) as PutTokenResponse;
  const { response_mode, redirect_uri, state } = reqObj;
  respond(response_mode, redirect_uri, code, state);
};
