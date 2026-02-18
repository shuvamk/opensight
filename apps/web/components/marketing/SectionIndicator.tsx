interface SectionIndicatorProps {
  number: string;
  total: string;
  label: string;
  className?: string;
}

export default function SectionIndicator({
  number,
  total,
  label,
  className = "",
}: SectionIndicatorProps) {
  return (
    <div className={`flex items-center gap-2 mb-4 ${className}`.trim()}>
      <div className="w-0.5 h-5 bg-indigo-300 rounded-full" />
      <span className="section-indicator">
        <span className="text-indigo-300">{number}</span> / {total}
      </span>
      <span className="text-sm font-mono uppercase text-text-tertiary">
        {label}
      </span>
    </div>
  );
}
