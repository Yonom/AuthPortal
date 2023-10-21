"use client";
import { PortalConfig } from "@/components/withConfigPage";

export const getHasEmailLogin = (config: PortalConfig) => {
  return config.providers.some((p) => p.provider_id === "password");
};
