"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";

import { Container } from "@/components/ui";

export function ExperienceShowcase() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section
      id="baharia-experience"
      aria-labelledby="experience-showcase-title"
      className="
        relative
        overflow-hidden
        bg-sand
        text-charcoal
      "
    >
      <Container
        size="wide"
        className="
          relative
          py-6
          sm:py-8
          lg:py-10
          xl:py-10
        "
      >
        <div
          className="
            relative
            overflow-hidden
            bg-deep-indigo
          "
        >
          {/* =================================================
              Image
              ================================================= */}

          <motion.div
            className="
              relative
              min-h-[520px]
              sm:min-h-[560px]
              lg:min-h-[620px]
              xl:min-h-[660px]
            "
            initial={
              prefersReducedMotion
                ? false
                : {
                    opacity: 0,
                    scale: 1.025,
                  }
            }
            whileInView={
              prefersReducedMotion
                ? undefined
                : {
                    opacity: 1,
                    scale: 1,
                  }
            }
            viewport={{
              once: true,
              amount: 0.2,
            }}
            transition={{
              duration: prefersReducedMotion ? 0 : 0.9,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <Image
              src="/evening_view.jpeg"
              alt="Baharia rooftop terrace overlooking the surrounding landscape"
              fill
              loading="lazy"
              sizes="(max-width: 1023px) 100vw, 1440px"
              className="
                object-cover
                object-center
              "
            />

            {/* Dark editorial gradient */}
            <div
              aria-hidden="true"
              className="
                absolute
                inset-0
                bg-[linear-gradient(90deg,rgb(7_13_24_/_0.82)_0%,rgb(7_13_24_/_0.62)_24%,rgb(7_13_24_/_0.12)_58%,transparent_100%)]
                sm:bg-[linear-gradient(90deg,rgb(7_13_24_/_0.78)_0%,rgb(7_13_24_/_0.55)_28%,rgb(7_13_24_/_0.08)_66%,transparent_100%)]
              "
            />

            {/* Bottom tonal control */}
            <div
              aria-hidden="true"
              className="
                absolute
                inset-x-0
                bottom-0
                h-[38%]
                bg-[linear-gradient(180deg,transparent_0%,rgb(7_13_24_/_0.45)_100%)]
              "
            />

            {/* Subtle cinematic warmth */}
            <div
              aria-hidden="true"
              className="
                pointer-events-none
                absolute
                inset-0
                bg-[linear-gradient(135deg,rgb(232_212_192_/_0.06)_0%,transparent_48%)]
              "
            />
          </motion.div>

          {/* =================================================
              Editorial content
              ================================================= */}

          <motion.div
            className="
              absolute
              inset-y-0
              left-0
              z-10
              flex
              w-full
              max-w-[580px]
              items-end
              p-6
              sm:p-8
              lg:p-12
              xl:p-16
            "
            initial={
              prefersReducedMotion
                ? false
                : {
                    opacity: 0,
                    x: -18,
                  }
            }
            whileInView={
              prefersReducedMotion
                ? undefined
                : {
                    opacity: 1,
                    x: 0,
                  }
            }
            viewport={{
              once: true,
              amount: 0.2,
            }}
            transition={{
              duration: prefersReducedMotion ? 0 : 0.75,
              delay: prefersReducedMotion ? 0 : 0.08,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <div className="max-w-[470px] text-bone">
              <div
                className="
                  flex
                  items-center
                  gap-4
                  text-[9px]
                  font-medium
                  uppercase
                  tracking-[0.28em]
                  text-bone/60
                  sm:text-[10px]
                "
              >
                <span>Beyond the stay</span>

                <span
                  aria-hidden="true"
                  className="
                    h-px
                    w-9
                    bg-brass
                  "
                />
              </div>

              <h2
                id="experience-showcase-title"
                className="
                  mt-5
                  font-display
                  text-[clamp(3rem,5.6vw,6.2rem)]
                  leading-[0.9]
                  tracking-[-0.045em]
                "
              >
                The view
                <span className="block text-bone/60">
                  changes everything.
                </span>
              </h2>

              <p
                className="
                  mt-6
                  max-w-[420px]
                  text-sm
                  leading-6
                  text-bone/65
                  sm:mt-7
                  sm:text-base
                  sm:leading-7
                "
              >
                From the rooftop, Baharia opens beyond the
                villa itself — quiet roads, distant
                settlements, and a landscape that rewards
                taking your time.
              </p>

              <div className="mt-7 flex items-center gap-6">
                <a
                  href="#about"
                  className="
                    group
                    inline-flex
                    items-center
                    gap-3
                    text-sm
                    font-medium
                    text-bone
                  "
                >
                  <span>Discover the place</span>

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

                <span
                  aria-hidden="true"
                  className="
                    h-px
                    w-10
                    bg-bone/25
                  "
                />
              </div>
            </div>
          </motion.div>

          {/* =================================================
              Coordinates / editorial marker
              ================================================= */}

          <div
            aria-hidden="true"
            className="
              absolute
              bottom-5
              right-5
              z-10
              hidden
              items-center
              gap-3
              text-[8px]
              uppercase
              tracking-[0.24em]
              text-bone/45
              sm:flex
              lg:bottom-8
              lg:right-10
            "
          >
            <span>Baharia</span>

            <span className="h-px w-7 bg-bone/20" />

            <span>From above</span>
          </div>
        </div>
      </Container>
    </section>
  );
}