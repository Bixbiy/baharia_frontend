import Image from "next/image";

import { cn } from "@/lib/utils";

type EditorialSectionProps = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  ctaLabel: string;
  ctaHref: string;
  reverse?: boolean;
  dark?: boolean;
};

export function EditorialSection({
  id,
  eyebrow,
  title,
  description,
  image,
  imageAlt,
  ctaLabel,
  ctaHref,
  reverse = false,
  dark = false,
}: EditorialSectionProps) {
  return (
    <section
      id={id}
      className={cn(
        "px-6 py-20 sm:px-8 sm:py-24 lg:px-12 lg:py-32 xl:px-16 xl:py-40",
        dark
          ? "bg-deep-indigo text-bone"
          : "bg-bone text-charcoal",
      )}
    >
      <div
        className="
          mx-auto
          grid
          w-full
          max-w-[1440px]
          items-center
          gap-12
          lg:grid-cols-2
          lg:gap-16
          xl:gap-24
        "
      >
        {/* Image */}
        <div
          className={cn(
            "relative",
            "order-1",
            reverse && "lg:order-2",
          )}
        >
          <div
            className="
              relative
              aspect-[4/5]
              w-full
              overflow-hidden
              border
              border-charcoal/10
              bg-charcoal
              shadow-[0_24px_60px_rgb(27_42_74_/_0.10)]
            "
          >
            <Image
              src={image}
              alt={imageAlt}
              fill
              sizes="
                (max-width: 1023px) 100vw,
                48vw
              "
              quality={90}
              className="
                object-cover
                transition-transform
                duration-700
                ease-[var(--ease-editorial)]
                hover:scale-[1.025]
              "
            />

            <div
              aria-hidden="true"
              className="
                pointer-events-none
                absolute
                inset-0
                bg-[linear-gradient(180deg,transparent_55%,rgb(0_0_0_/_0.18)_100%)]
              "
            />
          </div>

          <div
            className={cn(
              "mt-4 flex items-center gap-3",
              "text-[9px] uppercase tracking-[0.24em]",
              dark ? "text-bone/40" : "text-muted/70",
            )}
          >
            <span>Baharia</span>

            <span
              aria-hidden="true"
              className={cn(
                "h-px w-8",
                dark ? "bg-bone/20" : "bg-charcoal/15",
              )}
            />

            <span>{eyebrow}</span>
          </div>
        </div>

        {/* Content */}
        <div
          className={cn(
            "order-2 max-w-xl",
            reverse && "lg:order-1",
          )}
        >
          <p
            className={cn(
              "text-[10px] font-medium uppercase tracking-[0.26em]",
              dark ? "text-bone/50" : "text-muted",
            )}
          >
            {eyebrow}
          </p>

          <h2
            className="
              mt-6
              font-display
              text-[clamp(3rem,5.5vw,5.5rem)]
              leading-[0.92]
              tracking-[-0.04em]
            "
          >
            {title}
          </h2>

          <p
            className={cn(
              "mt-7 max-w-lg text-base leading-8 sm:text-lg",
              dark ? "text-bone/65" : "text-muted",
            )}
          >
            {description}
          </p>

          <a
            href={ctaHref}
            className={cn(
              "group mt-8 inline-flex items-center gap-3",
              "text-sm font-medium",
              dark ? "text-bone" : "text-deep-indigo",
            )}
          >
            <span>{ctaLabel}</span>

            <span
              aria-hidden="true"
              className="
                transition-transform
                duration-300
                ease-[var(--ease-editorial)]
                group-hover:translate-x-1.5
              "
            >
              →
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}