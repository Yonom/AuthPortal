export const getProto = (req: Request) => {
  return req.headers.get("X-Forwarded-Proto") || "https";
};

export const getDomain = (req: Request) => {
  const { hostname } = new URL(req.url);
  return req.headers.get("X-Forwarded-Host") || hostname;
};

export const getOrigin = (req: Request) => {
  return getProto(req) + "://" + getDomain(req);
};
