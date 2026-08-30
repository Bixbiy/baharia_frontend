"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";

import { Container } from "@/components/ui";

type Room = {
  id: string;
  name: string;
  category: string;
  image: string;
  alt: string;
  description: string;
  href: string;
};

const rooms: Room[] = [
  {
    id: "signature",
    name: "The Signature",
    category: "Signature Suite",
    image: "/signature.jpeg",
    alt: "Baharia Signature Suite",
    description:
      "Warm materials, natural light, and a quiet relationship with the coast.",
    href: "/booking",
  },
  {
    id: "coastal",
    name: "The Coastal",
    category: "Coastal Suite",
    image: "/coastal.jpeg",
    alt: "Baharia Coastal Suite",
    description:
      "A softer, more intimate retreat opening toward the surrounding landscape.",
    href: "/booking",
  },
  {
    id: "ocean",
    name: "The Ocean",
    category: "Ocean Residence",
    image: "/ocean.jpeg",
    alt: "Baharia Ocean Residence",
    description:
      "More space, wider horizons, and an uninterrupted sense of privacy.",
    href: "/booking",
  },
];

export function RoomsTeaser() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section
      id="rooms"
      aria-labelledby="rooms-title"
      className="
        relative
        overflow-hidden
        bg-sand
        text-charcoal
      "
    >
      {/* Background atmosphere */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          right-[-14%]
          top-[12%]
          h-[480px]
          w-[480px]
          rounded-full
          bg-coral-stone/20
          blur-[130px]
        "
      />

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
        {/* Section introduction */}
        <motion.div
          className="
            grid
            gap-8
            lg:grid-cols-[0.42fr_1fr]
            lg:gap-16
            xl:gap-24
          "
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
            amount: 0.2,
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
              The rooms
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

          <div className="max-w-3xl">
            <h2
              id="rooms-title"
              className="
                font-display
                text-[clamp(3rem,5.7vw,6rem)]
                leading-[0.92]
                tracking-[-0.045em]
              "
            >
              A quieter way
              <span className="block text-deep-indigo">
                to stay.
              </span>
            </h2>

            <p
              className="
                mt-7
                max-w-2xl
                text-base
                leading-7
                text-muted/95
                sm:mt-8
                sm:text-lg
                sm:leading-8
              "
            >
              Every room is shaped around natural light,
              tactile materials, and an uninterrupted
              relationship with the coast.
            </p>
          </div>
        </motion.div>

        {/* Asymmetric room composition */}
        <div
          className="
            mt-14
            grid
            gap-6
            md:mt-16
            lg:mt-20
            lg:grid-cols-[1.45fr_0.75fr]
            lg:gap-8
            xl:gap-10
          "
        >
          <RoomFeatureCard
            room={rooms[0]}
            prefersReducedMotion={Boolean(
              prefersReducedMotion,
            )}
          />

          <div className="grid gap-6 lg:grid-rows-2 lg:gap-8">
            <RoomCompactCard
              room={rooms[1]}
              prefersReducedMotion={Boolean(
                prefersReducedMotion,
              )}
            />

            <RoomCompactCard
              room={rooms[2]}
              prefersReducedMotion={Boolean(
                prefersReducedMotion,
              )}
            />
          </div>
        </div>

        {/* Supporting footer */}
        <motion.div
          className="
            mt-10
            flex
            flex-col
            gap-5
            border-t
            border-charcoal/12
            pt-6
            sm:mt-12
            sm:flex-row
            sm:items-center
            sm:justify-between
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
            amount: 0.2,
          }}
          transition={{
            duration: prefersReducedMotion ? 0 : 0.6,
            delay: prefersReducedMotion ? 0 : 0.15,
          }}
        >
          <p
            className="
              max-w-md
              text-[11px]
              uppercase
              tracking-[0.16em]
              text-muted/70
            "
          >
            Three ways to experience Baharia.
          </p>

          <a
            href="#booking"
            className="
              group
              inline-flex
              items-center
              gap-3
              self-start
              text-sm
              font-medium
              text-deep-indigo
              sm:self-auto
            "
          >
            <span>View all rooms</span>

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
        </motion.div>
      </Container>
    </section>
  );
}

function RoomFeatureCard({
  room,
  prefersReducedMotion,
}: {
  room: Room;
  prefersReducedMotion: boolean;
}) {
  return (
    <motion.article
      className="group relative min-w-0"
      initial={
        prefersReducedMotion
          ? false
          : {
              opacity: 0,
              y: 24,
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
        duration: prefersReducedMotion ? 0 : 0.75,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={
        prefersReducedMotion
          ? undefined
          : {
              y: -4,
            }
      }
    >
      <a
        href={room.href}
        className="
          block
          focus-visible:outline-2
          focus-visible:outline-offset-4
          focus-visible:outline-brass
        "
      >
        <div
          className="
            relative
            aspect-[4/5]
            overflow-hidden
            bg-deep-indigo
            sm:aspect-[5/4]
            lg:aspect-[4/5]
            xl:aspect-[5/4]
          "
        >
          <Image
            src={room.image}
            alt={room.alt}
            fill
            preload
            sizes="(max-width: 767px) 100vw, (max-width: 1023px) 100vw, 58vw"
            className="
              object-cover
              transition-transform
              duration-700
              ease-[var(--ease-editorial)]
              group-hover:scale-[1.025]
            "
          />

          <div
            aria-hidden="true"
            className="
              pointer-events-none
              absolute
              inset-0
              bg-[linear-gradient(180deg,transparent_42%,rgb(0_0_0_/_0.60)_100%)]
            "
          />

          <div
            className="
              absolute
              inset-x-6
              bottom-6
              z-10
              sm:inset-x-8
              sm:bottom-8
            "
          >
            <p
              className="
                text-[9px]
                font-medium
                uppercase
                tracking-[0.22em]
                text-bone/70
              "
            >
              {room.category}
            </p>

            <div className="mt-2 flex items-end justify-between gap-5">
              <h3
                className="
                  font-display
                  text-3xl
                  leading-none
                  tracking-[-0.025em]
                  text-bone
                  sm:text-4xl
                "
              >
                {room.name}
              </h3>

              <span
                aria-hidden="true"
                className="
                  flex
                  size-10
                  shrink-0
                  items-center
                  justify-center
                  border
                  border-bone/40
                  text-bone
                  transition-all
                  duration-300
                  ease-[var(--ease-editorial)]
                  group-hover:bg-bone
                  group-hover:text-deep-indigo
                "
              >
                ↗
              </span>
            </div>
          </div>
        </div>

        <div className="mt-5 flex items-start justify-between gap-8">
          <p className="max-w-md text-sm leading-6 text-muted">
            {room.description}
          </p>

          <span
            className="
              hidden
              whitespace-nowrap
              text-[9px]
              uppercase
              tracking-[0.18em]
              text-muted/60
              sm:block
            "
          >
            Discover
          </span>
        </div>
      </a>
    </motion.article>
  );
}

function RoomCompactCard({
  room,
  prefersReducedMotion,
}: {
  room: Room;
  prefersReducedMotion: boolean;
}) {
  return (
    <motion.article
      className="group min-w-0"
      initial={
        prefersReducedMotion
          ? false
          : {
              opacity: 0,
              y: 22,
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
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={
        prefersReducedMotion
          ? undefined
          : {
              y: -3,
            }
      }
    >
      <a
        href={room.href}
        className="
          grid
          grid-cols-[0.9fr_1.1fr]
          gap-5
          focus-visible:outline-2
          focus-visible:outline-offset-4
          focus-visible:outline-brass
          sm:grid-cols-[0.85fr_1.15fr]
          lg:grid-cols-1
          lg:gap-4
        "
      >
        <div
          className="
            relative
            aspect-[4/3]
            overflow-hidden
            bg-deep-indigo
            lg:aspect-[16/10]
          "
        >
          <Image
            src={room.image}
            alt={room.alt}
            fill
            loading="lazy"
            sizes="(max-width: 1023px) 42vw, 32vw"
            className="
              object-cover
              transition-transform
              duration-700
              ease-[var(--ease-editorial)]
              group-hover:scale-[1.035]
            "
          />

          <div
            aria-hidden="true"
            className="
              pointer-events-none
              absolute
              inset-0
              bg-[linear-gradient(180deg,transparent_45%,rgb(0_0_0_/_0.24)_100%)]
            "
          />

          <span
            className="
              absolute
              left-4
              top-4
              text-[9px]
              font-medium
              uppercase
              tracking-[0.2em]
              text-bone/75
            "
          >
            {room.category}
          </span>
        </div>

        <div className="flex min-w-0 flex-col justify-between py-1">
          <div>
            <h3
              className="
                font-display
                text-[clamp(1.8rem,3vw,2.7rem)]
                leading-[0.95]
                tracking-[-0.035em]
              "
            >
              {room.name}
            </h3>

            <p className="mt-4 text-sm leading-6 text-muted">
              {room.description}
            </p>
          </div>

          <div
            className="
              mt-5
              flex
              items-center
              justify-between
              border-t
              border-charcoal/10
              pt-4
            "
          >
            <span
              className="
                text-[9px]
                uppercase
                tracking-[0.18em]
                text-muted/65
              "
            >
              Discover
            </span>

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
          </div>
        </div>
      </a>
    </motion.article>
  );
}