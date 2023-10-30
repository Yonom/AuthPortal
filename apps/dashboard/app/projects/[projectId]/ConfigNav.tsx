import { FC, useMemo } from "react";
import { SidebarNav } from "./SidebarNav";
import { FirestoreDoctorReportDocument } from "@authportal/db-types/firestore/doctor";

const isTruthy = <T,>(item: T | null | undefined | false | ""): item is T => {
  return !!item;
};

type ConfigNavParams = {
  projectId: string;
  setupComplete: boolean;
  report: FirestoreDoctorReportDocument | null;
};

const ConfigNav: FC<ConfigNavParams> = ({
  projectId: projectId,
  setupComplete,
  report,
}) => {
  const sidebarNavItems = useMemo(() => {
    const hasWarnings = (ns: string) =>
      !!report?.messages.some((m) => m.type.startsWith(ns + "/"));

    return [
      {
        title: "Firebase Configuration",
        href: `/projects/${projectId}/firebase-config`,
        hasWarnings: hasWarnings("config") || hasWarnings("general"),
      },
      setupComplete && {
        title: "Sign-in Methods",
        href: `/projects/${projectId}/providers`,
        hasWarnings: hasWarnings("provider"),
      },
      setupComplete && {
        title: "Domains",
        href: `/projects/${projectId}/domains`,
        hasWarnings: hasWarnings("domain"),
      },
      setupComplete && {
        title: "Your App",
        href: `/projects/${projectId}/clients`,
        hasWarnings: hasWarnings("client"),
      },
    ].filter(isTruthy);
  }, [projectId, report, setupComplete]);
  return <SidebarNav items={sidebarNavItems} />;
};

export default ConfigNav;
