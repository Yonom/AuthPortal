"use client";

import { z } from "zod";
import { redirect, useSearchParams } from "next/navigation";

const FirebaseActionSearchParams = z.object({
  mode: z.string(),
  oobCode: z.string(),
  continueUrl: z.string(),
  lang: z.string().optional(),
});

const ContinueUrlSearchParams = z.object({
  state: z.string(),
});

const FirebaseActionPage = () => {
  const searchParams = useSearchParams();
  const { mode, oobCode, continueUrl } = FirebaseActionSearchParams.parse(
    Object.fromEntries(searchParams)
  );
  const { state: encryptedState } = ContinueUrlSearchParams.parse(
    Object.fromEntries(new URL(continueUrl).searchParams)
  );

  if (mode === "resetPassword") {
    redirect(`/new-password?state=${encryptedState}&oobCode=${oobCode}`);
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

  return null;
};

export default FirebaseActionPage;
