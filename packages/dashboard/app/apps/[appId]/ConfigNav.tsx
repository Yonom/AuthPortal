"use client";

import { useMemo } from "react";
import { SidebarNav } from "./SidebarNav";
import { useParams } from "next/navigation";

const ConfigNav = () => {
  const { appId } = useParams();
  const sidebarNavItems = useMemo(
    () => [
      {
        title: "Setup",
        href: `/apps/${appId}/setup`,
      },
    ],
    [appId],
  );
  return <SidebarNav items={sidebarNavItems} />;
};

export default ConfigNav;
