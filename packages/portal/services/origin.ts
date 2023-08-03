import { headers } from "next/headers";

export const getPortalHost = () => {
  const host = headers().get("Host")?.split(":")[0];
  if (!host) throw new Error("Invalid host");
  return host;
};

export const getPortalProtocol = () => {
  const protocol = headers().get("X-Forwarded-Proto");
  if (!protocol) throw new Error("Invalid protocol");
  return protocol;
};

export const getPortalOrigin = () => {
  return getPortalProtocol() + "://" + getPortalHost();
};
