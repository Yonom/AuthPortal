"use client";

import { AuthPortal } from "@authportal/firebase";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const app = initializeApp(
  JSON.parse(process.env.NEXT_PUBLIC_FIREBASE_CONFIG as string),
);

const SignInButton = () => {
  const handleSignIn = () => {
    const authPortal = new AuthPortal({
      domain: "auth.authportal.dev",
      client_id: "your-client-id",
      firebase_auth: getAuth(app),
    });
    authPortal.signInWithPopup();
  };
  return (
    <button
      className="rounded bg-blue-600 px-4 py-2 text-white"
      onClick={handleSignIn}
    >
      Sign In
    </button>
  );
};

export default SignInButton;
