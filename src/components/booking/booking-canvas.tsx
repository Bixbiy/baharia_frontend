"use client";

import Image from "next/image";
import Link from "next/link";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "motion/react";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  mockBookingProvider,
  ROOM_TYPES,
  type AvailabilityResult,
  type GuestDetails,
  type Reservation,
  type RoomRateQuote,
  type RoomType,
  type RoomTypeId,
} from "@/lib/booking";

import { DateRangePicker } from "./date-range-picker";
import { GuestSelector } from "./guest-selector";

type BookingStage =
  | "stay"
  | "details"
  | "payment"
  | "confirmation";

const stages = [
  "stay",
  "details",
  "payment",
] as const;

function futureDate(
  offset: number,
) {
  const date = new Date();

  date.setDate(
    date.getDate() + offset,
  );

  return toLocalIsoDate(date);
}

function toLocalIsoDate(date: Date) {
  const year = date.getFullYear();
  const month = String(
    date.getMonth() + 1,
  ).padStart(2, "0");
  const day = String(
    date.getDate(),
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatDate(
  value: string,
) {
  if (!value) {
    return "—";
  }

  return new Intl.DateTimeFormat(
    "en-US",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
    },
  ).format(
    new Date(
      `${value}T00:00:00`,
    ),
  );
}

function formatCurrency(
  amount: number,
  currency: string,
) {
  return new Intl.NumberFormat(
    "en-US",
    {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    },
  ).format(amount);
}

export function BookingCanvas() {
  const prefersReducedMotion =
    useReducedMotion();

  const minDate = useMemo(
    () => toLocalIsoDate(new Date()),
    [],
  );

  const [
    checkIn,
    setCheckIn,
  ] = useState(() =>
    futureDate(14),
  );

  const [
    checkOut,
    setCheckOut,
  ] = useState(() =>
    futureDate(18),
  );

  const [adults, setAdults] =
    useState(2);

  const [children, setChildren] =
    useState(0);

  const [
    guestOpen,
    setGuestOpen,
  ] = useState(false);

  const [
    availability,
    setAvailability,
  ] =
    useState<AvailabilityResult | null>(
      null,
    );

  const [quotes, setQuotes] =
    useState<
      Partial<
        Record<
          RoomTypeId,
          RoomRateQuote
        >
      >
    >({});

  const [
    selectedRoomId,
    setSelectedRoomId,
  ] =
    useState<RoomTypeId | null>(
      null,
    );

  const [
    stage,
    setStage,
  ] =
    useState<BookingStage>("stay");

  const [guest, setGuest] =
    useState<GuestDetails>({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      country: "",
      specialRequests: "",
    });

  const [
    availabilityLoading,
    setAvailabilityLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] =
    useState<string | null>(null);

  const [
    detailsError,
    setDetailsError,
  ] =
    useState<string | null>(null);

  const [
    completing,
    setCompleting,
  ] = useState(false);

  const [
    reservation,
    setReservation,
  ] =
    useState<Reservation | null>(
      null,
    );

  const nights = useMemo(() => {
    if (!checkIn || !checkOut) {
      return 0;
    }

    const start =
      new Date(
        `${checkIn}T00:00:00Z`,
      ).getTime();

    const end =
      new Date(
        `${checkOut}T00:00:00Z`,
      ).getTime();

    return Math.max(
      Math.round(
        (end - start) /
          86400000,
      ),
      0,
    );
  }, [checkIn, checkOut]);

  const selectedRoom =
    useMemo<RoomType | null>(
      () =>
        selectedRoomId
          ? ROOM_TYPES.find(
              (room) =>
                room.id ===
                selectedRoomId,
            ) ?? null
          : null,
      [selectedRoomId],
    );

  const selectedQuote =
    selectedRoomId
      ? quotes[
          selectedRoomId
        ] ?? null
      : null;

  const refreshAvailability =
    useCallback(
      async ({
        nextCheckIn =
          checkIn,
        nextCheckOut =
          checkOut,
        nextAdults =
          adults,
        nextChildren =
          children,
      }: {
        nextCheckIn?: string;
        nextCheckOut?: string;
        nextAdults?: number;
        nextChildren?: number;
      } = {}) => {
        if (
          !nextCheckIn ||
          !nextCheckOut ||
          nextCheckOut <=
            nextCheckIn
        ) {
          setAvailability(
            null,
          );
          setQuotes({});
          setSelectedRoomId(
            null,
          );
          setAvailabilityLoading(
            false,
          );

          return;
        }

        setAvailabilityLoading(
          true,
        );
        setError(null);

        try {
          const result =
            await mockBookingProvider.getAvailability(
              {
                checkIn:
                  nextCheckIn,
                checkOut:
                  nextCheckOut,
                adults:
                  nextAdults,
                children:
                  nextChildren,
              },
            );

          const quoteResults =
            await Promise.all(
              result.rooms.map(
                async (
                  room,
                ) => {
                  const quote =
                    await mockBookingProvider.getRoomRate(
                      room.roomTypeId,
                      "flexible",
                      {
                        checkIn:
                          nextCheckIn,
                        checkOut:
                          nextCheckOut,
                        adults:
                          nextAdults,
                        children:
                          nextChildren,
                        roomTypeId:
                          room.roomTypeId,
                      },
                    );

                  return [
                    room.roomTypeId,
                    quote,
                  ] as const;
                },
              ),
            );

          setAvailability(
            result,
          );

          setQuotes(
            Object.fromEntries(
              quoteResults,
            ),
          );

          setSelectedRoomId(
            (current) =>
              result.rooms.some(
                (room) =>
                  room.roomTypeId ===
                  current,
              )
                ? current
                : null,
          );
        } catch (bookingError) {
          setAvailability(
            null,
          );
          setQuotes({});
          setSelectedRoomId(
            null,
          );

          setError(
            bookingError instanceof
              Error
              ? bookingError.message
              : "We couldn't update availability.",
          );
        } finally {
          setAvailabilityLoading(
            false,
          );
        }
      },
      [
        adults,
        checkIn,
        checkOut,
        children,
      ],
    );

  useEffect(() => {
    const timer =
      window.setTimeout(
        () => {
          void refreshAvailability();
        },
        250,
      );

    return () =>
      window.clearTimeout(
        timer,
      );
  }, [refreshAvailability]);

  const handleDatesChange = ({
    checkIn: nextCheckIn,
    checkOut: nextCheckOut,
  }: {
    checkIn: string;
    checkOut: string;
  }) => {
    setCheckIn(
      nextCheckIn,
    );

    setCheckOut(
      nextCheckOut,
    );

    setSelectedRoomId(
      null,
    );

    if (!nextCheckIn || !nextCheckOut) {
      setAvailability(
        null,
      );
      setQuotes({});
    }
  };

  const handleGuestChange = ({
    adults: nextAdults,
    children: nextChildren,
  }: {
    adults: number;
    children: number;
  }) => {
    setAdults(nextAdults);
    setChildren(
      nextChildren,
    );

    setSelectedRoomId(
      null,
    );

  };

  const handleRoomSelect = (
    roomId: RoomTypeId,
  ) => {
    setSelectedRoomId(
      roomId,
    );
  };

  const updateGuest = (
    field: keyof GuestDetails,
    value: string,
  ) => {
    setGuest(
      (current) => ({
        ...current,
        [field]: value,
      }),
    );

    setDetailsError(
      null,
    );
  };

  const goToDetails = () => {
    if (
      !selectedRoom ||
      !selectedQuote
    ) {
      return;
    }

    setStage(
      "details",
    );

    window.scrollTo({
      top: 0,
      behavior:
        prefersReducedMotion
          ? "auto"
          : "smooth",
    });
  };

  const goToPayment = () => {
    const required = [
      guest.firstName,
      guest.lastName,
      guest.email,
      guest.phone,
      guest.country,
    ];

    if (required.some((value) => !value.trim())) {
      setDetailsError(
        "Please complete all required guest details.",
      );

      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(guest.email.trim())) {
      setDetailsError(
        "Please enter a valid email address.",
      );

      return;
    }

    setDetailsError(null);
    setStage("payment");

    window.scrollTo({
      top: 0,
      behavior:
        prefersReducedMotion
          ? "auto"
          : "smooth",
    });
  };

  const completeReservation =
    async () => {
      if (
        !selectedRoom ||
        !selectedQuote
      ) {
        return;
      }

      setCompleting(
        true,
      );
      setError(null);

      try {
        const created =
          await mockBookingProvider.createReservation(
            {
              guest,
              room: {
                roomTypeId:
                  selectedRoom.id,
                ratePlanId:
                  "flexible",
                adults,
                children,
                checkIn,
                checkOut,
                nights,
                priceBreakdown:
                  selectedQuote.priceBreakdown,
              },
            },
          );

        setReservation(
          created,
        );

        setStage(
          "confirmation",
        );

        window.scrollTo({
          top: 0,
          behavior:
            prefersReducedMotion
              ? "auto"
              : "smooth",
        });
      } catch (bookingError) {
        setError(
          bookingError instanceof
            Error
            ? bookingError.message
            : "We couldn't complete the reservation.",
        );
      } finally {
        setCompleting(
          false,
        );
      }
    };

  if (stage === "confirmation" && reservation) {
    return (
      <ConfirmationView
        reservation={
          reservation
        }
        reducedMotion={Boolean(
          prefersReducedMotion,
        )}
      />
    );
  }

  return (
    <main
      className="
        min-h-svh
        overflow-x-clip
        booking-light
        bg-white
        text-charcoal
      "
    >
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          fixed
          inset-0
          bg-[radial-gradient(circle_at_82%_6%,rgb(201_161_92_/_0.16),transparent_30%),radial-gradient(circle_at_8%_88%,rgb(232_212_192_/_0.52),transparent_26%)]
        "
      />

      <header
        className="
          relative
          z-30
          border-b
          border-charcoal/10
        "
      >
        <div
          className="
            mx-auto
            flex
            min-h-20
            w-full
            max-w-[1440px]
            items-center
            justify-between
            px-6
            sm:px-8
            lg:px-12
            xl:px-16
          "
        >
          <Link
            href="/"
            className="
              font-display
              text-2xl
              tracking-[-0.03em]
              text-deep-indigo
            "
          >
            Baharia
          </Link>

          <Link
            href="/"
            className="
              text-[8px]
              font-medium
              uppercase
              tracking-[0.18em]
              text-muted/85
              transition-colors
              hover:text-deep-indigo
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-offset-1
              focus-visible:ring-deep-indigo
              rounded-[2px]
            "
          >
            Exit reservation
          </Link>
        </div>
      </header>

      <div
        className="
          relative
          z-20
          mx-auto
          w-full
          max-w-[1440px]
          px-6
          sm:px-8
          lg:px-12
          xl:px-16
        "
      >
        <BookingProgress
          stage={stage}
        />
      </div>

      <div
        className="
          relative
          z-10
          mx-auto
          w-full
          max-w-[1440px]
          px-6
          py-8
          sm:px-8
          sm:py-10
          lg:px-12
          lg:py-14
          xl:px-16
        "
      >
        <AnimatePresence
          mode="wait"
          initial={false}
        >
          {stage === "stay" ? (
            <motion.div
              key="stay"
              initial={{
                opacity:
                  prefersReducedMotion
                    ? 1
                    : 0,
                y:
                  prefersReducedMotion
                    ? 0
                    : 10,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                y: -8,
              }}
              transition={{
                duration:
                  prefersReducedMotion
                    ? 0
                    : 0.35,
                ease: [
                  0.22,
                  1,
                  0.36,
                  1,
                ],
              }}
            >
              <StayView
                checkIn={
                  checkIn
                }
                checkOut={
                  checkOut
                }
                minDate={
                  minDate
                }
                adults={
                  adults
                }
                childCount={
                  children
                }
                guestOpen={
                  guestOpen
                }
                onToggleGuests={() =>
                  setGuestOpen(
                    (current) =>
                      !current,
                  )
                }
                onDateChange={
                  handleDatesChange
                }
                onGuestChange={
                  handleGuestChange
                }
                availability={
                  availability
                }
                quotes={
                  quotes
                }
                loading={
                  availabilityLoading
                }
                selectedRoomId={
                  selectedRoomId
                }
                error={error}
                onSelectRoom={
                  handleRoomSelect
                }
                onContinue={
                  goToDetails
                }
              />
            </motion.div>
          ) : null}

          {stage === "details" ? (
            <motion.div
              key="details"
              initial={{
                opacity: 0,
                x: prefersReducedMotion
                  ? 0
                  : 12,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              exit={{
                opacity: 0,
                x: -8,
              }}
              transition={{
                duration:
                  prefersReducedMotion
                    ? 0
                    : 0.35,
                ease: [
                  0.22,
                  1,
                  0.36,
                  1,
                ],
              }}
            >
              <DetailsView
                guest={guest}
                error={
                  detailsError
                }
                room={
                  selectedRoom
                }
                quote={
                  selectedQuote
                }
                onChange={
                  updateGuest
                }
                onBack={() =>
                  setStage(
                    "stay",
                  )
                }
                onContinue={
                  goToPayment
                }
              />
            </motion.div>
          ) : null}

          {stage === "payment" ? (
            <motion.div
              key="payment"
              initial={{
                opacity: 0,
                x: prefersReducedMotion
                  ? 0
                  : 12,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              transition={{
                duration:
                  prefersReducedMotion
                    ? 0
                    : 0.35,
                ease: [
                  0.22,
                  1,
                  0.36,
                  1,
                ],
              }}
            >
              <PaymentView
                room={
                  selectedRoom
                }
                quote={
                  selectedQuote
                }
                error={error}
                completing={
                  completing
                }
                onBack={() =>
                  setStage(
                    "details",
                  )
                }
                onComplete={
                  completeReservation
                }
              />
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </main>
  );
}

function BookingProgress({
  stage,
}: {
  stage: BookingStage;
}) {
  const activeIndex =
    stage === "stay"
      ? 0
      : stage === "details"
        ? 1
        : 2;

  const progressLabels: Record<typeof stages[number], { title: string; description: string }> = {
    stay: { 
      title: "Your stay", 
      description: "Choose dates & guests" 
    },
    details: { 
      title: "Guest details", 
      description: "Your information" 
    },
    payment: { 
      title: "Payment", 
      description: "Confirm & pay" 
    },
  };

  return (
    <nav
      aria-label="Reservation progress"
      className="
        flex
        items-center
        gap-4
        overflow-x-auto
        border-b
          border-charcoal/10
        py-6
        sm:gap-8
      "
    >
      {stages.map(
        (item, index) => {
          const active =
            index ===
            activeIndex;

          const complete =
            index <
            activeIndex;

          const label = progressLabels[item];

          return (
            <div
              key={item}
              className="
                flex shrink-0
                items-center gap-3
              "
            >
              <div className="flex flex-col gap-1">
                <span
                  className={[
                    "flex size-8 items-center justify-center",
                    "border text-sm font-semibold",
                    "sm:size-9",
                    active
                      ? "border-bone bg-bone text-deep-indigo"
                      : complete
                        ? "border-bone/40 text-bone bg-bone/10"
                        : "border-bone/15 text-bone/45",
                  ].join(" ")}
                >
                  {complete
                    ? "✓"
                    : `${
                        index + 1
                      }`}
                </span>
              </div>

              <div>
                <div
                  className={[
                    "text-xs font-semibold uppercase tracking-[0.16em]",
                    active
                      ? "text-bone"
                      : "text-bone/50",
                  ].join(" ")}
                >
                  {label.title}
                </div>
                <div
                  className={[
                    "text-[11px] font-normal tracking-[0.08em] mt-0.5",
                    active
                      ? "text-bone/75"
                      : "text-bone/40",
                  ].join(" ")}
                >
                  {label.description}
                </div>
              </div>

              {index <
              stages.length - 1 ? (
                <span
                  aria-hidden="true"
                  className="
                    h-px w-6
                    bg-bone/12
                    sm:w-10
                  "
                />
              ) : null}
            </div>
          );
        },
      )}
    </nav>
  );
}

function StayView({
  checkIn,
  checkOut,
  minDate,
  adults,
  childCount,
  guestOpen,
  onToggleGuests,
  onDateChange,
  onGuestChange,
  availability,
  quotes,
  loading,
  selectedRoomId,
  error,
  onSelectRoom,
  onContinue,
}: {
  checkIn: string;
  checkOut: string;
  minDate: string;
  adults: number;
  childCount: number;
  guestOpen: boolean;
  onToggleGuests: () => void;
  onDateChange: (value: {
    checkIn: string;
    checkOut: string;
  }) => void;
  onGuestChange: (value: {
    adults: number;
    children: number;
  }) => void;
  availability: AvailabilityResult | null;
  quotes: Partial<
    Record<RoomTypeId, RoomRateQuote>
  >;
  loading: boolean;
  selectedRoomId: RoomTypeId | null;
  error: string | null;
  onSelectRoom: (
    id: RoomTypeId,
  ) => void;
  onContinue: () => void;
}) {
  return (
    <>
      <section>
        <p className="text-[9px] font-medium uppercase tracking-[0.28em] text-bone/65">
          Your stay
        </p>

        <div
          className="
            mt-3
            flex
            flex-col
            gap-4
            lg:flex-row
            lg:items-end
            lg:justify-between
          "
        >
          <div>
            <h1
              className="
                font-display
                text-[clamp(3.4rem,6vw,6.6rem)]
                leading-[0.86]
                tracking-[-0.05em]
              "
            >
              Find your
              <span className="block text-bone/65">
                place.
              </span>
            </h1>

            <p
              className="
                mt-5 max-w-xl
                text-sm leading-6
                text-bone/65
                sm:text-base
                sm:leading-7
              "
            >
              Choose when you&apos;re arriving and
              leaving. Rooms and rates update
              automatically.
            </p>
          </div>

          <div className="text-left lg:text-right">
            <p className="text-[8px] uppercase tracking-[0.18em] text-bone/45">
              Reservation
            </p>

            <p className="mt-1 text-sm text-bone/80">
              {formatDate(checkIn)} → {formatDate(checkOut)}
            </p>
          </div>
        </div>
      </section>

      {/* One coherent reservation control */}
      <section
        aria-label="Stay configuration"
        className="
          mt-8 overflow-visible
          border
          border-bone/15
          bg-bone/[0.045]
          shadow-[0_18px_50px_rgb(0_0_0_/_0.10)]
        "
      >
        <div
          className="
            grid
            lg:grid-cols-[1.25fr_0.75fr]
          "
        >
          <DateRangePicker
            checkIn={checkIn}
            checkOut={checkOut}
            minDate={minDate}
            onChange={
              onDateChange
            }
          />

          <GuestSelector
            adults={adults}
            childCount={childCount}
            maxAdults={4}
            maxChildren={2}
            open={guestOpen}
            onToggle={
              onToggleGuests
            }
            onChange={
              onGuestChange
            }
          />
        </div>

        <div
          className="
            flex
            min-h-12
            items-center
            justify-between
            gap-4
            border-t
          border-charcoal/10
            px-5
            sm:px-6
          "
        >
          <div className="flex items-center gap-2">
            {loading && (
              <div className="w-3 h-3 rounded-full bg-bone/40 animate-pulse" />
            )}
            <span
              className="
                text-[8px]
                font-medium
                uppercase
                tracking-[0.16em]
                text-bone/60
              "
            >
              {loading
                ? "Checking availability"
                : availability
                  ? `${availability.rooms.length} room${availability.rooms.length !== 1 ? 's' : ''} available`
                  : "Select dates to see availability"}
            </span>
          </div>

          <span
            className="
              text-[8px]
              font-medium
              uppercase
              tracking-[0.16em]
              text-bone/50
            "
          >
            {availability?.nights ??
              0}{" "}
            {availability?.nights === 1
              ? "night"
              : "nights"}
          </span>
        </div>
      </section>

      {error ? (
        <div
          role="alert"
          className="
            mt-5
            border-l-2
            border-terracotta
            bg-bone/[0.035]
            px-4
            py-3
            text-sm
            leading-6
            text-bone/85
          "
        >
          {error}
        </div>
      ) : null}

      {/* Rooms */}
      <section
        aria-labelledby="available-rooms"
        className="mt-10"
      >
        <div
          className="
            flex
            items-end
            justify-between
            gap-5
            border-b
            border-bone/10
            pb-4
          "
        >
          <div>
            <p className="text-[8px] font-medium uppercase tracking-[0.22em] text-bone/45">
              Available rooms
            </p>

            <h2
              id="available-rooms"
              className="mt-1.5 font-display text-2xl tracking-[-0.025em] sm:text-3xl"
            >
              Choose your space.
            </h2>
          </div>

          <span className="hidden text-[7px] uppercase tracking-[0.15em] text-bone/30 sm:block">
            Rates in USD
          </span>
        </div>

        <div
          aria-live="polite"
          aria-busy={loading}
          className="mt-5 space-y-4"
        >
          {loading && !availability ? (
            <RoomSkeletons />
          ) : availability &&
            availability.rooms.length > 0 ? (
            availability.rooms.map(
              (
                availableRoom,
                index,
              ) => {
                const room =
                  ROOM_TYPES.find(
                    (item) =>
                      item.id ===
                      availableRoom.roomTypeId,
                  );

                const quote =
                  quotes[
                    availableRoom.roomTypeId
                  ];

                if (
                  !room ||
                  !quote
                ) {
                  return null;
                }

                return (
                  <RoomCard
                    key={room.id}
                    room={room}
                    quote={quote}
                    selected={
                      selectedRoomId ===
                      room.id
                    }
                    availableUnits={
                      availableRoom.availableUnits
                    }
                    index={index}
                    onSelect={() =>
                      onSelectRoom(
                        room.id,
                      )
                    }
                  />
                );
              },
            )
          ) : (
            <div
              className="
                border
                border-bone/12
                bg-bone/[0.035]
                px-6
                py-10
                text-center
              "
            >
              <p className="font-display text-2xl text-bone">
                {availability
                  ? "No rooms are available."
                  : "Your rooms will appear here."}
              </p>

              <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-bone/50">
                {availability
                  ? "Try another date range or adjust your guests."
                  : "Select your dates above to begin."}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Explicit mobile transition */}
      <AnimatePresence>
        {selectedRoomId ? (
          <motion.div
            initial={{
              opacity: 0,
              y: 8,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              y: 5,
            }}
            className="mt-8 lg:hidden"
          >
            <div className="sticky bottom-0 bg-white border-t border-bone/10 p-4 mb-4">
              <button
                type="button"
                onClick={onContinue}
                className="
                  flex min-h-12
                  w-full items-center
                  justify-center gap-3
                  bg-deep-indigo text-bone px-5
                  text-[9px]
                  font-semibold uppercase
                  tracking-[0.17em]
                  transition-all
                  duration-300
                  hover:bg-charcoal
                "
              >
                Continue to details
                <span aria-hidden="true">
                  →
                </span>
              </button>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* Desktop transition */}
      <div
        className="
          mt-7
          hidden
          justify-end
          lg:flex
        "
      >
        <AnimatePresence mode="wait">
          {selectedRoomId ? (
            <motion.button
              key="continue"
              type="button"
              onClick={onContinue}
              initial={{
                opacity: 0,
                x: 8,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              exit={{
                opacity: 0,
                x: 8,
              }}
              className="
                group inline-flex
                min-h-12
                min-w-[230px]
                items-center
                justify-center
                gap-3
                bg-bone
                px-6
                text-[9px]
                font-semibold
                uppercase
                tracking-[0.17em]
                text-deep-indigo
                transition-colors
                duration-300
                hover:bg-coral-stone
              "
            >
              Continue to details
              <span
                aria-hidden="true"
                className="
                  transition-transform
                  duration-300
                  group-hover:translate-x-1
                "
              >
                →
              </span>
            </motion.button>
          ) : (
            <motion.p
              key="hint"
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              className="
                text-[8px]
                uppercase
                tracking-[0.16em]
                text-bone/35
              "
            >
              Select a room to continue
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}

function RoomCard({
  room,
  quote,
  selected,
  availableUnits,
  index,
  onSelect,
}: {
  room: RoomType;
  quote: RoomRateQuote;
  selected: boolean;
  availableUnits: number;
  index: number;
  onSelect: () => void;
}) {
  return (
    <motion.article
      layout
      initial={{
        opacity: 0,
        y: 10,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.35,
        delay: index * 0.04,
        ease: [
          0.22,
          1,
          0.36,
          1,
        ],
      }}
      className={[
        "group overflow-hidden border transition-[border-color,box-shadow,transform] duration-500",
        selected
          ? "border-bone/75 bg-bone text-charcoal shadow-[0_18px_44px_rgb(0_0_0_/_0.14)]"
          : "border-bone/12 bg-bone/[0.035] text-bone hover:-translate-y-0.5 hover:border-bone/35 hover:shadow-[0_18px_44px_rgb(0_0_0_/_0.12)]",
      ].join(" ")}
    >
      <div
        className="
          grid
          md:grid-cols-[240px_1fr]
          xl:grid-cols-[280px_1fr]
        "
      >
        <div
          className="
            relative
            aspect-[4/3]
            overflow-hidden
            bg-charcoal
            md:aspect-auto
            md:min-h-[235px]
          "
        >
          <Image
            src={room.image}
            alt={room.imageAlt}
            fill
            loading="lazy"
            sizes="
              (max-width: 767px) 100vw,
              (max-width: 1279px) 240px,
              280px
            "
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
              absolute
              inset-0
              bg-[linear-gradient(180deg,transparent_45%,rgb(0_0_0_/_0.24)_100%)]
            "
          />
        </div>

        <div className="flex min-w-0 flex-col justify-between p-5 sm:p-6">
          <div>
            <div className="flex items-start justify-between gap-6">
              <div className="min-w-0">
                <p
                  className={[
                    "text-[8px] font-medium uppercase tracking-[0.2em]",
                    selected
                      ? "text-muted"
                      : "text-bone/42",
                  ].join(" ")}
                >
                  {room.category}
                </p>

                <h3 className="mt-2 font-display text-3xl leading-none tracking-[-0.035em] sm:text-4xl">
                  {room.name}
                </h3>
              </div>

              <div className="shrink-0 text-right">
                <span
                  className={[
                    "block text-[7px] uppercase tracking-[0.14em]",
                    selected
                      ? "text-muted/65"
                      : "text-bone/38",
                  ].join(" ")}
                >
                  From
                </span>

                <strong
                  className={[
                    "mt-1 block font-display text-xl font-normal",
                    selected
                      ? "text-deep-indigo"
                      : "text-bone",
                  ].join(" ")}
                >
                  {formatCurrency(
                    quote.dailyRates[0]
                      ?.amount ?? 0,
                    quote.priceBreakdown
                      .currency,
                  )}
                </strong>

                <span
                  className={[
                    "mt-0.5 block text-[7px] uppercase tracking-[0.12em]",
                    selected
                      ? "text-muted/55"
                      : "text-bone/30",
                  ].join(" ")}
                >
                  per night
                </span>
              </div>
            </div>

            <p
              className={[
                "mt-4 max-w-2xl text-sm leading-6",
                selected
                  ? "text-muted"
                  : "text-bone/58",
              ].join(" ")}
            >
              {room.shortDescription}
            </p>

            <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2">
              {room.amenities
                .slice(0, 4)
                .map(
                  (
                    amenity,
                  ) => (
                    <span
                      key={
                        amenity
                      }
                      className={[
                        "text-[7px] uppercase tracking-[0.12em]",
                        selected
                          ? "text-muted/65"
                          : "text-bone/38",
                      ].join(" ")}
                    >
                      {amenity}
                    </span>
                  ),
                )}
            </div>
          </div>

          <div
            className={[
              "mt-6 flex flex-col gap-4 border-t pt-5",
              "sm:flex-row sm:items-end sm:justify-between",
              selected
                ? "border-charcoal/10"
                : "border-bone/10",
            ].join(" ")}
          >
            <div>
              <p
                className={[
                  "text-[7px] uppercase tracking-[0.13em]",
                  selected
                    ? "text-muted/65"
                    : "text-bone/40",
                ].join(" ")}
              >
                {quote.nights}{" "}
                {quote.nights === 1
                  ? "night"
                  : "nights"}{" "}
                · Flexible rate
              </p>

              <p
                className={[
                  "mt-1 text-sm font-medium",
                  selected
                    ? "text-charcoal"
                    : "text-bone/85",
                ].join(" ")}
              >
                {formatCurrency(
                  quote.priceBreakdown
                    .total,
                  quote.priceBreakdown
                    .currency,
                )}{" "}
                total
              </p>

              <p
                className={[
                  "mt-1 text-[7px] uppercase tracking-[0.12em]",
                  selected
                    ? "text-muted/55"
                    : "text-bone/32",
                ].join(" ")}
              >
                {availableUnits}{" "}
                {availableUnits ===
                1
                  ? "room"
                  : "rooms"}{" "}
                remaining
              </p>
            </div>

            <button
              type="button"
              aria-pressed={
                selected
              }
              onClick={
                onSelect
              }
              className={[
                "inline-flex min-h-11 w-full shrink-0",
                "items-center justify-center gap-2.5",
                "border px-5 text-[9px]",
                "font-semibold uppercase tracking-[0.16em]",
                "transition-all duration-300 sm:w-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-bone/40",
                selected
                  ? "booking-dark-choice border-deep-indigo bg-deep-indigo text-bone hover:bg-charcoal shadow-sm"
                  : "border-bone/40 text-bone hover:border-bone/60 hover:bg-bone/[0.08]",
              ].join(" ")}
            >
              {selected ? (
                <>
                  <span>✓ Selected</span>
                </>
              ) : (
                <>
                  <span>Choose room</span>
                  <span aria-hidden="true">→</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

function RoomSkeletons() {
  return (
    <>
      {[1, 2, 3].map(
        (item) => (
          <div
            key={item}
            className="
              grid
              animate-pulse
              overflow-hidden
              border
              border-bone/8
              bg-bone/[0.035]
              md:grid-cols-[240px_1fr]
            "
          >
            <div className="min-h-[180px] bg-bone/7" />

            <div className="space-y-4 p-5 sm:p-6">
              <div className="h-2 w-24 bg-bone/10" />
              <div className="h-8 w-48 bg-bone/10" />
              <div className="h-12 w-full bg-bone/7" />

              <div className="flex justify-between gap-5 border-t border-bone/8 pt-5">
                <div className="h-8 w-28 bg-bone/8" />
                <div className="h-11 w-32 bg-bone/9" />
              </div>
            </div>
          </div>
        ),
      )}
    </>
  );
}

function DetailsView({
  guest,
  error,
  room,
  quote,
  onChange,
  onBack,
  onContinue,
}: {
  guest: GuestDetails;
  error: string | null;
  room: RoomType | null;
  quote: RoomRateQuote | null;
  onChange: (
    field: keyof GuestDetails,
    value: string,
  ) => void;
  onBack: () => void;
  onContinue: () => void;
}) {
  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-12">
      <section>
        <p className="text-[9px] font-medium uppercase tracking-[0.26em] text-bone/60">
          Your details
        </p>

        <h1
          className="
            mt-3
            font-display
            text-[clamp(3rem,5.5vw,5.8rem)]
            leading-[0.88]
            tracking-[-0.05em]
          "
        >
          Almost there.
        </h1>

        <p className="mt-5 max-w-xl text-sm leading-6 text-bone/62">
          Tell us who we&apos;re preparing this stay for.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <DarkField
            id="first-name"
            label="First name"
            value={guest.firstName}
            autoComplete="given-name"
            onChange={(value) =>
              onChange(
                "firstName",
                value,
              )
            }
          />

          <DarkField
            id="last-name"
            label="Last name"
            value={guest.lastName}
            autoComplete="family-name"
            onChange={(value) =>
              onChange(
                "lastName",
                value,
              )
            }
          />

          <DarkField
            id="email"
            label="Email"
            type="email"
            value={guest.email}
            autoComplete="email"
            onChange={(value) =>
              onChange(
                "email",
                value,
              )
            }
          />

          <DarkField
            id="phone"
            label="Phone"
            type="tel"
            value={guest.phone}
            autoComplete="tel"
            onChange={(value) =>
              onChange(
                "phone",
                value,
              )
            }
          />

          <DarkField
            id="country"
            label="Country"
            value={guest.country}
            autoComplete="country-name"
            onChange={(value) =>
              onChange(
                "country",
                value,
              )
            }
          />
        </div>

        <label
          htmlFor="special-requests"
          className="mt-4 block"
        >
          <span className="mb-2 block text-[8px] font-medium uppercase tracking-[0.2em] text-bone/50">
            Special requests
            <span className="ml-1 text-bone/30">
              optional
            </span>
          </span>

          <textarea
            id="special-requests"
            rows={5}
            value={
              guest.specialRequests ??
              ""
            }
            onChange={(event) =>
              onChange(
                "specialRequests",
                event.target.value,
              )
            }
            placeholder="Anything we should know?"
            className="
              block w-full resize-none
              border border-bone/15
              bg-bone/[0.045]
              px-4 py-4
              text-sm text-bone
              outline-none
              transition-colors duration-300
              placeholder:text-bone/25
              focus:border-brass/65
            "
          />
        </label>

        {error ? (
          <p
            role="alert"
            className="
              mt-5
              border-l-2
              border-terracotta
              pl-3
              text-sm
              text-bone/80
            "
          >
            {error}
          </p>
        ) : null}

        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={onBack}
            className="
              inline-flex min-h-11
              items-center justify-center
              border border-bone/25
              px-5 text-[9px]
              font-semibold uppercase
              tracking-[0.16em]
              text-bone/80
              transition-colors
              hover:border-bone/60
              hover:text-bone
            "
          >
            ← Back
          </button>

          <button
            type="button"
            onClick={onContinue}
            className="
              inline-flex min-h-11 flex-1
              items-center justify-center gap-3
              bg-bone px-5
              text-[9px] font-semibold
              uppercase tracking-[0.16em]
              text-deep-indigo
              transition-colors duration-300
              hover:bg-coral-stone
            "
          >
            Continue to payment
            <span aria-hidden="true">
              →
            </span>
          </button>
        </div>
      </section>

      <ReservationSummary
        room={room}
        quote={quote}
      />
    </div>
  );
}

function PaymentView({
  room,
  quote,
  error,
  completing,
  onBack,
  onComplete,
}: {
  room: RoomType | null;
  quote: RoomRateQuote | null;
  error: string | null;
  completing: boolean;
  onBack: () => void;
  onComplete: () => void;
}) {
  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-12">
      <section>
        <p className="text-[9px] font-medium uppercase tracking-[0.26em] text-bone/60">
          Payment
        </p>

        <h1
          className="
            mt-3
            font-display
            text-[clamp(3rem,5.5vw,5.8rem)]
            leading-[0.88]
            tracking-[-0.05em]
          "
        >
          Complete your stay.
        </h1>

        <p className="mt-5 max-w-xl text-sm leading-6 text-bone/62">
          This is a simulated portfolio payment. No real
          transaction will be processed.
        </p>

        <div
          className="
            mt-8
            border
            border-bone/15
            bg-bone/[0.045]
            p-5
            sm:p-6
          "
        >
          <p className="text-[8px] font-medium uppercase tracking-[0.2em] text-bone/45">
            Demo payment
          </p>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <DarkField
              id="payment-name"
              label="Name on card"
              value="Baharia Guest"
              onChange={() => undefined}
              readOnly
            />

            <DarkField
              id="payment-number"
              label="Card number"
              value="4242 4242 4242 4242"
              onChange={() => undefined}
              readOnly
            />

            <DarkField
              id="payment-expiry"
              label="Expiry"
              value="12 / 30"
              onChange={() => undefined}
              readOnly
            />

            <DarkField
              id="payment-cvc"
              label="CVC"
              value="123"
              onChange={() => undefined}
              readOnly
            />
          </div>

          <div className="mt-5 border-t border-bone/10 pt-4">
            <p className="text-[8px] uppercase tracking-[0.15em] text-bone/35">
              Demo mode · Payment details are not submitted.
            </p>
          </div>
        </div>

        {error ? (
          <p
            role="alert"
            className="
              mt-5
              border-l-2
              border-terracotta
              pl-3
              text-sm
              text-bone/80
            "
          >
            {error}
          </p>
        ) : null}

        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            disabled={completing}
            onClick={onBack}
            className="
              inline-flex min-h-11
              items-center justify-center
              border border-bone/25
              px-5 text-[9px]
              font-semibold uppercase
              tracking-[0.16em]
              text-bone/80
              transition-colors
              hover:border-bone/60
              disabled:opacity-40
            "
          >
            ← Back
          </button>

          <button
            type="button"
            disabled={completing}
            onClick={onComplete}
            className="
              inline-flex min-h-11 flex-1
              items-center justify-center gap-3
              bg-bone px-5
              text-[9px]
              font-semibold uppercase
              tracking-[0.16em]
              text-deep-indigo
              transition-colors duration-300
              hover:bg-coral-stone
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            {completing
              ? "Confirming reservation"
              : "Complete reservation"}

            <span aria-hidden="true">
              →
            </span>
          </button>
        </div>
      </section>

      <ReservationSummary
        room={room}
        quote={quote}
      />
    </div>
  );
}

function ReservationSummary({
  room,
  quote,
}: {
  room: RoomType | null;
  quote: RoomRateQuote | null;
}) {
  return (
    <aside>
      <div
        className="
          sticky top-6
          border
          border-bone/15
          bg-bone/[0.045]
          p-6
          xl:p-7
        "
      >
        <p className="text-[8px] font-medium uppercase tracking-[0.24em] text-bone/40">
          Your reservation
        </p>

        {room ? (
          <div className="relative mt-5 aspect-[16/8] overflow-hidden bg-charcoal">
            <Image
              src={room.image}
              alt=""
              fill
              sizes="(max-width: 1023px) 100vw, 360px"
              className="object-cover opacity-75"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-[linear-gradient(90deg,rgb(27_42_74_/_0.50),transparent)]"
            />
          </div>
        ) : null}

        <h2 className="mt-2 font-display text-3xl text-bone">
          {room?.name ??
            "Stay summary"}
        </h2>

        {room ? (
          <p className="mt-1 text-xs text-bone/45">
            {room.category}
          </p>
        ) : null}

        {quote ? (
          <>
            <div className="mt-6 grid grid-cols-2 border-y border-bone/10">
              <div className="border-r border-bone/10 py-4 pr-4">
                <span className="block text-[8px] uppercase tracking-[0.15em] text-bone/30">
                  Nights
                </span>

                <span className="mt-2 block text-sm text-bone/90">
                  {quote.nights}
                </span>
              </div>

              <div className="py-4 pl-4">
                <span className="block text-[8px] uppercase tracking-[0.15em] text-bone/30">
                  Rate
                </span>

                <span className="mt-2 block text-sm text-bone/90">
                  Flexible
                </span>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              {quote.priceBreakdown.lines.map(
                (line) => (
                  <div
                    key={line.label}
                    className="flex items-center justify-between gap-4 text-xs"
                  >
                    <span className="text-bone/40">
                      {line.label}
                    </span>

                    <span className="text-bone/78">
                      {formatCurrency(
                        line.amount,
                        line.currency,
                      )}
                    </span>
                  </div>
                ),
              )}
            </div>

            <div className="mt-5 flex items-end justify-between border-t border-bone/15 pt-5">
              <span className="text-[8px] font-medium uppercase tracking-[0.18em] text-bone/55">
                Total
              </span>

              <strong className="font-display text-3xl font-normal text-bone">
                {formatCurrency(
                  quote.priceBreakdown.total,
                  quote.priceBreakdown.currency,
                )}
              </strong>
            </div>
          </>
        ) : (
          <p className="mt-5 text-sm leading-6 text-bone/50">
            Select a room to see your reservation total.
          </p>
        )}
      </div>
    </aside>
  );
}

function DarkField({
  id,
  label,
  value,
  onChange,
  type = "text",
  autoComplete,
  readOnly = false,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (
    value: string,
  ) => void;
  type?: string;
  autoComplete?: string;
  readOnly?: boolean;
}) {
  return (
    <label
      htmlFor={id}
      className="block"
    >
      <span className="mb-2 block text-[8px] font-medium uppercase tracking-[0.2em] text-bone/50">
        {label}
      </span>

      <input
        id={id}
        type={type}
        value={value}
        autoComplete={
          autoComplete
        }
        readOnly={readOnly}
        onChange={(event) =>
          onChange(
            event.target.value,
          )
        }
        className="
          min-h-14 w-full
          border border-bone/15
          bg-bone/[0.045]
          px-4
          text-sm text-bone
          outline-none
          transition-all duration-300
          focus:border-brass/65
          focus:bg-bone/[0.07]
          read-only:cursor-default
          read-only:text-bone/60
        "
      />
    </label>
  );
}

function ConfirmationView({
  reservation,
  reducedMotion,
}: {
  reservation: Reservation;
  reducedMotion: boolean;
}) {
  const room =
    reservation.rooms[0];

  return (
    <main
      className="
        min-h-svh
        booking-light
        bg-white
        text-charcoal
      "
    >
      <header className="border-b border-bone/10">
        <div className="mx-auto flex min-h-20 w-full max-w-[1440px] items-center justify-between px-6 sm:px-8 lg:px-12 xl:px-16">
          <Link
            href="/"
            className="font-display text-2xl tracking-[-0.03em]"
          >
            Baharia
          </Link>

          <span className="text-[8px] uppercase tracking-[0.18em] text-bone/55">
            Stay confirmed
          </span>
        </div>
      </header>

      <div className="mx-auto flex min-h-[calc(100svh-80px)] w-full max-w-[900px] items-center px-6 py-12 sm:px-8">
        <motion.section
          initial={
            reducedMotion
              ? false
              : {
                  opacity: 0,
                  y: 14,
                }
          }
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration:
              reducedMotion
                ? 0
                : 0.6,
            ease: [
              0.22,
              1,
              0.36,
              1,
            ],
          }}
          className="
            w-full
            border
            border-bone/15
            bg-bone/[0.045]
            p-6
            sm:p-10
            lg:p-12
          "
        >
          <p className="text-[8px] uppercase tracking-[0.22em] text-bone/45">
            Baharia · Reservation confirmed
          </p>

          <h1
            className="
              mt-6
              font-display
              text-[clamp(3.2rem,6vw,6rem)]
              leading-[0.88]
              tracking-[-0.05em]
            "
          >
            Your stay
            <span className="block text-bone/60">
              is waiting.
            </span>
          </h1>

          <div className="mt-8 grid gap-px bg-bone/10 sm:grid-cols-2">
            <ConfirmationItem
              label="Confirmation"
              value={
                reservation.confirmationCode
              }
            />

            <ConfirmationItem
              label="Room"
              value={
                room?.roomTypeId ??
                "—"
              }
            />

            <ConfirmationItem
              label="Arrival"
              value={formatDate(
                room?.checkIn ??
                  "",
              )}
            />

            <ConfirmationItem
              label="Departure"
              value={formatDate(
                room?.checkOut ??
                  "",
              )}
            />
          </div>

          <div className="mt-6 flex flex-col gap-4 border-t border-bone/10 pt-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="block text-[8px] uppercase tracking-[0.16em] text-bone/35">
                Total
              </span>

              <span className="mt-1 block font-display text-3xl">
                {formatCurrency(
                  reservation.totalAmount,
                  reservation.currency,
                )}
              </span>
            </div>

            <Link
              href="/"
              className="
                inline-flex
                min-h-11
                items-center
                justify-center
                gap-3
                border
                border-bone
                bg-bone
                px-5
                text-[9px]
                font-semibold
                uppercase
                tracking-[0.16em]
                text-deep-indigo
                transition-colors
                hover:bg-coral-stone
              "
            >
              Return to Baharia
              <span aria-hidden="true">
                →
              </span>
            </Link>
          </div>
        </motion.section>
      </div>
    </main>
  );
}

function ConfirmationItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="bg-coral-stone/30 px-5 py-5">
      <span className="block text-[8px] uppercase tracking-[0.16em] text-bone/35">
        {label}
      </span>

      <span className="mt-2 block text-sm text-bone/80">
        {value}
      </span>
    </div>
  );
}
