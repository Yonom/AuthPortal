"use client";

type EnsureDomainMatchProps = {
  domain: string;
};

const EnsureDomainMatch: React.FC<EnsureDomainMatchProps> = ({ domain }) => {
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
