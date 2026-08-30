"use client";

import { motion, useReducedMotion } from "motion/react";

import { Container } from "@/components/ui";

const principles = [
  {
    number: "01",
    title: "Made with place",
    description:
      "Every material, opening, and view is considered in conversation with the landscape around it.",
  },
  {
    number: "02",
    title: "Quiet by design",
    description:
      "Luxury at Baharia is measured in space, light, privacy, and the freedom to slow down.",
  },
  {
    number: "03",
    title: "Rooted in hospitality",
    description:
      "Thoughtful service should feel present when needed and almost invisible when it is not.",
  },
] as const;

export function AboutStory() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section
      id="about"
      aria-labelledby="about-story-title"
      className="
        relative
        overflow-hidden
        bg-bone
        text-charcoal
      "
    >
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          -right-32
          top-20
          size-[320px]
          rounded-full
          bg-coral-stone/16
          blur-[110px]
          sm:size-[400px]
        "
      />

      <Container
        size="wide"
        className="
          relative
          py-12
          sm:py-14
          lg:py-16
          xl:py-18
        "
      >
        {/* Intro */}
        <motion.div
          className="
            grid
            gap-8
            lg:grid-cols-[0.42fr_1fr]
            lg:gap-16
            xl:grid-cols-[0.42fr_1fr]
            xl:gap-24
          "
          initial={
            prefersReducedMotion
              ? false
              : {
                  opacity: 0,
                  y: 18,
                }
          }
          whileInView={
            prefersReducedMotion
              ? undefined
              : {
                  opacity: 1,
                  y: 0,
                }
          }
          viewport={{
            once: true,
            amount: 0.2,
          }}
          transition={{
            duration: prefersReducedMotion ? 0 : 0.65,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <div>
            <p
              className="
                text-[9px]
                font-medium
                uppercase
                tracking-[0.28em]
                text-muted/85
                sm:text-[10px]
              "
            >
              About Baharia
            </p>

            <div
              aria-hidden="true"
              className="
                mt-5
                h-px
                w-9
                bg-brass
              "
            />
          </div>

          <div className="max-w-4xl">
            <h2
              id="about-story-title"
              className="
                font-display
                text-[clamp(3rem,5.6vw,6rem)]
                leading-[0.92]
                tracking-[-0.045em]
              "
            >
              Shaped by place.
            </h2>

            <p
              className="
                mt-6
                max-w-2xl
                text-base
                leading-7
                text-muted
                sm:mt-7
                sm:text-lg
                sm:leading-8
              "
            >
              Baharia was imagined as a quieter kind of
              coastal retreat — one where architecture,
              landscape, and hospitality are allowed to
              speak in the same language.
            </p>
          </div>
        </motion.div>

        {/* Pull quote */}
        <motion.div
          className="
            mt-12
            border-y
            border-charcoal/10
            py-10
            sm:mt-14
            sm:py-12
            lg:mt-16
            lg:py-14
          "
          initial={
            prefersReducedMotion
              ? false
              : {
                  opacity: 0,
                  y: 16,
                }
          }
          whileInView={
            prefersReducedMotion
              ? undefined
              : {
                  opacity: 1,
                  y: 0,
                }
          }
          viewport={{
            once: true,
            amount: 0.18,
          }}
          transition={{
            duration: prefersReducedMotion ? 0 : 0.7,
            delay: prefersReducedMotion ? 0 : 0.05,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <div
            className="
              grid
              gap-6
              lg:grid-cols-[0.42fr_1fr]
              lg:gap-16
              xl:gap-24
            "
          >
            <p
              className="
                text-[9px]
                font-medium
                uppercase
                tracking-[0.24em]
                text-muted/70
              "
            >
              Our philosophy
            </p>

            <blockquote
              className="
                max-w-4xl
                font-display
                text-[clamp(2rem,4vw,4.3rem)]
                leading-[0.98]
                tracking-[-0.035em]
              "
            >
              “A place should not compete with the landscape.
              It should make you notice it.”
            </blockquote>
          </div>
        </motion.div>

        {/* Principles */}
        <div
          className="
            mt-10
            grid
            gap-px
            overflow-hidden
            border-y
            border-charcoal/10
            bg-charcoal/10
            sm:mt-12
            lg:grid-cols-3
          "
        >
          {principles.map((principle, index) => (
            <motion.article
              key={principle.number}
              className="
                bg-bone
                px-5
                py-6
                sm:px-7
                sm:py-8
                lg:px-8
                lg:py-9
                xl:px-10
              "
              initial={
                prefersReducedMotion
                  ? false
                  : {
                      opacity: 0,
                      y: 14,
                    }
              }
              whileInView={
                prefersReducedMotion
                  ? undefined
                  : {
                      opacity: 1,
                      y: 0,
                    }
              }
              viewport={{
                once: true,
                amount: 0.18,
              }}
              transition={{
                duration: prefersReducedMotion ? 0 : 0.55,
                delay: prefersReducedMotion
                  ? 0
                  : index * 0.07,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <div className="flex items-start justify-between gap-6">
                <span
                  className="
                    text-[9px]
                    font-medium
                    uppercase
                    tracking-[0.2em]
                    text-brass
                  "
                >
                  {principle.number}
                </span>

                <span
                  aria-hidden="true"
                  className="
                    mt-1
                    h-px
                    w-8
                    bg-charcoal/12
                  "
                />
              </div>

              <h3
                className="
                  mt-7
                  font-display
                  text-[clamp(1.8rem,2.5vw,2.6rem)]
                  leading-[0.96]
                  tracking-[-0.03em]
                "
              >
                {principle.title}
              </h3>

              <p
                className="
                  mt-4
                  max-w-sm
                  text-sm
                  leading-6
                  text-muted
                "
              >
                {principle.description}
              </p>
            </motion.article>
          ))}
        </div>

        {/* Closing line */}
        <motion.div
          className="
            mt-8
            flex
            items-center
            gap-4
            text-[9px]
            font-medium
            uppercase
            tracking-[0.22em]
            text-muted/65
            sm:mt-10
          "
          initial={
            prefersReducedMotion
              ? false
              : {
                  opacity: 0,
                }
          }
          whileInView={
            prefersReducedMotion
              ? undefined
              : {
                  opacity: 1,
                }
          }
          viewport={{
            once: true,
          }}
          transition={{
            duration: prefersReducedMotion ? 0 : 0.6,
          }}
        >
          <span className="h-px w-8 bg-brass" />
          <span>Coast · Stillness · Considered living</span>
        </motion.div>
      </Container>
    </section>
  );
}