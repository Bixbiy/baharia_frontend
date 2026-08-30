export type Currency = "USD";

export type RoomTypeId =
  | "signature"
  | "coastal"
  | "ocean"
  | "private-villa";

export type RatePlanId =
  | "flexible"
  | "non-refundable";

export type ReservationStatus =
  | "pending"
  | "confirmed"
  | "cancelled";

export type PaymentStatus =
  | "unpaid"
  | "pending"
  | "paid"
  | "refunded";

export type AvailabilityRestriction = {
  closed: boolean;
  closedToArrival: boolean;
  closedToDeparture: boolean;
  minimumNights: number;
  maximumNights: number | null;
};

export type DailyRate = {
  date: string;
  amount: number;
  currency: Currency;
};

export type RoomType = {
  id: RoomTypeId;
  name: string;
  category: string;
  description: string;
  shortDescription: string;

  image: string;
  imageAlt: string;

  maxAdults: number;
  maxChildren: number;
  maxOccupancy: number;

  totalUnits: number;

  amenities: readonly string[];
};

export type RatePlan = {
  id: RatePlanId;
  name: string;
  description: string;

  cancellationPolicy: string;

  refundable: boolean;

  priceModifierType:
    | "percentage"
    | "fixed";

  priceModifierValue: number;
};

export type RoomAvailability = {
  roomTypeId: RoomTypeId;

  availableUnits: number;

  restrictions: AvailabilityRestriction;

  dailyRates: readonly DailyRate[];
};

export type AvailabilityQuery = {
  checkIn: string;
  checkOut: string;

  adults: number;
  children: number;

  roomTypeId?: RoomTypeId;
};

export type AvailabilityResult = {
  checkIn: string;
  checkOut: string;

  nights: number;

  adults: number;
  children: number;

  rooms: readonly RoomAvailability[];
};

export type PriceBreakdownLine = {
  label: string;
  amount: number;
  currency: Currency;
};

export type PriceBreakdown = {
  roomSubtotal: number;

  extraGuestSubtotal: number;

  taxes: number;

  fees: number;

  discount: number;

  subtotalBeforeTax: number;

  total: number;

  currency: Currency;

  lines: readonly PriceBreakdownLine[];
};

export type RoomRateQuote = {
  roomTypeId: RoomTypeId;
  ratePlanId: RatePlanId;

  checkIn: string;
  checkOut: string;

  nights: number;

  dailyRates: readonly DailyRate[];

  roomSubtotal: number;

  extraGuestSubtotal: number;

  priceBreakdown: PriceBreakdown;
};

export type GuestDetails = {
  firstName: string;
  lastName: string;

  email: string;
  phone: string;

  country: string;

  specialRequests?: string;
};

export type ReservationRoom = {
  roomTypeId: RoomTypeId;
  ratePlanId: RatePlanId;

  adults: number;
  children: number;

  checkIn: string;
  checkOut: string;

  nights: number;

  priceBreakdown: PriceBreakdown;
};

export type Reservation = {
  id: string;

  confirmationCode: string;

  status: ReservationStatus;

  paymentStatus: PaymentStatus;

  guest: GuestDetails;

  rooms: readonly ReservationRoom[];

  createdAt: string;

  totalAmount: number;
  currency: Currency;
};

export type CreateReservationInput = {
  guest: GuestDetails;

  room: ReservationRoom;
};

export interface BookingProvider {
  getAvailability(
    query: AvailabilityQuery,
  ): Promise<AvailabilityResult>;

  getRoomRate(
    roomTypeId: RoomTypeId,
    ratePlanId: RatePlanId,
    query: AvailabilityQuery,
  ): Promise<RoomRateQuote>;

  createReservation(
    input: CreateReservationInput,
  ): Promise<Reservation>;
}