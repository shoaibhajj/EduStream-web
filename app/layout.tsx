import type { Metadata } from "next";
import "./globals.css";
import { Geist, Roboto_Slab } from "next/font/google";
import { cn } from "@/lib/utils";
import { ClerkProvider } from "@clerk/nextjs";

const robotoSlab = Roboto_Slab({subsets:['latin'],variable:'--font-serif'});

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

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
    <ClerkProvider>
      <html
        suppressHydrationWarning
        className={cn(geist.variable, "font-serif", robotoSlab.variable)}
      >
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}
