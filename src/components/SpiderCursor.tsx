"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function SpiderCursor() {
  const [mounted, setMounted] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 200, damping: 20, mass: 0.5 });
  const springY = useSpring(y, { stiffness: 200, damping: 20, mass: 0.5 });
  const prevPos = useRef({ x: 0, y: 0 });
  const [angle, setAngle] = useState(0);

  useEffect(() => {
    setMounted(true);
    const handleMouse = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      // Calculate movement angle for spider rotation
      const dx = e.clientX - prevPos.current.x;
      const dy = e.clientY - prevPos.current.y;
      if (Math.abs(dx) + Math.abs(dy) > 2) {
        setAngle(Math.atan2(dy, dx) * (180 / Math.PI) + 90);
      }
      prevPos.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", handleMouse);
    return () => window.removeEventListener("mousemove", handleMouse);
  }, [x, y]);

  if (!mounted) return null;

  return (
    <motion.div
      style={{ x: springX, y: springY, rotate: angle }}
      className="fixed top-0 left-0 z-[9999] pointer-events-none"
    >
      <svg
        width="28" height="28" viewBox="0 0 28 28"
        style={{ transform: "translate(-14px, -14px)" }}
      >
        {/* Spider body */}
        <ellipse cx="14" cy="15" rx="3" ry="4" fill="rgba(255,255,255,0.8)" />
        <circle cx="14" cy="11" r="2.5" fill="rgba(255,255,255,0.9)" />
        {/* Eyes */}
        <circle cx="13" cy="10.5" r="0.6" fill="rgba(0,0,0,0.8)" />
        <circle cx="15" cy="10.5" r="0.6" fill="rgba(0,0,0,0.8)" />
        {/* Legs - left */}
        <path d="M11 12 Q6 8 3 6" stroke="rgba(255,255,255,0.6)" strokeWidth="0.8" fill="none" strokeLinecap="round" />
        <path d="M11 13 Q5 12 2 10" stroke="rgba(255,255,255,0.6)" strokeWidth="0.8" fill="none" strokeLinecap="round" />
        <path d="M11 14 Q5 16 2 18" stroke="rgba(255,255,255,0.6)" strokeWidth="0.8" fill="none" strokeLinecap="round" />
        <path d="M11 16 Q6 20 4 23" stroke="rgba(255,255,255,0.6)" strokeWidth="0.8" fill="none" strokeLinecap="round" />
        {/* Legs - right */}
        <path d="M17 12 Q22 8 25 6" stroke="rgba(255,255,255,0.6)" strokeWidth="0.8" fill="none" strokeLinecap="round" />
        <path d="M17 13 Q23 12 26 10" stroke="rgba(255,255,255,0.6)" strokeWidth="0.8" fill="none" strokeLinecap="round" />
        <path d="M17 14 Q23 16 26 18" stroke="rgba(255,255,255,0.6)" strokeWidth="0.8" fill="none" strokeLinecap="round" />
        <path d="M17 16 Q22 20 24 23" stroke="rgba(255,255,255,0.6)" strokeWidth="0.8" fill="none" strokeLinecap="round" />
      </svg>
    </motion.div>
  );
}
