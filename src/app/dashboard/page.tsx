"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useCallback } from "react";
import { funAI, RecommendationQuery } from "@/lib/ai-engine";
import { Activity } from "@/data/activities";
import ActivityCard from "@/components/ActivityCard";
import dynamic from "next/dynamic";

const ConstellationNetwork = dynamic(() => import("@/components/animations/ConstellationNetwork"), { ssr: false });

const moods = [
  { name: "Excited", hue: 45 },
  { name: "Relaxed", hue: 200 },
  { name: "Creative", hue: 300 },
  { name: "Social", hue: 160 },
  { name: "Adventurous", hue: 25 },
  { name: "Silly", hue: 330 },
];

/* Animated SVG icons for each mood */
function MoodIcon({ mood, hue, active }: { mood: string; hue: number; active: boolean }) {
  const color = `hsla(${hue}, 60%, ${active ? 65 : 65}%, ${active ? 0.9 : 0.3})`;
  const icons: Record<string, React.ReactNode> = {
    Excited: (
      <svg viewBox="0 0 40 40" className="w-8 h-8">
        <motion.polygon points="20,4 24,16 36,16 26,24 30,36 20,28 10,36 14,24 4,16 16,16"
          stroke={color} strokeWidth="1.5" fill="none"
          animate={active ? { scale: [1, 1.15, 1], rotate: [0, 8, -8, 0] } : {}}
          transition={{ duration: 1.5, repeat: Infinity }}
          style={{ transformOrigin: "20px 20px" }} />
        <motion.circle cx="20" cy="20" r="3" fill={color} opacity={active ? 0.5 : 0.2}
          animate={active ? { scale: [1, 1.4, 1] } : {}}
          transition={{ duration: 1, repeat: Infinity }} />
      </svg>
    ),
    Relaxed: (
      <svg viewBox="0 0 40 40" className="w-8 h-8">
        {[0, 1, 2].map((i) => (
          <motion.path key={i}
            d={`M2 ${18 + i * 6} Q10 ${14 + i * 6} 20 ${18 + i * 6} Q30 ${22 + i * 6} 38 ${18 + i * 6}`}
            stroke={color} strokeWidth="1.2" fill="none"
            animate={active ? { d: [`M2 ${18 + i * 6} Q10 ${14 + i * 6} 20 ${18 + i * 6} Q30 ${22 + i * 6} 38 ${18 + i * 6}`, `M2 ${18 + i * 6} Q10 ${22 + i * 6} 20 ${18 + i * 6} Q30 ${14 + i * 6} 38 ${18 + i * 6}`] } : {}}
            transition={{ duration: 2 + i * 0.3, repeat: Infinity, repeatType: "reverse" }} />
        ))}
      </svg>
    ),
    Creative: (
      <svg viewBox="0 0 40 40" className="w-8 h-8">
        <motion.circle cx="14" cy="22" r="6" stroke={color} strokeWidth="1.2" fill="none"
          animate={active ? { r: [6, 7, 6] } : {}} transition={{ duration: 2, repeat: Infinity }} />
        <motion.rect x="22" y="16" width="12" height="12" stroke={color} strokeWidth="1.2" fill="none"
          animate={active ? { rotate: [0, 15, 0] } : {}} transition={{ duration: 3, repeat: Infinity }}
          style={{ transformOrigin: "28px 22px" }} />
        <motion.polygon points="20,6 23,12 17,12" stroke={color} strokeWidth="1" fill="none"
          animate={active ? { y: [0, -2, 0] } : {}} transition={{ duration: 1.5, repeat: Infinity }} />
      </svg>
    ),
    Social: (
      <svg viewBox="0 0 40 40" className="w-8 h-8">
        <motion.circle cx="15" cy="16" r="5" stroke={color} strokeWidth="1.2" fill="none"
          animate={active ? { cx: [15, 17, 15] } : {}} transition={{ duration: 2, repeat: Infinity }} />
        <motion.circle cx="27" cy="16" r="5" stroke={color} strokeWidth="1.2" fill="none"
          animate={active ? { cx: [27, 25, 27] } : {}} transition={{ duration: 2, repeat: Infinity }} />
        <motion.path d="M8 30 Q15 24 21 30" stroke={color} strokeWidth="1" fill="none" />
        <motion.path d="M19 30 Q27 24 34 30" stroke={color} strokeWidth="1" fill="none" />
        {active && <motion.line x1="18" y1="18" x2="24" y2="18" stroke={color} strokeWidth="0.8"
          animate={{ opacity: [0, 0.6, 0] }} transition={{ duration: 1.5, repeat: Infinity }} />}
      </svg>
    ),
    Adventurous: (
      <svg viewBox="0 0 40 40" className="w-8 h-8">
        <motion.polygon points="20,6 6,34 34,34" stroke={color} strokeWidth="1.2" fill="none"
          animate={active ? { scale: [1, 1.05, 1] } : {}} transition={{ duration: 2, repeat: Infinity }}
          style={{ transformOrigin: "20px 24px" }} />
        <motion.polygon points="20,14 12,30 28,30" stroke={color} strokeWidth="0.8" fill="none" opacity="0.4" />
        {active && <motion.circle cx="20" cy="10" r="1.5" fill={color}
          animate={{ cy: [10, 6, 10], opacity: [0.6, 0, 0.6] }}
          transition={{ duration: 2, repeat: Infinity }} />}
      </svg>
    ),
    Silly: (
      <svg viewBox="0 0 40 40" className="w-8 h-8">
        <motion.circle cx="20" cy="20" r="12" stroke={color} strokeWidth="1.2" fill="none"
          animate={active ? { scale: [1, 1.08, 0.95, 1] } : {}}
          transition={{ duration: 1.5, repeat: Infinity }}
          style={{ transformOrigin: "20px 20px" }} />
        <circle cx="15" cy="17" r="1.5" fill={color} opacity="0.6" />
        <circle cx="25" cy="17" r="1.5" fill={color} opacity="0.6" />
        <motion.path d="M13 24 Q17 30 20 24 Q23 30 27 24" stroke={color} strokeWidth="1.2" fill="none"
          animate={active ? { d: ["M13 24 Q17 30 20 24 Q23 30 27 24", "M13 25 Q17 28 20 25 Q23 28 27 25"] } : {}}
          transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }} />
      </svg>
    ),
  };
  return <>{icons[mood] || null}</>;
}

const materialSuggestions = ["Smartphone", "Cards", "Board games", "Blankets", "Speaker", "Ball", "Paper", "Snacks"];

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
      {/* Hero header with constellation */}
      <section className="relative pt-32 pb-24 px-8 md:px-12 overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <ConstellationNetwork />
        </div>
        {/* Gradient overlay */}
        <div className="absolute inset-0" style={{
          background: "radial-gradient(ellipse at 30% 50%, rgba(168,85,247,0.08) 0%, transparent 60%), radial-gradient(ellipse at 70% 30%, rgba(56,189,248,0.06) 0%, transparent 50%)",
        }} />

        <div className="max-w-[1400px] mx-auto relative z-10">
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="label mb-6" style={{ color: "rgba(139,92,246,0.4)" }}>AI Engine</motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }}
            className="text-[clamp(2.5rem,6vw,5rem)] font-extralight tracking-tight leading-[1.05]"
            style={{ color: "rgba(200,180,255,0.9)" }}
          >
            What are you
            <br />in the mood for?
          </motion.h1>
        </div>
      </section>

      {/* Controls + Results — all dark */}
      <section className="px-8 md:px-12 pb-32">
        <div className="max-w-[1400px] mx-auto grid lg:grid-cols-[440px_1fr] gap-16 lg:gap-20">

          {/* Controls panel */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <div className="lg:sticky lg:top-28 space-y-10">

              {/* Time */}
              <div className="p-6 border border-purple-500/[0.08] relative overflow-hidden">
                {/* Subtle glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/[0.03] to-transparent" />
                <div className="relative z-10">
                  <span className="label block mb-5" style={{ color: "rgba(168,85,247,0.4)" }}>Time</span>
                  <div className="flex items-center gap-6">
                    <div className="relative w-24 h-24 shrink-0">
                      <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                        <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(168,85,247,0.08)" strokeWidth="3" />
                        <motion.circle
                          cx="50" cy="50" r="42" fill="none"
                          stroke="rgba(168,85,247,0.6)"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeDasharray={`${timePercent * 2.64} 264`}
                          initial={false}
                          animate={{ strokeDasharray: `${timePercent * 2.64} 264` }}
                          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <motion.span
                          key={time}
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="text-2xl font-light"
                          style={{ color: "rgba(200,180,255,0.9)" }}
                        >
                          {time}
                        </motion.span>
                        <span className="text-[9px] tracking-wider uppercase" style={{ color: "rgba(168,85,247,0.3)" }}>min</span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-[12px] mb-3" style={{ color: "rgba(168,85,247,0.3)" }}>minutes available</p>
                      <input type="range" min={15} max={480} step={15} value={time} onChange={(e) => setTime(Number(e.target.value))}
                        className="w-full h-[2px] appearance-none bg-purple-500/10 outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-purple-400 [&::-webkit-slider-thumb]:shadow-[0_0_12px_rgba(168,85,247,0.5)]" />
                      <div className="flex justify-between mt-2">
                        <span className="text-[10px]" style={{ color: "rgba(168,85,247,0.2)" }}>15m</span>
                        <span className="text-[10px]" style={{ color: "rgba(168,85,247,0.2)" }}>8h</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* People */}
              <div className="p-6 border border-cyan-500/[0.08] relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/[0.02] to-transparent" />
                <div className="relative z-10">
                  <span className="label block mb-5" style={{ color: "rgba(56,189,248,0.4)" }}>People</span>
                  <div className="flex items-center gap-5">
                    <motion.button
                      onClick={() => setPeople(Math.max(1, people - 1))}
                      whileTap={{ scale: 0.85 }}
                      className="w-10 h-10 border border-purple-500/10 flex items-center justify-center transition-all hover:border-purple-400/30"
                      style={{ color: "rgba(200,180,255,0.4)" }}
                    >
                      &minus;
                    </motion.button>

                    <div className="flex-1 flex items-center gap-2 flex-wrap min-h-[48px]">
                      <AnimatePresence mode="popLayout">
                        {[...Array(Math.min(people, 12))].map((_, i) => {
                          const hue = (i * 37 + 260) % 360;
                          return (
                            <motion.div
                              key={i}
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              exit={{ scale: 0, opacity: 0 }}
                              transition={{ delay: i * 0.03, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                              className="w-9 h-9 flex items-center justify-center text-[10px] font-medium"
                              style={{
                                background: `hsla(${hue}, 50%, 65%, 0.08)`,
                                color: `hsla(${hue}, 50%, 70%, 0.7)`,
                                border: `1px solid hsla(${hue}, 50%, 65%, 0.15)`,
                              }}
                            >
                              {i + 1}
                            </motion.div>
                          );
                        })}
                        {people > 12 && (
                          <motion.span key="more" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                            className="text-sm" style={{ color: "rgba(56,189,248,0.4)" }}>
                            +{people - 12}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </div>

                    <motion.button
                      onClick={() => setPeople(Math.min(30, people + 1))}
                      whileTap={{ scale: 0.85 }}
                      className="w-10 h-10 border border-purple-500/10 flex items-center justify-center transition-all hover:border-purple-400/30"
                      style={{ color: "rgba(200,180,255,0.4)" }}
                    >
                      +
                    </motion.button>
                  </div>
                </div>
              </div>

              {/* Mood */}
              <div className="p-6 border border-pink-500/[0.08] relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-pink-500/[0.02] to-transparent" />
                <div className="relative z-10">
                  <span className="label block mb-5" style={{ color: "rgba(244,114,182,0.4)" }}>Mood</span>
                  <div className="grid grid-cols-3 gap-3">
                    {moods.map((m) => {
                      const isActive = mood === m.name.toLowerCase();
                      return (
                        <motion.button
                          key={m.name}
                          onClick={() => setMood(m.name.toLowerCase())}
                          whileTap={{ scale: 0.93 }}
                          className="relative py-5 px-3 text-center transition-all duration-300 overflow-hidden"
                          style={{
                            background: isActive ? `hsla(${m.hue}, 50%, 60%, 0.06)` : "transparent",
                            border: `1px solid ${isActive ? `hsla(${m.hue}, 50%, 60%, 0.25)` : "rgba(168,85,247,0.06)"}`,
                          }}
                        >
                          {isActive && (
                            <motion.div
                              layoutId="mood-glow"
                              className="absolute inset-0"
                              style={{ background: `radial-gradient(circle at center, hsla(${m.hue}, 60%, 60%, 0.06), transparent 70%)` }}
                              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                            />
                          )}
                          <span className="block mb-2 flex justify-center relative z-10">
                            <MoodIcon mood={m.name} hue={m.hue} active={isActive} />
                          </span>
                          <span
                            className="text-[10px] tracking-[0.12em] uppercase font-medium relative z-10"
                            style={{ color: isActive ? `hsla(${m.hue}, 50%, 70%, 0.9)` : "rgba(168,85,247,0.25)" }}
                          >
                            {m.name}
                          </span>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Materials */}
              <div className="p-6 border border-orange-500/[0.08] relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/[0.02] to-transparent" />
                <div className="relative z-10">
                  <span className="label block mb-4" style={{ color: "rgba(251,146,60,0.4)" }}>Materials</span>
                  <input type="text" value={materialInput}
                    onChange={(e) => setMaterialInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addMaterial(materialInput)}
                    placeholder="Add what you have..."
                    className="w-full bg-transparent border border-purple-500/[0.08] px-4 py-3 text-[13px] outline-none transition-colors focus:border-purple-400/25 placeholder:text-purple-400/20"
                    style={{ color: "rgba(200,180,255,0.8)" }} />
                  <AnimatePresence>
                    {materials.length > 0 && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="flex flex-wrap gap-2 mt-3 overflow-hidden"
                      >
                        {materials.map((m) => (
                          <motion.span
                            key={m}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            onClick={() => setMaterials(materials.filter((x) => x !== m))}
                            className="px-3 py-1 text-[11px] cursor-pointer border transition-colors hover:border-purple-400/30"
                            style={{
                              color: "rgba(200,180,255,0.7)",
                              borderColor: "rgba(168,85,247,0.2)",
                              background: "rgba(168,85,247,0.06)",
                            }}
                          >
                            {m} &times;
                          </motion.span>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3">
                    {materialSuggestions.filter((m) => !materials.includes(m)).slice(0, 5).map((m) => (
                      <button key={m} onClick={() => addMaterial(m)}
                        className="text-[11px] transition-colors hover:text-purple-300/50"
                        style={{ color: "rgba(168,85,247,0.2)" }}>+ {m}</button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-4 pt-2">
                <motion.button
                  onClick={getRecommendations}
                  whileTap={{ scale: 0.97 }}
                  whileHover={{ boxShadow: "0 0 40px rgba(168,85,247,0.15)" }}
                  className="w-full py-4 text-[12px] tracking-[0.15em] uppercase font-medium border transition-all duration-300"
                  style={{
                    color: "rgba(200,180,255,0.9)",
                    borderColor: "rgba(168,85,247,0.3)",
                    background: "rgba(168,85,247,0.06)",
                  }}
                >
                  {isLoading ? (
                    <motion.span
                      animate={{ opacity: [0.4, 1, 0.4] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                    >
                      Thinking...
                    </motion.span>
                  ) : "Get Recommendations"}
                </motion.button>
                <motion.button
                  onClick={generateIdeas}
                  whileTap={{ scale: 0.97 }}
                  className="w-full py-4 text-[12px] tracking-[0.15em] uppercase font-medium border transition-all duration-300 hover:border-cyan-400/20"
                  style={{
                    color: "rgba(56,189,248,0.5)",
                    borderColor: "rgba(56,189,248,0.1)",
                  }}
                >
                  Surprise Me
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Results */}
          <div>
            <AnimatePresence mode="wait">
              {isLoading && (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center gap-8 py-32"
                >
                  {/* Loading animation */}
                  <div className="relative w-32 h-32">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-0 rounded-full"
                      style={{ border: "1px solid rgba(168,85,247,0.15)", borderTopColor: "rgba(168,85,247,0.6)" }}
                    />
                    <motion.div
                      animate={{ rotate: -360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-3 rounded-full"
                      style={{ border: "1px solid rgba(56,189,248,0.1)", borderBottomColor: "rgba(56,189,248,0.5)" }}
                    />
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-6 rounded-full"
                      style={{ border: "1px solid rgba(244,114,182,0.1)", borderLeftColor: "rgba(244,114,182,0.4)" }}
                    />
                    <motion.div
                      animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.2, 0.5, 0.2] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      className="absolute inset-10 rounded-full bg-purple-400/10"
                    />
                    {[0, 1, 2].map((d) => (
                      <motion.div
                        key={d}
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2 + d, repeat: Infinity, ease: "linear", delay: d * 0.3 }}
                        className="absolute inset-0"
                        style={{ transformOrigin: "center" }}
                      >
                        <div
                          className="absolute w-2 h-2 rounded-full"
                          style={{
                            top: `${5 + d * 12}%`,
                            left: "50%",
                            transform: "translateX(-50%)",
                            background: `hsla(${260 + d * 40}, 60%, 65%, 0.5)`,
                            boxShadow: `0 0 8px hsla(${260 + d * 40}, 60%, 65%, 0.3)`,
                          }}
                        />
                      </motion.div>
                    ))}
                  </div>
                  <div className="text-center">
                    <motion.p
                      animate={{ opacity: [0.3, 0.7, 0.3] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="text-[13px]"
                      style={{ color: "rgba(168,85,247,0.5)" }}
                    >
                      Analyzing your vibe...
                    </motion.p>
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="text-[11px] mt-2"
                      style={{ color: "rgba(168,85,247,0.2)" }}
                    >
                      {people} people · {time} min · {mood}
                    </motion.p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {!isLoading && recommendations.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-20"
              >
                <p className="label mb-10" style={{ color: "rgba(168,85,247,0.35)" }}>Recommended for you</p>
                <div className="grid grid-cols-2 gap-x-6 gap-y-14">
                  {recommendations.map((a, i) => <ActivityCard key={a.id} activity={a} index={i} variant="dark" />)}
                </div>
              </motion.div>
            )}

            {!isLoading && generatedIdeas.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <p className="label mb-10" style={{ color: "rgba(56,189,248,0.4)" }}>AI Generated</p>
                <div className="grid grid-cols-2 gap-x-6 gap-y-14">
                  {generatedIdeas.map((a, i) => <ActivityCard key={a.id} activity={a} index={i} variant="dark" />)}
                </div>
              </motion.div>
            )}

            {!isLoading && !hasSearched && (
              <div className="py-28 flex flex-col items-center">
                {/* Idle state — orbital animation */}
                <motion.div className="relative w-40 h-40 mb-10">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 rounded-full"
                    style={{ border: "1px solid rgba(168,85,247,0.08)" }}
                  />
                  <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-5 rounded-full"
                    style={{ border: "1px solid rgba(56,189,248,0.06)" }}
                  />
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-10 rounded-full"
                    style={{ border: "1px solid rgba(244,114,182,0.08)" }}
                  />
                  <motion.div
                    animate={{ scale: [0.8, 1.1, 0.8], opacity: [0.05, 0.15, 0.05] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute inset-14 rounded-full bg-purple-400/10"
                  />
                  {/* Orbiting dots */}
                  {[
                    { color: "rgba(168,85,247,0.4)", dur: 8, offset: 0 },
                    { color: "rgba(56,189,248,0.4)", dur: 12, offset: 20 },
                    { color: "rgba(244,114,182,0.4)", dur: 16, offset: 40 },
                  ].map((dot, i) => (
                    <motion.div
                      key={i}
                      animate={{ rotate: 360 }}
                      transition={{ duration: dot.dur, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-0"
                    >
                      <div
                        className="absolute w-1.5 h-1.5 rounded-full"
                        style={{
                          top: `${dot.offset}%`,
                          left: "50%",
                          transform: "translateX(-50%)",
                          background: dot.color,
                          boxShadow: `0 0 6px ${dot.color}`,
                        }}
                      />
                    </motion.div>
                  ))}
                </motion.div>
                <p className="text-[clamp(1.1rem,2vw,1.5rem)] font-light tracking-wide" style={{ color: "rgba(200,180,255,0.2)" }}>
                  Set your preferences,
                </p>
                <p className="text-[clamp(1.1rem,2vw,1.5rem)] font-light tracking-wide" style={{ color: "rgba(200,180,255,0.2)" }}>
                  then let the AI cook.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
