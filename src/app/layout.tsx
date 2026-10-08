import type { Metadata, Viewport } from "next";
import { site } from "@/lib/site";
import { Navbar } from "@/components/sections/navbar";
import { Footer } from "@/components/sections/footer";
import { AmbientBackground } from "@/components/ambient-background";
import "./globals.css";

/**
 * Fonts are system-first so the site builds with zero network fetches.
 * To bring back the Sora / Manrope pairing:
 *
 *   import { Sora, Manrope } from "next/font/google";
 *   const sora = Sora({ subsets: ["latin"], weight: ["300", "500"], variable: "--font-sora-src" });
 *   const manrope = Manrope({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-manrope-src" });
 *
 * then add `${sora.variable} ${manrope.variable}` to <html className> and point
 * --font-display / --font-sans at those variables in src/app/globals.css.
 */
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
    <html lang="en" className="h-full scroll-smooth antialiased" suppressHydrationWarning>
      <body className="flex min-h-full flex-col bg-void text-white">
        <AmbientBackground />
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
