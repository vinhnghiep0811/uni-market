import type { HTMLAttributes } from "react";

import { cn } from "./cn";

type CardProps = HTMLAttributes<HTMLDivElement>;

export default function Card({ className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-[10px]", 
        className,
      )}
      {...props}
    />
  );
}
