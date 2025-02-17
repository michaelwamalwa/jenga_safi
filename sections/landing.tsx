import Header from "@/components/navigation/header/header";
import FancyButton from "@/components/ui/fancy-button";
import LiveClock from "@/components/ui/live-clock";
import MagneticWrapper from "@/components/visualEffects/magnetic-wrapper";
import React from "react";
import { FaMailchimp } from "react-icons/fa";

export default function LandingSection() {
  return (
    <div className="relative h-screen overflow-hidden p-8 bg-black text-white">
      <Header />

      {/* Magnetic Button for small screens */}
      <div className="absolute bottom-16 left-8 z-20 md:hidden">
        <MagneticWrapper>
          <FancyButton text="Join Us" icon={<FaMailchimp />} />
        </MagneticWrapper>
      </div>
  

      {/* Live Clock */}
      <div className="absolute right-10 bottom-10 text-gray-400">
        <LiveClock timeZone="Europe/Belgrade" />
      </div>

      {/* Main Content */}
      <div className="flex flex-col justify-start items-center h-full text-center uppercase mt-8">
        {/* Main Title */}
        <div className="font-bold leading-[1.1] tracking-tight">
          <h1 className="text-[10vw] sm:text-[8vw] md:text-[6vw] lg:text-[5vw] 2xl:text-[4rem]">
            Construction
          </h1>
          <h1 className="text-[10vw] sm:text-[8vw] md:text-[6vw] lg:text-[5vw] 2xl:text-[4rem]">
            Green-Economy
          </h1>
        </div>

        {/* Supporting Text */}
        <div className="mt-6 text-[3vw] sm:text-[1.8vw] md:text-lg lg:text-xl text-gray-300 leading-relaxed tracking-tight max-w-[90%] sm:max-w-[60%]">
          <p>Including green economy</p>
          <p>To your construction plans</p>
          
        </div>

        {/* Additional Information */}
        <div className="mt-8 text-center text-lg sm:text-xl text-gray-400 max-w-[90%] sm:max-w-[60%]">
          <p>
           We focus on eco-friendly
            materials, energy-efficient solutions, and sustainable practices that
            contribute to a better future for both the planet and the people we
            serve.
          </p>
        </div>
      </div>
    </div>
  );
}
