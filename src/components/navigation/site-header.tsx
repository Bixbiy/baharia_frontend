"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

const navigationItems = [
  {
    label: "Rooms",
    href: "#rooms",
  },
  {
    label: "Experiences",
    href: "#experiences",
  },
  {
    label: "Baharia",
    href: "#about",
  },
] as const;

export function SiteHeader() {
  const [hasScrolled, setHasScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 40);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen
      ? "hidden"
      : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const headerScrolled = hasScrolled || menuOpen;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50",
        "transition-all duration-[var(--duration-slow)] ease-[var(--ease-editorial)]",
        headerScrolled
          ? "bg-sand/98 text-deep-indigo shadow-[0_2px_8px_rgb(27_42_74_/_0.08)] backdrop-blur-lg"
          : "bg-transparent text-bone",
      )}
    >
      <div
        className="
          mx-auto
          flex
          h-20
          w-full
          max-w-[1600px]
          items-center
          justify-between
          px-6
          sm:px-8
          lg:px-12
          xl:px-16
        "
      >
        <a
          href="#top"
          className="
            relative
            z-10
            font-display
            text-2xl
            tracking-[-0.03em]
          "
          aria-label="Baharia home"
          onClick={() => setMenuOpen(false)}
        >
          Baharia
        </a>

        <nav
          aria-label="Primary navigation"
          className="
            hidden
            items-center
            gap-8
            lg:flex
          "
        >
          {navigationItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="
                group
                relative
                text-sm
                font-medium
                tracking-[0.02em]
                focus-visible:outline-none
                rounded-[2px]
                px-1
              "
            >
              {item.label}

              <span
                aria-hidden="true"
                className="
                  absolute
                  -bottom-2
                  left-1
                  h-px
                  w-[calc(100%-0.5rem)]
                  origin-left
                  scale-x-0
                  bg-current
                  transition-transform
                  duration-300
                  ease-[var(--ease-editorial)]
                  group-hover:scale-x-100
                  group-focus-visible:scale-x-100
                "
              />
              
              <span
                aria-hidden="true"
                className="
                  absolute
                  inset-y-0
                  inset-x-0
                  rounded-[2px]
                  ring-2
                  ring-offset-2
                  ring-offset-transparent
                  ring-current
                  opacity-0
                  group-focus-visible:opacity-100
                "
              />
            </a>
          ))}

          <a
            href="/booking"
            data-cta="reserve"
            data-location="header-desktop"
            className={cn(
              "inline-flex items-center justify-center rounded-[4px] px-4 py-2.5 min-h-[44px] min-w-[44px] text-[11px] font-semibold uppercase tracking-[0.14em] transition-all duration-300 ease-[var(--ease-editorial)] border",
              headerScrolled
                ? "border-deep-indigo bg-transparent text-deep-indigo hover:bg-deep-indigo/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-sand focus-visible:ring-deep-indigo active:bg-deep-indigo/20"
                : "border-bone bg-transparent text-bone hover:bg-bone/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent focus-visible:ring-bone active:bg-bone/20",
            )}
          >
            Reserve your stay
          </a>
        </nav>

        <button
          type="button"
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          aria-label={
            menuOpen
              ? "Close menu"
              : "Open menu"
          }
          onClick={() =>
            setMenuOpen((current) => !current)
          }
          className="
            relative
            z-10
            flex
            size-10
            flex-col
            items-center
            justify-center
            gap-1.5
            lg:hidden
          "
        >
          <span
            aria-hidden="true"
            className={cn(
              "block h-px w-6 bg-current",
              "transition-transform duration-300",
              menuOpen && "translate-y-1 rotate-45",
            )}
          />

          <span
            aria-hidden="true"
            className={cn(
              "block h-px w-6 bg-current",
              "transition-transform duration-300",
              menuOpen &&
                "-translate-y-1 -rotate-45",
            )}
          />
        </button>
      </div>

      <div
        id="mobile-navigation"
        className={cn(
          "absolute inset-x-0 top-20",
          "origin-top",
          "border-t border-deep-indigo/10",
          "bg-sand",
          "transition-all duration-400",
          "ease-[var(--ease-editorial)]",
          menuOpen
            ? "pointer-events-auto scale-y-100 opacity-100"
            : "pointer-events-none scale-y-0 opacity-0",
        )}
      >
        <nav
          aria-label="Mobile navigation"
          className="flex flex-col px-6 py-8"
        >
          {navigationItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className="
                border-b
                border-charcoal/10
                py-5
                font-display
                text-3xl
              "
            >
              {item.label}
            </a>
          ))}

          <a
            href="/booking"
            onClick={() => setMenuOpen(false)}
            data-cta="reserve"
            data-location="header-mobile"
            className="
              mt-6
              inline-flex
              min-h-12
              items-center
              justify-center
              bg-deep-indigo
              px-6
              text-sm
              font-medium
              text-bone
              rounded-[4px]
              transition-all
              duration-300
              hover:bg-charcoal
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-offset-2
              focus-visible:ring-offset-sand
              focus-visible:ring-bone
            "
          >
            Reserve your stay
          </a>
        </nav>
      </div>
    </header>
  );
}