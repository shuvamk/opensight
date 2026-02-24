"use client";

import { useEffect, useState } from "react";

const MOBILE_BREAKPOINT = 768;

export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    mql.addEventListener("change", onChange);
    // Defer initial setState to avoid synchronous setState in effect (cascading renders)
    const id = setTimeout(() => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT), 0);
    return () => {
      clearTimeout(id);
      mql.removeEventListener("change", onChange);
    };
  }, []);

  return Boolean(isMobile);
}
