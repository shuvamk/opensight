"use client";

import * as React from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

type ElementRef = React.RefObject<HTMLElement | null>;

export interface AnimatedBeamProps {
  className?: string;
  containerRef: ElementRef;
  fromRef: ElementRef;
  toRef: ElementRef;
  curvature?: number;
  reverse?: boolean;
  duration?: number;
  delay?: number;
  pathColor?: string;
  pathWidth?: number;
  pathOpacity?: number;
  beamOpacity?: number;
  beamLength?: number;
  gradientStartColor?: string;
  gradientStopColor?: string;
}

function getCenterPosition(
  element: HTMLElement,
  container: HTMLElement,
): { x: number; y: number } {
  const elementRect = element.getBoundingClientRect();
  const containerRect = container.getBoundingClientRect();

  return {
    x: elementRect.left - containerRect.left + elementRect.width / 2,
    y: elementRect.top - containerRect.top + elementRect.height / 2,
  };
}

export function AnimatedBeam({
  className,
  containerRef,
  fromRef,
  toRef,
  curvature = 40,
  reverse = false,
  duration = 4,
  delay = 0,
  pathColor = "#e2e8f0",
  pathWidth = 2,
  pathOpacity = 0.35,
  beamOpacity = 1,
  beamLength = 0.2,
  gradientStartColor = "#ffaa40",
  gradientStopColor = "#9c40ff",
}: AnimatedBeamProps) {
  const gradientId = React.useId();
  const [path, setPath] = React.useState<string>("");
  const [size, setSize] = React.useState({ width: 0, height: 0 });

  React.useEffect(() => {
    const container = containerRef.current;
    const from = fromRef.current;
    const to = toRef.current;

    if (!container || !from || !to) {
      return;
    }

    const updatePath = () => {
      const start = getCenterPosition(from, container);
      const end = getCenterPosition(to, container);
      const controlX = (start.x + end.x) / 2;
      const direction = reverse ? -1 : 1;
      const controlY = (start.y + end.y) / 2 - curvature * direction;

      setPath(
        `M ${start.x},${start.y} Q ${controlX},${controlY} ${end.x},${end.y}`,
      );
      setSize({
        width: container.clientWidth,
        height: container.clientHeight,
      });
    };

    updatePath();

    const resizeObserver = new ResizeObserver(updatePath);
    resizeObserver.observe(container);
    resizeObserver.observe(from);
    resizeObserver.observe(to);
    window.addEventListener("resize", updatePath);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updatePath);
    };
  }, [containerRef, fromRef, toRef, curvature, reverse]);

  if (!path || size.width === 0 || size.height === 0) {
    return null;
  }

  return (
    <div className={cn("pointer-events-none absolute inset-0", className)}>
      <svg
        width={size.width}
        height={size.height}
        viewBox={`0 0 ${size.width} ${size.height}`}
        className="absolute inset-0 overflow-visible"
      >
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={gradientStartColor} />
            <stop offset="100%" stopColor={gradientStopColor} />
          </linearGradient>
        </defs>

        <path
          d={path}
          pathLength={1}
          stroke={pathColor}
          strokeWidth={pathWidth}
          strokeOpacity={pathOpacity}
          fill="none"
          strokeLinecap="round"
        />

        <motion.path
          d={path}
          pathLength={1}
          stroke={`url(#${gradientId})`}
          strokeWidth={pathWidth}
          strokeOpacity={beamOpacity}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={`${beamLength} ${1 - beamLength}`}
          initial={{ strokeDashoffset: reverse ? -1 : 0 }}
          animate={{ strokeDashoffset: reverse ? [0, -1] : [-1, 0] }}
          transition={{
            duration,
            delay: -delay,
            ease: "linear",
            repeat: Infinity,
          }}
        />
      </svg>
    </div>
  );
}
