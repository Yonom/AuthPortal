"use client";

import { initializeApp } from "firebase/app";
import {
  getAuth,
  getRedirectResult,
  setPersistence,
  inMemoryPersistence,
} from "firebase/auth";
import { FC, useEffect } from "react";
import { REDIRECT_FAILED_ERROR, getErrorPath } from "../../AuthPortalError";
import { useRouter } from "next/navigation";
import { continueWithUser } from "../../../../../components/req/continueWithUser";
import { PortalConfig } from "../../../../../components/withConfigPage";

const handleRedirect = async (
  config: FirebaseRedirectHandlerProps["config"]
) => {
  const { firebase_config } = config;
  const app = initializeApp(firebase_config);
  const auth = getAuth(app);

  // inMemoryPersistence still causes issues during the same session, so clear the current user as well
  await setPersistence(auth, inMemoryPersistence);
  await auth.updateCurrentUser(null);

  // when using the default authDomain, we cannot login on firefox and safari due to 3rd party cookie restrictions
  const credential = await getRedirectResult(auth);
  if (!credential) {
    throw REDIRECT_FAILED_ERROR();
  }
  continueWithUser(credential.user);
};

type FirebaseRedirectHandlerProps = {
  config: PortalConfig;
};

const FirebaseRedirectBox: FC<FirebaseRedirectHandlerProps> = ({ config }) => {
  const router = useRouter();
  useEffect(() => {
    handleRedirect(config).catch((e) => {
      router.push(getErrorPath(e));
    });
  }, [config, router]);

  return <div>Logging you in...</div>;
};

export default FirebaseRedirectBox;
