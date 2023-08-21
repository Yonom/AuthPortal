import { _FirebasePayload } from "@authportal/core/signIn/utils/portalApi";
import { User } from "firebase/auth";
import { getReq } from "./urlWithReq";

const postRedirect = (url: string, data: Record<string, string>) => {
  const form = document.createElement("form");
  form.method = "POST";
  form.action = url;

  for (const [name, value] of Object.entries(data)) {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = name;
    input.value = value;
    form.appendChild(input);
  }

  document.body.appendChild(form);
  form.submit();
};

type ContinuePostData = {
  client_id: string;
  code_challenge: string;
  scope: "firebase_auth";
  redirect_uri: string;
  state?: string;
  payload_json: string;
};

export const continueWithUser = async (user: User) => {
  // TODO error handling
  const req = await getReq();

  postRedirect("/oauth/continue", {
    ...req.reqObj,
    payload_json: JSON.stringify({
      firebase_user: user.toJSON() as Record<string, unknown>,
    } as _FirebasePayload),
  } as ContinuePostData);
};
