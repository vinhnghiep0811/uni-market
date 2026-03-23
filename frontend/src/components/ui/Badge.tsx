import type { HTMLAttributes } from "react";

import { cn } from "./cn";

type BadgeProps = HTMLAttributes<HTMLSpanElement>;

export default function Badge({ className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold",
        className,
      )}
      {...props}
    />
  );
}
