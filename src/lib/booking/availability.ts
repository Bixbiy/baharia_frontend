import {
  MOCK_RESERVATIONS,
  ROOM_TYPES,
  SEASONAL_RATES,
} from "./mock-data";

import type {
  AvailabilityQuery,
  AvailabilityRestriction,
  DailyRate,
  RoomAvailability,
  RoomTypeId,
} from "./types";

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

function parseDate(value: string): Date {
  if (!DATE_PATTERN.test(value)) {
    throw new Error(
      `Invalid date format: ${value}. Expected YYYY-MM-DD.`,
    );
  }

  const [year, month, day] = value
    .split("-")
    .map(Number);

  const date = new Date(
    Date.UTC(year, month - 1, day),
  );

  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    throw new Error(`Invalid calendar date: ${value}.`);
  }

  return date;
}

function formatDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function calculateNights(
  checkIn: string,
  checkOut: string,
): number {
  const start = parseDate(checkIn);
  const end = parseDate(checkOut);

  const millisecondsPerDay =
    1000 * 60 * 60 * 24;

  const difference =
    end.getTime() - start.getTime();

  const nights = Math.round(
    difference / millisecondsPerDay,
  );

  if (nights <= 0) {
    throw new Error(
      "Check-out must be after check-in.",
    );
  }

  return nights;
}

export function getDateRange(
  checkIn: string,
  checkOut: string,
): string[] {
  const start = parseDate(checkIn);
  const end = parseDate(checkOut);

  const dates: string[] = [];

  for (
    let date = start;
    date < end;
    date = new Date(
      date.getTime() +
        1000 * 60 * 60 * 24,
    )
  ) {
    dates.push(formatDate(date));
  }

  return dates;
}

function datesOverlap(
  firstCheckIn: string,
  firstCheckOut: string,
  secondCheckIn: string,
  secondCheckOut: string,
): boolean {
  return (
    firstCheckIn < secondCheckOut &&
    firstCheckOut > secondCheckIn
  );
}

function getBaseNightlyRate(
  roomTypeId: RoomTypeId,
  date: string,
): number {
  const seasonalRate = SEASONAL_RATES.find(
    (rate) =>
      rate.roomTypeId === roomTypeId &&
      date >= rate.startDate &&
      date <= rate.endDate,
  );

  if (!seasonalRate) {
    throw new Error(
      `No rate configured for ${roomTypeId} on ${date}.`,
    );
  }

  return seasonalRate.nightlyRate;
}

function getAvailableUnits(
  roomTypeId: RoomTypeId,
  checkIn: string,
  checkOut: string,
  totalUnits: number,
): number {
  const overlappingReservations =
    MOCK_RESERVATIONS.filter(
      (reservation) =>
        reservation.roomTypeId === roomTypeId &&
        datesOverlap(
          checkIn,
          checkOut,
          reservation.checkIn,
          reservation.checkOut,
        ),
    );

  const occupiedUnits =
    overlappingReservations.reduce(
      (total, reservation) =>
        total + reservation.units,
      0,
    );

  return Math.max(
    totalUnits - occupiedUnits,
    0,
  );
}

function getRestrictions(): AvailabilityRestriction {
  return {
    closed: false,
    closedToArrival: false,
    closedToDeparture: false,
    minimumNights: 1,
    maximumNights: 14,
  };
}

function createDailyRates(
  roomTypeId: RoomTypeId,
  dates: readonly string[],
): DailyRate[] {
  return dates.map((date) => ({
    date,
    amount: getBaseNightlyRate(
      roomTypeId,
      date,
    ),
    currency: "USD",
  }));
}

function isOccupancyAllowed(
  roomTypeId: RoomTypeId,
  adults: number,
  children: number,
): boolean {
  const room = ROOM_TYPES.find(
    (item) => item.id === roomTypeId,
  );

  if (!room) {
    return false;
  }

  return (
    adults > 0 &&
    adults <= room.maxAdults &&
    children <= room.maxChildren &&
    adults + children <= room.maxOccupancy
  );
}

export function getRoomAvailability(
  query: AvailabilityQuery,
): RoomAvailability[] {
  const nights = calculateNights(
    query.checkIn,
    query.checkOut,
  );

  const dates = getDateRange(
    query.checkIn,
    query.checkOut,
  );

  const requestedRooms = query.roomTypeId
    ? ROOM_TYPES.filter(
        (room) =>
          room.id === query.roomTypeId,
      )
    : ROOM_TYPES;

  return requestedRooms
    .map((room) => {
      const restrictions = getRestrictions();

      const occupancyAllowed =
        isOccupancyAllowed(
          room.id,
          query.adults,
          query.children,
        );

      const availableUnits =
        occupancyAllowed &&
        nights >=
          restrictions.minimumNights &&
        (!restrictions.maximumNights ||
          nights <=
            restrictions.maximumNights)
          ? getAvailableUnits(
              room.id,
              query.checkIn,
              query.checkOut,
              room.totalUnits,
            )
          : 0;

      return {
        roomTypeId: room.id,
        availableUnits,
        restrictions,
        dailyRates: createDailyRates(
          room.id,
          dates,
        ),
      };
    })
    .filter(
      (room) =>
        room.availableUnits > 0 &&
        !room.restrictions.closed,
    );
}

export function checkAvailability(
  query: AvailabilityQuery,
): boolean {
  return getRoomAvailability(query).some(
    (room) => room.availableUnits > 0,
  );
}