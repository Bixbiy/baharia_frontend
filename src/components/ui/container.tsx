import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type ContainerProps = HTMLAttributes<HTMLDivElement> & {
  size?: "default" | "wide" | "reading";
};

export function Container({
  size = "default",
  className,
  ...props
}: ContainerProps) {
  const sizes = {
    default: "max-w-[1440px]",
    wide: "max-w-[1600px]",
    reading: "max-w-[720px]",
  };

  return (
    <div
      className={cn(
        "mx-auto w-full px-6 sm:px-8 lg:px-12 xl:px-16",
        sizes[size],
        className,
      )}
      {...props}
    />
  );
}