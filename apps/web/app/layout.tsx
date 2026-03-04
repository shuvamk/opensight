import { ThemeProvider } from "@/components/theme-provider";
import { ToastProvider } from "@/components/ui/toast";
import { geist, geistMono, geistPixelSquare } from "@/lib/fonts";
import QueryProvider from "@/lib/query-provider";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "OpenSight | AI Visibility Analytics",
  description: "Monitor and optimize your brand's visibility across AI search engines",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={cn(geist.variable, geistMono.variable, geistPixelSquare.variable)} suppressHydrationWarning>
      <body className={cn(geist.className, "bg-background text-foreground")}>
        <ThemeProvider>
          <QueryProvider>
            <ToastProvider position="top-right">
              {children}
            </ToastProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
