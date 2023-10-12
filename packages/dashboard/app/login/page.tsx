"use client";

import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authportal } from "../authportal";

const LoginPage = ({
  searchParams,
}: {
  searchParams: { screen_hint: string };
}) => {
  const [user, loading, error] = useAuthState(auth);
  const router = useRouter();
  useEffect(() => {
    if (!loading && !error && user) {
      router.push("/");
    } else {
      authportal.signInWithRedirect({
        screen_hint:
          searchParams.screen_hint === "signup" ? "signup" : undefined,
      });
    }
  });

  return <p>Loading...</p>;
};

export default LoginPage;
