import { WebsiteSection } from "../components/WebsiteSection";

const LegalLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <WebsiteSection>
      <div className="prose self-center py-28 w-full">{children}</div>
    </WebsiteSection>
  );
};

export default LegalLayout;
