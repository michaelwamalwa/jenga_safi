
"use client";
import AboutSection from "@/sections/about";
import LandingSection from "@/sections/landing";
import ContactSection from "@/sections/contact";
import dynamic from "next/dynamic";

const WaterWaveWrapper = dynamic (
  () => import("@/components/visualEffects/water-wave-wrapper"),
  { ssr: false}
);

export default function Home() {

  return (
     
    <WaterWaveWrapper
      imageUrl=""
      dropRadius={10}
      pertubance={0.5}
      resolution={1024}
    >
      {() => (
        <div className="pb-8">
          <div>
            <LandingSection />
   
            <AboutSection />
            
            <ContactSection />
            
          </div>
        </div>
      )}
    </WaterWaveWrapper>
  );
}



