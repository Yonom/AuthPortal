"use client";

import { ComponentType } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebase";
import { authportal } from "./authportal";
import { User } from "firebase/auth";

type WithAuthProps = {
  user?: User | null;
};

const withAuth = <P extends object>(
  Component: ComponentType<P>,
): ComponentType<P & WithAuthProps> => {
  const WithAuthComponent = (props: P & WithAuthProps) => {
    const [user, loading, error] = useAuthState(auth);

    if (loading) {
      // Render a loading spinner or something similar
      return <div>Loading...</div>;
    }

    if (error || !user) {
      // Redirect to the login page if there's an error or the user is not logged in
      authportal.signInWithRedirect();
      return null;
    }

    return <Component user={user} {...props} />;
  };
  return WithAuthComponent;
};

export default withAuth;
