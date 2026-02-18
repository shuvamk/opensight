import { geist, geistMono, geistPixelSquare } from "@/lib/fonts";
import QueryProvider from "@/lib/query-provider";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "OpenSight | AI Visibility Analytics",
  description: "Monitor and optimize your brand's visibility across AI search engines",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={cn(geist.variable, geistMono.variable, geistPixelSquare.variable)}>
      <body className={geist.className}>
        <QueryProvider>
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}
