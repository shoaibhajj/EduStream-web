import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Moallem Academy | أكاديمية المعلم",
  description: "منصة أكاديمية المعلم للتعليم الإلكتروني",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
