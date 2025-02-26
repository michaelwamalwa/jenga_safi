"use client";
import AboutSection from "@/sections/about";
import LandingSection from "@/sections/landing";
import ContactSection from "@/sections/contact";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const WaterWaveWrapper = dynamic(
  () => import("@/components/visualEffects/water-wave-wrapper"),
  { ssr: false }
);

export default function Home() {
  const [isWaterEffectSupported, setIsWaterEffectSupported] = useState(false);

  useEffect(() => {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl") as WebGLRenderingContext | null;

    if (gl && typeof gl.getExtension === "function" && gl.getExtension("OES_texture_float")) {
      console.log("✅ WebGL + OES_texture_float supported! Applying water effect...");
      setIsWaterEffectSupported(true);
    } else {
      console.log("❌ OES_texture_float not supported! Using fallback...");
      setIsWaterEffectSupported(false);
    }
  }, []);

  return (
    <div className="pb-8">
      <div>
        <LandingSection />

        {isWaterEffectSupported ? (
          <WaterWaveWrapper imageUrl="" dropRadius={10} pertubance={0.5} resolution={1024}>
            {() => <AboutSection />}
          </WaterWaveWrapper>
        ) : (
          <AboutSection /> 
        )}

        <ContactSection />
      </div>
    </div>
  );
}
