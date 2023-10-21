"use client";

import { ComponentType } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../lib/firebase";
import { authportal } from "../lib/authportal";
import { User, signOut } from "firebase/auth";

type WithAuthProps = {
  user?: User | null;
};

let redirecting = false;
const logoutRedirectUrl = "https://www.authportal.dev";
export const logout = async () => {
  redirecting = true;

  await signOut(auth);
  window.location.href = logoutRedirectUrl;
};

const withAuth = <P extends object>(
  Component: ComponentType<P & WithAuthProps>,
): ComponentType<P> => {
  const WithAuthComponent = (props: P) => {
    const [user, loading, error] = useAuthState(auth);

    if (loading || redirecting) {
      // Render a loading spinner or something similar
      return <div>Loading...</div>;
    }

    if (error || !user) {
      // Redirect to the login page if there's an error or the user is not logged in)
      authportal.signInWithRedirect();
      return null;
    }

    return <Component user={user} {...props} />;
  };
  return WithAuthComponent;
};

export default withAuth;
