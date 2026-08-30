"use client";

type GuestSelectorProps = {
  adults: number;
  childCount: number;
  maxAdults: number;
  maxChildren: number;
  onChange: (value: {
    adults: number;
    children: number;
  }) => void;
  open: boolean;
  onToggle: () => void;
};

export function GuestSelector({
  adults,
  childCount,
  maxAdults,
  maxChildren,
  onChange,
  open,
  onToggle,
}: GuestSelectorProps) {
  const summary =
    childCount > 0
      ? `${adults} adults · ${childCount} ${
          childCount === 1
            ? "child"
            : "children"
        }`
      : `${adults} ${
          adults === 1
            ? "adult"
            : "adults"
        }`;

  return (
    <div
      className={[
        "relative w-full",
        open ? "z-[210]" : "z-0",
      ].join(" ")}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-controls="inline-guest-controls"
        onClick={onToggle}
        className="
          group flex min-h-[96px] w-full
          items-center justify-between
          border-l border-bone/10
          px-6 text-left
          transition-colors duration-300
          hover:bg-bone/[0.035]
          lg:min-h-[108px]
        "
      >
        <div className="min-w-0">
          <span
            className="
              block text-[9px]
              font-medium uppercase
              tracking-[0.22em]
              text-bone/70
            "
          >
            Guests
          </span>

          <span
            className="
              mt-2 block truncate
              font-display
              text-[clamp(1.7rem,2.4vw,2.5rem)]
              leading-none
              tracking-[-0.03em]
              text-bone
            "
          >
            {summary}
          </span>

          <span
            className="
              mt-1.5 block
              text-[8.5px] uppercase
              tracking-[0.14em]
              text-bone/50
            "
          >
            {open
              ? "Edit guests"
              : "Select"}
          </span>
        </div>

        <span
          aria-hidden="true"
          className="
            ml-5 flex size-9 shrink-0
            items-center justify-center
            border border-bone/20
            text-lg text-bone/70
            transition-all duration-300
            group-hover:border-bone/40
            group-hover:text-bone
          "
        >
          <span className={open ? "rotate-45 transition-transform" : "transition-transform"}>
            +
          </span>
        </span>
      </button>

      {open ? (
        <div
          id="inline-guest-controls"
          className="absolute left-0 right-0 top-full z-20 border border-charcoal/15 bg-white shadow-[0_22px_50px_rgb(42_38_34_/_0.16)]"
        >
            <div className="grid grid-cols-1">
              <InlineGuestRow
                label="Adults"
                description="13 years and older"
                value={adults}
                minimum={1}
                maximum={maxAdults}
                onDecrease={() =>
                  onChange({
                    adults: Math.max(
                      adults - 1,
                      1,
                    ),
                    children: childCount,
                  })
                }
                onIncrease={() =>
                  onChange({
                    adults: Math.min(adults + 1, maxAdults),
                    children: childCount,
                  })
                }
              />

              <InlineGuestRow
                label="Children"
                description="12 years and younger"
                value={childCount}
                minimum={0}
                maximum={maxChildren}
                onDecrease={() =>
                  onChange({
                    adults,
                    children: Math.max(
                      childCount - 1,
                      0,
                    ),
                  })
                }
                onIncrease={() =>
                  onChange({
                    adults,
                    children: Math.min(childCount + 1, maxChildren),
                  })
                }
              />
            </div>
        </div>
      ) : null}
    </div>
  );
}

function InlineGuestRow({
  label,
  description,
  value,
  minimum,
  maximum,
  onDecrease,
  onIncrease,
}: {
  label: string;
  description: string;
  value: number;
  minimum: number;
  maximum: number;
  onDecrease: () => void;
  onIncrease: () => void;
}) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-t border-bone/10 px-5 py-4 sm:gap-4 sm:px-6">
      <div className="min-w-0">
        <p className="text-sm font-medium text-bone">
          {label}
        </p>

        <p className="mt-1 text-[11px] text-bone/50">
          {description}
        </p>
      </div>

      <div className="flex w-[8.5rem] shrink-0 items-center justify-between rounded-[4px] border border-bone/15 bg-deep-indigo/30 p-1">
        <button
          type="button"
          aria-label={`Decrease ${label}`}
          disabled={value <= minimum}
          onPointerDown={(event) => {
            event.stopPropagation();
            event.preventDefault();
            onDecrease();
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              onDecrease();
            }
          }}
          className="
            flex size-[2.5rem]
            items-center justify-center
            border border-bone/20
            text-lg text-bone/80
            transition-colors duration-200
            hover:border-bone/50
            hover:text-bone
            disabled:cursor-not-allowed
            disabled:opacity-55
          "
        >
          −
        </button>

        <span
          aria-live="polite"
          className="
            w-8 text-center
            text-sm font-medium
            text-bone
          "
        >
          {value}
        </span>

        <button
          type="button"
          aria-label={`Increase ${label}`}
          disabled={value >= maximum}
          onPointerDown={(event) => {
            event.stopPropagation();
            event.preventDefault();
            onIncrease();
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              onIncrease();
            }
          }}
          className="
            flex size-[2.5rem]
            items-center justify-center
            border border-bone/20
            text-lg text-bone/80
            transition-colors duration-200
            hover:border-bone/50
            hover:text-bone
            disabled:cursor-not-allowed
            disabled:opacity-55
          "
        >
          +
        </button>
      </div>
    </div>
  );
}
