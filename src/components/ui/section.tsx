import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type SectionProps = HTMLAttributes<HTMLElement> & {
  spacing?: "compact" | "default" | "large";
};

const spacingClasses = {
  compact: "py-12 md:py-16 lg:py-20",
  default: "py-20 md:py-32 lg:py-40",
  large: "py-24 md:py-40 lg:py-48",
} as const;

export function Section({
  spacing = "default",
  className,
  ...props
}: SectionProps) {
  return (
    <section
      className={cn(spacingClasses[spacing], className)}
      {...props}
    />
  );
}