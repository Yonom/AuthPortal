import EnsureDomainMatch from "@/components/EnsureDomainMatch";
import { FC } from "react";

export const generateStaticParams = () => [];

type LayoutProps = {
  children: React.ReactNode;
};

const Layout: FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen items-center justify-center">
      <EnsureDomainMatch />
      <div className="min-h-50 w-[400px] rounded border border-black p-6">
        {children}
      </div>
    </div>
  );
};

export default Layout;
