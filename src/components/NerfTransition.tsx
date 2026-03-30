"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import { createContext, useContext, useState, useCallback, useEffect, useRef } from "react";

interface TransitionContextType {
  navigate: (href: string) => void;
}

const TransitionContext = createContext<TransitionContextType>({
  navigate: () => {},
});

export const usePageTransition = () => useContext(TransitionContext);

export function NerfTransitionProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [phase, setPhase] = useState<"idle" | "warp" | "hold" | "reveal">("idle");
  const targetHref = useRef("");

  const navigate = useCallback((href: string) => {
    if (phase !== "idle" || href === pathname) return;
    targetHref.current = href;
    setPhase("warp");
  }, [phase, pathname]);

  useEffect(() => {
    if (phase === "idle") return;
    const timers: ReturnType<typeof setTimeout>[] = [];

    if (phase === "warp") {
      timers.push(setTimeout(() => {
        setPhase("hold");
        router.push(targetHref.current);
      }, 600));
    } else if (phase === "hold") {
      timers.push(setTimeout(() => setPhase("reveal"), 200));
    } else if (phase === "reveal") {
      timers.push(setTimeout(() => setPhase("idle"), 600));
    }

    return () => timers.forEach(clearTimeout);
  }, [phase, router]);

  // Intercept link clicks globally
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const link = (e.target as HTMLElement).closest("a");
      if (!link) return;
      const href = link.getAttribute("href");
      if (!href || href.startsWith("http") || href.startsWith("#") || href === pathname) return;
      e.preventDefault();
      e.stopPropagation();
      navigate(href);
    };
    document.addEventListener("click", handler, true);
    return () => document.removeEventListener("click", handler, true);
  }, [navigate, pathname]);

  const isActive = phase !== "idle";

  return (
    <TransitionContext.Provider value={{ navigate }}>
      {children}
      <AnimatePresence>
        {isActive && (
          <motion.div
            className="fixed inset-0 z-[200] pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Radial wipe — expands from center */}
            <motion.div
              className="absolute inset-0"
              style={{ background: "#0c0c0c" }}
              initial={{ clipPath: "circle(0% at 50% 50%)" }}
              animate={{
                clipPath:
                  phase === "warp" || phase === "hold"
                    ? "circle(100% at 50% 50%)"
                    : phase === "reveal"
                    ? "circle(100% at 50% 50%)"
                    : "circle(0% at 50% 50%)",
              }}
              transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
            />

            {/* Reveal wipe — shrinks from center */}
            {phase === "reveal" && (
              <motion.div
                className="absolute inset-0"
                style={{ background: "#0c0c0c" }}
                initial={{ clipPath: "circle(100% at 50% 50%)" }}
                animate={{ clipPath: "circle(0% at 50% 50%)" }}
                transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
              />
            )}

            {/* Concentric rings during warp */}
            {(phase === "warp" || phase === "hold") && (
              <div className="absolute inset-0 flex items-center justify-center">
                {[0, 1, 2, 3, 4].map((i) => (
                  <motion.div
                    key={i}
                    className="absolute rounded-full border"
                    style={{
                      borderColor: [
                        "rgba(168,85,247,0.3)",
                        "rgba(56,189,248,0.25)",
                        "rgba(244,114,182,0.2)",
                        "rgba(251,146,60,0.15)",
                        "rgba(139,92,246,0.1)",
                      ][i],
                    }}
                    initial={{ width: 0, height: 0, opacity: 0 }}
                    animate={{
                      width: [0, 100 + i * 80],
                      height: [0, 100 + i * 80],
                      opacity: [0, 0.8, 0],
                    }}
                    transition={{
                      duration: 0.6,
                      delay: i * 0.06,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  />
                ))}

                {/* Central glow */}
                <motion.div
                  className="absolute w-4 h-4 rounded-full"
                  style={{ background: "rgba(168,85,247,0.8)", boxShadow: "0 0 40px 20px rgba(168,85,247,0.3)" }}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: [0, 2, 0.5], opacity: [0, 1, 0] }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
              </div>
            )}

            {/* Speed streaks */}
            {phase === "warp" && (
              <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
                {[...Array(20)].map((_, i) => {
                  const angle = (i / 20) * Math.PI * 2;
                  const colors = [
                    "rgba(168,85,247,0.4)",
                    "rgba(56,189,248,0.3)",
                    "rgba(244,114,182,0.3)",
                    "rgba(251,146,60,0.3)",
                  ];
                  return (
                    <motion.div
                      key={i}
                      className="absolute"
                      style={{
                        width: "1px",
                        height: "60px",
                        background: `linear-gradient(to bottom, transparent, ${colors[i % 4]})`,
                        transformOrigin: "center top",
                        rotate: `${(angle * 180) / Math.PI}deg`,
                      }}
                      initial={{ scaleY: 0, opacity: 0 }}
                      animate={{ scaleY: [0, 3, 0], opacity: [0, 1, 0] }}
                      transition={{ duration: 0.5, delay: i * 0.015, ease: "easeOut" }}
                    />
                  );
                })}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </TransitionContext.Provider>
  );
}
