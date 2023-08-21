export const _normalizeRedirectUri = (uri: string) => {
  const url = new URL(uri);

  url.searchParams.delete("code");
  url.searchParams.delete("state");
  url.searchParams.delete("error");
  url.searchParams.delete("error_description");
  url.searchParams.delete("error_uri");
  url.searchParams.delete("iss");

  url.hash = "";

  // normalize the search parameter (incase the url includes only a "?")
  if (!url.search) url.search = "";

  // normalize the pathname
  if (url.pathname === "") url.pathname = "/";

  // normalize localhost ip and ipv6 to localhost
  if (url.hostname.match(/^127\.0\.0\.[0-9]+$/)) url.hostname = "localhost";
  if (url.hostname.match(/^\[::1\]$/)) url.hostname = "localhost";

  if (url.hostname === "localhost") {
    if (url.protocol !== "http:" && url.protocol !== "https:") {
      throw new Error(
        "Redirect uri for localhost must use http or https protocol"
      );
    }
  } else if (url.protocol !== "https:") {
    throw new Error("Redirect uri must use https protocol");
  }

  return url.href;
};
