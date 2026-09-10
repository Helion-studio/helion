import type { Metadata, Viewport } from "next";
import { Sora, Manrope } from "next/font/google";
import { cn } from "@/lib/utils";
import { site } from "@/lib/site";
import { Navbar } from "@/components/sections/navbar";
import { Footer } from "@/components/sections/footer";
import { VisitTracker } from "@/components/visit-tracker";
import "./globals.css";

/** Display / headlines / tags — crisp premium-tech (free alt to the Nevera look). */
const sora = Sora({
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "500"],
  variable: "--font-sora-src",
});

/** Body / UI / nav. */
const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500"],
  variable: "--font-manrope-src",
});

export const metadata: Metadata = {
  metadataBase: new URL(`https://${site.domain}`),
  title: {
    default: `${site.fullName} — ${site.tagline}`,
    template: `%s · ${site.fullName}`,
  },
  description: site.description,
  openGraph: {
    title: `${site.fullName} — ${site.tagline}`,
    description: site.description,
    type: "website",
    siteName: site.fullName,
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#030508",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={cn(
        "dark h-full scroll-smooth font-sans antialiased",
        sora.variable,
        manrope.variable,
      )}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col bg-void text-white">
        <Navbar />
        {children}
        <Footer />
        <VisitTracker />
      </body>
    </html>
  );
}
