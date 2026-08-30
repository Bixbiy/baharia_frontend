"use client";

import { motion, useReducedMotion } from "motion/react";

import { Container } from "@/components/ui";

export function BrandStatement() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section
      aria-labelledby="brand-statement-title"
      className="
        relative
        overflow-hidden
        bg-bone
        text-charcoal
      "
    >
      {/* Quiet atmospheric field */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          left-1/2
          top-1/2
          h-[520px]
          w-[520px]
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          bg-coral-stone/18
          blur-[120px]
        "
      />

      <Container
        size="reading"
        className="
          relative
          flex
          min-h-[420px]
          items-center
          py-16
          sm:min-h-[480px]
          sm:py-20
          lg:min-h-[520px]
          lg:py-24
          xl:min-h-[560px]
          xl:py-28
        "
      >
        <motion.div
          className="w-full text-center"
          initial={
            prefersReducedMotion
              ? false
              : {
                  opacity: 0,
                  y: 20,
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
            amount: 0.35,
          }}
          transition={
            prefersReducedMotion
              ? {
                  duration: 0,
                }
              : {
                  duration: 0.7,
                  ease: [0.22, 1, 0.36, 1],
                }
          }
        >
          <p
            className="
              text-[9px]
              font-medium
              uppercase
              tracking-[0.3em]
              text-muted
              sm:text-[10px]
            "
          >
            The Baharia philosophy
          </p>

          <div
            aria-hidden="true"
            className="
              mx-auto
              mt-5
              mb-3
              h-[2px]
              w-9
              bg-brass
            "
          />

          <h2
            id="brand-statement-title"
            className="
              mt-6
              font-display
              text-[clamp(2.8rem,5.8vw,6rem)]
              leading-[0.94]
              tracking-[-0.045em]
            "
          >
            <span className="block">
              Less to distract.
            </span>

            <span className="block text-deep-indigo">
              More to remember.
            </span>
          </h2>

          <p
            className="
              mx-auto
              mt-7
              max-w-[560px]
              text-base
              leading-7
              text-muted
              sm:mt-8
              sm:text-lg
              sm:leading-8
            "
          >
            Baharia is shaped around the rare moments when
            architecture, landscape, and hospitality become
            almost indistinguishable.
          </p>

          <div
            className="
              mx-auto
              mt-9
              flex
              items-center
              justify-center
              gap-4
              text-[8px]
              uppercase
              tracking-[0.24em]
              text-muted
              sm:mt-10
              sm:text-[9px]
            "
          >
            <span>Coast</span>

            <span
              aria-hidden="true"
              className="size-1 rounded-full bg-brass"
            />

            <span>Stillness</span>

            <span
              aria-hidden="true"
              className="size-1 rounded-full bg-brass"
            />

            <span>Considered living</span>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}