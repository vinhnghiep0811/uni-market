type CategoryBadgeProps = {
  label: string;
  className: string;
};

export default function CategoryBadge({
  label,
  className,
}: CategoryBadgeProps) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold shadow-sm ${className}`}
    >
      {label}
    </span>
  );
}
