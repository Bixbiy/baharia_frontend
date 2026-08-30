import { Container } from "@/components/ui";

import { HeroVisual } from "./hero-visual";

export function BahariaHero() {
  return (
    <section
      id="top"
      aria-labelledby="baharia-hero-title"
      className="
        relative
        min-h-svh
        overflow-hidden
        bg-deep-indigo
        text-bone
      "
    >
      {/* Atmospheric background */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          inset-0
          bg-[radial-gradient(circle_at_70%_45%,rgb(47_71_111_/_0.42)_0%,transparent_42%)]
        "
      />

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          inset-x-0
          bottom-0
          h-[35%]
          bg-[linear-gradient(180deg,transparent_0%,rgb(8_15_27_/_0.32)_100%)]
        "
      />

      <Container
        size="wide"
        className="
          relative
          flex
          min-h-svh
          items-center
          pt-32
          pb-16
          sm:pt-40
          sm:pb-20
          lg:pt-32
          lg:pb-16
        "
      >
        <div
          className="
            grid
            w-full
            items-center
            gap-8
            lg:grid-cols-[minmax(300px,0.70fr)_minmax(0,1.30fr)]
            lg:gap-8
            xl:grid-cols-[minmax(340px,0.72fr)_minmax(0,1.28fr)]
            xl:gap-10
          "
        >
          {/* Editorial content */}
          <div
            className="
              relative
              z-30
              max-w-xl
              animate-baharia-fade-in
              lg:pb-4
            "
          >
            <div
              className="
                flex
                items-center
                gap-4
                text-[9px]
                font-medium
                uppercase
                tracking-[0.28em]
                text-bone/75
                sm:text-[10px]
              "
            >
              <span>Baharia</span>

              <span
                aria-hidden="true"
                className="h-px w-8 bg-brass sm:w-9"
              />

              <span>Coastal retreat</span>
            </div>

            <h1
              id="baharia-hero-title"
              className="
                mt-5
                max-w-xl
                font-display
                text-[clamp(3.25rem,6vw,6.4rem)]
                leading-[0.86]
                tracking-[-0.045em]
                text-bone
                sm:mt-8
              "
            >
              From horizon

              <span className="block text-bone/65">
                to home.
              </span>
            </h1>

            <p
              className="
                mt-6
                max-w-md
                text-sm
                leading-6
                text-bone/80
                sm:mt-7
                sm:text-base
                sm:leading-7
                lg:text-lg
                lg:leading-8
              "
            >
              A quiet expression of coastal hospitality,
              shaped by landscape, light, and considered
              detail.
            </p>

            {/* Hero CTA — intentionally only one CTA */}
            <div className="mt-7 sm:mt-8">
              <a
                href="/booking"
                data-cta="reserve"
                data-location="hero"
                className="
                  group
                  inline-flex
                  items-center
                  gap-3
                  text-sm
                  font-medium
                  text-bone
                  focus-visible:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-offset-2
                  focus-visible:ring-offset-deep-indigo
                  focus-visible:ring-bone
                  rounded-[2px]
                  px-1
                  py-1
                  transition-all
                  duration-300
                  hover:text-bone/80
                "
              >
                <span>Reserve your stay</span>

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

            <div
              className="
                mt-7
                hidden
                max-w-sm
                border-t
                border-bone/15
                pt-4
                text-[9px]
                uppercase
                tracking-[0.18em]
                text-bone/55
                sm:block
                lg:mt-8
              "
            >
              A private retreat shaped by coast,
              architecture, and stillness.
            </div>
          </div>

          {/* =================================================
              HERO IMAGE SECTION POSITION

              This is the ONLY place you need to modify if
              you want to move the entire image composition.

              More negative = move UP.
              Less negative = move DOWN.

              Examples:
              lg:-translate-y-4  → up 16px
              lg:-translate-y-8  → up 32px
              lg:-translate-y-12 → up 48px
              lg:-translate-y-16 → up 64px

              Current desktop position:
              lg:-translate-y-8
              xl:-translate-y-10
              ================================================= */}
          <div
            className="
              relative
              z-10
              min-w-0
             sm:-translate-y-5
              md:-translate-y-6
              lg:-translate-y-0
              xl:-translate-y-10
              animate-baharia-fade-in
              [animation-delay:120ms]
             
              lg:-mr-4
              xl:-mr-8
            "
          >
            <HeroVisual />
          </div>
        </div>
      </Container>
    </section>
  );
}