import { _AuthPortalFirebasePayload } from "@authportal/core/utils/api";
import { User } from "firebase/auth";
import { getReq } from "./urlWithReq";
import { decryptReq } from "./reqEncryption";

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

export const continueWithUser = async (user: User) => {
  const params = await decryptReq(await getReq());
  postRedirect("/oauth/continue", {
    ...params,
    payload_json: JSON.stringify({
      firebase_user: user.toJSON() as Record<string, unknown>,
    } as _AuthPortalFirebasePayload),
  });
};
