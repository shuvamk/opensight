import { cn } from "@/lib/utils";

interface PageHeadingProps {
  children: React.ReactNode;
  as?: "h1" | "h2";
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClasses = {
  sm: "text-3xl sm:text-4xl font-normal",
  md: "text-4xl sm:text-5xl font-normal",
  lg: "text-5xl sm:text-6xl font-normal",
};

export default function PageHeading({
  children,
  as: Tag = "h1",
  size = "lg",
  className,
}: PageHeadingProps) {
  return (
    <Tag
      className={cn(
        "tracking-tighter leading-[0.9] text-balance text-foreground max-w-xl mx-auto",
        sizeClasses[size],
        className
      )}
    >
      {children}
    </Tag>
  );
}
