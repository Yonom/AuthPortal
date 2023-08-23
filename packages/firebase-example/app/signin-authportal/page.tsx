"use client";

import { initializeApp } from "firebase/app";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { authportal } from "../authportal";

export default function HandleRedirect() {
  const router = useRouter();
  useEffect(() => {
    authportal.getRedirectResult().then(({ return_to }) => {
      router.push(return_to);
    });
  }, [router]);

  return <div>Loading...</div>;
}
