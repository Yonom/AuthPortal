"use client";

import { AuthPortal } from "@authportal/firebase";
import { initializeApp } from "firebase/app";
import { User, getAuth, inMemoryPersistence, signOut } from "firebase/auth";
import { useState } from "react";

const app = initializeApp(
  JSON.parse(process.env.NEXT_PUBLIC_FIREBASE_CONFIG as string),
  "demo-miniapp",
);
const auth = getAuth(app);
auth.setPersistence(inMemoryPersistence);

const SignInButton = () => {
  const [user, setUser] = useState<User | null>(null);
  const handleSignIn = async () => {
    const authPortal = new AuthPortal({
      domain: "auth.authportal.dev",
      client_id: process.env.NEXT_PUBLIC_AUTHPORTAL_CLIENT_ID as string,
      firebase_auth: auth,
    });
    const { user } = await authPortal.signInWithPopup();
    setUser(user);
  };
  if (user) {
    return (
      <div className="flex">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={user.photoURL ?? ""}
          alt="User photo"
          width={48}
          height={48}
          style={{ width: 48, height: 48 }}
          className="rounded-full"
        />
        <div className="flex flex-col justify-center pl-3">
          <div className="font-bold">{user.displayName}</div>
          <div>{user.email}</div>
        </div>
        <div className="flex-grow" />
        <div className="flex flex-col justify-center">
          <button
            className="rounded bg-red-500 px-4 py-2 text-white"
            onClick={() => {
              signOut(auth);
              setUser(null);
            }}
          >
            Sign Out
          </button>
        </div>
      </div>
    );
  }
  return (
    <>
      <button
        className="rounded bg-blue-600 px-4 py-2 text-white"
        onClick={handleSignIn}
      >
        Sign In
      </button>
      <pre className="pt-4">^ Try it! :)</pre>
    </>
  );
};

export default SignInButton;
