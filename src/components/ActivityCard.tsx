"use client";

import { motion } from "framer-motion";
import { Activity } from "@/data/activities";
import ActivityAnimation from "./ActivityAnimation";

interface ActivityCardProps {
  activity: Activity & { score?: number; matchReasons?: string[] };
  index: number;
  onClick?: () => void;
  variant?: "dark" | "light";
}

/* Generate a unique gradient from the activity name */
function getGradient(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const h1 = Math.abs(hash % 360);
  const h2 = (h1 + 30 + Math.abs((hash >> 8) % 40)) % 360;
  const angle = Math.abs((hash >> 4) % 360);
  return `linear-gradient(${angle}deg, hsl(${h1}, 35%, 12%), hsl(${h2}, 30%, 8%))`;
}

function getAccentHsl(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const h = Math.abs(hash % 360);
  return `hsl(${h}, 50%, 65%)`;
}

export default function ActivityCard({ activity, index, onClick, variant = "dark" }: ActivityCardProps) {
  const isDark = variant === "dark";
  const gradient = getGradient(activity.name);
  const accent = getAccentHsl(activity.name);

  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ delay: index * 0.08, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      onClick={onClick}
      className="group cursor-pointer"
    >
      {/* Animated visual */}
      <div
        className="relative aspect-[3/4] overflow-hidden mb-5"
        style={{ background: gradient }}
      >
        {/* Activity-specific animation */}
        <div className="absolute inset-0 flex items-center justify-center p-6" style={{ color: accent }}>
          <ActivityAnimation name={activity.name} index={index} />
        </div>

        {/* Fun score bar */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-purple-400/[0.06]">
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: `${activity.funScore * 10}%` }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 + index * 0.1, duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            className="h-full"
            style={{ background: accent, opacity: 0.5 }}
          />
        </div>
      </div>

      {/* Label */}
      <p className={`label mb-2 ${isDark ? "text-purple-400/40" : "text-purple-500/40"}`}>
        {activity.category}
      </p>

      {/* Title */}
      <h3 className={`title mb-2 text-[clamp(1rem,2vw,1.5rem)] ${isDark ? "text-purple-200" : "text-[#0c0c0c]"}`}>
        {activity.name}
      </h3>

      {/* Meta */}
      <p className={`body-sm ${isDark ? "text-purple-300/40" : "text-black/40"}`}>
        {activity.minPeople}–{activity.maxPeople} people &nbsp;/&nbsp; {activity.minTime}–{activity.maxTime} min
      </p>
    </motion.div>
  );
}
