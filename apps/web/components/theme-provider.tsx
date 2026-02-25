"use client";

import { usePathname } from "next/navigation";
import { ThemeProvider as NextThemesProvider } from "next-themes";

const LIGHT_ONLY_PATHS = ["/", "/pricing"];

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  const pathname = usePathname();

  const isLightOnlyPath =
    pathname != null && LIGHT_ONLY_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"));

  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      forcedTheme={isLightOnlyPath ? "light" : undefined}
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}
