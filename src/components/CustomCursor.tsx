"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CustomCursor() {
  const [mounted, setMounted] = useState(false);
  const [hovering, setHovering] = useState(false);
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  const ringX = useSpring(cursorX, { stiffness: 120, damping: 20, mass: 0.5 });
  const ringY = useSpring(cursorY, { stiffness: 120, damping: 20, mass: 0.5 });

  useEffect(() => {
    setMounted(true);

    const move = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const checkHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isInteractive = target.closest("a, button, [role='button'], input, [onclick]");
      setHovering(!!isInteractive);
    };

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", checkHover);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", checkHover);
    };
  }, [cursorX, cursorY]);

  if (!mounted) return null;

  return (
    <>
      {/* Dot — vibrant accent */}
      <motion.div
        style={{ x: cursorX, y: cursorY }}
        className="fixed top-0 left-0 z-[9999] pointer-events-none"
      >
        <motion.div
          animate={{ scale: hovering ? 0.5 : 1 }}
          transition={{ duration: 0.2 }}
          className="w-2.5 h-2.5 -ml-[5px] -mt-[5px] rounded-full"
          style={{ background: "linear-gradient(135deg, #a78bfa, #f472b6)" }}
        />
      </motion.div>

      {/* Trailing ring — gradient border */}
      <motion.div
        style={{ x: ringX, y: ringY }}
        className="fixed top-0 left-0 z-[9998] pointer-events-none"
      >
        <motion.div
          animate={{
            width: hovering ? 52 : 36,
            height: hovering ? 52 : 36,
            marginLeft: hovering ? -26 : -18,
            marginTop: hovering ? -26 : -18,
            borderWidth: hovering ? 2 : 1.5,
          }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="rounded-full"
          style={{ borderColor: "rgba(167, 139, 250, 0.5)", borderStyle: "solid" }}
        />
      </motion.div>
    </>
  );
}
