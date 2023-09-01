import "./globals.css";

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Sidebar } from "./Sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Auth Portal Dashboard",
};

type ContentWrapperProps = {
  children: React.ReactNode;
};

const ContentWrapper: React.FC<ContentWrapperProps> = ({ children }) => {
  return (
    <div className="flex h-full flex-row">
      <Sidebar />
      <div className="p-7">{children}</div>
    </div>
  );
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html className="dark h-full" lang="en">
      <body className={inter.className + " h-full"}>
        <ContentWrapper>{children}</ContentWrapper>
      </body>
    </html>
  );
}
