"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface HoverPillProps extends React.HTMLAttributes<HTMLDivElement> {
  tabSelector?: string;
  pillClassName?: string;
  children: React.ReactNode;
}

export function HoverPill({
  tabSelector = "[data-slot=tabs-tab]",
  pillClassName,
  className,
  children,
  ...props
}: HoverPillProps) {
  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null);
  const [pillPosition, setPillPosition] = React.useState({
    left: 0,
    top: 0,
    width: 0,
    height: 0,
  });
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useLayoutEffect(() => {
    if (hoveredIndex === null || !containerRef.current) return;
    const tabs = containerRef.current.querySelectorAll<HTMLElement>(tabSelector);
    const tab = tabs[hoveredIndex];
    const container = containerRef.current;
    if (!tab || !container) return;
    const tabRect = tab.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    setPillPosition({
      left: tabRect.left - containerRect.left,
      top: tabRect.top - containerRect.top,
      width: tabRect.width,
      height: tabRect.height,
    });
  }, [hoveredIndex, tabSelector]);

  const handleMouseMove = React.useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const list = e.currentTarget;
      const tabs = list.querySelectorAll<HTMLElement>(tabSelector);
      const target = e.target as Node;
      const index = Array.from(tabs).findIndex((tab) => tab === target || tab.contains(target));
      setHoveredIndex(index >= 0 ? index : null);
    },
    [tabSelector],
  );

  return (
    <div
      ref={containerRef}
      className={cn("relative", className)}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setHoveredIndex(null)}
      {...props}
    >
      {children}
      {hoveredIndex !== null && (
        <div
          aria-hidden
          className={cn(
            "pointer-events-none absolute rounded-md bg-accent -z-10 transition-[left,top,width,height] duration-200 ease-out",
            pillClassName,
          )}
          style={{
            left: pillPosition.left,
            top: pillPosition.top,
            width: pillPosition.width,
            height: pillPosition.height,
          }}
        />
      )}
    </div>
  );
}
