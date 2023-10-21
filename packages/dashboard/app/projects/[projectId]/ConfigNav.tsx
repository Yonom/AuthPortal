import { FC, useMemo } from "react";
import { SidebarNav } from "./SidebarNav";

const isTruthy = <T,>(item: T | null | undefined | false | ""): item is T => {
  return !!item;
};

type ConfigNavParams = {
  projectId: string;
  setupComplete: boolean;
};

const ConfigNav: FC<ConfigNavParams> = ({
  projectId: projectId,
  setupComplete,
}) => {
  const sidebarNavItems = useMemo(
    () =>
      [
        {
          title: "Firebase Configuration",
          href: `/projects/${projectId}/setup`,
        },
        setupComplete && {
          title: "Sign-in Methods",
          href: `/projects/${projectId}/providers`,
        },
        setupComplete && {
          title: "Domains",
          href: `/projects/${projectId}/domains`,
        },
        setupComplete && {
          title: "Your App",
          href: `/projects/${projectId}/clients`,
        },
      ].filter(isTruthy),
    [projectId, setupComplete],
  );
  return <SidebarNav items={sidebarNavItems} />;
};

export default ConfigNav;
