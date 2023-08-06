import { z } from "zod";
import { AuthorizeParams, encryptReq } from "./reqEncryption";
import { use } from "react";
import { useNoSSR } from "./useNoSSR";

const AuthorizeSearchParams = AuthorizeParams.extend({
  response_type: z.literal("code"),
  code_challenge_method: z.literal("S256"),
});

const getReqTask = async () => {
  const params = new URLSearchParams(window.location.search);

  // first, check if we have a req param
  {
    const req = params.get("req");
    if (req) return req;
  }

  // otherwise, parse the authorize search params
  {
    const searchParams = AuthorizeSearchParams.parse(
      Object.fromEntries(params)
    );
    const req = await encryptReq(searchParams);
    window.history.replaceState({}, "", `?req=${req}`);
    return req;
  }
};

const reqPromise = getReqTask();

export const getReq = (): Promise<string> => {
  return reqPromise;
};

export const urlWithReq = async (url: string) => {
  const req = await reqPromise;

  const urlObj = new URL(url, window.location.origin);
  urlObj.searchParams.set("req", req);
  return urlObj.href;
};

export const useUrlWithReq = (url: string) => {
  useNoSSR();
  const req = use(reqPromise);

  const urlObj = new URL(url, window.location.origin);
  urlObj.searchParams.set("req", req);
  return urlObj.href;
};
