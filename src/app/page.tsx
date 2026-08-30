import { AboutStory } from "@/components/home/about-story";
import { BahariaHero } from "@/components/home/baharia-hero";
import { BrandStatement } from "@/components/home/brand-statement";
import { ExperienceShowcase } from "@/components/home/experience-showcase";
import { ExploreBaharia } from "@/components/home/explore-baharia";
import { FinalBookingCta } from "@/components/home/final-booking-cta";
import { RoomsTeaser } from "@/components/home/rooms-teaser";
import { SiteFooter } from "@/components/home/site-footer";
import { SocialProof } from "@/components/home/social-proof";
import { SiteHeader } from "@/components/navigation/site-header";

export default function Home() {
  return (
    <>
      <SiteHeader />

      <main>
        <BahariaHero />

        <BrandStatement />

        <RoomsTeaser />

        <ExploreBaharia />

        <ExperienceShowcase />

        <AboutStory />

        <SocialProof />

        <FinalBookingCta />
      </main>

      <SiteFooter />
    </>
  );
}