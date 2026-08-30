"use client";

import Image from "next/image";
import {
  motion,
  usePageInView,
  useReducedMotion,
} from "motion/react";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

type Scene = {
  id: string;
  label: string;
  src: string;
  left: string;
  top: string;
  width: string;
  height: string;
  rotate: number;
  objectPosition: string;
};

const scenes: Scene[] = [
  {
    id: "sky",
    label: "01",
    src: "/sky.jpeg",
    left: "0%",
    top: "13%",
    width: "28%",
    height: "74%",
    rotate: -1.5,
    objectPosition: "center 42%",
  },
  {
    id: "sea",
    label: "02",
    src: "/sea.jpeg",
    left: "18%",
    top: "5%",
    width: "28%",
    height: "82%",
    rotate: -0.75,
    objectPosition: "center 48%",
  },
  {
    id: "villa1",
    label: "03",
    src: "/villa1.jpeg",
    left: "36%",
    top: "10%",
    width: "28%",
    height: "80%",
    rotate: 0,
    objectPosition: "center 48%",
  },
  {
    id: "villa2",
    label: "04",
    src: "/villa2.jpeg",
    left: "54%",
    top: "3%",
    width: "28%",
    height: "84%",
    rotate: 0.75,
    objectPosition: "center 48%",
  },
  {
    id: "door",
    label: "05",
    src: "/door.jpeg",
    left: "72%",
    top: "14%",
    width: "28%",
    height: "72%",
    rotate: 1.5,
    objectPosition: "center 50%",
  },
];

const AUTO_ADVANCE_MS = 5000;

export function HeroVisual() {
  const prefersReducedMotion = useReducedMotion();
  const isPageVisible = usePageInView();

  const [activeScene, setActiveScene] = useState("villa1");
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (
      isPaused ||
      prefersReducedMotion ||
      !isPageVisible
    ) {
      return;
    }

    const timer = window.setInterval(() => {
      setActiveScene((current) => {
        const currentIndex = scenes.findIndex(
          (scene) => scene.id === current,
        );

        const nextIndex =
          currentIndex === -1 ||
          currentIndex === scenes.length - 1
            ? 0
            : currentIndex + 1;

        return scenes[nextIndex].id;
      });
    }, AUTO_ADVANCE_MS);

    return () => {
      window.clearInterval(timer);
    };
  }, [
    isPaused,
    prefersReducedMotion,
    isPageVisible,
  ]);

  return (
    <motion.div
      className="
        relative
        h-[300px]
        w-full
        sm:h-[390px]
        md:h-[470px]
        lg:h-[min(68svh,620px)]
        xl:h-[min(70svh,670px)]
      "
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={() => setIsPaused(false)}
      initial={
        prefersReducedMotion
          ? false
          : {
              opacity: 0,
              y: 16,
            }
      }
      animate={{
        opacity: 1,
        y: 0,
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
      {/* Ambient glow */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          left-1/2
          top-1/2
          h-[72%]
          w-[68%]
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          bg-brass/8
          blur-[100px]
        "
      />

      {/* Image strip */}
      <div className="absolute inset-0">
        {scenes.map((scene, index) => {
          const isActive = activeScene === scene.id;

          return (
            <motion.button
              key={scene.id}
              type="button"
              aria-label={`View Baharia scene ${scene.label}`}
              aria-pressed={isActive}
              onClick={() => setActiveScene(scene.id)}
              onMouseEnter={() =>
                setActiveScene(scene.id)
              }
              onFocus={() =>
                setActiveScene(scene.id)
              }
              className={cn(
                "group absolute overflow-hidden",
                "border border-bone/15",
                "bg-deep-indigo",
                "text-left",
                "shadow-[0_20px_50px_rgb(0_0_0_/_0.30)]",
                "focus-visible:outline-2",
                "focus-visible:outline-offset-4",
                "focus-visible:outline-brass",
              )}
              style={{
                left: scene.left,
                top: scene.top,
                width: scene.width,
                height: scene.height,
                transform: `rotate(${scene.rotate}deg)`,
                zIndex: isActive ? 30 : 10,
              }}
              initial={
                prefersReducedMotion
                  ? false
                  : {
                      opacity: 0,
                      y: 12,
                      scale: 0.99,
                    }
              }
              animate={{
                opacity: 1,
                y: isActive ? -5 : 0,
                scale: isActive ? 1.045 : 1,
              }}
              transition={
                prefersReducedMotion
                  ? {
                      duration: 0,
                    }
                  : {
                      duration: 0.55,
                      delay: index * 0.045,
                      ease: [0.22, 1, 0.36, 1],
                    }
              }
              whileHover={
                prefersReducedMotion
                  ? undefined
                  : {
                      scale: isActive
                        ? 1.052
                        : 1.012,
                      transition: {
                        duration: 0.25,
                        ease: [0.22, 1, 0.36, 1],
                      },
                    }
              }
              whileTap={
                prefersReducedMotion
                  ? undefined
                  : {
                      scale: isActive
                        ? 1.038
                        : 1.005,
                    }
              }
            >
              <Image
                src={scene.src}
                alt=""
                fill
                loading={index === 2 ? "eager" : "lazy"}
                fetchPriority={
                  index === 2 ? "high" : "auto"
                }
                sizes="(max-width: 639px) 28vw, (max-width: 1023px) 23vw, (max-width: 1535px) 18vw, 17vw"
                className="
                  object-cover
                  transition-transform
                  duration-700
                  ease-[var(--ease-editorial)]
                  group-hover:scale-[1.025]
                "
                style={{
                  objectPosition:
                    scene.objectPosition,
                  filter:
                    "brightness(0.88) contrast(1.08) saturate(0.9)",
                }}
              />

              {/* Cinematic color grade */}
              <span
                aria-hidden="true"
                className="
                  pointer-events-none
                  absolute
                  inset-0
                  bg-[linear-gradient(180deg,rgb(27_42_74_/_0.04)_0%,transparent_42%,rgb(0_0_0_/_0.18)_100%)]
                "
              />

              {/* Warm highlight */}
              <span
                aria-hidden="true"
                className="
                  pointer-events-none
                  absolute
                  inset-0
                  bg-[linear-gradient(135deg,rgb(232_212_192_/_0.07)_0%,transparent_48%)]
                "
              />

              {/* Subtle vignette */}
              <span
                aria-hidden="true"
                className="
                  pointer-events-none
                  absolute
                  inset-0
                  shadow-[inset_0_0_40px_rgb(0_0_0_/_0.16)]
                "
              />

              {/* Number */}
              <span
                className="
                  absolute
                  left-3
                  top-3
                  z-10
                  text-[9px]
                  font-medium
                  tracking-[0.2em]
                  text-bone/85
                  sm:left-4
                  sm:top-4
                "
              >
                {scene.label}
              </span>

              {/* Active marker */}
              <motion.span
                aria-hidden="true"
                className="
                  absolute
                  bottom-3
                  left-3
                  z-10
                  h-px
                  bg-brass
                  sm:bottom-4
                  sm:left-4
                "
                animate={{
                  width: isActive ? 32 : 12,
                  opacity: isActive ? 1 : 0.5,
                }}
                transition={{
                  duration: prefersReducedMotion
                    ? 0
                    : 0.3,
                  ease: [0.22, 1, 0.36, 1],
                }}
              />
            </motion.button>
          );
        })}
      </div>

      {/* Cinematic edge treatment */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          inset-0
          bg-[linear-gradient(90deg,rgb(27_42_74_/_0.14)_0%,transparent_16%,transparent_84%,rgb(27_42_74_/_0.16)_100%)]
        "
      />

      {/* Overall vignette */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          inset-0
          bg-[radial-gradient(circle_at_center,transparent_52%,rgb(0_0_0_/_0.20)_100%)]
        "
      />

      {/* Sequence indicator */}
      <div
        className="
          absolute
          bottom-0
          right-0
          z-40
          flex
          items-center
          gap-3
          text-[9px]
          uppercase
          tracking-[0.24em]
          text-bone/45
        "
      >
        <span>Baharia journey</span>

        <span
          aria-hidden="true"
          className="h-px w-8 bg-bone/20"
        />
      </div>
    </motion.div>
  );
}