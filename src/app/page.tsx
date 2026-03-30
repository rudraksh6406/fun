"use client";

import { motion, useScroll, useTransform, useMotionValue, useSpring, MotionValue } from "framer-motion";
import Link from "next/link";
import { useRef, useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";

const SpiderWeb = dynamic(() => import("@/components/animations/SpiderWeb"), { ssr: false });
const PingPong = dynamic(() => import("@/components/animations/PingPong"), { ssr: false });
const DrivingScene = dynamic(() => import("@/components/animations/DrivingScene"), { ssr: false });
const ConstellationNetwork = dynamic(() => import("@/components/animations/ConstellationNetwork"), { ssr: false });
const ParticleIntro = dynamic(() => import("@/components/animations/ParticleIntro"), { ssr: false });

/* ── Animated gradient mesh background ── */
function GradientMesh({ className = "" }: { className?: string }) {
  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      <div className="absolute inset-0 bg-[#0c0c0c]" />
      <motion.div
        animate={{
          background: [
            "radial-gradient(circle at 20% 50%, rgba(168,85,247,0.18) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(251,146,60,0.12) 0%, transparent 50%), radial-gradient(circle at 50% 80%, rgba(56,189,248,0.12) 0%, transparent 50%)",
            "radial-gradient(circle at 60% 30%, rgba(168,85,247,0.18) 0%, transparent 50%), radial-gradient(circle at 20% 80%, rgba(251,146,60,0.12) 0%, transparent 50%), radial-gradient(circle at 80% 60%, rgba(56,189,248,0.12) 0%, transparent 50%)",
            "radial-gradient(circle at 40% 70%, rgba(168,85,247,0.18) 0%, transparent 50%), radial-gradient(circle at 70% 40%, rgba(251,146,60,0.12) 0%, transparent 50%), radial-gradient(circle at 30% 30%, rgba(56,189,248,0.12) 0%, transparent 50%)",
          ],
        }}
        transition={{ duration: 12, repeat: Infinity, repeatType: "reverse", ease: "linear" }}
        className="absolute inset-[-50%] w-[200%] h-[200%]"
      />
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E\")" }} />
    </div>
  );
}

/* ── Floating geometric shapes ── */
function FloatingShapes() {
  const colors = [
    "rgba(168,85,247,0.06)",
    "rgba(56,189,248,0.05)",
    "rgba(251,146,60,0.05)",
    "rgba(244,114,182,0.05)",
    "rgba(139,92,246,0.06)",
    "rgba(14,165,233,0.05)",
  ];
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            width: `${80 + i * 60}px`,
            height: `${80 + i * 60}px`,
            left: `${10 + i * 15}%`,
            top: `${20 + (i % 3) * 25}%`,
            borderRadius: i % 2 === 0 ? "0%" : "50%",
            border: `1px solid ${colors[i]}`,
          }}
          animate={{
            y: [0, -30 - i * 10, 0],
            rotate: [0, 90 + i * 30, 0],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 8 + i * 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.5,
          }}
        />
      ))}
    </div>
  );
}

/* ── Scroll-linked progress ring ── */
function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const pathLength = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 2 }}
      className="fixed bottom-8 right-8 z-40 w-10 h-10"
    >
      <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
        <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(168,85,247,0.08)" strokeWidth="2" />
        <motion.circle
          cx="50" cy="50" r="45" fill="none" stroke="rgba(168,85,247,0.4)" strokeWidth="2"
          strokeLinecap="round"
          style={{ pathLength }}
          strokeDashoffset={0}
          strokeDasharray="283"
        />
      </svg>
    </motion.div>
  );
}

/* ── Magnetic button ── */
function MagneticButton({ children, href }: { children: React.ReactNode; href: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 150, damping: 15 });
  const springY = useSpring(y, { stiffness: 150, damping: 15 });

  const handleMouse = useCallback((e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((e.clientX - rect.left - rect.width / 2) * 0.3);
    y.set((e.clientY - rect.top - rect.height / 2) * 0.3);
  }, [x, y]);

  const reset = useCallback(() => { x.set(0); y.set(0); }, [x, y]);

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      style={{ x: springX, y: springY }}
      className="inline-block"
    >
      <Link href={href}>
        <button className="btn group">
          {children}
        </button>
      </Link>
    </motion.div>
  );
}


/* ── Horizontal infinite marquee ── */
function Marquee({ words, direction = 1 }: { words: string[]; direction?: number }) {
  return (
    <div className="overflow-hidden py-8">
      <motion.div
        animate={{ x: direction > 0 ? [0, -1400] : [-1400, 0] }}
        transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
        className="flex gap-20 whitespace-nowrap"
      >
        {[...Array(3)].map((_, rep) => (
          <div key={rep} className="flex gap-20">
            {words.map((word) => (
              <span key={`${rep}-${word}`} className="text-[clamp(2rem,5vw,4rem)] font-light tracking-tight opacity-[0.06]">
                {word}
              </span>
            ))}
          </div>
        ))}
      </motion.div>
    </div>
  );
}

/* ── Animated line drawing ── */
function AnimatedLine({ scrollProgress }: { scrollProgress: MotionValue<number> }) {
  const pathLength = useSpring(scrollProgress, { stiffness: 50, damping: 20 });
  return (
    <svg viewBox="0 0 2 400" className="absolute left-[60px] top-0 h-full w-[2px] hidden md:block">
      <line x1="1" y1="0" x2="1" y2="400" stroke="rgba(168,85,247,0.06)" strokeWidth="1" />
      <motion.line
        x1="1" y1="0" x2="1" y2="400"
        stroke="rgba(168,85,247,0.3)"
        strokeWidth="1"
        style={{ pathLength }}
      />
    </svg>
  );
}

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroScroll } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroTextY = useTransform(heroScroll, [0, 1], [0, 250]);
  const heroOpacity = useTransform(heroScroll, [0, 0.4], [1, 0]);
  const heroScale = useTransform(heroScroll, [0, 1], [1, 0.9]);

  const introRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: introScroll } = useScroll({ target: introRef, offset: ["start 0.9", "start 0.2"] });
  const introOpacity = useTransform(introScroll, [0, 0.5, 1], [0, 1, 1]);
  const introY = useTransform(introScroll, [0, 0.5], [80, 0]);
  const introScale = useTransform(introScroll, [0, 0.5], [0.95, 1]);

  const stepsRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: stepsScroll } = useScroll({ target: stepsRef, offset: ["start end", "end start"] });


  const ctaRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: ctaScroll } = useScroll({ target: ctaRef, offset: ["start end", "start 0.3"] });
  const ctaScale = useTransform(ctaScroll, [0, 1], [0.85, 1]);
  const ctaOpacity = useTransform(ctaScroll, [0, 0.5], [0, 1]);

  return (
    <div>
      <ScrollProgress />

      {/* ══════════════════════════════════════════════════
          HERO — GQ Extraordinary Lab Style
         ══════════════════════════════════════════════════ */}
      <section ref={heroRef} className="relative h-[120vh] overflow-hidden">
        {/* Particle field background */}
        <div className="absolute inset-0">
          <ParticleIntro />
        </div>
        <GradientMesh className="opacity-50" />

        {/* Horizontal scan lines for texture */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.015]" style={{
          backgroundImage: "repeating-linear-gradient(0deg, rgba(168,85,247,0.4) 0px, transparent 1px, transparent 3px)",
          backgroundSize: "100% 3px",
        }} />

        <motion.div
          style={{ y: heroTextY, opacity: heroOpacity, scale: heroScale }}
          className="relative z-10 h-screen flex flex-col items-center justify-center px-8 md:px-12 max-w-[1400px] mx-auto"
        >
          {/* Top label — fades in first */}
          <motion.p
            initial={{ opacity: 0, letterSpacing: "0.6em" }}
            animate={{ opacity: 1, letterSpacing: "0.3em" }}
            transition={{ delay: 0.3, duration: 2, ease: [0.16, 1, 0.3, 1] as const }}
            className="label mb-8 text-[10px] md:text-[11px]"
            style={{ color: "rgba(168,85,247,0.35)" }}
          >
            AI-Powered Experiences
          </motion.p>

          {/* Brand — massive reveal */}
          <div className="overflow-hidden mb-6">
            <motion.div
              initial={{ y: "110%" }}
              animate={{ y: 0 }}
              transition={{ delay: 0.6, duration: 1.6, ease: [0.16, 1, 0.3, 1] as const }}
              className="flex items-baseline justify-center"
            >
              {"masti.co".split("").map((char, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, filter: "blur(10px)" }}
                  animate={{ opacity: 1, filter: "blur(0px)" }}
                  transition={{ delay: 0.8 + i * 0.1, duration: 1.2, ease: [0.16, 1, 0.3, 1] as const }}
                  className="text-[clamp(5rem,14vw,11rem)] font-extralight tracking-tight leading-none"
                  style={{
                    color: char === "."
                      ? "rgba(168,85,247,0.5)"
                      : `hsl(${260 + i * 12}, 70%, 80%)`,
                  }}
                >
                  {char}
                </motion.span>
              ))}
            </motion.div>
          </div>

          {/* Divider line */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 1.8, duration: 1.5, ease: [0.16, 1, 0.3, 1] as const }}
            className="w-24 h-[1px] mb-8"
            style={{ background: "linear-gradient(90deg, transparent, rgba(168,85,247,0.4), transparent)" }}
          />

          {/* Tagline — cinematic text */}
          <div className="overflow-hidden mb-12">
            <motion.p
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 2, duration: 1.4, ease: [0.16, 1, 0.3, 1] as const }}
              className="text-[clamp(1rem,2.5vw,1.5rem)] font-light tracking-[0.15em] text-center"
              style={{ color: "rgba(200,180,255,0.5)" }}
            >
              Never be bored again
            </motion.p>
          </div>

          {/* Enter button — dramatic CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.6, duration: 1.2, ease: [0.16, 1, 0.3, 1] as const }}
          >
            <MagneticButton href="/dashboard">
              <span className="tracking-[0.2em]">Enter</span>
              <motion.span
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                &rarr;
              </motion.span>
            </MagneticButton>
          </motion.div>

          {/* Corner accents */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3, duration: 1 }}
            className="absolute inset-8 md:inset-16 pointer-events-none"
          >
            <span className="absolute top-0 left-0 w-8 h-[1px]" style={{ background: "rgba(168,85,247,0.15)" }} />
            <span className="absolute top-0 left-0 w-[1px] h-8" style={{ background: "rgba(168,85,247,0.15)" }} />
            <span className="absolute top-0 right-0 w-8 h-[1px]" style={{ background: "rgba(56,189,248,0.15)" }} />
            <span className="absolute top-0 right-0 w-[1px] h-8" style={{ background: "rgba(56,189,248,0.15)" }} />
            <span className="absolute bottom-0 left-0 w-8 h-[1px]" style={{ background: "rgba(244,114,182,0.15)" }} />
            <span className="absolute bottom-0 left-0 w-[1px] h-8" style={{ background: "rgba(244,114,182,0.15)" }} />
            <span className="absolute bottom-0 right-0 w-8 h-[1px]" style={{ background: "rgba(251,146,60,0.15)" }} />
            <span className="absolute bottom-0 right-0 w-[1px] h-8" style={{ background: "rgba(251,146,60,0.15)" }} />
          </motion.div>

          {/* Scroll cue */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3.5, duration: 1 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
          >
            <span className="label text-[9px] tracking-[0.4em]" style={{ color: "rgba(168,85,247,0.2)" }}>Scroll</span>
            <motion.div
              className="w-[1px] h-16"
              style={{ background: "linear-gradient(to bottom, rgba(168,85,247,0.3), transparent)" }}
              animate={{ scaleY: [0, 1, 0] }}
              transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
            />
          </motion.div>
        </motion.div>
      </section>

      {/* ══════════════════════════════════════════════════
          SPIDER WEB
         ══════════════════════════════════════════════════ */}
      <section className="section-dark relative h-[70vh] border-y border-cyan-500/[0.06] overflow-hidden">
        <SpiderWeb />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, delay: 0.5 }}
            className="label text-center"
            style={{ color: "rgba(56,189,248,0.25)" }}
          >
            Move your cursor
          </motion.p>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          FLOWCHART — How masti.co works
         ══════════════════════════════════════════════════ */}
      <section className="section-dark py-32 md:py-48 px-8 md:px-12 border-y border-purple-500/[0.06] overflow-hidden">
        <motion.div
          ref={introRef}
          style={{ opacity: introOpacity, y: introY, scale: introScale }}
          className="max-w-[1100px] mx-auto"
        >
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="label mb-16 text-center"
            style={{ color: "rgba(168,85,247,0.3)" }}
          >
            The flow
          </motion.p>

          {/* Flowchart */}
          <div className="relative">
            {/* SVG connecting lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none hidden md:block" preserveAspectRatio="none">
              {[0, 1, 2].map((i) => (
                <motion.line
                  key={i}
                  x1={`${12.5 + i * 25}%`} y1="50%"
                  x2={`${37.5 + i * 25}%`} y2="50%"
                  stroke={["rgba(168,85,247,0.3)", "rgba(56,189,248,0.3)", "rgba(251,146,60,0.3)"][i]}
                  strokeWidth="1"
                  initial={{ pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 + i * 0.4, duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }}
                />
              ))}
              {/* Animated particles along lines */}
              {[0, 1, 2].map((i) => (
                <motion.circle
                  key={`p-${i}`}
                  r="3"
                  cy="50%"
                  fill={["rgba(168,85,247,0.6)", "rgba(56,189,248,0.6)", "rgba(251,146,60,0.6)"][i]}
                  animate={{ cx: [`${12.5 + i * 25}%`, `${37.5 + i * 25}%`] }}
                  transition={{ delay: 1 + i * 0.4, duration: 1.5, repeat: Infinity, repeatDelay: 2, ease: "easeInOut" }}
                />
              ))}
            </svg>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 relative z-10">
              {[
                {
                  label: "Your Vibe",
                  desc: "Mood, energy, crew",
                  color: "rgba(168,85,247,0.8)",
                  bg: "rgba(168,85,247,0.06)",
                  icon: (
                    <svg viewBox="0 0 48 48" className="w-12 h-12">
                      <motion.circle cx="24" cy="24" r="18" fill="none" stroke="rgba(168,85,247,0.4)" strokeWidth="1.5"
                        animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} />
                      <motion.path d="M16 20 Q24 10 32 20" fill="none" stroke="rgba(168,85,247,0.6)" strokeWidth="1.5" strokeLinecap="round"
                        animate={{ d: ["M16 20 Q24 10 32 20", "M16 22 Q24 14 32 22", "M16 20 Q24 10 32 20"] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} />
                      <motion.path d="M16 28 Q24 36 32 28" fill="none" stroke="rgba(168,85,247,0.6)" strokeWidth="1.5" strokeLinecap="round"
                        animate={{ d: ["M16 28 Q24 36 32 28", "M16 26 Q24 34 32 26", "M16 28 Q24 36 32 28"] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }} />
                    </svg>
                  ),
                },
                {
                  label: "AI Engine",
                  desc: "Learns & generates",
                  color: "rgba(56,189,248,0.8)",
                  bg: "rgba(56,189,248,0.06)",
                  icon: (
                    <svg viewBox="0 0 48 48" className="w-12 h-12">
                      <motion.rect x="12" y="12" width="24" height="24" rx="4" fill="none" stroke="rgba(56,189,248,0.4)" strokeWidth="1.5"
                        animate={{ rotate: [0, 90, 180, 270, 360] }} transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                        style={{ transformOrigin: "24px 24px" }} />
                      <motion.circle cx="24" cy="24" r="4" fill="rgba(56,189,248,0.5)"
                        animate={{ r: [4, 6, 4] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} />
                      {[0, 60, 120, 180, 240, 300].map((angle) => (
                        <motion.circle key={angle} cx={24 + 10 * Math.cos(angle * Math.PI / 180)} cy={24 + 10 * Math.sin(angle * Math.PI / 180)}
                          r="1.5" fill="rgba(56,189,248,0.4)"
                          animate={{ opacity: [0.3, 0.8, 0.3] }}
                          transition={{ duration: 1.5, repeat: Infinity, delay: angle / 360 }} />
                      ))}
                    </svg>
                  ),
                },
                {
                  label: "Perfect Match",
                  desc: "Tailored activities",
                  color: "rgba(251,146,60,0.8)",
                  bg: "rgba(251,146,60,0.06)",
                  icon: (
                    <svg viewBox="0 0 48 48" className="w-12 h-12">
                      <motion.path d="M24 8 L30 20 L44 22 L34 32 L36 44 L24 38 L12 44 L14 32 L4 22 L18 20 Z"
                        fill="none" stroke="rgba(251,146,60,0.4)" strokeWidth="1.5" strokeLinejoin="round"
                        animate={{ scale: [1, 1.08, 1], rotate: [0, 5, -5, 0] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        style={{ transformOrigin: "24px 26px" }} />
                      <motion.circle cx="24" cy="26" r="3" fill="rgba(251,146,60,0.5)"
                        animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 2, repeat: Infinity }} />
                    </svg>
                  ),
                },
                {
                  label: "Your Crew",
                  desc: "Rally & connect",
                  color: "rgba(244,114,182,0.8)",
                  bg: "rgba(244,114,182,0.06)",
                  icon: (
                    <svg viewBox="0 0 48 48" className="w-12 h-12">
                      {[{cx: 18, cy: 20}, {cx: 30, cy: 20}, {cx: 24, cy: 30}].map((p, j) => (
                        <motion.circle key={j} cx={p.cx} cy={p.cy} r="5" fill="none" stroke="rgba(244,114,182,0.4)" strokeWidth="1.5"
                          animate={{ cy: [p.cy, p.cy - 2, p.cy] }}
                          transition={{ duration: 2, repeat: Infinity, delay: j * 0.3, ease: "easeInOut" }} />
                      ))}
                      <motion.line x1="18" y1="20" x2="30" y2="20" stroke="rgba(244,114,182,0.2)" strokeWidth="1"
                        animate={{ opacity: [0.2, 0.5, 0.2] }} transition={{ duration: 2, repeat: Infinity }} />
                      <motion.line x1="18" y1="20" x2="24" y2="30" stroke="rgba(244,114,182,0.2)" strokeWidth="1"
                        animate={{ opacity: [0.2, 0.5, 0.2] }} transition={{ duration: 2, repeat: Infinity, delay: 0.3 }} />
                      <motion.line x1="30" y1="20" x2="24" y2="30" stroke="rgba(244,114,182,0.2)" strokeWidth="1"
                        animate={{ opacity: [0.2, 0.5, 0.2] }} transition={{ duration: 2, repeat: Infinity, delay: 0.6 }} />
                    </svg>
                  ),
                },
              ].map((node, i) => (
                <motion.div
                  key={node.label}
                  initial={{ opacity: 0, y: 40, scale: 0.9 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }}
                  className="flex flex-col items-center text-center"
                >
                  {/* Node */}
                  <motion.div
                    whileHover={{ scale: 1.08, borderColor: node.color }}
                    className="w-28 h-28 md:w-32 md:h-32 border border-purple-500/10 flex items-center justify-center mb-5 relative"
                    style={{ background: node.bg }}
                  >
                    {/* Corner accents */}
                    <span className="absolute top-0 left-0 w-3 h-[1px]" style={{ background: node.color }} />
                    <span className="absolute top-0 left-0 w-[1px] h-3" style={{ background: node.color }} />
                    <span className="absolute bottom-0 right-0 w-3 h-[1px]" style={{ background: node.color }} />
                    <span className="absolute bottom-0 right-0 w-[1px] h-3" style={{ background: node.color }} />

                    {/* Pulsing ring */}
                    <motion.div
                      className="absolute inset-2 border"
                      style={{ borderColor: node.color.replace("0.8)", "0.08)") }}
                      animate={{ opacity: [0.3, 0.6, 0.3], scale: [0.95, 1, 0.95] }}
                      transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 }}
                    />

                    {node.icon}
                  </motion.div>

                  <h4 className="text-[14px] font-medium tracking-wide mb-1" style={{ color: node.color }}>{node.label}</h4>
                  <p className="text-[11px] tracking-wider uppercase" style={{ color: "rgba(168,85,247,0.25)" }}>{node.desc}</p>

                  {/* Arrow indicator on mobile between rows */}
                  {i < 3 && (
                    <motion.div
                      className="md:hidden mt-4 mb-2"
                      animate={{ y: [0, 4, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <svg width="12" height="16" viewBox="0 0 12 16" className={i % 2 === 0 ? "hidden" : ""}>
                        <path d="M6 0 L6 14 M2 10 L6 14 L10 10" stroke="rgba(168,85,247,0.2)" strokeWidth="1" fill="none" />
                      </svg>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Mobile connecting arrows (vertical) */}
            <div className="md:hidden flex justify-center mt-2">
              <motion.svg width="2" height="20" animate={{ opacity: [0.2, 0.5, 0.2] }} transition={{ duration: 2, repeat: Infinity }}>
                <line x1="1" y1="0" x2="1" y2="20" stroke="rgba(168,85,247,0.3)" strokeWidth="1" />
              </motion.svg>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ══════════════════════════════════════════════════
          PING PONG
         ══════════════════════════════════════════════════ */}
      <section className="section-dark relative h-[60vh] overflow-hidden border-y border-orange-400/[0.06]">
        <PingPong />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <motion.h2
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] as const }}
            className="headline text-center"
            style={{ color: "rgba(251,146,60,0.1)" }}
          >
            Play more.
            <br />Think less.
          </motion.h2>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          FEATURES
         ══════════════════════════════════════════════════ */}
      <section className="section-light py-48 md:py-64 px-8 md:px-12">
        <div className="max-w-[1400px] mx-auto">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="label mb-6"
            style={{ color: "rgba(168,85,247,0.35)" }}
          >
            What you get
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] as const }}
            className="headline text-[#0c0c0c] mb-20 max-w-2xl"
          >
            Three things that change how you spend your time
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-10">
            {[
              { title: "Smart Recommendations", desc: "Tell us your mood, time, and crew size. Our AI matches you with the perfect activity — instantly.", accent: "rgba(168,85,247,0.08)" },
              { title: "Idea Generation", desc: "Our engine invents entirely new activity concepts — wild mashups, creative twists, things that don't exist yet.", accent: "rgba(56,189,248,0.08)" },
              { title: "Find Your People", desc: "See who's nearby and what they're planning. Join their vibe or start your own and let others find you.", accent: "rgba(251,146,60,0.08)" },
            ].map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ delay: i * 0.15, duration: 1, ease: [0.16, 1, 0.3, 1] as const }}
                className="border border-black/[0.06] p-8 lg:p-10 group hover:border-black/15 transition-colors duration-700"
              >
                <span className="text-[3rem] font-extralight leading-none block mb-6" style={{ color: feature.accent }}>0{i + 1}</span>
                <h3 className="title text-[#0c0c0c] mb-4 text-[clamp(1.3rem,2.5vw,2rem)]">{feature.title}</h3>
                <p className="body-sm text-black/40">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          HOW IT WORKS
         ══════════════════════════════════════════════════ */}
      <section ref={stepsRef} className="section-dark py-48 md:py-64 px-8 md:px-12">
        <div className="max-w-[1400px] mx-auto">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="label mb-20"
            style={{ color: "rgba(168,85,247,0.3)" }}
          >
            How it works
          </motion.p>

          <div className="relative">
            <AnimatedLine scrollProgress={stepsScroll} />

            <div className="space-y-32 md:space-y-44">
              {[
                { num: "01", title: "Share your vibe", text: "Drop in your favorite activities. The AI learns your energy, your patterns, what makes your eyes light up.", color: "rgba(168,85,247,0.08)" },
                { num: "02", title: "We craft the experience", text: "Our engine generates personalized recommendations — mashups, creative twists, and wild new concepts built around you.", color: "rgba(56,189,248,0.08)" },
                { num: "03", title: "Rally your crew", text: "See who's nearby and down for the same thing. Jump into their plans or create your own and watch people show up.", color: "rgba(251,146,60,0.08)" },
              ].map((step, i) => (
                <motion.div
                  key={step.num}
                  initial={{ opacity: 0, x: -40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-120px" }}
                  transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] as const }}
                  className="grid md:grid-cols-[120px_1fr] gap-6 md:gap-16 max-w-3xl"
                >
                  <motion.span
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }}
                    className="text-[4rem] font-extralight leading-none"
                    style={{ color: step.color }}
                  >
                    {step.num}
                  </motion.span>
                  <div>
                    <motion.h3
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.15, duration: 1, ease: [0.16, 1, 0.3, 1] as const }}
                      className="title mb-5"
                      style={{ color: "rgba(200,180,255,0.9)" }}
                    >
                      {step.title}
                    </motion.h3>
                    <motion.p
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3, duration: 1, ease: [0.16, 1, 0.3, 1] as const }}
                      className="body max-w-md"
                      style={{ color: "rgba(168,85,247,0.35)" }}
                    >
                      {step.text}
                    </motion.p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          NIGHT DRIVE
         ══════════════════════════════════════════════════ */}
      <section className="section-dark relative h-[80vh] overflow-hidden">
        <DrivingScene />
        <div className="absolute inset-0 flex flex-col items-center justify-start pt-16 pointer-events-none px-8">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, delay: 0.3 }}
            className="label mb-4"
            style={{ color: "rgba(251,191,36,0.25)" }}
          >
            Late night adventures
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: 0.5, ease: [0.16, 1, 0.3, 1] as const }}
            className="title text-center"
            style={{ color: "rgba(168,85,247,0.35)" }}
          >
            The best ideas happen
            <br />after midnight
          </motion.h2>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          CONSTELLATION
         ══════════════════════════════════════════════════ */}
      <section className="section-dark relative h-[70vh] overflow-hidden border-y border-purple-500/[0.06]">
        <ConstellationNetwork />
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none px-8">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, delay: 0.3 }}
            className="label mb-6"
            style={{ color: "rgba(139,92,246,0.35)" }}
          >
            The AI engine
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, delay: 0.5, ease: [0.16, 1, 0.3, 1] as const }}
            className="headline text-center max-w-2xl"
            style={{ color: "rgba(168,85,247,0.2)" }}
          >
            Learns from you.
            <br />Gets smarter with every choice.
          </motion.h2>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          CTA
         ══════════════════════════════════════════════════ */}
      <section ref={ctaRef} className="relative section-dark py-48 md:py-64 px-8 md:px-12 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <motion.div
            animate={{
              opacity: [0.05, 0.15, 0.05],
              scale: [0.8, 1, 0.8],
            }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="w-[600px] h-[600px] rounded-full blur-[150px]"
            style={{ background: "rgba(168,85,247,0.4)" }}
          />
        </div>

        <motion.div
          style={{ scale: ctaScale, opacity: ctaOpacity }}
          className="relative z-10 max-w-[800px] mx-auto text-center"
        >
          <p className="label mb-10" style={{ color: "rgba(168,85,247,0.35)" }}>Get started</p>
          <div className="overflow-hidden mb-14">
            <motion.h2
              initial={{ y: 120 }}
              whileInView={{ y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] as const }}
              className="headline"
              style={{ color: "rgba(200,180,255,0.9)" }}
            >
              Ready to stop
              <br />
              being bored?
            </motion.h2>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 1, ease: [0.16, 1, 0.3, 1] as const }}
          >
            <MagneticButton href="/dashboard">
              <span>Enter masti.co</span>
              <span>&rarr;</span>
            </MagneticButton>
          </motion.div>
        </motion.div>
      </section>

      {/* ══════════════════════════════════════════════════
          FOOTER
         ══════════════════════════════════════════════════ */}
      <footer className="section-dark border-t border-purple-500/[0.06] py-12 px-8 md:px-12">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <span className="text-[14px] font-light tracking-[0.05em]" style={{ color: "rgba(168,85,247,0.4)" }}>
            masti.co
          </span>
          <div className="flex gap-8">
            {["Explore", "AI Engine", "People"].map((item) => (
              <Link
                key={item}
                href={`/${item === "AI Engine" ? "dashboard" : item === "People" ? "social" : item.toLowerCase()}`}
                className="label transition-colors duration-500 hover:text-purple-400/60"
                style={{ color: "rgba(168,85,247,0.25)" }}
              >
                {item}
              </Link>
            ))}
          </div>
          <span className="label" style={{ color: "rgba(168,85,247,0.2)" }}>&copy; 2026</span>
        </div>
      </footer>
    </div>
  );
}
