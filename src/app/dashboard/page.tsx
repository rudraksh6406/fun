"use client";

import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { useState, useCallback, useRef } from "react";
import { funAI, RecommendationQuery } from "@/lib/ai-engine";
import { Activity } from "@/data/activities";
import ActivityCard from "@/components/ActivityCard";
import dynamic from "next/dynamic";

const ConstellationNetwork = dynamic(() => import("@/components/animations/ConstellationNetwork"), { ssr: false });
const ParticleIntro = dynamic(() => import("@/components/animations/ParticleIntro"), { ssr: false });

const moods = [
  { name: "Excited", hue: 45, desc: "High energy, ready to go" },
  { name: "Relaxed", hue: 200, desc: "Chill vibes, low effort" },
  { name: "Creative", hue: 300, desc: "Make something new" },
  { name: "Social", hue: 160, desc: "Meet & connect" },
  { name: "Adventurous", hue: 25, desc: "Try something wild" },
  { name: "Silly", hue: 330, desc: "Just wanna laugh" },
];

/* Animated SVG icons for each mood */
function MoodIcon({ mood, hue, active }: { mood: string; hue: number; active: boolean }) {
  const color = `hsla(${hue}, 60%, 65%, ${active ? 0.9 : 0.3})`;
  const icons: Record<string, React.ReactNode> = {
    Excited: (
      <svg viewBox="0 0 60 60" className="w-full h-full">
        <motion.polygon points="30,6 36,24 54,24 39,36 45,54 30,42 15,54 21,36 6,24 24,24"
          stroke={color} strokeWidth="1" fill="none"
          animate={active ? { scale: [1, 1.1, 1], rotate: [0, 8, -8, 0] } : {}}
          transition={{ duration: 2, repeat: Infinity }}
          style={{ transformOrigin: "30px 30px" }} />
        <motion.circle cx="30" cy="30" r="5" fill={color} opacity={active ? 0.4 : 0.15}
          animate={active ? { scale: [1, 1.5, 1] } : {}}
          transition={{ duration: 1.5, repeat: Infinity }} />
        {active && [...Array(5)].map((_, i) => {
          const a = (i / 5) * Math.PI * 2 - Math.PI / 2;
          return (
            <motion.circle key={i} cx={30 + Math.cos(a) * 22} cy={30 + Math.sin(a) * 22} r="1.5"
              fill={`hsla(${hue}, 60%, 65%, 0.4)`}
              animate={{ opacity: [0, 0.6, 0], scale: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }} />
          );
        })}
      </svg>
    ),
    Relaxed: (
      <svg viewBox="0 0 60 60" className="w-full h-full">
        {[0, 1, 2, 3].map((i) => (
          <motion.path key={i}
            d={`M5 ${20 + i * 7} Q15 ${16 + i * 7} 30 ${20 + i * 7} Q45 ${24 + i * 7} 55 ${20 + i * 7}`}
            stroke={color} strokeWidth="1" fill="none" strokeLinecap="round"
            animate={active ? { d: [`M5 ${20 + i * 7} Q15 ${16 + i * 7} 30 ${20 + i * 7} Q45 ${24 + i * 7} 55 ${20 + i * 7}`, `M5 ${20 + i * 7} Q15 ${24 + i * 7} 30 ${20 + i * 7} Q45 ${16 + i * 7} 55 ${20 + i * 7}`] } : {}}
            transition={{ duration: 2.5 + i * 0.3, repeat: Infinity, repeatType: "reverse" }} />
        ))}
      </svg>
    ),
    Creative: (
      <svg viewBox="0 0 60 60" className="w-full h-full">
        <motion.circle cx="20" cy="34" r="10" stroke={color} strokeWidth="1" fill="none"
          animate={active ? { r: [10, 12, 10] } : {}} transition={{ duration: 2.5, repeat: Infinity }} />
        <motion.rect x="34" y="22" width="16" height="16" stroke={color} strokeWidth="1" fill="none"
          animate={active ? { rotate: [0, 20, 0] } : {}} transition={{ duration: 3.5, repeat: Infinity }}
          style={{ transformOrigin: "42px 30px" }} />
        <motion.polygon points="30,8 34,16 26,16" stroke={color} strokeWidth="1" fill="none"
          animate={active ? { y: [0, -3, 0] } : {}} transition={{ duration: 2, repeat: Infinity }} />
        {active && <motion.circle cx="30" cy="30" r="20" stroke={color} strokeWidth="0.5" fill="none" strokeDasharray="4 4"
          animate={{ rotate: 360 }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: "30px 30px" }} />}
      </svg>
    ),
    Social: (
      <svg viewBox="0 0 60 60" className="w-full h-full">
        <motion.circle cx="22" cy="22" r="7" stroke={color} strokeWidth="1" fill="none"
          animate={active ? { cx: [22, 25, 22] } : {}} transition={{ duration: 2.5, repeat: Infinity }} />
        <motion.circle cx="40" cy="22" r="7" stroke={color} strokeWidth="1" fill="none"
          animate={active ? { cx: [40, 37, 40] } : {}} transition={{ duration: 2.5, repeat: Infinity }} />
        <motion.path d="M12 44 Q22 36 31 44" stroke={color} strokeWidth="1" fill="none" />
        <motion.path d="M29 44 Q40 36 50 44" stroke={color} strokeWidth="1" fill="none" />
        {active && <motion.line x1="28" y1="24" x2="34" y2="24" stroke={color} strokeWidth="0.8"
          animate={{ opacity: [0, 0.8, 0], scaleX: [0.5, 1, 0.5] }} transition={{ duration: 1.5, repeat: Infinity }}
          style={{ transformOrigin: "31px 24px" }} />}
      </svg>
    ),
    Adventurous: (
      <svg viewBox="0 0 60 60" className="w-full h-full">
        <motion.polygon points="30,8 10,50 50,50" stroke={color} strokeWidth="1" fill="none"
          animate={active ? { scale: [1, 1.05, 1] } : {}} transition={{ duration: 2.5, repeat: Infinity }}
          style={{ transformOrigin: "30px 36px" }} />
        <motion.polygon points="30,20 18,44 42,44" stroke={color} strokeWidth="0.6" fill="none" opacity="0.3" />
        <motion.line x1="30" y1="50" x2="30" y2="56" stroke={color} strokeWidth="0.5" opacity="0.3" />
        {active && (
          <>
            <motion.circle cx="30" cy="12" r="2" fill={color}
              animate={{ cy: [12, 6, 12], opacity: [0.6, 0, 0.6] }}
              transition={{ duration: 2, repeat: Infinity }} />
            <motion.path d="M22 30 L28 26 L34 30 L40 26" stroke={color} strokeWidth="0.6" fill="none"
              animate={{ opacity: [0, 0.5, 0] }} transition={{ duration: 2, repeat: Infinity, delay: 0.5 }} />
          </>
        )}
      </svg>
    ),
    Silly: (
      <svg viewBox="0 0 60 60" className="w-full h-full">
        <motion.circle cx="30" cy="30" r="18" stroke={color} strokeWidth="1" fill="none"
          animate={active ? { scale: [1, 1.06, 0.96, 1] } : {}}
          transition={{ duration: 1.5, repeat: Infinity }}
          style={{ transformOrigin: "30px 30px" }} />
        <circle cx="22" cy="26" r="2.5" fill={color} opacity="0.5" />
        <circle cx="38" cy="26" r="2.5" fill={color} opacity="0.5" />
        <motion.path d="M20 36 Q25 44 30 36 Q35 44 40 36" stroke={color} strokeWidth="1.2" fill="none"
          animate={active ? { d: ["M20 36 Q25 44 30 36 Q35 44 40 36", "M20 37 Q25 42 30 37 Q35 42 40 37"] } : {}}
          transition={{ duration: 0.6, repeat: Infinity, repeatType: "reverse" }} />
        {active && <motion.path d="M14 18 Q18 14 22 18" stroke={color} strokeWidth="0.8" fill="none"
          animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 1, repeat: Infinity }}
          style={{ transformOrigin: "18px 16px" }} />}
      </svg>
    ),
  };
  return <>{icons[mood] || null}</>;
}

const materialSuggestions = ["Smartphone", "Cards", "Board games", "Blankets", "Speaker", "Ball", "Paper", "Snacks"];

/* Time presets */
const timePresets = [
  { label: "Quick", value: 15, desc: "15 min" },
  { label: "Short", value: 30, desc: "30 min" },
  { label: "Standard", value: 60, desc: "1 hour" },
  { label: "Long", value: 120, desc: "2 hours" },
  { label: "Half Day", value: 240, desc: "4 hours" },
  { label: "Full Day", value: 480, desc: "8 hours" },
];

export default function DashboardPage() {
  const [time, setTime] = useState(60);
  const [people, setPeople] = useState(2);
  const [mood, setMood] = useState("excited");
  const [materials, setMaterials] = useState<string[]>([]);
  const [materialInput, setMaterialInput] = useState("");
  const [recommendations, setRecommendations] = useState<(Activity & { score: number; matchReasons: string[] })[]>([]);
  const [generatedIdeas, setGeneratedIdeas] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroScroll } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(heroScroll, [0, 1], [0, 200]);
  const heroOpacity = useTransform(heroScroll, [0, 0.5], [1, 0]);

  const getRecommendations = useCallback(() => {
    setIsLoading(true); setHasSearched(true);
    setTimeout(() => {
      const query: RecommendationQuery = { availableTime: time, numberOfPeople: people, availableMaterials: materials, mood };
      setRecommendations(funAI.getRecommendations(query));
      setIsLoading(false);
    }, 600);
  }, [time, people, materials, mood]);

  const generateIdeas = useCallback(() => {
    setIsLoading(true);
    setTimeout(() => { setGeneratedIdeas(funAI.generateNewIdeas(6)); setIsLoading(false); }, 800);
  }, []);

  const addMaterial = (m: string) => {
    if (m && !materials.includes(m)) setMaterials([...materials, m]);
    setMaterialInput("");
  };

  const timePercent = ((time - 15) / (480 - 15)) * 100;

  return (
    <div className="min-h-screen bg-[#0c0c0c]">

      {/* ═══════════════════════════════════════
          HERO — Full screen immersive
         ═══════════════════════════════════════ */}
      <section ref={heroRef} className="relative h-screen overflow-hidden">
        <div className="absolute inset-0 opacity-40">
          <ParticleIntro />
        </div>
        <div className="absolute inset-0" style={{
          background: "radial-gradient(ellipse at 50% 40%, rgba(168,85,247,0.1) 0%, transparent 60%)",
        }} />

        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="relative z-10 h-full flex flex-col items-center justify-center px-8"
        >
          <motion.p
            initial={{ opacity: 0, letterSpacing: "0.5em" }}
            animate={{ opacity: 1, letterSpacing: "0.25em" }}
            transition={{ delay: 0.3, duration: 1.5 }}
            className="text-[10px] uppercase mb-8"
            style={{ color: "rgba(139,92,246,0.4)" }}
          >
            AI Engine
          </motion.p>

          <div className="overflow-hidden">
            <motion.h1
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              transition={{ delay: 0.5, duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
              className="text-[clamp(3rem,8vw,7rem)] font-extralight tracking-tight leading-[1.05] text-center"
              style={{ color: "rgba(200,180,255,0.9)" }}
            >
              What are you
            </motion.h1>
          </div>
          <div className="overflow-hidden">
            <motion.h1
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              transition={{ delay: 0.7, duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
              className="text-[clamp(3rem,8vw,7rem)] font-extralight tracking-tight leading-[1.05] text-center"
              style={{ color: "rgba(200,180,255,0.9)" }}
            >
              in the mood for?
            </motion.h1>
          </div>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 1.5, duration: 1.2 }}
            className="w-16 h-[1px] mt-10 mb-8"
            style={{ background: "linear-gradient(90deg, transparent, rgba(168,85,247,0.4), transparent)" }}
          />

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2, duration: 1 }}
            className="text-[13px] tracking-wide"
            style={{ color: "rgba(168,85,247,0.3)" }}
          >
            Scroll to configure your experience
          </motion.p>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.5 }}
            className="absolute bottom-12 flex flex-col items-center gap-3"
          >
            <motion.div
              className="w-[1px] h-12"
              style={{ background: "linear-gradient(to bottom, rgba(168,85,247,0.3), transparent)" }}
              animate={{ scaleY: [0, 1, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            />
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════
          TIME — Full section
         ═══════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center py-32 px-8 md:px-12 border-t border-purple-500/[0.06]">
        <div className="absolute inset-0" style={{
          background: "radial-gradient(ellipse at 20% 50%, rgba(168,85,247,0.04) 0%, transparent 50%)",
        }} />

        <div className="max-w-[1400px] mx-auto w-full grid lg:grid-cols-2 gap-20 items-center relative z-10">
          {/* Left — big visual */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="flex justify-center"
          >
            <div className="relative w-64 h-64 md:w-80 md:h-80">
              {/* Outer decorative ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 rounded-full"
                style={{ border: "1px solid rgba(168,85,247,0.06)" }}
              />
              {/* Progress arc */}
              <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full -rotate-90">
                <circle cx="100" cy="100" r="85" fill="none" stroke="rgba(168,85,247,0.06)" strokeWidth="2" />
                <motion.circle
                  cx="100" cy="100" r="85" fill="none"
                  stroke="rgba(168,85,247,0.5)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeDasharray={`${timePercent * 5.34} 534`}
                  initial={false}
                  animate={{ strokeDasharray: `${timePercent * 5.34} 534` }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                />
                {/* Glow dot at arc end */}
                <motion.circle
                  cx={100 + 85 * Math.cos((timePercent / 100 * Math.PI * 2) - Math.PI / 2)}
                  cy={100 + 85 * Math.sin((timePercent / 100 * Math.PI * 2) - Math.PI / 2)}
                  r="4" fill="rgba(168,85,247,0.8)"
                  initial={false}
                  animate={{
                    cx: 100 + 85 * Math.cos((timePercent / 100 * Math.PI * 2) - Math.PI / 2),
                    cy: 100 + 85 * Math.sin((timePercent / 100 * Math.PI * 2) - Math.PI / 2),
                  }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  style={{ filter: "drop-shadow(0 0 6px rgba(168,85,247,0.6))" }}
                />
              </svg>
              {/* Center content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <motion.span
                  key={time}
                  initial={{ scale: 0.7, opacity: 0, filter: "blur(8px)" }}
                  animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
                  className="text-[clamp(4rem,8vw,6rem)] font-extralight leading-none"
                  style={{ color: "rgba(200,180,255,0.9)" }}
                >
                  {time}
                </motion.span>
                <span className="text-[11px] tracking-[0.2em] uppercase mt-2" style={{ color: "rgba(168,85,247,0.3)" }}>minutes</span>
              </div>
              {/* Tick marks */}
              {[...Array(24)].map((_, i) => {
                const angle = (i / 24) * Math.PI * 2 - Math.PI / 2;
                const isActive = (i / 24) * 100 <= timePercent;
                return (
                  <motion.div
                    key={i}
                    className="absolute w-[1px]"
                    style={{
                      height: i % 6 === 0 ? "8px" : "4px",
                      background: isActive ? "rgba(168,85,247,0.4)" : "rgba(168,85,247,0.08)",
                      left: `${50 + 46 * Math.cos(angle)}%`,
                      top: `${50 + 46 * Math.sin(angle)}%`,
                      transform: `rotate(${(i / 24) * 360}deg)`,
                      transformOrigin: "center top",
                    }}
                  />
                );
              })}
            </div>
          </motion.div>

          {/* Right — controls */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="text-[10px] tracking-[0.2em] uppercase mb-4" style={{ color: "rgba(168,85,247,0.35)" }}>01 — Time</p>
            <h2 className="text-[clamp(2rem,4vw,3.5rem)] font-extralight tracking-tight leading-[1.1] mb-8" style={{ color: "rgba(200,180,255,0.8)" }}>
              How much time
              <br />do you have?
            </h2>

            {/* Slider */}
            <div className="mb-8">
              <input type="range" min={15} max={480} step={15} value={time} onChange={(e) => setTime(Number(e.target.value))}
                className="w-full h-[2px] appearance-none bg-purple-500/10 outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-purple-400 [&::-webkit-slider-thumb]:shadow-[0_0_16px_rgba(168,85,247,0.5)]" />
              <div className="flex justify-between mt-2">
                <span className="text-[10px]" style={{ color: "rgba(168,85,247,0.2)" }}>15 min</span>
                <span className="text-[10px]" style={{ color: "rgba(168,85,247,0.2)" }}>8 hours</span>
              </div>
            </div>

            {/* Quick presets */}
            <div className="grid grid-cols-3 gap-3">
              {timePresets.map((p) => (
                <motion.button
                  key={p.value}
                  onClick={() => setTime(p.value)}
                  whileTap={{ scale: 0.95 }}
                  className="py-3 px-4 text-left transition-all duration-300"
                  style={{
                    border: `1px solid ${time === p.value ? "rgba(168,85,247,0.3)" : "rgba(168,85,247,0.06)"}`,
                    background: time === p.value ? "rgba(168,85,247,0.06)" : "transparent",
                  }}
                >
                  <span className="text-[11px] tracking-wider uppercase block" style={{ color: time === p.value ? "rgba(200,180,255,0.8)" : "rgba(168,85,247,0.25)" }}>
                    {p.label}
                  </span>
                  <span className="text-[10px]" style={{ color: "rgba(168,85,247,0.15)" }}>{p.desc}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          PEOPLE — Full section
         ═══════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center py-32 px-8 md:px-12 border-t border-cyan-500/[0.06]">
        <div className="absolute inset-0" style={{
          background: "radial-gradient(ellipse at 80% 50%, rgba(56,189,248,0.04) 0%, transparent 50%)",
        }} />

        <div className="max-w-[1400px] mx-auto w-full grid lg:grid-cols-2 gap-20 items-center relative z-10">
          {/* Left — text */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="text-[10px] tracking-[0.2em] uppercase mb-4" style={{ color: "rgba(56,189,248,0.35)" }}>02 — Crew</p>
            <h2 className="text-[clamp(2rem,4vw,3.5rem)] font-extralight tracking-tight leading-[1.1] mb-8" style={{ color: "rgba(200,180,255,0.8)" }}>
              How many
              <br />people?
            </h2>

            {/* Big number display */}
            <div className="flex items-center gap-8 mb-10">
              <motion.button
                onClick={() => setPeople(Math.max(1, people - 1))}
                whileTap={{ scale: 0.85 }}
                className="w-14 h-14 border flex items-center justify-center text-xl transition-all hover:border-cyan-400/30"
                style={{ borderColor: "rgba(56,189,248,0.1)", color: "rgba(200,180,255,0.4)" }}
              >
                &minus;
              </motion.button>

              <motion.span
                key={people}
                initial={{ scale: 0.7, opacity: 0, filter: "blur(8px)" }}
                animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
                className="text-[clamp(5rem,10vw,8rem)] font-extralight leading-none"
                style={{ color: "rgba(56,189,248,0.7)" }}
              >
                {people}
              </motion.span>

              <motion.button
                onClick={() => setPeople(Math.min(30, people + 1))}
                whileTap={{ scale: 0.85 }}
                className="w-14 h-14 border flex items-center justify-center text-xl transition-all hover:border-cyan-400/30"
                style={{ borderColor: "rgba(56,189,248,0.1)", color: "rgba(200,180,255,0.4)" }}
              >
                +
              </motion.button>
            </div>

            <p className="text-[13px]" style={{ color: "rgba(56,189,248,0.25)" }}>
              {people === 1 ? "Solo adventure" : people <= 3 ? "Small group" : people <= 8 ? "Squad mode" : "Party time"}
            </p>
          </motion.div>

          {/* Right — avatar grid visualization */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="flex justify-center"
          >
            <div className="grid grid-cols-6 gap-3 max-w-[360px]">
              <AnimatePresence mode="popLayout">
                {[...Array(Math.min(people, 30))].map((_, i) => {
                  const hue = (i * 37 + 260) % 360;
                  return (
                    <motion.div
                      key={i}
                      initial={{ scale: 0, opacity: 0, rotate: -20 }}
                      animate={{ scale: 1, opacity: 1, rotate: 0 }}
                      exit={{ scale: 0, opacity: 0, rotate: 20 }}
                      transition={{ delay: i * 0.02, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                      className="aspect-square flex items-center justify-center text-[11px] font-medium"
                      style={{
                        background: `hsla(${hue}, 50%, 65%, 0.06)`,
                        color: `hsla(${hue}, 50%, 70%, 0.6)`,
                        border: `1px solid hsla(${hue}, 50%, 65%, 0.12)`,
                      }}
                    >
                      <motion.span
                        animate={{ opacity: [0.4, 0.8, 0.4] }}
                        transition={{ duration: 2, repeat: Infinity, delay: i * 0.1 }}
                      >
                        {i + 1}
                      </motion.span>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          MOOD — Full section
         ═══════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center py-32 px-8 md:px-12 border-t border-pink-500/[0.06]">
        <div className="absolute inset-0" style={{
          background: "radial-gradient(ellipse at 50% 30%, rgba(244,114,182,0.04) 0%, transparent 50%)",
        }} />

        <div className="max-w-[1400px] mx-auto w-full relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-center mb-16"
          >
            <p className="text-[10px] tracking-[0.2em] uppercase mb-4" style={{ color: "rgba(244,114,182,0.35)" }}>03 — Mood</p>
            <h2 className="text-[clamp(2rem,4vw,3.5rem)] font-extralight tracking-tight leading-[1.1]" style={{ color: "rgba(200,180,255,0.8)" }}>
              What&apos;s the vibe?
            </h2>
          </motion.div>

          {/* Mood grid — large cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 max-w-[900px] mx-auto">
            {moods.map((m, i) => {
              const isActive = mood === m.name.toLowerCase();
              return (
                <motion.button
                  key={m.name}
                  onClick={() => setMood(m.name.toLowerCase())}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  whileTap={{ scale: 0.96 }}
                  whileHover={{ borderColor: `hsla(${m.hue}, 50%, 60%, 0.25)` }}
                  className="relative p-6 md:p-8 text-center transition-all duration-500 overflow-hidden aspect-square flex flex-col items-center justify-center"
                  style={{
                    background: isActive ? `hsla(${m.hue}, 50%, 60%, 0.05)` : "transparent",
                    border: `1px solid ${isActive ? `hsla(${m.hue}, 50%, 60%, 0.25)` : "rgba(168,85,247,0.05)"}`,
                  }}
                >
                  {/* Background glow */}
                  {isActive && (
                    <motion.div
                      layoutId="mood-active"
                      className="absolute inset-0"
                      style={{ background: `radial-gradient(circle at center, hsla(${m.hue}, 60%, 60%, 0.06), transparent 70%)` }}
                      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    />
                  )}

                  {/* Corner accent */}
                  <span className="absolute top-0 left-0 w-4 h-[1px] transition-all duration-500"
                    style={{ background: isActive ? `hsla(${m.hue}, 50%, 60%, 0.4)` : "transparent" }} />
                  <span className="absolute top-0 left-0 w-[1px] h-4 transition-all duration-500"
                    style={{ background: isActive ? `hsla(${m.hue}, 50%, 60%, 0.4)` : "transparent" }} />
                  <span className="absolute bottom-0 right-0 w-4 h-[1px] transition-all duration-500"
                    style={{ background: isActive ? `hsla(${m.hue}, 50%, 60%, 0.4)` : "transparent" }} />
                  <span className="absolute bottom-0 right-0 w-[1px] h-4 transition-all duration-500"
                    style={{ background: isActive ? `hsla(${m.hue}, 50%, 60%, 0.4)` : "transparent" }} />

                  {/* Icon */}
                  <div className="w-16 h-16 md:w-20 md:h-20 mb-4 relative z-10">
                    <MoodIcon mood={m.name} hue={m.hue} active={isActive} />
                  </div>

                  <span
                    className="text-[11px] tracking-[0.15em] uppercase font-medium relative z-10 mb-1 transition-colors duration-300"
                    style={{ color: isActive ? `hsla(${m.hue}, 50%, 70%, 0.9)` : "rgba(168,85,247,0.2)" }}
                  >
                    {m.name}
                  </span>
                  <span
                    className="text-[10px] relative z-10 transition-colors duration-300"
                    style={{ color: isActive ? `hsla(${m.hue}, 40%, 60%, 0.4)` : "rgba(168,85,247,0.1)" }}
                  >
                    {m.desc}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          MATERIALS + LAUNCH
         ═══════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center py-32 px-8 md:px-12 border-t border-orange-500/[0.06]">
        <div className="absolute inset-0" style={{
          background: "radial-gradient(ellipse at 50% 60%, rgba(251,146,60,0.04) 0%, transparent 50%)",
        }} />

        <div className="max-w-[800px] mx-auto w-full relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-center mb-16"
          >
            <p className="text-[10px] tracking-[0.2em] uppercase mb-4" style={{ color: "rgba(251,146,60,0.35)" }}>04 — Materials</p>
            <h2 className="text-[clamp(2rem,4vw,3.5rem)] font-extralight tracking-tight leading-[1.1] mb-4" style={{ color: "rgba(200,180,255,0.8)" }}>
              What do you have?
            </h2>
            <p className="text-[13px]" style={{ color: "rgba(168,85,247,0.25)" }}>Optional — helps us find the perfect match</p>
          </motion.div>

          {/* Materials input */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 1 }}
            className="mb-8"
          >
            <input type="text" value={materialInput}
              onChange={(e) => setMaterialInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addMaterial(materialInput)}
              placeholder="Type and press enter..."
              className="w-full bg-transparent border px-6 py-4 text-[14px] outline-none transition-colors focus:border-orange-400/20 placeholder:text-purple-400/15"
              style={{ color: "rgba(200,180,255,0.8)", borderColor: "rgba(251,146,60,0.08)" }} />
          </motion.div>

          {/* Selected materials */}
          <AnimatePresence>
            {materials.length > 0 && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="flex flex-wrap gap-3 mb-8 overflow-hidden justify-center"
              >
                {materials.map((m) => (
                  <motion.span
                    key={m}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    onClick={() => setMaterials(materials.filter((x) => x !== m))}
                    className="px-4 py-2 text-[12px] cursor-pointer border transition-colors hover:border-orange-400/30"
                    style={{
                      color: "rgba(251,146,60,0.7)",
                      borderColor: "rgba(251,146,60,0.2)",
                      background: "rgba(251,146,60,0.04)",
                    }}
                  >
                    {m} &times;
                  </motion.span>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Suggestions */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap gap-3 mb-20 justify-center"
          >
            {materialSuggestions.filter((m) => !materials.includes(m)).map((m) => (
              <motion.button
                key={m}
                onClick={() => addMaterial(m)}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 text-[11px] border transition-all duration-300 hover:border-purple-400/20"
                style={{ color: "rgba(168,85,247,0.2)", borderColor: "rgba(168,85,247,0.06)" }}
              >
                + {m}
              </motion.button>
            ))}
          </motion.div>

          {/* Summary bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 1 }}
            className="border p-6 mb-8 flex items-center justify-between flex-wrap gap-4"
            style={{ borderColor: "rgba(168,85,247,0.08)", background: "rgba(168,85,247,0.02)" }}
          >
            {[
              { label: "Time", value: `${time} min`, color: "rgba(168,85,247,0.6)" },
              { label: "People", value: `${people}`, color: "rgba(56,189,248,0.6)" },
              { label: "Mood", value: mood, color: "rgba(244,114,182,0.6)" },
              { label: "Materials", value: `${materials.length}`, color: "rgba(251,146,60,0.6)" },
            ].map((s) => (
              <div key={s.label} className="text-center flex-1">
                <p className="text-[9px] tracking-[0.15em] uppercase mb-1" style={{ color: "rgba(168,85,247,0.2)" }}>{s.label}</p>
                <p className="text-[14px] font-light capitalize" style={{ color: s.color }}>{s.value}</p>
              </div>
            ))}
          </motion.div>

          {/* Launch buttons */}
          <div className="space-y-4">
            <motion.button
              onClick={getRecommendations}
              whileTap={{ scale: 0.97 }}
              whileHover={{ boxShadow: "0 0 50px rgba(168,85,247,0.15)", borderColor: "rgba(168,85,247,0.4)" }}
              className="w-full py-5 text-[13px] tracking-[0.2em] uppercase font-medium border transition-all duration-500"
              style={{
                color: "rgba(200,180,255,0.9)",
                borderColor: "rgba(168,85,247,0.25)",
                background: "rgba(168,85,247,0.06)",
              }}
            >
              {isLoading ? (
                <motion.span animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                  Analyzing your vibe...
                </motion.span>
              ) : "Get Recommendations"}
            </motion.button>
            <motion.button
              onClick={generateIdeas}
              whileTap={{ scale: 0.97 }}
              whileHover={{ borderColor: "rgba(56,189,248,0.2)" }}
              className="w-full py-5 text-[13px] tracking-[0.2em] uppercase font-medium border transition-all duration-500"
              style={{ color: "rgba(56,189,248,0.4)", borderColor: "rgba(56,189,248,0.08)" }}
            >
              Surprise Me
            </motion.button>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          RESULTS
         ═══════════════════════════════════════ */}
      <AnimatePresence>
        {(isLoading || recommendations.length > 0 || generatedIdeas.length > 0) && (
          <section className="py-32 px-8 md:px-12 border-t border-purple-500/[0.06]">
            <div className="max-w-[1400px] mx-auto">

              {/* Loading */}
              <AnimatePresence mode="wait">
                {isLoading && (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center gap-10 py-20"
                  >
                    <div className="relative w-36 h-36">
                      <motion.div animate={{ rotate: 360 }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 rounded-full"
                        style={{ border: "1px solid rgba(168,85,247,0.15)", borderTopColor: "rgba(168,85,247,0.6)" }} />
                      <motion.div animate={{ rotate: -360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-4 rounded-full"
                        style={{ border: "1px solid rgba(56,189,248,0.1)", borderBottomColor: "rgba(56,189,248,0.5)" }} />
                      <motion.div animate={{ rotate: 360 }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-8 rounded-full"
                        style={{ border: "1px solid rgba(244,114,182,0.1)", borderLeftColor: "rgba(244,114,182,0.4)" }} />
                      <motion.div
                        animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.2, 0.5, 0.2] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute inset-12 rounded-full bg-purple-400/10" />
                    </div>
                    <motion.p animate={{ opacity: [0.3, 0.7, 0.3] }} transition={{ duration: 2, repeat: Infinity }}
                      className="text-[14px]" style={{ color: "rgba(168,85,247,0.5)" }}>
                      Analyzing your vibe...
                    </motion.p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Recommendations */}
              {!isLoading && recommendations.length > 0 && (
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="mb-24">
                  <p className="text-[10px] tracking-[0.2em] uppercase mb-3" style={{ color: "rgba(168,85,247,0.35)" }}>Results</p>
                  <h2 className="text-[clamp(1.5rem,3vw,2.5rem)] font-extralight tracking-tight mb-14" style={{ color: "rgba(200,180,255,0.7)" }}>
                    Recommended for you
                  </h2>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-14">
                    {recommendations.map((a, i) => <ActivityCard key={a.id} activity={a} index={i} variant="dark" />)}
                  </div>
                </motion.div>
              )}

              {/* Generated ideas */}
              {!isLoading && generatedIdeas.length > 0 && (
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
                  <p className="text-[10px] tracking-[0.2em] uppercase mb-3" style={{ color: "rgba(56,189,248,0.35)" }}>AI Generated</p>
                  <h2 className="text-[clamp(1.5rem,3vw,2.5rem)] font-extralight tracking-tight mb-14" style={{ color: "rgba(200,180,255,0.7)" }}>
                    Fresh ideas for you
                  </h2>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-14">
                    {generatedIdeas.map((a, i) => <ActivityCard key={a.id} activity={a} index={i} variant="dark" />)}
                  </div>
                </motion.div>
              )}
            </div>
          </section>
        )}
      </AnimatePresence>
    </div>
  );
}
