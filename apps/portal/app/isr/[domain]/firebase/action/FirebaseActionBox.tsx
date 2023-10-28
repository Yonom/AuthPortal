"use client";

import { z } from "zod";
import { redirect, useSearchParams } from "next/navigation";
import Loading from "./loading";
import { throwOnNoSSR } from "@authportal/common-ui/lib/throwOnNoSSR";

const FirebaseActionSearchParams = z.object({
  mode: z.string(),
  oobCode: z.string(),
  continueUrl: z.string(),
  lang: z.string().optional(),
});

const ContinueUrlSearchParams = z.object({
  req: z.string(),
});

const FirebaseActionPage = () => {
  throwOnNoSSR();

  const searchParams = useSearchParams();
  const { mode, oobCode, continueUrl } = FirebaseActionSearchParams.parse(
    Object.fromEntries(searchParams),
  );
  const { req } = ContinueUrlSearchParams.parse(
    Object.fromEntries(new URL(continueUrl).searchParams),
  );

  if (mode === "resetPassword") {
    const url = new URL("/reset-password", window.location.origin);
    url.searchParams.set("req", req);
    url.searchParams.set("oobCode", oobCode);
    redirect(url.href);
  } else if (mode === "recoverEmail") {
    // TODO
  } else if (mode === "verifyEmail") {
    // TODO
  } else if (mode === "signIn") {
    // TODO
  } else if (mode === "verifyAndChangeEmail") {
    // TODO
  } else if (mode === "revertSecondFactorAddition") {
    // TODO
  } else if (mode === "verifyBeforeChangeEmail") {
    // TODO
  }

  // fall back to firebase's action handler
  const url = new URL(window.location.href);
  url.pathname = "/__/auth/action";
  redirect(url.href);

  return <Loading />;
};

export default FirebaseActionPage;
