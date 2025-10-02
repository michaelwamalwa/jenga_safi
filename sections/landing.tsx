import Header from "@/components/navigation/header/header";
import FancyButton from "@/components/ui/fancy-button";
import LiveClock from "@/components/ui/live-clock";
import MagneticWrapper from "@/components/visualEffects/magnetic-wrapper";
import React from "react";
import { FaLeaf } from "react-icons/fa";
import Link from "next/link";

export default function LandingSection() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-black via-gray-900 to-black text-white flex flex-col">
      <Header />

      {/* Hero Content */}
      <div className="flex flex-col justify-center items-center flex-1 text-center uppercase px-4 py-8 sm:py-12 md:py-16 lg:py-20">
        {/* Brand Title */}
        <div className="font-bold leading-[1.1] tracking-tighter drop-shadow-lg mb-4 sm:mb-6 md:mb-8">
          <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl bg-gradient-to-r from-green-400 via-emerald-500 to-lime-400 bg-clip-text text-transparent">
            JENGASAFI
          </h1>
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-gray-300 tracking-wide mt-2 sm:mt-4">
            Building a Greener Future
          </h2>
        </div>

        {/* Mission Statement */}
        <div className="mt-4 sm:mt-6 md:mt-8 text-base sm:text-lg md:text-xl lg:text-2xl text-gray-300 leading-relaxed tracking-tight max-w-4xl px-4">
          <p className="mb-3 sm:mb-4">Integrating the green economy into Kenya's construction industry.</p>
          <p>Track emissions, source eco-materials, and build sustainably.</p>
        </div>

        {/* Additional Info */}
        <div className="mt-6 sm:mt-8 md:mt-10 text-center text-sm sm:text-base md:text-lg lg:text-xl text-gray-400 max-w-3xl px-4">
          <p>
            We connect builders, suppliers, and regulators to promote eco-friendly
            materials, energy-efficient practices, and real-time carbon awareness —
            creating sustainable cities, one project at a time.
          </p>
        </div>
      </div>

      {/* Call-to-Action (Join Us) */}
      <div className="fixed bottom-8 sm:bottom-12 left-1/2 transform -translate-x-1/2 z-50">
        {/* Magnetic CTA for medium+ screens */}
        <div className="hidden md:block">
          <MagneticWrapper>
            <FancyButton text="Join JengaSafi" icon={<FaLeaf />} />
          </MagneticWrapper>
        </div>

        {/* Animated Gradient CTA for small screens */}
        <div className="md:hidden">
          <Link href="/signup">
            <button className="relative px-8 py-4 text-lg font-bold text-black bg-gradient-to-r from-green-400 to-emerald-500 rounded-full shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-2xl active:scale-105">
              <span className="relative z-10 flex items-center gap-2">
                <FaLeaf className="text-lg" />
                JOIN JENGASAFI
              </span>
              {/* Background Glow */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 opacity-50 blur-lg transition-opacity duration-300 hover:opacity-70"></div>
            </button>
          </Link>
        </div>
      </div>

      {/* Live Clock */}
      <div className="absolute right-4 sm:right-6 bottom-4 sm:bottom-6 text-gray-400 text-sm sm:text-base">
        <LiveClock timeZone="Africa/Nairobi" />
      </div>

      {/* Subtle Grain Overlay for Depth */}
      <div className="absolute inset-0 pointer-events-none opacity-10 bg-[url('/textures/grain.png')] mix-blend-overlay"></div>
    </div>
  );
}