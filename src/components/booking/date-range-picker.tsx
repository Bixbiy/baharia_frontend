"use client";

import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "motion/react";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

type DateRangePickerProps = {
  checkIn: string;
  checkOut: string;
  minDate: string;
  onChange: (value: {
    checkIn: string;
    checkOut: string;
  }) => void;
};

const WEEK_DAYS = [
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
  "Sun",
] as const;

function parseDate(value: string) {
  if (!value) {
    return null;
  }

  const [year, month, day] =
    value.split("-").map(Number);

  return new Date(
    Date.UTC(year, month - 1, day),
  );
}

function toIsoDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

function startOfMonth(date: Date) {
  return new Date(
    Date.UTC(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      1,
    ),
  );
}

function addMonths(
  date: Date,
  amount: number,
) {
  return new Date(
    Date.UTC(
      date.getUTCFullYear(),
      date.getUTCMonth() + amount,
      1,
    ),
  );
}

function getMonthDays(month: Date) {
  const firstDay = startOfMonth(month);

  const mondayOffset =
    (firstDay.getUTCDay() + 6) % 7;

  const daysInMonth = new Date(
    Date.UTC(
      month.getUTCFullYear(),
      month.getUTCMonth() + 1,
      0,
    ),
  ).getUTCDate();

  const days: Array<Date | null> = [];

  for (
    let index = 0;
    index < mondayOffset;
    index += 1
  ) {
    days.push(null);
  }

  for (
    let day = 1;
    day <= daysInMonth;
    day += 1
  ) {
    days.push(
      new Date(
        Date.UTC(
          month.getUTCFullYear(),
          month.getUTCMonth(),
          day,
        ),
      ),
    );
  }

  return days;
}

function formatDate(value: string) {
  const date = parseDate(value);

  if (!date) {
    return "Select";
  }

  return new Intl.DateTimeFormat(
    "en-US",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
    },
  ).format(date);
}

function formatMonth(date: Date) {
  return new Intl.DateTimeFormat(
    "en-US",
    {
      month: "long",
      year: "numeric",
    },
  ).format(date);
}

export function DateRangePicker({
  checkIn,
  checkOut,
  minDate,
  onChange,
}: DateRangePickerProps) {
  const prefersReducedMotion = useReducedMotion();
  const [open, setOpen] =
    useState(false);

  const [selectionStage, setSelectionStage] =
    useState<
      "check-in" | "check-out"
    >("check-in");

  const wrapperRef =
    useRef<HTMLDivElement>(null);

  const minimumMonth = useMemo(
    () =>
      startOfMonth(
        parseDate(minDate) ??
          new Date(),
      ),
    [minDate],
  );

  const [month, setMonth] =
    useState(minimumMonth);

  const days = useMemo(
    () => getMonthDays(month),
    [month],
  );

  useEffect(() => {
    const handleOutside = (
      event: PointerEvent,
    ) => {
      if (
        !wrapperRef.current?.contains(
          event.target as Node,
        )
      ) {
        setOpen(false);
      }
    };

    document.addEventListener(
      "pointerdown",
      handleOutside,
    );

    return () =>
      document.removeEventListener(
        "pointerdown",
        handleOutside,
      );
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () =>
      document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const openPicker = (
    target:
      | "check-in"
      | "check-out",
  ) => {
    setSelectionStage(target);

    const anchor =
      target === "check-out" &&
      checkIn
        ? parseDate(checkIn)
        : parseDate(minDate);

    if (anchor) {
      setMonth(
        startOfMonth(anchor),
      );
    }

    setOpen(true);
  };

  const chooseDate = (
    date: Date,
  ) => {
    const value = toIsoDate(date);

    if (value < minDate) {
      return;
    }

    if (
      selectionStage ===
        "check-in" ||
      !checkIn
    ) {
      onChange({
        checkIn: value,
        checkOut: "",
      });

      setSelectionStage(
        "check-out",
      );

      return;
    }

    if (value <= checkIn) {
      onChange({
        checkIn: value,
        checkOut: "",
      });

      setSelectionStage(
        "check-out",
      );

      return;
    }

    onChange({
      checkIn,
      checkOut: value,
    });

    setOpen(false);
  };

  return (
    <div
      ref={wrapperRef}
      className="relative w-full"
    >
      <div
        className="
          grid
          grid-cols-2
          border
          border-bone/15
        "
      >
        <button
          type="button"
          onClick={() =>
            openPicker("check-in")
          }
          aria-label={`Check-in, ${formatDate(checkIn)}`}
          aria-controls="stay-date-picker"
          aria-expanded={
            open &&
            selectionStage ===
              "check-in"
          }
          className="
            min-h-[108px]
            border-r
            border-bone/10
            px-6
            text-left
            transition-colors
            duration-300
            hover:bg-bone/[0.035]
          "
        >
          <span
            className="
              block
              text-[9px]
              font-medium
              uppercase
              tracking-[0.22em]
              text-bone/60
            "
          >
            Check-in
          </span>

          <span
            className="
              mt-3
              block
              font-display
              text-[clamp(1.8rem,2.8vw,2.6rem)]
              leading-none
              tracking-[-0.035em]
              text-bone
            "
          >
            {formatDate(checkIn)}
          </span>
        </button>

        <button
          type="button"
          onClick={() =>
            openPicker("check-out")
          }
          aria-label={`Check-out, ${formatDate(checkOut)}`}
          aria-controls="stay-date-picker"
          aria-expanded={
            open &&
            selectionStage ===
              "check-out"
          }
          className="
            min-h-[108px]
            px-6
            text-left
            transition-colors
            duration-300
            hover:bg-bone/[0.035]
          "
        >
          <span
            className="
              block
              text-[9px]
              font-medium
              uppercase
              tracking-[0.22em]
              text-bone/60
            "
          >
            Check-out
          </span>

          <span
            className="
              mt-3
              block
              font-display
              text-[clamp(1.8rem,2.8vw,2.6rem)]
              leading-none
              tracking-[-0.035em]
              text-bone
            "
          >
            {formatDate(checkOut)}
          </span>
        </button>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.div
            id="stay-date-picker"
            role="dialog"
            aria-label="Choose stay dates"
            initial={prefersReducedMotion ? false : {
              opacity: 0,
              y: 8,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={prefersReducedMotion ? undefined : {
              opacity: 0,
              y: 5,
            }}
            transition={{
              duration: prefersReducedMotion ? 0 : 0.22,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="
              absolute
              left-0
              w-full
              top-[calc(100%+10px)]
              z-[200]
              border
              border-bone/15
              bg-white
              text-charcoal
              p-5
              shadow-[0_30px_80px_rgb(0_0_0_/_0.35)]
              sm:w-[440px]
            "
          >
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <p
                  className="
                    text-[9px]
                    font-medium
                    uppercase
                    tracking-[0.22em]
                    text-bone/55
                  "
                >
                  {selectionStage ===
                  "check-in"
                    ? "Choose arrival"
                    : "Choose departure"}
                </p>

                <p className="mt-1 font-display text-xl text-bone">
                  {formatMonth(month)}
                </p>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  aria-label="Previous month"
                  disabled={
                    month.getTime() <=
                    minimumMonth.getTime()
                  }
                  onClick={() =>
                    setMonth(
                      (current) =>
                        addMonths(
                          current,
                          -1,
                        ),
                    )
                  }
                  className="
                    flex size-9
                    items-center justify-center
                    text-lg text-bone/55
                    transition-colors
                    hover:text-bone
                    disabled:opacity-55
                  "
                >
                  ←
                </button>

                <button
                  type="button"
                  aria-label="Next month"
                  onClick={() =>
                    setMonth(
                      (current) =>
                        addMonths(
                          current,
                          1,
                        ),
                    )
                  }
                  className="
                    flex size-9
                    items-center justify-center
                    text-lg text-bone/55
                    transition-colors
                    hover:text-bone
                  "
                >
                  →
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7">
              {WEEK_DAYS.map(
                (day) => (
                  <span
                    key={day}
                    className="
                      py-2 text-center
                      text-[8px]
                      font-medium
                      uppercase
                      tracking-[0.12em]
                      text-bone/35
                    "
                  >
                    {day}
                  </span>
                ),
              )}

              {days.map(
                (date, index) => {
                  if (!date) {
                    return (
                      <span
                        key={`empty-${index}`}
                        className="aspect-square"
                      />
                    );
                  }

                  const value =
                    toIsoDate(date);

                  const disabled =
                    value < minDate;

                  const selected =
                    value === checkIn ||
                    value === checkOut;

                  const range =
                    Boolean(
                      checkIn &&
                        checkOut,
                    ) &&
                    value > checkIn &&
                    value < checkOut;

                  return (
                    <button
                      key={value}
                      type="button"
                      disabled={
                        disabled
                      }
                      onClick={() =>
                        chooseDate(
                          date,
                        )
                      }
                      className={[
                        "flex aspect-square",
                        "items-center justify-center",
                        "text-sm transition-colors",
                        "duration-200",
                        disabled
                          ? "cursor-not-allowed text-bone/15"
                          : "text-bone/85 hover:bg-bone/10",
                        range
                          ? "bg-bone/10"
                          : "",
                        selected
                          ? "bg-brass font-medium text-deep-indigo hover:bg-brass"
                          : "",
                      ].join(" ")}
                    >
                      {date.getUTCDate()}
                    </button>
                  );
                },
              )}
            </div>

            <div
              className="
                mt-5
                border-t
                border-bone/10
                pt-4
                text-[8px]
                uppercase
                tracking-[0.16em]
                text-bone/35
              "
            >
              {selectionStage ===
              "check-in"
                ? "Select your arrival date"
                : "Select your departure date"}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
