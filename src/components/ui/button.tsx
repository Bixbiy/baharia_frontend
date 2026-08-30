import type { ButtonHTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils";

type ButtonVariant =
  | "navTransparent"
  | "navScrolled"
  | "primary"
  | "secondary";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  children: ReactNode;
};

const buttonVariants: Record<ButtonVariant, string> = {
  navTransparent:
    "border border-bone bg-transparent text-bone hover:bg-bone/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent focus-visible:ring-bone active:bg-bone/20 transition-all duration-300",
  navScrolled:
    "border border-deep-indigo bg-transparent text-deep-indigo hover:bg-deep-indigo/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-sand focus-visible:ring-deep-indigo active:bg-deep-indigo/20 transition-all duration-300",
  primary:
    "bg-deep-indigo text-bone hover:bg-charcoal hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-sand focus-visible:ring-deep-indigo disabled:bg-charcoal/50 disabled:text-bone/50 disabled:cursor-not-allowed active:bg-charcoal transition-all duration-300",
  secondary:
    "bg-bone text-deep-indigo hover:bg-sand hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-bone focus-visible:ring-deep-indigo disabled:bg-coral-stone/50 disabled:text-charcoal/50 disabled:cursor-not-allowed active:bg-sand/80 transition-all duration-300",
};

export function Button({
  variant = "primary",
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-[4px] px-4 py-2.5 min-h-[44px] min-w-[44px] text-[11px] font-semibold uppercase tracking-[0.14em] transition-all duration-300 ease-[var(--ease-editorial)]",
        buttonVariants[variant],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
