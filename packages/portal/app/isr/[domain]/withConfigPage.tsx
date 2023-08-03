import { ComponentType } from "react";
import { getConfig } from "@/services/config";
import { PortalConfig } from "@/services/db/types";

export const withConfigPage = (
  Page: ComponentType<{ config: PortalConfig }>
) => {
  const WithConfigPage = async ({
    params: { domain },
  }: {
    params: { domain: string };
  }) => {
    const { portal_config } = await getConfig(domain);
    return <Page config={portal_config} />;
  };
  return WithConfigPage;
};
