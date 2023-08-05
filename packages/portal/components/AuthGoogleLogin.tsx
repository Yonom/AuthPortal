import { GoogleAuthProvider, signInWithRedirect } from "firebase/auth";
import { FC } from "react";
import { AuthButton } from "./AuthButton";
import { initFirebase } from "./LoginBox";
import { urlWithState } from "@/app/isr/[domain]/urlWithState";
import { PortalConfig } from "@/app/isr/[domain]/withConfigPage";

type AuthGoogleLoginProps = {
  config: PortalConfig;
};
export const AuthGoogleLogin: FC<AuthGoogleLoginProps> = ({ config }) => {
  const handleGoogleSignIn = async () => {
    const { auth } = initFirebase(config);
    const provider = new GoogleAuthProvider();

    const redirectUrl = urlWithState("/firebase/redirect");
    redirectUrl.searchParams.set("connection", GoogleAuthProvider.PROVIDER_ID);

    // back button: /sign-in, forward redirect: /firebase/redirect
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