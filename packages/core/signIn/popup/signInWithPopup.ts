import { _getAuthorizeUrl, _getToken } from "../utils/portalApi";
import { _generateCodeChallenge, _generateRandomString } from "../utils/crypto";

export const _openWindow = (url: string) => {
  const width = 500;
  const height = 700;
  const left = window.screenX + (window.innerWidth - width) / 2;
  const top = window.screenY + (window.innerHeight - height) / 2;

  return window.open(
    url,
    "authportal.popup",
    `left=${left},top=${top},width=${width},height=${height},resizable,scrollbars=yes,status=1`,
  );
};

type _AuthenticationResult = {
  code: string;
};

type _PopupMessage = {
  type: "authorization_response";
  response:
    | {
        error: string;
        error_description: string;
        error_uri: string;
      }
    | {
        code: string;
      };
};

const _openAndHandlePopup = async (url: string) => {
  const popup = _openWindow(url);
  if (!popup) {
    throw new Error("Failed to open popup window");
  }

  let cleanup: () => void;
  return new Promise<_AuthenticationResult>((resolve, reject) => {
    // throw if popup is closed
    const popupTimer = setInterval(() => {
      if (popup.closed) {
        reject(new Error("popup cancelled"));
      }
    }, 1000);

    const popupEventListener = (e: MessageEvent<_PopupMessage>) => {
      if (!e.data || e.data.type !== "authorization_response") {
        return;
      }

      const payload = e.data.response;
      if ("error" in payload) {
        return reject(new Error(payload.error));
      }

      resolve(payload);
    };

    cleanup = () => {
      clearInterval(popupTimer);
      window.removeEventListener("message", popupEventListener, false);
      if (!popup.closed) popup.close();
    };

    window.addEventListener("message", popupEventListener);
  }).finally(() => cleanup());
};

export const _signInWithPopup = async (
  domain: string,
  client_id: string,
  scope: "firebase_auth",
) => {
  const redirect_uri = window.location.href;
  const code_verifier = _generateRandomString();
  const code_challenge = await _generateCodeChallenge(code_verifier);
  const url = _getAuthorizeUrl(
    domain,
    client_id,
    code_challenge,
    scope,
    redirect_uri,
    "web_message",
  );

  const { code } = await _openAndHandlePopup(url.href);
  const payload = await _getToken(
    domain,
    client_id,
    redirect_uri,
    code,
    code_verifier,
  );

  return { payload };
};
