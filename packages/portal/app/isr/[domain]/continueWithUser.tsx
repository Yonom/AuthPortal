import { _AuthPortalFirebasePayload } from "@authportal/core/utils/api";
import { User } from "firebase/auth";
import { urlWithState } from "./urlWithState";

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

export const continueWithUser = (user: User) => {
  postRedirect(urlWithState("/oauth/continue").href, {
    payload_json: JSON.stringify({
      firebase_user: user.toJSON() as Record<string, unknown>,
    } as _AuthPortalFirebasePayload),
  });
};
