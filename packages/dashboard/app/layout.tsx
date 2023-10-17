import "./globals.css";

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Navbar } from "./Navbar";
import { ThemeProvider } from "@/components/theme-provider";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Auth Portal Dashboard",
};

type ContentWrapperProps = {
  children: React.ReactNode;
};

const ContentWrapper: React.FC<ContentWrapperProps> = ({ children }) => {
  return (
    <div className="container flex h-full flex-col">
      <Navbar />
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
    <html className="h-full" lang="en">
      <body className={cn(inter.className, "h-full")}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <ContentWrapper>{children}</ContentWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
