
"use client";

 import WaterWaveWrapper from "@/components/visualEffects/water-wave-wrapper";
import AboutSection from "@/sections/about";
import FeaturedSection from "@/sections/featured";
import LandingSection from "@/sections/landing";
import ContactSection from "@/sections/contact";

export default function Home() {

  return (
     
    <WaterWaveWrapper
      imageUrl=""
      dropRadius="10"
      pertubance="0.5"
      resolution="1024"
    >
      {() => (
        <div className="pb-8">
          <div>
            <LandingSection />
           {/* <FeaturedSection />*/}
            <AboutSection />
            
            <ContactSection />
            
          </div>
        </div>
      )}
    </WaterWaveWrapper>
  );
}



