import { ComponentType } from "react";
import EnsureDomainMatch from "./EnsureDomainMatch";

export type PortalConfig = {
  firebase_config: Record<string, string>;
  providers: { provider_id: string }[];
};

const fetchConfig = async (domain: string) => {
  const { API_KEY } = process.env;
  if (!API_KEY) {
    throw new Error("API_KEY is not set");
  }

  const url = new URL("https://portal-api.authportal.dev/api/config");
  url.searchParams.set("domain", domain);
  const res = await fetch(url, {
    headers: {
      Authorization: "Bearer " + API_KEY,
    },
    next: {
      tags: ["config-" + domain],
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch config");
  }

  return await res.json();
};

export const withConfigPage = (
  Page: ComponentType<{ config: PortalConfig }>
) => {
  const WithConfigPage = async ({
    params: { domain },
  }: {
    params: { domain: string };
  }) => {
    const { portal_config } = await fetchConfig(domain);
    return <Page config={portal_config} />;
  };
  return WithConfigPage;
};
