import { cn } from "@/lib/utils";

interface PageDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

export default function PageDescription({
  children,
  className,
}: PageDescriptionProps) {
  return (
    <p
      className={cn(
        "max-w-2xl mx-auto text-base text-text-secondary leading-relaxed",
        className
      )}
    >
      {children}
    </p>
  );
}
