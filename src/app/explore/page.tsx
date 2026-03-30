"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo } from "react";
import { seedActivities, categories, Activity } from "@/data/activities";
import ActivityCard from "@/components/ActivityCard";
import dynamic from "next/dynamic";

const ConstellationNetwork = dynamic(() => import("@/components/animations/ConstellationNetwork"), { ssr: false });

function getGradient(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const h1 = Math.abs(hash % 360);
  const h2 = (h1 + 40 + Math.abs((hash >> 8) % 60)) % 360;
  const angle = Math.abs((hash >> 4) % 360);
  return `linear-gradient(${angle}deg, hsl(${h1}, 30%, 15%), hsl(${h2}, 25%, 10%))`;
}

function getAccentHsl(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const h = Math.abs(hash % 360);
  return `hsl(${h}, 50%, 65%)`;
}

export default function ExplorePage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);

  const filtered = useMemo(() => {
    let results = [...seedActivities];
    if (search) {
      const q = search.toLowerCase();
      results = results.filter((a) => a.name.toLowerCase().includes(q) || a.description.toLowerCase().includes(q) || a.tags.some((t) => t.includes(q)));
    }
    if (selectedCategory) results = results.filter((a) => a.category === selectedCategory);
    return results.sort((a, b) => b.funScore - a.funScore);
  }, [search, selectedCategory]);

  return (
    <div className="min-h-screen">
      {/* Hero with constellation */}
      <section className="section-dark pt-32 pb-20 px-8 md:px-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-40">
          <ConstellationNetwork />
        </div>
        <div className="max-w-[1400px] mx-auto relative z-10">
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}
            className="label mb-6" style={{ color: "rgba(139,92,246,0.4)" }}>
            Browse
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }}
            className="headline mb-12"
            style={{ color: "rgba(200,180,255,0.9)" }}
          >
            Discover your next obsession
          </motion.h1>

          {/* Search */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="max-w-md mb-10">
            <input
              type="text"
              placeholder="Search activities..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input"
            />
          </motion.div>

          {/* Categories */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="flex gap-3 scroll-x pb-2">
            <button onClick={() => setSelectedCategory(null)} className={`chip ${!selectedCategory ? "active" : ""}`}>All</button>
            {categories.map((cat) => (
              <button key={cat} onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
                className={`chip whitespace-nowrap ${selectedCategory === cat ? "active" : ""}`}>
                {cat}
              </button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Grid */}
      <section className="section-light py-20 md:py-32 px-8 md:px-12">
        <div className="max-w-[1400px] mx-auto">
          <p className="label mb-10" style={{ color: "rgba(168,85,247,0.35)" }}>{filtered.length} activities</p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-14">
            {filtered.map((activity, i) => (
              <ActivityCard key={activity.id} activity={activity} index={i} variant="light" onClick={() => setSelectedActivity(activity)} />
            ))}
          </div>
          {filtered.length === 0 && (
            <div className="py-20 text-center">
              <p className="title text-black/20">Nothing matches your search.</p>
            </div>
          )}
        </div>
      </section>

      {/* Modal */}
      <AnimatePresence>
        {selectedActivity && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-6" onClick={() => setSelectedActivity(null)}>
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.95 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] as const }}
              className="bg-[#1a1a1a] max-w-xl w-full max-h-[85vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative aspect-video overflow-hidden" style={{ background: getGradient(selectedActivity.name) }}>
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="w-32 h-32 rounded-full border"
                    style={{ borderColor: getAccentHsl(selectedActivity.name).replace("65%", "25%") }}
                  />
                  <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    className="absolute w-20 h-20 border"
                    style={{ borderColor: getAccentHsl(selectedActivity.name).replace("65%", "30%") }}
                  />
                  <motion.div
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute w-4 h-4 rounded-full"
                    style={{ background: getAccentHsl(selectedActivity.name).replace("65%", "50%") }}
                  />
                </div>
                <div className="absolute bottom-4 left-6">
                  <span className="text-[5rem] font-extralight leading-none" style={{ color: getAccentHsl(selectedActivity.name).replace("65%", "15%") }}>
                    {selectedActivity.category.charAt(0)}
                  </span>
                </div>
                <button onClick={() => setSelectedActivity(null)}
                  className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-xl bg-black/40 backdrop-blur"
                  style={{ color: "rgba(168,85,247,0.6)" }}>&times;</button>
              </div>
              <div className="p-8">
                <p className="label mb-3" style={{ color: "rgba(139,92,246,0.4)" }}>{selectedActivity.category}</p>
                <h2 className="title mb-4" style={{ color: "rgba(200,180,255,0.9)" }}>{selectedActivity.name}</h2>
                <p className="body mb-8" style={{ color: "rgba(168,85,247,0.4)" }}>{selectedActivity.description}</p>
                <div className="grid grid-cols-2 gap-6 mb-8">
                  {[
                    { l: "People", v: `${selectedActivity.minPeople}–${selectedActivity.maxPeople}` },
                    { l: "Time", v: `${selectedActivity.minTime}–${selectedActivity.maxTime} min` },
                    { l: "Energy", v: selectedActivity.energy },
                    { l: "Cost", v: selectedActivity.cost },
                  ].map((d) => (
                    <div key={d.l}>
                      <p className="label mb-1" style={{ color: "rgba(168,85,247,0.25)" }}>{d.l}</p>
                      <p className="body-sm capitalize" style={{ color: "rgba(200,180,255,0.8)" }}>{d.v}</p>
                    </div>
                  ))}
                </div>
                {selectedActivity.materials.length > 0 && (
                  <div>
                    <p className="label mb-2" style={{ color: "rgba(168,85,247,0.25)" }}>Materials</p>
                    <p className="body-sm" style={{ color: "rgba(200,180,255,0.5)" }}>{selectedActivity.materials.join(", ")}</p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
