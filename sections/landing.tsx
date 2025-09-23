import Header from "@/components/navigation/header/header";
import FancyButton from "@/components/ui/fancy-button";
import LiveClock from "@/components/ui/live-clock";
import MagneticWrapper from "@/components/visualEffects/magnetic-wrapper";
import React from "react";
import { FaLeaf } from "react-icons/fa";
import Link from "next/link";

export default function LandingSection() {
  return (
    <div className="relative h-screen overflow-hidden bg-gradient-to-b from-black via-gray-900 to-black text-white">
      <Header />

      {/* Call-to-Action (Join Us) */}
      <div className="fixed bottom-16 left-1/2 transform -translate-x-1/2 z-50">
        {/* Magnetic CTA for medium+ screens */}
        <div className="hidden md:block">
          <MagneticWrapper>
            <FancyButton text="Join JengaSafi" icon={<FaLeaf />} />
          </MagneticWrapper>
        </div>

        {/* Animated Gradient CTA for small screens */}
        <div className="md:hidden">
          <Link href="/signup">
            <button className="relative px-8 py-4 text-lg font-bold text-black bg-gradient-to-r from-green-400 to-emerald-500 rounded-full shadow-lg transition-transform transform hover:scale-110 hover:shadow-2xl">
              <span className="relative z-10">JOIN JENGASAFI</span>
              {/* Background Glow */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 opacity-50 blur-lg"></div>
            </button>
          </Link>
        </div>
      </div>

      {/* Live Clock */}
      <div className="absolute right-10 bottom-10 text-gray-400 text-sm sm:text-base">
        <LiveClock timeZone="Africa/Nairobi" />
      </div>

      {/* Hero Content */}
      <div className="flex flex-col justify-center items-center h-full text-center uppercase mt-8 animate-fade-in">
        {/* Brand Title */}
        <div className="font-bold leading-[1.1] tracking-tighter drop-shadow-lg">
          <h1 className="text-[12vw] sm:text-[8vw] md:text-[6vw] lg:text-[5vw] 2xl:text-[4rem] bg-gradient-to-r from-green-400 via-emerald-500 to-lime-400 bg-clip-text text-transparent">
            JENGASAFI
          </h1>
          <h2 className="text-[6vw] sm:text-[4vw] md:text-[3vw] lg:text-[2vw] text-gray-300 tracking-wide">
            Building a Greener Future
          </h2>
        </div>

        {/* Mission Statement */}
        <div className="mt-6 text-[4vw] sm:text-[2vw] md:text-lg lg:text-xl text-gray-300 leading-relaxed tracking-tight max-w-[90%] sm:max-w-[60%]">
          <p>Integrating the green economy into Kenya’s construction industry.</p>
          <p>Track emissions, source eco-materials, and build sustainably.</p>
        </div>

        {/* Additional Info */}
        <div className="mt-8 text-center text-base sm:text-lg lg:text-xl text-gray-400 max-w-[90%] sm:max-w-[60%]">
          <p>
            We connect builders, suppliers, and regulators to promote eco-friendly 
            materials, energy-efficient practices, and real-time carbon awareness — 
            creating sustainable cities, one project at a time.
          </p>
        </div>
      </div>

      {/* Subtle Grain Overlay for Depth */}
      <div className="absolute inset-0 pointer-events-none opacity-10 bg-[url('/textures/grain.png')] mix-blend-overlay"></div>
    </div>
  );
}
