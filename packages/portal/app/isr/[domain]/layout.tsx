import { FC } from "react";

export const dynamic = "error";
export const dynamicParams = true;

type LayoutProps = {
  children: React.ReactNode;
};

const Layout: FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="border border-black rounded w-[400px] min-h-50 p-6">
        {children}
      </div>
    </div>
  );
};

export default Layout;
