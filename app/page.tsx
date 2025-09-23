"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

import LandingSection from "@/sections/landing";
import AboutSection from "@/sections/about";
import ContactSection from "@/sections/contact";

// Lazy load water wave effect (only client-side)
const WaterWaveWrapper = dynamic(
  () => import("@/components/visualEffects/water-wave-wrapper"),
  { ssr: false }
);

export default function Home() {
  const [isWaterEffectSupported, setIsWaterEffectSupported] = useState(false);

  useEffect(() => {
    const checkWebGLSupport = () => {
      try {
        const canvas = document.createElement("canvas");
        const gl = canvas.getContext("webgl") as WebGLRenderingContext | null;

        return (
          gl &&
          typeof gl.getExtension === "function" &&
          gl.getExtension("OES_texture_float")
        );
      } catch {
        return false;
      }
    };

    if (checkWebGLSupport()) {
      console.log("✅ WebGL + OES_texture_float supported! Applying water effect...");
      setIsWaterEffectSupported(true);
    } else {
      console.log("❌ OES_texture_float not supported! Using fallback...");
      setIsWaterEffectSupported(false);
    }
  }, []);

  return (
    <div className="pb-8">
      <LandingSection />

      {isWaterEffectSupported ? (
        <WaterWaveWrapper
          imageUrl=""
          dropRadius={10}
          pertubance={0.5} // fixed typo
          resolution={1024}
        >
          {() => <AboutSection />}
        </WaterWaveWrapper>
      ) : (
        <AboutSection />
      )}

      <ContactSection />
    </div>
  );
}
