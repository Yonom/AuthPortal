export type _RedirectConfig = {
  redirect_uri: string;
  code_verifier: string;
  return_to: string;
  expires_at: number;
};

const STORAGE_NAMESPACE = "authportal-sdk.redirects";

const _getRedirectConfigKey = (client_id: string) => {
  return `${STORAGE_NAMESPACE}.${client_id}`;
};

export const _getRedirectConfig = (client_id: string) => {
  const key = _getRedirectConfigKey(client_id);
  const value = window.localStorage.getItem(key);
  if (value == null) return null;
  const res = JSON.parse(value) as _RedirectConfig;
  if (res.expires_at < Date.now()) {
    sessionStorage.removeItem(key);
    return null;
  }
  return res;
};

export const _setRedirectConfig = (
  client_id: string,
  value: _RedirectConfig
) => {
  const key = _getRedirectConfigKey(client_id);
  window.localStorage.setItem(key, JSON.stringify(value));
};

export const _removeRedirectConfig = (client_id: string) => {
  const key = _getRedirectConfigKey(client_id);
  window.localStorage.removeItem(key);
};
