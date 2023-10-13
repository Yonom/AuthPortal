export const getHostname = (req: Request) => {
  const forwardedHost = req.headers.get("X-Forwarded-Host");
  if (forwardedHost) {
    return new URL("//" + forwardedHost, req.url).hostname;
  } else {
    return new URL(req.url).hostname;
  }
};
