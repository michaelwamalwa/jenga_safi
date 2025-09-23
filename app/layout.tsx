import type { Metadata } from "next";
import Providers from "./providers";
import { cn } from "@/lib/utils";
import { Bricolage_Grotesque, Oswald } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import GrainEffect from "@/components/visualEffects/grain.effect";
import { Cursor } from "@/components/cursor/cursor";

// Fonts
const MainFont = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-main" });
const OswaldFont = Oswald({ subsets: ["latin"], variable: "--font-oswald" });
const AccentFont = localFont({
  src: "../public/assets/fonts/pixel.otf", // Replace with eco-serif if possible
  variable: "--font-accent",
});

export const metadata: Metadata = {
  title: "Jenga Safi | Building a Greener Tomorrow",
  description: "Jenga Safi drives sustainable construction and green economy innovation in Kenya.",
  keywords: ["green economy", "sustainable construction", "Kenya", "Jenga Safi"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <Providers>
        <body
          className={cn(
            "bg-gradient-to-b from-white via-gray-50 to-green-50 text-gray-900 antialiased",
            MainFont.variable,
            OswaldFont.variable,
            AccentFont.variable
          )}
        >
          <GrainEffect opacity={0.08} /> {/* subtle background texture */}
          <Cursor color="#16a34a" /> {/* eco-green cursor */}
          {children}
        </body>
      </Providers>
    </html>
  );
}
