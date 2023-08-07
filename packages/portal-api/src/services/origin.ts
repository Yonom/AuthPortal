export const getProto = (req: Request) => {
  return req.headers.get("X-Forwarded-Proto") || "https";
};

export const getHostname = (req: Request) => {
  const forwardedHost = req.headers.get("X-Forwarded-Host");
  if (forwardedHost) {
    return new URL("//" + forwardedHost, req.url).hostname;
  } else {
    return new URL(req.url).hostname;
  }
};

export const getHost = (req: Request) => {
  const forwardedHost = req.headers.get("X-Forwarded-Host");
  if (forwardedHost) {
    return forwardedHost;
  } else {
    return new URL(req.url).host;
  }
};

export const getOrigin = (req: Request) => {
  return getProto(req) + "://" + getHost(req);
};
