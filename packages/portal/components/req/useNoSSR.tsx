"use client";
import { suspense } from "next/dist/shared/lib/lazy-dynamic/dynamic-no-ssr";

export const useNoSSR = () => {
  if (typeof window === "undefined") {
    suspense();
  }
};
