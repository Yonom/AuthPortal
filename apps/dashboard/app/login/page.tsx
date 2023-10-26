"use client";

import { auth } from "../../lib/firebase";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authportal } from "../../lib/authportal";

const LoginPage = ({
  searchParams,
}: {
  searchParams: { screen_hint: string };
}) => {
  const router = useRouter();
  useEffect(() => {
    auth.authStateReady().then(() => {
      const user = auth.currentUser;
      if (user) {
        router.push("/");
      } else {
        authportal.signInWithRedirect({
          screen_hint:
            searchParams.screen_hint === "signup" ? "signup" : undefined,
        });
      }
    });
  }, [router, searchParams.screen_hint]);

  return <p>Loading...</p>;
};

export default LoginPage;
