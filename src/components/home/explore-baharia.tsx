"use client";

import Image from "next/image";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "motion/react";
import { useCallback, useEffect, useState } from "react";
import { Container } from "@/components/ui";
import { cn } from "@/lib/utils";

type Experience = {
  id: "dining" | "wellness" | "spa";
  number: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
};

const experiences: Experience[] = [
  {
    id: "dining",
    number: "01",
    title: "Dining",
    description:
      "Seasonal flavours, thoughtful service, and long evenings shaped around the rhythm of Baharia.",
    image: "/dinining.jpeg",
    imageAlt: "Dining experience at Baharia",
  },
  {
    id: "wellness",
    number: "02",
    title: "Wellness",
    description:
      "Quiet rituals and restorative treatments designed around time, stillness, and the surrounding landscape.",
    image: "/wellness.jpeg",
    imageAlt: "Wellness experience at Baharia",
  },
  {
    id: "spa",
    number: "03",
    title: "Spa",
    description:
      "A private atmosphere of warmth, stillness, and considered care.",
    image: "/spa.jpeg",
    imageAlt: "Spa experience at Baharia",
  },
];

const AUTO_ADVANCE_MS = 4500;

const transitionEase = [0.22, 1, 0.36, 1] as const;

export function ExploreBaharia() {
  const prefersReducedMotion = useReducedMotion();

  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progressKey, setProgressKey] = useState(0);

  const activeExperience = experiences[activeIndex];

  const changeExperience = useCallback((index: number) => {
    setActiveIndex(index);
    setProgressKey((current) => current + 1);
  }, []);

  const goToNext = useCallback(() => {
    setActiveIndex((current) =>
      current === experiences.length - 1 ? 0 : current + 1,
    );
    setProgressKey((current) => current + 1);
  }, []);

  const goToPrevious = useCallback(() => {
    setActiveIndex((current) =>
      current === 0 ? experiences.length - 1 : current - 1,
    );
    setProgressKey((current) => current + 1);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion || isPaused) {
      return;
    }

    const timer = window.setInterval(
      goToNext,
      AUTO_ADVANCE_MS,
    );

    return () => {
      window.clearInterval(timer);
    };
  }, [goToNext, isPaused, prefersReducedMotion]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") {
        goToNext();
      }

      if (event.key === "ArrowLeft") {
        goToPrevious();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [goToNext, goToPrevious]);

  return (
    <section
      id="experiences"
      aria-labelledby="explore-baharia-title"
      className="
        relative
        overflow-hidden
        bg-deep-indigo
        text-bone
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
        {/* Section heading */}
        <motion.div
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
            amount: 0.25,
          }}
          transition={{
            duration: prefersReducedMotion ? 0 : 0.65,
            ease: transitionEase,
          }}
          className="
            grid
            gap-5
            md:grid-cols-[minmax(0,1fr)_minmax(280px,0.45fr)]
            md:items-end
            md:gap-10
            lg:gap-16
          "
        >
          <div>
            <p
              className="
                text-[9px]
                font-medium
                uppercase
                tracking-[0.28em]
                text-bone/70
                sm:text-[10px]
              "
            >
              Explore Baharia
            </p>

            <h2
              id="explore-baharia-title"
              className="
                mt-4
                max-w-3xl
                font-display
                text-[clamp(2.8rem,5vw,5.2rem)]
                leading-[0.92]
                tracking-[-0.045em]
              "
            >
              Discover a slower
              <span className="block text-bone/58">
                rhythm.
              </span>
            </h2>
          </div>

          <p
            className="
              max-w-md
              text-sm
              leading-6
              text-bone/50
              md:text-right
            "
          >
            Dining, wellness, and spa rituals designed
            around time and place.
          </p>
        </motion.div>

        {/* Experience composition */}
        <motion.div
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
            amount: 0.15,
          }}
          transition={{
            duration: prefersReducedMotion ? 0 : 0.7,
            ease: transitionEase,
          }}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onFocusCapture={() => setIsPaused(true)}
          onBlurCapture={() => setIsPaused(false)}
          className="mt-8 lg:mt-10"
        >
          <div
            className="
              grid
              gap-8
              lg:grid-cols-[minmax(0,1.7fr)_minmax(300px,0.62fr)]
              lg:items-center
              lg:gap-12
              xl:grid-cols-[minmax(0,1.75fr)_minmax(320px,0.55fr)]
              xl:gap-16
            "
          >
            {/* Active image */}
            <div
              className="
                relative
                aspect-[16/10]
                overflow-hidden
                bg-charcoal
                sm:aspect-[16/9]
              "
            >
              <AnimatePresence
                initial={false}
                mode="wait"
              >
                <motion.div
                  key={activeExperience.id}
                  className="absolute inset-0"
                  initial={
                    prefersReducedMotion
                      ? {
                          opacity: 1,
                        }
                      : {
                          opacity: 0,
                          scale: 1.025,
                        }
                  }
                  animate={{
                    opacity: 1,
                    scale: 1,
                  }}
                  exit={
                    prefersReducedMotion
                      ? {
                          opacity: 0,
                        }
                      : {
                          opacity: 0,
                          scale: 1.01,
                        }
                  }
                  transition={{
                    duration: prefersReducedMotion ? 0 : 0.7,
                    ease: transitionEase,
                  }}
                >
                  <Image
                    src={activeExperience.image}
                    alt={activeExperience.imageAlt}
                    fill
                    loading="lazy"
                    sizes="(max-width: 1023px) 100vw, 68vw"
                    quality={82}
                    className="object-cover"
                  />

                  <div
                    aria-hidden="true"
                    className="
                      pointer-events-none
                      absolute
                      inset-0
                      bg-gradient-to-t
                      from-black/35
                      via-transparent
                      to-transparent
                    "
                  />

                  <div
                    aria-hidden="true"
                    className="
                      pointer-events-none
                      absolute
                      inset-4
                      border
                      border-bone/10
                    "
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Active content + controls */}
            <div className="flex min-w-0 flex-col">
              <AnimatePresence
                initial={false}
                mode="wait"
              >
                <motion.div
                  key={activeExperience.id}
                  initial={
                    prefersReducedMotion
                      ? {
                          opacity: 1,
                          y: 0,
                        }
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
                      ? {
                          opacity: 0,
                        }
                      : {
                          opacity: 0,
                          y: -8,
                        }
                  }
                  transition={{
                    duration: prefersReducedMotion ? 0 : 0.5,
                    ease: transitionEase,
                  }}
                >
                  <div
                    className="
                      flex
                      items-center
                      gap-3
                      text-[9px]
                      font-medium
                      uppercase
                      tracking-[0.24em]
                      text-bone/38
                    "
                  >
                    <span>{activeExperience.number}</span>

                    <span
                      aria-hidden="true"
                      className="h-px w-8 bg-brass/70"
                    />

                    <span>Experience</span>
                  </div>

                  <h3
                    className="
                      mt-5
                      font-display
                      text-[clamp(3rem,5vw,5rem)]
                      leading-none
                      tracking-[-0.045em]
                    "
                  >
                    {activeExperience.title}
                  </h3>

                  <p
                    className="
                      mt-5
                      max-w-md
                      text-sm
                      leading-6
                      text-bone/55
                      sm:text-base
                      sm:leading-7
                    "
                  >
                    {activeExperience.description}
                  </p>
                </motion.div>
              </AnimatePresence>

              {/* Controls */}
              <div className="mt-10 sm:mt-12">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    aria-label="Previous experience"
                    onClick={goToPrevious}
                    className="
                      flex
                      size-6
                      items-center
                      justify-center
                     
                      border
                      border-bone/18
                      text-xs
                      text-bone/55
                      transition-all
                      duration-300
                      hover:border-brass
                      hover:text-brass
                      focus-visible:outline-none
                      focus-visible:ring-1
                      focus-visible:ring-brass
                    "
                  >
                    ←
                  </button>

                  <button
                    type="button"
                    aria-label="Next experience"
                    onClick={goToNext}
                    className="
                      flex
                      size-6
                      items-center
                      justify-center
                      
                      border
                      border-bone/18
                      text-xs
                      text-bone/55
                      transition-all
                      duration-300
                      hover:border-brass
                      hover:text-brass
                      focus-visible:outline-none
                      focus-visible:ring-1
                      focus-visible:ring-brass
                    "
                  >
                    →
                  </button>

                  <span className="ml-2 text-[9px] tracking-[0.18em] text-bone/28">
                    {String(activeIndex + 1).padStart(2, "0")}
                    {" "}
                    / 03
                  </span>
                </div>

                {/* Progress */}
                <div className="mt-6">
                  <div
                    className="
                      h-px
                      w-full
                      overflow-hidden
                      bg-bone/10
                    "
                    aria-hidden="true"
                  >
                    {!prefersReducedMotion && (
                      <motion.div
                        key={progressKey}
                        initial={{
                          width: "0%",
                        }}
                        animate={{
                          width: isPaused
                            ? "0%"
                            : "100%",
                        }}
                        transition={{
                          duration: isPaused
                            ? 0
                            : AUTO_ADVANCE_MS / 1000,
                          ease: "linear",
                        }}
                        className="h-full bg-brass"
                      />
                    )}
                  </div>

                  <div
                    className="
                      mt-3
                      flex
                      items-center
                      justify-between
                      text-[8px]
                      uppercase
                      tracking-[0.22em]
                      text-bone/25
                    "
                  >
                    <span>
                      {isPaused
                        ? "Paused"
                        : "Auto discovering"}
                    </span>

                    <span>
                      4.5 sec
                    </span>
                  </div>
                </div>
              </div>

              {/* Minimal slide indicators */}
              <div className="mt-7 flex items-center gap-3">
                {experiences.map(
                  (experience, index) => {
                    const isActive =
                      index === activeIndex;

                    return (
                      <button
                        key={experience.id}
                        type="button"
                        aria-label={`Go to ${experience.title}`}
                        aria-pressed={isActive}
                        onClick={() =>
                          changeExperience(index)
                        }
                        className="
                          flex
                          items-center
                          gap-2
                          focus-visible:outline-none
                          focus-visible:ring-1
                          focus-visible:ring-brass
                        "
                      >
                        <span
                          className={cn(
                            "block h-px transition-all duration-500",
                            isActive
                              ? "w-8 bg-brass"
                              : "w-4 bg-bone/15",
                          )}
                        />

                        <span
                          className={cn(
                            "text-[8px] tracking-[0.16em]",
                            isActive
                              ? "text-brass"
                              : "text-bone/22",
                          )}
                        >
                          {experience.number}
                        </span>
                      </button>
                    );
                  },
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}