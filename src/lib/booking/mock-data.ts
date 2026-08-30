import type {
  RatePlan,
  RoomType,
  RoomTypeId,
} from "./types";

export const ROOM_TYPES: readonly RoomType[] = [
  {
    id: "signature",
    name: "The Signature",
    category: "Signature Suite",
    shortDescription:
      "Warm materials, natural light, and a quiet relationship with the coast.",
    description:
      "A refined private suite shaped around natural light, tactile materials, and uninterrupted views through the landscape.",
    image: "/signature.jpeg",
    imageAlt: "Baharia Signature Suite",

    maxAdults: 2,
    maxChildren: 1,
    maxOccupancy: 3,

    totalUnits: 4,

    amenities: [
      "King bed",
      "Private terrace",
      "Coastal view",
      "Rain shower",
      "Natural stone bath",
      "Complimentary breakfast",
    ],
  },

  {
    id: "coastal",
    name: "The Coastal",
    category: "Coastal Suite",
    shortDescription:
      "A softer retreat opening toward the surrounding landscape.",
    description:
      "An intimate suite designed to bring the surrounding landscape into the room through generous openings and natural materials.",
    image: "/coastal.jpeg",
    imageAlt: "Baharia Coastal Suite",

    maxAdults: 2,
    maxChildren: 1,
    maxOccupancy: 3,

    totalUnits: 3,

    amenities: [
      "King bed",
      "Private garden terrace",
      "Coastal view",
      "Rain shower",
      "Outdoor seating",
      "Complimentary breakfast",
    ],
  },

  {
    id: "ocean",
    name: "The Ocean",
    category: "Ocean Residence",
    shortDescription:
      "More space, wider horizons, and exceptional privacy.",
    description:
      "A larger residence with expansive living space, a generous terrace, and an uninterrupted relationship with the horizon.",
    image: "/ocean.jpeg",
    imageAlt: "Baharia Ocean Residence",

    maxAdults: 3,
    maxChildren: 2,
    maxOccupancy: 5,

    totalUnits: 2,

    amenities: [
      "King bed",
      "Separate living area",
      "Large private terrace",
      "Ocean outlook",
      "Deep soaking bath",
      "Complimentary breakfast",
    ],
  },

  {
    id: "private-villa",
    name: "The Private Villa",
    category: "Private Villa",
    shortDescription:
      "A secluded residence designed for complete privacy.",
    description:
      "Baharia's most private accommodation, combining generous indoor space with a secluded terrace and its own intimate atmosphere.",
    image: "/private_villa.jpeg",
    imageAlt: "Baharia Private Villa",

    maxAdults: 4,
    maxChildren: 2,
    maxOccupancy: 6,

    totalUnits: 1,

    amenities: [
      "King bedroom",
      "Separate living room",
      "Private terrace",
      "Private garden",
      "Deep soaking bath",
      "Complimentary breakfast",
    ],
  },
];

export const RATE_PLANS: readonly RatePlan[] = [
  {
    id: "flexible",
    name: "Flexible Rate",
    description:
      "Modify or cancel your reservation according to the flexible cancellation policy.",
    cancellationPolicy:
      "Free cancellation up to 72 hours before arrival.",
    refundable: true,
    priceModifierType: "percentage",
    priceModifierValue: 0,
  },

  {
    id: "non-refundable",
    name: "Advance Purchase",
    description:
      "A lower rate in exchange for a non-refundable reservation.",
    cancellationPolicy:
      "Non-refundable after booking.",
    refundable: false,
    priceModifierType: "percentage",
    priceModifierValue: -12,
  },
];

type SeasonalRate = {
  roomTypeId: RoomTypeId;

  startDate: string;
  endDate: string;

  nightlyRate: number;
};

export const SEASONAL_RATES: readonly SeasonalRate[] = [
  {
    roomTypeId: "signature",
    startDate: "2026-01-01",
    endDate: "2026-12-31",
    nightlyRate: 320,
  },

  {
    roomTypeId: "coastal",
    startDate: "2026-01-01",
    endDate: "2026-12-31",
    nightlyRate: 380,
  },

  {
    roomTypeId: "ocean",
    startDate: "2026-01-01",
    endDate: "2026-12-31",
    nightlyRate: 520,
  },

  {
    roomTypeId: "private-villa",
    startDate: "2026-01-01",
    endDate: "2026-12-31",
    nightlyRate: 780,
  },
] as const;

/*
 * Mock reservations deliberately occupy some future dates.
 *
 * This gives the booking engine something real to calculate
 * against instead of returning every room as available.
 */
export const MOCK_RESERVATIONS = [
  {
    id: "RES-001",
    roomTypeId: "signature" as const,
    checkIn: "2026-09-18",
    checkOut: "2026-09-21",
    units: 1,
  },

  {
    id: "RES-002",
    roomTypeId: "signature" as const,
    checkIn: "2026-09-20",
    checkOut: "2026-09-24",
    units: 1,
  },

  {
    id: "RES-003",
    roomTypeId: "coastal" as const,
    checkIn: "2026-09-19",
    checkOut: "2026-09-23",
    units: 1,
  },

  {
    id: "RES-004",
    roomTypeId: "ocean" as const,
    checkIn: "2026-10-05",
    checkOut: "2026-10-09",
    units: 1,
  },

  {
    id: "RES-005",
    roomTypeId: "private-villa" as const,
    checkIn: "2026-09-25",
    checkOut: "2026-09-30",
    units: 1,
  },
] as const;

export const PRICING = {
  currency: "USD" as const,

  taxRate: 0.1,

  serviceFeeRate: 0.05,

  extraAdultRate: 80,

  extraChildRate: 40,
} as const;