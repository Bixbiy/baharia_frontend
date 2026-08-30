"use client";

import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "motion/react";
import { useEffect, useState } from "react";

import { Container } from "@/components/ui";
import { cn } from "@/lib/utils";

type Testimonial = {
  id: string;
  quote: string;
  guest: string;
  detail: string;
};

const testimonials: Testimonial[] = [
  {
    id: "01",
    quote:
      "The kind of place that makes you forget to check the time.",
    guest: "Guest note",
    detail: "A slower stay, beautifully considered.",
  },
  {
    id: "02",
    quote:
      "Everything felt quietly intentional — nothing asked for attention, yet everything deserved it.",
    guest: "Guest note",
    detail: "Architecture, service, and stillness.",
  },
  {
    id: "03",
    quote:
      "We came for the view and stayed for the feeling of being completely unhurried.",
    guest: "Guest note",
    detail: "A different rhythm of living.",
  },
];

const AUTO_ADVANCE_MS = 4200;

export function SocialProof() {
  const prefersReducedMotion = useReducedMotion();

  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion || isPaused) {
      return;
    }

    const timer = window.setInterval(() => {
      setActiveIndex((current) =>
        current === testimonials.length - 1
          ? 0
          : current + 1,
      );
    }, AUTO_ADVANCE_MS);

    return () => {
      window.clearInterval(timer);
    };
  }, [isPaused, prefersReducedMotion]);

  const activeTestimonial = testimonials[activeIndex];

  return (
    <section
      id="social-proof"
      aria-labelledby="social-proof-title"
      className="
        relative
        overflow-hidden
        bg-charcoal
        text-bone
      "
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={() => setIsPaused(false)}
    >
      {/* =====================================================
          Ambient visual field
          ===================================================== */}

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          left-1/2
          top-1/2
          size-[420px]
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          bg-deep-indigo/10
          blur-[100px]
          sm:size-[520px]
        "
      />

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          inset-0
          bg-[radial-gradient(circle_at_center,transparent_25%,rgb(0_0_0_/_0.28)_100%)]
        "
      />

      <Container
        size="wide"
        className="
          relative
          px-6
          sm:px-8
          lg:px-12
          xl:px-16
        "
      >
        <div
          className="
            relative
            min-h-[380px]
            overflow-hidden
            sm:min-h-[420px]
            lg:min-h-[460px]
          "
        >
          {/* =================================================
              Decorative rings
              ================================================= */}

          <motion.div
            aria-hidden="true"
            className="
              pointer-events-none
              absolute
              left-1/2
              top-1/2
              size-[240px]
              -translate-x-1/2
              -translate-y-1/2
              rounded-full
              border
              border-bone/8
              sm:size-[300px]
              lg:size-[340px]
            "
            animate={
              prefersReducedMotion
                ? undefined
                : {
                    scale: [1, 1.025, 1],
                    opacity: [0.5, 0.8, 0.5],
                  }
            }
            transition={
              prefersReducedMotion
                ? undefined
                : {
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }
            }
          />

          <div
            aria-hidden="true"
            className="
              pointer-events-none
              absolute
              left-1/2
              top-1/2
              size-[150px]
              -translate-x-1/2
              -translate-y-1/2
              rounded-full
              border
              border-brass/20
              sm:size-[190px]
            "
          />

          {/* =================================================
              Section label
              ================================================= */}

          <div
            className="
              absolute
              left-0
              top-8
              z-20
              flex
              items-center
              gap-3
              text-[9px]
              font-medium
              uppercase
              tracking-[0.28em]
              text-bone/70
              sm:top-10
            "
          >
            <span>Guest signal</span>

            <span
              aria-hidden="true"
              className="h-px w-8 bg-sand"
            />
          </div>

          {/* =================================================
              Side signals
              ================================================= */}

          <div
            aria-hidden="true"
            className="
              absolute
              left-0
              top-1/2
              hidden
              -translate-y-1/2
              flex-col
              gap-10
              lg:flex
            "
          >
            {testimonials.map((item, index) => {
              const distance = Math.abs(index - activeIndex);

              return (
                <motion.div
                  key={`left-${item.id}`}
                  animate={{
                    opacity:
                      index === activeIndex
                        ? 1
                        : 0.22,
                    x:
                      index === activeIndex
                        ? 0
                        : -8,
                  }}
                  transition={{
                    duration: prefersReducedMotion
                      ? 0
                      : 0.45,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className={cn(
                    "flex items-center gap-4",
                    distance === 2 && "opacity-0",
                  )}
                >
                  <span
                    className="
                      text-[9px]
                      tracking-[0.22em]
                      text-sand
                    "
                  >
                    {item.id}
                  </span>

                  <span className="h-px w-8 bg-sand" />
                </motion.div>
              );
            })}
          </div>

          <div
            aria-hidden="true"
            className="
              absolute
              right-0
              top-1/2
              hidden
              -translate-y-1/2
              flex-col
              items-end
              gap-10
              lg:flex
            "
          >
            {testimonials.map((item, index) => (
              <motion.div
                key={`right-${item.id}`}
                animate={{
                  opacity:
                    index === activeIndex
                      ? 1
                      : 0.22,
                  x:
                    index === activeIndex
                      ? 0
                      : 8,
                }}
                transition={{
                  duration: prefersReducedMotion
                    ? 0
                    : 0.45,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="
                  flex
                  items-center
                  gap-4
                "
              >
                <span className="h-px w-8 bg-sand" />

                <span
                  className="
                    text-[9px]
                    tracking-[0.22em]
                    text-bone/60
                  "
                >
                  {item.id}
                </span>
              </motion.div>
            ))}
          </div>

          {/* =================================================
              Main testimonial
              ================================================= */}

          <div
            id="social-proof-title"
            className="
              absolute
              inset-x-0
              top-1/2
              z-10
              mx-auto
              max-w-[800px]
              -translate-y-1/2
              px-6
              text-center
              sm:px-10
            "
          >
            <p
              className="
                text-[8px]
                font-medium
                uppercase
                tracking-[0.28em]
                text-sand
                sm:text-[9px]
              "
            >
              What stays with you
            </p>

            <div className="relative mt-7 min-h-[120px] sm:min-h-[145px] lg:min-h-[165px]">
              <AnimatePresence
                mode="wait"
                initial={false}
              >
                <motion.blockquote
                  key={activeTestimonial.id}
                  initial={
                    prefersReducedMotion
                      ? { opacity: 1 }
                      : {
                          opacity: 0,
                          y: 14,
                        }
                  }
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  exit={
                    prefersReducedMotion
                      ? { opacity: 0 }
                      : {
                          opacity: 0,
                          y: -10,
                        }
                  }
                  transition={{
                    duration: prefersReducedMotion
                      ? 0
                      : 0.6,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="
                    absolute
                    inset-x-0
                    top-0
                    font-display
                    text-[clamp(2rem,4vw,4rem)]
                    leading-[0.98]
                    tracking-[-0.035em]
                    text-brass
                  "
                >
                  “{activeTestimonial.quote}”
                </motion.blockquote>
              </AnimatePresence>
            </div>

            <AnimatePresence
              mode="wait"
              initial={false}
            >
              <motion.div
                key={`${activeTestimonial.id}-meta`}
                initial={
                  prefersReducedMotion
                    ? { opacity: 1 }
                    : {
                        opacity: 0,
                        y: 6,
                      }
                }
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                }}
                transition={{
                  duration: prefersReducedMotion
                    ? 0
                    : 0.4,
                }}
                className="
                  flex
                  flex-col
                  items-center
                  gap-1
                  text-[9px]
                  uppercase
                  tracking-[0.18em]
                  text-bone/65
                "
              >
                <span>{activeTestimonial.guest}</span>

                <span className="text-bone/45">
                  {activeTestimonial.detail}
                </span>
              </motion.div>
            </AnimatePresence>

            {/* Progress indicators */}
            <div
              className="
                mt-8
                flex
                items-center
                justify-center
                gap-2
              "
            >
              {testimonials.map((item, index) => {
                const isActive =
                  index === activeIndex;

                return (
                  <button
                    key={item.id}
                    type="button"
                    aria-label={`Show testimonial ${item.id}`}
                    aria-pressed={isActive}
                    onClick={() =>
                      setActiveIndex(index)
                    }
                    className="
                      flex
                      h-5
                      w-6
                      items-center
                      justify-center
                    "
                  >
                    <span
                      className={cn(
                        "h-px transition-all duration-500",
                        isActive
                          ? "w-6 bg-brass"
                          : "w-2 bg-bone/25 hover:w-4 hover:bg-bone/50",
                      )}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* =================================================
              Corner metadata
              ================================================= */}

          <div
            aria-hidden="true"
            className="
              absolute
              bottom-8
              left-0
              hidden
              text-[8px]
              uppercase
              tracking-[0.22em]
              text-bone/25
              sm:block
            "
          >
            A stay remembered
          </div>

          <div
            aria-hidden="true"
            className="
              absolute
              bottom-8
              right-0
              hidden
              text-[8px]
              uppercase
              tracking-[0.22em]
              text-bone/25
              sm:block
            "
          >
            Baharia
          </div>
        </div>
      </Container>
    </section>
  );
}