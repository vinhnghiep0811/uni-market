import type { HTMLAttributes } from "react";

import { cn } from "./cn";

type CardProps = HTMLAttributes<HTMLDivElement>;

export default function Card({ className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-[24px] bg-white shadow-sm ring-1 ring-slate-200",
        className,
      )}
      {...props}
    />
  );
}
