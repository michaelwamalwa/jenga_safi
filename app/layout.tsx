import type { Metadata } from "next";
import Providers from "./providers";
import { cn } from "@/lib/utils";
import { Bricolage_Grotesque, Oswald } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import GrainEffect from "@/components/visualEffects/grain.effect";
import { Cursor } from "@/components/cursor/cursor";

// Fonts
const MainFont = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-main",
  display: "swap",
});

const OswaldFont = Oswald({
  subsets: ["latin"],
  variable: "--font-oswald",
  display: "swap",
});

const AccentFont = localFont({
  src: "../public/assets/fonts/pixel.otf",
  variable: "--font-accent",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Jenga Safi | Building a Greener Tomorrow",
  description:
    "Jenga Safi drives sustainable construction and green economy innovation in Kenya.",
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
            // mobile-first background and typography
            "min-h-screen bg-gradient-to-b from-white via-gray-50 to-green-50 text-gray-900 antialiased",
            "px-4 sm:px-6 md:px-8", // padding adjusts with screen size
            "text-base sm:text-[0.95rem] md:text-[1rem] lg:text-[1.05rem]", // responsive font size
            MainFont.variable,
            OswaldFont.variable,
            AccentFont.variable
          )}
        >
          {/* lighter background effect on small screens */}
          <div className="fixed inset-0 -z-10">
            <GrainEffect opacity={0.05} />
          </div>

          {/* cursor hidden on mobile, eco-green on desktop */}
          <div className="hidden md:block">
            <Cursor color="#16a34a" />
          </div>

          {children}
        </body>
      </Providers>
    </html>
  );
}
