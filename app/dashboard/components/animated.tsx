'use client';
import { motion } from 'framer-motion';

export default function AnimatedCard({ 
  children, 
  delay = 0,
  className = ""
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={`bg-white/90 backdrop-blur-sm rounded-2xl border border-emerald-100 shadow-sm ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -5 }}
    >
      {children}
    </motion.div>
  );
}