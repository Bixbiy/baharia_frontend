import type { Metadata } from "next";

import { BookingCanvas } from "@/components/booking/booking-canvas";

export const metadata: Metadata = {
  title: "Reserve Your Stay | Baharia",
  description:
    "Choose your dates, discover available Baharia rooms, and complete your reservation in one seamless booking experience.",
  alternates: {
    canonical: "/booking",
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default function BookingPage() {
  return <BookingCanvas />;
}