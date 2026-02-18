import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  lead: string;
  highlight: string;
  as?: "h1" | "h2";
  size?: "sm" | "md" | "lg";
  centered?: boolean;
  highlightVariant?: "gradient" | "primary";
  className?: string;
}

const sizeClasses = {
  sm: "text-3xl sm:text-4xl font-medium",
  md: "text-4xl sm:text-5xl font-bold",
  lg: "text-5xl sm:text-6xl font-medium",
};

export default function SectionHeading({
  lead,
  highlight,
  as: Tag = "h2",
  size = "md",
  centered = false,
  highlightVariant = "gradient",
  className,
}: SectionHeadingProps) {
  return (
    <Tag
      className={cn(
        "tracking-tighter font-heading leading-[0.9] text-balance text-primary-500",
        sizeClasses[size],
        centered && "text-center mx-auto",
        !centered && "max-w-xl mx-auto",
        className
      )}
    >
      {lead}{" "}
      <span className={highlightVariant === "gradient" ? "text-gradient" : "text-primary"}>
        {highlight}
      </span>
    </Tag>
  );
}
