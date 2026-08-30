import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type StackProps = HTMLAttributes<HTMLDivElement> & {
  gap?: "2" | "3" | "4" | "6" | "8" | "10" | "12";
};

const gapClasses = {
  "2": "gap-2",
  "3": "gap-3",
  "4": "gap-4",
  "6": "gap-6",
  "8": "gap-8",
  "10": "gap-10",
  "12": "gap-12",
} as const;

export function Stack({
  gap = "4",
  className,
  ...props
}: StackProps) {
  return (
    <div
      className={cn(
        "flex flex-col",
        gapClasses[gap],
        className,
      )}
      {...props}
    />
  );
}