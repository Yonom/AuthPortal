"use client";
import { throwWithNoSSR } from "next/dist/shared/lib/lazy-dynamic/no-ssr-error";

export const throwOnNoSSR = () => {
  if (typeof window === "undefined") {
    throwWithNoSSR();
  }
};
