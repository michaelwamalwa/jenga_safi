"use client";
import { FC, ReactNode, useRef, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface MagneticWrapperProps {
  className?: string;
  children: ReactNode;
}

const MagneticWrapper: FC<MagneticWrapperProps> = ({ className, children }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isTouch, setIsTouch] = useState(false);

  // Handle Mouse Move (For Desktops)
  const handleMouse = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (isTouch) return; // Ignore mouse events if touch is detected

    const { clientX, clientY } = e;
    const boundingRect = ref.current?.getBoundingClientRect();
    if (boundingRect) {
      const { width, height, top, left } = boundingRect;
      const middleX = clientX - (left + width / 2);
      const middleY = clientY - (top + height / 2);
      setPosition({ x: middleX, y: middleY });
    }
  };

  // Reset Position on Mouse Leave
  const reset = () => {
    setPosition({ x: 0, y: 0 });
  };

  // Handle Touch Start (For Mobile)
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setIsTouch(true); // Detect touch to disable mouse move effect
  };

  // Handle Click (To Ensure Taps Work)
  const handleClick = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    e.stopPropagation(); // Prevent weird bubbling issues
    console.log("✅ Click registered!");
  };

  const { x, y } = position;

  return (
    <motion.div
    className={cn("relative touch-manipulation pointer-events-auto", className)}
    ref={ref}
    animate={!isTouch ? { x, y } : { x: 0, y: 0 }} // Disable movement on touch
    transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
    onMouseMove={handleMouse}
    onMouseLeave={reset}
    onTouchStart={handleTouchStart} // Detect touch
    onClick={handleClick} // Ensure tap-to-click works
    style={{ touchAction: "manipulation" }} // Ensures proper touch handling
  >
    {children}
  </motion.div>
  
  );
};

export default MagneticWrapper;
