"use client";

import { useParams } from "next/navigation";

const EnsureDomainMatch: React.FC = () => {
  const { domain } = useParams();
  // The /isr/[domain] route is not directly accessible and this assertion must always pass.
  // This is an extra security measure to prevent XSRF in case of a misconfiguration.

  if (typeof window !== "undefined" && window.location.hostname !== domain) {
    throw new Error(
      "Page loaded under unexpected domain! Aborting for security reasons."
    );
  }

  return null;
};

export default EnsureDomainMatch;
