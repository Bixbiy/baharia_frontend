import {
  getRoomAvailability,
  calculateNights,
} from "./availability";

import {
  ROOM_TYPES,
  RATE_PLANS,
} from "./mock-data";

import {
  calculateRoomRateQuote,
} from "./pricing";

import type {
  AvailabilityQuery,
  AvailabilityResult,
  BookingProvider,
  CreateReservationInput,
  Reservation,
  RoomRateQuote,
  RoomTypeId,
  RatePlanId,
} from "./types";

function createConfirmationCode(): string {
  const timestamp =
    Date.now().toString(36);

  const random =
    Math.random()
      .toString(36)
      .slice(2, 7);

  return `BAH-${timestamp}-${random}`.toUpperCase();
}

function validateQuery(
  query: AvailabilityQuery,
): void {
  const checkIn = new Date(
    `${query.checkIn}T00:00:00Z`,
  );

  const today = new Date();

  today.setUTCHours(0, 0, 0, 0);

  if (Number.isNaN(checkIn.getTime())) {
    throw new Error("Invalid check-in date.");
  }

  if (
    query.adults < 1 ||
    query.adults > 10
  ) {
    throw new Error(
      "Adults must be between 1 and 10.",
    );
  }

  if (
    query.children < 0 ||
    query.children > 10
  ) {
    throw new Error(
      "Children must be between 0 and 10.",
    );
  }

  if (query.checkIn < today.toISOString().slice(0, 10)) {
    throw new Error(
      "Check-in cannot be in the past.",
    );
  }

  calculateNights(
    query.checkIn,
    query.checkOut,
  );
}

async function getAvailability(
  query: AvailabilityQuery,
): Promise<AvailabilityResult> {
  validateQuery(query);

  const nights = calculateNights(
    query.checkIn,
    query.checkOut,
  );

  return {
    checkIn: query.checkIn,
    checkOut: query.checkOut,
    nights,
    adults: query.adults,
    children: query.children,
    rooms: getRoomAvailability(query),
  };
}

async function getRoomRate(
  roomTypeId: RoomTypeId,
  ratePlanId: RatePlanId,
  query: AvailabilityQuery,
): Promise<RoomRateQuote> {
  validateQuery(query);

  const room = ROOM_TYPES.find(
    (item) => item.id === roomTypeId,
  );

  if (!room) {
    throw new Error(
      `Unknown room type: ${roomTypeId}.`,
    );
  }

  const ratePlan = RATE_PLANS.find(
    (plan) => plan.id === ratePlanId,
  );

  if (!ratePlan) {
    throw new Error(
      `Unknown rate plan: ${ratePlanId}.`,
    );
  }

  const availability =
    await getAvailability({
      ...query,
      roomTypeId,
    });

  const availableRoom =
    availability.rooms.find(
      (item) =>
        item.roomTypeId === roomTypeId,
    );

  if (
    !availableRoom ||
    availableRoom.availableUnits <= 0
  ) {
    throw new Error(
      "This room is no longer available for the selected dates.",
    );
  }

  const selectedRoom =
    ROOM_TYPES.find(
      (item) => item.id === roomTypeId,
    );

  if (!selectedRoom) {
    throw new Error(
      `Unable to resolve room ${roomTypeId}.`,
    );
  }

  return calculateRoomRateQuote({
    roomTypeId,
    ratePlanId,
    checkIn: query.checkIn,
    checkOut: query.checkOut,
    dailyRates:
      availableRoom.dailyRates,
    adults: query.adults,
    children: query.children,
    includedAdults: Math.min(
      selectedRoom.maxAdults,
      2,
    ),
  });
}

async function createReservation(
  input: CreateReservationInput,
): Promise<Reservation> {
  const query: AvailabilityQuery = {
    checkIn: input.room.checkIn,
    checkOut: input.room.checkOut,
    adults: input.room.adults,
    children: input.room.children,
    roomTypeId:
      input.room.roomTypeId,
  };

  const availability =
    await getAvailability(query);

  const roomAvailability =
    availability.rooms.find(
      (room) =>
        room.roomTypeId ===
        input.room.roomTypeId,
    );

  if (
    !roomAvailability ||
    roomAvailability.availableUnits <= 0
  ) {
    throw new Error(
      "The selected room is no longer available.",
    );
  }

  const createdAt =
    new Date().toISOString();

  return {
    id: `mock-${Date.now()}`,
    confirmationCode:
      createConfirmationCode(),
    status: "confirmed",
    paymentStatus: "paid",
    guest: input.guest,
    rooms: [input.room],
    createdAt,
    totalAmount:
      input.room.priceBreakdown.total,
    currency:
      input.room.priceBreakdown.currency,
  };
}

export const mockBookingProvider: BookingProvider = {
  getAvailability,
  getRoomRate,
  createReservation,
};