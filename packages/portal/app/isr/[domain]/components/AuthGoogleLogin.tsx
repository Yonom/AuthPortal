import { GoogleAuthProvider, signInWithRedirect } from "firebase/auth";
import { FC } from "react";
import { AuthButton } from "./AuthButton";
import { initFirebase } from "./LoginBox";
import { PortalConfig } from "@/services/db/types";
import { urlWithState } from "../urlWithState";

type AuthGoogleLoginProps = {
  config: PortalConfig;
};
export const AuthGoogleLogin: FC<AuthGoogleLoginProps> = ({ config }) => {
  const handleGoogleSignIn = async () => {
    const { auth } = initFirebase(config);
    const provider = new GoogleAuthProvider();

    const redirectUrl = urlWithState("/firebase/redirect");
    redirectUrl.searchParams.set("connection", GoogleAuthProvider.PROVIDER_ID);

    // back button: /login, forward redirect: /firebase/redirect
    // (firebase auth redirects the current url, so temporarily replace it)
    const backHref = window.location.href;
    window.history.replaceState({}, "", redirectUrl.href);
    window.onbeforeunload = () => {
      window.history.replaceState({}, "", backHref);
    };

    signInWithRedirect(auth, provider);
  };

  return (
    <AuthButton text="Continue with Google" onClick={handleGoogleSignIn} />
  );
};
