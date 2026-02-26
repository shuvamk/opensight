"use client";
import * as React from "react";
import { motion, type Transition } from "motion/react";
import { cn } from "@/lib/utils";
interface BorderBeamProps {
  size?: number;
  thickness?: number;
  duration?: number;
  delay?: number;
  colorFrom?: string;
  colorTo?: string;
  transition?: Transition;
  className?: string;
  style?: React.CSSProperties;
  initialOffset?: number;
  borderWidth?: number;
}
export function BorderBeam({
  className,
  size = 30,
  thickness = 8,
  delay = 0,
  duration = 6,
  colorFrom = "#ffaa40",
  colorTo = "#9c40ff",
  transition,
  style,
  initialOffset = 0,
  borderWidth = 1,
}: BorderBeamProps) {
  return (
    <div
      className="pointer-events-none absolute inset-0 rounded-[inherit] border border-transparent [border-width:var(--border-beam-width)] [mask-clip:padding-box,border-box] mask-intersect mask-[linear-gradient(transparent,transparent),linear-gradient(#000,#000)]"
      style={
        { "--border-beam-width": `${borderWidth}px` } as React.CSSProperties
      }
    >
      {" "}
      <motion.div
        className={cn("absolute rounded-full", className)}
        style={
          {
            width: size,
            height: thickness,
            offsetPath: `rect(0 auto auto 0 round ${size}px)`,
            background: `linear-gradient(to right, ${colorFrom}, ${colorTo})`,
            ...style,
          } as React.CSSProperties
        }
        initial={{ offsetDistance: `${initialOffset}%` }}
        animate={{
          offsetDistance: [`${initialOffset}%`, `${100 + initialOffset}%`],
        }}
        transition={{
          repeat: Infinity,
          ease: "linear",
          duration,
          delay: -delay,
          ...transition,
        }}
      />{" "}
    </div>
  );
}
