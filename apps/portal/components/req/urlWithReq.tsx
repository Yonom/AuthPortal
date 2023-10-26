import { z } from "zod";
import { ReqParams, decryptReq, encryptReq } from "./reqEncryption";
import { use } from "react";
import { noSSR } from "./noSSR";
import { cache } from "react";

const AuthorizeSearchParams = ReqParams.extend({
  response_type: z.literal("code"),
  code_challenge_method: z.literal("S256"),
  screen_hint: z.literal("signup").optional(),
});

export const getReq = cache(async () => {
  try {
    const params = new URLSearchParams(window.location.search);

    // first, check if we have a req param
    {
      const req = params.get("req");
      if (req) {
        // validate the req
        const reqObj = await decryptReq(req);

        return { req, reqObj };
      }
    }

    // otherwise, parse the authorize search params
    {
      const reqObj = AuthorizeSearchParams.parse(Object.fromEntries(params));
      const req = await encryptReq(reqObj);

      // update the page url
      const url = new URL(window.location.href);
      url.search = "";
      url.searchParams.set("req", req);
      window.history.replaceState({}, "", url);

      return { req, reqObj };
    }
  } catch (ex: unknown) {
    // TODO err handling
    console.log(ex);

    // update the page url
    const url = new URL(window.location.href);
    url.search = "";
    window.history.replaceState({}, "", url);

    throw ex;
  }
});

export const getURLWithReq = cache(async (url: string) => {
  let req;
  try {
    req = await getReq();
  } catch {}
  if (!req) return url;

  const urlObj = new URL(url, window.location.origin);
  urlObj.searchParams.set("req", req.req);
  return urlObj.href;
});

export const useURLWithReq = (url: string) => {
  noSSR();

  return use(getURLWithReq(url));
};
