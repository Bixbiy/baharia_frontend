"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";

export function FinalBookingCta() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section
      aria-labelledby="final-booking-title"
      className="relative overflow-hidden bg-deep-indigo text-bone"
    >
      <motion.div
        initial={
          prefersReducedMotion
            ? false
            : { opacity: 0, scale: 1.025 }
        }
        whileInView={{
          opacity: 1,
          scale: 1,
        }}
        viewport={{
          once: true,
          amount: 0.15,
        }}
        transition={{
          duration: prefersReducedMotion ? 0 : 1.1,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="relative min-h-[560px] overflow-hidden sm:min-h-[620px] lg:min-h-[680px]"
      >
        <Image
          src="/evening_view.jpeg"
          alt="Baharia during the quiet evening"
          fill
          sizes="100vw"
          className="object-cover object-center"
          priority={false}
        />

        {/* Image treatment */}
        <div
          aria-hidden="true"
          className="
            absolute inset-0
            bg-[linear-gradient(180deg,rgb(27_42_74_/_0.08)_0%,rgb(27_42_74_/_0.16)_38%,rgb(9_15_25_/_0.80)_100%)]
          "
        />

        <div
          aria-hidden="true"
          className="
            absolute inset-0
            bg-[radial-gradient(circle_at_50%_35%,transparent_0%,rgb(0_0_0_/_0.12)_100%)]
          "
        />

        {/* Top micro label */}
        <div
          className="
            absolute left-6 top-6 z-10
            sm:left-8 sm:top-8
            lg:left-12 lg:top-10
            xl:left-16
          "
        >
          <div className="flex items-center gap-3">
            <span className="text-[9px] font-medium uppercase tracking-[0.28em] text-bone/85">
              Baharia
            </span>

            <span
              aria-hidden="true"
              className="h-px w-8 bg-brass"
            />

            <span className="text-[9px] font-medium uppercase tracking-[0.22em] text-bone/75">
              Evening
            </span>
          </div>
        </div>

        {/* Main composition */}
        <div
          className="
            relative z-10
            flex min-h-[560px]
            items-end
            sm:min-h-[620px]
            lg:min-h-[680px]
          "
        >
          <div
            className="
              mx-auto
              flex w-full
              max-w-[1600px]
              items-end
              justify-between
              gap-8
              px-6
              pb-6
              sm:px-8
              sm:pb-8
              lg:px-12
              lg:pb-10
              xl:px-16
            "
          >
            {/* Statement */}
            <div className="max-w-4xl">
              <p className="max-w-xl text-[clamp(2.4rem,5vw,5.8rem)] font-display leading-[0.9] tracking-[-0.05em] text-bone">
                Come closer
                <span className="block text-bone/80">
                  to the quiet.
                </span>
              </p>
            </div>

            {/* Floating reservation card */}
            <motion.div
              initial={
                prefersReducedMotion
                  ? false
                  : {
                      opacity: 0,
                      y: 18,
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
                duration: prefersReducedMotion
                  ? 0
                  : 0.65,
                delay: prefersReducedMotion
                  ? 0
                  : 0.15,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="
                hidden
                w-[300px]
                shrink-0
                border
                border-bone/25
                bg-bone
                p-6
                text-charcoal
                shadow-[0_24px_70px_rgb(0_0_0_/_0.22)]
                lg:block
                xl:w-[330px]
                xl:p-7
              "
            >
              <p className="text-[8px] font-semibold uppercase tracking-[0.24em] text-muted/95">
                Your next stay
              </p>

              <p className="mt-3 font-display text-3xl leading-none tracking-[-0.03em]">
                Begin here.
              </p>

              <p className="mt-4 text-sm leading-6 text-muted/85">
                Choose your dates and discover a quieter way
                to stay by the coast.
              </p>

              <Link
                href="/booking"
                data-cta="reserve"
                data-location="final-cta-desktop"
                className="
                  group
                  mt-6
                  inline-flex
                  min-h-12
                  w-full
                  items-center
                  justify-between
                  gap-4
                  border
                  border-deep-indigo
                  bg-deep-indigo
                  px-5
                  text-bone
                  text-[9px]
                  font-semibold
                  uppercase
                  tracking-[0.17em]
                  transition-all
                  duration-300
                  ease-[var(--ease-editorial)]
                  hover:bg-transparent
                  hover:text-deep-indigo
                  focus-visible:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-offset-2
                  focus-visible:ring-offset-bone
                  focus-visible:ring-deep-indigo
                  rounded-[4px]
                "
              >
                <span>Reserve your stay</span>

                <span
                  aria-hidden="true"
                  className="transition-transform duration-300 group-hover:translate-x-1 group-focus-visible:translate-x-1"
                >
                  →
                </span>
              </Link>
            </motion.div>

            {/* Mobile action */}
            <div className="absolute bottom-6 right-6 sm:bottom-8 sm:right-8 lg:hidden">
              <Link
                href="/booking"
                data-cta="reserve"
                data-location="final-cta-mobile"
                className="
                  group
                  inline-flex
                  min-h-11
                  items-center
                  gap-4
                  border
                  border-bone
                  bg-bone
                  px-5
                  text-deep-indigo
                  text-[9px]
                  font-semibold
                  uppercase
                  tracking-[0.17em]
                  transition-all
                  duration-300
                  ease-[var(--ease-editorial)]
                  hover:bg-coral-stone
                  hover:text-charcoal
                  focus-visible:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-offset-2
                  focus-visible:ring-offset-deep-indigo
                  focus-visible:ring-bone
                  rounded-[4px]
                "
              >
                <span>Reserve your stay</span>

                <span
                  aria-hidden="true"
                  className="transition-transform duration-300 group-hover:translate-x-1 group-focus-visible:translate-x-1"
                >
                  →
                </span>
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}