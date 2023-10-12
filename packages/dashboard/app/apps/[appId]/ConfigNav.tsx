import { FC, useMemo } from "react";
import { SidebarNav } from "./SidebarNav";

const isTruthy = <T,>(item: T | null | undefined | false | ""): item is T => {
  return !!item;
};

type ConfigNavParams = {
  appId: string;
  setupComplete: boolean;
};

const ConfigNav: FC<ConfigNavParams> = ({ appId, setupComplete }) => {
  const sidebarNavItems = useMemo(
    () =>
      [
        {
          title: "Firebase Configuration",
          href: `/apps/${appId}/setup`,
        },
        setupComplete && {
          title: "Providers",
          href: `/apps/${appId}/providers`,
        },
        setupComplete && {
          title: "Installation",
          href: `/apps/${appId}/installation`,
        },
      ].filter(isTruthy),
    [appId, setupComplete],
  );
  return <SidebarNav items={sidebarNavItems} />;
};

export default ConfigNav;
