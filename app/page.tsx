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

// Helper to check WebGL + extension support
function supportsWaterEffect(): boolean {
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl") as WebGLRenderingContext | null;
    return (
      !!gl &&
      typeof gl.getExtension === "function" &&
      !!gl.getExtension("OES_texture_float")
    );
  } catch {
    return false;
  }
}

export default function Home() {
  const [isWaterEffectSupported, setIsWaterEffectSupported] = useState(false);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      console.log("⚠️ Reduced motion preference detected, disabling water effect.");
      setIsWaterEffectSupported(false);
      return;
    }

    if (supportsWaterEffect()) {
      console.log("✅ WebGL + OES_texture_float supported! Applying water effect...");
      setIsWaterEffectSupported(true);
    } else {
      console.log("❌ OES_texture_float not supported! Using fallback...");
      setIsWaterEffectSupported(false);
    }
  }, []);

  // Pick resolution based on device width
  const resolution = typeof window !== "undefined" && window.innerWidth < 768 ? 512 : 1024;

  return (
    <div className="pb-8">
      <LandingSection />

      {isWaterEffectSupported ? (
        <WaterWaveWrapper
          imageUrl=""
          dropRadius={10}
          perturbance={0.5} // ✅ fixed spelling
          resolution={resolution}
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
