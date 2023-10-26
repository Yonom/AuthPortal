import "./globals.css";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Auth Portal Firebase Demo",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
