"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import FloatingLeaves from "./components/floating";
import EcoStats from "./components/ecostats";

export default function DashboardPage() {
  const [ecoPoints, setEcoPoints] = useState(1240);
  const [carbonSaved, setCarbonSaved] = useState(42.5);
  const [waterSaved, setWaterSaved] = useState(1240);

  const handleTaskComplete = () => {
    // Animate eco points increase
    setEcoPoints((prev) => {
      const newPoints = prev + 50;
      animateValue(prev, newPoints, setEcoPoints);
      return newPoints;
    });

    // Animate carbon saved
    setCarbonSaved((prev) => {
      const newCarbon = prev + 1.2;
      animateValue(prev, newCarbon, setCarbonSaved, 1);
      return newCarbon;
    });
  };

  const animateValue = (
    start: number,
    end: number,
    setter: (value: number) => void,
    decimals: number = 0
  ) => {
    const duration = 1500;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const value = parseFloat(
        (start + (end - start) * progress).toFixed(decimals)
      );

      setter(value);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-cyan-50 relative">
      <FloatingLeaves />

      <div className="container mx-auto px-4 py-8">
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-emerald-800 flex items-center gap-3">
            <span className="bg-green-100 p-3 rounded-xl">🌱</span>
            <div>
              Nexora Dashboard
              <p className="text-lg font-normal text-emerald-600">
                Eco-friendly task management
              </p>
            </div>
          </h1>
        </motion.div>

        <EcoStats
          ecoPoints={ecoPoints}
          carbonSaved={carbonSaved}
          waterSaved={waterSaved}
        />
        <motion.div
          className="mt-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-8 text-white"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">
              Join the Sustainability Movement
            </h2>
            <p className="mb-6 text-green-100">
              Every task you complete contributes to our collective
              environmental impact. Together we've saved {carbonSaved}kg of CO2
              and {waterSaved}L of water this month!
            </p>
            <motion.button
              className="bg-white text-emerald-700 font-bold px-6 py-3 rounded-full hover:bg-green-50 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Share Your Impact
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
