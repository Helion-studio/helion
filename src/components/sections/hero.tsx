import ResponsiveHeroBanner from "@/components/ui/responsive-hero-banner";

export function Hero() {
  return (
    <ResponsiveHeroBanner
      logoUrl="/logo.png"
      logoAlt="Helion Studio"
      backgroundImageUrl="/hero/hero-bg.jpg"
      badgeLabel="New"
      badgeText="Booking Q4 builds"
      title="We build what others"
      titleLine2="only imagine"
      description="Helion Studio designs and ships production software — real-time platforms, developer tooling and interfaces that feel instant on every device."
      primaryButtonText="Start your project"
      primaryButtonHref="#contact"
      secondaryButtonText="Visit our work"
      secondaryButtonHref="#work"
      ctaButtonText="Start a project"
      ctaButtonHref="#contact"
      partnersTitle="Trusted by teams shipping at scale"
    />
  );
}
