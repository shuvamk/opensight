"use client";

import * as React from "react";
import { forwardRef, useRef } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { AnimatedBeam } from "@/registry/magicui/animated-beam";

type CircleProps = {
  className?: string;
  children?: React.ReactNode;
};

const Circle = forwardRef<HTMLDivElement, CircleProps>(
  ({ className, children }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "z-10 flex size-20 items-center justify-center rounded-full border border-border/70 bg-white p-4 shadow-[0_8px_24px_-16px_rgba(0,0,0,0.5)]",
          className,
        )}
      >
        {children}
      </div>
    );
  },
);

Circle.displayName = "Circle";

function NodeIcon({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  return (
    <Image
      src={src}
      alt={alt}
      width={40}
      height={40}
      className={cn("h-10 w-10 object-contain", className)}
    />
  );
}

export default function AIBeamNetwork() {
  const containerRef = useRef<HTMLDivElement>(null);
  const topLeftRef = useRef<HTMLDivElement>(null);
  const middleLeftRef = useRef<HTMLDivElement>(null);
  const bottomLeftRef = useRef<HTMLDivElement>(null);
  const centerRef = useRef<HTMLDivElement>(null);
  const topRightRef = useRef<HTMLDivElement>(null);
  const middleRightRef = useRef<HTMLDivElement>(null);
  const bottomRightRef = useRef<HTMLDivElement>(null);

  return (
    <div className="mx-auto mt-16 w-full max-w-4xl px-2 sm:px-4">
      <div
        className="relative flex h-[430px] w-full items-center justify-center overflow-hidden px-6 py-8"
        ref={containerRef}
        aria-label="AI provider connection network"
      >
        <div className="flex size-full max-h-[360px] max-w-5xl flex-col items-stretch justify-between gap-12">
          <div className="flex flex-row items-center justify-between">
            <Circle ref={topLeftRef}>
              <NodeIcon src="/Gemini.svg" alt="Gemini" />
            </Circle>
            <Circle ref={topRightRef}>
              <NodeIcon src="/Claude.svg" alt="Claude" />
            </Circle>
          </div>
          <div className="flex flex-row items-center justify-between">
            <Circle ref={middleLeftRef}>
              <NodeIcon src="/ChatGpt.svg" alt="ChatGpt" className="invert text-black" />
            </Circle>
            <Circle ref={centerRef} className="size-24 p-5">
              <NodeIcon
                src="/logo.svg"
                alt="OpenSight"
                className="h-12 w-12 text-black"
              />
            </Circle>
            <Circle ref={middleRightRef}>
              <NodeIcon src="/Deepseek.svg" alt="Deepseek" />
            </Circle>
          </div>
          <div className="flex flex-row items-center justify-between">
            <Circle ref={bottomLeftRef}>
              <NodeIcon src="/Perplexity.svg" alt="Perplexity" />
            </Circle>
            <Circle ref={bottomRightRef}>
              <NodeIcon src="/PataNhi.svg" alt="PataNhi" />
            </Circle>
          </div>
        </div>

        {[
          { id: "top-left", toRef: topLeftRef, curvature: -55, pathOpacity: 0.28, beamLength: 0.16, duration: 2.2 },
          { id: "middle-left", toRef: middleLeftRef, curvature: 0, pathOpacity: 0.28, beamLength: 0.16, duration: 2.2 },
          { id: "bottom-left", toRef: bottomLeftRef, curvature: 55, pathOpacity: 0.28, beamLength: 0.16, duration: 2.2 },
          { id: "top-right", toRef: topRightRef, curvature: -55, pathOpacity: 0.28, beamLength: 0.16, duration: 2.2 },
          { id: "middle-right", toRef: middleRightRef, curvature: 0, pathOpacity: 0.28, beamLength: 0.16, duration: 2.2 },
          { id: "bottom-right", toRef: bottomRightRef, curvature: 55, pathOpacity: 0.28, beamLength: 0.16, duration: 2.2 },
        ].map((connection, index) => (
          <AnimatedBeam
            key={connection.id}
            containerRef={containerRef}
            toRef={connection.toRef}
            fromRef={centerRef}
            curvature={connection.curvature}
            duration={connection.duration}
            delay={index * 0.2}
            pathWidth={2}
            pathOpacity={connection.pathOpacity}
            beamOpacity={1}
            beamLength={connection.beamLength}
            gradientStartColor="#ffaa40"
            gradientStopColor="#9c40ff"
          />
        ))}
      </div>
    </div>
  );
}
