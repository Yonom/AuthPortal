"use client";

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { authPortal } from "../authportal";

const firebaseConfig = JSON.parse(
  process.env.NEXT_PUBLIC_FIREBASE_CONFIG as string
);

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export default function HandleRedirect() {
  const router = useRouter();
  useEffect(() => {
    authPortal
      .getRedirectResult({ firebase_auth: auth })
      .then(({ return_to }) => {
        router.push(return_to);
      });
  }, [router]);

  return <div>Loading...</div>;
}
