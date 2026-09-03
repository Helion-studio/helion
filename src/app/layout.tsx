import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import { cn } from "@/lib/utils";
import { site } from "@/lib/site";
import "./globals.css";

/** Body / UI / nav. */
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600"],
  variable: "--font-inter-src",
});

/** Display / headlines / tags. */
const grotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "500", "600", "700"],
  variable: "--font-grotesk-src",
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
        inter.variable,
        grotesk.variable,
      )}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col bg-void text-white">
        {children}
      </body>
    </html>
  );
}
