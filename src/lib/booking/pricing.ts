import {
  PRICING,
  RATE_PLANS,
} from "./mock-data";

import type {
  DailyRate,
  PriceBreakdown,
  RatePlanId,
  RoomRateQuote,
} from "./types";

import { calculateNights } from "./availability";

function roundCurrency(
  value: number,
): number {
  return Math.round(
    (value + Number.EPSILON) * 100,
  ) / 100;
}

export function getRatePlan(
  ratePlanId: RatePlanId,
) {
  const ratePlan = RATE_PLANS.find(
    (plan) => plan.id === ratePlanId,
  );

  if (!ratePlan) {
    throw new Error(
      `Unknown rate plan: ${ratePlanId}.`,
    );
  }

  return ratePlan;
}

function applyRatePlanModifier(
  nightlyRate: number,
  ratePlanId: RatePlanId,
): number {
  const ratePlan = getRatePlan(ratePlanId);

  if (
    ratePlan.priceModifierType ===
    "percentage"
  ) {
    return roundCurrency(
      nightlyRate *
        (1 +
          ratePlan.priceModifierValue /
            100),
    );
  }

  return roundCurrency(
    nightlyRate +
      ratePlan.priceModifierValue,
  );
}

export function calculateRoomSubtotal(
  dailyRates: readonly DailyRate[],
  ratePlanId: RatePlanId,
): number {
  return roundCurrency(
    dailyRates.reduce(
      (total, dailyRate) =>
        total +
        applyRatePlanModifier(
          dailyRate.amount,
          ratePlanId,
        ),
      0,
    ),
  );
}

export function calculateExtraGuestSubtotal(
  adults: number,
  children: number,
  includedAdults: number,
): number {
  const extraAdults = Math.max(
    adults - includedAdults,
    0,
  );

  const adultCharge =
    extraAdults * PRICING.extraAdultRate;

  const childCharge =
    children * PRICING.extraChildRate;

  return roundCurrency(
    adultCharge + childCharge,
  );
}

export function calculatePriceBreakdown({
  dailyRates,
  ratePlanId,
  adults,
  children,
  includedAdults,
}: {
  dailyRates: readonly DailyRate[];
  ratePlanId: RatePlanId;
  adults: number;
  children: number;
  includedAdults: number;
}): PriceBreakdown {
  const roomSubtotal =
    calculateRoomSubtotal(
      dailyRates,
      ratePlanId,
    );

  const extraGuestSubtotal =
    calculateExtraGuestSubtotal(
      adults,
      children,
      includedAdults,
    );

  const discount = 0;

  const subtotalBeforeTax = roundCurrency(
    roomSubtotal +
      extraGuestSubtotal -
      discount,
  );

  const taxes = roundCurrency(
    subtotalBeforeTax *
      PRICING.taxRate,
  );

  const fees = roundCurrency(
    subtotalBeforeTax *
      PRICING.serviceFeeRate,
  );

  const total = roundCurrency(
    subtotalBeforeTax +
      taxes +
      fees,
  );

  return {
    roomSubtotal,
    extraGuestSubtotal,
    taxes,
    fees,
    discount,
    subtotalBeforeTax,
    total,
    currency: PRICING.currency,

    lines: [
      {
        label: "Accommodation",
        amount: roomSubtotal,
        currency: PRICING.currency,
      },
      ...(extraGuestSubtotal > 0
        ? [
            {
              label: "Additional guests",
              amount: extraGuestSubtotal,
              currency: PRICING.currency,
            },
          ]
        : []),
      {
        label: "Taxes",
        amount: taxes,
        currency: PRICING.currency,
      },
      {
        label: "Service fee",
        amount: fees,
        currency: PRICING.currency,
      },
    ],
  };
}

export function calculateRoomRateQuote({
  roomTypeId,
  ratePlanId,
  checkIn,
  checkOut,
  dailyRates,
  adults,
  children,
  includedAdults = 2,
}: {
  roomTypeId: RoomRateQuote["roomTypeId"];
  ratePlanId: RatePlanId;
  checkIn: string;
  checkOut: string;
  dailyRates: readonly DailyRate[];
  adults: number;
  children: number;
  includedAdults?: number;
}): RoomRateQuote {
  const nights = calculateNights(
    checkIn,
    checkOut,
  );

  if (dailyRates.length !== nights) {
    throw new Error(
      "Daily rate count does not match stay length.",
    );
  }

  const roomSubtotal =
    calculateRoomSubtotal(
      dailyRates,
      ratePlanId,
    );

  const extraGuestSubtotal =
    calculateExtraGuestSubtotal(
      adults,
      children,
      includedAdults,
    );

  const priceBreakdown =
    calculatePriceBreakdown({
      dailyRates,
      ratePlanId,
      adults,
      children,
      includedAdults,
    });

  return {
    roomTypeId,
    ratePlanId,
    checkIn,
    checkOut,
    nights,
    dailyRates,
    roomSubtotal,
    extraGuestSubtotal,
    priceBreakdown,
  };
}