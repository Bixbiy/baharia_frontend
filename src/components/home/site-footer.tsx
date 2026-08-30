"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";

const footerLinks = [
  {
    label: "Rooms",
    href: "#rooms",
  },
  {
    label: "Experiences",
    href: "#experiences",
  },
  {
    label: "Our story",
    href: "#about",
  },
  {
    label: "Reserve your stay",
    href: "/booking",
  },
] as const;

export function SiteFooter() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <footer className="overflow-hidden bg-bone text-charcoal">
      <div className="mx-auto w-full max-w-[1600px] px-6 sm:px-8 lg:px-12 xl:px-16">
        {/* Primary footer field */}
        <div
          className="
            border-t
            border-charcoal/10
            py-8
            sm:py-10
            lg:py-12
          "
        >
          <div
            className="
              grid
              gap-10
              lg:grid-cols-[1.25fr_0.75fr_0.75fr]
              lg:gap-16
              xl:gap-24
            "
          >
            {/* Brand */}
            <div>
              <p className="text-[8px] font-medium uppercase tracking-[0.24em] text-muted/80">
                Stay awhile
              </p>

              <h2 className="mt-4 max-w-xl font-display text-[clamp(2.3rem,4vw,4.8rem)] leading-[0.9] tracking-[-0.045em]">
                Made for the
                <span className="block text-deep-indigo">
                  slower moments.
                </span>
              </h2>
            </div>

            {/* Navigation */}
            <nav
              aria-label="Footer navigation"
              className="lg:pt-1"
            >
              <p className="text-[8px] font-medium uppercase tracking-[0.22em] text-muted/80">
                Explore
              </p>

              <div className="mt-5 flex flex-col items-start gap-3">
                {footerLinks.map(
                  (link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      data-cta={link.href === "/booking" ? "reserve" : undefined}
                      data-location={link.href === "/booking" ? "footer" : undefined}
                      className="
                        group
                        inline-flex
                        items-center
                        gap-2
                        text-sm
                        text-charcoal
                        focus-visible:outline-none
                        focus-visible:ring-2
                        focus-visible:ring-offset-1
                        focus-visible:ring-deep-indigo
                        rounded-[2px]
                      "
                    >
                      <span>{link.label}</span>

                      <span
                        aria-hidden="true"
                        className="
                          -translate-x-1
                          opacity-0
                          transition-all
                          duration-300
                          group-hover:translate-x-0
                          group-hover:opacity-100
                        "
                      >
                        →
                      </span>
                    </Link>
                  ),
                )}
              </div>
            </nav>

            {/* Contact */}
            <div className="lg:pt-1">
              <p className="text-[8px] font-medium uppercase tracking-[0.22em] text-muted/80">
                Connect
              </p>

              <div className="mt-5 flex flex-col items-start gap-3">
                <a
                  href="mailto:connect@shumse.com"
                  className="
                    group
                    inline-flex
                    items-center
                    gap-2
                    text-sm
                    text-charcoal
                    focus-visible:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-offset-1
                    focus-visible:ring-deep-indigo
                    rounded-[2px]
                  "
                >
                  <span>connect@shumse.com</span>

                  <span
                    aria-hidden="true"
                    className="
                      -translate-x-1
                      opacity-0
                      transition-all
                      duration-300
                      group-hover:translate-x-0
                      group-hover:opacity-100
                    "
                  >
                    ↗
                  </span>
                </a>

                <a
                  href="#top"
                  className="
                    group
                    inline-flex
                    items-center
                    gap-2
                    text-sm
                    text-charcoal
                    focus-visible:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-offset-1
                    focus-visible:ring-deep-indigo
                    rounded-[2px]
                  "
                >
                  <span>Instagram</span>

                  <span
                    aria-hidden="true"
                    className="
                      -translate-x-1
                      opacity-0
                      transition-all
                      duration-300
                      group-hover:translate-x-0
                      group-hover:opacity-100
                    "
                  >
                    ↗
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Giant brand signature */}
        <div
          className="
            overflow-hidden
            border-t
            border-charcoal/10
            pt-4
            sm:pt-5
          "
        >
          <motion.div
            initial={
              prefersReducedMotion
                ? false
                : {
                    opacity: 0,
                    y: 20,
                  }
            }
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
              amount: 0.2,
            }}
            transition={{
              duration: prefersReducedMotion ? 0 : 0.7,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="
              select-none
              whitespace-nowrap
              font-display
              text-[clamp(5rem,18vw,17rem)]
              leading-[0.68]
              tracking-[-0.08em]
              text-deep-indigo
            "
          >
            Baharia
          </motion.div>
        </div>

        {/* Final footer line */}
        <div
          className="
            flex
            min-h-14
            flex-col
            justify-center
            gap-2
            border-t
            border-charcoal/10
            py-3
            text-[8px]
            font-medium
            uppercase
            tracking-[0.16em]
            text-muted/55
            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >
          <div className="flex items-center gap-3">
            <span>© 2026 Baharia Tanzania</span>

            <span
              aria-hidden="true"
              className="size-1 rounded-full bg-brass"
            />

            <span>Created by Bilal Abbas @OmniSyntax</span>
          </div>

          <Link
            href="#top"
            className="transition-colors duration-200 hover:text-deep-indigo"
          >
            Return to the beginning ↑
          </Link>
        </div>
      </div>
    </footer>
  );
}