import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type DividerProps = HTMLAttributes<HTMLDivElement> & {
  tone?: "default" | "brass";
};

export function Divider({
  tone = "default",
  className,
  ...props
}: DividerProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "h-px w-full",
        tone === "default" ? "bg-charcoal/15" : "bg-brass",
        className,
      )}
      {...props}
    />
  );
}