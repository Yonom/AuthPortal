"use client";
import { suspense } from "next/dist/shared/lib/lazy-dynamic/dynamic-no-ssr";

// TODO duplicate

export const noSSR = () => {
  if (typeof window === "undefined") {
    suspense();
  }
};
