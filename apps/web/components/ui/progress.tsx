"use client";

import { Progress as ProgressPrimitive } from "@base-ui/react/progress";

import { cn } from "@/lib/utils";

const LINES = 100;

function Progress({
  className,
  children,
  variant = "default",
  ...props
}: ProgressPrimitive.Root.Props & { variant?: "default" | "lines" }) {
  const value = props.value ?? 0;
  const filledCount = variant === "lines" ? Math.round((Number(value) / 100) * LINES) : undefined;

  return (
    <ProgressPrimitive.Root
      className={cn("flex w-full flex-col gap-2", className)}
      data-slot="progress"
      data-variant={variant}
      {...props}
    >
      {children ? (
        children
      ) : variant === "lines" ? (
        <div
          className={cn("flex h-full w-full gap-px overflow-hidden rounded-full bg-input",
            variant == "lines" && "rounded-none gap-1 bg-transparent"
          )}
          data-slot="progress-track"
          role="progressbar"
          aria-valuenow={Number(value)}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          {Array.from({ length: LINES }, (_, i) => (
            <div
              key={i}
              className={cn(
                "min-w-0 flex-1 rounded-xl transition-colors duration-300",
                i < filledCount! ? "bg-primary" : "bg-input",
              )}
            />
          ))}
        </div>
      ) : (
        <ProgressTrack>
          <ProgressIndicator />
        </ProgressTrack>
      )}
    </ProgressPrimitive.Root>
  );
}

function ProgressLabel({ className, ...props }: ProgressPrimitive.Label.Props) {
  return (
    <ProgressPrimitive.Label
      className={cn("font-medium text-sm", className)}
      data-slot="progress-label"
      {...props}
    />
  );
}

function ProgressTrack({ className, ...props }: ProgressPrimitive.Track.Props) {
  return (
    <ProgressPrimitive.Track
      className={cn(
        "block h-1.5 w-full overflow-hidden rounded-full bg-input",
        className,
      )}
      data-slot="progress-track"
      {...props}
    />
  );
}

function ProgressIndicator({
  className,
  ...props
}: ProgressPrimitive.Indicator.Props) {
  return (
    <ProgressPrimitive.Indicator
      className={cn("bg-primary transition-all duration-500", className)}
      data-slot="progress-indicator"
      {...props}
    />
  );
}

function ProgressValue({ className, ...props }: ProgressPrimitive.Value.Props) {
  return (
    <ProgressPrimitive.Value
      className={cn("text-sm tabular-nums", className)}
      data-slot="progress-value"
      {...props}
    />
  );
}

export {
  Progress,
  ProgressLabel,
  ProgressTrack,
  ProgressIndicator,
  ProgressValue,
};
