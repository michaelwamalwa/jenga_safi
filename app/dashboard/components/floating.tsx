'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { Leaf, Droplets, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function FloatingLeaves() {
  const [particles, setParticles] = useState<{id: number, type: "leaf" | "water" | "sun"}[]>([]);
  
  useEffect(() => {
    // Initial particles
    const initialParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      type: ["leaf", "water", "sun"][Math.floor(Math.random() * 3)] as "leaf" | "water" | "sun"
    }));
    setParticles(initialParticles);
    
    // Add new particles periodically
    const interval = setInterval(() => {
      setParticles(prev => [
        ...prev.slice(-30), // Keep only last 30 particles
        {
          id: Date.now(),
          type: ["leaf", "water", "sun"][Math.floor(Math.random() * 3)] as "leaf" | "water" | "sun"
        }
      ]);
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
      <AnimatePresence>
        {particles.map(particle => (
          <motion.div
            key={particle.id}
            className="absolute top-0"
            initial={{ 
              x: Math.random() * window.innerWidth, 
              y: window.innerHeight + 100,
              rotate: Math.random() * 360,
              opacity: 0.7
            }}
            animate={{ 
              y: -100,
              x: Math.random() * 100 - 50 + Math.random() * 100,
              rotate: Math.random() * 360,
              opacity: [0.7, 0.3, 0]
            }}
            exit={{ opacity: 0 }}
            transition={{ 
              duration: 10 + Math.random() * 20,
              ease: "linear"
            }}
          >
            {particle.type === "leaf" && <Leaf className="text-green-400/50" size={24} />}
            {particle.type === "water" && <Droplets className="text-blue-300/50" size={24} />}
            {particle.type === "sun" && <Sun className="text-yellow-300/50" size={24} />}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}