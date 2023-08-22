import Link from "next/link";
import { WebsiteSection } from "./WebsiteSection";

export const Footer = () => {
  return (
    <WebsiteSection className="py-14">
      <div className="pb-10 text-center">
        <Link href="/legal/privacy">Privacy</Link> |{" "}
        <Link href="/legal/terms">Terms</Link> |{" "}
        <Link href="/legal/impressum">Impressum</Link>
      </div>
    </WebsiteSection>
  );
};
