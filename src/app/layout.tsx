import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import { site } from "@/lib/site";
import "./globals.css";

/**
 * Geist is the display + body face. It's exposed as BOTH `--font-sans`
 * (our default) and `--font-geist` (the variable several 21st.dev
 * components reference via `font-geist`), so pasted code needs no edits.
 */
const geist = Geist({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
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
  themeColor: "#12161d",
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
        geist.variable,
      )}
      style={{ ["--font-geist" as string]: "var(--font-sans)" }}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col bg-black text-white selection:bg-helion-steel/30">
        {children}
      </body>
    </html>
  );
}
